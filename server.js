const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const https = require('https');
const os = require('os');
const zlib = require('zlib');
const { spawn } = require('child_process');
const push = require('./push');
const aiko = require('./aiko');

const scrypt = promisify(crypto.scrypt);
const AIKO = aiko.user;
const AIKO_ID = AIKO.id;
const AIKO_PER_MINUTE = 12;
const MAX_REPORTS = 3;
const REPORT_WINDOW = 10 * 60 * 1000;
const MAX_REPORT_TEXT = 1000;

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
const STICKER_DIR = path.join(__dirname, 'stickers');
const MAX_STICKERS = 80;
const MAX_STICKER_SOURCE = 25 * 1024 * 1024;
const STICKER_SIZE = 512;
const STICKER_MAX_BYTES = 900 * 1024;
const STICKER_MAX_SECONDS = 8;
const STICKER_SOURCES = {
  'image/jpeg': { ext: 'jpg', animated: false },
  'image/png': { ext: 'png', animated: false },
  'image/webp': { ext: 'webp', animated: null },
  'image/gif': { ext: 'gif', animated: true },
  'video/mp4': { ext: 'mp4', animated: true },
  'video/webm': { ext: 'webm', animated: true },
  'video/quicktime': { ext: 'mov', animated: true }
};
const STICKER_FPS_CAP = 20;
const STICKER_PASSTHROUGH_BYTES = 2 * 1024 * 1024;
const STICKER_ATTEMPTS = [
  { divide: 1, quality: 60, size: 384 },
  { divide: 1, quality: 45, size: 320 },
  { divide: 1, quality: 35, size: 256 },
  { divide: 2, quality: 30, size: 256 }
];
const MAX_CHAT_IMAGE_BYTES = 16 * 1024 * 1024;
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
const AUDIO_TYPES = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/opus': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
  'audio/flac': 'flac',
  'audio/x-flac': 'flac',
  'audio/webm': 'webm'
};
const AUDIO_MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', webm: 'audio/webm' };
const MAX_CHAT_AUDIO_BYTES = 25 * 1024 * 1024;
const VIDEO_TYPES = { 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };
const VIDEO_MIME = { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' };
const MAX_CHAT_VIDEO_BYTES = 50 * 1024 * 1024;
const DOC_EXTS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'json', 'md', 'rtf', 'odt', 'ods', 'odp', 'zip', 'rar', '7z']);
const MAX_CHAT_DOC_BYTES = 25 * 1024 * 1024;
const LINK_RE = /https?:\/\/[^\s<>"']+/gi;
const STATUS_DIR = path.join(__dirname, 'statuses');
const STATUS_FILE = path.join(__dirname, 'statuses.json');
const STATUS_TTL = 24 * 3600 * 1000;
const AIKO_IDLE = 24 * 3600 * 1000;
const LINK_TTL = 2 * 60 * 1000;
const LINK_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_LINK_PENDING = 200;
const MAX_BOT_SESSIONS = 10;
const BOT_SESSION_DAYS = 365;
const MAX_STATUS_BYTES = 64 * 1024 * 1024;
const KEY_FILE = path.join(__dirname, 'data.key');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, 'backups');
const BACKUP_EVERY = Math.min(168, Math.max(1, Number(process.env.BACKUP_HOURS) || 6)) * 3600000;
const BACKUP_KEEP = Math.max(1, Math.floor(Number(process.env.BACKUP_KEEP) || 20));
const MAGIC = Buffer.from('ZENC1');
const ENCRYPTED_FILES = new Set([CHATS_FILE, SESSIONS_FILE]);
const TLS_CERT = process.env.TLS_CERT || '';
const TLS_KEY = process.env.TLS_KEY || '';
const REQUIRE_HTTPS = process.env.REQUIRE_HTTPS === '1';
const QUERY_TOKEN = process.env.ALLOW_QUERY_TOKEN !== '0';
const COOKIE_NAME = 'zentry_token';
const COOKIE_ROUTES = new Set(['/api/events', '/api/user-avatar', '/api/user-banner', '/api/group-avatar', '/api/chat-media', '/api/status-media', '/api/sticker-file']);
const LOCK_FAILS = 5;
const LOCK_BASE = 60 * 1000;
const LOCK_MAX = 30 * 60 * 1000;
const LOCK_RESET = 15 * 60 * 1000;
const MAX_LOCK_ENTRIES = 5000;
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

function loadKey() {
  if (process.env.ZENTRY_KEY) return crypto.scryptSync(process.env.ZENTRY_KEY, 'zentry-data-key', 32);
  let stored = null;
  try {
    stored = fs.readFileSync(KEY_FILE, 'utf8').trim();
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (stored !== null) {
    if (/^[0-9a-f]{64}$/i.test(stored)) return Buffer.from(stored, 'hex');
    throw new Error('data.key no tiene un formato válido (64 caracteres hexadecimales)');
  }
  const generated = crypto.randomBytes(32);
  fs.writeFileSync(KEY_FILE, generated.toString('hex'), { mode: 0o600 });
  return generated;
}

const DATA_KEY = loadKey();

function isEncryptedBuffer(buffer) {
  return buffer.length > MAGIC.length && buffer.subarray(0, MAGIC.length).equals(MAGIC);
}

function encryptText(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', DATA_KEY, iv);
  const body = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return Buffer.concat([MAGIC, iv, cipher.getAuthTag(), body]);
}

function decodeStored(buffer) {
  if (!isEncryptedBuffer(buffer)) return JSON.parse(buffer.toString('utf8'));
  const start = MAGIC.length;
  const decipher = crypto.createDecipheriv('aes-256-gcm', DATA_KEY, buffer.subarray(start, start + 12));
  decipher.setAuthTag(buffer.subarray(start + 12, start + 28));
  const text = Buffer.concat([decipher.update(buffer.subarray(start + 28)), decipher.final()]).toString('utf8');
  return JSON.parse(text);
}

function writeJson(file, value) {
  const json = JSON.stringify(value);
  const temp = file + '.tmp';
  fs.writeFileSync(temp, ENCRYPTED_FILES.has(file) ? encryptText(json) : json);
  fs.renameSync(temp, file);
}

function backupDirs() {
  try {
    return fs.readdirSync(BACKUP_DIR, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort().reverse();
  } catch {
    return [];
  }
}

function readJson(file, fallback) {
  let buffer;
  try {
    buffer = fs.readFileSync(file);
  } catch {
    return fallback;
  }
  try {
    return decodeStored(buffer);
  } catch {}
  const name = path.basename(file);
  const aside = file + '.corrupt-' + Date.now();
  for (const dir of backupDirs()) {
    try {
      const value = decodeStored(fs.readFileSync(path.join(BACKUP_DIR, dir, name)));
      fs.renameSync(file, aside);
      writeJson(file, value);
      console.log(`${name} estaba dañado, se restauró desde la copia ${dir} (el original quedó como ${path.basename(aside)})`);
      return value;
    } catch {}
  }
  if (isEncryptedBuffer(buffer)) {
    console.error(`No se pudo descifrar ${name}: la clave (data.key o ZENTRY_KEY) no coincide o el archivo está dañado. No se modificó nada.`);
    process.exit(1);
  }
  try {
    fs.renameSync(file, aside);
  } catch {}
  console.log(`${name} estaba dañado y no hay copia válida; se apartó como ${path.basename(aside)}`);
  return fallback;
}

const users = new Map(readJson(USERS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));
const sessions = new Map(Object.entries(readJson(SESSIONS_FILE, {})));
const savedChats = readJson(CHATS_FILE, {});
const convs = new Map(Object.entries(savedChats.convs || {}));
const reads = savedChats.reads || {};
const clears = savedChats.clears || {};
const statuses = new Map(readJson(STATUS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));
const SPONSORS_FILE = path.join(__dirname, 'sponsors.json');
const CHANNELS_FILE = path.join(__dirname, 'channels.json');
const MAX_SPONSORS = 30;
const MAX_CHANNELS_PER_USER = 5;
const MAX_CHANNEL_POSTS = 300;
const MAX_POST_CHARS = 2000;
const sponsors = readJson(SPONSORS_FILE, []).filter(item => item && item.id);
const channels = new Map(readJson(CHANNELS_FILE, []).filter(item => item && item.id).map(item => [item.id, item]));

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
    writeJson(USERS_FILE, [...users.values()]);
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
    writeJson(AIKO_PROFILE_FILE, {
      avatar: AIKO.avatar || 0,
      banner: AIKO.banner || 0,
      avatarExt: AIKO.avatarExt || 'jpg',
      bannerExt: AIKO.bannerExt || 'jpg'
    });
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
    writeJson(SESSIONS_FILE, Object.fromEntries(sessions));
  } catch {}
}

