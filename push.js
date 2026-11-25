const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const path = require('path');

const VAPID_FILE = path.join(__dirname, 'vapid.json');
const SUBS_FILE = path.join(__dirname, 'push.json');
const SUBJECT = process.env.VAPID_SUBJECT || 'mailto:zentry@example.com';
const MAX_PER_USER = 10;
const RECORD_SIZE = 4096;
const TTL_SECONDS = 86400;
const REQUEST_TIMEOUT = 10000;
const HOST_SUFFIXES = ['googleapis.com', 'push.services.mozilla.com', 'push.apple.com', 'notify.windows.com'];

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function encode(buffer) {
  return Buffer.from(buffer).toString('base64url');
}

function decode(value) {
  return Buffer.from(String(value || ''), 'base64url');
}

function loadVapid() {
  let jwk = readJson(VAPID_FILE, null);
  if (!jwk || !jwk.x || !jwk.y || !jwk.d) {
    const pair = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    const exported = pair.privateKey.export({ format: 'jwk' });
    jwk = { x: exported.x, y: exported.y, d: exported.d };
    try {
      fs.writeFileSync(VAPID_FILE, JSON.stringify(jwk), { mode: 0o600 });
    } catch {}
  }
  const privateKey = crypto.createPrivateKey({ key: { kty: 'EC', crv: 'P-256', x: jwk.x, y: jwk.y, d: jwk.d }, format: 'jwk' });
  const publicKey = encode(Buffer.concat([Buffer.from([4]), decode(jwk.x), decode(jwk.y)]));
  return { privateKey, publicKey };
}

const vapid = loadVapid();
const subs = new Map(Object.entries(readJson(SUBS_FILE, {})).filter(([, list]) => Array.isArray(list)));

function saveSubs() {
  try {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(Object.fromEntries(subs)));
  } catch {}
}

function allowedEndpoint(value) {
  let url;
  try {
    url = new URL(String(value || ''));
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || value.length > 1000) return false;
  return HOST_SUFFIXES.some(suffix => url.hostname === suffix || url.hostname.endsWith('.' + suffix));
}

function validSubscription(sub) {
  if (!sub || typeof sub !== 'object' || !sub.keys || !allowedEndpoint(sub.endpoint)) return false;
  const p256dh = decode(sub.keys.p256dh);
  const auth = decode(sub.keys.auth);
  return p256dh.length === 65 && p256dh[0] === 4 && auth.length === 16;
}

function add(uid, sub) {
  if (!validSubscription(sub)) return false;
  for (const [owner, list] of subs) {
    const kept = list.filter(item => item.endpoint !== sub.endpoint);
    if (kept.length !== list.length) kept.length ? subs.set(owner, kept) : subs.delete(owner);
  }
  const list = subs.get(uid) || [];
  list.push({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth }, created: Date.now() });
  subs.set(uid, list.slice(-MAX_PER_USER));
  saveSubs();
  return true;
}

function dropEndpoint(endpoint) {
  let changed = false;
  for (const [owner, list] of subs) {
    const kept = list.filter(item => item.endpoint !== endpoint);
    if (kept.length === list.length) continue;
    changed = true;
    kept.length ? subs.set(owner, kept) : subs.delete(owner);
  }
  if (changed) saveSubs();
}

function remove(uid, endpoint) {
  const list = subs.get(uid);
  if (!list) return;
  const kept = list.filter(item => item.endpoint !== endpoint);
  if (kept.length === list.length) return;
  kept.length ? subs.set(uid, kept) : subs.delete(uid);
  saveSubs();
}

function removeUser(uid) {
  if (!subs.delete(uid)) return;
  saveSubs();
}

function authorization(endpoint) {
  const header = encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const claims = encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUBJECT }));
  const signature = crypto.sign('sha256', Buffer.from(header + '.' + claims), { key: vapid.privateKey, dsaEncoding: 'ieee-p1363' });
  return `vapid t=${header}.${claims}.${encode(signature)}, k=${vapid.publicKey}`;
}

function derive(secret, salt, info, length) {
  return Buffer.from(crypto.hkdfSync('sha256', secret, salt, info, length));
}

function encrypt(payload, subscription) {
  const receiverKey = decode(subscription.keys.p256dh);
  const authSecret = decode(subscription.keys.auth);
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  const senderKey = ecdh.getPublicKey();
  const shared = ecdh.computeSecret(receiverKey);
  const salt = crypto.randomBytes(16);
  const keyInfo = Buffer.concat([Buffer.from('WebPush: info\0'), receiverKey, senderKey]);
  const prk = derive(shared, authSecret, keyInfo, 32);
  const cek = derive(prk, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16);
  const nonce = derive(prk, salt, Buffer.from('Content-Encoding: nonce\0'), 12);
  const cipher = crypto.createCipheriv('aes-128-gcm', cek, nonce);
  const body = Buffer.concat([cipher.update(Buffer.concat([payload, Buffer.from([2])])), cipher.final(), cipher.getAuthTag()]);
  const header = Buffer.alloc(21);
  salt.copy(header, 0);
  header.writeUInt32BE(RECORD_SIZE, 16);
  header.writeUInt8(senderKey.length, 20);
  return Buffer.concat([header, senderKey, body]);
}

function post(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const req = https.request({
      method: 'POST',
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      timeout: REQUEST_TIMEOUT,
      headers: {
        Authorization: authorization(endpoint),
        'Content-Encoding': 'aes128gcm',
        'Content-Type': 'application/octet-stream',
        'Content-Length': body.length,
        TTL: String(TTL_SECONDS),
        Urgency: 'high'
      }
    }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body);
  });
}

async function deliver(subscription, payload) {
  try {
    const status = await post(subscription.endpoint, encrypt(payload, subscription));
    if (status === 404 || status === 410) dropEndpoint(subscription.endpoint);
  } catch {}
}

const MAX_PAYLOAD = RECORD_SIZE - 100;

function fits(data) {
  return Buffer.byteLength(JSON.stringify(data)) <= MAX_PAYLOAD;
}

function send(uids, data) {
  const payload = Buffer.from(JSON.stringify(data));
  if (payload.length > MAX_PAYLOAD) return;
  for (const uid of uids) {
    for (const subscription of subs.get(uid) || []) deliver(subscription, payload);
  }
}

module.exports = { publicKey: vapid.publicKey, add, remove, removeUser, send, fits };
