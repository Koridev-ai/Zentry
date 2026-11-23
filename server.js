const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_HISTORY = 500;
const SESSION_DAYS = 60;
const INVITE_FILE = path.join(__dirname, 'invite.json');
const AVATAR_FILE = path.join(__dirname, 'group-avatar.jpg');
const USERS_FILE = path.join(__dirname, 'users.json');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
const GOOGLE_FILE = path.join(__dirname, 'google.json');
let avatarVersion = fs.existsSync(AVATAR_FILE) ? Math.floor(fs.statSync(AVATAR_FILE).mtimeMs) : 0;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function loadGoogleClientId() {
  if (process.env.GOOGLE_CLIENT_ID) return process.env.GOOGLE_CLIENT_ID.trim();
  const saved = readJson(GOOGLE_FILE, {});
  return String(saved.clientId || '').trim();
}

const GOOGLE_CLIENT_ID = loadGoogleClientId();

function loadInvite() {
  if (process.env.INVITE_CODE) return process.env.INVITE_CODE;
  const saved = readJson(INVITE_FILE, {}).code;
  if (saved) return saved;
  const code = crypto.randomBytes(5).toString('hex');
  fs.writeFileSync(INVITE_FILE, JSON.stringify({ code }));
  return code;
}

const INVITE_CODE = loadInvite();

function validInvite(code) {
  return typeof code === 'string' && code === INVITE_CODE;
}

const users = new Map(readJson(USERS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));
const sessions = new Map(Object.entries(readJson(SESSIONS_FILE, {})));

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify([...users.values()]));
  } catch {}
}

function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Object.fromEntries(sessions)));
  } catch {}
}

function createSession(uid) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { uid, created: Date.now() });
  saveSessions();
  return token;
}

function userFromToken(token) {
  if (typeof token !== 'string' || !token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() - session.created > SESSION_DAYS * 86400000) {
    sessions.delete(token);
    saveSessions();
    return null;
  }
  return users.get(session.uid) || null;
}

function publicUser(user) {
  return { id: user.id, name: user.name, picture: user.picture || '' };
}

function verifyGoogle(credential) {
  return new Promise((resolve, reject) => {
    const url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential);
    const request = https.get(url, response => {
      let body = '';
      response.on('data', chunk => {
        body += chunk;
        if (body.length > 20000) request.destroy();
      });
      response.on('end', () => {
        if (response.statusCode !== 200) return reject(new Error('google'));
        try {
          const data = JSON.parse(body);
          const issuerOk = data.iss === 'accounts.google.com' || data.iss === 'https://accounts.google.com';
          const expired = Number(data.exp) * 1000 < Date.now();
          if (data.aud !== GOOGLE_CLIENT_ID || !issuerOk || expired || String(data.email_verified) !== 'true' || !data.sub) {
            return reject(new Error('google'));
          }
          resolve(data);
        } catch {
          reject(new Error('google'));
        }
      });
    });
    request.setTimeout(8000, () => request.destroy());
    request.on('error', () => reject(new Error('google')));
  });
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

function memberList() {
  return [...users.values()]
    .map(user => ({ ...publicUser(user), online: online.has(user.id) }))
    .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
}

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
  const pending = pendingLeave.get(user.id);
  if (pending) {
    clearTimeout(pending);
    pendingLeave.delete(user.id);
  }
  const count = online.get(user.id) || 0;
  online.set(user.id, count + 1);
  if (count === 0 && !pending) announce(`${user.name} entró al chat`);
  broadcastPresence();
}

