const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const { spawn } = require('child_process');
const push = require('./push');
const aiko = require('./aiko');

const scrypt = promisify(crypto.scrypt);
const AIKO = aiko.user;
const AIKO_ID = AIKO.id;
const AIKO_PER_MINUTE = 12;

const PORT = process.env.PORT || 3000;
const NGROK_FILE = path.join(__dirname, 'ngrok-domain.txt');
const OWNER_FILE = path.join(__dirname, 'owner.txt');
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
const MAX_AVATAR_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BODY = Math.ceil(MAX_AVATAR_BYTES * 4 / 3) + 1000;
const AVATAR_TYPES = { jpg: 'image/jpeg', gif: 'image/gif' };
const MEDIA_DIR = path.join(__dirname, 'media');
const MAX_CHAT_IMAGE_BYTES = 16 * 1024 * 1024;
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
const STATUS_DIR = path.join(__dirname, 'statuses');
const STATUS_FILE = path.join(__dirname, 'statuses.json');
const STATUS_TTL = 24 * 3600 * 1000;
const AIKO_IDLE = 24 * 3600 * 1000;
const MAX_STATUS_BYTES = 64 * 1024 * 1024;
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.jsdelivr.net",
  "media-src 'self' blob:",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "worker-src 'self'",
  "manifest-src 'self'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');
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

for (const conv of convs.values()) {
  if (conv.type !== 'group' || conv.id === 'general') continue;
  if (!conv.creator && Array.isArray(conv.members) && conv.members.length) conv.creator = conv.members[0];
  if (!Array.isArray(conv.admins)) conv.admins = conv.creator ? [conv.creator] : [];
}

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

const AIKO_PROFILE_FILE = path.join(__dirname, 'aiko-profile.json');

try {
  const saved = JSON.parse(fs.readFileSync(AIKO_PROFILE_FILE, 'utf8'));
  AIKO.avatar = Number(saved.avatar) || 0;
  AIKO.banner = Number(saved.banner) || 0;
  AIKO.avatarExt = saved.avatarExt === 'gif' ? 'gif' : 'jpg';
  AIKO.bannerExt = saved.bannerExt === 'gif' ? 'gif' : 'jpg';
} catch {}

