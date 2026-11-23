const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const { spawn } = require('child_process');
const push = require('./push');

const scrypt = promisify(crypto.scrypt);

const PORT = process.env.PORT || 3000;
const NGROK_FILE = path.join(__dirname, 'ngrok-domain.txt');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_HISTORY = 500;
const SESSION_DAYS = 60;
const AVATAR_FILE = path.join(__dirname, 'group-avatar.jpg');
const AVATAR_DIR = path.join(__dirname, 'avatars');
const USERS_FILE = path.join(__dirname, 'users.json');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
const CHATS_FILE = path.join(__dirname, 'chats.json');
const TYPING_TIMEOUT = 4000;
const PUSH_PREVIEW_CHARS = 240;
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_TYPES = { jpg: 'image/jpeg', gif: 'image/gif' };
const STATUS_DIR = path.join(__dirname, 'statuses');
const STATUS_FILE = path.join(__dirname, 'statuses.json');
const STATUS_TTL = 24 * 3600 * 1000;
const STATUS_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov'
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

const users = new Map(readJson(USERS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));
const sessions = new Map(Object.entries(readJson(SESSIONS_FILE, {})));
const savedChats = readJson(CHATS_FILE, {});
const convs = new Map(Object.entries(savedChats.convs || {}));
const reads = savedChats.reads || {};
const statuses = new Map(readJson(STATUS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));

if (!convs.has('general')) {
  convs.set('general', { id: 'general', type: 'group', name: 'Grupo general', members: null, avatar: 0, created: Date.now(), messages: [] });
}
const general = convs.get('general');
general.members = null;
general.messages = general.messages.filter(message => !(message.system && /( entró al chat| salió del chat)$/.test(message.text)));
if (!general.avatar && fs.existsSync(AVATAR_FILE)) general.avatar = Math.floor(fs.statSync(AVATAR_FILE).mtimeMs);

let nextId = Date.now();
for (const conv of convs.values()) {
  for (const message of conv.messages) {
    if (message.id >= nextId) nextId = message.id + 1;
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify([...users.values()]));
  } catch {}
}

let contactsSeeded = false;
for (const user of users.values()) {
  if (Array.isArray(user.contacts)) continue;
  user.contacts = [];
  for (const conv of convs.values()) {
    if (conv.type !== 'dm' || !conv.members.includes(user.id)) continue;
    const peerId = conv.members.find(id => id !== user.id);
    if (peerId && !user.contacts.includes(peerId)) user.contacts.push(peerId);
  }
  contactsSeeded = true;
}
if (contactsSeeded) saveUsers();

function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(Object.fromEntries(sessions)));
  } catch {}
}

function saveStatuses() {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify([...statuses.values()]));
  } catch {}
}

function statusPath(item) {
  return path.join(STATUS_DIR, item.id + '.' + item.ext);
}

function purgeStatuses() {
  const now = Date.now();
  let changed = false;
  for (const item of [...statuses.values()]) {
    if (now - item.time < STATUS_TTL) continue;
    try {
      fs.rmSync(statusPath(item), { force: true });
    } catch {}
    statuses.delete(item.id);
    changed = true;
  }
  if (changed) {
    saveStatuses();
    emit(null, 'statuses', {});
  }
}

function canSeeStatus(viewer, item) {
  return item.uid === viewer.id || (viewer.contacts || []).includes(item.uid);
}

function writeChats() {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify({ convs: Object.fromEntries(convs), reads }));
  } catch {}
}

let saveTimer = null;

function saveChats() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    writeChats();
  }, 1000);
}

process.on('exit', writeChats);
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

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
  return { id: user.id, name: user.name, avatar: user.avatar || 0 };
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
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

const clients = new Map();
const views = new Map();
const online = new Map();
const typing = new Map();

function isMember(conv, uid) {
  return conv.members === null || conv.members.includes(uid);
}

function convFor(user, id) {
  const conv = convs.get(String(id || ''));
  return conv && isMember(conv, user.id) ? conv : null;
}

function activeUsers() {
  return [...users.values()].filter(user => user.hash);
}

function emit(conv, event, data) {
  const payload = (event ? `event: ${event}\n` : '') + `data: ${JSON.stringify(data)}\n\n`;
  for (const [res, uid] of clients) {
    if (!conv || isMember(conv, uid)) res.write(payload);
  }
}

