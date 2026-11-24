const loginEl = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const loginSubtitle = document.getElementById('loginSubtitle');
const loginSubmit = document.getElementById('loginSubmit');
const loginToggle = document.getElementById('loginToggle');
const loginError = document.getElementById('loginError');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const passwordToggle = document.getElementById('passwordToggle');
const passwordGenerate = document.getElementById('passwordGenerate');
const homeEl = document.getElementById('home');
const chatList = document.getElementById('chatList');
const newChatBtn = document.getElementById('newChatBtn');
const homeTitle = document.getElementById('homeTitle');
const groupList = document.getElementById('groupList');
const chatEmpty = document.getElementById('chatEmpty');
const groupEmpty = document.getElementById('groupEmpty');
const newGroupFab = document.getElementById('newGroupFab');
const callBtn = document.getElementById('callBtn');
const navBadge = document.getElementById('navBadge');
const navItems = document.querySelectorAll('#bottomNav .nav-item');
const tabPanels = {
  chats: document.getElementById('tabChats'),
  news: document.getElementById('tabNews'),
  groups: document.getElementById('tabGroups'),
  calls: document.getElementById('tabCalls')
};
const TAB_TITLES = { chats: 'Zentry', news: 'Novedades', groups: 'Grupos', calls: 'Llamadas' };
const profileBtn = document.getElementById('profileBtn');
const profileEl = document.getElementById('profile');
const profileBack = document.getElementById('profileBack');
const profileAvatar = document.getElementById('profileAvatar');
const profileName = document.getElementById('profileName');
const profileInput = document.getElementById('profileInput');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const profileBanner = document.getElementById('profileBanner');
const bannerInput = document.getElementById('bannerInput');
const changeBannerBtn = document.getElementById('changeBannerBtn');
const removeBannerBtn = document.getElementById('removeBannerBtn');
const userBanner = document.getElementById('userBanner');
const attachBtn = document.getElementById('attachBtn');
const photoBtn = document.getElementById('photoBtn');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const imagePreviewClose = document.getElementById('imagePreviewClose');
const imageForm = document.getElementById('imageForm');
const imageCaption = document.getElementById('imageCaption');
const imageSendBtn = document.getElementById('imageSendBtn');
const imageViewer = document.getElementById('imageViewer');
const imageViewerImg = document.getElementById('imageViewerImg');
const imageViewerClose = document.getElementById('imageViewerClose');
const imageViewerInfo = document.getElementById('imageViewerInfo');
const imageViewerCaption = document.getElementById('imageViewerCaption');
const logoutBtn = document.getElementById('logoutBtn');
const pushText = document.getElementById('pushText');
const pushBtn = document.getElementById('pushBtn');
const pushBanner = document.getElementById('pushBanner');
const pushBannerGo = document.getElementById('pushBannerGo');
const pushBannerClose = document.getElementById('pushBannerClose');
const adminSection = document.getElementById('adminSection');
const adminToggleBtn = document.getElementById('adminToggleBtn');
const adminList = document.getElementById('adminList');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountForm = document.getElementById('deleteAccountForm');
const deletePasswordInput = document.getElementById('deletePasswordInput');
const deleteError = document.getElementById('deleteError');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
const deleteCancelBtn = document.getElementById('deleteCancelBtn');
const chatEl = document.getElementById('chat');
const chatBack = document.getElementById('chatBack');
const avatarBtn = document.getElementById('avatarBtn');
const avatarInput = document.getElementById('avatarInput');
const groupTitle = document.getElementById('groupTitle');
const chatName = document.getElementById('chatName');
const statusEl = document.getElementById('status');
const messagesEl = document.getElementById('messages');
const sendForm = document.getElementById('sendForm');
const msgInput = document.getElementById('msgInput');
const groupInfo = document.getElementById('groupInfo');
const infoBack = document.getElementById('infoBack');
const infoAvatar = document.getElementById('infoAvatar');
const infoName = document.getElementById('infoName');
const infoCount = document.getElementById('infoCount');
const memberList = document.getElementById('memberList');
const memberMore = document.getElementById('memberMore');
const infoCreator = document.getElementById('infoCreator');
const groupSettings = document.getElementById('groupSettings');
const groupStatusMode = document.getElementById('groupStatusMode');
const groupStatusPost = document.getElementById('groupStatusPost');
const myStatus = document.getElementById('myStatus');
const myStatusAvatar = document.getElementById('myStatusAvatar');
const myStatusSub = document.getElementById('myStatusSub');
const statusRecentTitle = document.getElementById('statusRecentTitle');
const statusRecent = document.getElementById('statusRecent');
const statusSeenTitle = document.getElementById('statusSeenTitle');
const statusSeen = document.getElementById('statusSeen');
const statusEmpty = document.getElementById('statusEmpty');
const statusFab = document.getElementById('statusFab');
const statusInput = document.getElementById('statusInput');
const statusNewEl = document.getElementById('statusNew');
const statusNewBack = document.getElementById('statusNewBack');
const statusPreview = document.getElementById('statusPreview');
const statusProgress = document.getElementById('statusProgress');
const statusProgressBar = document.getElementById('statusProgressBar');
const statusProgressText = document.getElementById('statusProgressText');
const statusForm = document.getElementById('statusForm');
const statusCaption = document.getElementById('statusCaption');
const statusPublish = document.getElementById('statusPublish');
const statusViewEl = document.getElementById('statusView');
const svBars = document.getElementById('svBars');
const svClose = document.getElementById('svClose');
const svAvatar = document.getElementById('svAvatar');
const svName = document.getElementById('svName');
const svTime = document.getElementById('svTime');
const svDelete = document.getElementById('svDelete');
const svStage = document.getElementById('svStage');
const svTapPrev = document.getElementById('svTapPrev');
const svTapNext = document.getElementById('svTapNext');
const svCaption = document.getElementById('svCaption');
const svViews = document.getElementById('svViews');
const svViewers = document.getElementById('svViewers');
const svViewersTitle = document.getElementById('svViewersTitle');
const svViewersClose = document.getElementById('svViewersClose');
const svViewersList = document.getElementById('svViewersList');
const userProfileEl = document.getElementById('userProfile');
const userBack = document.getElementById('userBack');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userState = document.getElementById('userState');
const addContactBtn = document.getElementById('addContactBtn');
const messageBtn = document.getElementById('messageBtn');
const aikoAdmin = document.getElementById('aikoAdmin');
const aikoAvatarInput = document.getElementById('aikoAvatarInput');
const aikoBannerInput = document.getElementById('aikoBannerInput');
const aikoAvatarBtn = document.getElementById('aikoAvatarBtn');
const aikoAvatarRemoveBtn = document.getElementById('aikoAvatarRemoveBtn');
const aikoBannerBtn = document.getElementById('aikoBannerBtn');
const aikoBannerRemoveBtn = document.getElementById('aikoBannerRemoveBtn');
const removeContactBtn = document.getElementById('removeContactBtn');
const newChatEl = document.getElementById('newChat');
const newBack = document.getElementById('newBack');
const newGroupRow = document.getElementById('newGroupRow');
const userList = document.getElementById('userList');
const userEmpty = document.getElementById('userEmpty');
const newGroupEl = document.getElementById('newGroup');
const groupBack = document.getElementById('groupBack');
const groupNameInput = document.getElementById('groupNameInput');
const pickList = document.getElementById('pickList');
const createGroupBtn = document.getElementById('createGroupBtn');
const toastEl = document.getElementById('toast');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');
const epHeadMain = document.getElementById('epHeadMain');
const epSearchBtn = document.getElementById('epSearchBtn');
const epTabEmoji = document.getElementById('epTabEmoji');
const epTabSticker = document.getElementById('epTabSticker');
const epBackspace = document.getElementById('epBackspace');
const epSearchRow = document.getElementById('epSearchRow');
const epSearchBack = document.getElementById('epSearchBack');
const epSearchInput = document.getElementById('epSearchInput');
const epEmojiView = document.getElementById('epEmojiView');
const epScroll = document.getElementById('epScroll');
const epCats = document.getElementById('epCats');
const epStickerView = document.getElementById('epStickerView');
const signupPhoto = document.getElementById('signupPhoto');
const signupAvatar = document.getElementById('signupAvatar');
const signupInput = document.getElementById('signupInput');
const replyBar = document.getElementById('replyBar');
const replyAuthor = document.getElementById('replyAuthor');
const replyText = document.getElementById('replyText');
const replyCancel = document.getElementById('replyCancel');
const aikoChips = document.getElementById('aikoChips');

const COLORS = ['#53bdeb', '#e26ab6', '#ffa726', '#9ccc65', '#ba68c8', '#4db6ac', '#ff7043', '#fdd835'];
const AIKO_ID = 'aiko';
const AIKO_GRADIENT = 'linear-gradient(135deg, #b794ff, #6d28d9)';
const AIKO_CHIPS = [
  '¿Cómo creo un grupo?',
  '¿Cómo añado contactos?',
  '¿Cómo cambio mi foto?',
  '¿Cómo subo un estado?',
  '¿Cómo respondo un mensaje?',
  '¿Qué puedes hacer?'
];
const SEAL_PATH = (() => {
  const points = [];
  const steps = 160;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = 10 + 1.35 * Math.cos(angle * 8);
    points.push((12 + radius * Math.cos(angle)).toFixed(2) + ' ' + (12 + radius * Math.sin(angle)).toFixed(2));
  }
  return 'M' + points.join('L') + 'Z';
})();
const MEMBERS_PREVIEW = 7;
const CHAT_VIEWS = ['chat', 'info', 'user'];
const HOME_VIEWS = ['list', 'new', 'newgroup', 'profile', 'statusnew', 'statusview'];
const SV_IMAGE_MS = 5000;
const STATUS_ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
const MAX_GIF_BYTES = 10 * 1024 * 1024;
const MAX_CHAT_IMAGE_BYTES = 16 * 1024 * 1024;
const CHAT_IMAGE_SIDE = 1600;
const SWIPE_TRIGGER = 56;
const SWIPE_MAX = 72;
const SELF_COLOR = '#7ee0c0';
const EMOJI_BASE = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/';
const EMOJI_DATA_URLS = [
  'https://cdn.jsdelivr.net/npm/emojibase-data@16.0.3/es/compact.json',
  'https://cdn.jsdelivr.net/npm/emojibase-data@16.0.3/en/compact.json'
];
const EMOJI_GROUPS = [
  { id: 'recent', title: 'Recientes', icon: '🕒' },
  { id: 0, title: 'Caras y emociones', icon: '😀' },
  { id: 1, title: 'Personas y cuerpo', icon: '👋' },
  { id: 3, title: 'Animales y naturaleza', icon: '🐻' },
  { id: 4, title: 'Comida y bebida', icon: '🍔' },
  { id: 5, title: 'Viajes y lugares', icon: '🚗' },
  { id: 6, title: 'Actividades', icon: '⚽' },
  { id: 7, title: 'Objetos', icon: '💡' },
  { id: 8, title: 'Símbolos', icon: '❤️' },
  { id: 9, title: 'Banderas', icon: '🏁' }
];
const RECENT_KEY = 'chat_recent_emojis';
const RECENT_MAX = 32;
const SEARCH_MAX = 200;
const EMOJI_REGEX =/(?:\p{Regional_Indicator}{2}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})*)*)/gu;

