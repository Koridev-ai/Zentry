document.addEventListener('contextmenu', event => {
  const target = event.target;
  if (!target || !target.tagName) return;
  if (target.tagName === 'IMG' || target.tagName === 'VIDEO') event.preventDefault();
}, true);
document.addEventListener('dragstart', event => {
  if (event.target && event.target.tagName === 'IMG') event.preventDefault();
}, true);

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
const devicesEl = document.getElementById('devices');
const devicesBack = document.getElementById('devicesBack');
const menuBtn = document.getElementById('menuBtn');
const homeMenu = document.getElementById('homeMenu');
const menuDevices = document.getElementById('menuDevices');
const deviceCurrent = document.getElementById('deviceCurrent');
const deviceOthers = document.getElementById('deviceOthers');
const deviceOthersTitle = document.getElementById('deviceOthersTitle');
const deviceEmpty = document.getElementById('deviceEmpty');
const deviceLogoutAll = document.getElementById('deviceLogoutAll');
const deviceLinkBtn = document.getElementById('deviceLinkBtn');
const linkEl = document.getElementById('linkScreen');
const linkBack = document.getElementById('linkBack');
const linkForm = document.getElementById('linkForm');
const linkCode = document.getElementById('linkCode');
const linkScanBtn = document.getElementById('linkScanBtn');
const linkScan = document.getElementById('linkScan');
const linkVideo = document.getElementById('linkVideo');
const linkConfirm = document.getElementById('linkConfirm');
const linkName = document.getElementById('linkName');
const linkApprove = document.getElementById('linkApprove');
const linkCancel = document.getElementById('linkCancel');
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
const audioInput = document.getElementById('audioInput');
const videoInput = document.getElementById('videoInput');
const docInput = document.getElementById('docInput');
const attachMenu = document.getElementById('attachMenu');
const attachDoc = document.getElementById('attachDoc');
const attachVideo = document.getElementById('attachVideo');
const attachAudio = document.getElementById('attachAudio');
const videoViewer = document.getElementById('videoViewer');
const videoViewerClose = document.getElementById('videoViewerClose');
const videoViewerInfo = document.getElementById('videoViewerInfo');
const videoViewerPlayer = document.getElementById('videoViewerPlayer');
const chatMenuBtn = document.getElementById('chatMenuBtn');
const chatMenu = document.getElementById('chatMenu');
const chatMenuFiles = document.getElementById('chatMenuFiles');
const chatMenuFilesLabel = document.getElementById('chatMenuFilesLabel');
const chatMenuSearch = document.getElementById('chatMenuSearch');
const chatMenuClear = document.getElementById('chatMenuClear');
const chatSearchBar = document.getElementById('chatSearchBar');
const chatSearchBack = document.getElementById('chatSearchBack');
const chatSearchInput = document.getElementById('chatSearchInput');
const chatSearchNav = document.getElementById('chatSearchNav');
const chatSearchCount = document.getElementById('chatSearchCount');
const chatSearchUp = document.getElementById('chatSearchUp');
const chatSearchDown = document.getElementById('chatSearchDown');
const chatFilesEl = document.getElementById('chatFiles');
const filesBack = document.getElementById('filesBack');
const filesChips = document.getElementById('filesChips');
const filesHeading = document.getElementById('filesHeading');
const filesGrid = document.getElementById('filesGrid');
const filesList = document.getElementById('filesList');
const filesEmpty = document.getElementById('filesEmpty');
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
let msgSel = null;
msgInput.maxLength = 2000;

function msgOffsetToPoint(offset) {
  const walker = document.createTreeWalker(msgInput, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let last = null;
  let node = walker.nextNode();
  while (node) {
    if (remaining <= node.length) return { node, offset: remaining };
    remaining -= node.length;
    last = node;
    node = walker.nextNode();
  }
  return last ? { node: last, offset: last.length } : { node: msgInput, offset: 0 };
}

function msgReadSelection() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!msgInput.contains(range.startContainer) || !msgInput.contains(range.endContainer)) return null;
  const probe = document.createRange();
  probe.selectNodeContents(msgInput);
  probe.setEnd(range.startContainer, range.startOffset);
  const start = probe.toString().length;
  probe.setEnd(range.endContainer, range.endOffset);
  return { start, end: probe.toString().length };
}

function msgPlaceSelection(start, end) {
  const selection = window.getSelection();
  const from = msgOffsetToPoint(start);
  const to = msgOffsetToPoint(end);
  const range = document.createRange();
  range.setStart(from.node, from.offset);
  range.setEnd(to.node, to.offset);
  selection.removeAllRanges();
  selection.addRange(range);
}

function msgCurrentSelection() {
  const length = msgInput.textContent.length;
  const live = document.activeElement === msgInput ? msgReadSelection() : null;
  const source = live || msgSel || { start: length, end: length };
  return { start: Math.min(source.start, length), end: Math.min(source.end, length) };
}

Object.defineProperties(msgInput, {
  value: {
    get() {
      return msgInput.textContent;
    },
    set(text) {
      msgInput.textContent = text;
      const end = msgInput.textContent.length;
      msgSel = { start: end, end };
      if (document.activeElement === msgInput) msgPlaceSelection(end, end);
    }
  },
  selectionStart: {
    get() {
      return msgCurrentSelection().start;
    }
  },
  selectionEnd: {
    get() {
      return msgCurrentSelection().end;
    }
  },
  disabled: {
    get() {
      return msgInput.getAttribute('aria-disabled') === 'true';
    },
    set(flag) {
      msgInput.setAttribute('aria-disabled', flag ? 'true' : 'false');
      msgInput.setAttribute('contenteditable', flag ? 'false' : 'plaintext-only');
    }
  },
  placeholder: {
    get() {
      return msgInput.dataset.placeholder || '';
    },
    set(text) {
      msgInput.dataset.placeholder = text;
      msgInput.setAttribute('aria-label', text);
    }
  }
});

msgInput.setSelectionRange = (start, end) => {
  const length = msgInput.textContent.length;
  const from = Math.max(0, Math.min(start, length));
  const to = Math.max(from, Math.min(end == null ? from : end, length));
  msgSel = { start: from, end: to };
  if (document.activeElement === msgInput) msgPlaceSelection(from, to);
};

document.addEventListener('selectionchange', () => {
  if (document.activeElement !== msgInput) return;
  const read = msgReadSelection();
  if (read) msgSel = read;
});

msgInput.addEventListener('input', () => {
  const text = msgInput.textContent;
  if (text === '') {
    msgInput.replaceChildren();
    return;
  }
  if (text.length > msgInput.maxLength || /[\r\n]/.test(text)) {
    msgInput.value = text.replace(/[\r\n]+/g, ' ').slice(0, msgInput.maxLength);
  }
});

msgInput.addEventListener('paste', event => {
  event.preventDefault();
  const text = ((event.clipboardData && event.clipboardData.getData('text/plain')) || '').replace(/[\r\n]+/g, ' ');
  if (text) document.execCommand('insertText', false, text);
});

msgInput.addEventListener('beforeinput', event => {
  if (event.inputType !== 'insertParagraph' && event.inputType !== 'insertLineBreak') return;
  event.preventDefault();
  if (mentionItems.length) pickMention(mentionItems[mentionIndex]);
  else sendForm.requestSubmit();
});
const groupInfo = document.getElementById('groupInfo');
const infoBack = document.getElementById('infoBack');
const infoAvatar = document.getElementById('infoAvatar');
const infoName = document.getElementById('infoName');
const infoCount = document.getElementById('infoCount');
const memberList = document.getElementById('memberList');
const memberMore = document.getElementById('memberMore');
const infoCreator = document.getElementById('infoCreator');
const groupSettings = document.getElementById('groupSettings');
const groupActions = document.getElementById('groupActions');
const groupStatusPost = document.getElementById('groupStatusPost');
const groupStatusRow = document.getElementById('groupStatusRow');
const groupStatusValue = document.getElementById('groupStatusValue');
const groupStatusSheet = document.getElementById('groupStatusSheet');
const groupStatusScrim = document.getElementById('groupStatusScrim');
const groupTempRow = document.getElementById('groupTempRow');
const groupTempValue = document.getElementById('groupTempValue');
const tempEl = document.getElementById('tempMsgs');
const tempBack = document.getElementById('tempBack');
const tempChatName = document.getElementById('tempChatName');
const tempOptions = document.getElementById('tempOptions');
const tempBadge = document.getElementById('tempBadge');
const userSettings = document.getElementById('userSettings');
const userTempRow = document.getElementById('userTempRow');
let tempTarget = null;
const memberBar = document.getElementById('memberBar');
const memberBarCount = document.getElementById('memberBarCount');
const memberSearchBtn = document.getElementById('memberSearchBtn');
const memberSearchRow = document.getElementById('memberSearchRow');
const memberSearchBack = document.getElementById('memberSearchBack');
const memberSearchInput = document.getElementById('memberSearchInput');
const memberEmpty = document.getElementById('memberEmpty');
const memberSheet = document.getElementById('memberSheet');
const memberSheetScrim = document.getElementById('memberSheetScrim');
const memberSheetAvatar = document.getElementById('memberSheetAvatar');
const memberSheetName = document.getElementById('memberSheetName');
const memberSheetOptions = document.getElementById('memberSheetOptions');
const SVG_START = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const ICON_PLUS = SVG_START + '<path d="M12 5v14M5 12h14"/></svg>';
const ICON_ADMIN_ON = SVG_START + '<path d="M12 3l7.5 3v5.5c0 4.4-3 8.3-7.5 9.5-4.5-1.2-7.5-5.1-7.5-9.5V6z"/><path d="M12 9v6M9 12h6"/></svg>';
const ICON_ADMIN_OFF = SVG_START + '<path d="M12 3l7.5 3v5.5c0 4.4-3 8.3-7.5 9.5-4.5-1.2-7.5-5.1-7.5-9.5V6z"/><path d="M9 12h6"/></svg>';
const ICON_MUTE_ON = SVG_START + '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/><path d="M4 4l16 16"/></svg>';
const ICON_MUTE_OFF = SVG_START + '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
const STATUS_MODE_LABELS = { off: 'Nadie', admins: 'Solo admins', all: 'Todos los miembros' };
const TEMP_LABELS = { 0: 'Desactivados', 86400: '24 horas', 604800: '7 días', 7776000: '90 días' };
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
const sponsorSection = document.getElementById('sponsorSection');
const sponsorListEl = document.getElementById('sponsorList');
const sponsorAdd = document.getElementById('sponsorAdd');
const channelListEl = document.getElementById('channelList');
const channelEmpty = document.getElementById('channelEmpty');
const channelExplore = document.getElementById('channelExplore');
const channelCreate = document.getElementById('channelCreate');
const channelsExploreEl = document.getElementById('channelsExplore');
const exploreBack = document.getElementById('exploreBack');
const exploreList = document.getElementById('exploreList');
const exploreEmpty = document.getElementById('exploreEmpty');
const channelNewEl = document.getElementById('channelNew');
const channelNewBack = document.getElementById('channelNewBack');
const channelNameInput = document.getElementById('channelNameInput');
const channelDescInput = document.getElementById('channelDescInput');
const channelNewBtn = document.getElementById('channelNewBtn');
const channelViewEl = document.getElementById('channelView');
const channelBack = document.getElementById('channelBack');
const channelHeadAvatar = document.getElementById('channelHeadAvatar');
const channelHeadName = document.getElementById('channelHeadName');
const channelHeadSub = document.getElementById('channelHeadSub');
const channelFollowBtn = document.getElementById('channelFollowBtn');
const channelDeleteBtn = document.getElementById('channelDeleteBtn');
const channelBody = document.getElementById('channelBody');
const channelDesc = document.getElementById('channelDesc');
const channelPosts = document.getElementById('channelPosts');
const channelPostsEmpty = document.getElementById('channelPostsEmpty');
const channelPostForm = document.getElementById('channelPostForm');
const channelPostInput = document.getElementById('channelPostInput');
const channelPostBtn = document.getElementById('channelPostBtn');
const sponsorNewEl = document.getElementById('sponsorNew');
const sponsorNewBack = document.getElementById('sponsorNewBack');
const sponsorNameInput = document.getElementById('sponsorNameInput');
const sponsorDescInput = document.getElementById('sponsorDescInput');
const sponsorUrlInput = document.getElementById('sponsorUrlInput');
const sponsorNewBtn = document.getElementById('sponsorNewBtn');
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
const reportBtn = document.getElementById('reportBtn');
const reportOverlay = document.getElementById('reportOverlay');
const reportClose = document.getElementById('reportClose');
const reportTitle = document.getElementById('reportTitle');
const reportForm = document.getElementById('reportForm');
const reportText = document.getElementById('reportText');
const reportInput = document.getElementById('reportInput');
const reportShotBox = document.getElementById('reportShot');
const reportShotImg = document.getElementById('reportShotImg');
const reportShotRemove = document.getElementById('reportShotRemove');
const reportAttachBtn = document.getElementById('reportAttachBtn');
const reportSendBtn = document.getElementById('reportSendBtn');
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
const stickerSheet = document.getElementById('stickerSheet');
const stickerSheetScrim = document.getElementById('stickerSheetScrim');
const stickerSheetClose = document.getElementById('stickerSheetClose');
const stickerSheetImg = document.getElementById('stickerSheetImg');
const stickerSheetAuthor = document.getElementById('stickerSheetAuthor');
const stickerSheetFav = document.getElementById('stickerSheetFav');
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
const stickerGrid = document.getElementById('stickerGrid');
const stickerInput = document.getElementById('stickerInput');
const signupPhoto = document.getElementById('signupPhoto');
const signupAvatar = document.getElementById('signupAvatar');
const signupInput = document.getElementById('signupInput');
const replyBar = document.getElementById('replyBar');
const replyAuthor = document.getElementById('replyAuthor');
const replyText = document.getElementById('replyText');
const replyCancel = document.getElementById('replyCancel');
const aikoChips = document.getElementById('aikoChips');
const mentionListEl = document.getElementById('mentionList');

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
const CHAT_VIEWS = ['chat', 'info', 'user', 'files', 'temp'];
const HOME_VIEWS = ['list', 'new', 'newgroup', 'profile', 'devices', 'link', 'statusnew', 'statusview', 'channels', 'channelnew', 'channel', 'sponsornew'];
const SV_IMAGE_MS = 5000;
const MAX_CHAT_AUDIO_BYTES = 25 * 1024 * 1024;
const MAX_CHAT_VIDEO_BYTES = 50 * 1024 * 1024;
const MAX_CHAT_DOC_BYTES = 25 * 1024 * 1024;
const VIDEO_EXT_TYPES = { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' };
const DOC_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'json', 'md', 'rtf', 'odt', 'ods', 'odp', 'zip', 'rar', '7z'];
const AUDIO_EXT_TYPES = { mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', opus: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac', webm: 'audio/webm' };
const FILE_EMPTY = {
  all: 'Aún no hay archivos en este chat',
  photos: 'Aún no hay fotos en este chat',
  videos: 'Aún no hay videos en este chat',
  docs: 'Aún no hay documentos en este chat',
  music: 'Aún no hay música en este chat',
  links: 'Aún no hay enlaces en este chat',
  stickers: 'Aún no hay stickers en este chat'
};
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
let chatSearchOpen = false;
let chatSearchHits = [];
let chatSearchIndex = -1;
let chatSearchTimer = 0;
let tab = 'chats';
let seen = new Set();
let lastId = 0;
let members = [];
let groupMeta = { conv: '', statusMode: 'off', canConfig: false, canPost: false };
let statusTarget = '';
let statusReturn = null;
let showAllMembers = false;
let memberQuery = '';
let memberSearching = false;
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
let mentionItems = [];
let mentionIndex = 0;
let pendingImage = null;
let sendingImage = false;
let profileUser = null;
let reportTarget = null;
let reportShot = null;
let sendingReport = false;
let statusData = { mine: null, others: [] };
let statusSig = '';
let sponsorsData = [];
let sponsorsSig = '';
let channelData = { following: [], explore: [] };
let channelSig = '';
let channelOpenId = '';
let channelOpenSig = '';
let channelOpenData = null;
let filesData = { images: [], stickers: [], audios: [], videos: [], docs: [], links: [] };
let stickerList = null;
let creatingSticker = false;
let sendingSticker = false;
let filesKind = '';
let filesConv = '';
let activeAudio = null;
let sendingAudio = false;
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