function pushMessage(conv, message) {
  conv.messages.push(message);
  if (conv.messages.length > MAX_HISTORY) conv.messages.shift();
  emit(conv, null, { conv: conv.id, ...message });
  saveChats();
}

function announce(conv, text) {
  pushMessage(conv, { id: nextId++, system: true, text, time: Date.now() });
}

function inForeground(uid) {
  for (const view of views.values()) {
    if (view.uid === uid && view.visible) return true;
  }
  return false;
}

function notifyMessage(conv, sender, message) {
  const chars = Array.from(message.text);
  const text = chars.length > PUSH_PREVIEW_CHARS ? chars.slice(0, PUSH_PREVIEW_CHARS - 1).join('') + '…' : message.text;
  const isDm = conv.type === 'dm';
  const recipients = (conv.members === null ? activeUsers().map(item => item.id) : conv.members)
    .filter(id => id !== sender.id && !inForeground(id));
  if (!recipients.length) return;
  push.send(recipients, {
    title: isDm ? sender.name : conv.name,
    body: isDm ? text : `${sender.name}: ${text}`,
    conv: conv.id,
    id: message.id,
    uid: sender.id,
    sender: sender.name,
    type: conv.type,
    time: message.time
  });
}

function memberList(conv) {
  const list = conv.members === null ? activeUsers() : conv.members.map(id => users.get(id)).filter(Boolean);
  return list
    .map(user => ({ ...publicUser(user), online: online.has(user.id) }))
    .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
}

function typingList(convId) {
  const list = [];
  for (const entry of typing.values()) {
    if (entry.conv !== convId) continue;
    const user = users.get(entry.uid);
    if (user) list.push(publicUser(user));
  }
  return list;
}

function broadcastTyping(conv) {
  emit(conv, 'typing', { conv: conv.id, typing: typingList(conv.id) });
}

function clearTyping(convId, uid) {
  const key = convId + ':' + uid;
  const entry = typing.get(key);
  if (!entry) return;
  clearTimeout(entry.timer);
  typing.delete(key);
  const conv = convs.get(convId);
  if (conv) broadcastTyping(conv);
}

function setTyping(conv, user) {
  const key = conv.id + ':' + user.id;
  const existing = typing.get(key);
  if (existing) clearTimeout(existing.timer);
  const timer = setTimeout(() => clearTyping(conv.id, user.id), TYPING_TIMEOUT);
  typing.set(key, { conv: conv.id, uid: user.id, timer });
  if (!existing) broadcastTyping(conv);
}

function clearUserTyping(uid) {
  for (const entry of [...typing.values()]) {
    if (entry.uid === uid) clearTyping(entry.conv, uid);
  }
}

function lastOf(conv) {
  for (let i = conv.messages.length - 1; i >= 0; i--) {
    if (!conv.messages[i].system) return conv.messages[i];
  }
  return conv.messages[conv.messages.length - 1] || null;
}

function unreadOf(conv, uid) {
  const seenId = (reads[uid] && reads[uid][conv.id]) || 0;
  let count = 0;
  for (const message of conv.messages) {
    if (!message.system && message.uid !== uid && message.id > seenId) count++;
  }
  return count;
}

function summary(conv, user) {
  const last = lastOf(conv);
  const out = {
    id: conv.id,
    type: conv.type,
    avatar: conv.avatar || 0,
    last: last ? { text: last.text, time: last.time, user: last.user || '', mine: last.uid === user.id, system: !!last.system } : null,
    sortTime: last ? last.time : conv.created,
    unread: unreadOf(conv, user.id),
    typing: typingList(conv.id).filter(person => person.id !== user.id).map(person => person.name)
  };
  if (conv.type === 'dm') {
    const peerId = conv.members.find(id => id !== user.id);
    const peer = users.get(peerId);
    out.name = peer ? peer.name : 'Usuario';
    out.avatar = peer ? peer.avatar || 0 : 0;
    out.peer = { id: peerId, online: online.has(peerId) };
  } else {
    out.name = conv.name;
  }
  return out;
}