let token = localStorage.getItem('chat_token') || '';
let me = null;
let registerMode = false;
let chats = [];
let chatsSig = '';
let current = null;
let view = 'list';
let tab = 'chats';
let seen = new Set();
let lastId = 0;
let members = [];
let groupMeta = { conv: '', statusMode: 'off', canConfig: false, canPost: false };
let statusTarget = '';
let statusReturn = null;
let showAllMembers = false;
let statusText = '';
let typingNames = [];
let lastTypingSent = 0;
let pickUsers = [];
let picked = new Set();
let source = null;
let lastEventAt = 0;
let pollTimer = null;
let watchTimer = null;
let polling = false;
const avatarVersions = new Map();
const messageIndex = new Map();
let replyTo = null;
let pendingImage = null;
let sendingImage = false;
let profileUser = null;
let statusData = { mine: null, others: [] };
let statusSig = '';
let svQueue = [];
let svGroup = 0;
let svIndex = 0;
let svFrame = 0;
let svStart = 0;
let svElapsed = 0;
let svPaused = false;
let svVideo = null;
let statusDraft = null;
let statusXhr = null;
let swipe = null;
let signupImage = '';
let emojiData = null;
let emojiByChar = new Map();
let emojiPanelOpen = false;
let emojiRendered = false;
let emojiLoading = false;
let emojiSearching = false;
let spyFrame = 0;

function authQuery() {
  return 'token=' + encodeURIComponent(token);
}

async function api(path, body) {
  const url = path + (path.includes('?') ? '&' : '?') + authQuery();
  const options = body === undefined
    ? {}
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const response = await fetch(url, options);
  if (response.status === 401) {
    endSession();
    throw new Error('auth');
  }
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

function colorFor(key) {
  let hash = 0;
  for (const ch of String(key)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatListTime(ts) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ts >= startToday) return formatTime(ts);
  if (ts >= startToday - 86400000) return 'Ayer';
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
}

function initialOf(name) {
  return (Array.from(String(name).trim())[0] || '?').toUpperCase();
}

function userAvatarUrl(id, version) {
  return '/api/user-avatar?id=' + encodeURIComponent(id) + '&' + authQuery() + '&v=' + version;
}

function userBannerUrl(id, version) {
  return '/api/user-banner?id=' + encodeURIComponent(id) + '&' + authQuery() + '&v=' + version;
}

function paintBanner(el, person) {
  el.style.backgroundImage = person && person.banner ? 'url("' + userBannerUrl(person.id, person.banner) + '")' : '';
}

function userAvatarSrc(person) {
  return person && person.avatar ? userAvatarUrl(person.id, person.avatar) : '';
}

function avatarSrc(chat) {
  if (!chat.avatar) return '';
  if (chat.type === 'dm') return chat.peer ? userAvatarUrl(chat.peer.id, chat.avatar) : '';
  return '/api/group-avatar?conv=' + encodeURIComponent(chat.id) + '&' + authQuery() + '&v=' + chat.avatar;
}

let sealCount = 0;

function verifiedBadge() {
  const ns = 'http://www.w3.org/2000/svg';
  const id = 'aikoSeal' + sealCount++;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'verified-badge');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Cuenta verificada');
  const defs = document.createElementNS(ns, 'defs');
  const gradient = document.createElementNS(ns, 'linearGradient');
  gradient.setAttribute('id', id);
  gradient.setAttribute('x1', '0');
  gradient.setAttribute('y1', '0');
  gradient.setAttribute('x2', '1');
  gradient.setAttribute('y2', '1');
  [['0', '#b794ff'], ['1', '#7c3aed']].forEach(([offset, color]) => {
    const stop = document.createElementNS(ns, 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    gradient.appendChild(stop);
  });
  defs.appendChild(gradient);
  svg.appendChild(defs);
  const seal = document.createElementNS(ns, 'path');
  seal.setAttribute('d', SEAL_PATH);
  seal.setAttribute('fill', 'url(#' + id + ')');
  svg.appendChild(seal);
  const check = document.createElementNS(ns, 'path');
  check.setAttribute('d', 'M7.6 12.4l3 3 5.8-6.2');
  check.setAttribute('fill', 'none');
  check.setAttribute('stroke', '#ffffff');
  check.setAttribute('stroke-width', '2.2');
  check.setAttribute('stroke-linecap', 'round');
  check.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(check);
  return svg;
}

function fillAvatar(container, key, name, src) {
  container.textContent = '';
  if (key === AIKO_ID) {
    container.style.background = AIKO_GRADIENT;
    container.style.color = '#ffffff';
    const glyph = document.createElement('span');
    glyph.textContent = '✦';
    container.appendChild(glyph);
    if (src) {
      const img = document.createElement('img');
      img.alt = '';
      img.addEventListener('error', () => img.remove());
      img.src = src;
      container.appendChild(img);
    }
    return;
  }
  container.style.background = colorFor(key);
  container.style.color = '#0b141a';
  const letter = document.createElement('span');
  letter.textContent = initialOf(name);
  container.appendChild(letter);
  if (src) {
    const img = document.createElement('img');
    img.alt = '';
    img.addEventListener('error', () => img.remove());
    img.src = src;
    container.appendChild(img);
  }
}

function avatarContent(container, chat) {
  const key = chat.type === 'dm' && chat.peer ? chat.peer.id : chat.id;
  fillAvatar(container, key, chat.name, avatarSrc(chat));
}

function rememberAvatar(person) {
  if (person && person.id) avatarVersions.set(person.id, person.avatar || 0);
}

function messageAvatarSrc(uid) {
  const version = avatarVersions.get(uid);
  return version ? userAvatarUrl(uid, version) : '';
}

function paintMessageAvatar(el) {
  const uid = el.dataset.uid;
  const version = String(avatarVersions.get(uid) || 0);
  if (el.dataset.v === version) return;
  el.dataset.v = version;
  fillAvatar(el, uid, el.dataset.name, messageAvatarSrc(uid));
}

function refreshMessageAvatars() {
  messagesEl.querySelectorAll('.msg-avatar').forEach(paintMessageAvatar);
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2000);
}

function showView(name) {
  view = name;
  if (name !== 'statusview') stopStatusViewer();
  if (name !== 'statusnew') clearStatusDraft();
  if (!CHAT_VIEWS.includes(name)) {
    current = null;
    closeEmojiPanel(false);
  }
  homeEl.classList.toggle('hidden', !HOME_VIEWS.includes(name));
  chatEl.classList.toggle('hidden', !CHAT_VIEWS.includes(name));
  groupInfo.classList.toggle('hidden', name !== 'info');
  userProfileEl.classList.toggle('hidden', name !== 'user');
  newChatEl.classList.toggle('hidden', name !== 'new');
  newGroupEl.classList.toggle('hidden', name !== 'newgroup');
  profileEl.classList.toggle('hidden', name !== 'profile');
  statusNewEl.classList.toggle('hidden', name !== 'statusnew');
  statusViewEl.classList.toggle('hidden', name !== 'statusview');
  if (name === 'list') {
    refreshChats();
    refreshStatuses();
  }
}

function enter(name, replace) {
  if (replace) history.replaceState({ v: name }, '');
  else history.pushState({ v: name }, '');
  showView(name);
}

function goBack() {
  history.back();
}

window.addEventListener('popstate', event => {
  hideImageOverlays();
  const name = (event.state && event.state.v) || 'list';
  if (name === 'info' && !current && statusReturn) current = statusReturn;
  statusReturn = null;
  if (CHAT_VIEWS.includes(name) && !current) {
    showView('list');
    return;
  }
  showView(name);
  if (name === 'info' && current) refreshMembers();
});

function renderStatus() {
  const group = !!current && current.type === 'group';
  if (typingNames.length === 1) {
    statusEl.textContent = group ? typingNames[0] + ' está escribiendo...' : 'escribiendo...';
  } else if (typingNames.length === 2) {
    statusEl.textContent = typingNames[0] + ' y ' + typingNames[1] + ' están escribiendo...';
  } else if (typingNames.length > 2) {
    statusEl.textContent = typingNames.length + ' personas están escribiendo...';
  } else {
    statusEl.textContent = statusText;
  }
  statusEl.classList.toggle('typing', typingNames.length > 0);
}

function setStatus(text) {
  statusText = text;
  renderStatus();
}

function setTyping(list) {
  typingNames = list.filter(item => !me || item.id !== me.id).map(item => item.name);
  renderStatus();
}

function previewText(chat) {
  if (!chat.last) return '';
  if (chat.last.system) return chat.last.text;
  if (chat.last.mine) return 'Tú: ' + chat.last.text;
  if (chat.type === 'group') return chat.last.user + ': ' + chat.last.text;
  return chat.last.text;
}

function chatRow(chat) {
  const row = document.createElement('li');
  row.className = 'chat-item';
  row.addEventListener('click', () => openConv(chat, false));

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatarContent(avatar, chat);
  row.appendChild(avatar);

  const main = document.createElement('div');
  main.className = 'chat-main';

  const top = document.createElement('div');
  top.className = 'chat-row';
  const name = document.createElement('span');
  name.className = 'chat-name';
  name.textContent = chat.name;
  if (chat.verified) {
    const wrap = document.createElement('span');
    wrap.className = 'name-wrap';
    wrap.appendChild(name);
    wrap.appendChild(verifiedBadge());
    top.appendChild(wrap);
  } else {
    top.appendChild(name);
  }
  const time = document.createElement('span');
  time.className = 'chat-time' + (chat.unread ? ' unread' : '');
  time.textContent = chat.last ? formatListTime(chat.last.time) : '';
  top.appendChild(time);
  main.appendChild(top);

  const bottom = document.createElement('div');
  bottom.className = 'chat-row';
  const preview = document.createElement('span');
  if (chat.typing && chat.typing.length) {
    preview.className = 'chat-preview typing';
    preview.textContent = chat.type === 'group' ? chat.typing[0] + ' está escribiendo...' : 'escribiendo...';
  } else {
    preview.className = 'chat-preview' + (chat.last && chat.last.system ? ' system' : '');
    emojify(preview, previewText(chat));
  }
  bottom.appendChild(preview);
  if (chat.unread) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = chat.unread > 99 ? '99+' : String(chat.unread);
    bottom.appendChild(badge);
  }
  main.appendChild(bottom);

  row.appendChild(main);
  return row;
}

function renderChatList() {
  chatList.textContent = '';
  groupList.textContent = '';
  const ordered = chats.filter(chat => chat.bot).concat(chats.filter(chat => !chat.bot));
  ordered.forEach(chat => {
    chatList.appendChild(chatRow(chat));
    if (chat.type === 'group') groupList.appendChild(chatRow(chat));
  });
  chatEmpty.classList.toggle('hidden', chats.length > 0);
  groupEmpty.classList.toggle('hidden', !!groupList.children.length);
  const unread = chats.filter(chat => chat.unread).length;
  navBadge.textContent = unread > 99 ? '99+' : String(unread);
  navBadge.classList.toggle('hidden', unread === 0);
}

function setTab(name) {
  tab = name;
  Object.keys(tabPanels).forEach(key => tabPanels[key].classList.toggle('hidden', key !== name));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.tab === name));
  homeTitle.textContent = TAB_TITLES[name];
  if (name === 'news') refreshStatuses();
}

function sortChats() {
  chats.sort((a, b) => (b.last ? b.last.time : b.sortTime) - (a.last ? a.last.time : a.sortTime));
}

async function refreshChats() {
  if (!token) return;
  try {
    const result = await api('/api/chats');
    if (!result.ok) return;
    const sig = JSON.stringify(result.data);
    if (sig === chatsSig) return;
    chatsSig = sig;
    chats = result.data;
    renderChatList();
    if (current) {
      const fresh = chats.find(item => item.id === current.id);
      if (fresh && fresh.avatar !== current.avatar) {
        current.avatar = fresh.avatar;
        applyHeader();
        if (view === 'info') avatarContent(infoAvatar, current);
      }
    }
  } catch {}
}

function touchChats() {
  chatsSig = '';
  renderChatList();
}