function authHeaders(extra) {
  return { Authorization: 'Bearer ' + token, ...extra };
}

async function api(path, body) {
  const options = body === undefined
    ? { headers: authHeaders() }
    : { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) };
  const response = await fetch(path, options);
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
  return '/api/user-avatar?id=' + encodeURIComponent(id) + '&v=' + version;
}

function userBannerUrl(id, version) {
  return '/api/user-banner?id=' + encodeURIComponent(id) + '&v=' + version;
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
  return '/api/group-avatar?conv=' + encodeURIComponent(chat.id) + '&v=' + chat.avatar;
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

let toastTimer = 0;

function showToast(text) {
  clearTimeout(toastTimer);
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 2000);
}

function showView(name) {
  view = name;
  if (name !== 'statusview') stopStatusViewer();
  if (name !== 'statusnew') clearStatusDraft();
  chatMenu.classList.add('hidden');
  attachMenu.classList.add('hidden');
  if (name !== 'chat') closeChatSearch();
  if (activeAudio && !CHAT_VIEWS.includes(name)) activeAudio.pause();
  if (name !== 'channel') {
    channelOpenId = '';
    channelOpenSig = '';
    channelOpenData = null;
  }
  if (!CHAT_VIEWS.includes(name)) {
    current = null;
    closeEmojiPanel(false);
  }
  homeEl.classList.toggle('hidden', !HOME_VIEWS.includes(name));
  chatEl.classList.toggle('hidden', !CHAT_VIEWS.includes(name));
  groupInfo.classList.toggle('hidden', name !== 'info');
  if (name !== 'info') {
    groupStatusSheet.classList.add('hidden');
    memberSheet.classList.add('hidden');
  }
  tempEl.classList.toggle('hidden', name !== 'temp');
  userProfileEl.classList.toggle('hidden', name !== 'user');
  newChatEl.classList.toggle('hidden', name !== 'new');
  newGroupEl.classList.toggle('hidden', name !== 'newgroup');
  profileEl.classList.toggle('hidden', name !== 'profile');
  devicesEl.classList.toggle('hidden', name !== 'devices');
  linkEl.classList.toggle('hidden', name !== 'link');
  if (name !== 'link') resetLink();
  if (name === 'devices') loadDevices();
  if (name !== 'list') homeMenu.classList.add('hidden');
  statusNewEl.classList.toggle('hidden', name !== 'statusnew');
  statusViewEl.classList.toggle('hidden', name !== 'statusview');
  channelsExploreEl.classList.toggle('hidden', name !== 'channels');
  channelNewEl.classList.toggle('hidden', name !== 'channelnew');
  channelViewEl.classList.toggle('hidden', name !== 'channel');
  sponsorNewEl.classList.toggle('hidden', name !== 'sponsornew');
  chatFilesEl.classList.toggle('hidden', name !== 'files');
  if (name === 'list') {
    refreshChats();
    refreshStatuses();
    refreshSponsors();
    refreshChannels();
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
  closeChatSearch();
  hideImageOverlays();
  hideStickerSheet();
  hideClearSheet();
  hidePrivacySheet();
  hideReport();
  const name = (event.state && event.state.v) || 'list';
  if (name === 'info' && !current && statusReturn) current = statusReturn;
  statusReturn = null;
  if (CHAT_VIEWS.includes(name) && !current && !(name === 'user' && profileUser)) {
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
  if (!chat.last || chat.last.legacy) return '';
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
  if (name === 'news') {
    refreshStatuses();
    refreshSponsors();
    refreshChannels();
  }
}

function sortChats() {
  chats.sort((a, b) => (b.last ? b.last.time : b.sortTime) - (a.last ? a.last.time : a.sortTime));
}

function saveBootCache() {
  if (!me || !token) return;
  try {
    const safeChats = chats.map(chat => chat.last && chat.last.sealedText ? { ...chat, last: { ...chat.last, text: chat.last.legacy ? '' : '🔒 Mensaje cifrado' } } : chat);
    localStorage.setItem('chat_boot', JSON.stringify({ me, chats: safeChats }));
  } catch {}
}

function loadBootCache() {
  try {
    const data = JSON.parse(localStorage.getItem('chat_boot') || 'null');
    if (data && data.me && data.me.id && Array.isArray(data.chats)) return data;
  } catch {}
  return null;
}

let chatsRun = 0;

async function applyChats(result) {
  if (!result || !result.ok) return;
  const run = ++chatsRun;
  if (result.data.some(item => item.last && item.last.e2ee)) {
    await Promise.all(result.data.map(item => ZentryE2E.openPreview(item)));
    if (run !== chatsRun) return;
  }
  const sig = JSON.stringify(result.data);
  if (sig === chatsSig) return;
  chatsSig = sig;
  chats = result.data;
  renderChatList();
  saveBootCache();
  if (current) {
    const fresh = chats.find(item => item.id === current.id);
    if (fresh && fresh.avatar !== current.avatar) {
      current.avatar = fresh.avatar;
      applyHeader();
      if (view === 'info') avatarContent(infoAvatar, current);
    }
  }
}

async function refreshChats() {
  if (!token) return;
  try {
    await applyChats(await api('/api/chats'));
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

const MENTION_RE = /(^|[^A-Za-z0-9_.-])@([A-Za-z0-9_.-]{3,20})/g;

function findMentions(text) {
  const byName = new Map(members.map(person => [person.name.toLowerCase(), person]));
  const found = new Map();
  for (const match of text.matchAll(MENTION_RE)) {
    let candidate = match[2];
    while (!byName.has(candidate.toLowerCase()) && /[.-]$/.test(candidate)) candidate = candidate.slice(0, -1);
    const person = byName.get(candidate.toLowerCase());
    if (person && !found.has(person.id)) found.set(person.id, { id: person.id, name: person.name });
  }
  return [...found.values()];
}

function previewOf(message) {
  if (message.audio) return '♪ ' + (message.audio.name || 'Música');
  if (message.video) return '▶ Video';
  if (message.doc) return '▤ ' + (message.doc.name || 'Documento');
  if (message.sticker) return '▣ Sticker';
  return message.image ? '📷 ' + (message.text || 'Foto') : message.text;
}

const LOCK_PREVIEW = '🔒 Mensaje cifrado';

function replyPreview(message) {
  const text = String(previewOf(message) || '');
  if (!text || message.undecryptable || text === LOCK_PREVIEW) return 'Mensaje';
  return text.slice(0, 200);
}

function quoteText(reply) {
  const target = messageIndex.get(Number(reply.id));
  if (target && !target.system && !target.undecryptable) {
    const live = String(previewOf(target) || '');
    if (live && live !== LOCK_PREVIEW) return live.slice(0, 200);
  }
  const stored = String(reply.text || '');
  return !stored || stored === LOCK_PREVIEW ? 'Mensaje' : stored;
}

function chatImageUrl(image) {
  return '/api/chat-media?conv=' + encodeURIComponent(current.id) + '&id=' + encodeURIComponent(image.id);
}

const IMAGE_MIME_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };

function mediaUrlFor(media, convId) {
  if (!media.sealed) return Promise.resolve(chatImageUrl(media));
  return ZentryE2E.mediaUrl(convId || (current ? current.id : ''), media);
}

function scrollParentOf(el) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === 'auto' || overflow === 'scroll') return node;
  }
  return null;
}

function lazyLoad(el, load) {
  if (typeof IntersectionObserver === 'undefined') {
    load();
    return;
  }
  requestAnimationFrame(() => {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      load();
    }, { root: scrollParentOf(el), rootMargin: '300px' });
    observer.observe(el);
  });
}

function setMediaSrc(el, media, suffix, eager) {
  const convId = current ? current.id : '';
  const load = () => {
    mediaUrlFor(media, convId).then(url => {
      el.src = url + (suffix || '');
    }).catch(() => el.dispatchEvent(new Event('error')));
  };
  if (media.sealed && !eager) lazyLoad(el, load);
  else load();
}

function sealedReply() {
  if (!replyTo) return null;
  return { id: replyTo.id, uid: replyTo.uid, user: replyTo.user, text: replyPreview(replyTo) };
}

async function sendSealedMedia(convId, kind, blob, info, caption) {
  if (!ZentryE2E.available()) throw new Error('unavailable');
  const extra = { text: caption || '' };
  const reply = sealedReply();
  if (reply) extra.reply = reply;
  if (caption && current && current.id === convId && current.type === 'group') {
    const mentions = findMentions(caption);
    if (mentions.length) extra.mentions = mentions;
  }
  let body;
  try {
    body = await ZentryE2E.sealMedia(convId, kind, blob, info, extra);
  } catch (error) {
    if (error && error.message === 'auth') endSession();
    throw error;
  }
  const result = await api('/api/send?conv=' + encodeURIComponent(convId), body);
  if (!result.ok) throw new Error(result.data && result.data.error === 'muted' ? 'muted' : result.status === 413 ? 'size' : 'upload');
  await ZentryE2E.open(convId, result.data);
  clearReply();
  if (current && current.id === convId) renderMessage(result.data);
}

function mediaSendError(error, texts) {
  const reason = error && error.message;
  if (reason === 'auth') return '';
  if (reason === 'size') return texts.big;
  if (reason === 'muted') return 'Estás silenciado en este grupo';
  if (reason === 'unavailable') return 'El cifrado no está listo. Abre Zentry por HTTPS e inténtalo de nuevo';
  return texts.fail;
}

async function sendSealedUpload(kind, blob, info, texts) {
  const convId = current.id;
  sendingAudio = true;
  showToast(texts.sending);
  try {
    await sendSealedMedia(convId, kind, blob, info, '');
  } catch (error) {
    const message = mediaSendError(error, texts);
    if (message) showToast(message);
  } finally {
    sendingAudio = false;
  }
}

function hideImageOverlays() {
  imageViewer.classList.add('hidden');
  imageViewerImg.removeAttribute('src');
  imagePreview.classList.add('hidden');
  imagePreviewImg.removeAttribute('src');
  videoViewer.classList.add('hidden');
  videoViewerPlayer.pause();
  videoViewerPlayer.removeAttribute('src');
  if (pendingImage) {
    URL.revokeObjectURL(pendingImage.url);
    pendingImage = null;
  }
}

function openImageViewer(message) {
  imageViewerImg.removeAttribute('src');
  setMediaSrc(imageViewerImg, message.image, '', true);
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
  box.appendChild(img);
  setMediaSrc(img, message.image);
  box.addEventListener('click', () => {
    if (!box.classList.contains('broken')) openImageViewer(message);
  });
  return box;
}

let stickerSheetMessage = null;
let stickerSheetOpen = false;
let savingFavSticker = false;

function hideStickerSheet() {
  stickerSheetOpen = false;
  stickerSheetMessage = null;
  stickerSheet.classList.add('hidden');
  stickerSheetImg.removeAttribute('src');
}

function openStickerSheet(message) {
  stickerSheetMessage = message;
  stickerSheetImg.removeAttribute('src');
  setMediaSrc(stickerSheetImg, message.sticker, '', true);
  stickerSheetAuthor.textContent = message.user || '';
  history.pushState({ v: view }, '');
  stickerSheetOpen = true;
  stickerSheet.classList.remove('hidden');
}

function closeStickerSheet() {
  if (stickerSheetOpen) history.back();
}