function saveStatuses() {
  try {
    writeJson(STATUS_FILE, [...statuses.values()]);
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

function saveSponsors() {
  try {
    writeJson(SPONSORS_FILE, sponsors);
  } catch {}
}

function saveChannels() {
  try {
    writeJson(CHANNELS_FILE, [...channels.values()]);
  } catch {}
}

function cleanUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href.slice(0, 500) : '';
  } catch {
    return '';
  }
}

function channelSummary(channel, user) {
  const last = channel.posts.length ? channel.posts[channel.posts.length - 1] : null;
  return {
    id: channel.id,
    name: channel.name,
    desc: channel.desc || '',
    followers: channel.followers.length,
    following: channel.followers.includes(user.id),
    mine: channel.owner === user.id,
    created: channel.created,
    last: last ? { text: last.text.slice(0, 120), time: last.time } : null
  };
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
    writeJson(CHATS_FILE, { convs: Object.fromEntries(convs), reads, clears });
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

function backupTargets() {
  return [USERS_FILE, SESSIONS_FILE, CHATS_FILE, STATUS_FILE, SPONSORS_FILE, CHANNELS_FILE, AIKO_PROFILE_FILE, path.join(__dirname, 'push.json'), path.join(__dirname, 'vapid.json')];
}

function backupStamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
}

function runBackup() {
  try {
    writeChats();
    const dir = path.join(BACKUP_DIR, backupStamp(new Date()));
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    for (const file of backupTargets()) {
      if (fs.existsSync(file)) fs.copyFileSync(file, path.join(dir, path.basename(file)));
    }
    for (const old of backupDirs().slice(BACKUP_KEEP)) {
      fs.rmSync(path.join(BACKUP_DIR, old), { recursive: true, force: true });
    }
  } catch {}
}

function deviceLabel(req) {
  const ua = String((req && req.headers['user-agent']) || '');
  const os = /Android/i.test(ua) ? 'Android'
    : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
    : /Windows/i.test(ua) ? 'Windows'
    : /Mac OS X|Macintosh/i.test(ua) ? 'macOS'
    : /CrOS/i.test(ua) ? 'ChromeOS'
    : /Linux/i.test(ua) ? 'Linux'
    : 'dispositivo desconocido';
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /OPR\/|Opera/.test(ua) ? 'Opera'
    : /SamsungBrowser/.test(ua) ? 'Samsung Internet'
    : /Firefox|FxiOS/.test(ua) ? 'Firefox'
    : /Chrome|CriOS/.test(ua) ? 'Chrome'
    : /Safari/.test(ua) ? 'Safari'
    : 'Navegador';
  return browser + ' en ' + os;
}

function sessionKey(token) {
  return crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
}

const linkRequests = new Map();

function normalizeLinkCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function findLink(code) {
  const wanted = normalizeLinkCode(code);
  if (wanted.length !== 8) return null;
  for (const item of linkRequests.values()) {
    if (item.code === wanted && Date.now() - item.created <= LINK_TTL) return item;
  }
  return null;
}

function newLinkCode() {
  let code;
  do {
    code = Array.from(crypto.randomBytes(8), byte => LINK_ALPHABET[byte % LINK_ALPHABET.length]).join('');
  } while (findLink(code));
  return code;
}

function sameSecret(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function purgeLinks() {
  const now = Date.now();
  let dropped = false;
  for (const [id, item] of [...linkRequests]) {
    if (now - item.created <= LINK_TTL) continue;
    if (item.status === 'approved' && item.token) {
      dropSession(item.token);
      dropped = true;
    }
    linkRequests.delete(id);
  }
  if (dropped) saveSessions();
}

function dropSession(token) {
  sessions.delete(token);
  for (const [res, view] of [...views]) {
    if (view.token !== token) continue;
    clients.delete(res);
    views.delete(res);
    try {
      res.end();
    } catch {}
  }
}

function createSession(uid, req, extra) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session = { uid, created: now, last: now, device: extra && extra.device ? extra.device : deviceLabel(req) };
  if (extra && extra.kind) session.kind = extra.kind;
  if (extra && extra.ttl) session.ttl = extra.ttl;
  sessions.set(token, session);
  saveSessions();
  return token;
}