function emojiImage(glyph, onMissing) {
  const codes = Array.from(glyph).map(ch => ch.codePointAt(0).toString(16).padStart(4, '0'));
  const bare = codes.filter(code => code !== 'fe0f');
  const candidates = [...new Set([codes.join('-'), bare.join('-'), [bare[0], 'fe0f', ...bare.slice(1)].join('-')])];
  const img = document.createElement('img');
  img.className = 'emoji';
  img.alt = glyph;
  img.draggable = false;
  if (onMissing) img.loading = 'lazy';
  let index = 0;
  img.addEventListener('error', () => {
    index += 1;
    if (index < candidates.length) img.src = EMOJI_BASE + candidates[index] + '.png';
    else if (onMissing) onMissing();
    else img.replaceWith(document.createTextNode(glyph));
  });
  img.src = EMOJI_BASE + candidates[0] + '.png';
  return img;
}

function emojify(el, value) {
  el.textContent = '';
  const text = String(value);
  let last = 0;
  for (const match of text.matchAll(EMOJI_REGEX)) {
    const glyph = match[0];
    if (Array.from(glyph).length === 1 && glyph.codePointAt(0) < 0x2100) continue;
    if (match.index > last) el.appendChild(document.createTextNode(text.slice(last, match.index)));
    el.appendChild(emojiImage(glyph));
    last = match.index + glyph.length;
  }
  if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
}

function previewOf(message) {
  return message.image ? '📷 ' + (message.text || 'Foto') : message.text;
}

function chatImageUrl(image) {
  return '/api/chat-media?conv=' + encodeURIComponent(current.id) + '&id=' + encodeURIComponent(image.id) + '&' + authQuery();
}

function hideImageOverlays() {
  imageViewer.classList.add('hidden');
  imageViewerImg.removeAttribute('src');
  imagePreview.classList.add('hidden');
  imagePreviewImg.removeAttribute('src');
  if (pendingImage) {
    URL.revokeObjectURL(pendingImage.url);
    pendingImage = null;
  }
}

function openImageViewer(message) {
  imageViewerImg.src = chatImageUrl(message.image);
  imageViewerInfo.textContent = (me && message.uid === me.id ? 'Tú' : message.user) + ' · ' + formatTime(message.time);
  imageViewerCaption.textContent = message.text || '';
  imageViewerCaption.classList.toggle('hidden', !message.text);
  history.pushState({ v: view }, '');
  imageViewer.classList.remove('hidden');
}

function buildImage(message) {
  const box = document.createElement('div');
  box.className = 'msg-image';
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  if (message.image.w && message.image.h) {
    img.width = message.image.w;
    img.height = message.image.h;
  }
  img.addEventListener('error', () => {
    box.classList.add('broken');
    box.textContent = 'Imagen no disponible';
  });
  img.src = chatImageUrl(message.image);
  box.appendChild(img);
  box.addEventListener('click', () => {
    if (!box.classList.contains('broken')) openImageViewer(message);
  });
  return box;
}

function replyAuthorName(item) {
  return me && item.uid === me.id ? 'Tú' : item.user;
}

function buildQuote(reply) {
  const quote = document.createElement('div');
  quote.className = 'quote';
  const mineQuote = !!me && reply.uid === me.id;
  quote.style.borderLeftColor = mineQuote ? SELF_COLOR : colorFor(reply.uid || reply.user);
  const name = document.createElement('div');
  name.className = 'q-author';
  name.style.color = mineQuote ? SELF_COLOR : colorFor(reply.uid || reply.user);
  name.textContent = replyAuthorName(reply);
  quote.appendChild(name);
  const body = document.createElement('div');
  body.className = 'q-text';
  emojify(body, reply.text);
  quote.appendChild(body);
  quote.addEventListener('click', () => jumpToMessage(reply.id));
  return quote;
}

function jumpToMessage(id) {
  const row = messagesEl.querySelector('.msg-row[data-id="' + id + '"]');
  if (!row) return showToast('El mensaje ya no está disponible');
  row.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const bubble = row.querySelector('.msg');
  bubble.classList.remove('flash');
  void bubble.offsetWidth;
  bubble.classList.add('flash');
}

function setReply(message) {
  if (!me || message.system) return;
  replyTo = message;
  replyAuthor.textContent = replyAuthorName(message);
  replyAuthor.style.color = message.uid === me.id ? SELF_COLOR : colorFor(message.uid || message.user);
  emojify(replyText, previewOf(message));
  replyBar.classList.remove('hidden');
  msgInput.focus();
}

function clearReply() {
  replyTo = null;
  replyBar.classList.add('hidden');
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);
  if (message.id > lastId) lastId = message.id;

  if (message.system) {
    const note = document.createElement('div');
    note.className = 'msg system';
    note.textContent = message.text;
    const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
    messagesEl.appendChild(note);
    if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    return;
  }

  const mine = !!me && message.uid === me.id;
  const showAuthor = !mine && !!current && current.type === 'group';
  const wrapper = document.createElement('div');
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other') + (message.uid === AIKO_ID ? ' aiko' : '');

  messageIndex.set(message.id, message);

  if (mine || showAuthor) {
    const author = document.createElement('div');
    author.className = 'author';
    author.style.color = mine ? SELF_COLOR : colorFor(message.uid || message.user);
    author.textContent = mine ? 'Tú' : message.user;
    if (!mine) author.addEventListener('click', () => openUserProfile(message.uid, message.user));
    wrapper.appendChild(author);
  }

  if (message.reply) wrapper.appendChild(buildQuote(message.reply));

  if (message.image) wrapper.appendChild(buildImage(message));

  if (message.text || !message.image) {
    const text = document.createElement('div');
    if (message.uid === AIKO_ID) text.className = 'aiko-text';
    emojify(text, message.text);
    if (text.querySelector('.emoji') && !text.textContent.trim() && text.querySelectorAll('.emoji').length <= 3) {
      text.classList.add('jumbo');
    }
    wrapper.appendChild(text);
  }

  const time = document.createElement('div');
  time.className = 'time';
  time.textContent = formatTime(message.time);
  wrapper.appendChild(time);

  const row = document.createElement('div');
  row.className = 'msg-row ' + (mine ? 'mine' : 'other');
  row.dataset.id = message.id;
  row.addEventListener('dblclick', () => setReply(message));
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.dataset.uid = message.uid || message.user;
  avatar.dataset.name = message.user;
  paintMessageAvatar(avatar);
  if (!mine) avatar.addEventListener('click', () => openUserProfile(message.uid, message.user));
  row.appendChild(avatar);
  row.appendChild(wrapper);

  const nearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
  messagesEl.appendChild(row);
  if (nearBottom || mine) messagesEl.scrollTop = messagesEl.scrollHeight;
}

function markRead() {
  if (!current || document.visibilityState !== 'visible') return;
  const chat = chats.find(item => item.id === current.id);
  if (chat && chat.unread) {
    chat.unread = 0;
    touchChats();
  }
  api('/api/read?conv=' + encodeURIComponent(current.id), {}).catch(() => {});
}

function applyHeader() {
  chatName.textContent = current.name;
  if (current.verified) chatName.appendChild(verifiedBadge());
  const bot = !!current.bot;
  photoBtn.classList.toggle('hidden', bot);
  attachBtn.classList.toggle('hidden', bot);
  aikoChips.classList.toggle('hidden', !bot);
  msgInput.placeholder = bot ? 'Pregúntale a Aiko sobre Zentry' : 'Escribe un mensaje';
  avatarContent(avatarBtn, current);
  avatarBtn.style.cursor = 'pointer';
  groupTitle.classList.add('clickable');
}

async function loadChat() {
  const convId = current.id;
  messagesEl.textContent = '';
  seen = new Set();
  messageIndex.clear();
  clearReply();
  lastId = 0;
  members = [];
  typingNames = [];
  statusText = '';
  renderStatus();
  applyHeader();
  try {
    const [result] = await Promise.all([
      api('/api/history?conv=' + encodeURIComponent(convId)),
      refreshMembers()
    ]);
    if (!current || current.id !== convId) return;
    if (!result.ok) {
      showToast('No se pudo abrir el chat');
      goBack();
      return;
    }
    result.data.forEach(renderMessage);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    markRead();
  } catch {}
}

function openConv(chat, replace) {
  current = { ...chat };
  enter('chat', replace);
  loadChat();
}

async function refreshMembers() {
  if (!current) return;
  const convId = current.id;
  try {
    const result = await api('/api/members?conv=' + encodeURIComponent(convId));
    if (!current || current.id !== convId || !result.ok) return;
    members = result.data.members;
    groupMeta = { conv: convId, ...(result.data.group || { statusMode: 'off', canConfig: false, canPost: false }) };
    members.forEach(rememberAvatar);
    refreshMessageAvatars();
    if (current.type === 'dm') {
      const peer = members.find(item => item.id !== me.id);
      setStatus(peer && peer.bot ? 'asistente de Zentry' : peer && peer.online ? 'en línea' : 'desconectado');
    } else {
      const count = result.data.online;
      setStatus(count + (count === 1 ? ' persona en línea' : ' personas en línea'));
    }
    setTyping(result.data.typing);
    renderMembers();
  } catch {}
}

function onIncoming(data) {
  const conv = data.conv;
  const message = { ...data };
  delete message.conv;
  const chat = chats.find(item => item.id === conv);
  const open = !!current && current.id === conv;
  if (!chat) {
    refreshChats();
  } else {
    if (!message.system || !chat.last) {
      chat.last = { text: previewOf(message), time: message.time, user: message.user || '', mine: !!me && message.uid === me.id, system: !!message.system };
    }
    if (!open && !message.system && !chat.last.mine) chat.unread += 1;
    sortChats();
    touchChats();
  }
  if (open) {
    renderMessage(message);
    if (!message.system && message.uid !== me.id) markRead();
  }
}

function onTypingEvent(data) {
  const chat = chats.find(item => item.id === data.conv);
  if (chat) {
    chat.typing = data.typing.filter(item => !me || item.id !== me.id).map(item => item.name);
    touchChats();
  }
  if (current && current.id === data.conv) setTyping(data.typing);
}

function updateProfileBtn() {
  if (me) fillAvatar(profileBtn, me.id, me.name, userAvatarSrc(me));
}

function renderProfile() {
  if (!me) return;
  fillAvatar(profileAvatar, me.id, me.name, userAvatarSrc(me));
  profileName.textContent = me.name;
  paintBanner(profileBanner, me);
  removePhotoBtn.classList.toggle('hidden', !me.avatar);
  removeBannerBtn.classList.toggle('hidden', !me.banner);
  adminSection.classList.toggle('hidden', !me.owner);
}

function onProfileEvent(data) {
  rememberAvatar(data);
  refreshMessageAvatars();
  if (me && me.id === data.id) {
    me.avatar = data.avatar;
    me.banner = data.banner || 0;
    updateProfileBtn();
    renderProfile();
  }
  if (profileUser && profileUser.id === data.id) {
    profileUser.avatar = data.avatar;
    profileUser.banner = data.banner || 0;
    renderUserProfile();
  }
  refreshChats();
  if (current) refreshMembers();
}

function onGroupEvent(data) {
  const chat = chats.find(item => item.id === data.conv);
  if (chat && data.avatar !== undefined) {
    chat.avatar = data.avatar;
    touchChats();
  }
  if (current && current.id === data.conv) {
    if (data.avatar !== undefined) {
      current.avatar = data.avatar;
      applyHeader();
      avatarContent(infoAvatar, current);
    }
    if (data.statusMode !== undefined) refreshMembers();
  }
}

async function poll() {
  if (polling || !token) return;
  polling = true;
  try {
    if (current && CHAT_VIEWS.includes(view)) {
      const convId = current.id;
      const result = await api('/api/history?conv=' + encodeURIComponent(convId) + '&after=' + lastId);
      if (current && current.id === convId && result.ok) {
        result.data.forEach(renderMessage);
        if (result.data.some(item => !item.system && item.uid !== me.id)) markRead();
      }
      await refreshMembers();
    } else {
      await refreshChats();
    }
  } catch {
  } finally {
    polling = false;
  }
}