async function saveStickerFavorite() {
  const message = stickerSheetMessage;
  if (!message || !current || savingFavSticker) return;
  savingFavSticker = true;
  const convId = current.id;
  try {
    if (message.sticker.sealed) {
      const blob = await ZentryE2E.mediaBlob(convId, message.sticker);
      const response = await fetch('/api/sticker-create', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'image/webp' }),
        body: blob
      });
      if (response.status === 401) {
        endSession();
        return;
      }
      const saved = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(saved.error === 'limit' ? 'limit' : 'save');
    } else {
      const result = await api('/api/sticker-save?conv=' + encodeURIComponent(convId), { id: message.sticker.id });
      if (!result.ok) throw new Error(result.data.error || 'save');
    }
    stickerList = null;
    closeStickerSheet();
    showToast('Añadido a Favoritos');
  } catch (error) {
    showToast(error && error.message === 'limit' ? 'Tu colección está llena' : 'No se pudo guardar');
  } finally {
    savingFavSticker = false;
  }
}

function buildSticker(message, mine) {
  const box = document.createElement('div');
  box.className = 'msg-sticker';
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 512;
  img.height = 512;
  img.draggable = false;
  img.addEventListener('error', () => {
    box.classList.add('broken');
    box.textContent = 'Sticker no disponible';
  });
  box.appendChild(img);
  setMediaSrc(img, message.sticker);
  box.addEventListener('contextmenu', event => event.preventDefault());
  if (!mine) {
    box.addEventListener('click', () => {
      if (box.classList.contains('broken') || !current) return;
      openStickerSheet(message);
    });
  }
  return box;
}

function formatDuration(sec) {
  const total = Math.max(0, Math.round(sec || 0));
  return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
}

function buildAudio(message, scope) {
  const media = message.audio;
  const box = document.createElement('div');
  box.className = 'msg-audio';
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'audio-play';
  play.setAttribute('aria-label', 'Reproducir');
  play.innerHTML = '<svg class="ic-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg><svg class="ic-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>';
  const body = document.createElement('div');
  body.className = 'audio-body';
  const title = document.createElement('span');
  title.className = 'audio-title';
  title.textContent = media.name || 'Música';
  const bar = document.createElement('div');
  bar.className = 'audio-bar';
  const track = document.createElement('div');
  track.className = 'audio-track';
  const fill = document.createElement('div');
  fill.className = 'audio-fill';
  track.appendChild(fill);
  bar.appendChild(track);
  const time = document.createElement('span');
  time.className = 'audio-time';
  time.textContent = formatDuration(media.dur || 0);
  body.append(title, bar, time);
  box.append(play, body);

  const audio = new Audio();
  const convId = current ? current.id : '';
  let fetching = false;
  audio.preload = 'none';
  if (!media.sealed) audio.src = chatImageUrl(media);
  audio._scope = scope;
  let pendingSeek = null;
  const totalOf = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : media.dur || 0);

  const start = () => {
    if (activeAudio && activeAudio !== audio) activeAudio.pause();
    audio.play().catch(() => {
      box.classList.add('broken');
      box.textContent = 'Audio no disponible';
    });
  };
  play.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    if (media.sealed && !audio.getAttribute('src')) {
      if (fetching) return;
      fetching = true;
      mediaUrlFor(media, convId).then(url => {
        audio.src = url;
        start();
      }).catch(() => {
        box.classList.add('broken');
        box.textContent = 'Audio no disponible';
      }).finally(() => {
        fetching = false;
      });
      return;
    }
    start();
  });
  audio.addEventListener('play', () => {
    activeAudio = audio;
    box.classList.add('playing');
  });
  audio.addEventListener('pause', () => box.classList.remove('playing'));
  audio.addEventListener('ended', () => {
    box.classList.remove('playing');
    fill.style.width = '0';
    audio.currentTime = 0;
    time.textContent = formatDuration(totalOf());
  });
  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null && totalOf()) audio.currentTime = pendingSeek * totalOf();
    pendingSeek = null;
    time.textContent = formatDuration(audio.currentTime) + ' / ' + formatDuration(totalOf());
  });
  audio.addEventListener('timeupdate', () => {
    const total = totalOf();
    fill.style.width = total ? Math.min(100, (audio.currentTime / total) * 100) + '%' : '0';
    time.textContent = formatDuration(audio.currentTime) + ' / ' + formatDuration(total);
  });
  audio.addEventListener('error', () => {
    box.classList.add('broken');
    box.textContent = 'Audio no disponible';
  });
  bar.addEventListener('click', event => {
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    if (audio.readyState === 0) {
      pendingSeek = ratio;
      play.click();
      return;
    }
    const total = totalOf();
    if (total) audio.currentTime = ratio * total;
  });
  return box;
}

function openVideoViewer(item) {
  videoViewerPlayer.setAttribute('controlsList', 'nodownload');
  videoViewerPlayer.removeAttribute('src');
  const convId = current ? current.id : '';
  mediaUrlFor(item.video, convId).then(url => {
    if (videoViewer.classList.contains('hidden')) return;
    videoViewerPlayer.src = url;
    videoViewerPlayer.play().catch(() => {});
  }).catch(() => showToast('No se pudo abrir el video'));
  videoViewerInfo.textContent = (me && item.uid === me.id ? 'Tú' : item.user) + ' · ' + formatTime(item.time);
  history.pushState({ v: view }, '');
  videoViewer.classList.remove('hidden');
}

function buildSealedVideo(message) {
  const media = message.video;
  const convId = current ? current.id : '';
  const box = document.createElement('div');
  box.className = 'msg-video';
  const card = document.createElement('div');
  card.className = 'msg-doc';
  card.setAttribute('role', 'button');
  const icon = document.createElement('div');
  icon.className = 'doc-icon';
  icon.textContent = '▶';
  const text = document.createElement('div');
  text.className = 'doc-text';
  const name = document.createElement('span');
  name.className = 'doc-name';
  name.textContent = 'Video';
  const meta = document.createElement('span');
  meta.className = 'doc-meta';
  const idle = (media.dur ? formatDuration(media.dur) + ' · ' : '') + formatSize(media.size || 0);
  meta.textContent = idle;
  text.append(name, meta);
  card.append(icon, text);
  let busy = false;
  card.addEventListener('click', () => {
    if (busy) return;
    busy = true;
    meta.textContent = 'Descifrando...';
    mediaUrlFor(media, convId).then(url => {
      const video = document.createElement('video');
      video.controls = true;
      video.setAttribute('controlsList', 'nodownload');
      video.playsInline = true;
      video.addEventListener('error', () => {
        box.textContent = 'Video no disponible';
        box.className = 'msg-image broken';
      });
      video.src = url;
      box.textContent = '';
      box.appendChild(video);
      video.play().catch(() => {});
    }).catch(() => {
      busy = false;
      meta.textContent = idle;
      showToast('No se pudo abrir el video');
    });
  });
  box.appendChild(card);
  return box;
}

function buildVideo(message) {
  if (message.video.sealed) return buildSealedVideo(message);
  const box = document.createElement('div');
  box.className = 'msg-video';
  const video = document.createElement('video');
  video.controls = true;
  video.setAttribute('controlsList', 'nodownload');
  video.preload = 'metadata';
  video.playsInline = true;
  video.addEventListener('error', () => {
    box.textContent = 'Video no disponible';
    box.className = 'msg-image broken';
  });
  video.src = chatImageUrl(message.video);
  box.appendChild(video);
  return box;
}

function docLabel(ext) {
  return String(ext || 'file').slice(0, 4).toUpperCase();
}

function docMeta(doc) {
  return docLabel(doc.ext) + ' · ' + formatSize(doc.size || 0);
}

function buildDoc(message) {
  const doc = message.doc;
  const link = document.createElement('a');
  link.className = 'msg-doc';
  link.setAttribute('download', doc.name || 'documento');
  link.rel = 'noopener';
  if (doc.sealed) {
    const convId = current ? current.id : '';
    link.href = '#';
    link.addEventListener('click', event => {
      event.preventDefault();
      mediaUrlFor(doc, convId).then(url => {
        const download = document.createElement('a');
        download.href = url;
        download.download = doc.name || 'documento';
        document.body.appendChild(download);
        download.click();
        download.remove();
      }).catch(() => showToast('No se pudo descargar el documento'));
    });
  } else {
    link.href = chatImageUrl(doc);
  }
  const icon = document.createElement('div');
  icon.className = 'doc-icon';
  icon.textContent = docLabel(doc.ext);
  const text = document.createElement('div');
  text.className = 'doc-text';
  const name = document.createElement('span');
  name.className = 'doc-name';
  name.textContent = doc.name || 'Documento';
  const meta = document.createElement('span');
  meta.className = 'doc-meta';
  meta.textContent = docMeta(doc);
  text.append(name, meta);
  link.append(icon, text);
  return link;
}

function videoTile(item) {
  const tile = document.createElement('div');
  tile.className = 'files-tile';
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.addEventListener('error', () => tile.remove());
  if (!item.video.sealed) video.src = chatImageUrl(item.video) + '#t=0.1';
  tile.appendChild(video);
  const mark = document.createElement('span');
  mark.className = 'files-play';
  mark.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  if (item.video.dur) mark.appendChild(document.createTextNode(formatDuration(item.video.dur)));
  tile.appendChild(mark);
  tile.addEventListener('click', () => openVideoViewer(item));
  return tile;
}

function docTile(item) {
  const tile = document.createElement('div');
  tile.className = 'files-tile tile-doc';
  const icon = document.createElement('div');
  icon.className = 'doc-icon';
  icon.textContent = docLabel(item.doc.ext);
  const name = document.createElement('span');
  name.className = 'tile-name';
  name.textContent = item.doc.name || 'Documento';
  tile.append(icon, name);
  tile.addEventListener('click', () => {
    filesKind = 'docs';
    renderFiles();
  });
  return tile;
}

function docRow(item) {
  const link = buildDoc(item);
  link.classList.add('file-doc-link');
  const wrap = document.createElement('div');
  wrap.className = 'file-audio';
  const by = document.createElement('div');
  by.className = 'file-audio-by';
  by.textContent = fileSub(item);
  wrap.append(by, link);
  return wrap;
}

function readVideoInfo(file) {
  return new Promise(resolve => {
    const probe = document.createElement('video');
    const url = URL.createObjectURL(file);
    const done = info => {
      URL.revokeObjectURL(url);
      resolve(info);
    };
    const timer = setTimeout(() => done({ dur: 0, w: 0, h: 0 }), 5000);
    probe.preload = 'metadata';
    probe.muted = true;
    probe.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      done({
        dur: Number.isFinite(probe.duration) ? Math.round(probe.duration) : 0,
        w: probe.videoWidth || 0,
        h: probe.videoHeight || 0
      });
    });
    probe.addEventListener('error', () => {
      clearTimeout(timer);
      done({ dur: 0, w: 0, h: 0 });
    });
    probe.src = url;
  });
}

function videoMimeOf(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (VIDEO_EXT_TYPES[ext]) return VIDEO_EXT_TYPES[ext];
  const type = (file.type || '').toLowerCase();
  return Object.values(VIDEO_EXT_TYPES).includes(type) ? type : '';
}

async function uploadChatFile(route, file, mime, query, texts) {
  const convId = current.id;
  sendingAudio = true;
  showToast(texts.sending);
  try {
    if (replyTo) query.set('replyTo', replyTo.id);
    query.set('conv', convId);
    const response = await fetch(route + '?' + query.toString(), {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': mime }),
      body: file
    });
    if (response.status === 401) {
      endSession();
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : data.error === 'muted' ? 'muted' : 'upload');
    clearReply();
    if (current && current.id === convId) renderMessage(data);
  } catch (error) {
    showToast(error && error.message === 'size' ? texts.big : error && error.message === 'muted' ? 'Estás silenciado en este grupo' : texts.fail);
  } finally {
    sendingAudio = false;
  }
}

async function sendVideoFile(file) {
  const mime = videoMimeOf(file);
  if (!mime) {
    showToast('Ese archivo no es un video compatible');
    return;
  }
  if (file.size > MAX_CHAT_VIDEO_BYTES) {
    showToast('El video pesa más de ' + MAX_CHAT_VIDEO_BYTES / 1048576 + ' MB');
    return;
  }
  const info = await readVideoInfo(file);
  const texts = { sending: 'Enviando video...', big: 'El video es demasiado pesado', fail: 'No se pudo enviar el video' };
  if (current.sealed !== false) {
    await sendSealedUpload('video', file, { mime, ext: (file.name.split('.').pop() || '').toLowerCase(), dur: info.dur, w: info.w, h: info.h }, texts);
    return;
  }
  const query = new URLSearchParams({ dur: String(info.dur), w: String(info.w), h: String(info.h) });
  await uploadChatFile('/api/send-video', file, mime, query, texts);
}

async function sendDocFile(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!DOC_EXTS.includes(ext)) {
    showToast('Ese tipo de documento no está permitido');
    return;
  }
  if (file.size > MAX_CHAT_DOC_BYTES) {
    showToast('El documento pesa más de ' + MAX_CHAT_DOC_BYTES / 1048576 + ' MB');
    return;
  }
  const texts = { sending: 'Enviando documento...', big: 'El documento es demasiado pesado', fail: 'No se pudo enviar el documento' };
  if (current.sealed !== false) {
    await sendSealedUpload('doc', file, { mime: 'application/octet-stream', ext, name: file.name, size: file.size }, texts);
    return;
  }
  const query = new URLSearchParams({ name: file.name });
  await uploadChatFile('/api/send-doc', file, 'application/octet-stream', query, texts);
}

function foldSearch(text) {
  let folded = '';
  const map = [];
  let position = 0;
  for (const char of text) {
    const piece = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    for (let i = 0; i < piece.length; i++) map.push(position);
    folded += piece;
    position += char.length;
  }
  map.push(position);
  return { folded, map };
}

function clearChatSearchMarks() {
  const marks = messagesEl.querySelectorAll('mark.search-hit');
  const parents = new Set();
  marks.forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parents.add(parent);
  });
  parents.forEach(parent => parent.normalize());
  chatSearchHits = [];
  chatSearchIndex = -1;
}