function groupAvatarPath(conv, ext = conv.avatarExt || 'jpg') {
  return conv.id === 'general' && ext === 'jpg' ? AVATAR_FILE : path.join(AVATAR_DIR, conv.id + '.' + ext);
}

function userAvatarPath(user, ext = user.avatarExt || 'jpg') {
  return path.join(AVATAR_DIR, 'u_' + user.id + '.' + ext);
}

function parseImage(value) {
  const match = /^data:image\/(jpeg|gif);base64,([A-Za-z0-9+/=]+)$/.exec(String(value || ''));
  if (!match) return null;
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length < 8 || buffer.length > MAX_AVATAR_BYTES) return null;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const head = buffer.toString('latin1', 0, 6);
  const isGif = head === 'GIF87a' || head === 'GIF89a';
  if (match[1] === 'jpeg' && !isJpeg) return null;
  if (match[1] === 'gif' && !isGif) return null;
  return { ext: match[1] === 'jpeg' ? 'jpg' : 'gif', buffer };
}

function removeFile(file) {
  try {
    fs.rmSync(file, { force: true });
  } catch {}
}

function sendAvatar(res, file, ext) {
  fs.readFile(file, (err, content) => {
    if (err) return sendJson(res, 404, { error: 'none' });
    res.writeHead(200, { 'Content-Type': AVATAR_TYPES[ext] || 'image/jpeg', 'Cache-Control': 'private, max-age=86400' });
    res.end(content);
  });
}

function broadcastPresence() {
  emit(null, 'presence', {});
}

function userConnected(user) {
  online.set(user.id, (online.get(user.id) || 0) + 1);
  broadcastPresence();
}