function openSource() {
  if (source) source.close();
  lastEventAt = Date.now();
  source = new EventSource('/api/events?' + authQuery() + '&cid=' + clientId + '&visible=' + (document.visibilityState === 'visible' ? '1' : '0'));
  source.onopen = () => {
    lastEventAt = Date.now();
  };
  source.onerror = () => {
    if (current) setStatus('reconectando...');
  };
  source.onmessage = event => {
    lastEventAt = Date.now();
    onIncoming(JSON.parse(event.data));
  };
  source.addEventListener('typing', event => {
    lastEventAt = Date.now();
    onTypingEvent(JSON.parse(event.data));
  });
  source.addEventListener('group', event => {
    lastEventAt = Date.now();
    onGroupEvent(JSON.parse(event.data));
  });
  source.addEventListener('presence', () => {
    lastEventAt = Date.now();
    poll();
  });
  source.addEventListener('profile', event => {
    lastEventAt = Date.now();
    onProfileEvent(JSON.parse(event.data));
  });
  source.addEventListener('chats', () => {
    lastEventAt = Date.now();
    refreshChats();
  });
  source.addEventListener('statuses', () => {
    lastEventAt = Date.now();
    refreshStatuses();
  });
  source.addEventListener('ping', () => {
    lastEventAt = Date.now();
  });
}

function stopEvents() {
  if (source) source.close();
  source = null;
  clearInterval(pollTimer);
  clearInterval(watchTimer);
  pollTimer = null;
  watchTimer = null;
}

function connectEvents() {
  stopEvents();
  openSource();
  pollTimer = setInterval(poll, 2500);
  watchTimer = setInterval(() => {
    if (Date.now() - lastEventAt > 40000) openSource();
  }, 10000);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !token || !pollTimer) return;
  poll();
  markRead();
  if (Date.now() - lastEventAt > 20000) openSource();
});

function memberRow(person, online, isMe) {
  const row = document.createElement('li');
  row.className = 'member';

  const avatar = document.createElement('div');
  avatar.className = 'member-avatar';
  fillAvatar(avatar, person.id, person.name, userAvatarSrc(person));
  row.appendChild(avatar);

  const info = document.createElement('div');
  info.className = 'member-info';
  const title = document.createElement('span');
  title.className = 'member-name';
  title.textContent = isMe ? 'Tú' : person.name;
  info.appendChild(title);
  if (person.creator || person.admin) {
    const tag = document.createElement('span');
    tag.className = 'member-tag';
    tag.textContent = person.creator && person.admin ? 'Creador y admin del grupo' : person.creator ? 'Creador del grupo' : 'Admin del grupo';
    info.appendChild(tag);
  }
  const state = document.createElement('span');
  state.className = 'member-state' + (online ? ' on' : '');
  state.textContent = online ? '✦ en línea' : 'desconectado';
  info.appendChild(state);
  row.appendChild(info);

  return row;
}

function renderMembers() {
  if (!me || !current) return;
  const others = members.filter(item => item.id !== me.id);
  const total = members.some(item => item.id === me.id) ? members.length : others.length + 1;
  infoCount.textContent = total + (total === 1 ? ' miembro' : ' miembros');

  const self = members.find(item => item.id === me.id);
  const meta = groupMeta.conv === current.id ? groupMeta : { statusMode: 'off', canConfig: false, canPost: false };
  const creator = members.find(item => item.creator);
  infoCreator.textContent = creator ? 'Grupo creado por ' + (creator.id === me.id ? 'ti' : creator.name) : '';
  infoCreator.classList.toggle('hidden', !creator);
  groupSettings.classList.toggle('hidden', !meta.canConfig);
  groupStatusMode.value = meta.statusMode;
  groupStatusPost.classList.toggle('hidden', !meta.canPost);

  memberList.textContent = '';
  memberList.appendChild(memberRow(self ? { ...me, creator: self.creator, admin: self.admin } : me, true, true));

  const visible = showAllMembers ? others : others.slice(0, MEMBERS_PREVIEW - 1);
  visible.forEach(item => {
    const row = memberRow(item, item.online, false);
    row.addEventListener('click', () => openUserProfile(item.id, item.name));
    memberList.appendChild(row);
  });

  const hidden = others.length - visible.length;
  if (hidden > 0) {
    memberMore.textContent = 'Ver todos (' + hidden + ' más)';
    memberMore.classList.remove('hidden');
  } else {
    memberMore.classList.add('hidden');
  }
}

function openGroupInfo() {
  if (!current || current.type !== 'group') return;
  showAllMembers = false;
  infoName.textContent = current.name;
  avatarContent(infoAvatar, current);
  renderMembers();
  enter('info', false);
  refreshMembers();
}

function renderUserProfile() {
  if (!profileUser) return;
  const known = typeof profileUser.contact === 'boolean';
  fillAvatar(userAvatar, profileUser.id, profileUser.name, userAvatarSrc(profileUser));
  paintBanner(userBanner, profileUser);
  userName.textContent = profileUser.name;
  if (profileUser.verified) userName.appendChild(verifiedBadge());
  if (profileUser.bot) userState.textContent = '✦ Asistente oficial de Zentry';
  else userState.textContent = typeof profileUser.online === 'boolean' ? (profileUser.online ? '✦ en línea' : 'desconectado') : '';
  addContactBtn.classList.toggle('hidden', !!profileUser.bot || !known || profileUser.contact);
  removeContactBtn.classList.toggle('hidden', !!profileUser.bot || !known || !profileUser.contact);
  const editable = !!(me && me.owner && profileUser.id === AIKO_ID);
  aikoAdmin.classList.toggle('hidden', !editable);
  aikoAvatarRemoveBtn.classList.toggle('hidden', !profileUser.avatar);
  aikoBannerRemoveBtn.classList.toggle('hidden', !profileUser.banner);
}

async function openUserProfile(id, name) {
  if (!me || !id || id === me.id) return;
  profileUser = { id, name, avatar: avatarVersions.get(id) || 0 };
  if (id === AIKO_ID) {
    profileUser.verified = true;
    profileUser.bot = true;
  }
  renderUserProfile();
  enter('user', false);
  try {
    const result = await api('/api/profile?id=' + encodeURIComponent(id));
    if (!profileUser || profileUser.id !== id) return;
    if (!result.ok) {
      showToast('No se pudo abrir el perfil');
      goBack();
      return;
    }
    profileUser = result.data;
    rememberAvatar(profileUser);
    renderUserProfile();
  } catch {}
}

async function setContact(add) {
  if (!profileUser) return;
  const id = profileUser.id;
  try {
    const result = await api('/api/contact', { userId: id, add });
    if (!result.ok) throw new Error('contact');
    if (profileUser && profileUser.id === id) {
      profileUser.contact = add;
      renderUserProfile();
    }
    showToast(add ? 'Contacto añadido' : 'Contacto eliminado');
  } catch {
    showToast('No se pudo actualizar el contacto');
  }
}

function openHeaderProfile() {
  if (!current) return;
  if (current.type === 'group') openGroupInfo();
  else if (current.peer) openUserProfile(current.peer.id, current.name);
}

function statusTime(ts) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return (ts >= startToday ? 'Hoy, ' : 'Ayer, ') + formatTime(ts);
}

function formatSize(bytes) {
  if (bytes < 1048576) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(2) + ' GB';
}

function statusAvatarSrc(person) {
  if (person && person.group) return avatarSrc({ id: person.id, type: 'group', avatar: person.avatar });
  return userAvatarSrc(person);
}

function ringAvatar(container, person, seen, empty) {
  container.className = 'status-ring' + (seen ? ' seen' : '') + (empty ? ' empty' : '');
  container.textContent = '';
  const inner = document.createElement('div');
  inner.className = 'ring-avatar';
  fillAvatar(inner, person.id, person.name, statusAvatarSrc(person));
  container.appendChild(inner);
}

function statusRow(group) {
  const row = document.createElement('li');
  row.className = 'status-row';
  const ring = document.createElement('div');
  ringAvatar(ring, group.user, group.seen, false);
  row.appendChild(ring);
  const main = document.createElement('div');
  main.className = 'status-main';
  const name = document.createElement('span');
  name.className = 'status-name';
  name.textContent = group.user.name;
  const sub = document.createElement('span');
  sub.className = 'status-sub';
  sub.textContent = (group.user.group ? 'Grupo · ' : '') + statusTime(group.last);
  main.append(name, sub);
  row.appendChild(main);
  row.addEventListener('click', () => openStatusViewer(group));
  return row;
}

function renderStatuses() {
  if (!me) return;
  const mine = statusData.mine;
  ringAvatar(myStatusAvatar, me, false, !mine);
  if (!mine) {
    const plus = document.createElement('span');
    plus.className = 'status-plus';
    plus.textContent = '+';
    myStatusAvatar.appendChild(plus);
  }
  myStatusSub.textContent = mine
    ? mine.items.length + (mine.items.length === 1 ? ' estado · ' : ' estados · ') + statusTime(mine.last)
    : 'Toca para añadir un estado';
  const recent = statusData.others.filter(group => !group.seen);
  const viewed = statusData.others.filter(group => group.seen);
  statusRecent.textContent = '';
  statusSeen.textContent = '';
  recent.forEach(group => statusRecent.appendChild(statusRow(group)));
  viewed.forEach(group => statusSeen.appendChild(statusRow(group)));
  statusRecentTitle.classList.toggle('hidden', recent.length === 0);
  statusSeenTitle.classList.toggle('hidden', viewed.length === 0);
  statusEmpty.classList.toggle('hidden', statusData.others.length > 0);
}

async function refreshStatuses() {
  if (!token || !me) return;
  try {
    const result = await api('/api/statuses');
    if (!result.ok) return;
    const sig = JSON.stringify(result.data);
    if (sig === statusSig) return;
    statusSig = sig;
    statusData = result.data;
    renderStatuses();
  } catch {}
}

function statusMediaUrl(id) {
  return '/api/status-media?id=' + encodeURIComponent(id) + '&' + authQuery();
}

function firstUnseenIndex(group) {
  const index = group.items.findIndex(entry => !entry.seen);
  return index < 0 ? 0 : index;
}

function renderBars(group) {
  svBars.textContent = '';
  group.items.forEach((entry, index) => {
    const bar = document.createElement('div');
    bar.className = 'sv-bar';
    const fill = document.createElement('i');
    fill.style.width = index < svIndex ? '100%' : '0';
    bar.appendChild(fill);
    svBars.appendChild(bar);
  });
}

function setBarFill(progress) {
  const bar = svBars.children[svIndex];
  if (bar) bar.firstChild.style.width = Math.min(progress, 1) * 100 + '%';
}

function tickStatus() {
  if (svPaused) return;
  let progress;
  if (svVideo) progress = svVideo.duration ? svVideo.currentTime / svVideo.duration : 0;
  else progress = (svElapsed + performance.now() - svStart) / SV_IMAGE_MS;
  setBarFill(progress);
  if (!svVideo && progress >= 1) {
    nextStatusItem();
    return;
  }
  svFrame = requestAnimationFrame(tickStatus);
}

function pauseStatus(flag) {
  if (flag === svPaused) return;
  svPaused = flag;
  cancelAnimationFrame(svFrame);
  if (flag) {
    svElapsed += performance.now() - svStart;
    if (svVideo) svVideo.pause();
  } else {
    svStart = performance.now();
    if (svVideo) svVideo.play().catch(() => {});
    svFrame = requestAnimationFrame(tickStatus);
  }
}