function searchableNodes() {
  const nodes = [];
  Array.from(messagesEl.children).forEach(child => {
    if (child.classList.contains('chat-notice')) return;
    const root = child.classList.contains('msg-row') ? child.querySelector('.msg') : child;
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (parent && parent.closest('.author, .time, .quote, button')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
  });
  return nodes;
}

function runChatSearch() {
  clearChatSearchMarks();
  const query = foldSearch(chatSearchInput.value.trim()).folded;
  if (!query) {
    chatSearchCount.textContent = '';
    return;
  }
  searchableNodes().forEach(node => {
    const { folded, map } = foldSearch(node.nodeValue);
    const ranges = [];
    let from = 0;
    while (true) {
      const at = folded.indexOf(query, from);
      if (at === -1) break;
      ranges.push([map[at], map[at + query.length]]);
      from = at + query.length;
    }
    const nodeHits = [];
    for (let i = ranges.length - 1; i >= 0; i--) {
      const [start, end] = ranges[i];
      const tail = node.splitText(start);
      tail.splitText(end - start);
      const mark = document.createElement('mark');
      mark.className = 'search-hit';
      tail.parentNode.replaceChild(mark, tail);
      mark.appendChild(tail);
      nodeHits.unshift(mark);
    }
    chatSearchHits.push(...nodeHits);
  });
  if (!chatSearchHits.length) {
    chatSearchCount.textContent = 'Sin resultados';
    return;
  }
  focusChatSearchHit(chatSearchHits.length - 1);
}

function focusChatSearchHit(index) {
  if (!chatSearchHits.length) return;
  const total = chatSearchHits.length;
  const next = (index + total) % total;
  if (chatSearchIndex >= 0 && chatSearchHits[chatSearchIndex]) chatSearchHits[chatSearchIndex].classList.remove('current');
  chatSearchIndex = next;
  const mark = chatSearchHits[next];
  mark.classList.add('current');
  mark.scrollIntoView({ block: 'center', behavior: 'smooth' });
  chatSearchCount.textContent = (next + 1) + ' de ' + total;
}

let clearingChat = false;
let clearSheetOpen = false;
let clearMode = 'all';

const clearSheet = document.getElementById('clearSheet');
const clearSheetScrim = document.getElementById('clearSheetScrim');
const clearSheetClose = document.getElementById('clearSheetClose');
const clearSheetConfirm = document.getElementById('clearSheetConfirm');
const clearOptions = clearSheet.querySelectorAll('[data-clear-mode]');
const privacySheet = document.getElementById('privacySheet');
const privacySheetScrim = document.getElementById('privacySheetScrim');
const privacySheetClose = document.getElementById('privacySheetClose');
const privacySheetOk = document.getElementById('privacySheetOk');
let privacySheetOpen = false;

function hidePrivacySheet() {
  privacySheetOpen = false;
  privacySheet.classList.add('hidden');
}

function openPrivacySheet() {
  if (privacySheetOpen) return;
  history.pushState({ v: view }, '');
  privacySheetOpen = true;
  const sealed = !current || current.sealed !== false;
  document.getElementById('privacyFoot').textContent = sealed
    ? 'Los mensajes, fotos, audios, videos, documentos y stickers están cifrados de extremo a extremo: ni el servidor ni quien lo administra puede verlos.'
    : 'Este chat no usa cifrado de extremo a extremo: Aiko necesita leer tus mensajes para responder, y quien administra el servidor puede acceder a ellos.';
  const codeBox = document.getElementById('privacyCodeBox');
  codeBox.classList.add('hidden');
  if (sealed && current && current.type === 'dm' && current.peer) {
    const convId = current.id;
    ZentryE2E.safetyNumber(convId, current.peer.id).then(code => {
      if (!code || !current || current.id !== convId || !privacySheetOpen) return;
      document.getElementById('privacyCode').textContent = code;
      codeBox.classList.remove('hidden');
    }).catch(() => {});
  }
  privacySheet.classList.remove('hidden');
}

function closePrivacySheet() {
  if (privacySheetOpen) history.back();
}

function buildChatNotice() {
  const note = document.createElement('div');
  note.className = 'chat-notice';
  note.setAttribute('role', 'button');
  note.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
  const sealed = !current || current.sealed !== false;
  note.appendChild(document.createTextNode(sealed
    ? 'Los mensajes y archivos están cifrados de extremo a extremo. Solo los miembros de este chat pueden verlos. '
    : 'Tus chats son privados. Este chat con Aiko no tiene cifrado de extremo a extremo. '));
  const more = document.createElement('strong');
  more.textContent = 'Más información';
  note.appendChild(more);
  note.addEventListener('click', openPrivacySheet);
  return note;
}

function setClearMode(mode) {
  clearMode = mode;
  clearOptions.forEach(option => option.classList.toggle('selected', option.dataset.clearMode === mode));
}

function hideClearSheet() {
  clearSheetOpen = false;
  clearSheet.classList.add('hidden');
}

function openClearSheet() {
  chatMenu.classList.add('hidden');
  if (!current || clearSheetOpen) return;
  setClearMode('all');
  clearSheetConfirm.disabled = false;
  history.pushState({ v: view }, '');
  clearSheetOpen = true;
  clearSheet.classList.remove('hidden');
}

function closeClearSheet() {
  if (clearSheetOpen) history.back();
}

async function confirmClearChat() {
  if (!current || clearingChat) return;
  clearingChat = true;
  clearSheetConfirm.disabled = true;
  const convId = current.id;
  const mode = clearMode;
  try {
    const result = await api('/api/clear?conv=' + encodeURIComponent(convId), { mode });
    if (!result.ok) throw new Error('clear');
    chatCache.delete(convId);
    closeClearSheet();
    if (current && current.id === convId) loadChat();
    showToast(mode === 'media' ? 'Archivos multimedia eliminados' : 'Chat vaciado');
    refreshChats();
  } catch {
    clearSheetConfirm.disabled = false;
    showToast('No se pudo vaciar el chat');
  } finally {
    clearingChat = false;
  }
}

function openChatSearch() {
  if (!current || chatSearchOpen) return;
  chatMenu.classList.add('hidden');
  closeEmojiPanel(false);
  clearReply();
  hideMentions();
  chatSearchOpen = true;
  history.pushState({ v: 'chat' }, '');
  chatEl.classList.add('searching');
  chatSearchBar.classList.remove('hidden');
  chatSearchNav.classList.remove('hidden');
  chatSearchInput.value = '';
  chatSearchCount.textContent = '';
  chatSearchInput.focus();
}

function closeChatSearch() {
  if (!chatSearchOpen) return;
  chatSearchOpen = false;
  clearTimeout(chatSearchTimer);
  clearChatSearchMarks();
  chatEl.classList.remove('searching');
  chatSearchBar.classList.add('hidden');
  chatSearchNav.classList.add('hidden');
  chatSearchInput.value = '';
  chatSearchInput.blur();
}

function openChatFiles() {
  if (!current) return;
  chatMenu.classList.add('hidden');
  filesConv = current.id;
  filesKind = '';
  filesData = { images: [], stickers: [], audios: [], videos: [], docs: [], links: [] };
  renderFiles();
  enter('files');
  loadFiles();
}

async function loadFiles() {
  const conv = filesConv;
  if (!conv) return;
  try {
    const result = await api('/api/files?conv=' + encodeURIComponent(conv));
    if (conv !== filesConv || !result.ok) return;
    const data = result.data;
    const mediaKeys = { images: 'image', stickers: 'sticker', audios: 'audio', videos: 'video', docs: 'doc' };
    for (const [list, field] of Object.entries(mediaKeys)) {
      const items = data[list] || [];
      await Promise.all(items.map(item => (item.e2ee ? ZentryE2E.open(conv, item) : item)));
      data[list] = items.filter(item => item[field]);
    }
    if (conv !== filesConv) return;
    filesData = data;
    renderFiles();
  } catch {}
}

function fileSub(item) {
  return (me && item.uid === me.id ? 'Tú' : item.user) + ' · ' + channelTime(item.time);
}

function musicTile(item) {
  const tile = document.createElement('div');
  tile.className = 'files-tile tile-music';
  tile.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/></svg>';
  const name = document.createElement('span');
  name.textContent = item.audio.name || 'Música';
  tile.appendChild(name);
  tile.addEventListener('click', () => {
    filesKind = 'music';
    renderFiles();
  });
  return tile;
}

function photoTile(item) {
  const tile = document.createElement('div');
  tile.className = 'files-tile';
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => tile.remove());
  tile.appendChild(img);
  setMediaSrc(img, item.image);
  if (item.image.ext === 'gif') {
    const badge = document.createElement('span');
    badge.className = 'files-badge';
    badge.textContent = 'GIF';
    tile.appendChild(badge);
  }
  tile.addEventListener('click', () => openImageViewer(item));
  return tile;
}

function stickerTile(item) {
  const tile = document.createElement('div');
  tile.className = 'files-tile files-sticker';
  const img = document.createElement('img');
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => tile.remove());
  tile.appendChild(img);
  setMediaSrc(img, item.sticker);
  return tile;
}

function linkRow(item) {
  const row = document.createElement('div');
  row.className = 'file-row file-row-link';
  const icon = document.createElement('div');
  icon.className = 'file-row-icon';
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/></svg>';
  const text = document.createElement('div');
  text.className = 'file-row-text';
  const title = document.createElement('span');
  title.className = 'file-row-title';
  title.textContent = item.url;
  const sub = document.createElement('span');
  sub.className = 'file-row-sub';
  sub.textContent = fileSub(item);
  text.append(title, sub);
  row.append(icon, text);
  row.addEventListener('click', () => window.open(item.url, '_blank', 'noopener,noreferrer'));
  return row;
}

function audioRow(item) {
  const row = document.createElement('div');
  row.className = 'file-audio';
  const by = document.createElement('div');
  by.className = 'file-audio-by';
  by.textContent = fileSub(item);
  row.append(by, buildAudio(item, 'files'));
  return row;
}

function renderFiles() {
  if (activeAudio && activeAudio._scope === 'files') activeAudio.pause();
  filesChips.querySelectorAll('.files-chip').forEach(chip => {
    const on = chip.dataset.kind === filesKind;
    chip.classList.toggle('active', on);
    chip.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  filesGrid.textContent = '';
  filesList.textContent = '';
  let count = 0;
  if (filesKind === '') {
    const mixed = filesData.images.map(item => ({ kind: 'photo', item }))
      .concat(filesData.videos.map(item => ({ kind: 'video', item })))
      .concat(filesData.docs.map(item => ({ kind: 'doc', item })))
      .concat(filesData.audios.map(item => ({ kind: 'music', item })));
    const makers = { photo: photoTile, video: videoTile, doc: docTile, music: musicTile };
    mixed.sort((a, b) => b.item.time - a.item.time);
    mixed.forEach(entry => filesGrid.appendChild(makers[entry.kind](entry.item)));
    count = mixed.length;
  } else if (filesKind === 'photos') {
    filesData.images.forEach(item => filesGrid.appendChild(photoTile(item)));
    count = filesData.images.length;
  } else if (filesKind === 'stickers') {
    (filesData.stickers || []).forEach(item => filesGrid.appendChild(stickerTile(item)));
    count = (filesData.stickers || []).length;
  } else if (filesKind === 'videos') {
    filesData.videos.forEach(item => filesGrid.appendChild(videoTile(item)));
    count = filesData.videos.length;
  } else if (filesKind === 'docs') {
    filesData.docs.forEach(item => filesList.appendChild(docRow(item)));
    count = filesData.docs.length;
  } else if (filesKind === 'music') {
    filesData.audios.forEach(item => filesList.appendChild(audioRow(item)));
    count = filesData.audios.length;
  } else if (filesKind === 'links') {
    filesData.links.forEach(item => filesList.appendChild(linkRow(item)));
    count = filesData.links.length;
  }
  filesHeading.classList.toggle('hidden', count === 0);
  filesEmpty.textContent = FILE_EMPTY[filesKind || 'all'];
  filesEmpty.classList.toggle('hidden', count > 0);
}

function audioMimeOf(file) {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (AUDIO_EXT_TYPES[ext]) return AUDIO_EXT_TYPES[ext];
  const type = (file.type || '').toLowerCase();
  return type.startsWith('audio/') ? type : '';
}

function audioDuration(file) {
  return new Promise(resolve => {
    const probe = new Audio();
    const url = URL.createObjectURL(file);
    const done = value => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(value) ? Math.round(value) : 0);
    };
    const timer = setTimeout(() => done(0), 4000);
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      done(probe.duration);
    });
    probe.addEventListener('error', () => {
      clearTimeout(timer);
      done(0);
    });
    probe.src = url;
  });
}

async function sendAudioFile(file) {
  const convId = current.id;
  const mime = audioMimeOf(file);
  if (!mime) {
    showToast('Ese archivo no es un audio compatible');
    return;
  }
  if (file.size > MAX_CHAT_AUDIO_BYTES) {
    showToast('La música pesa más de ' + MAX_CHAT_AUDIO_BYTES / 1048576 + ' MB');
    return;
  }
  sendingAudio = true;
  showToast('Enviando música...');
  try {
    const dur = await audioDuration(file);
    if (current && current.id === convId && current.sealed !== false) {
      await sendSealedMedia(convId, 'audio', file, { mime, ext: (file.name.split('.').pop() || '').toLowerCase(), name: file.name.replace(/\.[^.]+$/, ''), dur }, '');
      return;
    }
    const query = new URLSearchParams({ conv: convId, name: file.name.replace(/\.[^.]+$/, ''), dur: String(dur) });
    if (replyTo) query.set('replyTo', replyTo.id);
    const response = await fetch('/api/send-audio?' + query.toString(), {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': mime }),
      body: file
    });
    if (response.status === 401) {
      endSession();
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : data.error === 'muted' ? 'muted' : 'upload');
    clearReply();
    if (current && current.id === convId) renderMessage(data);
  } catch (error) {
    const message = mediaSendError(error, { big: 'La música es demasiado pesada', fail: 'No se pudo enviar la música' });
    if (message) showToast(message);
  } finally {
    sendingAudio = false;
  }
}

