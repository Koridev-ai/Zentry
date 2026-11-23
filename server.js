const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_HISTORY = 500;
const INVITE_FILE = path.join(__dirname, 'invite.json');
const AVATAR_FILE = path.join(__dirname, 'group-avatar.jpg');
const MEMBERS_FILE = path.join(__dirname, 'members.json');
let avatarVersion = fs.existsSync(AVATAR_FILE) ? Math.floor(fs.statSync(AVATAR_FILE).mtimeMs) : 0;

function loadInvite() {
  if (process.env.INVITE_CODE) return process.env.INVITE_CODE;
  try {
    const saved = JSON.parse(fs.readFileSync(INVITE_FILE, 'utf8')).code;
    if (saved) return saved;
  } catch {}
  const code = crypto.randomBytes(5).toString('hex');
  fs.writeFileSync(INVITE_FILE, JSON.stringify({ code }));
  return code;
}

const INVITE_CODE = loadInvite();

function loadMembers() {
  try {
    const saved = JSON.parse(fs.readFileSync(MEMBERS_FILE, 'utf8'));
    if (Array.isArray(saved)) return new Map(saved.filter(item => item && item.name).map(item => [item.name, item.joined || Date.now()]));
  } catch {}
  return new Map();
}

const members = loadMembers();

function saveMembers() {
  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify([...members].map(([name, joined]) => ({ name, joined }))));
  } catch {}
}

function memberList() {
  return [...members.keys()]
    .map(name => ({ name, online: online.has(name) }))
    .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
}

function validInvite(code) {
  return typeof code === 'string' && code === INVITE_CODE;
}

let publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