function showStatusItem() {
  const group = svQueue[svGroup];
  const entry = group.items[svIndex];
  cancelAnimationFrame(svFrame);
  svPaused = false;
  svElapsed = 0;
  svVideo = null;
  closeViewers();
  renderBars(group);
  const own = group.mine || !!entry.mine;
  fillAvatar(svAvatar, group.user.id, group.user.name, statusAvatarSrc(group.user));
  svName.textContent = group.mine ? 'Mi estado' : group.user.group ? group.user.name + ' · ' + (entry.mine ? 'Tú' : entry.by || '') : group.user.name;
  svTime.textContent = statusTime(entry.time);
  svStage.textContent = '';
  svCaption.textContent = entry.caption || '';
  svCaption.classList.toggle('hidden', !entry.caption);
  svDelete.classList.toggle('hidden', !(group.mine || entry.canDelete));
  svViews.classList.toggle('hidden', !own);
  if (own) svViews.textContent = '👁 ' + (entry.views ? entry.views.length : 0);
  if (!own && !entry.seen) {
    entry.seen = true;
    api('/api/status/view', { id: entry.id }).then(refreshStatuses).catch(() => {});
  }
  if (entry.kind === 'video') {
    const video = document.createElement('video');
    video.playsInline = true;
    video.autoplay = true;
    video.addEventListener('ended', () => {
      if (svVideo === video) nextStatusItem();
    });
    video.addEventListener('error', () => {
      if (svVideo !== video) return;
      showToast('No se pudo reproducir el video');
      nextStatusItem();
    });
    video.src = statusMediaUrl(entry.id);
    svStage.appendChild(video);
    svVideo = video;
    svStart = performance.now();
    svFrame = requestAnimationFrame(tickStatus);
  } else {
    const img = document.createElement('img');
    img.alt = '';
    img.draggable = false;
    img.addEventListener('load', () => {
      if (!svStage.contains(img) || svPaused) return;
      svElapsed = 0;
      svStart = performance.now();
      svFrame = requestAnimationFrame(tickStatus);
    });
    img.addEventListener('error', () => {
      if (!svStage.contains(img)) return;
      showToast('No se pudo cargar la imagen');
      nextStatusItem();
    });
    img.src = statusMediaUrl(entry.id);
    svStage.appendChild(img);
  }
}

function nextStatusItem() {
  if (view !== 'statusview') return;
  const group = svQueue[svGroup];
  if (svIndex < group.items.length - 1) {
    svIndex += 1;
    showStatusItem();
    return;
  }
  if (svGroup < svQueue.length - 1) {
    svGroup += 1;
    svIndex = firstUnseenIndex(svQueue[svGroup]);
    showStatusItem();
    return;
  }
  goBack();
}

function prevStatusItem() {
  if (view !== 'statusview') return;
  if (svIndex > 0) {
    svIndex -= 1;
  } else if (svGroup > 0) {
    svGroup -= 1;
    svIndex = 0;
  }
  showStatusItem();
}

function stopStatusViewer() {
  cancelAnimationFrame(svFrame);
  const video = svVideo;
  svVideo = null;
  if (video) video.pause();
  svStage.textContent = '';
  closeViewers();
}

async function openStatusViewer(group) {
  if (group.mine) {
    await refreshStatuses();
    if (!statusData.mine) return;
    svQueue = [statusData.mine];
  } else {
    const start = statusData.others.findIndex(item => item.user.id === group.user.id);
    svQueue = statusData.others.slice(Math.max(start, 0));
  }
  svGroup = 0;
  svIndex = firstUnseenIndex(svQueue[0]);
  enter('statusview', false);
  showStatusItem();
}

function openViewers() {
  const entry = svQueue[svGroup].items[svIndex];
  const views = entry.views || [];
  svViewersTitle.textContent = 'Visto por ' + views.length;
  svViewersList.textContent = '';
  views.forEach(item => {
    const row = memberRow(item, false, false);
    const state = row.querySelector('.member-state');
    state.classList.remove('on');
    state.textContent = statusTime(item.time);
    svViewersList.appendChild(row);
  });
  svViewers.classList.remove('hidden');
  pauseStatus(true);
}

function closeViewers() {
  if (svViewers.classList.contains('hidden')) return;
  svViewers.classList.add('hidden');
  if (view === 'statusview') pauseStatus(false);
}

async function deleteStatusItem() {
  const group = svQueue[svGroup];
  const entry = group.items[svIndex];
  if (!(group.mine || entry.canDelete) || !confirm('¿Eliminar este estado?')) return;
  pauseStatus(true);
  try {
    const result = await api('/api/status/delete', { id: entry.id });
    if (!result.ok) throw new Error('delete');
    group.items.splice(svIndex, 1);
    showToast('Estado eliminado');
    if (!group.items.length) {
      goBack();
      return;
    }
    svIndex = Math.min(svIndex, group.items.length - 1);
    showStatusItem();
  } catch {
    showToast('No se pudo eliminar el estado');
    pauseStatus(false);
  }
}

function bindStatusTap(el, action) {
  let holdTimer = null;
  let held = false;
  const release = () => {
    clearTimeout(holdTimer);
    if (!held) return false;
    held = false;
    pauseStatus(false);
    return true;
  };
  el.addEventListener('pointerdown', () => {
    held = false;
    holdTimer = setTimeout(() => {
      held = true;
      pauseStatus(true);
    }, 250);
  });
  el.addEventListener('pointerup', () => {
    if (!release()) {
      clearTimeout(holdTimer);
      action();
    }
  });
  el.addEventListener('pointerleave', release);
  el.addEventListener('pointercancel', release);
}

function clearStatusDraft() {
  const xhr = statusXhr;
  statusXhr = null;
  if (xhr) xhr.abort();
  if (statusDraft) {
    URL.revokeObjectURL(statusDraft.url);
    statusDraft = null;
  }
  statusPreview.textContent = '';
}

function setStatusProgress(ratio) {
  const percent = Math.round(ratio * 100);
  statusProgressBar.style.width = percent + '%';
  statusProgressText.textContent = 'Subiendo ' + percent + '% de ' + formatSize(statusDraft ? statusDraft.file.size : 0);
}

function openStatusDraft(file) {
  statusDraft = { file, url: URL.createObjectURL(file), group: statusTarget };
  statusReturn = statusTarget ? current : null;
  statusTarget = '';
  const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'img');
  media.src = statusDraft.url;
  if (file.type.startsWith('video/')) {
    media.controls = true;
    media.playsInline = true;
  }
  statusPreview.textContent = '';
  statusPreview.appendChild(media);
  statusCaption.value = '';
  statusCaption.disabled = false;
  statusPublish.disabled = false;
  statusProgress.classList.add('hidden');
  enter('statusnew', false);
}

function publishStatus() {
  if (!statusDraft || statusXhr) return;
  const xhr = new XMLHttpRequest();
  statusXhr = xhr;
  const caption = statusCaption.value.trim();
  const groupQuery = statusDraft.group ? '&group=' + encodeURIComponent(statusDraft.group) : '';
  xhr.open('POST', '/api/status?caption=' + encodeURIComponent(caption) + groupQuery + '&' + authQuery());
  xhr.setRequestHeader('Content-Type', statusDraft.file.type);
  statusPublish.disabled = true;
  statusCaption.disabled = true;
  statusProgress.classList.remove('hidden');
  setStatusProgress(0);
  const fail = text => {
    if (statusXhr !== xhr) return;
    statusXhr = null;
    statusPublish.disabled = false;
    statusCaption.disabled = false;
    statusProgress.classList.add('hidden');
    showToast(text);
  };
  xhr.upload.addEventListener('progress', event => {
    if (statusXhr === xhr && event.lengthComputable) setStatusProgress(event.loaded / event.total);
  });
  xhr.addEventListener('load', () => {
    if (statusXhr !== xhr) return;
    if (xhr.status === 401) {
      statusXhr = null;
      endSession();
      return;
    }
    if (xhr.status !== 200) {
      fail(xhr.status === 415 ? 'Formato no compatible' : xhr.status === 403 ? 'El grupo no permite publicar estados' : 'No se pudo publicar el estado');
      return;
    }
    statusXhr = null;
    showToast('Estado publicado');
    goBack();
  });
  xhr.addEventListener('error', () => fail('Falló la subida. Revisa tu conexión'));
  xhr.send(statusDraft.file);
}

async function openNewChat() {
  enter('new', false);
  userList.textContent = '';
  userEmpty.classList.add('hidden');
  try {
    const result = await api('/api/users');
    if (!result.ok) return;
    pickUsers = result.data;
    if (!pickUsers.length) userEmpty.classList.remove('hidden');
    pickUsers.forEach(person => {
      const row = memberRow(person, person.online, false);
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => startDm(person));
      userList.appendChild(row);
    });
  } catch {}
}

async function openNewGroupFromTab() {
  try {
    const result = await api('/api/users');
    if (!result.ok) return showToast('No se pudo cargar los contactos');
    pickUsers = result.data;
  } catch {
    return showToast('No se pudo cargar los contactos');
  }
  picked = new Set();
  groupNameInput.value = '';
  renderPick();
  updateCreateButton();
  enter('newgroup', false);
}

async function startDm(person) {
  try {
    const result = await api('/api/dm', { userId: person.id });
    if (!result.ok) return showToast('No se pudo abrir el chat');
    openConv(result.data, true);
  } catch {}
}

function updateCreateButton() {
  createGroupBtn.disabled = !(groupNameInput.value.trim() && picked.size > 0);
}

function renderPick() {
  pickList.textContent = '';
  pickUsers.forEach(person => {
    const row = memberRow(person, person.online, false);
    row.classList.add('pick-row');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = picked.has(person.id);
    row.appendChild(box);
    row.addEventListener('click', () => {
      if (picked.has(person.id)) picked.delete(person.id);
      else picked.add(person.id);
      box.checked = picked.has(person.id);
      updateCreateButton();
    });
    pickList.appendChild(row);
  });
}

function openNewGroup() {
  picked = new Set();
  groupNameInput.value = '';
  renderPick();
  updateCreateButton();
  enter('newgroup', true);
}

async function createGroup() {
  const name = groupNameInput.value.trim();
  if (!name || picked.size === 0) return;
  createGroupBtn.disabled = true;
  try {
    const result = await api('/api/groups', { name, members: [...picked] });
    if (!result.ok) {
      showToast('No se pudo crear el grupo');
      updateCreateButton();
      return;
    }
    openConv(result.data, true);
  } catch {
    updateCreateButton();
  }
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('image'));
    reader.readAsDataURL(file);
  });
}

async function prepareAvatar(file) {
  if (file.type === 'image/gif') {
    if (file.size > MAX_GIF_BYTES) throw new Error('size');
    return readDataUrl(file);
  }
  return resizeImage(file, 256, 256);
}

async function prepareBanner(file) {
  if (file.type === 'image/gif') {
    if (file.size > MAX_GIF_BYTES) throw new Error('size');
    return readDataUrl(file);
  }
  return resizeImage(file, 960, 360);
}

function photoError(error) {
  showToast(error && error.message === 'size' ? 'El GIF pesa más de ' + MAX_GIF_BYTES / 1048576 + ' MB' : 'No se pudo cambiar la foto');
}

function openProfile() {
  closeDeleteForm();
  adminList.classList.add('hidden');
  renderProfile();
  refreshPushUi();
  enter('profile', false);
}

function resizeImage(file, width, height) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(width / img.width, height / img.height);
      const sw = width / scale;
      const sh = height / scale;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, width, height);
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

function showLogin() {
  closeDeleteForm();
  loginEl.classList.remove('hidden');
  passwordInput.value = '';
  setPasswordVisible(false);
  [homeEl, chatEl, groupInfo, userProfileEl, statusNewEl, statusViewEl, newChatEl, newGroupEl, profileEl].forEach(item => item.classList.add('hidden'));
  usernameInput.focus();
}

function showLoginError(text) {
  loginError.textContent = text;
  loginError.classList.remove('hidden');
  showLogin();
}