function highlightMentions(el, mentions) {
  if (!Array.isArray(mentions) || !mentions.length) return;
  const byName = new Map(mentions.map(item => [item.name.toLowerCase(), item]));
  const names = mentions
    .map(item => item.name)
    .sort((a, b) => b.length - a.length)
    .map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp('(^|[^A-Za-z0-9_.-])@(' + names.join('|') + ')(?![A-Za-z0-9_]|[.-][A-Za-z0-9_])', 'gi');
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let last = 0;
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      const start = match.index + match[1].length;
      const end = start + match[2].length + 1;
      const person = byName.get(match[2].toLowerCase());
      if (start > last) fragment.appendChild(document.createTextNode(text.slice(last, start)));
      const tag = document.createElement('span');
      const self = !!me && person.id === me.id;
      tag.className = 'mention' + (self ? ' me' : '');
      tag.textContent = text.slice(start, end);
      if (!self) tag.addEventListener('click', () => openUserProfile(person.id, person.name));
      fragment.appendChild(tag);
      last = end;
    }
    if (!last) continue;
    if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
    node.replaceWith(fragment);
  }
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
  emojify(body, quoteText(reply));
  quote.appendChild(body);
  quote.addEventListener('click', () => jumpToMessage(reply.id));
  return quote;
}

function removeMessageRows(ids) {
  ids.forEach(id => {
    const row = messagesEl.querySelector('.msg-row[data-id="' + id + '"]');
    if (row) row.remove();
    messageIndex.delete(Number(id));
  });
}

function removeExpiredRows() {
  const now = Date.now();
  const ids = [];
  messageIndex.forEach((message, id) => {
    if (message.expires && message.expires <= now) ids.push(id);
  });
  if (ids.length) removeMessageRows(ids);
}

setInterval(removeExpiredRows, 5000);

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
  emojify(replyText, replyPreview(message));
  replyBar.classList.remove('hidden');
  msgInput.focus();
}

function clearReply() {
  replyTo = null;
  replyBar.classList.add('hidden');
}

function buildReportLinks(message) {
  const report = message.report;
  const targetName = report.targetName || ((/^Reportado: (.+)$/m.exec(message.text || '') || [])[1] || 'usuario');
  const fromName = report.fromName || ((/^Enviado por: (.+)$/m.exec(message.text || '') || [])[1] || 'usuario');
  const box = document.createElement('div');
  box.className = 'report-links';
  const add = (label, id, name) => {
    if (!id) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'report-link';
    button.textContent = label + name;
    button.addEventListener('click', () => openUserProfile(id, name));
    box.appendChild(button);
  };
  add('Ver perfil del reportado: ', report.target, targetName);
  add('Ver perfil de quien reportó: ', report.from, fromName);
  return box;
}

const chatCache = new Map();

function cacheMessage(message) {
  if (!current) return;
  let store = chatCache.get(current.id);
  if (!store) {
    store = new Map();
    chatCache.set(current.id, store);
  }
  store.set(message.id, message);
  if (store.size > 300) store.delete(store.keys().next().value);
}

function renderMessage(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);
  if (message.id > lastId) lastId = message.id;
  if (message.legacy) return;
  cacheMessage(message);

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
  wrapper.className = 'msg ' + (mine ? 'mine' : 'other') + (message.uid === AIKO_ID ? ' aiko' : '') + (message.sticker ? ' sticker' : '');

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
  if (message.sticker) wrapper.appendChild(buildSticker(message, mine));
  if (message.audio) wrapper.appendChild(buildAudio(message, 'chat'));
  if (message.video) wrapper.appendChild(buildVideo(message));
  if (message.doc) wrapper.appendChild(buildDoc(message));

  if (message.text || (!message.image && !message.sticker && !message.audio && !message.video && !message.doc)) {
    const text = document.createElement('div');
    if (message.uid === AIKO_ID) text.className = 'aiko-text';
    if (message.undecryptable) text.className = 'locked-text';
    emojify(text, message.text);
    highlightMentions(text, message.mentions);
    if (text.querySelector('.emoji') && !text.textContent.trim() && text.querySelectorAll('.emoji').length <= 3) {
      text.classList.add('jumbo');
    }
    wrapper.appendChild(text);
  }

  if (message.report && message.report.target) wrapper.appendChild(buildReportLinks(message));

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
  updateTempBadge();
}

