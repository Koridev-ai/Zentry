const loginEl = document.getElementById('login');
const chatEl = document.getElementById('chat');
const loginForm = document.getElementById('loginForm');
const nameInput = document.getElementById('nameInput');
const sendForm = document.getElementById('sendForm');
const msgInput = document.getElementById('msgInput');
const messagesEl = document.getElementById('messages');
const statusEl = document.getElementById('status');
const loginError = document.getElementById('loginError');
const inviteBtn = document.getElementById('inviteBtn');
const toastEl = document.getElementById('toast');
const avatarBtn = document.getElementById('avatarBtn');
const avatarImg = document.getElementById('avatarImg');
const avatarLetter = document.getElementById('avatarLetter');
const avatarInput = document.getElementById('avatarInput');
const groupTitle = document.getElementById('groupTitle');
const groupInfo = document.getElementById('groupInfo');
const infoBack = document.getElementById('infoBack');
const infoImg = document.getElementById('infoImg');
const infoLetter = document.getElementById('infoLetter');
const infoCount = document.getElementById('infoCount');
const memberList = document.getElementById('memberList');
const memberMore = document.getElementById('memberMore');

const COLORS = ['#53bdeb', '#e26ab6', '#ffa726', '#9ccc65', '#ba68c8', '#4db6ac', '#ff7043', '#fdd835'];
const seen = new Set();
const MEMBERS_PREVIEW = 7;
let members = [];
let showAllMembers = false;
let username = localStorage.getItem('chat_user') || '';

const urlInvite = new URLSearchParams(location.search).get('invite');
if (urlInvite) {
  localStorage.setItem('chat_invite', urlInvite);
  window.history.replaceState(null, '', location.pathname);
}
let invite = localStorage.getItem('chat_invite') || '';

function colorFor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);

  if (message.system) {
    const note = document.createElement('div');
    note.className = 'msg system';
    note.textContent = message.text;
    if (message.text.endsWith('cambió la foto del grupo')) setAvatar(message.time);
    const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
    messagesEl.appendChild(note);
    if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    return;
  }

  const mine = message.user === username;
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other');

  if (!mine) {
    const author = document.createElement('div');
    author.className = 'author';
    author.style.color = colorFor(message.user);
    author.textContent = message.user;
    wrapper.appendChild(author);
  }

  const text = document.createElement('div');
  text.textContent = message.text;
  wrapper.appendChild(text);

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = formatTime(message.time);
  wrapper.appendChild(time);

  const nearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
  messagesEl.appendChild(wrapper);
  if (nearBottom || mine) messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function loadHistory() {
  const response = await fetch('/api/history?invite=' + encodeURIComponent(invite));
  if (!response.ok) return false;
  const history = await response.json();
  history.forEach(renderMessage);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return true;
}

function connectEvents() {
  const source = new EventSource('/api/events?user=' + encodeURIComponent(username) + '&invite=' + encodeURIComponent(invite));
  let poller = null;
  const poll = async () => {
    try {
      const response = await fetch('/api/history?invite=' + encodeURIComponent(invite));
      if (!response.ok) return;
      (await response.json()).forEach(renderMessage);
      statusEl.textContent = 'en línea';
    } catch {}
  };
  source.onopen = () => {
    statusEl.textContent = 'en línea';
    if (poller) {
      clearInterval(poller);
      poller = null;
    }
  };
  source.onerror = () => {
    statusEl.textContent = 'reconectando...';
    if (!poller) {
      poll();
      poller = setInterval(poll, 1500);
    }
  };
  source.onmessage = event => renderMessage(JSON.parse(event.data));
  source.addEventListener('group', event => setAvatar(JSON.parse(event.data).avatar));
  source.addEventListener('presence', event => {
    const data = JSON.parse(event.data);
    const count = data.online;
    statusEl.textContent = count + (count === 1 ? ' persona en línea' : ' personas en línea');
    if (Array.isArray(data.members)) {
      members = data.members;
      renderMembers();
    }
  });
}