function renderSignupAvatar() {
  signupAvatar.textContent = '';
  signupAvatar.classList.toggle('filled', !!signupImage);
  if (signupImage) {
    const img = document.createElement('img');
    img.alt = '';
    img.src = signupImage;
    signupAvatar.appendChild(img);
  } else {
    signupAvatar.textContent = '📷';
  }
}

function resetSignupPhoto() {
  signupImage = '';
  renderSignupAvatar();
}

function setPasswordVisible(visible) {
  passwordInput.type = visible ? 'text' : 'password';
  passwordToggle.setAttribute('aria-pressed', visible ? 'true' : 'false');
  passwordToggle.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
  passwordToggle.querySelector('.ic-eye').classList.toggle('hidden', visible);
  passwordToggle.querySelector('.ic-eye-off').classList.toggle('hidden', !visible);
}

function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function generatePassword(length = 16) {
  const sets = [
    'abcdefghijkmnopqrstuvwxyz',
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    '23456789',
    '!@#$%^&*-_+=?'
  ];
  const all = sets.join('');
  const chars = sets.map(set => set[randomInt(set.length)]);
  while (chars.length < length) chars.push(all[randomInt(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function setMode(register) {
  registerMode = register;
  passwordGenerate.classList.toggle('hidden', !register);
  setPasswordVisible(false);
  signupPhoto.classList.toggle('hidden', !register);
  if (!register) signupImage = '';
  renderSignupAvatar();
  loginSubtitle.textContent = register ? 'Crea tu cuenta para entrar' : 'Inicia sesión para entrar';
  loginSubmit.textContent = register ? 'Crear cuenta' : 'Entrar';
  loginToggle.textContent = register ? '¿Ya tienes cuenta? Entrar' : '¿No tienes cuenta? Crear una';
  passwordInput.autocomplete = register ? 'new-password' : 'current-password';
  loginError.classList.add('hidden');
}

function clearSession() {
  token = '';
  me = null;
  current = null;
  chats = [];
  chatsSig = '';
  statusData = { mine: null, others: [] };
  statusSig = '';
  setTab('chats');
  localStorage.removeItem('chat_token');
}

function endSession() {
  stopEvents();
  clearSession();
  showLogin();
}

async function enterApp() {
  let response;
  try {
    response = await fetch('/api/me?' + authQuery());
  } catch {
    showLoginError('No se pudo conectar con el servidor');
    return;
  }
  if (!response.ok) {
    clearSession();
    showLogin();
    return;
  }
  me = (await response.json()).user;
  rememberAvatar(me);
  updateProfileBtn();
  loginEl.classList.add('hidden');
  history.replaceState({ v: 'list' }, '');
  showView('list');
  await refreshChats();
  connectEvents();
  ensurePush();
  updatePushBanner();
  consumePendingConv();
}

avatarBtn.addEventListener('click', () => {
  if (current && current.type === 'group') avatarInput.click();
  else openHeaderProfile();
});

avatarInput.addEventListener('change', async () => {
  const file = avatarInput.files[0];
  avatarInput.value = '';
  if (!file || !current) return;
  try {
    const image = await prepareAvatar(file);
    const result = await api('/api/group-avatar?conv=' + encodeURIComponent(current.id), { image });
    if (!result.ok) throw new Error('upload');
    showToast('Foto del grupo actualizada');
  } catch (error) {
    photoError(error);
  }
});

profileInput.addEventListener('change', async () => {
  const file = profileInput.files[0];
  profileInput.value = '';
  if (!file) return;
  try {
    const image = await prepareAvatar(file);
    const result = await api('/api/profile-avatar', { image });
    if (!result.ok) throw new Error('upload');
    me.avatar = result.data.avatar;
    updateProfileBtn();
    renderProfile();
    showToast('Foto de perfil actualizada');
  } catch (error) {
    photoError(error);
  }
});

removePhotoBtn.addEventListener('click', async () => {
  try {
    const result = await api('/api/profile-avatar', { remove: true });
    if (!result.ok) throw new Error('upload');
    me.avatar = 0;
    updateProfileBtn();
    renderProfile();
    showToast('Foto de perfil eliminada');
  } catch {
    showToast('No se pudo quitar la foto');
  }
});

bannerInput.addEventListener('change', async () => {
  const file = bannerInput.files[0];
  bannerInput.value = '';
  if (!file) return;
  try {
    const image = await prepareBanner(file);
    const result = await api('/api/profile-banner', { image });
    if (!result.ok) throw new Error('upload');
    me.banner = result.data.banner;
    renderProfile();
    showToast('Banner actualizado');
  } catch (error) {
    showToast(error && error.message === 'size' ? 'El GIF pesa más de ' + MAX_GIF_BYTES / 1048576 + ' MB' : 'No se pudo cambiar el banner');
  }
});

removeBannerBtn.addEventListener('click', async () => {
  try {
    const result = await api('/api/profile-banner', { remove: true });
    if (!result.ok) throw new Error('upload');
    me.banner = 0;
    renderProfile();
    showToast('Banner eliminado');
  } catch {
    showToast('No se pudo quitar el banner');
  }
});

changeBannerBtn.addEventListener('click', () => bannerInput.click());

async function saveAikoImage(path, body, field, message, failure) {
  try {
    const result = await api(path, { ...body, target: AIKO_ID });
    if (!result.ok) throw new Error('upload');
    if (profileUser && profileUser.id === AIKO_ID) {
      profileUser[field] = result.data[field];
      rememberAvatar(profileUser);
      renderUserProfile();
    }
    refreshMessageAvatars();
    refreshChats();
    showToast(message);
  } catch (error) {
    showToast(error && error.message === 'size' ? 'El GIF pesa más de ' + MAX_GIF_BYTES / 1048576 + ' MB' : failure);
  }
}

aikoAvatarBtn.addEventListener('click', () => aikoAvatarInput.click());
aikoBannerBtn.addEventListener('click', () => aikoBannerInput.click());

aikoAvatarInput.addEventListener('change', async () => {
  const file = aikoAvatarInput.files[0];
  aikoAvatarInput.value = '';
  if (!file) return;
  try {
    const image = await prepareAvatar(file);
    await saveAikoImage('/api/profile-avatar', { image }, 'avatar', 'Foto de Aiko actualizada', 'No se pudo cambiar la foto');
  } catch (error) {
    photoError(error);
  }
});

aikoBannerInput.addEventListener('change', async () => {
  const file = aikoBannerInput.files[0];
  aikoBannerInput.value = '';
  if (!file) return;
  try {
    const image = await prepareBanner(file);
    await saveAikoImage('/api/profile-banner', { image }, 'banner', 'Banner de Aiko actualizado', 'No se pudo cambiar el banner');
  } catch (error) {
    showToast(error && error.message === 'size' ? 'El GIF pesa más de ' + MAX_GIF_BYTES / 1048576 + ' MB' : 'No se pudo cambiar el banner');
  }
});

aikoAvatarRemoveBtn.addEventListener('click', () => saveAikoImage('/api/profile-avatar', { remove: true }, 'avatar', 'Foto de Aiko eliminada', 'No se pudo quitar la foto'));
aikoBannerRemoveBtn.addEventListener('click', () => saveAikoImage('/api/profile-banner', { remove: true }, 'banner', 'Banner de Aiko eliminado', 'No se pudo quitar el banner'));

signupAvatar.addEventListener('click', () => signupInput.click());

signupInput.addEventListener('change', async () => {
  const file = signupInput.files[0];
  signupInput.value = '';
  if (!file) return;
  try {
    signupImage = await prepareAvatar(file);
    renderSignupAvatar();
  } catch (error) {
    photoError(error);
  }
});

profileBtn.addEventListener('click', openProfile);
profileAvatar.addEventListener('click', () => profileInput.click());
changePhotoBtn.addEventListener('click', () => profileInput.click());
profileBack.addEventListener('click', goBack);

groupTitle.addEventListener('click', openHeaderProfile);
userBack.addEventListener('click', goBack);
myStatus.addEventListener('click', () => {
  if (statusData.mine) openStatusViewer(statusData.mine);
  else {
    statusTarget = '';
    statusInput.click();
  }
});
statusFab.addEventListener('click', () => {
  statusTarget = '';
  statusInput.click();
});
groupStatusPost.addEventListener('click', () => {
  if (!current) return;
  statusTarget = current.id;
  statusInput.click();
});
groupStatusMode.addEventListener('change', async () => {
  if (!current) return;
  const convId = current.id;
  try {
    const result = await api('/api/group-settings?conv=' + encodeURIComponent(convId), { statusMode: groupStatusMode.value });
    if (!result.ok) throw new Error('settings');
    showToast('Ajuste guardado');
  } catch {
    showToast('No se pudo guardar el ajuste');
  }
  refreshMembers();
});
statusInput.addEventListener('change', () => {
  const file = statusInput.files[0];
  statusInput.value = '';
  if (!file) return;
  if (!STATUS_ALLOWED.includes(file.type)) {
    showToast('Formato no compatible. Usa JPG, PNG, GIF, WEBP, MP4, WEBM o MOV');
    return;
  }
  openStatusDraft(file);
});
statusForm.addEventListener('submit', event => {
  event.preventDefault();
  publishStatus();
});
statusNewBack.addEventListener('click', goBack);
svClose.addEventListener('click', goBack);
svDelete.addEventListener('click', deleteStatusItem);
svViews.addEventListener('click', openViewers);
svViewersClose.addEventListener('click', closeViewers);
bindStatusTap(svTapPrev, prevStatusItem);
bindStatusTap(svTapNext, nextStatusItem);
document.addEventListener('keydown', event => {
  if (view !== 'statusview') return;
  if (event.key === 'ArrowRight') nextStatusItem();
  else if (event.key === 'ArrowLeft') prevStatusItem();
});
addContactBtn.addEventListener('click', () => setContact(true));
removeContactBtn.addEventListener('click', () => setContact(false));
messageBtn.addEventListener('click', () => {
  if (profileUser) startDm(profileUser);
});
chatBack.addEventListener('click', goBack);
infoBack.addEventListener('click', goBack);
newBack.addEventListener('click', goBack);
groupBack.addEventListener('click', goBack);
newChatBtn.addEventListener('click', openNewChat);
newGroupFab.addEventListener('click', openNewGroupFromTab);
callBtn.addEventListener('click', () => showToast('Las llamadas llegarán pronto'));
navItems.forEach(item => item.addEventListener('click', () => setTab(item.dataset.tab)));
newGroupRow.addEventListener('click', openNewGroup);
groupNameInput.addEventListener('input', updateCreateButton);
createGroupBtn.addEventListener('click', createGroup);

memberMore.addEventListener('click', () => {
  showAllMembers = true;
  renderMembers();
});

replyCancel.addEventListener('click', clearReply);

function fold(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function readRecents() {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(list) ? list.filter(item => typeof item === 'string').slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function saveRecent(char) {
  const list = [char, ...readRecents().filter(item => item !== char)].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

async function loadEmojiData() {
  if (emojiData) return emojiData;
  for (const url of EMOJI_DATA_URLS) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const raw = await response.json();
      const list = raw
        .filter(item => typeof item.group === 'number' && item.group !== 2 && (item.unicode || item.emoji))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(item => {
          const name = item.label || item.annotation || '';
          const tags = Array.isArray(item.tags) ? item.tags : [];
          return {
            char: item.unicode || item.emoji,
            name,
            group: item.group,
            fname: fold(name),
            search: fold([name, ...tags].join(' '))
          };
        });
      if (list.length) {
        emojiData = list;
        return list;
      }
    } catch {}
  }
  return null;
}

function emojiCell(item) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ep-cell';
  button.dataset.char = item.char;
  button.title = item.name || '';
  button.setAttribute('aria-label', item.name || item.char);
  button.appendChild(emojiImage(item.char, () => button.remove()));
  return button;
}

function fillGrid(grid, items) {
  grid.textContent = '';
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(emojiCell(item)));
  grid.appendChild(fragment);
}

function recentItems() {
  return readRecents().map(char => emojiByChar.get(char) || { char, name: '' });
}

function panelHint(text, retry) {
  const hint = document.createElement('div');
  hint.className = 'ep-hint';
  hint.textContent = text;
  if (retry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Reintentar';
    button.addEventListener('click', retry);
    hint.appendChild(button);
  }
  return hint;
}

function updateActiveCat() {
  const sections = [...epScroll.querySelectorAll('.ep-section:not(.hidden)')];
  if (!sections.length) return;
  const top = epScroll.scrollTop + 4;
  let active = sections[0].dataset.group;
  sections.forEach(section => {
    if (section.offsetTop <= top) active = section.dataset.group;
  });
  if (epScroll.scrollTop + epScroll.clientHeight >= epScroll.scrollHeight - 2) {
    active = sections[sections.length - 1].dataset.group;
  }
  epCats.querySelectorAll('.ep-cat').forEach(nav => nav.classList.toggle('active', nav.dataset.group === active));
}

function buildEmojiBody() {
  epScroll.textContent = '';
  epCats.textContent = '';
  EMOJI_GROUPS.forEach(group => {
    const items = group.id === 'recent' ? recentItems() : emojiData.filter(item => item.group === group.id);

    const section = document.createElement('section');
    section.className = 'ep-section';
    section.dataset.group = String(group.id);
    section.classList.toggle('hidden', items.length === 0);
    const title = document.createElement('div');
    title.className = 'ep-title';
    title.textContent = group.title;
    const grid = document.createElement('div');
    grid.className = 'ep-grid';
    fillGrid(grid, items);
    section.append(title, grid);
    epScroll.appendChild(section);

    const nav = document.createElement('button');
    nav.type = 'button';
    nav.className = 'ep-cat';
    nav.dataset.group = String(group.id);
    nav.setAttribute('aria-label', group.title);
    nav.classList.toggle('hidden', items.length === 0);
    nav.appendChild(emojiImage(group.icon));
    epCats.appendChild(nav);
  });
  epScroll.scrollTop = 0;
  updateActiveCat();
}

function refreshRecents() {
  const section = epScroll.querySelector('.ep-section[data-group="recent"]');
  const nav = epCats.querySelector('.ep-cat[data-group="recent"]');
  if (!section || !nav) return;
  const items = recentItems();
  fillGrid(section.querySelector('.ep-grid'), items);
  section.classList.toggle('hidden', items.length === 0);
  nav.classList.toggle('hidden', items.length === 0);
  updateActiveCat();
}

async function ensureEmojiBody() {
  if (emojiRendered) {
    if (!emojiSearching) refreshRecents();
    return;
  }
  if (emojiLoading) return;
  emojiLoading = true;
  epScroll.textContent = '';
  epScroll.appendChild(panelHint('Cargando emojis...'));
  const data = await loadEmojiData();
  emojiLoading = false;
  if (!data) {
    epScroll.textContent = '';
    epScroll.appendChild(panelHint('No se pudieron cargar los emojis', ensureEmojiBody));
    return;
  }
  emojiByChar = new Map(data.map(item => [item.char, item]));
  emojiRendered = true;
  if (!emojiSearching) buildEmojiBody();
}

function showSearchResults(raw) {
  const query = fold(raw.trim());
  epScroll.textContent = '';
  if (!query) {
    epScroll.appendChild(panelHint('Escribe para buscar un emoji'));
    return;
  }
  const tokens = query.split(/\s+/);
  const matches = emojiData
    .filter(item => tokens.every(token => item.search.includes(token)))
    .sort((a, b) => Number(b.fname.startsWith(query)) - Number(a.fname.startsWith(query)))
    .slice(0, SEARCH_MAX);
  if (!matches.length) {
    epScroll.appendChild(panelHint('No se encontraron emojis'));
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'ep-grid';
  fillGrid(grid, matches);
  epScroll.appendChild(grid);
  epScroll.scrollTop = 0;
}

function openEmojiSearch() {
  if (!emojiRendered || emojiSearching) return;
  emojiSearching = true;
  epHeadMain.classList.add('hidden');
  epSearchRow.classList.remove('hidden');
  epCats.classList.add('hidden');
  epSearchInput.value = '';
  showSearchResults('');
  epSearchInput.focus();
}

function closeEmojiSearch() {
  if (!emojiSearching) return;
  emojiSearching = false;
  epSearchRow.classList.add('hidden');
  epHeadMain.classList.remove('hidden');
  epCats.classList.remove('hidden');
  epSearchInput.value = '';
  epSearchInput.blur();
  if (emojiRendered) buildEmojiBody();
}

function setEmojiTab(tab) {
  const isEmoji = tab === 'emoji';
  epTabEmoji.classList.toggle('active', isEmoji);
  epTabSticker.classList.toggle('active', !isEmoji);
  epEmojiView.classList.toggle('hidden', !isEmoji);
  epStickerView.classList.toggle('hidden', isEmoji);
  epSearchBtn.classList.toggle('invisible', !isEmoji);
  if (!isEmoji) closeEmojiSearch();
}

function openEmojiPanel() {
  const nearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 120;
  emojiPanelOpen = true;
  emojiBtn.classList.add('open');
  emojiPanel.classList.remove('hidden');
  msgInput.blur();
  ensureEmojiBody();
  if (nearBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
}

function closeEmojiPanel(focusInput) {
  if (!emojiPanelOpen) return;
  emojiPanelOpen = false;
  closeEmojiSearch();
  emojiBtn.classList.remove('open');
  emojiPanel.classList.add('hidden');
  if (focusInput) msgInput.focus();
}

function insertEmoji(char) {
  const value = msgInput.value;
  const start = msgInput.selectionStart == null ? value.length : msgInput.selectionStart;
  const end = msgInput.selectionEnd == null ? start : msgInput.selectionEnd;
  const next = value.slice(0, start) + char + value.slice(end);
  if (next.length > msgInput.maxLength) return;
  msgInput.value = next;
  const position = start + char.length;
  msgInput.setSelectionRange(position, position);
  msgInput.dispatchEvent(new Event('input'));
  saveRecent(char);
}

function backspaceInput() {
  const value = msgInput.value;
  const start = msgInput.selectionStart == null ? value.length : msgInput.selectionStart;
  const end = msgInput.selectionEnd == null ? start : msgInput.selectionEnd;
  let from = start;
  if (start === end) {
    const before = value.slice(0, start);
    const parts = typeof Intl.Segmenter === 'function'
      ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(before))
      : Array.from(before);
    const last = parts[parts.length - 1];
    from = start - (last ? (last.segment || last).length : 0);
  }
  msgInput.value = value.slice(0, from) + value.slice(end);
  msgInput.setSelectionRange(from, from);
  msgInput.dispatchEvent(new Event('input'));
}

emojiBtn.addEventListener('click', () => {
  if (emojiPanelOpen) closeEmojiPanel(true);
  else openEmojiPanel();
});

msgInput.addEventListener('focus', () => closeEmojiPanel(false));
epTabEmoji.addEventListener('click', () => setEmojiTab('emoji'));
epTabSticker.addEventListener('click', () => setEmojiTab('sticker'));
epSearchBtn.addEventListener('click', openEmojiSearch);
epSearchBack.addEventListener('click', closeEmojiSearch);
epBackspace.addEventListener('click', backspaceInput);
epSearchInput.addEventListener('input', () => {
  if (emojiRendered) showSearchResults(epSearchInput.value);
});

epScroll.addEventListener('click', event => {
  const cell = event.target.closest('.ep-cell');
  if (cell) insertEmoji(cell.dataset.char);
});

epScroll.addEventListener('scroll', () => {
  if (emojiSearching) return;
  cancelAnimationFrame(spyFrame);
  spyFrame = requestAnimationFrame(updateActiveCat);
}, { passive: true });

epCats.addEventListener('click', event => {
  const nav = event.target.closest('.ep-cat');
  if (!nav) return;
  const section = epScroll.querySelector('.ep-section[data-group="' + nav.dataset.group + '"]');
  if (section) epScroll.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
});

function finishSwipe(cancelled) {
  if (!swipe) return;
  const { row, dx } = swipe;
  swipe = null;
  row.style.transition = '';
  row.style.transform = '';
  row.classList.remove('swipe-ready');
  if (cancelled || dx < SWIPE_TRIGGER) return;
  const message = messageIndex.get(Number(row.dataset.id));
  if (message) setReply(message);
}

messagesEl.addEventListener('touchstart', event => {
  const row = event.target.closest('.msg-row');
  if (!row || event.touches.length !== 1) {
    swipe = null;
    return;
  }
  const touch = event.touches[0];
  swipe = { row, x: touch.clientX, y: touch.clientY, dx: 0, active: false };
}, { passive: true });

messagesEl.addEventListener('touchmove', event => {
  if (!swipe) return;
  const touch = event.touches[0];
  const dx = touch.clientX - swipe.x;
  const dy = touch.clientY - swipe.y;
  if (!swipe.active) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      swipe = null;
      return;
    }
    if (dx > 10 && dx > Math.abs(dy)) {
      swipe.active = true;
      swipe.row.style.transition = 'none';
    } else {
      return;
    }
  }
  swipe.dx = Math.max(0, Math.min(dx, SWIPE_MAX));
  swipe.row.style.transform = 'translateX(' + swipe.dx + 'px)';
  swipe.row.classList.toggle('swipe-ready', swipe.dx >= SWIPE_TRIGGER);
}, { passive: true });

messagesEl.addEventListener('touchend', () => finishSwipe(false));
messagesEl.addEventListener('touchcancel', () => finishSwipe(true));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (emojiSearching) return closeEmojiSearch();
  if (emojiPanelOpen) return closeEmojiPanel(true);
  if (view !== 'list' && token) goBack();
});