async function loadChat() {
  const convId = current.id;
  closeChatSearch();
  messagesEl.textContent = '';
  messagesEl.appendChild(buildChatNotice());
  seen = new Set();
  messageIndex.clear();
  clearReply();
  hideMentions();
  lastId = 0;
  members = [];
  typingNames = [];
  statusText = '';
  renderStatus();
  applyHeader();
  const cached = chatCache.get(convId);
  if (cached && cached.size) {
    [...cached.values()].forEach(renderMessage);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  try {
    refreshMembers();
    const result = await api('/api/history?conv=' + encodeURIComponent(convId));
    if (!current || current.id !== convId) return;
    if (!result.ok) {
      showToast('No se pudo abrir el chat');
      goBack();
      return;
    }
    await ZentryE2E.openAll(convId, result.data);
    if (!current || current.id !== convId) return;
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
    groupMeta = { conv: convId, tempTtl: result.data.tempTtl || 0, ...(result.data.group || { statusMode: 'off', canConfig: false, canPost: false }) };
    updateTempBadge();
    members.forEach(rememberAvatar);
    refreshMessageAvatars();
    const selfMuted = !!groupMeta.muted;
    msgInput.disabled = selfMuted;
    msgInput.placeholder = selfMuted ? 'Estás silenciado en este grupo' : 'Escribe un mensaje';
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

let incomingChain = Promise.resolve();

function queueIncoming(data) {
  incomingChain = incomingChain.then(async () => {
    if (data.e2ee) await ZentryE2E.open(data.conv, data);
    onIncoming(data);
  }).catch(() => {});
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
      chat.last = { text: previewOf(message), time: message.time, user: message.user || '', mine: !!me && message.uid === me.id, system: !!message.system, sealedText: !!message.sealedOpen };
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
  if (tempTarget && tempTarget.id === data.conv && data.tempTtl !== undefined) {
    tempTarget.ttl = data.tempTtl;
    renderTempChoice();
  }
  if (current && current.id === data.conv) {
    if (data.avatar !== undefined) {
      current.avatar = data.avatar;
      applyHeader();
      avatarContent(infoAvatar, current);
    }
    if (data.statusMode !== undefined || data.tempTtl !== undefined || data.muted !== undefined || data.admin !== undefined) refreshMembers();
  }
}

async function poll() {
  if (polling || !token) return;
  polling = true;
  try {
    if (current && CHAT_VIEWS.includes(view)) {
      const convId = current.id;
      const result = await api('/api/history?conv=' + encodeURIComponent(convId) + '&after=' + lastId);
      if (current && current.id === convId && result.ok) await ZentryE2E.openAll(convId, result.data);
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
  source = new EventSource('/api/events?cid=' + clientId + '&visible=' + (document.visibilityState === 'visible' ? '1' : '0'));
  source.onopen = () => {
    lastEventAt = Date.now();
  };
  source.onerror = () => {
    if (current) setStatus('reconectando...');
  };
  source.onmessage = event => {
    lastEventAt = Date.now();
    queueIncoming(JSON.parse(event.data));
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
  source.addEventListener('cleared', event => {
    lastEventAt = Date.now();
    const data = JSON.parse(event.data);
    if (current && current.id === data.conv) loadChat();
    else refreshChats();
  });
  source.addEventListener('expired', event => {
    lastEventAt = Date.now();
    const data = JSON.parse(event.data);
    if (current && current.id === data.conv) removeMessageRows(data.ids);
  });
  source.addEventListener('chats', () => {
    lastEventAt = Date.now();
    refreshChats();
  });
  source.addEventListener('statuses', () => {
    lastEventAt = Date.now();
    refreshStatuses();
  });
  source.addEventListener('sponsors', () => {
    lastEventAt = Date.now();
    refreshSponsors();
  });
  source.addEventListener('channels', () => {
    lastEventAt = Date.now();
    refreshChannels();
    if (view === 'channel' && channelOpenId) loadChannel();
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
  if (person.muted) {
    const mutedTag = document.createElement('span');
    mutedTag.className = 'member-tag member-muted';
    mutedTag.textContent = 'Silenciado';
    info.appendChild(mutedTag);
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
  memberBarCount.textContent = infoCount.textContent;
  const query = memberSearching ? memberQuery.trim().toLowerCase() : '';

  const self = members.find(item => item.id === me.id);
  const meta = groupMeta.conv === current.id ? groupMeta : { statusMode: 'off', canConfig: false, canPost: false };
  const creator = members.find(item => item.creator);
  infoCreator.textContent = creator ? 'Grupo creado por ' + (creator.id === me.id ? 'ti' : creator.name) : '';
  infoCreator.classList.toggle('hidden', !creator);
  groupSettings.classList.toggle('hidden', !meta.canConfig);
  groupStatusValue.textContent = STATUS_MODE_LABELS[meta.statusMode] || STATUS_MODE_LABELS.off;
  groupTempValue.textContent = TEMP_LABELS[groupTemp()] || TEMP_LABELS[0];
  if (tempTarget && tempTarget.id === current.id) {
    tempTarget.ttl = groupTemp();
    renderTempChoice();
  }
  groupStatusPost.classList.toggle('hidden', !meta.canPost);
  groupActions.classList.toggle('hidden', !meta.canPost);
  groupStatusSheet.querySelectorAll('.sheet-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.mode === meta.statusMode);
  });

  memberList.textContent = '';
  const showSelf = !query || 'tú'.includes(query) || me.name.toLowerCase().includes(query);
  if (showSelf) memberList.appendChild(memberRow(self ? { ...me, creator: self.creator, admin: self.admin } : me, true, true));

  const pool = query ? others.filter(item => item.name.toLowerCase().includes(query)) : others;
  const visible = showAllMembers || query ? pool : pool.slice(0, MEMBERS_PREVIEW - 1);
  memberEmpty.classList.toggle('hidden', !query || showSelf || visible.length > 0);
  visible.forEach(item => {
    const row = memberRow(item, item.online, false);
    row.addEventListener('click', () => openUserProfile(item.id, item.name));
    const canAdmin = !!self && !item.creator && (!!self.creator || (!!self.admin && !item.admin));
    const canMute = !!meta.canConfig && !item.creator && (!item.admin || (!!self && !!self.creator));
    if (canAdmin || canMute) {
      const optsBtn = document.createElement('button');
      optsBtn.type = 'button';
      optsBtn.className = 'member-opts';
      optsBtn.setAttribute('aria-label', 'Opciones de ' + item.name);
      optsBtn.innerHTML = ICON_PLUS;
      optsBtn.addEventListener('click', event => {
        event.stopPropagation();
        openMemberSheet(item, canAdmin, canMute);
      });
      row.appendChild(optsBtn);
    }
    memberList.appendChild(row);
  });

  const hidden = pool.length - visible.length;
  if (hidden > 0) {
    memberMore.textContent = 'Ver todos (' + hidden + ' más)';
    memberMore.classList.remove('hidden');
  } else {
    memberMore.classList.add('hidden');
  }
}

async function toggleMute(person) {
  if (!current) return;
  const convId = current.id;
  const mute = !person.muted;
  try {
    const result = await api('/api/mute?conv=' + encodeURIComponent(convId), { userId: person.id, muted: mute });
    if (!result.ok) throw new Error('mute');
    showToast(mute ? person.name + ' fue silenciado' : 'Silencio quitado a ' + person.name);
  } catch {
    showToast('No se pudo cambiar el silencio');
  }
  refreshMembers();
}

function closeMemberSheet() {
  memberSheet.classList.add('hidden');
}

function openMemberSheet(person, canAdmin, canMute) {
  fillAvatar(memberSheetAvatar, person.id, person.name, userAvatarSrc(person));
  memberSheetName.textContent = person.name;
  memberSheetOptions.textContent = '';
  const addOption = (label, icon, danger, action) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'sheet-option' + (danger ? ' danger' : '');
    const iconBox = document.createElement('span');
    iconBox.className = 'sheet-icon';
    iconBox.innerHTML = icon;
    const text = document.createElement('span');
    text.textContent = label;
    option.appendChild(iconBox);
    option.appendChild(text);
    option.addEventListener('click', () => {
      closeMemberSheet();
      action();
    });
    memberSheetOptions.appendChild(option);
  };
  if (canAdmin) {
    addOption(person.admin ? 'Quitar admin' : 'Hacer admin', person.admin ? ICON_ADMIN_OFF : ICON_ADMIN_ON, false, () => toggleAdmin(person));
  }
  if (canMute) {
    addOption(person.muted ? 'Quitar silencio' : 'Silenciar', person.muted ? ICON_MUTE_OFF : ICON_MUTE_ON, !person.muted, () => toggleMute(person));
  }
  memberSheet.classList.remove('hidden');
}

memberSheetScrim.addEventListener('click', closeMemberSheet);

async function toggleAdmin(person) {
  if (!current) return;
  const convId = current.id;
  const admin = !person.admin;
  try {
    const result = await api('/api/group-admin?conv=' + encodeURIComponent(convId), { userId: person.id, admin });
    if (!result.ok) throw new Error('admin');
    showToast(admin ? person.name + ' ahora es admin' : person.name + ' ya no es admin');
  } catch {
    showToast('No se pudo cambiar el admin');
  }
  refreshMembers();
}

function groupTemp() {
  return current && groupMeta.conv === current.id ? Number(groupMeta.tempTtl) || 0 : 0;
}

function updateTempBadge() {
  tempBadge.classList.toggle('hidden', !(current && groupTemp() > 0));
}

function renderTempChoice() {
  const ttl = tempTarget ? tempTarget.ttl : 0;
  tempOptions.querySelectorAll('.temp-card').forEach(card => {
    const active = Number(card.dataset.ttl) === ttl;
    card.classList.toggle('selected', active);
    card.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}

function openTempMessages() {
  if (!current) return;
  tempTarget = { id: current.id, name: current.name, ttl: groupTemp() };
  tempChatName.textContent = current.name;
  renderTempChoice();
  enter('temp', false);
}

async function openTempForUser() {
  if (!profileUser) return;
  const person = profileUser;
  try {
    const dm = await api('/api/dm', { userId: person.id });
    if (!dm.ok) throw new Error('dm');
    const info = await api('/api/members?conv=' + encodeURIComponent(dm.data.id));
    if (!info.ok) throw new Error('members');
    tempTarget = { id: dm.data.id, name: person.name, ttl: Number(info.data.tempTtl) || 0 };
    tempChatName.textContent = person.name;
    renderTempChoice();
    enter('temp', false);
  } catch {
    showToast('No se pudo abrir el ajuste');
  }
}

function openGroupInfo() {
  if (!current || current.type !== 'group') return;
  showAllMembers = false;
  closeMemberSearch(false);
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
  reportBtn.classList.toggle('hidden', !!profileUser.bot || !known);
  userSettings.classList.toggle('hidden', !!profileUser.bot || !known);
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

function updateReportSend() {
  reportSendBtn.disabled = sendingReport || !reportText.value.trim();
}

function setReportShot(shot) {
  reportShot = shot;
  reportShotBox.classList.toggle('hidden', !shot);
  if (shot) reportShotImg.src = shot.data;
  else reportShotImg.removeAttribute('src');
  reportAttachBtn.textContent = shot ? 'Cambiar captura' : 'Adjuntar captura';
}

function hideReport() {
  reportOverlay.classList.add('hidden');
  reportTarget = null;
  reportText.value = '';
  setReportShot(null);
  updateReportSend();
}

function openReport() {
  if (!profileUser || profileUser.bot) return;
  reportTarget = { id: profileUser.id, name: profileUser.name };
  reportTitle.textContent = 'Reportar a ' + profileUser.name;
  history.pushState({ v: view }, '');
  reportOverlay.classList.remove('hidden');
  reportText.focus();
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

function plural(count, one, many) {
  return count + ' ' + (count === 1 ? one : many);
}

function channelTime(ts) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ts >= startToday) return formatTime(ts);
  return new Date(ts).toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

function plainAvatar(size, key, name, square) {
  const box = document.createElement('div');
  box.className = 'ch-avatar' + (size ? ' ' + size : '') + (square ? ' square' : '');
  fillAvatar(box, key, name, '');
  return box;
}

function sponsorHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function renderSponsors() {
  if (!me) return;
  const owner = !!me.owner;
  sponsorListEl.textContent = '';
  sponsorsData.forEach(item => {
    const row = document.createElement('li');
    row.className = 'status-row';
    row.appendChild(plainAvatar('', 'sp:' + item.id, item.name, true));
    const main = document.createElement('div');
    main.className = 'ch-row-main';
    const name = document.createElement('span');
    name.className = 'status-name';
    name.textContent = item.name;
    const sub = document.createElement('span');
    sub.className = 'ch-row-sub';
    sub.textContent = item.desc || sponsorHost(item.url);
    main.append(name, sub);
    row.appendChild(main);
    const tag = document.createElement('span');
    tag.className = 'spon-tag';
    tag.textContent = '✧ Patrocinado';
    row.appendChild(tag);
    if (owner) {
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'spon-del';
      del.setAttribute('aria-label', 'Quitar patrocinio');
      del.textContent = '✕';
      del.addEventListener('click', event => {
        event.stopPropagation();
        removeSponsor(item);
      });
      row.appendChild(del);
    }
    row.addEventListener('click', () => window.open(item.url, '_blank', 'noopener,noreferrer'));
    sponsorListEl.appendChild(row);
  });
  sponsorSection.classList.toggle('hidden', !sponsorsData.length && !owner);
  sponsorAdd.classList.toggle('hidden', !owner);
}

async function refreshSponsors() {
  if (!token || !me) return;
  try {
    const result = await api('/api/sponsors');
    if (!result.ok) return;
    const sig = JSON.stringify(result.data);
    if (sig === sponsorsSig) return;
    sponsorsSig = sig;
    sponsorsData = result.data.sponsors || [];
    renderSponsors();
  } catch {}
}

async function removeSponsor(item) {
  if (!confirm('¿Quitar el patrocinio de ' + item.name + '?')) return;
  try {
    const result = await api('/api/sponsors/delete', { id: item.id });
    if (!result.ok) showToast('No se pudo quitar');
    sponsorsSig = '';
    refreshSponsors();
  } catch {}
}

function openSponsorNew() {
  sponsorNameInput.value = '';
  sponsorDescInput.value = '';
  sponsorUrlInput.value = '';
  sponsorNewBtn.disabled = true;
  enter('sponsornew');
  sponsorNameInput.focus();
}

function updateSponsorForm() {
  sponsorNewBtn.disabled = !(sponsorNameInput.value.trim() && sponsorUrlInput.value.trim());
}

async function createSponsor() {
  sponsorNewBtn.disabled = true;
  try {
    const result = await api('/api/sponsors/add', {
      name: sponsorNameInput.value,
      desc: sponsorDescInput.value,
      url: sponsorUrlInput.value
    });
    if (!result.ok) {
      showToast(result.data.error === 'limit' ? 'Alcanzaste el límite de patrocinios' : 'Revisa el nombre y el enlace');
      updateSponsorForm();
      return;
    }
    sponsorsSig = '';
    await refreshSponsors();
    goBack();
  } catch {
    updateSponsorForm();
  }
}

function channelRow(channel, withFollow) {
  const row = document.createElement('li');
  row.className = 'status-row';
  row.appendChild(plainAvatar('', 'ch:' + channel.id, channel.name, false));
  const main = document.createElement('div');
  main.className = 'ch-row-main';
  const name = document.createElement('span');
  name.className = 'status-name';
  name.textContent = channel.name;
  const sub = document.createElement('span');
  sub.className = 'ch-row-sub';
  if (withFollow) sub.textContent = plural(channel.followers, 'seguidor', 'seguidores');
  else sub.textContent = channel.last ? channel.last.text : channel.desc || plural(channel.followers, 'seguidor', 'seguidores');
  main.append(name, sub);
  row.appendChild(main);
  if (withFollow) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ch-small-btn';
    button.textContent = 'Seguir';
    button.addEventListener('click', event => {
      event.stopPropagation();
      button.disabled = true;
      followChannel(channel.id, true);
    });
    row.appendChild(button);
  } else if (channel.last) {
    const time = document.createElement('span');
    time.className = 'ch-row-time';
    time.textContent = channelTime(channel.last.time);
    row.appendChild(time);
  }
  row.addEventListener('click', () => openChannelView(channel.id));
  return row;
}

function renderChannels() {
  if (!me) return;
  channelListEl.textContent = '';
  channelData.following.forEach(channel => channelListEl.appendChild(channelRow(channel, false)));
  channelEmpty.classList.toggle('hidden', channelData.following.length > 0);
  exploreList.textContent = '';
  channelData.explore.forEach(channel => exploreList.appendChild(channelRow(channel, true)));
  exploreEmpty.classList.toggle('hidden', channelData.explore.length > 0);
}

async function refreshChannels() {
  if (!token || !me) return;
  try {
    const result = await api('/api/channels');
    if (!result.ok) return;
    const sig = JSON.stringify(result.data);
    if (sig === channelSig) return;
    channelSig = sig;
    channelData = result.data;
    renderChannels();
  } catch {}
}

async function followChannel(id, follow) {
  try {
    const result = await api('/api/channels/follow', { id, follow });
    if (!result.ok) showToast('No se pudo completar');
  } catch {}
  channelSig = '';
  refreshChannels();
  if (view === 'channel' && channelOpenId === id) loadChannel();
}

function openChannelExplore() {
  enter('channels');
  refreshChannels();
}

function openNewChannel() {
  channelNameInput.value = '';
  channelDescInput.value = '';
  channelNewBtn.disabled = true;
  enter('channelnew');
  channelNameInput.focus();
}

async function createChannel() {
  channelNewBtn.disabled = true;
  try {
    const result = await api('/api/channels/create', { name: channelNameInput.value, desc: channelDescInput.value });
    if (!result.ok) {
      showToast(result.data.error === 'limit' ? 'Alcanzaste el límite de canales' : 'No se pudo crear el canal');
      channelNewBtn.disabled = !channelNameInput.value.trim();
      return;
    }
    channelSig = '';
    refreshChannels();
    channelOpenId = result.data.id;
    enter('channel', true);
    loadChannel();
  } catch {
    channelNewBtn.disabled = !channelNameInput.value.trim();
  }
}

function openChannelView(id) {
  channelOpenId = id;
  channelOpenSig = '';
  channelOpenData = null;
  channelPosts.textContent = '';
  channelDesc.classList.add('hidden');
  channelPostsEmpty.classList.add('hidden');
  channelPostForm.classList.add('hidden');
  channelFollowBtn.classList.add('hidden');
  channelDeleteBtn.classList.add('hidden');
  channelHeadName.textContent = '';
  channelHeadSub.textContent = '';
  channelHeadAvatar.textContent = '';
  enter('channel');
  loadChannel();
}

async function loadChannel() {
  const id = channelOpenId;
  if (!id) return;
  try {
    const result = await api('/api/channel?id=' + encodeURIComponent(id));
    if (id !== channelOpenId) return;
    if (!result.ok) {
      showToast('Este canal ya no está disponible');
      if (view === 'channel') goBack();
      return;
    }
    const sig = JSON.stringify(result.data);
    if (sig === channelOpenSig) return;
    const first = channelOpenSig === '';
    channelOpenSig = sig;
    channelOpenData = result.data;
    renderChannelView(first);
  } catch {}
}

function renderChannelView(first) {
  const channel = channelOpenData.channel;
  const posts = channelOpenData.posts;
  channelHeadAvatar.className = 'ch-avatar sm';
  fillAvatar(channelHeadAvatar, 'ch:' + channel.id, channel.name, '');
  channelHeadName.textContent = channel.name;
  channelHeadSub.textContent = plural(channel.followers, 'seguidor', 'seguidores');
  channelFollowBtn.classList.toggle('hidden', channel.mine);
  channelFollowBtn.classList.toggle('on', channel.following);
  channelFollowBtn.textContent = channel.following ? 'Siguiendo' : 'Seguir';
  channelDeleteBtn.classList.toggle('hidden', !channel.mine);
  channelPostForm.classList.toggle('hidden', !channel.mine);
  channelDesc.textContent = channel.desc;
  channelDesc.classList.toggle('hidden', !channel.desc);
  const stick = first || channelBody.scrollHeight - channelBody.scrollTop - channelBody.clientHeight < 140;
  channelPosts.textContent = '';
  posts.forEach(post => {
    const bubble = document.createElement('div');
    bubble.className = 'ch-post';
    const text = document.createElement('div');
    text.className = 'ch-post-text';
    text.textContent = post.text;
    const foot = document.createElement('div');
    foot.className = 'ch-post-foot';
    if (channel.mine) {
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'ch-post-del';
      del.setAttribute('aria-label', 'Eliminar publicación');
      del.textContent = '✕';
      del.addEventListener('click', () => removeChannelPost(post.id));
      foot.appendChild(del);
    }
    const time = document.createElement('span');
    time.textContent = channelTime(post.time);
    foot.appendChild(time);
    bubble.append(text, foot);
    channelPosts.appendChild(bubble);
  });
  channelPostsEmpty.classList.toggle('hidden', posts.length > 0);
  if (stick) channelBody.scrollTop = channelBody.scrollHeight;
}

async function submitChannelPost(event) {
  event.preventDefault();
  const text = channelPostInput.value.trim();
  if (!text || !channelOpenId) return;
  channelPostBtn.disabled = true;
  try {
    const result = await api('/api/channels/post', { id: channelOpenId, text });
    if (result.ok) {
      channelPostInput.value = '';
      channelOpenSig = '';
      await loadChannel();
      channelBody.scrollTop = channelBody.scrollHeight;
    } else {
      showToast('No se pudo publicar');
    }
  } catch {}
  channelPostBtn.disabled = false;
  channelPostInput.focus();
}

async function removeChannelPost(postId) {
  if (!confirm('¿Eliminar esta publicación?')) return;
  try {
    const result = await api('/api/channels/delete-post', { id: channelOpenId, post: postId });
    if (!result.ok) showToast('No se pudo eliminar');
  } catch {}
  channelOpenSig = '';
  loadChannel();
}

async function deleteChannel() {
  if (!channelOpenData || !confirm('¿Eliminar el canal ' + channelOpenData.channel.name + ' y todas sus publicaciones?')) return;
  try {
    const result = await api('/api/channels/delete', { id: channelOpenId });
    if (!result.ok) {
      showToast('No se pudo eliminar');
      return;
    }
    channelSig = '';
    refreshChannels();
    goBack();
  } catch {}
}

function statusMediaUrl(id) {
  return '/api/status-media?id=' + encodeURIComponent(id);
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
  xhr.open('POST', '/api/status?caption=' + encodeURIComponent(caption) + groupQuery);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);
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

function deviceAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 10) return 'ahora';
  if (min < 60) return 'hace ' + min + ' min';
  const hours = Math.floor(min / 60);
  if (hours < 24) return 'hace ' + hours + (hours === 1 ? ' hora' : ' horas');
  const days = Math.floor(hours / 24);
  return 'hace ' + days + (days === 1 ? ' día' : ' días');
}

function deviceRow(item) {
  const row = document.createElement('li');
  row.className = 'device';
  const icon = document.createElement('span');
  icon.className = 'device-icon';
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8 20h8M12 16.5V20"/></svg>';
  row.appendChild(icon);
  const text = document.createElement('span');
  text.className = 'device-text';
  const name = document.createElement('span');
  name.className = 'device-name';
  name.textContent = item.device;
  const sub = document.createElement('span');
  sub.className = 'device-sub' + (item.current ? ' on' : '');
  sub.textContent = item.current ? 'Este dispositivo · activo ahora' : 'Último acceso ' + deviceAgo(item.last);
  text.appendChild(name);
  text.appendChild(sub);
  row.appendChild(text);
  if (!item.current) {
    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'member-mute';
    out.textContent = 'Cerrar sesión';
    out.addEventListener('click', () => closeDevices({ id: item.id }));
    row.appendChild(out);
  }
  return row;
}

function renderDevices(list) {
  deviceCurrent.textContent = '';
  deviceOthers.textContent = '';
  const others = list.filter(item => !item.current);
  list.filter(item => item.current).forEach(item => deviceCurrent.appendChild(deviceRow(item)));
  others.forEach(item => deviceOthers.appendChild(deviceRow(item)));
  deviceOthersTitle.classList.toggle('hidden', !others.length);
  deviceEmpty.classList.toggle('hidden', others.length > 0);
  deviceLogoutAll.classList.toggle('hidden', !others.length);
}

async function loadDevices() {
  try {
    const result = await api('/api/devices');
    if (!result.ok) throw new Error('devices');
    renderDevices(result.data);
  } catch {
    showToast('No se pudieron cargar los dispositivos');
  }
}

async function closeDevices(body) {
  try {
    const result = await api('/api/device-logout', body);
    if (!result.ok) throw new Error('devices');
    showToast('Sesión cerrada');
  } catch {
    showToast('No se pudo cerrar la sesión');
  }
  loadDevices();
}

function openDevices() {
  homeMenu.classList.add('hidden');
  deviceCurrent.textContent = '';
  deviceOthers.textContent = '';
  deviceOthersTitle.classList.add('hidden');
  deviceEmpty.classList.add('hidden');
  deviceLogoutAll.classList.add('hidden');
  enter('devices', false);
}

let pendingLink = '';
let scanStream = null;
let scanTimer = null;
let linkBusy = false;

function parseLinkCode(text) {
  const match = String(text || '').toUpperCase().match(/([A-Z2-9]{4})-?([A-Z2-9]{4})\s*$/);
  return match ? match[1] + match[2] : '';
}

function stopScan() {
  clearInterval(scanTimer);
  scanTimer = null;
  if (scanStream) scanStream.getTracks().forEach(track => track.stop());
  scanStream = null;
  linkVideo.srcObject = null;
  linkScan.classList.add('hidden');
}

function resetLink() {
  stopScan();
  pendingLink = '';
  linkBusy = false;
  linkCode.value = '';
  linkConfirm.classList.add('hidden');
  linkForm.classList.remove('hidden');
  linkScanBtn.classList.remove('hidden');
}

async function lookupLink(code) {
  if (linkBusy) return;
  linkBusy = true;
  try {
    const result = await api('/api/link/info?code=' + encodeURIComponent(code));
    if (!result.ok) {
      showToast(result.status === 429 ? 'Demasiados intentos. Espera un momento' : 'Código inválido o vencido');
      return;
    }
    stopScan();
    pendingLink = code;
    linkName.textContent = result.data.name;
    linkForm.classList.add('hidden');
    linkScanBtn.classList.add('hidden');
    linkConfirm.classList.remove('hidden');
  } catch {
  } finally {
    linkBusy = false;
  }
}

async function startScan() {
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('Este navegador no puede escanear. Escribe el código');
    return;
  }
  try {
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    linkVideo.srcObject = scanStream;
    await linkVideo.play();
    linkScan.classList.remove('hidden');
    scanTimer = setInterval(async () => {
      try {
        const found = await detector.detect(linkVideo);
        const code = found.length ? parseLinkCode(found[0].rawValue) : '';
        if (code) lookupLink(code);
      } catch {}
    }, 400);
  } catch {
    stopScan();
    showToast('No se pudo abrir la cámara');
  }
}

deviceLinkBtn.addEventListener('click', () => {
  resetLink();
  enter('link', false);
});
linkBack.addEventListener('click', goBack);
linkScanBtn.addEventListener('click', startScan);
linkForm.addEventListener('submit', event => {
  event.preventDefault();
  const code = parseLinkCode(linkCode.value);
  if (!code) {
    showToast('Escribe el código de 8 caracteres');
    return;
  }
  lookupLink(code);
});
linkCancel.addEventListener('click', resetLink);
linkApprove.addEventListener('click', async () => {
  if (!pendingLink) return;
  linkApprove.disabled = true;
  try {
    const result = await api('/api/link/approve', { code: pendingLink });
    if (!result.ok) throw new Error(result.data && result.data.error === 'limit' ? 'limit' : 'link');
    showToast('Dispositivo vinculado');
    goBack();
  } catch (error) {
    showToast(error && error.message === 'limit' ? 'Llegaste al máximo de bots vinculados' : 'No se pudo vincular. El código pudo vencer');
    resetLink();
  } finally {
    linkApprove.disabled = false;
  }
});

menuBtn.addEventListener('click', event => {
  event.stopPropagation();
  homeMenu.classList.toggle('hidden');
});
document.addEventListener('click', event => {
  if (!homeMenu.classList.contains('hidden') && !homeMenu.contains(event.target)) homeMenu.classList.add('hidden');
});
menuDevices.addEventListener('click', openDevices);
devicesBack.addEventListener('click', goBack);
deviceLogoutAll.addEventListener('click', () => closeDevices({ all: true }));

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
  [homeEl, chatEl, groupInfo, tempEl, userProfileEl, statusNewEl, statusViewEl, newChatEl, newGroupEl, profileEl, devicesEl, linkEl, channelsExploreEl, channelNewEl, channelViewEl, sponsorNewEl, chatFilesEl].forEach(item => item.classList.add('hidden'));
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
  chatCache.clear();
  chats = [];
  chatsSig = '';
  statusData = { mine: null, others: [] };
  statusSig = '';
  sponsorsData = [];
  sponsorsSig = '';
  channelData = { following: [], explore: [] };
  channelSig = '';
  channelOpenId = '';
  setTab('chats');
  localStorage.removeItem('chat_token');
  localStorage.removeItem('chat_boot');
}

function endSession() {
  stopEvents();
  clearSession();
  showLogin();
}

async function enterApp() {
  const cached = loadBootCache();
  if (cached) {
    me = cached.me;
    chats = cached.chats;
    rememberAvatar(me);
    updateProfileBtn();
    loginEl.classList.add('hidden');
    history.replaceState({ v: 'list' }, '');
    showView('list');
    renderChatList();
  }
  const chatsRequest = api('/api/chats').catch(() => null);
  let response;
  try {
    response = await fetch('/api/me', { headers: authHeaders() });
  } catch {
    if (!cached) showLoginError('No se pudo conectar con el servidor');
    return;
  }
  if (!response.ok) {
    clearSession();
    showLogin();
    return;
  }
  me = (await response.json()).user;
  ZentryE2E.init(me.id, authHeaders).catch(() => {
    showToast('Este navegador no permite el cifrado. Abre Zentry por HTTPS');
  });
  rememberAvatar(me);
  updateProfileBtn();
  loginEl.classList.add('hidden');
  if (!cached) {
    history.replaceState({ v: 'list' }, '');
    showView('list');
  }
  await applyChats(await chatsRequest);
  saveBootCache();
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
function closeStatusSheet() {
  groupStatusSheet.classList.add('hidden');
}

groupStatusRow.addEventListener('click', () => {
  groupStatusSheet.classList.remove('hidden');
});
groupStatusScrim.addEventListener('click', closeStatusSheet);
groupTempRow.addEventListener('click', openTempMessages);
userTempRow.addEventListener('click', openTempForUser);
tempBack.addEventListener('click', goBack);
tempOptions.querySelectorAll('.temp-card').forEach(card => {
  card.addEventListener('click', async () => {
    const target = tempTarget;
    if (!target) return;
    const ttl = Number(card.dataset.ttl);
    if (ttl === target.ttl) return;
    try {
      const result = await api('/api/temp-settings?conv=' + encodeURIComponent(target.id), { ttl });
      if (!result.ok) throw new Error('temp');
      target.ttl = ttl;
      if (tempTarget === target) renderTempChoice();
      if (current && current.id === target.id && groupMeta.conv === target.id) {
        groupMeta.tempTtl = ttl;
        groupTempValue.textContent = TEMP_LABELS[ttl] || TEMP_LABELS[0];
        updateTempBadge();
      }
      showToast(ttl ? 'Mensajes temporales: ' + TEMP_LABELS[ttl] : 'Mensajes temporales desactivados');
    } catch {
      showToast('No se pudo guardar el ajuste');
    }
    if (current && current.id === target.id) refreshMembers();
  });
});
groupStatusSheet.querySelectorAll('.sheet-option').forEach(option => {
  option.addEventListener('click', async () => {
    if (!current) return;
    const convId = current.id;
    const mode = option.dataset.mode;
    closeStatusSheet();
    try {
      const result = await api('/api/group-settings?conv=' + encodeURIComponent(convId), { statusMode: mode });
      if (!result.ok) throw new Error('settings');
      showToast('Ajuste guardado');
    } catch {
      showToast('No se pudo guardar el ajuste');
    }
    refreshMembers();
  });
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

function openMemberSearch() {
  memberSearching = true;
  memberBar.classList.add('hidden');
  memberSearchRow.classList.remove('hidden');
  memberSearchInput.value = memberQuery;
  renderMembers();
  memberSearchInput.focus();
}

function closeMemberSearch(render = true) {
  memberSearching = false;
  memberQuery = '';
  memberSearchInput.value = '';
  memberSearchRow.classList.add('hidden');
  memberBar.classList.remove('hidden');
  memberEmpty.classList.add('hidden');
  if (render) renderMembers();
}

memberSearchBtn.addEventListener('click', openMemberSearch);
memberSearchBack.addEventListener('click', () => closeMemberSearch());
memberSearchInput.addEventListener('input', () => {
  memberQuery = memberSearchInput.value;
  renderMembers();
});
memberSearchInput.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMemberSearch();
});

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

function stickerUrl(id) {
  return '/api/sticker-file?id=' + encodeURIComponent(id);
}

function renderStickerGrid() {
  stickerGrid.textContent = '';
  const create = document.createElement('button');
  create.type = 'button';
  create.className = 'sticker-create';
  create.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M12 8v8M8 12h8"/></svg><span>Crear sticker</span>';
  create.addEventListener('click', () => {
    if (!creatingSticker) stickerInput.click();
  });
  stickerGrid.appendChild(create);
  if (creatingSticker) {
    const pending = document.createElement('div');
    pending.className = 'sticker-item sticker-pending';
    pending.innerHTML = '<span class="sticker-spin"></span>';
    stickerGrid.appendChild(pending);
  }
  (stickerList || []).forEach(item => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'sticker-item';
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.draggable = false;
    img.src = stickerUrl(item.id);
    cell.appendChild(img);
    let timer = 0;
    let held = false;
    const clear = () => clearTimeout(timer);
    cell.addEventListener('pointerdown', () => {
      held = false;
      timer = setTimeout(async () => {
        held = true;
        if (!window.confirm('¿Eliminar este sticker?')) return;
        try {
          const result = await api('/api/sticker-delete', { id: item.id });
          if (!result.ok) throw new Error('delete');
          stickerList = stickerList.filter(entry => entry.id !== item.id);
          renderStickerGrid();
        } catch {
          showToast('No se pudo eliminar');
        }
      }, 550);
    });
    cell.addEventListener('pointerup', clear);
    cell.addEventListener('pointerleave', clear);
    cell.addEventListener('pointercancel', clear);
    cell.addEventListener('contextmenu', event => event.preventDefault());
    cell.addEventListener('click', () => {
      if (!held) sendSticker(item.id);
    });
    stickerGrid.appendChild(cell);
  });
}

async function loadStickers() {
  if (stickerList === null) renderStickerGrid();
  try {
    const result = await api('/api/stickers');
    if (!result.ok) throw new Error('load');
    stickerList = result.data.stickers || [];
  } catch {
    if (stickerList === null) stickerList = [];
  }
  renderStickerGrid();
}

async function sendSticker(id) {
  if (!current || sendingSticker) return;
  sendingSticker = true;
  const convId = current.id;
  const payload = { id };
  if (replyTo) payload.replyTo = replyTo.id;
  try {
    if (current.sealed !== false) {
      const response = await fetch(stickerUrl(id), { headers: authHeaders() });
      if (response.status === 401) {
        endSession();
        return;
      }
      if (!response.ok) throw new Error('send');
      const item = (stickerList || []).find(entry => entry.id === id);
      await sendSealedMedia(convId, 'sticker', await response.blob(), { mime: 'image/webp', ext: 'webp', w: 512, h: 512, animated: !!(item && item.animated) }, '');
      return;
    }
    const result = await api('/api/send-sticker?conv=' + encodeURIComponent(convId), payload);
    if (!result.ok) throw new Error(result.data.error || 'send');
    clearReply();
    if (current && current.id === convId) renderMessage(result.data);
  } catch (error) {
    if (error && error.message === 'auth') return;
    showToast(error && error.message === 'muted' ? 'Estás silenciado en este grupo' : 'No se pudo enviar el sticker');
  } finally {
    sendingSticker = false;
  }
}

stickerInput.addEventListener('change', async () => {
  const file = stickerInput.files[0];
  stickerInput.value = '';
  if (!file || creatingSticker) return;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
  if (!allowed.includes(file.type)) return showToast('Formato no compatible');
  if (file.size > 25 * 1024 * 1024) return showToast('El archivo pesa más de 25 MB');
  creatingSticker = true;
  renderStickerGrid();
  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), 300000);
  try {
    const response = await fetch('/api/sticker-create', {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': file.type }),
      body: file,
      signal: controller.signal
    });
    if (response.status === 401) {
      endSession();
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : data.error || 'create');
    if (!Array.isArray(stickerList)) stickerList = [];
    stickerList.unshift({ id: data.id, animated: !!data.animated });
    renderStickerGrid();
  } catch (error) {
    const code = error && error.message;
    showToast(code === 'size' ? 'El archivo pesa más de 25 MB' : code === 'limit' ? 'Tu colección está llena' : code === 'ffmpeg' ? 'El servidor no tiene ffmpeg' : code === 'rate' ? 'Espera un momento' : 'No se pudo crear el sticker');
  } finally {
    clearTimeout(abortTimer);
    creatingSticker = false;
    renderStickerGrid();
  }
});

function setEmojiTab(tab) {
  const isEmoji = tab === 'emoji';
  epTabEmoji.classList.toggle('active', isEmoji);
  epTabSticker.classList.toggle('active', !isEmoji);
  epEmojiView.classList.toggle('hidden', !isEmoji);
  epStickerView.classList.toggle('hidden', isEmoji);
  epSearchBtn.classList.toggle('invisible', !isEmoji);
  if (!isEmoji) {
    closeEmojiSearch();
    loadStickers();
  }
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
    await fetch('/api/logout', { method: 'POST', headers: authHeaders() });
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
        : result.data.error === 'rate' || result.data.error === 'locked'
          ? 'Demasiados intentos, espera un momento'
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

function mentionToken() {
  const caret = msgInput.selectionStart;
  if (caret == null) return null;
  const match = /(^|[^A-Za-z0-9_.-])@([A-Za-z0-9_.-]{0,20})$/.exec(msgInput.value.slice(0, caret));
  if (!match) return null;
  return { start: caret - match[2].length - 1, end: caret, query: match[2].toLowerCase() };
}

function hideMentions() {
  mentionItems = [];
  mentionIndex = 0;
  mentionListEl.textContent = '';
  mentionListEl.classList.add('hidden');
}

function paintMentionActive() {
  Array.from(mentionListEl.children).forEach((row, index) => {
    row.classList.toggle('active', index === mentionIndex);
    if (index === mentionIndex) row.scrollIntoView({ block: 'nearest' });
  });
}

function pickMention(person) {
  const token = mentionToken();
  if (!token) return hideMentions();
  const value = msgInput.value;
  const insert = '@' + person.name + ' ';
  const next = value.slice(0, token.start) + insert + value.slice(token.end);
  if (next.length > msgInput.maxLength) return hideMentions();
  msgInput.value = next;
  const position = token.start + insert.length;
  msgInput.setSelectionRange(position, position);
  hideMentions();
  msgInput.focus();
}

function updateMentions() {
  const token = !msgInput.disabled && current && current.type === 'group' && !current.bot ? mentionToken() : null;
  if (!token) return hideMentions();
  const list = members
    .filter(item => item.id !== AIKO_ID && (!me || item.id !== me.id) && item.name.toLowerCase().includes(token.query))
    .sort((a, b) => Number(b.name.toLowerCase().startsWith(token.query)) - Number(a.name.toLowerCase().startsWith(token.query)))
    .slice(0, 20);
  if (!list.length) return hideMentions();
  mentionItems = list;
  mentionIndex = 0;
  mentionListEl.textContent = '';
  for (const person of list) {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'mention-item';
    row.setAttribute('role', 'option');
    const avatar = document.createElement('div');
    avatar.className = 'mention-avatar';
    fillAvatar(avatar, person.id, person.name, userAvatarSrc(person));
    const name = document.createElement('span');
    name.className = 'mention-name';
    name.textContent = person.name;
    row.appendChild(avatar);
    row.appendChild(name);
    row.addEventListener('mousedown', event => event.preventDefault());
    row.addEventListener('click', () => pickMention(person));
    mentionListEl.appendChild(row);
  }
  mentionListEl.classList.remove('hidden');
  paintMentionActive();
}

msgInput.addEventListener('input', updateMentions);
msgInput.addEventListener('click', updateMentions);
msgInput.addEventListener('blur', hideMentions);
msgInput.addEventListener('keyup', event => {
  if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'].includes(event.key)) return;
  updateMentions();
});
msgInput.addEventListener('keydown', event => {
  if (!mentionItems.length) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    mentionIndex = (mentionIndex + step + mentionItems.length) % mentionItems.length;
    paintMentionActive();
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    event.preventDefault();
    pickMention(mentionItems[mentionIndex]);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    hideMentions();
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

async function prepareChatImage(file, still) {
  if (file.type === 'image/gif' && !still) {
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

attachBtn.addEventListener('click', event => {
  event.stopPropagation();
  if (current && !sendingAudio) attachMenu.classList.toggle('hidden');
});
document.addEventListener('click', event => {
  if (!attachMenu.classList.contains('hidden') && !attachMenu.contains(event.target)) attachMenu.classList.add('hidden');
});
attachAudio.addEventListener('click', () => {
  attachMenu.classList.add('hidden');
  audioInput.click();
});
attachVideo.addEventListener('click', () => {
  attachMenu.classList.add('hidden');
  videoInput.click();
});
attachDoc.addEventListener('click', () => {
  attachMenu.classList.add('hidden');
  docInput.click();
});
videoInput.addEventListener('change', () => {
  const file = videoInput.files[0];
  videoInput.value = '';
  if (file && current && !sendingAudio) sendVideoFile(file);
});
docInput.addEventListener('change', () => {
  const file = docInput.files[0];
  docInput.value = '';
  if (file && current && !sendingAudio) sendDocFile(file);
});
videoViewerClose.addEventListener('click', () => history.back());
stickerSheetScrim.addEventListener('click', closeStickerSheet);
stickerSheetClose.addEventListener('click', closeStickerSheet);
stickerSheetFav.addEventListener('click', saveStickerFavorite);

audioInput.addEventListener('change', () => {
  const file = audioInput.files[0];
  audioInput.value = '';
  if (file && current && !sendingAudio) sendAudioFile(file);
});

chatMenuBtn.addEventListener('click', event => {
  event.stopPropagation();
  chatMenuFilesLabel.textContent = current && current.type === 'group' ? 'Archivos del grupo' : 'Archivos del chat';
  chatMenu.classList.toggle('hidden');
});
document.addEventListener('click', event => {
  if (!chatMenu.classList.contains('hidden') && !chatMenu.contains(event.target)) chatMenu.classList.add('hidden');
});
chatMenuFiles.addEventListener('click', openChatFiles);
chatMenuSearch.addEventListener('click', openChatSearch);
chatMenuClear.addEventListener('click', openClearSheet);
clearSheetScrim.addEventListener('click', closeClearSheet);
clearSheetClose.addEventListener('click', closeClearSheet);
clearSheetConfirm.addEventListener('click', confirmClearChat);
privacySheetScrim.addEventListener('click', closePrivacySheet);
privacySheetClose.addEventListener('click', closePrivacySheet);
privacySheetOk.addEventListener('click', closePrivacySheet);
clearOptions.forEach(option => option.addEventListener('click', () => setClearMode(option.dataset.clearMode)));
chatSearchBack.addEventListener('click', () => {
  if (chatSearchOpen) history.back();
});
chatSearchInput.addEventListener('input', () => {
  clearTimeout(chatSearchTimer);
  chatSearchTimer = setTimeout(runChatSearch, 150);
});
chatSearchInput.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  clearTimeout(chatSearchTimer);
  if (chatSearchIndex === -1) runChatSearch();
  else focusChatSearchHit(chatSearchIndex - 1);
});
chatSearchUp.addEventListener('click', () => focusChatSearchHit(chatSearchIndex - 1));
chatSearchDown.addEventListener('click', () => focusChatSearchHit(chatSearchIndex + 1));
filesBack.addEventListener('click', goBack);
filesChips.addEventListener('click', event => {
  const chip = event.target.closest('.files-chip');
  if (!chip) return;
  filesKind = filesKind === chip.dataset.kind ? '' : chip.dataset.kind;
  renderFiles();
});

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
  const query = new URLSearchParams({ conv: image.convId, caption: imageCaption.value.trim(), w: image.w, h: image.h });
  if (replyTo) query.set('replyTo', replyTo.id);
  try {
    if (!current || current.id !== image.convId || current.sealed !== false) {
      const caption = imageCaption.value.trim();
      const type = image.blob.type || 'image/jpeg';
      await sendSealedMedia(image.convId, 'image', image.blob, { mime: type, ext: IMAGE_MIME_EXT[type] || 'jpg', w: image.w, h: image.h, animated: type === 'image/gif' }, caption);
      if (caption && msgInput.value.trim() === caption) msgInput.value = '';
      history.back();
      return;
    }
    const response = await fetch('/api/send-image?' + query.toString(), {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': image.blob.type || 'image/jpeg' }),
      body: image.blob
    });
    if (response.status === 401) {
      endSession();
      return;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(response.status === 413 ? 'size' : data.error === 'muted' ? 'muted' : 'upload');
    if (imageCaption.value.trim() && msgInput.value.trim() === imageCaption.value.trim()) msgInput.value = '';
    clearReply();
    history.back();
    if (current && current.id === image.convId) renderMessage(data);
  } catch (error) {
    imageSendBtn.disabled = false;
    const message = mediaSendError(error, { big: 'La imagen es demasiado pesada', fail: 'No se pudo enviar la imagen' });
    if (message) showToast(message);
  } finally {
    sendingImage = false;
  }
});

reportBtn.addEventListener('click', openReport);
reportClose.addEventListener('click', () => history.back());
reportText.addEventListener('input', updateReportSend);
reportAttachBtn.addEventListener('click', () => reportInput.click());
reportShotRemove.addEventListener('click', () => setReportShot(null));

reportInput.addEventListener('change', async () => {
  const file = reportInput.files[0];
  reportInput.value = '';
  if (!file) return;
  try {
    const prepared = await prepareChatImage(file, true);
    setReportShot({ data: await readDataUrl(prepared.blob), w: prepared.w, h: prepared.h });
  } catch {
    showToast('No se pudo abrir la imagen');
  }
});

reportForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = reportText.value.trim();
  if (!reportTarget || !text || sendingReport) return;
  sendingReport = true;
  updateReportSend();
  const body = { userId: reportTarget.id, text };
  if (reportShot) {
    body.image = reportShot.data;
    body.w = reportShot.w;
    body.h = reportShot.h;
  }
  try {
    const result = await api('/api/report', body);
    if (!result.ok) throw new Error(result.status === 429 ? 'rate' : result.data && result.data.error === 'noowner' ? 'noowner' : 'upload');
    history.back();
    showToast('Reporte enviado');
  } catch (error) {
    const reason = error && error.message;
    showToast(reason === 'rate' ? 'Has enviado muchos reportes, intenta más tarde' : reason === 'noowner' ? 'No hay a quién enviar el reporte' : 'No se pudo enviar el reporte');
  } finally {
    sendingReport = false;
    updateReportSend();
  }
});

imagePreviewClose.addEventListener('click', () => history.back());
imageViewerClose.addEventListener('click', () => history.back());

sendForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = msgInput.value.trim();
  if (!text || !current) return;
  if (groupMeta.conv === current.id && groupMeta.muted) {
    showToast('Estás silenciado en este grupo');
    return;
  }
  const convId = current.id;
  const sealedChat = current.sealed !== false;
  const body = { text };
  let sealedBody = null;
  if (sealedChat) {
    if (!ZentryE2E.available()) {
      showToast('El cifrado no está listo. Abre Zentry por HTTPS e inténtalo de nuevo');
      return;
    }
    const payload = { text: text.slice(0, 2000) };
    if (replyTo) payload.reply = { id: replyTo.id, uid: replyTo.uid, user: replyTo.user, text: replyPreview(replyTo) };
    const mentions = current.type === 'group' ? findMentions(payload.text) : [];
    if (mentions.length) payload.mentions = mentions;
    try {
      sealedBody = await ZentryE2E.seal(convId, payload);
    } catch {
      showToast('No se pudo cifrar el mensaje, inténtalo de nuevo');
      return;
    }
  } else if (replyTo) {
    body.replyTo = replyTo.id;
  }
  msgInput.value = '';
  hideMentions();
  lastTypingSent = 0;
  clearReply();
  try {
    const result = await api('/api/send?conv=' + encodeURIComponent(convId), sealedBody || body);
    if (result.ok) await ZentryE2E.open(convId, result.data);
    if (result.ok && current && current.id === convId) renderMessage(result.data);
    if (!result.ok && result.data && result.data.error === 'muted') {
      if (!msgInput.value) msgInput.value = text;
      showToast('Estás silenciado en este grupo');
    } else if (!result.ok) {
      if (!msgInput.value) msgInput.value = text;
      showToast('No se pudo enviar el mensaje');
    }
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
      else if (data.error === 'locked') showLoginError('Cuenta bloqueada temporalmente, intenta en ' + Math.max(1, Math.ceil((data.retry || 60) / 60)) + ' min');
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
  fetch('/api/visibility?cid=' + clientId, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
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

sponsorAdd.addEventListener('click', openSponsorNew);
sponsorNewBack.addEventListener('click', goBack);
sponsorNameInput.addEventListener('input', updateSponsorForm);
sponsorUrlInput.addEventListener('input', updateSponsorForm);
sponsorNewBtn.addEventListener('click', createSponsor);
channelExplore.addEventListener('click', openChannelExplore);
channelCreate.addEventListener('click', openNewChannel);
exploreBack.addEventListener('click', goBack);
channelNewBack.addEventListener('click', goBack);
channelNameInput.addEventListener('input', () => {
  channelNewBtn.disabled = !channelNameInput.value.trim();
});
channelNewBtn.addEventListener('click', createChannel);
channelBack.addEventListener('click', goBack);
channelFollowBtn.addEventListener('click', () => {
  if (channelOpenData) followChannel(channelOpenId, !channelOpenData.channel.following);
});
channelDeleteBtn.addEventListener('click', deleteChannel);
channelPostForm.addEventListener('submit', submitChannelPost);

history.replaceState({ v: 'list' }, '', location.pathname);
registerWorker();
if (token) enterApp();
else showLogin();
