const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_HISTORY = 500;

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
  const payload = `event: presence\ndata: ${JSON.stringify({ online: online.size })}\n\n`;
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

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) {
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
    const user = (new URL(req.url, 'http://localhost').searchParams.get('user') || '').trim().slice(0, 30);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    res.write('retry: 2000\n\n');
    clients.set(res, user);
    if (user) userConnected(user);
    req.on('close', () => {
      clients.delete(res);
      if (user) userDisconnected(user);
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/history') {
    return sendJson(res, 200, messages);
  }

  if (req.method === 'POST' && req.url === '/api/send') {
    try {
      const data = JSON.parse(await readBody(req));
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp Web listo en http://localhost:${PORT}`);
});