logoutBtn.addEventListener('click', async () => {
  await dropPush(true);
  try {
    await fetch('/api/logout?' + authQuery(), { method: 'POST' });
  } catch {}
  clearSession();
  location.reload();
});

async function loadAdminUsers() {
  let result;
  try {
    result = await api('/api/admin/users');
  } catch {
    return;
  }
  if (!result.ok) {
    showToast('No autorizado');
    return;
  }
  adminList.textContent = '';
  if (!result.data.length) {
    const empty = document.createElement('li');
    empty.className = 'member';
    empty.textContent = 'No hay otros usuarios';
    adminList.appendChild(empty);
    return;
  }
  result.data.forEach(item => {
    const row = memberRow(item, item.online, false);
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'admin-del';
    del.textContent = 'Eliminar';
    del.addEventListener('click', async () => {
      if (!confirm('¿Eliminar definitivamente la cuenta de ' + item.name + '?')) return;
      try {
        const response = await api('/api/admin/delete', { id: item.id });
        if (!response.ok) throw new Error('delete');
        showToast('Cuenta eliminada');
        loadAdminUsers();
      } catch {
        showToast('No se pudo eliminar');
      }
    });
    row.appendChild(del);
    adminList.appendChild(row);
  });
}

adminToggleBtn.addEventListener('click', () => {
  const opening = adminList.classList.contains('hidden');
  adminList.classList.toggle('hidden', !opening);
  if (opening) loadAdminUsers();
});

function closeDeleteForm() {
  deleteAccountForm.classList.add('hidden');
  deleteAccountBtn.classList.remove('hidden');
  deletePasswordInput.value = '';
  deleteError.classList.add('hidden');
}

deleteAccountBtn.addEventListener('click', () => {
  deleteAccountBtn.classList.add('hidden');
  deleteAccountForm.classList.remove('hidden');
  deletePasswordInput.focus();
});

deleteCancelBtn.addEventListener('click', closeDeleteForm);

