/*
 * Zentry E2EE v1 — cifrado de extremo a extremo con WebCrypto, sin dependencias.
 *
 * Cada dispositivo tiene un par de claves ECDH P-256 que nunca sale de él.
 * El servidor solo guarda las claves públicas y reparte texto cifrado.
 *
 * Por mensaje:
 *   1. Se genera una clave de contenido aleatoria (AES-256-GCM) y se cifra el texto.
 *   2. Se genera un par efímero ECDH. Para cada dispositivo destinatario se
 *      derivan dos secretos: ECDH(efímera, pública del destino) y
 *      ECDH(privada del remitente, pública del destino). El segundo autentica
 *      al remitente: solo quien tiene su clave privada puede calcularlo.
 *   3. HKDF(ambos secretos) da la clave que envuelve la clave de contenido.
 */
(function (root) {
  'use strict';

  const subtle = (root.crypto || {}).subtle;
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const VERSION = 1;
  const CURVE = { name: 'ECDH', namedCurve: 'P-256' };

  function b64(bytes) {
    const arr = new Uint8Array(bytes);
    let out = '';
    for (let i = 0; i < arr.length; i += 0x8000) out += String.fromCharCode.apply(null, arr.subarray(i, i + 0x8000));
    return btoa(out);
  }

  function unb64(text) {
    const bin = atob(text);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function concat(...parts) {
    const total = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(total);
    let at = 0;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }

  function supported() {
    return !!subtle && typeof indexedDB !== 'undefined';
  }

  // La clave privada no es extraíble: ni un script malicioso puede leer sus bytes.
  async function generateIdentity() {
    const pair = await subtle.generateKey(CURVE, false, ['deriveBits']);
    const pub = new Uint8Array(await subtle.exportKey('raw', pair.publicKey));
    return { privateKey: pair.privateKey, publicKey: pair.publicKey, pub: b64(pub), kid: await keyId(pub) };
  }

  async function keyId(pubBytes) {
    const hash = new Uint8Array(await subtle.digest('SHA-256', pubBytes));
    return Array.from(hash.slice(0, 8), x => x.toString(16).padStart(2, '0')).join('');
  }

  async function importPublic(pub) {
    const bytes = typeof pub === 'string' ? unb64(pub) : pub;
    if (bytes.length !== 65 || bytes[0] !== 4) throw new Error('bad-key');
    return subtle.importKey('raw', bytes, CURVE, true, []);
  }

  async function dh(privateKey, publicKey) {
    return new Uint8Array(await subtle.deriveBits({ name: 'ECDH', public: publicKey }, privateKey, 256));
  }

  async function wrapKey(secretA, secretB, info) {
    const base = await subtle.importKey('raw', concat(secretA, secretB), 'HKDF', false, ['deriveBits']);
    const bits = await subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: enc.encode('zentry-e2ee-v1'), info }, base, 256 + 96);
    const out = new Uint8Array(bits);
    const key = await subtle.importKey('raw', out.slice(0, 32), 'AES-GCM', false, ['encrypt', 'decrypt']);
    return { key, iv: out.slice(32, 44) };
  }

  function wrapInfo(conv, senderKid, recipientKid, epk) {
    return concat(enc.encode(['zentry-wrap', conv, senderKid, recipientKid].join('|') + '|'), epk);
  }

  function aad(conv, uid, senderKid) {
    return enc.encode(['zentry-msg', conv, uid, senderKid].join('|'));
  }

  /*
   * identity: { privateKey, kid }  (el dispositivo que envía)
   * recipients: [{ kid, pub }]     (todas las claves de los miembros y las propias)
   * Devuelve el sobre que se envía al servidor.
   */
  async function encrypt(identity, ctx, recipients, payload) {
    const contentRaw = root.crypto.getRandomValues(new Uint8Array(32));
    const contentKey = await subtle.importKey('raw', contentRaw, 'AES-GCM', false, ['encrypt']);
    const iv = root.crypto.getRandomValues(new Uint8Array(12));
    const plain = enc.encode(JSON.stringify(payload));
    const ct = new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad(ctx.conv, ctx.uid, identity.kid) }, contentKey, plain));

    const eph = await subtle.generateKey(CURVE, false, ['deriveBits']);
    const epk = new Uint8Array(await subtle.exportKey('raw', eph.publicKey));
    const w = {};
    for (const r of recipients) {
      if (w[r.kid]) continue;
      const pub = await importPublic(r.pub);
      const wrapper = await wrapKey(await dh(eph.privateKey, pub), await dh(identity.privateKey, pub), wrapInfo(ctx.conv, identity.kid, r.kid, epk));
      w[r.kid] = b64(new Uint8Array(await subtle.encrypt({ name: 'AES-GCM', iv: wrapper.iv }, wrapper.key, contentRaw)));
    }
    return { v: VERSION, s: identity.kid, epk: b64(epk), iv: b64(iv), ct: b64(ct), w };
  }

  /*
   * senderPub: clave pública del dispositivo remitente según el directorio
   * (la verificación de que es de verdad de esa persona es el código de seguridad).
   */
  async function decrypt(identity, ctx, envelope, senderPub) {
    if (!envelope || envelope.v !== VERSION) throw new Error('version');
    const mine = envelope.w && envelope.w[identity.kid];
    if (!mine) throw new Error('no-envelope');
    const epk = unb64(envelope.epk);
    const ephPub = await importPublic(epk);
    const senderKey = await importPublic(senderPub);
    const wrapper = await wrapKey(await dh(identity.privateKey, ephPub), await dh(identity.privateKey, senderKey), wrapInfo(ctx.conv, envelope.s, identity.kid, epk));
    const contentRaw = new Uint8Array(await subtle.decrypt({ name: 'AES-GCM', iv: wrapper.iv }, wrapper.key, unb64(mine)));
    const contentKey = await subtle.importKey('raw', contentRaw, 'AES-GCM', false, ['decrypt']);
    const plain = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(envelope.iv), additionalData: aad(ctx.conv, ctx.uid, envelope.s) }, contentKey, unb64(envelope.ct));
    return JSON.parse(dec.decode(plain));
  }

  // Código de seguridad: 60 dígitos en 12 bloques, igual para ambas personas.
  async function safetyNumber(listA, listB) {
    const norm = list => list.map(x => x.pub).sort().join(',');
    const parts = [norm(listA), norm(listB)].sort();
    const hash = new Uint8Array(await subtle.digest('SHA-512', enc.encode('zentry-safety|' + parts.join('|'))));
    let out = '';
    for (let i = 0; i < 12; i++) {
      const n = ((hash[i * 4] << 24) | (hash[i * 4 + 1] << 16) | (hash[i * 4 + 2] << 8) | hash[i * 4 + 3]) >>> 0;
      out += String(n % 100000).padStart(5, '0') + (i % 4 === 3 ? '\n' : ' ');
    }
    return out.trim();
  }

  const api = { VERSION, supported, generateIdentity, keyId, importPublic, encrypt, decrypt, safetyNumber, b64, unb64 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ZentryE2EE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