function showLoginError(text) {
  loginError.textContent = text;
  loginError.classList.remove('hidden');
  loginEl.classList.remove('hidden');
  chatEl.classList.add('hidden');
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

async function buildInviteLink() {
  const response = await fetch('/api/invite?invite=' + encodeURIComponent(invite));
  const info = await response.json();
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  const base = local && info.urls.length ? info.urls[0] : location.origin;
  return base + '/?invite=' + encodeURIComponent(info.code);
}

async function enterChat() {
  const loaded = await loadHistory();
  if (!loaded) {
    invite = '';
    localStorage.removeItem('chat_invite');
    showLoginError('El enlace de invitación no es válido');
    return;
  }
  loginEl.classList.add('hidden');
  chatEl.classList.remove('hidden');
  connectEvents();
  msgInput.focus();
}

function setAvatar(version) {
  if (!version) return;
  const src = '/api/group-avatar?invite=' + encodeURIComponent(invite) + '&v=' + version;
  avatarImg.src = src;
  avatarImg.classList.remove('hidden');
  avatarLetter.classList.add('hidden');
  infoImg.src = src;
  infoImg.classList.remove('hidden');
  infoLetter.classList.add('hidden');
}

function initialOf(name) {
  return (Array.from(name.trim())[0] || '?').toUpperCase();
}

function memberRow(name, online, isMe) {
  const row = document.createElement('li');
  row.className = 'member';

  const avatar = document.createElement('div');
  avatar.className = 'member-avatar';
  avatar.style.background = colorFor(name);
  avatar.textContent = initialOf(name);
  row.appendChild(avatar);

  const info = document.createElement('div');
  info.className = 'member-info';
  const title = document.createElement('span');
  title.className = 'member-name';
  title.textContent = isMe ? 'Tú' : name;
  info.appendChild(title);
  const state = document.createElement('span');
  state.className = 'member-state' + (online ? ' on' : '');
  state.textContent = online ? '✦ en línea' : 'desconectado';
  info.appendChild(state);
  row.appendChild(info);

  return row;
}

function renderMembers() {
  const others = members.filter(item => item.name !== username);
  const total = others.length + 1;
  infoCount.textContent = total + (total === 1 ? ' miembro' : ' miembros');

  memberList.textContent = '';
  memberList.appendChild(memberRow(username, true, true));

  const visible = showAllMembers ? others : others.slice(0, MEMBERS_PREVIEW - 1);
  visible.forEach(item => memberList.appendChild(memberRow(item.name, item.online, false)));

  const hidden = others.length - visible.length;
  if (hidden > 0) {
    memberMore.textContent = 'Ver todos (' + hidden + ' más)';
    memberMore.classList.remove('hidden');
  } else {
    memberMore.classList.add('hidden');
  }
}

async function openGroupInfo() {
  showAllMembers = false;
  renderMembers();
  groupInfo.classList.remove('hidden');
  try {
    const response = await fetch('/api/members?invite=' + encodeURIComponent(invite));
    if (!response.ok) return;
    members = (await response.json()).members;
    renderMembers();
  } catch {}
}

function closeGroupInfo() {
  groupInfo.classList.add('hidden');
}

groupTitle.addEventListener('click', openGroupInfo);
infoBack.addEventListener('click', closeGroupInfo);
memberMore.addEventListener('click', () => {
  showAllMembers = true;
  renderMembers();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeGroupInfo();
});

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.getContext('2d').drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size
      );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

avatarBtn.addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  avatarInput.value = '';
  if (!file) return;
  try {
    const image = await resizeImage(file);
    const response = await fetch('/api/group-avatar?invite=' + encodeURIComponent(invite), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, image })
    });
    if (!response.ok) throw new Error('upload');
    showToast('Foto del grupo actualizada');
  } catch {
    showToast('No se pudo cambiar la foto');
  }
});

inviteBtn.addEventListener('click', async () => {
  const link = await buildInviteLink();
  if (await copyText(link)) showToast('Enlace de invitación copiado');
  else window.prompt('Copia el enlace', link);
});

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = nameInput.value.trim();
  if (!value) return;
  if (!invite) {
    showLoginError('Necesitas un enlace de invitación para entrar');
    return;
  }
  username = value;
  localStorage.setItem('chat_user', username);
  enterChat();
});

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;
  msgInput.value = '';
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, text, invite })
    });
    if (response.ok) renderMessage(await response.json());
  } catch {}
  msgInput.focus();
});

if (!invite) showLoginError('Necesitas un enlace de invitación para entrar');
else if (username) enterChat();

