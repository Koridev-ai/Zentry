(function () {
  'use strict';

  const E = window.ZentryE2EE;
  const DB_NAME = 'zentry-e2ee';
  const DIR_TTL = 60 * 1000;
  const LOCKED_TEXT = '🔒 No se pudo descifrar este mensaje';
  const OLD_TEXT = '🔒 Mensaje enviado antes de que este dispositivo existiera';
  const KINDS = ['image', 'sticker', 'audio', 'video', 'doc'];
  const MAX_URLS = 120;

  let authHeaders = () => ({});
  let identity = null;
  let ready = null;
  let owner = '';
  const directories = new Map();
  const urls = new Map();

  function idb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('keys');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbGet(key) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const request = db.transaction('keys').objectStore('keys').get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbSet(key, value) {
    const db = await idb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('keys', 'readwrite');
      tx.objectStore('keys').put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function post(path, body) {
    const response = await fetch(path, { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
  }

  async function get(path) {
    const response = await fetch(path, { headers: authHeaders() });
    return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
  }

  function init(userId, headersFn) {
    if (headersFn) authHeaders = headersFn;
    if (ready && owner === userId) return ready;
    owner = userId;
    directories.clear();
    clearUrls();
    ready = (async () => {
      if (!E.supported()) throw new Error('unsupported');
      let saved = await idbGet('identity:' + userId);
      if (!saved) {
        saved = await E.generateIdentity();
        await idbSet('identity:' + userId, { privateKey: saved.privateKey, publicKey: saved.publicKey, pub: saved.pub, kid: saved.kid });
      }
      identity = saved;
      const result = await post('/api/e2ee/register', { pub: saved.pub });
      if (!result.ok) throw new Error('register');
      return true;
    })();
    ready.catch(() => {
      ready = null;
    });
    return ready;
  }

  function available() {
    return !!identity;
  }

  async function directory(convId, force) {
    const cached = directories.get(convId);
    if (cached && !force && Date.now() - cached.at < DIR_TTL) return cached;
    const result = await get('/api/e2ee/keys?conv=' + encodeURIComponent(convId));
    if (!result.ok) throw new Error('directory');
    const entry = { at: Date.now(), sealed: result.data.sealed !== false, keys: result.data.keys || [] };
    directories.set(convId, entry);
    return entry;
  }

  function forget(convId) {
    directories.delete(convId);
  }

  async function isSealed(convId) {
    try {
      return (await directory(convId)).sealed;
    } catch {
      return false;
    }
  }

  async function seal(convId, payload) {
    await ready;
    const dir = await directory(convId, true);
    if (!dir.sealed) return null;
    const envelope = await E.encrypt(identity, { conv: convId, uid: owner }, dir.keys, payload);
    return { e2ee: envelope };
  }

  function clearUrls() {
    for (const pending of urls.values()) pending.then(url => URL.revokeObjectURL(url)).catch(() => {});
    urls.clear();
  }

  function count(value, max) {
    const n = Math.round(Number(value) || 0);
    return n > 0 ? Math.min(n, max) : 0;
  }

  function safeMime(kind, mime) {
    const value = String(mime || '').toLowerCase();
    if (kind === 'image') return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value) ? value : 'image/jpeg';
    if (kind === 'sticker') return 'image/webp';
    if (kind === 'video') return ['video/mp4', 'video/webm', 'video/quicktime'].includes(value) ? value : 'video/mp4';
    if (kind === 'audio') return /^audio\/[a-z0-9.+-]{2,20}$/.test(value) ? value : 'audio/mpeg';
    return 'application/octet-stream';
  }

  function cleanMedia(raw, blob) {
    if (!raw || typeof raw !== 'object' || !blob || typeof blob !== 'object') return null;
    const kind = String(raw.kind || '');
    if (!KINDS.includes(kind) || kind !== blob.kind || String(raw.bid || '') !== blob.id) return null;
    const key = String(raw.key || '');
    const iv = String(raw.iv || '');
    try {
      if (E.unb64(key).length !== 32 || E.unb64(iv).length !== 12) return null;
    } catch {
      return null;
    }
    const info = {
      id: blob.id,
      ext: String(raw.ext || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5),
      sealed: true,
      key,
      iv,
      mime: safeMime(kind, raw.mime),
      size: count(raw.size, 1073741824)
    };
    const name = String(raw.name || '').replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 120);
    if (name) info.name = name;
    const w = count(raw.w, 20000);
    const h = count(raw.h, 20000);
    if (w && h) {
      info.w = w;
      info.h = h;
    }
    const dur = count(raw.dur, 86400);
    if (dur) info.dur = dur;
    if (raw.animated) info.animated = true;
    return { kind, info };
  }

  async function sealMedia(convId, kind, blob, info, extra) {
    await ready;
    if (!identity) throw new Error('unavailable');
    if (!KINDS.includes(kind)) throw new Error('kind');
    const packed = await E.encryptBlob(convId, await blob.arrayBuffer());
    const response = await fetch('/api/e2ee/blob?conv=' + encodeURIComponent(convId) + '&kind=' + kind, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/octet-stream' }),
      body: packed.ct
    });
    if (response.status === 401) throw new Error('auth');
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : data.error === 'muted' ? 'muted' : 'upload');
    const media = { kind, bid: data.id, key: packed.key, iv: packed.iv, mime: String(info.mime || ''), ext: String(info.ext || ''), size: blob.size };
    if (info.name) media.name = String(info.name).slice(0, 120);
    if (info.w && info.h) {
      media.w = info.w;
      media.h = info.h;
    }
    if (info.dur) media.dur = info.dur;
    if (info.animated) media.animated = true;
    const payload = { text: String((extra && extra.text) || '').slice(0, 1000), media };
    if (extra && extra.reply) payload.reply = extra.reply;
    if (extra && extra.mentions && extra.mentions.length) payload.mentions = extra.mentions;
    const dir = await directory(convId, true);
    if (!dir.sealed) throw new Error('unsealed');
    const envelope = await E.encrypt(identity, { conv: convId, uid: owner }, dir.keys, payload);
    return { e2ee: envelope, blob: data.id };
  }

  async function fetchPlain(convId, media) {
    const response = await fetch('/api/chat-media?conv=' + encodeURIComponent(convId) + '&id=' + encodeURIComponent(media.id), { headers: authHeaders() });
    if (!response.ok) throw new Error('media');
    return E.decryptBlob(convId, new Uint8Array(await response.arrayBuffer()), media.key, media.iv);
  }

  async function mediaBlob(convId, media) {
    await ready;
    return new Blob([await fetchPlain(convId, media)], { type: media.mime });
  }

  function mediaUrl(convId, media) {
    let hit = urls.get(media.id);
    if (hit) return hit;
    hit = (async () => {
      await ready;
      return URL.createObjectURL(new Blob([await fetchPlain(convId, media)], { type: media.mime }));
    })();
    urls.set(media.id, hit);
    hit.catch(() => {
      if (urls.get(media.id) === hit) urls.delete(media.id);
    });
    if (urls.size > MAX_URLS) {
      const oldest = urls.keys().next().value;
      const old = urls.get(oldest);
      urls.delete(oldest);
      old.then(url => URL.revokeObjectURL(url)).catch(() => {});
    }
    return hit;
  }

  function mediaPreview(message) {
    if (message.audio) return '♪ ' + (message.audio.name || 'Música');
    if (message.video) return '▶ Video';
    if (message.doc) return '▤ ' + (message.doc.name || 'Documento');
    if (message.sticker) return '▣ Sticker';
    if (message.image) return '📷 ' + (message.text || 'Foto');
    return message.text;
  }

  function markLocked(message, text) {
    message.text = text;
    message.undecryptable = true;
    delete message.mentions;
    delete message.reply;
    return message;
  }

  async function open(convId, message) {
    if (!message || !message.e2ee || message.sealedOpen) return message;
    try {
      await ready;
      const envelope = message.e2ee;
      if (!envelope.w || !envelope.w[identity.kid]) return markLocked(message, OLD_TEXT);
      let dir = await directory(convId);
      let sender = dir.keys.find(key => key.kid === envelope.s && key.uid === message.uid);
      if (!sender) {
        dir = await directory(convId, true);
        sender = dir.keys.find(key => key.kid === envelope.s && key.uid === message.uid);
      }
      if (!sender) return markLocked(message, LOCKED_TEXT);
      const payload = await E.decrypt(identity, { conv: convId, uid: message.uid }, envelope, sender.pub);
      message.text = String(payload.text || '');
      if (message.blob) {
        const media = cleanMedia(payload.media, message.blob);
        if (!media) return markLocked(message, LOCKED_TEXT);
        message[media.kind] = media.info;
      }
      if (payload.reply && typeof payload.reply === 'object') {
        message.reply = {
          id: Number(payload.reply.id) || 0,
          uid: String(payload.reply.uid || ''),
          user: String(payload.reply.user || '').slice(0, 40),
          text: String(payload.reply.text || '').slice(0, 200)
        };
      }
      if (Array.isArray(payload.mentions)) {
        message.mentions = payload.mentions.slice(0, 20).map(item => ({ id: String(item.id || ''), name: String(item.name || '').slice(0, 40) }));
      }
      message.sealedOpen = true;
      return message;
    } catch {
      return markLocked(message, LOCKED_TEXT);
    }
  }

  async function openAll(convId, list) {
    for (const message of list) await open(convId, message);
    return list;
  }

  async function openPreview(chat) {
    const last = chat && chat.last;
    if (!last || !last.e2ee) return chat;
    const message = { uid: last.uid, e2ee: last.e2ee, text: '' };
    if (last.blob) message.blob = last.blob;
    await open(chat.id, message);
    last.text = message.undecryptable ? '🔒 Mensaje cifrado' : mediaPreview(message);
    last.sealedText = true;
    delete last.e2ee;
    delete last.blob;
    return chat;
  }

  async function safetyNumber(convId, peerId) {
    await ready;
    const dir = await directory(convId, true);
    const mine = dir.keys.filter(key => key.uid === owner);
    const theirs = dir.keys.filter(key => key.uid === peerId);
    if (!mine.length || !theirs.length) return '';
    return E.safetyNumber(mine, theirs);
  }

  window.ZentryE2E = { init, available, seal, sealMedia, mediaUrl, mediaBlob, open, openAll, openPreview, isSealed, forget, safetyNumber, LOCKED_TEXT };
})();