function userDisconnected(user) {
  const count = (online.get(user.id) || 1) - 1;
  if (count > 0) {
    online.set(user.id, count);
    return;
  }
  online.delete(user.id);
  clearUserTyping(user.id);
  broadcastPresence();
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

function authorizeConv(res, params) {
  const user = authorize(res, params.get('token'));
  if (!user) return null;
  const conv = convFor(user, params.get('conv'));
  if (!conv) {
    sendJson(res, 404, { error: 'conv' });
    return null;
  }
  return { user, conv };
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
    const headers = { 'Content-Type': type };
    if (path.basename(filePath) === 'sw.js') headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, headers);
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
          contacts: [],
          joined: Date.now()
        };
        users.set(user.id, user);
        saveUsers();
        emit(null, 'chats', {});
      } else {
        user = findByUsername(credentials.username);
        if (!user || !user.hash || !(await checkPassword(user, credentials.password))) {
          return sendJson(res, 401, { error: 'credentials' });
        }
      }
      const token = createSession(user.id);
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
    views.set(res, { uid: user.id, cid: String(params.get('cid') || '').slice(0, 40), visible: params.get('visible') === '1' });
    userConnected(user);
    req.on('close', () => {
      clients.delete(res);
      views.delete(res);
      userDisconnected(user);
    });
    return;
  }

  if (req.method === 'GET' && route === '/api/push/key') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { key: push.publicKey });
  }

  if (req.method === 'POST' && route === '/api/push/subscribe') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      if (!push.add(user.id, data)) return sendJson(res, 400, { error: 'invalid' });
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/push/unsubscribe') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      push.remove(user.id, String(data.endpoint || ''));
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/visibility') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const cid = String(params.get('cid') || '').slice(0, 40);
      for (const view of views.values()) {
        if (view.uid === user.id && cid && view.cid === cid) view.visible = !!data.visible;
      }
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/chats') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const list = [...convs.values()]
      .filter(conv => isMember(conv, user.id) && !(conv.type === 'dm' && conv.messages.length === 0))
      .map(conv => summary(conv, user))
      .sort((a, b) => b.sortTime - a.sortTime);
    return sendJson(res, 200, list);
  }

  if (req.method === 'GET' && route === '/api/users') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const list = activeUsers()
      .filter(item => item.id !== user.id && (user.contacts || []).includes(item.id))
      .map(item => ({ ...publicUser(item), online: online.has(item.id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return sendJson(res, 200, list);
  }

  if (req.method === 'GET' && route === '/api/profile') {
    const viewer = authorize(res, params.get('token'));
    if (!viewer) return;
    const target = users.get(String(params.get('id') || ''));
    if (!target || !target.hash) return sendJson(res, 404, { error: 'none' });
    return sendJson(res, 200, {
      ...publicUser(target),
      online: online.has(target.id),
      contact: (viewer.contacts || []).includes(target.id),
      joined: target.joined || 0
    });
  }

  if (req.method === 'POST' && route === '/api/contact') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const peer = users.get(String(data.userId || ''));
      if (!peer || !peer.hash || peer.id === user.id) return sendJson(res, 400, { error: 'invalid' });
      const list = (user.contacts || []).filter(id => id !== peer.id);
      if (data.add) list.push(peer.id);
      user.contacts = list;
      saveUsers();
      return sendJson(res, 200, { contact: !!data.add });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/dm') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const peer = users.get(String(data.userId || ''));
      if (!peer || !peer.hash || peer.id === user.id) return sendJson(res, 400, { error: 'invalid' });
      const id = 'dm_' + [user.id, peer.id].sort().join('_');
      if (!convs.has(id)) {
        convs.set(id, { id, type: 'dm', members: [user.id, peer.id], created: Date.now(), messages: [] });
        saveChats();
      }
      return sendJson(res, 200, summary(convs.get(id), user));
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/groups') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const name = String(data.name || '').trim().slice(0, 30);
      const ids = [...new Set(Array.isArray(data.members) ? data.members.map(String) : [])]
        .filter(id => id !== user.id && users.get(id) && users.get(id).hash)
        .slice(0, 100);
      if (!name || ids.length === 0) return sendJson(res, 400, { error: 'invalid' });
      const conv = {
        id: 'g_' + crypto.randomBytes(6).toString('hex'),
        type: 'group',
        name,
        members: [user.id, ...ids],
        avatar: 0,
        created: Date.now(),
        messages: []
      };
      convs.set(conv.id, conv);
      announce(conv, `${user.name} creó el grupo "${name}"`);
      emit(conv, 'chats', {});
      return sendJson(res, 200, summary(conv, user));
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/statuses') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const now = Date.now();
    const groups = new Map();
    for (const item of statuses.values()) {
      if (now - item.time >= STATUS_TTL || !canSeeStatus(user, item)) continue;
      const owner = users.get(item.uid);
      if (!owner) continue;
      const mine = item.uid === user.id;
      if (!groups.has(item.uid)) groups.set(item.uid, { user: publicUser(owner), mine, items: [] });
      const entry = {
        id: item.id,
        kind: item.kind,
        caption: item.caption,
        time: item.time,
        seen: mine || item.views.some(view => view.uid === user.id)
      };
      if (mine) {
        entry.views = item.views
          .map(view => ({ user: users.get(view.uid), time: view.time }))
          .filter(view => view.user)
          .map(view => ({ ...publicUser(view.user), time: view.time }));
      }
      groups.get(item.uid).items.push(entry);
    }
    const list = [...groups.values()];
    for (const group of list) {
      group.items.sort((a, b) => a.time - b.time);
      group.seen = group.items.every(entry => entry.seen);
      group.last = group.items[group.items.length - 1].time;
    }
    const others = list
      .filter(group => !group.mine)
      .sort((a, b) => Number(a.seen) - Number(b.seen) || b.last - a.last);
    return sendJson(res, 200, { mine: list.find(group => group.mine) || null, others });
  }

  if (req.method === 'POST' && route === '/api/status') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    const ext = STATUS_TYPES[mime];
    if (!ext) {
      req.resume();
      return sendJson(res, 415, { error: 'type' });
    }
    const id = crypto.randomBytes(8).toString('hex');
    const item = {
      id,
      uid: user.id,
      kind: mime.startsWith('video/') ? 'video' : 'image',
      ext,
      mime,
      caption: String(params.get('caption') || '').trim().slice(0, 200),
      time: Date.now(),
      views: []
    };
    fs.mkdirSync(STATUS_DIR, { recursive: true });
    const file = statusPath(item);
    const out = fs.createWriteStream(file);
    let failed = false;
    const fail = () => {
      if (failed) return;
      failed = true;
      out.destroy();
      removeFile(file);
      if (!res.headersSent) sendJson(res, 400, { error: 'invalid' });
    };
    req.on('error', fail);
    req.on('close', () => {
      if (!req.complete) fail();
    });
    out.on('error', fail);
    out.on('finish', () => {
      if (failed) return;
      if (!out.bytesWritten) {
        removeFile(file);
        return sendJson(res, 400, { error: 'invalid' });
      }
      item.size = out.bytesWritten;
      item.time = Date.now();
      statuses.set(id, item);
      saveStatuses();
      emit(null, 'statuses', {});
      sendJson(res, 200, { id });
    });
    req.pipe(out);
    return;
  }

  if (req.method === 'POST' && route === '/api/status/view') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const item = statuses.get(String(data.id || ''));
      if (!item || Date.now() - item.time >= STATUS_TTL || !canSeeStatus(user, item)) return sendJson(res, 404, { error: 'none' });
      if (item.uid !== user.id && !item.views.some(view => view.uid === user.id)) {
        item.views.push({ uid: user.id, time: Date.now() });
        saveStatuses();
      }
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/status/delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const item = statuses.get(String(data.id || ''));
      if (!item || item.uid !== user.id) return sendJson(res, 404, { error: 'none' });
      removeFile(statusPath(item));
      statuses.delete(item.id);
      saveStatuses();
      emit(null, 'statuses', {});
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/status-media') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const item = statuses.get(String(params.get('id') || ''));
    if (!item || Date.now() - item.time >= STATUS_TTL || !canSeeStatus(user, item)) return sendJson(res, 404, { error: 'none' });
    const file = statusPath(item);
    return fs.stat(file, (err, stat) => {
      if (err || !stat.size) return sendJson(res, 404, { error: 'none' });
      const headers = {
        'Content-Type': item.mime,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      };
      let start = 0;
      let end = stat.size - 1;
      let code = 200;
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (range && (range[1] || range[2])) {
        if (range[1]) {
          start = Number(range[1]);
          if (range[2]) end = Math.min(Number(range[2]), end);
        } else {
          start = Math.max(stat.size - Number(range[2]), 0);
        }
        if (start > end || start >= stat.size) {
          res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
          return res.end();
        }
        code = 206;
        headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
      }
      headers['Content-Length'] = end - start + 1;
      res.writeHead(code, headers);
      const stream = fs.createReadStream(file, { start, end });
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    });
  }

  if (req.method === 'GET' && route === '/api/history') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const after = Number(params.get('after')) || 0;
    const list = ctx.conv.messages;
    return sendJson(res, 200, after ? list.filter(item => item.id > after) : list);
  }

  if (req.method === 'GET' && route === '/api/members') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const list = memberList(ctx.conv);
    return sendJson(res, 200, {
      online: list.filter(item => item.online).length,
      members: list,
      typing: typingList(ctx.conv.id)
    });
  }

  if (req.method === 'POST' && route === '/api/read') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const list = ctx.conv.messages;
    if (list.length) {
      reads[ctx.user.id] = reads[ctx.user.id] || {};
      reads[ctx.user.id][ctx.conv.id] = list[list.length - 1].id;
      saveChats();
    }
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && route === '/api/typing') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    setTyping(ctx.conv, ctx.user);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && route === '/api/group-avatar') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    return sendAvatar(res, groupAvatarPath(ctx.conv), ctx.conv.avatarExt || 'jpg');
  }

  if (req.method === 'POST' && route === '/api/group-avatar') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type !== 'group') return sendJson(res, 400, { error: 'invalid' });
    try {
      const data = JSON.parse(await readBody(req, 3000000));
      const image = parseImage(data.image);
      if (!image) return sendJson(res, 400, { error: 'invalid' });
      fs.mkdirSync(AVATAR_DIR, { recursive: true });
      if (image.ext !== (ctx.conv.avatarExt || 'jpg')) removeFile(groupAvatarPath(ctx.conv));
      ctx.conv.avatarExt = image.ext;
      fs.writeFileSync(groupAvatarPath(ctx.conv, image.ext), image.buffer);
      ctx.conv.avatar = Date.now();
      emit(ctx.conv, 'group', { conv: ctx.conv.id, avatar: ctx.conv.avatar });
      announce(ctx.conv, `${ctx.user.name} cambió la foto del grupo`);
      return sendJson(res, 200, { avatar: ctx.conv.avatar });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/user-avatar') {
    const viewer = authorize(res, params.get('token'));
    if (!viewer) return;
    const owner = users.get(String(params.get('id') || ''));
    if (!owner || !owner.avatar) return sendJson(res, 404, { error: 'none' });
    return sendAvatar(res, userAvatarPath(owner), owner.avatarExt || 'jpg');
  }

  if (req.method === 'POST' && route === '/api/profile-avatar') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, 3000000));
      if (data.remove) {
        removeFile(userAvatarPath(user));
        user.avatar = 0;
      } else {
        const image = parseImage(data.image);
        if (!image) return sendJson(res, 400, { error: 'invalid' });
        fs.mkdirSync(AVATAR_DIR, { recursive: true });
        if (image.ext !== (user.avatarExt || 'jpg')) removeFile(userAvatarPath(user));
        user.avatarExt = image.ext;
        fs.writeFileSync(userAvatarPath(user, image.ext), image.buffer);
        user.avatar = Date.now();
      }
      saveUsers();
      emit(null, 'profile', { id: user.id, avatar: user.avatar });
      return sendJson(res, 200, { avatar: user.avatar });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/send') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    try {
      const data = JSON.parse(await readBody(req));
      const text = String(data.text || '').trim().slice(0, 2000);
      if (!text) return sendJson(res, 400, { error: 'invalid' });
      const message = { id: nextId++, uid: ctx.user.id, user: ctx.user.name, text, time: Date.now() };
      const replyId = Number(data.replyTo) || 0;
      if (replyId) {
        const target = ctx.conv.messages.find(item => item.id === replyId && !item.system);
        if (target) message.reply = { id: target.id, uid: target.uid, user: target.user, text: String(target.text).slice(0, 200) };
      }
      clearTyping(ctx.conv.id, ctx.user.id);
      pushMessage(ctx.conv, message);
      reads[ctx.user.id] = reads[ctx.user.id] || {};
      reads[ctx.user.id][ctx.conv.id] = message.id;
      notifyMessage(ctx.conv, ctx.user, message);
      return sendJson(res, 200, message);
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET') return serveStatic(req, res);

  res.writeHead(405);
  res.end('Method not allowed');
});