function saveAikoProfile() {
  try {
    fs.writeFileSync(AIKO_PROFILE_FILE, JSON.stringify({
      avatar: AIKO.avatar || 0,
      banner: AIKO.banner || 0,
      avatarExt: AIKO.avatarExt || 'jpg',
      bannerExt: AIKO.bannerExt || 'jpg'
    }));
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
  if (item.gid) {
    const conv = convs.get(item.gid);
    return !!conv && statusModeOf(conv) !== 'off' && isMember(conv, viewer.id);
  }
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
  const out = { id: user.id, name: user.name, avatar: user.avatar || 0, banner: user.banner || 0 };
  if (user.verified) out.verified = true;
  if (user.bot) out.bot = true;
  return out;
}

function userById(id) {
  return id === AIKO_ID ? AIKO : users.get(id);
}

function reservedName(name) {
  return String(name).toLowerCase().replace(/[._-]/g, '') === AIKO_ID;
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

function ownerName() {
  let value = process.env.OWNER_USERNAME || '';
  if (!value && fs.existsSync(OWNER_FILE)) value = fs.readFileSync(OWNER_FILE, 'utf8');
  return value.trim().toLowerCase();
}

const OWNER = ownerName();
const PROXY_HEADERS = ['x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-real-ip', 'forwarded', 'cf-connecting-ip', 'cf-ray', 'via'];

function isLocalRequest(req) {
  const addr = req.socket.remoteAddress || '';
  const loopback = addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
  return loopback && !PROXY_HEADERS.some(name => req.headers[name] !== undefined);
}

function isOwner(req, user) {
  return !!OWNER && user.username === OWNER && isLocalRequest(req);
}

const attempts = new Map();

function applySecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
}

function clientIp(req) {
  const addr = String(req.socket.remoteAddress || '');
  const loopback = addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
  if (!loopback) return addr;
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').map(part => part.trim()).filter(Boolean);
  return forwarded.length ? forwarded[forwarded.length - 1] : addr;
}

function throttled(req) {
  const ip = clientIp(req);
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
const online = new Map([[AIKO_ID, 1]]);
const typing = new Map();

function isMember(conv, uid) {
  return conv.members === null || conv.members.includes(uid);
}

function ownerUser() {
  if (!OWNER) return null;
  for (const user of users.values()) {
    if (user.username === OWNER) return user;
  }
  return null;
}

function creatorId(conv) {
  if (conv.type !== 'group') return null;
  if (conv.id === 'general') {
    const owner = ownerUser();
    return owner ? owner.id : null;
  }
  return conv.creator || null;
}

function isGroupAdmin(conv, uid) {
  if (!conv || conv.type !== 'group' || !uid) return false;
  if (conv.id === 'general') return creatorId(conv) === uid;
  return conv.creator === uid || (Array.isArray(conv.admins) && conv.admins.includes(uid));
}

function statusModeOf(conv) {
  return conv && conv.type === 'group' && (conv.statusMode === 'admins' || conv.statusMode === 'all') ? conv.statusMode : 'off';
}

function isMuted(conv, uid) {
  return !!conv && conv.type === 'group' && !!conv.muted && !!conv.muted[uid];
}

function canPostGroupStatus(conv, uid) {
  if (!conv || conv.type !== 'group' || !isMember(conv, uid) || isMuted(conv, uid)) return false;
  const mode = statusModeOf(conv);
  return mode === 'all' || (mode === 'admins' && isGroupAdmin(conv, uid));
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

function mediaPath(image) {
  return path.join(MEDIA_DIR, image.id + '.' + image.ext);
}

function removeConvMedia(conv) {
  for (const message of conv.messages) {
    if (message.image) removeFile(mediaPath(message.image));
  }
}

function previewText(message) {
  return message.image ? '📷 ' + (message.text || 'Foto') : message.text;
}

function sniffImage(file) {
  let head = Buffer.alloc(12);
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    fs.readSync(fd, head, 0, 12, 0);
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  if (head.toString('latin1', 0, 8) === '\x89PNG\r\n\x1a\n') return 'png';
  const sig = head.toString('latin1', 0, 6);
  if (sig === 'GIF87a' || sig === 'GIF89a') return 'gif';
  if (head.toString('latin1', 0, 4) === 'RIFF' && head.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  return null;
}

function sniffVideo(file) {
  let head = Buffer.alloc(12);
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    fs.readSync(fd, head, 0, 12, 0);
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  if (head.toString('latin1', 4, 8) === 'ftyp') return 'mp4';
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) return 'webm';
  return null;
}

function deliverMessage(ctx, message) {
  clearTyping(ctx.conv.id, ctx.user.id);
  pushMessage(ctx.conv, message);
  reads[ctx.user.id] = reads[ctx.user.id] || {};
  reads[ctx.user.id][ctx.conv.id] = message.id;
  notifyMessage(ctx.conv, ctx.user, message);
}

function attachReply(conv, message, replyId) {
  if (!replyId) return;
  const target = conv.messages.find(item => item.id === replyId && !item.system);
  if (target) message.reply = { id: target.id, uid: target.uid, user: target.user, text: previewText(target).slice(0, 200) };
}

function pushMessage(conv, message) {
  conv.messages.push(message);
  if (conv.messages.length > MAX_HISTORY) {
    const dropped = conv.messages.shift();
    if (dropped.image) removeFile(mediaPath(dropped.image));
  }
  emit(conv, null, { conv: conv.id, ...message });
  saveChats();
}

function aikoConvId(uid) {
  return 'dm_' + [uid, AIKO_ID].sort().join('_');
}

function isAikoConv(conv) {
  return conv.type === 'dm' && conv.members.includes(AIKO_ID);
}

function ensureAiko(user) {
  const id = aikoConvId(user.id);
  let conv = convs.get(id);
  if (!conv) {
    conv = { id, type: 'dm', members: [user.id, AIKO_ID], created: Date.now(), messages: [] };
    convs.set(id, conv);
    pushMessage(conv, { id: nextId++, uid: AIKO_ID, user: AIKO.name, text: aiko.welcome(user.name), time: Date.now() });
  }
  return conv;
}

const aikoQueues = new Map();
const aikoRate = new Map();

function aikoGate(uid) {
  const now = Date.now();
  const list = (aikoRate.get(uid) || []).filter(time => now - time < 60000);
  list.push(now);
  aikoRate.set(uid, list);
  if (list.length <= AIKO_PER_MINUTE) return 0;
  return list.length === AIKO_PER_MINUTE + 1 ? 1 : 2;
}

function aikoHistory(conv, beforeId) {
  return conv.messages
    .filter(item => !item.system && item.id < beforeId)
    .slice(-6)
    .map(item => ({ role: item.uid === AIKO_ID ? 'assistant' : 'user', content: String(item.text || '').slice(0, 400) }));
}

async function aikoAnswer(conv, user, userMessage) {
  const gate = aikoGate(user.id);
  if (gate === 2) return;
  const started = Date.now();
  const keep = setInterval(() => setTyping(conv, AIKO), 2500);
  setTyping(conv, AIKO);
  let text;
  try {
    text = gate === 1
      ? aiko.slowDown
      : await aiko.reply({ text: userMessage.text, name: user.name, history: aikoHistory(conv, userMessage.id) });
  } catch {
    text = aiko.unknown;
  }
  try {
    const wait = Math.min(1800, 500 + text.length * 8) - (Date.now() - started);
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  } finally {
    clearInterval(keep);
    clearTyping(conv.id, AIKO_ID);
  }
  if (convs.get(conv.id) !== conv) return;
  const message = { id: nextId++, uid: AIKO_ID, user: AIKO.name, text: text.slice(0, 1800), time: Date.now() };
  pushMessage(conv, message);
  notifyMessage(conv, AIKO, message);
}

function aikoRespond(conv, user, userMessage) {
  const previous = aikoQueues.get(user.id) || Promise.resolve();
  const next = previous.then(() => aikoAnswer(conv, user, userMessage)).catch(() => {});
  aikoQueues.set(user.id, next);
  next.then(() => {
    if (aikoQueues.get(user.id) === next) aikoQueues.delete(user.id);
  });
}

function aikoDirect(user, text) {
  const dm = ensureAiko(user);
  const message = { id: nextId++, uid: AIKO_ID, user: AIKO.name, text, time: Date.now() };
  pushMessage(dm, message);
  notifyMessage(dm, AIKO, message);
}

function aikoMuteNotice(conv, user) {
  aikoDirect(user, `Usted ha sido silenciado en el grupo "${conv.name}". Comuníquese con un administrador lo más pronto posible para saber el motivo. Mientras tanto, sus mensajes no se enviarán al grupo.`);
}

function purgeAikoChats() {
  const now = Date.now();
  let changed = false;
  for (const conv of convs.values()) {
    if (!isAikoConv(conv)) continue;
    const owner = userById(conv.members.find(id => id !== AIKO_ID));
    if (!owner) continue;
    let lastUser = 0;
    for (const message of conv.messages) {
      if (!message.system && message.uid !== AIKO_ID && message.time > lastUser) lastUser = message.time;
    }
    if (!lastUser || now - lastUser < AIKO_IDLE) continue;
    removeConvMedia(conv);
    const message = { id: nextId++, uid: AIKO_ID, user: AIKO.name, text: aiko.welcome(owner.name), time: now };
    conv.messages = [message];
    reads[owner.id] = reads[owner.id] || {};
    reads[owner.id][conv.id] = message.id;
    changed = true;
    emit(conv, 'cleared', { conv: conv.id });
  }
  if (changed) {
    saveChats();
    emit(null, 'chats', {});
  }
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
  const preview = previewText(message);
  const chars = Array.from(preview);
  const text = chars.length > PUSH_PREVIEW_CHARS ? chars.slice(0, PUSH_PREVIEW_CHARS - 1).join('') + '…' : preview;
  const isDm = conv.type === 'dm';
  const recipients = (conv.members === null ? activeUsers().map(item => item.id) : conv.members)
    .filter(id => id !== sender.id && id !== AIKO_ID && !inForeground(id));
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
  const list = conv.members === null ? activeUsers() : conv.members.map(id => userById(id)).filter(Boolean);
  return list
    .map(user => {
      const out = { ...publicUser(user), online: online.has(user.id) };
      if (conv.type === 'group') {
        if (user.id === creatorId(conv)) out.creator = true;
        if (isGroupAdmin(conv, user.id)) out.admin = true;
        if (isMuted(conv, user.id)) out.muted = true;
      }
      return out;
    })
    .sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
}

function typingList(convId) {
  const list = [];
  for (const entry of typing.values()) {
    if (entry.conv !== convId) continue;
    const user = userById(entry.uid);
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
    last: last ? { text: previewText(last), time: last.time, user: last.user || '', mine: last.uid === user.id, system: !!last.system } : null,
    sortTime: last ? last.time : conv.created,
    unread: unreadOf(conv, user.id),
    typing: typingList(conv.id).filter(person => person.id !== user.id).map(person => person.name)
  };
  if (conv.type === 'dm') {
    const peerId = conv.members.find(id => id !== user.id);
    const peer = userById(peerId);
    out.name = peer ? peer.name : 'Usuario';
    out.avatar = peer ? peer.avatar || 0 : 0;
    out.peer = { id: peerId, online: online.has(peerId) };
    if (peer && peer.verified) out.verified = true;
    if (peer && peer.bot) out.bot = true;
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

function userBannerPath(user, ext = user.bannerExt || 'jpg') {
  return path.join(AVATAR_DIR, 'b_' + user.id + '.' + ext);
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

function imageTarget(req, res, user, data) {
  if (data.target !== AIKO_ID) return user;
  if (!isOwner(req, user)) {
    sendJson(res, 403, { error: 'forbidden' });
    return null;
  }
  return AIKO;
}

function saveProfile(target) {
  if (target === AIKO) saveAikoProfile();
  else saveUsers();
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
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
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

function deleteAccount(user) {
  const uid = user.id;

  for (const [token, session] of [...sessions]) {
    if (session.uid === uid) sessions.delete(token);
  }
  saveSessions();

  for (const [res, id] of [...clients]) {
    if (id !== uid) continue;
    clients.delete(res);
    views.delete(res);
    try {
      res.end();
    } catch {}
  }
  online.delete(uid);
  clearUserTyping(uid);

  for (const item of [...statuses.values()]) {
    if (item.uid !== uid) continue;
    removeFile(statusPath(item));
    statuses.delete(item.id);
  }
  saveStatuses();

  removeFile(userAvatarPath(user));
  removeFile(userBannerPath(user));
  push.removeUser(uid);

  for (const other of users.values()) {
    if (Array.isArray(other.contacts)) other.contacts = other.contacts.filter(id => id !== uid);
  }
  users.delete(uid);
  saveUsers();

  delete reads[uid];
  const groupsLeft = [];
  for (const conv of [...convs.values()]) {
    if (conv.members === null || !conv.members.includes(uid)) continue;
    if (conv.type === 'dm') {
      removeConvMedia(conv);
      convs.delete(conv.id);
      for (const id of conv.members) {
        if (reads[id]) delete reads[id][conv.id];
      }
      continue;
    }
    conv.members = conv.members.filter(id => id !== uid);
    if (conv.members.length === 0) {
      removeFile(groupAvatarPath(conv));
      removeConvMedia(conv);
      convs.delete(conv.id);
      continue;
    }
    if (conv.muted) delete conv.muted[uid];
    conv.admins = (Array.isArray(conv.admins) ? conv.admins : []).filter(id => id !== uid);
    if (conv.admins.length === 0) conv.admins = [conv.members[0]];
    groupsLeft.push(conv);
  }
  for (const conv of groupsLeft) announce(conv, `${user.name} eliminó su cuenta`);
  writeChats();

  emit(null, 'chats', {});
  emit(null, 'statuses', {});
  broadcastPresence();
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
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
        if (findByUsername(credentials.username) || reservedName(credentials.username)) return sendJson(res, 409, { error: 'taken' });
        if (OWNER && credentials.username.toLowerCase() === OWNER && !isLocalRequest(req)) return sendJson(res, 409, { error: 'taken' });
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
    return sendJson(res, 200, { user: { ...publicUser(user), owner: isOwner(req, user) } });
  }

  if (req.method === 'POST' && route === '/api/logout') {
    const token = params.get('token');
    if (token && sessions.delete(token)) saveSessions();
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && route === '/api/admin/users') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (!isOwner(req, user)) return sendJson(res, 403, { error: 'forbidden' });
    const list = [...users.values()]
      .filter(item => item.id !== user.id)
      .map(item => ({ ...publicUser(item), username: item.username, joined: item.joined || 0, online: online.has(item.id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return sendJson(res, 200, list);
  }

  if (req.method === 'POST' && route === '/api/admin/delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (!isOwner(req, user)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const target = users.get(String(data.id || ''));
      if (!target || target.id === user.id) return sendJson(res, 404, { error: 'none' });
      deleteAccount(target);
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/account/delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (throttled(req)) return sendJson(res, 429, { error: 'rate' });
    try {
      const data = JSON.parse(await readBody(req, 5000));
      const password = String(data.password || '');
      if (!user.hash || !password || !(await checkPassword(user, password))) {
        return sendJson(res, 403, { error: 'credentials' });
      }
      deleteAccount(user);
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
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
    ensureAiko(user);
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
    if (params.get('id') === AIKO_ID) {
      return sendJson(res, 200, { ...publicUser(AIKO), online: true, contact: false, joined: AIKO.joined });
    }
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
      if (data.userId === AIKO_ID) return sendJson(res, 200, summary(ensureAiko(user), user));
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
      if (Array.isArray(data.members) && data.members.map(String).includes(AIKO_ID)) return sendJson(res, 400, { error: 'aiko' });
      const ids = [...new Set(Array.isArray(data.members) ? data.members.map(String) : [])]
        .filter(id => id !== user.id && users.get(id) && users.get(id).hash)
        .slice(0, 100);
      if (!name || ids.length === 0) return sendJson(res, 400, { error: 'invalid' });
      const conv = {
        id: 'g_' + crypto.randomBytes(6).toString('hex'),
        type: 'group',
        name,
        members: [user.id, ...ids],
        creator: user.id,
        admins: [user.id],
        statusMode: 'off',
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
      const conv = item.gid ? convs.get(item.gid) : null;
      const key = conv ? 'g:' + conv.id : item.uid;
      if (!groups.has(key)) {
        groups.set(key, conv
          ? { user: { id: conv.id, name: conv.name, avatar: conv.avatar || 0, group: true }, mine: false, items: [] }
          : { user: publicUser(owner), mine, items: [] });
      }
      const entry = {
        id: item.id,
        kind: item.kind,
        caption: item.caption,
        time: item.time,
        seen: mine || item.views.some(view => view.uid === user.id)
      };
      if (conv) {
        entry.by = owner.name;
        entry.mine = mine;
        entry.canDelete = mine || isGroupAdmin(conv, user.id);
      }
      if (mine) {
        entry.views = item.views
          .map(view => ({ user: users.get(view.uid), time: view.time }))
          .filter(view => view.user)
          .map(view => ({ ...publicUser(view.user), time: view.time }));
      }
      groups.get(key).items.push(entry);
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
    const declared = Number(req.headers['content-length']) || 0;
    if (declared > MAX_STATUS_BYTES) {
      req.resume();
      return sendJson(res, 413, { error: 'size' });
    }
    const gid = String(params.get('group') || '');
    if (gid && !canPostGroupStatus(convs.get(gid), user.id)) {
      req.resume();
      return sendJson(res, 403, { error: 'forbidden' });
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
    if (gid) item.gid = gid;
    fs.mkdirSync(STATUS_DIR, { recursive: true });
    const file = statusPath(item);
    const out = fs.createWriteStream(file);
    let failed = false;
    let received = 0;
    const fail = (status = 400, error = 'invalid') => {
      if (failed) return;
      failed = true;
      req.unpipe(out);
      out.destroy();
      removeFile(file);
      if (!res.headersSent) {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', Connection: 'close' });
        res.end(JSON.stringify({ error }));
      }
      req.resume();
    };
    req.on('data', chunk => {
      received += chunk.length;
      if (received > MAX_STATUS_BYTES) fail(413, 'size');
    });
    req.on('error', () => fail());
    req.on('close', () => {
      if (!req.complete) fail();
    });
    out.on('error', () => fail());
    out.on('finish', () => {
      if (failed) return;
      if (!out.bytesWritten) {
        failed = true;
        removeFile(file);
        return sendJson(res, 400, { error: 'invalid' });
      }
      const real = item.kind === 'video' ? sniffVideo(file) : sniffImage(file);
      const expected = ext === 'mov' ? 'mp4' : ext;
      if (real !== expected) {
        failed = true;
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
      const target = item && item.gid ? convs.get(item.gid) : null;
      if (!item || (item.uid !== user.id && !isGroupAdmin(target, user.id))) return sendJson(res, 404, { error: 'none' });
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
      typing: typingList(ctx.conv.id),
      group: ctx.conv.type === 'group'
        ? {
            statusMode: statusModeOf(ctx.conv),
            canConfig: isGroupAdmin(ctx.conv, ctx.user.id),
            canPost: canPostGroupStatus(ctx.conv, ctx.user.id),
            muted: isMuted(ctx.conv, ctx.user.id)
          }
        : null
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

  if (req.method === 'POST' && route === '/api/group-settings') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type !== 'group') return sendJson(res, 400, { error: 'invalid' });
    if (!isGroupAdmin(ctx.conv, ctx.user.id)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const mode = String(data.statusMode || '');
      if (mode !== 'off' && mode !== 'admins' && mode !== 'all') return sendJson(res, 400, { error: 'invalid' });
      if (statusModeOf(ctx.conv) !== mode) {
        ctx.conv.statusMode = mode;
        const texts = {
          off: `${ctx.user.name} desactivó los estados del grupo`,
          admins: `${ctx.user.name} permitió que solo los admins publiquen estados en el grupo`,
          all: `${ctx.user.name} permitió que todos publiquen estados en el grupo`
        };
        announce(ctx.conv, texts[mode]);
        saveChats();
        emit(ctx.conv, 'group', { conv: ctx.conv.id, statusMode: mode });
        emit(null, 'statuses', {});
      }
      return sendJson(res, 200, { statusMode: mode });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/mute') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type !== 'group') return sendJson(res, 400, { error: 'invalid' });
    if (!isGroupAdmin(ctx.conv, ctx.user.id)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const target = userById(String(data.userId || ''));
      const muted = data.muted !== false;
      if (!target || target.id === AIKO_ID || target.id === ctx.user.id || !isMember(ctx.conv, target.id) || target.id === creatorId(ctx.conv)) {
        return sendJson(res, 400, { error: 'invalid' });
      }
      if (isGroupAdmin(ctx.conv, target.id) && creatorId(ctx.conv) !== ctx.user.id) {
        return sendJson(res, 403, { error: 'forbidden' });
      }
      if (isMuted(ctx.conv, target.id) !== muted) {
        if (!ctx.conv.muted) ctx.conv.muted = {};
        if (muted) {
          ctx.conv.muted[target.id] = { by: ctx.user.id, time: Date.now() };
          announce(ctx.conv, `${ctx.user.name} silenció a ${target.name}`);
          aikoMuteNotice(ctx.conv, target);
        } else {
          delete ctx.conv.muted[target.id];
          announce(ctx.conv, `${ctx.user.name} quitó el silencio a ${target.name}`);
          aikoDirect(target, `Ya puede volver a escribir en el grupo "${ctx.conv.name}". Un administrador le quitó el silencio.`);
        }
        saveChats();
        emit(ctx.conv, 'group', { conv: ctx.conv.id, muted: muted, uid: target.id });
      }
      return sendJson(res, 200, { muted });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/group-avatar') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type !== 'group') return sendJson(res, 400, { error: 'invalid' });
    try {
      const data = JSON.parse(await readBody(req, MAX_IMAGE_BODY));
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
    const owner = userById(String(params.get('id') || ''));
    if (!owner || !owner.avatar) return sendJson(res, 404, { error: 'none' });
    return sendAvatar(res, userAvatarPath(owner), owner.avatarExt || 'jpg');
  }

  if (req.method === 'POST' && route === '/api/profile-avatar') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, MAX_IMAGE_BODY));
      const target = imageTarget(req, res, user, data);
      if (!target) return;
      if (data.remove) {
        removeFile(userAvatarPath(target));
        target.avatar = 0;
      } else {
        const image = parseImage(data.image);
        if (!image) return sendJson(res, 400, { error: 'invalid' });
        fs.mkdirSync(AVATAR_DIR, { recursive: true });
        if (image.ext !== (target.avatarExt || 'jpg')) removeFile(userAvatarPath(target));
        target.avatarExt = image.ext;
        fs.writeFileSync(userAvatarPath(target, image.ext), image.buffer);
        target.avatar = Date.now();
      }
      saveProfile(target);
      emit(null, 'profile', { id: target.id, avatar: target.avatar, banner: target.banner || 0 });
      return sendJson(res, 200, { avatar: target.avatar });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/user-banner') {
    const viewer = authorize(res, params.get('token'));
    if (!viewer) return;
    const owner = userById(String(params.get('id') || ''));
    if (!owner || !owner.banner) return sendJson(res, 404, { error: 'none' });
    return sendAvatar(res, userBannerPath(owner), owner.bannerExt || 'jpg');
  }

  if (req.method === 'POST' && route === '/api/profile-banner') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, MAX_IMAGE_BODY));
      const target = imageTarget(req, res, user, data);
      if (!target) return;
      if (data.remove) {
        removeFile(userBannerPath(target));
        target.banner = 0;
      } else {
        const image = parseImage(data.image);
        if (!image) return sendJson(res, 400, { error: 'invalid' });
        fs.mkdirSync(AVATAR_DIR, { recursive: true });
        if (image.ext !== (target.bannerExt || 'jpg')) removeFile(userBannerPath(target));
        target.bannerExt = image.ext;
        fs.writeFileSync(userBannerPath(target, image.ext), image.buffer);
        target.banner = Date.now();
      }
      saveProfile(target);
      emit(null, 'profile', { id: target.id, avatar: target.avatar || 0, banner: target.banner });
      return sendJson(res, 200, { banner: target.banner });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/send-image') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (isAikoConv(ctx.conv)) {
      req.resume();
      return sendJson(res, 400, { error: 'aiko' });
    }
    if (isMuted(ctx.conv, ctx.user.id)) {
      req.resume();
      return sendJson(res, 403, { error: 'muted' });
    }
    const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    const ext = IMAGE_TYPES[mime];
    if (!ext) {
      req.resume();
      return sendJson(res, 415, { error: 'type' });
    }
    const imageId = crypto.randomBytes(8).toString('hex');
    const image = { id: imageId, ext };
    const file = mediaPath(image);
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
    const out = fs.createWriteStream(file);
    let size = 0;
    let failed = false;
    const fail = (status, error) => {
      if (failed) return;
      failed = true;
      req.unpipe(out);
      out.destroy();
      removeFile(file);
      if (!res.headersSent) {
        res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', Connection: 'close' });
        res.end(JSON.stringify({ error }));
      }
      req.resume();
    };
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_CHAT_IMAGE_BYTES) fail(413, 'size');
    });
    req.on('error', () => fail(400, 'invalid'));
    req.on('close', () => {
      if (!req.complete) fail(400, 'invalid');
    });
    out.on('error', () => fail(400, 'invalid'));
    out.on('finish', () => {
      if (failed) return;
      if (!out.bytesWritten || sniffImage(file) !== ext) {
        failed = true;
        removeFile(file);
        return sendJson(res, 400, { error: 'invalid' });
      }
      const width = Math.min(Math.max(parseInt(params.get('w'), 10) || 0, 0), 20000);
      const height = Math.min(Math.max(parseInt(params.get('h'), 10) || 0, 0), 20000);
      if (width && height) {
        image.w = width;
        image.h = height;
      }
      const message = {
        id: nextId++,
        uid: ctx.user.id,
        user: ctx.user.name,
        text: String(params.get('caption') || '').trim().slice(0, 1000),
        image,
        time: Date.now()
      };
      attachReply(ctx.conv, message, Number(params.get('replyTo')) || 0);
      deliverMessage(ctx, message);
      sendJson(res, 200, message);
    });
    req.pipe(out);
    return;
  }

  if (req.method === 'GET' && route === '/api/chat-media') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const imageId = String(params.get('id') || '');
    const message = /^[a-f0-9]{16}$/.test(imageId) && ctx.conv.messages.find(item => item.image && item.image.id === imageId);
    if (!message) return sendJson(res, 404, { error: 'none' });
    const file = mediaPath(message.image);
    return fs.stat(file, (err, stat) => {
      if (err || !stat.size) return sendJson(res, 404, { error: 'none' });
      const type = Object.keys(IMAGE_TYPES).find(key => IMAGE_TYPES[key] === message.image.ext) || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': stat.size,
        'Cache-Control': 'private, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      });
      const stream = fs.createReadStream(file);
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    });
  }

  if (req.method === 'POST' && route === '/api/send') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    try {
      const data = JSON.parse(await readBody(req));
      const text = String(data.text || '').trim().slice(0, 2000);
      if (!text) return sendJson(res, 400, { error: 'invalid' });
      if (isMuted(ctx.conv, ctx.user.id)) {
        return sendJson(res, 403, { error: 'muted' });
      }
      const message = { id: nextId++, uid: ctx.user.id, user: ctx.user.name, text, time: Date.now() };
      attachReply(ctx.conv, message, Number(data.replyTo) || 0);
      deliverMessage(ctx, message);
      if (isAikoConv(ctx.conv)) aikoRespond(ctx.conv, ctx.user, message);
      return sendJson(res, 200, message);
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET') return serveStatic(req, res);

  res.writeHead(405);
  res.end('Method not allowed');
});

server.headersTimeout = 30000;
server.requestTimeout = 600000;

purgeStatuses();
setInterval(purgeStatuses, 60000);
purgeAikoChats();
setInterval(purgeAikoChats, 60000);

setInterval(() => {
  for (const res of clients.keys()) res.write('event: ping\ndata: 1\n\n');
  const now = Date.now();
  for (const [ip, list] of attempts) {
    if (!list.some(time => now - time < 60000)) attempts.delete(ip);
  }
  for (const [uid, list] of aikoRate) {
    if (!list.some(time => now - time < 60000)) aikoRate.delete(uid);
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