deleteAccountForm.addEventListener('submit', async event => {
  event.preventDefault();
  const password = deletePasswordInput.value;
  if (!password) return;
  deleteConfirmBtn.disabled = true;
  deleteError.classList.add('hidden');
  try {
    const result = await api('/api/account/delete', { password });
    if (!result.ok) {
      deleteError.textContent = result.data.error === 'credentials'
        ? 'Contraseña incorrecta'
        : result.data.error === 'rate'
          ? 'Demasiados intentos, espera un minuto'
          : 'No se pudo eliminar la cuenta';
      deleteError.classList.remove('hidden');
      return;
    }
    await dropPush(false);
    stopEvents();
    clearSession();
    location.reload();
  } catch {
    deleteError.textContent = 'No se pudo eliminar la cuenta';
    deleteError.classList.remove('hidden');
  } finally {
    deleteConfirmBtn.disabled = false;
  }
});

msgInput.addEventListener('input', () => {
  if (!current || !msgInput.value.trim()) return;
  const now = Date.now();
  if (now - lastTypingSent < 2500) return;
  lastTypingSent = now;
  api('/api/typing?conv=' + encodeURIComponent(current.id), {}).catch(() => {});
});

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

async function prepareChatImage(file) {
  if (file.type === 'image/gif') {
    if (file.size > MAX_CHAT_IMAGE_BYTES) throw new Error('size');
    const gif = await loadImage(file);
    return { blob: file, w: gif.naturalWidth, h: gif.naturalHeight };
  }
  const img = await loadImage(file);
  const scale = Math.min(1, CHAT_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.82));
  if (!blob) throw new Error('image');
  return { blob, w, h };
}

attachBtn.addEventListener('click', () => showToast('Los adjuntos llegarán pronto'));

photoBtn.addEventListener('click', () => {
  if (current) imageInput.click();
});

imageInput.addEventListener('change', async () => {
  const file = imageInput.files[0];
  imageInput.value = '';
  if (!file || !current) return;
  try {
    const prepared = await prepareChatImage(file);
    if (prepared.blob.size > MAX_CHAT_IMAGE_BYTES) throw new Error('size');
    pendingImage = { ...prepared, url: URL.createObjectURL(prepared.blob), convId: current.id };
    imagePreviewImg.src = pendingImage.url;
    imageCaption.value = msgInput.value.trim();
    imageSendBtn.disabled = false;
    history.pushState({ v: view }, '');
    imagePreview.classList.remove('hidden');
  } catch (error) {
    showToast(error && error.message === 'size' ? 'La imagen pesa más de ' + MAX_CHAT_IMAGE_BYTES / 1048576 + ' MB' : 'No se pudo abrir la imagen');
  }
});

imageForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!pendingImage || sendingImage) return;
  const image = pendingImage;
  sendingImage = true;
  imageSendBtn.disabled = true;
  const query = new URLSearchParams({ conv: image.convId, caption: imageCaption.value.trim(), w: image.w, h: image.h, token });
  if (replyTo) query.set('replyTo', replyTo.id);
  try {
    const response = await fetch('/api/send-image?' + query.toString(), {
      method: 'POST',
      headers: { 'Content-Type': image.blob.type || 'image/jpeg' },
      body: image.blob
    });
    if (response.status === 401) {
      endSession();
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : 'upload');
    if (imageCaption.value.trim() && msgInput.value.trim() === imageCaption.value.trim()) msgInput.value = '';
    clearReply();
    history.back();
    if (current && current.id === image.convId) renderMessage(data);
  } catch (error) {
    imageSendBtn.disabled = false;
    showToast(error && error.message === 'size' ? 'La imagen es demasiado pesada' : 'No se pudo enviar la imagen');
  } finally {
    sendingImage = false;
  }
});

imagePreviewClose.addEventListener('click', () => history.back());
imageViewerClose.addEventListener('click', () => history.back());

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text || !current) return;
  const convId = current.id;
  const body = { text };
  if (replyTo) body.replyTo = replyTo.id;
  msgInput.value = '';
  lastTypingSent = 0;
  clearReply();
  try {
    const result = await api('/api/send?conv=' + encodeURIComponent(convId), body);
    if (result.ok && current && current.id === convId) renderMessage(result.data);
  } catch {}
  if (!emojiPanelOpen) msgInput.focus();
});

loginToggle.addEventListener('click', () => setMode(!registerMode));

passwordToggle.addEventListener('click', () => setPasswordVisible(passwordInput.type === 'password'));

passwordGenerate.addEventListener('click', async () => {
  const password = generatePassword();
  passwordInput.value = password;
  setPasswordVisible(true);
  loginError.classList.add('hidden');
  try {
    await navigator.clipboard.writeText(password);
    showToast('Contraseña generada y copiada');
  } catch {
    showToast('Contraseña generada');
  }
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) return;
  loginSubmit.disabled = true;
  try {
    const response = await fetch(registerMode ? '/api/register' : '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (data.error === 'credentials') showLoginError('Usuario o contraseña incorrectos');
      else if (data.error === 'taken') showLoginError('Ese usuario ya existe');
      else if (data.error === 'rate') showLoginError('Demasiados intentos, espera un minuto');
      else showLoginError('Usuario: 3 a 20 caracteres (letras, números, _ . -). Contraseña: mínimo 6');
      return;
    }
    token = data.token;
    localStorage.setItem('chat_token', token);
    passwordInput.value = '';
    setPasswordVisible(false);
    loginError.classList.add('hidden');
    if (registerMode && signupImage) {
      try {
        const upload = await api('/api/profile-avatar', { image: signupImage });
        if (!upload.ok) throw new Error('upload');
      } catch {
        showToast('Cuenta creada, pero no se pudo subir la foto');
      }
    }
    resetSignupPhoto();
    enterApp();
  } catch {
    showLoginError('No se pudo iniciar sesión');
  } finally {
    loginSubmit.disabled = false;
  }
});

AIKO_CHIPS.forEach(question => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'aiko-chip';
  chip.textContent = question;
  chip.addEventListener('click', () => {
    msgInput.value = question;
    sendForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  });
  aikoChips.appendChild(chip);
});

const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const clientId = Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
const PUSH_BANNER_KEY = 'push_banner_off';
let swReg = null;
let pushOn = false;
let pendingConv = new URLSearchParams(location.search).get('conv') || '';

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

function urlBase64ToBytes(value) {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, ch => ch.charCodeAt(0));
}

async function registerWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    swReg = await navigator.serviceWorker.register('/sw.js');
  } catch {
    swReg = null;
  }
  return swReg;
}

async function workerReady() {
  const reg = swReg || (await registerWorker());
  if (!reg) throw new Error('worker');
  await navigator.serviceWorker.ready;
  return reg;
}

async function currentSubscription() {
  if (!pushSupported) return null;
  const reg = swReg || (await navigator.serviceWorker.getRegistration());
  return reg ? reg.pushManager.getSubscription() : null;
}

function sameKey(subscription, key) {
  const current = subscription.options && subscription.options.applicationServerKey;
  if (!current) return true;
  const a = new Uint8Array(current);
  const b = urlBase64ToBytes(key);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

async function createSubscription(key) {
  const reg = await workerReady();
  const options = { userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(key) };
  try {
    return await reg.pushManager.subscribe(options);
  } catch (error) {
    const old = await reg.pushManager.getSubscription();
    if (!old) throw error;
    await old.unsubscribe();
    return reg.pushManager.subscribe(options);
  }
}

async function syncPush() {
  await workerReady();
  const keyResult = await api('/api/push/key');
  if (!keyResult.ok || !keyResult.data.key) throw new Error('key');
  const key = keyResult.data.key;
  let subscription = await currentSubscription();
  if (subscription && !sameKey(subscription, key)) {
    await subscription.unsubscribe();
    subscription = null;
  }
  if (!subscription) subscription = await createSubscription(key);
  const saved = await api('/api/push/subscribe', subscription.toJSON());
  if (!saved.ok) throw new Error('subscribe');
}

async function dropPush(notifyServer) {
  try {
    const subscription = await currentSubscription();
    if (!subscription) return;
    if (notifyServer) await api('/api/push/unsubscribe', { endpoint: subscription.endpoint }).catch(() => {});
    await subscription.unsubscribe();
  } catch {}
}

async function ensurePush() {
  if (!pushSupported || !token || Notification.permission !== 'granted') return;
  try {
    await syncPush();
  } catch {}
  refreshPushUi();
}

async function enablePush() {
  if (!pushSupported) return;
  pushBtn.disabled = true;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      showToast('Permiso de notificaciones denegado');
      return;
    }
    await syncPush();
    showToast('Notificaciones activadas');
  } catch {
    showToast('No se pudieron activar las notificaciones');
  } finally {
    pushBtn.disabled = false;
    refreshPushUi();
    updatePushBanner();
  }
}

async function disablePush() {
  pushBtn.disabled = true;
  await dropPush(true);
  pushBtn.disabled = false;
  showToast('Notificaciones desactivadas');
  refreshPushUi();
}

async function refreshPushUi() {
  let text = '';
  let label = '';
  pushOn = false;
  if (!pushSupported) {
    text = isIos() && !isStandalone()
      ? 'Para recibir notificaciones en iPhone, toca Compartir y elige “Añadir a pantalla de inicio”. Luego abre Zentry desde ese ícono.'
      : 'Este navegador no admite notificaciones.';
  } else if (Notification.permission === 'denied') {
    text = 'Las notificaciones están bloqueadas. Actívalas en los ajustes del navegador para este sitio.';
  } else {
    const subscription = await currentSubscription().catch(() => null);
    pushOn = Notification.permission === 'granted' && !!subscription;
    text = pushOn
      ? 'Recibirás una notificación con el mensaje cuando te escriban, aunque tengas la app cerrada.'
      : 'Activa las notificaciones para enterarte cuando te escriban.';
    label = pushOn ? 'Desactivar notificaciones' : 'Activar notificaciones';
  }
  pushText.textContent = text;
  pushBtn.textContent = label;
  pushBtn.classList.toggle('hidden', !label);
}

function updatePushBanner() {
  const show = pushSupported && !!token && Notification.permission === 'default' && localStorage.getItem(PUSH_BANNER_KEY) !== '1';
  pushBanner.classList.toggle('hidden', !show);
}

async function clearNotifications() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = swReg || (await navigator.serviceWorker.getRegistration());
    if (!reg) return;
    (await reg.getNotifications()).forEach(item => item.close());
  } catch {}
}

function reportVisibility(visible) {
  if (!token) return;
  fetch('/api/visibility?' + authQuery() + '&cid=' + clientId, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visible }),
    keepalive: true
  }).catch(() => {});
}

async function openFromPush(convId) {
  if (!convId || !token || !me) return;
  await refreshChats();
  const target = chats.find(item => item.id === convId);
  if (!target) return;
  const inChat = CHAT_VIEWS.includes(view);
  if (inChat && current && current.id === target.id) return;
  openConv(target, inChat);
}

function consumePendingConv() {
  if (!pendingConv) return;
  const id = pendingConv;
  pendingConv = '';
  openFromPush(id);
}

pushBtn.addEventListener('click', () => {
  if (pushOn) disablePush();
  else enablePush();
});

pushBannerGo.addEventListener('click', enablePush);

pushBannerClose.addEventListener('click', () => {
  localStorage.setItem(PUSH_BANNER_KEY, '1');
  updatePushBanner();
});

document.addEventListener('visibilitychange', () => {
  const visible = document.visibilityState === 'visible';
  reportVisibility(visible);
  if (visible) clearNotifications();
});

window.addEventListener('pagehide', () => reportVisibility(false));
window.addEventListener('pageshow', () => reportVisibility(document.visibilityState === 'visible'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'open-conv') openFromPush(String(event.data.conv || ''));
  });
}

history.replaceState({ v: 'list' }, '', location.pathname);
registerWorker();
if (token) enterApp();
else showLogin();