function userFromToken(token) {
  if (typeof token !== 'string' || !token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() - session.created > (session.ttl || SESSION_DAYS) * 86400000) {
    sessions.delete(token);
    saveSessions();
    return null;
  }
  if (Date.now() - (session.last || 0) > 300000) {
    session.last = Date.now();
    saveSessions();
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

function isSecure(req) {
  return !!req.socket.encrypted || String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase() === 'https';
}

function bearerToken(req) {
  const match = /^Bearer\s+(\S{1,200})$/i.exec(String(req.headers.authorization || ''));
  if (match) return match[1];
  return String(req.headers['x-zentry-token'] || '').trim().slice(0, 200);
}

function cookieToken(req) {
  const match = new RegExp('(?:^|;\\s*)' + COOKIE_NAME + '=([0-9a-f]{64})(?:;|$)').exec(String(req.headers.cookie || ''));
  return match ? match[1] : '';
}

function sessionCookie(req, token, maxAge) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}` + (isSecure(req) ? '; Secure' : '');
}

function applySecurityHeaders(res, req) {
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(), payment=(), usb=(), serial=()');
  if (isSecure(req)) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
}

function clientIp(req) {
  const addr = String(req.socket.remoteAddress || '');
  const loopback = addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
  if (!loopback) return addr;
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').map(part => part.trim()).filter(Boolean);
  return forwarded.length ? forwarded[forwarded.length - 1] : addr;
}

function throttled(req, bucket = 'auth', limit = 10) {
  if (bucket === 'link' && isLocalRequest(req)) return false;
  const key = bucket + ':' + clientIp(req);
  const now = Date.now();
  const list = (attempts.get(key) || []).filter(time => now - time < 60000);
  list.push(now);
  attempts.set(key, list);
  return list.length > limit;
}

const loginFails = new Map();

function lockRemaining(username) {
  const entry = loginFails.get(String(username).toLowerCase());
  return entry && entry.until > Date.now() ? Math.ceil((entry.until - Date.now()) / 1000) : 0;
}

function noteLoginFail(username) {
  const key = String(username).toLowerCase();
  const now = Date.now();
  let entry = loginFails.get(key);
  if (!entry || (entry.until <= now && now - entry.last > LOCK_RESET)) {
    if (!entry && loginFails.size >= MAX_LOCK_ENTRIES) return;
    entry = { count: 0, level: 0, until: 0, last: now };
  }
  entry.count++;
  entry.last = now;
  if (entry.count >= LOCK_FAILS) {
    entry.level++;
    entry.count = 0;
    entry.until = now + Math.min(LOCK_BASE * 2 ** (entry.level - 1), LOCK_MAX);
  }
  loginFails.set(key, entry);
}

function lockExempt(req, username) {
  return !!OWNER && String(username).toLowerCase() === OWNER && isLocalRequest(req);
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
  if (conv.id === 'general') return creatorId(conv) === uid || (Array.isArray(conv.admins) && conv.admins.includes(uid));
  return conv.creator === uid || (Array.isArray(conv.admins) && conv.admins.includes(uid));
}

function statusModeOf(conv) {
  return conv && conv.type === 'group' && (conv.statusMode === 'admins' || conv.statusMode === 'all') ? conv.statusMode : 'off';
}

const TEMP_TTLS = { 0: '', 86400: '24 horas', 604800: '7 días', 7776000: '90 días' };

function tempTtlOf(conv) {
  return conv && Object.prototype.hasOwnProperty.call(TEMP_TTLS, conv.tempTtl) ? conv.tempTtl : 0;
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
    if (message.sticker) removeFile(mediaPath(message.sticker));
    if (message.audio) removeFile(mediaPath(message.audio));
    if (message.video) removeFile(mediaPath(message.video));
    if (message.doc) removeFile(mediaPath(message.doc));
  }
}

function previewText(message) {
  if (message.audio) return '♪ ' + (message.audio.name || 'Música');
  if (message.video) return '▶ Video';
  if (message.doc) return '▤ ' + (message.doc.name || 'Documento');
  if (message.sticker) return '▣ Sticker';
  return message.image ? '📷 ' + (message.text || 'Foto') : message.text;
}

function sniffDoc(file, ext) {
  let head = Buffer.alloc(512);
  let read = 0;
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    read = fs.readSync(fd, head, 0, 512, 0);
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
  if (!read) return false;
  const text = head.toString('latin1', 0, Math.min(read, 8));
  if (ext === 'pdf') return text.startsWith('%PDF');
  if (['docx', 'xlsx', 'pptx', 'odt', 'ods', 'odp', 'zip'].includes(ext)) return text.startsWith('PK');
  if (['doc', 'xls', 'ppt'].includes(ext)) return head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0;
  if (ext === 'rar') return text.startsWith('Rar!');
  if (ext === '7z') return head[0] === 0x37 && head[1] === 0x7a && head[2] === 0xbc && head[3] === 0xaf;
  for (let i = 0; i < read; i++) {
    if (head[i] === 0) return false;
  }
  return true;
}

function receiveUpload(req, res, ctx, options) {
  const file = mediaPath(options.media);
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
    if (size > options.max) fail(413, 'size');
  });
  req.on('error', () => fail(400, 'invalid'));
  req.on('close', () => {
    if (!req.complete) fail(400, 'invalid');
  });
  out.on('error', () => fail(400, 'invalid'));
  out.on('finish', () => {
    if (failed) return;
    if (!out.bytesWritten || !options.check(file)) {
      failed = true;
      removeFile(file);
      return sendJson(res, 400, { error: 'invalid' });
    }
    options.media.size = out.bytesWritten;
    const message = { id: nextId++, uid: ctx.user.id, user: ctx.user.name, text: '', time: Date.now() };
    message[options.field] = options.media;
    attachReply(ctx.conv, message, options.replyTo);
    deliverMessage(ctx, message);
    sendJson(res, 200, message);
  });
  req.pipe(out);
}

function messageMedia(message) {
  return message.image || message.sticker || message.audio || message.video || message.doc || null;
}

function sniffAudio(file) {
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
  if (head.toString('latin1', 0, 3) === 'ID3') return 'mp3';
  if (head[0] === 0xff && (head[1] & 0xf6) === 0xf0) return 'aac';
  if (head[0] === 0xff && (head[1] & 0xe0) === 0xe0) return 'mp3';
  if (head.toString('latin1', 4, 8) === 'ftyp') return 'm4a';
  if (head.toString('latin1', 0, 4) === 'OggS') return 'ogg';
  if (head.toString('latin1', 0, 4) === 'RIFF' && head.toString('latin1', 8, 12) === 'WAVE') return 'wav';
  if (head.toString('latin1', 0, 4) === 'fLaC') return 'flac';
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) return 'webm';
  return null;
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

const MENTION_RE = /(^|[^A-Za-z0-9_.-])@([A-Za-z0-9_.-]{3,20})/g;

function attachMentions(conv, message) {
  if (conv.type !== 'group' || !message.text) return;
  const byName = new Map();
  const list = conv.members === null ? activeUsers() : conv.members.map(id => users.get(id)).filter(Boolean);
  for (const user of list) byName.set(user.name.toLowerCase(), user);
  const found = new Map();
  for (const match of message.text.matchAll(MENTION_RE)) {
    let candidate = match[2];
    while (!byName.has(candidate.toLowerCase()) && /[.-]$/.test(candidate)) candidate = candidate.slice(0, -1);
    const user = byName.get(candidate.toLowerCase());
    if (user && !found.has(user.id)) found.set(user.id, { id: user.id, name: user.name });
  }
  if (found.size) message.mentions = [...found.values()];
}

function removeMessageMedia(message) {
  if (message.image) removeFile(mediaPath(message.image));
  if (message.sticker) removeFile(mediaPath(message.sticker));
  if (message.audio) removeFile(mediaPath(message.audio));
  if (message.video) removeFile(mediaPath(message.video));
  if (message.doc) removeFile(mediaPath(message.doc));
}

function purgeExpiredMessages() {
  const now = Date.now();
  let changed = false;
  for (const conv of convs.values()) {
    const gone = conv.messages.filter(message => message.expires && message.expires <= now);
    if (!gone.length) continue;
    gone.forEach(removeMessageMedia);
    conv.messages = conv.messages.filter(message => !(message.expires && message.expires <= now));
    emit(conv, 'expired', { conv: conv.id, ids: gone.map(message => message.id) });
    changed = true;
  }
  if (changed) {
    saveChats();
    emit(null, 'chats', {});
  }
}

function pushMessage(conv, message) {
  const ttl = tempTtlOf(conv);
  if (ttl && !message.system) message.expires = (message.time || Date.now()) + ttl * 1000;
  conv.messages.push(message);
  if (conv.messages.length > MAX_HISTORY) {
    const dropped = conv.messages.shift();
    if (dropped.image) removeFile(mediaPath(dropped.image));
    if (dropped.sticker) removeFile(mediaPath(dropped.sticker));
    if (dropped.audio) removeFile(mediaPath(dropped.audio));
    if (dropped.video) removeFile(mediaPath(dropped.video));
    if (dropped.doc) removeFile(mediaPath(dropped.doc));
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
const reportRate = new Map();

function reportLimited(uid) {
  const now = Date.now();
  const list = (reportRate.get(uid) || []).filter(time => now - time < REPORT_WINDOW);
  const limited = list.length >= MAX_REPORTS;
  if (!limited) list.push(now);
  reportRate.set(uid, list);
  return limited;
}

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
    if (!owner || owner.username === OWNER) continue;
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
  const mentioned = new Set((message.mentions || []).map(item => item.id));
  const payload = {
    title: isDm ? sender.name : conv.name,
    conv: conv.id,
    id: message.id,
    uid: sender.id,
    sender: sender.name,
    type: conv.type,
    time: message.time
  };
  push.send(recipients.filter(id => !mentioned.has(id)), {
    ...payload,
    body: isDm ? text : `${sender.name}: ${text}`
  });
  push.send(recipients.filter(id => mentioned.has(id)), {
    ...payload,
    body: `${sender.name} te mencionó: ${text}`
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

function clearedOf(uid, convId) {
  return (clears[uid] && clears[uid][convId]) || 0;
}

function lastOf(conv, cut = 0) {
  for (let i = conv.messages.length - 1; i >= 0; i--) {
    if (conv.messages[i].id <= cut) break;
    if (!conv.messages[i].system) return conv.messages[i];
  }
  const tail = conv.messages[conv.messages.length - 1];
  return tail && tail.id > cut ? tail : null;
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
  const real = lastOf(conv);
  const last = lastOf(conv, clearedOf(user.id, conv.id));
  const out = {
    id: conv.id,
    type: conv.type,
    avatar: conv.avatar || 0,
    last: last ? { text: previewText(last), time: last.time, user: last.user || '', mine: last.uid === user.id, system: !!last.system } : null,
    sortTime: real ? real.time : conv.created,
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

function stickerFile(user, id) {
  return path.join(STICKER_DIR, user.id + '_' + id + '.webp');
}

function removeUserStickers(user) {
  for (const item of user.stickers || []) removeFile(stickerFile(user, item.id));
  delete user.stickers;
}

function isAnimatedWebp(file) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const head = Buffer.alloc(65536);
    const read = fs.readSync(fd, head, 0, head.length, 0);
    const buf = head.subarray(0, read);
    if (read < 16 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return false;
    return buf.includes('ANIM');
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: ['ignore', 'ignore', 'ignore'] });
    } catch {
      return reject(new Error('ffmpeg'));
    }
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('timeout'));
    }, 240000);
    child.on('error', error => {
      clearTimeout(timer);
      reject(new Error(error.code === 'ENOENT' ? 'ffmpeg' : 'convert'));
    });
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error('convert'));
    });
  });
}

function sourceHasAlpha(file) {
  return new Promise(resolve => {
    let child;
    try {
      child = spawn('ffmpeg', ['-v', 'error', '-i', file, '-frames:v', '1', '-vf', 'scale=64:64:flags=area,format=rgba', '-f', 'rawvideo', '-'], { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      return resolve(false);
    }
    const chunks = [];
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve(false);
    }, 15000);
    child.stdout.on('data', chunk => chunks.push(chunk));
    child.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
    child.on('close', () => {
      clearTimeout(timer);
      const data = Buffer.concat(chunks);
      const pixels = Math.floor(data.length / 4);
      if (!pixels) return resolve(false);
      let clear = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 250) clear++;
      resolve(clear / pixels > 0.02);
    });
  });
}

function stickerFilter(extra, size, contain) {
  const side = size || STICKER_SIZE;
  const fit = contain
    ? 'scale=' + side + ':' + side + ':force_original_aspect_ratio=decrease:flags=lanczos,pad=' + side + ':' + side + ':(ow-iw)/2:(oh-ih)/2:color=black@0'
    : 'scale=' + side + ':' + side + ':force_original_aspect_ratio=increase:flags=lanczos,crop=' + side + ':' + side;
  const square = 'format=rgba,' + fit + ',setsar=1';
  return extra ? extra + ',' + square : square;
}

function probeFps(input) {
  return new Promise(resolve => {
    let out = '';
    let child;
    try {
      child = spawn('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate,r_frame_rate', '-of', 'csv=p=0', input], { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {
      return resolve(0);
    }
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve(0);
    }, 15000);
    child.stdout.on('data', chunk => {
      out += chunk;
    });
    child.on('error', () => {
      clearTimeout(timer);
      resolve(0);
    });
    child.on('close', () => {
      clearTimeout(timer);
      for (const part of out.trim().split(/[\s,]+/)) {
        const [num, den] = part.split('/').map(Number);
        const value = den ? num / den : num;
        if (value > 0 && value <= 120) return resolve(value);
      }
      resolve(0);
    });
  });
}

function stickerFpsFor(source, divide) {
  if (!source) return divide === 1 ? 15 : Math.max(15 / divide, 5);
  const step = Math.ceil(source / STICKER_FPS_CAP - 0.001) * divide;
  return step <= 1 ? 0 : Math.round(source / step * 1000) / 1000;
}

function disableWebpBlend(file) {
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return false;
  }
  if (buf.length < 30 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return false;
  let canvasW = 0;
  let canvasH = 0;
  const frames = [];
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const type = buf.toString('latin1', pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (type === 'VP8X' && pos + 18 <= buf.length) {
      canvasW = buf.readUIntLE(pos + 12, 3) + 1;
      canvasH = buf.readUIntLE(pos + 15, 3) + 1;
    } else if (type === 'ANMF' && pos + 24 <= buf.length) {
      const x = buf.readUIntLE(pos + 8, 3);
      const y = buf.readUIntLE(pos + 11, 3);
      const w = buf.readUIntLE(pos + 14, 3) + 1;
      const h = buf.readUIntLE(pos + 17, 3) + 1;
      frames.push({ flag: pos + 23, full: x === 0 && y === 0 && w === canvasW && h === canvasH });
    }
    pos += 8 + size + (size & 1);
  }
  if (!frames.length || !canvasW || !frames.every(frame => frame.full)) return false;
  let changed = false;
  for (const frame of frames) {
    if (!(buf[frame.flag] & 2)) {
      buf[frame.flag] |= 2;
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, buf);
  return changed;
}

function repairStickerFiles() {
  for (const dir of [STICKER_DIR, MEDIA_DIR]) {
    let names = [];
    try {
      names = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of names) {
      if (name.endsWith('.webp')) disableWebpBlend(path.join(dir, name));
    }
  }
}

async function convertSticker(input, output, animated) {
  if (!animated) {
    await runFfmpeg(['-i', input, '-frames:v', '1', '-vf', stickerFilter('', STICKER_SIZE, await sourceHasAlpha(input)), '-c:v', 'libwebp', '-lossless', '0', '-quality', '85', '-compression_level', '4', output]);
    return;
  }
  if (isAnimatedWebp(input) && fs.statSync(input).size <= STICKER_PASSTHROUGH_BYTES) {
    fs.copyFileSync(input, output);
    return;
  }
  const contain = await sourceHasAlpha(input);
  const source = await probeFps(input);
  for (const attempt of STICKER_ATTEMPTS) {
    const fps = stickerFpsFor(source, attempt.divide);
    const args = ['-i', input, '-t', String(STICKER_MAX_SECONDS), '-an'];
    if (!fps) args.push('-fps_mode', 'passthrough');
    args.push('-vf', stickerFilter(fps ? 'fps=' + fps : '', attempt.size, contain), '-c:v', 'libwebp', '-loop', '0', '-lossless', '0', '-quality', String(attempt.quality), '-compression_level', '4', output);
    await runFfmpeg(args);
    disableWebpBlend(output);
    if (fs.statSync(output).size <= STICKER_MAX_BYTES) return;
  }
}

function receiveToTemp(req, max) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(STICKER_DIR, { recursive: true });
    const temp = path.join(os.tmpdir(), 'zentry_' + crypto.randomBytes(8).toString('hex'));
    const out = fs.createWriteStream(temp);
    let size = 0;
    let failed = false;
    const fail = error => {
      if (failed) return;
      failed = true;
      req.unpipe(out);
      out.destroy();
      removeFile(temp);
      req.resume();
      reject(new Error(error));
    };
    req.on('data', chunk => {
      size += chunk.length;
      if (size > max) fail('size');
    });
    req.on('error', () => fail('invalid'));
    req.on('close', () => {
      if (!req.complete) fail('invalid');
    });
    out.on('error', () => fail('invalid'));
    out.on('finish', () => {
      if (failed) return;
      if (!out.bytesWritten) return fail('invalid');
      resolve(temp);
    });
    req.pipe(out);
  });
}

function sniffStickerSource(file, mime) {
  if (mime.startsWith('image/')) return sniffImage(file) !== null;
  return sniffVideo(file) !== null;
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

const GZIP_MIN_BYTES = 1024;

function acceptsGzip(res) {
  const req = res.req;
  return !!req && /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
}

function sendJson(res, status, data) {
  const body = Buffer.from(JSON.stringify(data));
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };
  if (body.length >= GZIP_MIN_BYTES && acceptsGzip(res)) {
    return zlib.gzip(body, (err, packed) => {
      if (err || res.writableEnded) {
        if (!res.writableEnded) {
          res.writeHead(status, headers);
          res.end(body);
        }
        return;
      }
      res.writeHead(status, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
      res.end(packed);
    });
  }
  res.writeHead(status, headers);
  res.end(body);
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

const staticCache = new Map();
const GZIP_TYPES = new Set(['.html', '.js', '.css', '.svg', '.json', '.webmanifest']);

function serveStatic(req, res) {
  const urlPath = req.url.split('?')[0];
  const relative = urlPath === '/' ? 'index.html' : urlPath.slice(1);
  const filePath = path.normalize(path.join(PUBLIC_DIR, relative));
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const type = MIME[ext] || 'application/octet-stream';
    const etag = '"' + stat.size.toString(16) + '-' + Math.floor(stat.mtimeMs).toString(16) + '"';
    const headers = { 'Content-Type': type, ETag: etag, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      return res.end();
    }
    const send = entry => {
      if (entry.gz && acceptsGzip(res)) {
        res.writeHead(200, { ...headers, 'Content-Encoding': 'gzip' });
        return res.end(entry.gz);
      }
      res.writeHead(200, headers);
      res.end(entry.raw);
    };
    const hit = staticCache.get(filePath);
    if (hit && hit.etag === etag) return send(hit);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not found');
      }
      const entry = { etag, raw: content, gz: null };
      if (!GZIP_TYPES.has(ext) || content.length < GZIP_MIN_BYTES) {
        staticCache.set(filePath, entry);
        return send(entry);
      }
      zlib.gzip(content, { level: 6 }, (gzErr, packed) => {
        if (!gzErr) entry.gz = packed;
        staticCache.set(filePath, entry);
        send(entry);
      });
    });
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

  let channelsChanged = false;
  for (const channel of [...channels.values()]) {
    if (channel.owner === uid) {
      channels.delete(channel.id);
      channelsChanged = true;
    } else if (channel.followers.includes(uid)) {
      channel.followers = channel.followers.filter(id => id !== uid);
      channelsChanged = true;
    }
  }
  if (channelsChanged) {
    saveChannels();
    emit(null, 'channels', {});
  }

  removeFile(userAvatarPath(user));
  removeFile(userBannerPath(user));
  removeUserStickers(user);
  push.removeUser(uid);

  for (const other of users.values()) {
    if (Array.isArray(other.contacts)) other.contacts = other.contacts.filter(id => id !== uid);
  }
  users.delete(uid);
  saveUsers();

  delete reads[uid];
  delete clears[uid];
  const groupsLeft = [];
  for (const conv of [...convs.values()]) {
    if (conv.members === null) {
      if (Array.isArray(conv.admins)) conv.admins = conv.admins.filter(id => id !== uid);
      continue;
    }
    if (!conv.members.includes(uid)) continue;
    if (conv.type === 'dm') {
      removeConvMedia(conv);
      convs.delete(conv.id);
      for (const id of conv.members) {
        if (reads[id]) delete reads[id][conv.id];
        if (clears[id]) delete clears[id][conv.id];
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

const handleRequest = async (req, res) => {
  applySecurityHeaders(res, req);
  if (REQUIRE_HTTPS && !isSecure(req) && !isLocalRequest(req)) {
    const host = String(req.headers.host || '').replace(/[^A-Za-z0-9.:\-\[\]]/g, '');
    if (host && (req.method === 'GET' || req.method === 'HEAD')) {
      res.writeHead(308, { Location: 'https://' + host + req.url });
      return res.end();
    }
    return sendJson(res, 426, { error: 'https' });
  }
  const route = req.url.split('?')[0];
  const params = new URL(req.url, 'http://localhost').searchParams;
  const headerToken = bearerToken(req);
  if (headerToken) params.set('token', headerToken);
  else if (!QUERY_TOKEN) params.delete('token');
  if (!params.get('token') && req.method === 'GET' && COOKIE_ROUTES.has(route)) {
    const cookie = cookieToken(req);
    if (cookie) params.set('token', cookie);
  }

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
        const exempt = lockExempt(req, credentials.username);
        const wait = exempt ? 0 : lockRemaining(credentials.username);
        if (wait) return sendJson(res, 429, { error: 'locked', retry: wait });
        user = findByUsername(credentials.username);
        if (!user || !user.hash || !(await checkPassword(user, credentials.password))) {
          if (!exempt) noteLoginFail(credentials.username);
          return sendJson(res, 401, { error: 'credentials' });
        }
        loginFails.delete(credentials.username.toLowerCase());
      }
      const token = createSession(user.id, req);
      res.setHeader('Set-Cookie', sessionCookie(req, token, SESSION_DAYS * 86400));
      return sendJson(res, 200, { token, user: publicUser(user) });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/me') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    res.setHeader('Set-Cookie', sessionCookie(req, params.get('token'), SESSION_DAYS * 86400));
    return sendJson(res, 200, { user: { ...publicUser(user), owner: isOwner(req, user) } });
  }

  if (req.method === 'GET' && route === '/api/devices') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const current = params.get('token');
    const list = [];
    for (const [token, session] of sessions) {
      if (session.uid !== user.id) continue;
      list.push({
        id: sessionKey(token),
        device: session.device || 'Dispositivo desconocido',
        bot: session.kind === 'bot',
        created: session.created,
        last: session.last || session.created,
        current: token === current
      });
    }
    list.sort((a, b) => Number(b.current) - Number(a.current) || b.last - a.last);
    return sendJson(res, 200, list);
  }

  if (req.method === 'POST' && route === '/api/link/request') {
    if (throttled(req, 'link', 30)) return sendJson(res, 429, { error: 'rate' });
    if (linkRequests.size >= MAX_LINK_PENDING) return sendJson(res, 503, { error: 'busy' });
    try {
      const raw = await readBody(req, 2000);
      const data = raw ? JSON.parse(raw) : {};
      const name = String(data.name || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 30) || 'Bot';
      const id = crypto.randomBytes(12).toString('hex');
      const secret = crypto.randomBytes(24).toString('hex');
      const code = newLinkCode();
      linkRequests.set(id, { id, secret, code, name, kind: 'bot', created: Date.now(), status: 'pending' });
      return sendJson(res, 200, {
        id,
        secret,
        code: code.slice(0, 4) + '-' + code.slice(4),
        qr: 'zentry-link:' + code.slice(0, 4) + '-' + code.slice(4),
        expiresIn: Math.floor(LINK_TTL / 1000)
      });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/link/status') {
    const item = linkRequests.get(String(params.get('id') || ''));
    if (!item || !sameSecret(item.secret, params.get('secret') || '') || Date.now() - item.created > LINK_TTL) {
      return sendJson(res, 200, { status: 'expired' });
    }
    if (item.status === 'pending') {
      return sendJson(res, 200, { status: 'pending', expiresIn: Math.max(0, Math.floor((item.created + LINK_TTL - Date.now()) / 1000)) });
    }
    linkRequests.delete(item.id);
    const owner = users.get(item.uid);
    if (!owner) return sendJson(res, 200, { status: 'expired' });
    return sendJson(res, 200, { status: 'approved', token: item.token, user: publicUser(owner) });
  }

  if (req.method === 'GET' && route === '/api/link/info') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (throttled(req, 'link', 20)) return sendJson(res, 429, { error: 'rate' });
    const item = findLink(params.get('code'));
    if (!item || item.status !== 'pending') return sendJson(res, 404, { error: 'code' });
    return sendJson(res, 200, { name: item.name, kind: item.kind });
  }

  if (req.method === 'POST' && route === '/api/link/approve') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (throttled(req, 'link', 20)) return sendJson(res, 429, { error: 'rate' });
    try {
      const data = JSON.parse(await readBody(req, 2000));
      const item = findLink(data.code);
      if (!item || item.status !== 'pending') return sendJson(res, 404, { error: 'code' });
      let bots = 0;
      for (const session of sessions.values()) {
        if (session.uid === user.id && session.kind === 'bot') bots++;
      }
      if (bots >= MAX_BOT_SESSIONS) return sendJson(res, 400, { error: 'limit' });
      item.token = createSession(user.id, null, { kind: item.kind, device: 'Bot · ' + item.name, ttl: BOT_SESSION_DAYS });
      item.uid = user.id;
      item.status = 'approved';
      aikoDirect(user, `Se vinculó "${item.name}" a su cuenta. Si usted no lo hizo, ciérrelo en Dispositivos vinculados.`);
      return sendJson(res, 200, { ok: true, name: item.name });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/device-logout') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const current = params.get('token');
      let removed = 0;
      for (const [token, session] of [...sessions]) {
        if (session.uid !== user.id || token === current) continue;
        if (data.all === true || sessionKey(token) === String(data.id || '')) {
          dropSession(token);
          removed++;
        }
      }
      if (removed) saveSessions();
      return sendJson(res, 200, { removed });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/logout') {
    const token = params.get('token');
    if (token && sessions.delete(token)) saveSessions();
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
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
      const exempt = lockExempt(req, user.username);
      const wait = exempt ? 0 : lockRemaining(user.username);
      if (wait) return sendJson(res, 429, { error: 'locked', retry: wait });
      if (!user.hash || !password || !(await checkPassword(user, password))) {
        if (!exempt) noteLoginFail(user.username);
        return sendJson(res, 403, { error: 'credentials' });
      }
      loginFails.delete(user.username);
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
    views.set(res, { uid: user.id, cid: String(params.get('cid') || '').slice(0, 40), visible: params.get('visible') === '1', token: String(params.get('token') || '') });
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

  if (req.method === 'POST' && route === '/api/report') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, MAX_IMAGE_BODY));
      const target = users.get(String(data.userId || ''));
      const text = String(data.text || '').trim().slice(0, MAX_REPORT_TEXT);
      if (!target || !target.hash || target.id === user.id || !text) return sendJson(res, 400, { error: 'invalid' });
      const owner = ownerUser();
      if (!owner) return sendJson(res, 503, { error: 'noowner' });
      const shot = data.image ? parseImage(data.image) : null;
      if (data.image && !shot) return sendJson(res, 400, { error: 'invalid' });
      if (reportLimited(user.id)) return sendJson(res, 429, { error: 'rate' });
      const dm = ensureAiko(owner);
      const message = {
        id: nextId++,
        uid: AIKO_ID,
        user: AIKO.name,
        text: `✦ Nuevo reporte\nReportado: ${target.name}\nEnviado por: ${user.name}\n\n${text}`,
        report: { from: user.id, target: target.id, fromName: user.name, targetName: target.name },
        time: Date.now()
      };
      if (shot) {
        const image = { id: crypto.randomBytes(8).toString('hex'), ext: shot.ext };
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
        fs.writeFileSync(mediaPath(image), shot.buffer);
        const width = Math.min(Math.max(parseInt(data.w, 10) || 0, 0), 20000);
        const height = Math.min(Math.max(parseInt(data.h, 10) || 0, 0), 20000);
        if (width && height) {
          image.w = width;
          image.h = height;
        }
        message.image = image;
      }
      pushMessage(dm, message);
      notifyMessage(dm, AIKO, message);
      aikoDirect(user, `Su reporte sobre "${target.name}" fue enviado al creador de Zentry. Gracias por avisarnos.`);
      return sendJson(res, 200, { ok: true });
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

  if (req.method === 'GET' && route === '/api/sponsors') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { sponsors: sponsors.map(item => ({ id: item.id, name: item.name, desc: item.desc, url: item.url })) });
  }

  if (req.method === 'POST' && route === '/api/sponsors/add') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (!isOwner(req, user)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const name = String(data.name || '').trim().slice(0, 40);
      const desc = String(data.desc || '').trim().slice(0, 120);
      const url = cleanUrl(data.url);
      if (!name || !url) return sendJson(res, 400, { error: 'format' });
      if (sponsors.length >= MAX_SPONSORS) return sendJson(res, 400, { error: 'limit' });
      sponsors.push({ id: crypto.randomBytes(6).toString('hex'), name, desc, url, time: Date.now() });
      saveSponsors();
      emit(null, 'sponsors', {});
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/sponsors/delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    if (!isOwner(req, user)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const index = sponsors.findIndex(item => item.id === String(data.id || ''));
      if (index === -1) return sendJson(res, 404, { error: 'none' });
      sponsors.splice(index, 1);
      saveSponsors();
      emit(null, 'sponsors', {});
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/channels') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const all = [...channels.values()].map(channel => channelSummary(channel, user));
    const following = all
      .filter(item => item.following)
      .sort((a, b) => (b.last ? b.last.time : b.created) - (a.last ? a.last.time : a.created));
    const explore = all
      .filter(item => !item.following)
      .sort((a, b) => b.followers - a.followers || b.created - a.created);
    return sendJson(res, 200, { following, explore });
  }

  if (req.method === 'GET' && route === '/api/channel') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const channel = channels.get(String(params.get('id') || ''));
    if (!channel) return sendJson(res, 404, { error: 'none' });
    return sendJson(res, 200, {
      channel: channelSummary(channel, user),
      posts: channel.posts.map(post => ({ id: post.id, text: post.text, time: post.time }))
    });
  }

  if (req.method === 'POST' && route === '/api/channels/create') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const name = String(data.name || '').trim().slice(0, 30);
      const desc = String(data.desc || '').trim().slice(0, 150);
      if (!name) return sendJson(res, 400, { error: 'format' });
      let owned = 0;
      for (const channel of channels.values()) {
        if (channel.owner === user.id) owned++;
      }
      if (owned >= MAX_CHANNELS_PER_USER) return sendJson(res, 400, { error: 'limit' });
      const channel = {
        id: crypto.randomBytes(8).toString('hex'),
        name,
        desc,
        owner: user.id,
        followers: [user.id],
        posts: [],
        created: Date.now()
      };
      channels.set(channel.id, channel);
      saveChannels();
      emit(null, 'channels', {});
      return sendJson(res, 200, { id: channel.id });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/channels/follow') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const channel = channels.get(String(data.id || ''));
      if (!channel) return sendJson(res, 404, { error: 'none' });
      if (channel.owner === user.id) return sendJson(res, 400, { error: 'owner' });
      const has = channel.followers.includes(user.id);
      if (data.follow && !has) channel.followers.push(user.id);
      if (!data.follow && has) channel.followers = channel.followers.filter(id => id !== user.id);
      saveChannels();
      emit(null, 'channels', { id: channel.id });
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/channels/post') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req, 6000));
      const channel = channels.get(String(data.id || ''));
      if (!channel) return sendJson(res, 404, { error: 'none' });
      if (channel.owner !== user.id) return sendJson(res, 403, { error: 'forbidden' });
      const text = String(data.text || '').trim().slice(0, MAX_POST_CHARS);
      if (!text) return sendJson(res, 400, { error: 'format' });
      channel.posts.push({ id: crypto.randomBytes(6).toString('hex'), text, time: Date.now() });
      if (channel.posts.length > MAX_CHANNEL_POSTS) channel.posts.splice(0, channel.posts.length - MAX_CHANNEL_POSTS);
      saveChannels();
      emit(null, 'channels', { id: channel.id });
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/channels/delete-post') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const channel = channels.get(String(data.id || ''));
      if (!channel) return sendJson(res, 404, { error: 'none' });
      if (channel.owner !== user.id) return sendJson(res, 403, { error: 'forbidden' });
      const before = channel.posts.length;
      channel.posts = channel.posts.filter(post => post.id !== String(data.post || ''));
      if (channel.posts.length === before) return sendJson(res, 404, { error: 'none' });
      saveChannels();
      emit(null, 'channels', { id: channel.id });
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/channels/delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const channel = channels.get(String(data.id || ''));
      if (!channel) return sendJson(res, 404, { error: 'none' });
      if (channel.owner !== user.id) return sendJson(res, 403, { error: 'forbidden' });
      channels.delete(channel.id);
      saveChannels();
      emit(null, 'channels', {});
      return sendJson(res, 200, { ok: true });
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
    const after = Math.max(Number(params.get('after')) || 0, clearedOf(ctx.user.id, ctx.conv.id));
    const list = ctx.conv.messages;
    return sendJson(res, 200, after ? list.filter(item => item.id > after) : list);
  }

  if (req.method === 'POST' && route === '/api/clear') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const list = ctx.conv.messages;
    if (list.length) {
      const lastMessageId = list[list.length - 1].id;
      clears[ctx.user.id] = clears[ctx.user.id] || {};
      clears[ctx.user.id][ctx.conv.id] = lastMessageId;
      reads[ctx.user.id] = reads[ctx.user.id] || {};
      reads[ctx.user.id][ctx.conv.id] = lastMessageId;
      saveChats();
    }
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && route === '/api/members') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const list = memberList(ctx.conv);
    return sendJson(res, 200, {
      online: list.filter(item => item.online).length,
      members: list,
      typing: typingList(ctx.conv.id),
      tempTtl: tempTtlOf(ctx.conv),
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

  if (req.method === 'POST' && route === '/api/temp-settings') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type === 'group' && !isGroupAdmin(ctx.conv, ctx.user.id)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const ttl = Number(data.ttl);
      if (!Object.prototype.hasOwnProperty.call(TEMP_TTLS, ttl)) return sendJson(res, 400, { error: 'invalid' });
      if (tempTtlOf(ctx.conv) !== ttl) {
        ctx.conv.tempTtl = ttl;
        const where = ctx.conv.type === 'group' ? 'del grupo' : 'de este chat';
        announce(
          ctx.conv,
          ttl
            ? `${ctx.user.name} activó los mensajes temporales ${where}. Los mensajes nuevos desaparecerán después de ${TEMP_TTLS[ttl]}`
            : `${ctx.user.name} desactivó los mensajes temporales ${where}`
        );
        saveChats();
        emit(ctx.conv, 'group', { conv: ctx.conv.id, tempTtl: ttl });
      }
      return sendJson(res, 200, { tempTtl: ttl });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/group-admin') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (ctx.conv.type !== 'group') return sendJson(res, 400, { error: 'invalid' });
    if (!isGroupAdmin(ctx.conv, ctx.user.id)) return sendJson(res, 403, { error: 'forbidden' });
    try {
      const data = JSON.parse(await readBody(req));
      const target = userById(String(data.userId || ''));
      const admin = data.admin !== false;
      if (!admin && creatorId(ctx.conv) !== ctx.user.id) return sendJson(res, 403, { error: 'forbidden' });
      if (!target || target.id === AIKO_ID || target.id === ctx.user.id || !isMember(ctx.conv, target.id) || target.id === creatorId(ctx.conv)) {
        return sendJson(res, 400, { error: 'invalid' });
      }
      if (isGroupAdmin(ctx.conv, target.id) !== admin) {
        const list = (Array.isArray(ctx.conv.admins) ? ctx.conv.admins : []).filter(id => id !== target.id);
        if (admin) {
          list.push(target.id);
          if (ctx.conv.muted) delete ctx.conv.muted[target.id];
        }
        ctx.conv.admins = list;
        announce(ctx.conv, admin ? `${ctx.user.name} nombró admin a ${target.name}` : `${ctx.user.name} quitó a ${target.name} como admin`);
        saveChats();
        emit(ctx.conv, 'group', { conv: ctx.conv.id, admin, uid: target.id });
      }
      return sendJson(res, 200, { admin });
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
      attachMentions(ctx.conv, message);
      deliverMessage(ctx, message);
      sendJson(res, 200, message);
    });
    req.pipe(out);
    return;
  }

  if (req.method === 'POST' && route === '/api/send-audio') {
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
    const ext = AUDIO_TYPES[mime];
    if (!ext) {
      req.resume();
      return sendJson(res, 415, { error: 'type' });
    }
    const audio = { id: crypto.randomBytes(8).toString('hex'), ext };
    const file = mediaPath(audio);
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
      if (size > MAX_CHAT_AUDIO_BYTES) fail(413, 'size');
    });
    req.on('error', () => fail(400, 'invalid'));
    req.on('close', () => {
      if (!req.complete) fail(400, 'invalid');
    });
    out.on('error', () => fail(400, 'invalid'));
    out.on('finish', () => {
      if (failed) return;
      const real = out.bytesWritten ? sniffAudio(file) : null;
      const same = real === ext || (real === 'm4a' && ext === 'm4a') || (real === 'webm' && ext === 'webm');
      if (!real || !same) {
        failed = true;
        removeFile(file);
        return sendJson(res, 400, { error: 'invalid' });
      }
      audio.size = out.bytesWritten;
      audio.name = String(params.get('name') || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 80) || 'Música';
      const dur = Math.min(Math.max(Math.round(Number(params.get('dur')) || 0), 0), 86400);
      if (dur) audio.dur = dur;
      const message = {
        id: nextId++,
        uid: ctx.user.id,
        user: ctx.user.name,
        text: '',
        audio,
        time: Date.now()
      };
      attachReply(ctx.conv, message, Number(params.get('replyTo')) || 0);
      deliverMessage(ctx, message);
      sendJson(res, 200, message);
    });
    req.pipe(out);
    return;
  }

  if (req.method === 'POST' && (route === '/api/send-video' || route === '/api/send-doc')) {
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
    const replyTo = Number(params.get('replyTo')) || 0;
    if (route === '/api/send-video') {
      const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      const ext = VIDEO_TYPES[mime];
      if (!ext) {
        req.resume();
        return sendJson(res, 415, { error: 'type' });
      }
      const media = { id: crypto.randomBytes(8).toString('hex'), ext };
      const dur = Math.min(Math.max(Math.round(Number(params.get('dur')) || 0), 0), 86400);
      if (dur) media.dur = dur;
      const width = Math.min(Math.max(parseInt(params.get('w'), 10) || 0, 0), 20000);
      const height = Math.min(Math.max(parseInt(params.get('h'), 10) || 0, 0), 20000);
      if (width && height) {
        media.w = width;
        media.h = height;
      }
      const check = file => {
        const real = sniffVideo(file);
        return real === ext || (real === 'mp4' && ext === 'mov');
      };
      return receiveUpload(req, res, ctx, { media, field: 'video', max: MAX_CHAT_VIDEO_BYTES, check, replyTo });
    }
    const rawName = String(params.get('name') || '').replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 120);
    const ext = (rawName.includes('.') ? rawName.split('.').pop() : '').toLowerCase();
    if (!DOC_EXTS.has(ext)) {
      req.resume();
      return sendJson(res, 415, { error: 'type' });
    }
    const media = { id: crypto.randomBytes(8).toString('hex'), ext, name: rawName };
    return receiveUpload(req, res, ctx, { media, field: 'doc', max: MAX_CHAT_DOC_BYTES, check: file => sniffDoc(file, ext), replyTo });
  }

  if (req.method === 'GET' && route === '/api/files') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const images = [];
    const stickers = [];
    const audios = [];
    const videos = [];
    const docs = [];
    const links = [];
    const list = ctx.conv.messages;
    const cut = clearedOf(ctx.user.id, ctx.conv.id);
    for (let i = list.length - 1; i >= 0; i--) {
      const message = list[i];
      if (message.id <= cut) break;
      if (message.system) continue;
      const base = { id: message.id, uid: message.uid, user: message.user, time: message.time };
      if (message.image) images.push({ ...base, text: message.text || '', image: message.image });
      if (message.sticker) stickers.push({ ...base, text: '', sticker: message.sticker });
      if (message.audio) audios.push({ ...base, text: '', audio: message.audio });
      if (message.video) videos.push({ ...base, text: '', video: message.video });
      if (message.doc) docs.push({ ...base, text: '', doc: message.doc });
      if (message.text) {
        const found = message.text.match(LINK_RE) || [];
        found.forEach((url, index) => links.push({ ...base, id: message.id + '-' + index, url: url.replace(/[.,;:!?)\]]+$/, '') }));
      }
    }
    return sendJson(res, 200, { images, stickers, audios, videos, docs, links });
  }

  if (req.method === 'GET' && route === '/api/stickers') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    return sendJson(res, 200, { stickers: (user.stickers || []).map(item => ({ id: item.id, animated: !!item.animated })) });
  }

  if (req.method === 'GET' && route === '/api/sticker-file') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    const id = String(params.get('id') || '');
    if (!/^[a-f0-9]{16}$/.test(id) || !(user.stickers || []).some(item => item.id === id)) return sendJson(res, 404, { error: 'none' });
    return fs.readFile(stickerFile(user, id), (err, content) => {
      if (err) return sendJson(res, 404, { error: 'none' });
      res.writeHead(200, {
        'Content-Type': 'image/webp',
        'Content-Length': content.length,
        'Cache-Control': 'private, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(content);
    });
  }

  if (req.method === 'POST' && route === '/api/sticker-create') {
    const user = authorize(res, params.get('token'));
    if (!user) {
      req.resume();
      return;
    }
    if (throttled(req, 'sticker', 15)) {
      req.resume();
      return sendJson(res, 429, { error: 'rate' });
    }
    const mime = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    const source = STICKER_SOURCES[mime];
    if (!source) {
      req.resume();
      return sendJson(res, 415, { error: 'type' });
    }
    if ((user.stickers || []).length >= MAX_STICKERS) {
      req.resume();
      return sendJson(res, 400, { error: 'limit' });
    }
    let temp = '';
    let output = '';
    try {
      temp = await receiveToTemp(req, MAX_STICKER_SOURCE);
      if (!sniffStickerSource(temp, mime)) throw new Error('invalid');
      const animated = source.animated === null ? isAnimatedWebp(temp) : source.animated;
      const id = crypto.randomBytes(8).toString('hex');
      output = stickerFile(user, id);
      await convertSticker(temp, output, animated);
      const size = fs.existsSync(output) ? fs.statSync(output).size : 0;
      if (!size) throw new Error('convert');
      if (!Array.isArray(user.stickers)) user.stickers = [];
      user.stickers.unshift({ id, animated, size });
      saveUsers();
      return sendJson(res, 200, { id, animated });
    } catch (error) {
      if (output) removeFile(output);
      const code = error && error.message;
      if (code === 'size') return sendJson(res, 413, { error: 'size' });
      if (code === 'ffmpeg') return sendJson(res, 501, { error: 'ffmpeg' });
      return sendJson(res, 400, { error: code === 'invalid' ? 'invalid' : 'convert' });
    } finally {
      if (temp) removeFile(temp);
    }
  }

  if (req.method === 'POST' && route === '/api/sticker-delete') {
    const user = authorize(res, params.get('token'));
    if (!user) return;
    try {
      const data = JSON.parse(await readBody(req));
      const id = String(data.id || '');
      const list = user.stickers || [];
      if (!list.some(item => item.id === id)) return sendJson(res, 404, { error: 'none' });
      removeFile(stickerFile(user, id));
      user.stickers = list.filter(item => item.id !== id);
      saveUsers();
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/sticker-save') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    try {
      const data = JSON.parse(await readBody(req));
      const mediaId = String(data.id || '');
      const message = ctx.conv.messages.find(item => item.sticker && item.sticker.id === mediaId);
      if (!message) return sendJson(res, 404, { error: 'none' });
      const list = ctx.user.stickers || [];
      if (list.length >= MAX_STICKERS) return sendJson(res, 400, { error: 'limit' });
      const source = mediaPath(message.sticker);
      if (!fs.existsSync(source)) return sendJson(res, 404, { error: 'none' });
      const id = crypto.randomBytes(8).toString('hex');
      fs.mkdirSync(STICKER_DIR, { recursive: true });
      fs.copyFileSync(source, stickerFile(ctx.user, id));
      ctx.user.stickers = [{ id, animated: !!message.sticker.animated, size: message.sticker.size || 0 }, ...list];
      saveUsers();
      return sendJson(res, 200, { id, animated: !!message.sticker.animated });
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'POST' && route === '/api/send-sticker') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    if (isAikoConv(ctx.conv)) return sendJson(res, 400, { error: 'aiko' });
    if (isMuted(ctx.conv, ctx.user.id)) return sendJson(res, 403, { error: 'muted' });
    try {
      const data = JSON.parse(await readBody(req));
      const item = (ctx.user.stickers || []).find(entry => entry.id === String(data.id || ''));
      if (!item) return sendJson(res, 404, { error: 'none' });
      const sticker = { id: crypto.randomBytes(8).toString('hex'), ext: 'webp', animated: !!item.animated, w: STICKER_SIZE, h: STICKER_SIZE };
      fs.mkdirSync(MEDIA_DIR, { recursive: true });
      fs.copyFileSync(stickerFile(ctx.user, item.id), mediaPath(sticker));
      sticker.size = fs.statSync(mediaPath(sticker)).size;
      const message = { id: nextId++, uid: ctx.user.id, user: ctx.user.name, text: '', sticker, time: Date.now() };
      attachReply(ctx.conv, message, Number(data.replyTo) || 0);
      deliverMessage(ctx, message);
      return sendJson(res, 200, message);
    } catch {
      return sendJson(res, 400, { error: 'invalid' });
    }
  }

  if (req.method === 'GET' && route === '/api/chat-media') {
    const ctx = authorizeConv(res, params);
    if (!ctx) return;
    const mediaId = String(params.get('id') || '');
    const message = /^[a-f0-9]{16}$/.test(mediaId) && ctx.conv.messages.find(item => {
      const media = messageMedia(item);
      return media && media.id === mediaId;
    });
    if (!message) return sendJson(res, 404, { error: 'none' });
    const media = messageMedia(message);
    const file = mediaPath(media);
    return fs.stat(file, (err, stat) => {
      if (err || !stat.size) return sendJson(res, 404, { error: 'none' });
      const isAudio = !!message.audio;
      const isVideo = !!message.video;
      const isDoc = !!message.doc;
      let type;
      if (isAudio) type = AUDIO_MIME[media.ext] || 'application/octet-stream';
      else if (isVideo) type = VIDEO_MIME[media.ext] || 'application/octet-stream';
      else if (isDoc) type = 'application/octet-stream';
      else type = Object.keys(IMAGE_TYPES).find(key => IMAGE_TYPES[key] === media.ext) || 'application/octet-stream';
      const headers = {
        'Content-Type': type,
        'Cache-Control': 'private, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      };
      let start = 0;
      let end = stat.size - 1;
      let status = 200;
      const ranged = isAudio || isVideo;
      const range = ranged && /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
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
        status = 206;
        headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
      }
      if (ranged) headers['Accept-Ranges'] = 'bytes';
      if (isDoc) headers['Content-Disposition'] = "attachment; filename*=UTF-8''" + encodeURIComponent(media.name || 'documento');
      headers['Content-Length'] = end - start + 1;
      res.writeHead(status, headers);
      const stream = fs.createReadStream(file, { start, end });
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
      attachMentions(ctx.conv, message);
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
};

const server = TLS_CERT && TLS_KEY
  ? https.createServer({ cert: fs.readFileSync(TLS_CERT), key: fs.readFileSync(TLS_KEY) }, handleRequest)
  : http.createServer(handleRequest);

server.headersTimeout = 30000;
server.requestTimeout = 600000;

purgeStatuses();
setInterval(purgeStatuses, 60000);
purgeAikoChats();
setInterval(purgeAikoChats, 60000);
purgeExpiredMessages();
setInterval(purgeExpiredMessages, 15000);
setInterval(purgeLinks, 15000);

setInterval(() => {
  for (const res of clients.keys()) res.write('event: ping\ndata: 1\n\n');
  const now = Date.now();
  for (const [ip, list] of attempts) {
    if (!list.some(time => now - time < 60000)) attempts.delete(ip);
  }
  for (const [name, entry] of loginFails) {
    if (entry.until <= now && now - entry.last > LOCK_RESET) loginFails.delete(name);
  }
  for (const [uid, list] of aikoRate) {
    if (!list.some(time => now - time < 60000)) aikoRate.delete(uid);
  }
  for (const [uid, list] of reportRate) {
    if (!list.some(time => now - time < REPORT_WINDOW)) reportRate.delete(uid);
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

const newestBackup = backupDirs()[0];
let newestBackupTime = 0;
try {
  if (newestBackup) newestBackupTime = fs.statSync(path.join(BACKUP_DIR, newestBackup)).mtimeMs;
} catch {}
if (Date.now() - newestBackupTime >= BACKUP_EVERY) runBackup();
setInterval(runBackup, BACKUP_EVERY).unref();

setImmediate(repairStickerFiles);

server.listen(PORT, '0.0.0.0', () => {
  const secure = !!(TLS_CERT && TLS_KEY);
  console.log(`WhatsApp Web listo en ${secure ? 'https' : 'http'}://localhost:${PORT}`);
  runFfmpeg(['-version']).catch(error => {
    if (error.message === 'ffmpeg') console.log('ffmpeg no está instalado, los stickers no funcionarán. Instálalo con: pkg install ffmpeg');
  });
  if (!secure) startTunnel();
});