function userDisconnected(user) {
  const count = (online.get(user.id) || 1) - 1;
  if (count > 0) {
    online.set(user.id, count);
    return;
  }
  online.delete(user.id);
  broadcastPresence();
  pendingLeave.set(user.id, setTimeout(() => {
    pendingLeave.delete(user.id);
    announce(`${user.name} salió del chat`);
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

function authorize(res, invite, token) {
  if (!validInvite(invite)) {
    sendJson(res, 403, { error: 'invite' });
    return null;
  }
  const user = userFromToken(token);
  if (!user) {
    sendJson(res, 401, { error: 'auth' });
    return null;
  }
  return user;
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
  const route = req.url.split('?')[0];
  const params = new URL(req.url, 'http://localhost').searchParams;

  if (req.method === 'GET' && route === '/api/config') {
    return sendJson(res, 200, { googleClientId: GOOGLE_CLIENT_ID });
  }

  if (req.method === 'POST' && route === '/api/login') {
    try {
      const data = JSON.parse(await readBody(req, 20000));
      if (!validInvite(data.invite)) return sendJson(res, 403, { error: 'invite' });
      if (!GOOGLE_CLIENT_ID) return sendJson(res, 500, { error: 'config' });
      const profile = await verifyGoogle(String(data.credential || ''));
      const id = String(profile.sub);
      const name = String(profile.name || profile.given_name || String(profile.email || '').split('@')[0] || 'Usuario').trim().slice(0, 30);
      const picture = /^https:\/\//.test(String(profile.picture || '')) ? String(profile.picture) : '';
      const existing = users.get(id);
      const user = { id, name, picture, joined: existing ? existing.joined : Date.now() };
      users.set(id, user);
      saveUsers();
      const token = createSession(id);
      broadcastPresence();
      return sendJson(res, 200, { token, user: publicUser(user) });
    } catch {
      return sendJson(res, 401, { error: 'google' });
    }
  }

  if (req.method === 'GET' && route === '/api/me') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && route === '/api/logout') {
    const token = params.get('token');
    if (token && sessions.delete(token)) saveSessions();
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && route === '/api/events') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'identity',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive'
    });
    res.flushHeaders();
    res.write(`retry: 2000\n: ${' '.repeat(2048)}\n\n`);
    clients.set(res, user.id);
    res.write(groupPayload());
    userConnected(user);
    req.on('close', () => {
      clients.delete(res);
      userDisconnected(user);
    });
    return;
  }

  if (req.method === 'GET' && route === '/api/history') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return sendJson(res, 200, messages);
  }

  if (req.method === 'GET' && route === '/api/group') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { avatar: fs.existsSync(AVATAR_FILE) ? avatarVersion : 0 });
  }

  if (req.method === 'GET' && route === '/api/members') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { online: online.size, members: memberList() });
  }

  if (req.method === 'GET' && route === '/api/invite') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { code: INVITE_CODE, urls: getBaseUrls() });
  }

  if (req.method === 'GET' && route === '/api/group-avatar') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    return fs.readFile(AVATAR_FILE, (err, content) => {
      if (err) return sendJson(res, 404, { error: 'none' });
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      res.end(content);
    });
  }

  if (req.method === 'POST' && route === '/api/group-avatar') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, 600000));
      const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(data.image || ''));
      if (!match) return sendJson(res, 400, { error: 'invalid' });
      const buffer = Buffer.from(match[1], 'base64');
      const isJpeg = buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      if (!isJpeg) return sendJson(res, 400, { error: 'invalid' });
      fs.writeFileSync(AVATAR_FILE, buffer);
      avatarVersion = Date.now();
      broadcastGroup();
      announce(`${user.name} cambió la foto del grupo`);
      return sendJson(res, 200, { avatar: avatarVersion });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/send') {
    const user = authorize(res, params.get('invite'), params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const text = String(data.text || '').trim().slice(0, 2000);
      if (!text) return sendJson(res, 400, { error: 'invalid' });
      const message = { id: nextId++, uid: user.id, user: user.name, picture: user.picture || '', text, time: Date.now() };
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
    console.log(`Autoriza este origen en Google Cloud: ${publicUrl}`);
  };
  child.stdout?.on('data', onData);
  child.stderr?.on('data', onData);
  process.on('exit', () => child.kill());
  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit());
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp Web listo en http://localhost:${PORT}`);
  if (!GOOGLE_CLIENT_ID) console.log('Falta GOOGLE_CLIENT_ID (variable de entorno o google.json con {"clientId":"..."})');
  console.log(`Entrar tú: http://localhost:${PORT}/?invite=${INVITE_CODE}`);
  for (const base of getBaseUrls()) console.log(`Invitar a otros: ${base}/?invite=${INVITE_CODE}`);
  startTunnel();
});