function getBaseUrls() {
  if (publicUrl) return [publicUrl];
  const urls = [];
  try {
    for (const list of Object.values(os.networkInterfaces())) {
      for (const item of list || []) {
        if (item.family === 'IPv4' && !item.internal) urls.push(`http://${item.address}:${PORT}`);
      }
    }
  } catch {}
  return urls;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const messages = [];
const clients = new Map();
const online = new Map();
const pendingLeave = new Map();
const LEAVE_DELAY = 5000;
let nextId = 1;

function broadcast(message) {
  const payload = `data: ${JSON.stringify(message)}\n\n`;
  for (const res of clients.keys()) res.write(payload);
}

function pushMessage(message) {
  messages.push(message);
  if (messages.length > MAX_HISTORY) messages.shift();
  broadcast(message);
}

function announce(text) {
  pushMessage({ id: nextId++, system: true, text, time: Date.now() });
}

function broadcastPresence() {
  const payload = `event: presence\ndata: ${JSON.stringify({ online: online.size, members: memberList() })}\n\n`;
  for (const res of clients.keys()) res.write(payload);
}

function groupPayload() {
  return `event: group\ndata: ${JSON.stringify({ avatar: avatarVersion })}\n\n`;
}

function broadcastGroup() {
  const payload = groupPayload();
  for (const res of clients.keys()) res.write(payload);
}

function userConnected(user) {
  const pending = pendingLeave.get(user);
  if (pending) {
    clearTimeout(pending);
    pendingLeave.delete(user);
  }
  const count = online.get(user) || 0;
  online.set(user, count + 1);
  if (!members.has(user)) {
    members.set(user, Date.now());
    saveMembers();
  }
  if (count === 0 && !pending) announce(`${user} entró al chat`);
  broadcastPresence();
}

function userDisconnected(user) {
  const count = (online.get(user) || 1) - 1;
  if (count > 0) {
    online.set(user, count);
    return;
  }
  online.delete(user);
  broadcastPresence();
  pendingLeave.set(user, setTimeout(() => {
    pendingLeave.delete(user);
    announce(`${user} salió del chat`);
  }, LEAVE_DELAY));
}

function readBody(req, limit = 10000) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error('too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0];
  const relative = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const filePath = path.normalize(path.join(PUBLIC_DIR, relative));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const type = MIME[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url.split('?')[0] === '/api/events') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) {
      res.writeHead(403);
      return res.end('invite');
    }
    const user = (params.get('user') || '').trim().slice(0, 30);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write('retry: 2000\n\n');
    clients.set(res, user);
    res.write(groupPayload());
    if (user) userConnected(user);
    req.on('close', () => {
      clients.delete(res);
      if (user) userDisconnected(user);
    });
    return;
  }

  if (req.method === 'GET' && req.url.split('?')[0] === '/api/history') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) return sendJson(res, 403, { error: 'invite' });
    return sendJson(res, 200, messages);
  }

  if (req.method === 'GET' && req.url.split('?')[0] === '/api/members') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) return sendJson(res, 403, { error: 'invite' });
    return sendJson(res, 200, { online: online.size, members: memberList() });
  }

  if (req.method === 'GET' && req.url.split('?')[0] === '/api/invite') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) return sendJson(res, 403, { error: 'invite' });
    return sendJson(res, 200, { code: INVITE_CODE, urls: getBaseUrls() });
  }

  if (req.method === 'GET' && req.url.split('?')[0] === '/api/group-avatar') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) return sendJson(res, 403, { error: 'invite' });
    return fs.readFile(AVATAR_FILE, (err, content) => {
      if (err) return sendJson(res, 404, { error: 'none' });
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      res.end(content);
    });
  }

  if (req.method === 'POST' && req.url.split('?')[0] === '/api/group-avatar') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    if (!validInvite(params.get('invite'))) return sendJson(res, 403, { error: 'invite' });
    try {
      const data = JSON.parse(await readBody(req, 600000));
      const user = String(data.user || '').trim().slice(0, 30);
      const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(data.image || ''));
      if (!user || !match) return sendJson(res, 400, { error: 'invalid' });
      const buffer = Buffer.from(match[1], 'base64');
      const isJpeg = buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      if (!isJpeg) return sendJson(res, 400, { error: 'invalid' });
      fs.writeFileSync(AVATAR_FILE, buffer);
      avatarVersion = Date.now();
      broadcastGroup();
      announce(`${user} cambió la foto del grupo`);
      return sendJson(res, 200, { avatar: avatarVersion });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && req.url === '/api/send') {
    try {
      const data = JSON.parse(await readBody(req));
      if (!validInvite(data.invite)) return sendJson(res, 403, { error: 'invite' });
      const user = String(data.user || '').trim().slice(0, 30);
      const text = String(data.text || '').trim().slice(0, 2000);
      if (!user || !text) return sendJson(res, 400, { error: 'invalid' });
      const message = { id: nextId++, user, text, time: Date.now() };
      pushMessage(message);
      return sendJson(res, 200, message);
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET') return serveStatic(req, res);

  res.writeHead(405);
  res.end('Method not allowed');
});

setInterval(() => {
  for (const res of clients.keys()) res.write(': ping\n\n');
}, 20000);

function startTunnel() {
  if (process.env.NO_TUNNEL || publicUrl) return;
  const child = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${PORT}`]);
  child.on('error', () => {
    console.log('cloudflared no está instalado, solo habrá enlace local. Instálalo con: pkg install cloudflared');
  });
  const onData = chunk => {
    if (publicUrl) return;
    const match = String(chunk).match(/https:\/\/(?!api\.)[a-z0-9-]+\.trycloudflare\.com/);
    if (!match) return;
    publicUrl = match[0];
    console.log(`Enlace público para invitar: ${publicUrl}/?invite=${INVITE_CODE}`);
  };
  child.stdout?.on('data', onData);
  child.stderr?.on('data', onData);
  process.on('exit', () => child.kill());
  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit());
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp Web listo en http://localhost:${PORT}`);
  console.log(`Entrar tú: http://localhost:${PORT}/?invite=${INVITE_CODE}`);
  for (const base of getBaseUrls()) console.log(`Invitar a otros: ${base}/?invite=${INVITE_CODE}`);
  startTunnel();
});

