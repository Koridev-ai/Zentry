const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const { spawn } = require('child_process');

const scrypt = promisify(crypto.scrypt);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_HISTORY = 500;
const SESSION_DAYS = 60;
const AVATAR_FILE = path.join(__dirname, 'group-avatar.jpg');
const USERS_FILE = path.join(__dirname, 'users.json');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
let avatarVersion = fs.existsSync(AVATAR_FILE) ? Math.floor(fs.statSync(AVATAR_FILE).mtimeMs) : 0;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
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
  return { id: user.id, name: user.name };
}

function findByUsername(username) {
  const key = username.toLowerCase();
  for (const user of users.values()) {
    if (user.username === key) return user;
  }
  return null;
}

async function hashPassword(password, salt) {
  return (await scrypt(password, salt, 64)).toString('hex');
}

async function checkPassword(user, password) {
  const expected = Buffer.from(user.hash, 'hex');
  const actual = Buffer.from(await hashPassword(password, user.salt), 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

const attempts = new Map();

function throttled(req) {
  const ip = String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const now = Date.now();
  const list = (attempts.get(ip) || []).filter(time => now - time < 60000);
  list.push(now);
  attempts.set(ip, list);
  return list.length > 10;
}

function readCredentials(data) {
  const username = String(data.username || '').trim();
  const password = String(data.password || '');
  if (!/^[A-Za-z0-9_.-]{3,20}$/.test(username)) return null;
  if (password.length < 6 || password.length > 100) return null;
  return { username, password };
}

let publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

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
let nextId = Date.now();

function memberList() {
  return [...users.values()]
    .filter(user => user.hash)
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

const typing = new Map();
const TYPING_TIMEOUT = 4000;

function typingList() {
  return [...typing.keys()].map(id => users.get(id)).filter(Boolean).map(publicUser);
}

function broadcastTyping() {
  const payload = `event: typing\ndata: ${JSON.stringify(typingList())}\n\n`;
  for (const res of clients.keys()) res.write(payload);
}

function clearTyping(id) {
  if (!typing.has(id)) return;
  clearTimeout(typing.get(id));
  typing.delete(id);
  broadcastTyping();
}

function setTyping(user) {
  const existed = typing.has(user.id);
  clearTimeout(typing.get(user.id));
  typing.set(user.id, setTimeout(() => clearTyping(user.id), TYPING_TIMEOUT));
  if (!existed) broadcastTyping();
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
  clearTyping(user.id);
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

function authorize(res, token) {
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

  if (req.method === 'POST' && (route === '/api/register' || route === '/api/login')) {
    if (throttled(req)) return sendJson(res, 429, { error: 'rate' });
    try {
      const data = JSON.parse(await readBody(req, 5000));
      const credentials = readCredentials(data);
      if (!credentials) return sendJson(res, 400, { error: 'format' });
      let user;
      if (route === '/api/register') {
        if (findByUsername(credentials.username)) return sendJson(res, 409, { error: 'taken' });
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = await hashPassword(credentials.password, salt);
        user = {
          id: crypto.randomBytes(8).toString('hex'),
          username: credentials.username.toLowerCase(),
          name: credentials.username,
          salt,
          hash,
          joined: Date.now()
        };
        users.set(user.id, user);
        saveUsers();
      } else {
        user = findByUsername(credentials.username);
        if (!user || !user.hash || !(await checkPassword(user, credentials.password))) {
          return sendJson(res, 401, { error: 'credentials' });
        }
      }
      const token = createSession(user.id);
      broadcastPresence();
      return sendJson(res, 200, { token, user: publicUser(user) });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/me') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && route === '/api/logout') {
    const token = params.get('token');
    if (token && sessions.delete(token)) saveSessions();
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && route === '/api/events') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'identity',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive'
    });
    res.flushHeaders();
    if (req.socket) req.socket.setNoDelay(true);
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
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const after = Number(params.get('after')) || 0;
    return sendJson(res, 200, after ? messages.filter(item => item.id > after) : messages);
  }

  if (req.method === 'GET' && route === '/api/group') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { avatar: fs.existsSync(AVATAR_FILE) ? avatarVersion : 0 });
  }

  if (req.method === 'GET' && route === '/api/members') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { online: online.size, members: memberList(), typing: typingList() });
  }

  if (req.method === 'GET' && route === '/api/group-avatar') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return fs.readFile(AVATAR_FILE, (err, content) => {
      if (err) return sendJson(res, 404, { error: 'none' });
      res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' });
      res.end(content);
    });
  }

  if (req.method === 'POST' && route === '/api/group-avatar') {
    const user = authorize(res, params.get('token'));
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

  if (req.method === 'POST' && route === '/api/typing') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    setTyping(user);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && route === '/api/send') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const text = String(data.text || '').trim().slice(0, 2000);
      if (!text) return sendJson(res, 400, { error: 'invalid' });
      const message = { id: nextId++, uid: user.id, user: user.name, text, time: Date.now() };
      clearTyping(user.id);
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
  for (const res of clients.keys()) res.write('event: ping\ndata: 1\n\n');
  const now = Date.now();
  for (const [ip, list] of attempts) {
    if (!list.some(time => now - time < 60000)) attempts.delete(ip);
  }
}, 15000);

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
    console.log(`Enlace público: ${publicUrl}`);
  };
  child.stdout?.on('data', onData);
  child.stderr?.on('data', onData);
  process.on('exit', () => child.kill());
  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit());
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp Web listo en http://localhost:${PORT}`);
  startTunnel();
});