server.requestTimeout = 0;

purgeStatuses();
setInterval(purgeStatuses, 60000);

setInterval(() => {
  for (const res of clients.keys()) res.write('event: ping\ndata: 1\n\n');
  const now = Date.now();
  for (const [ip, list] of attempts) {
    if (!list.some(time => now - time < 60000)) attempts.delete(ip);
  }
}, 15000);

function ngrokDomain() {
  let value = process.env.NGROK_DOMAIN || '';
  if (!value && fs.existsSync(NGROK_FILE)) value = fs.readFileSync(NGROK_FILE, 'utf8');
  return value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

function startNgrok(domain) {
  const child = spawn('ngrok', ['http', `--url=${domain}`, '--log=stdout', String(PORT)]);
  child.on('error', () => {
    console.log('ngrok no está instalado o no se encuentra. Descárgalo en https://ngrok.com/download y ejecuta: ngrok config add-authtoken TU_TOKEN');
  });
  child.on('exit', code => {
    if (code) console.log(`ngrok se cerró (código ${code}). Revisa que el dominio sea el de tu panel de ngrok y que el authtoken esté configurado.`);
  });
  let announced = false;
  const onData = chunk => {
    for (const line of String(chunk).split('\n')) {
      if (!announced && line.includes('started tunnel')) {
        announced = true;
        publicUrl = `https://${domain}`;
        console.log(`Enlace público fijo: ${publicUrl}`);
      } else if (/lvl=(eror|crit)|ERR_NGROK/.test(line)) {
        console.log('ngrok: ' + line.trim());
      }
    }
  };
  child.stdout?.on('data', onData);
  child.stderr?.on('data', onData);
  process.on('exit', () => child.kill());
}

function startTunnel() {
  if (process.env.NO_TUNNEL || publicUrl) return;
  const domain = ngrokDomain();
  if (domain) return startNgrok(domain);
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
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WhatsApp Web listo en http://localhost:${PORT}`);
  startTunnel();
});
