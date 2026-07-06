/**
 * TranslateX AI — Main Application
 * Vanilla JS ES6+ | MyMemory API | Web Speech API | LocalStorage
 */

'use strict';

/* ============================================================
   CONSTANTS & CONFIGURATION
   ============================================================ */
// MyMemory: free, no key required, works from file://, 5000 chars/day free
const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
// Lingva Translate: open-source, no key, CORS-friendly (public instances)
const LINGVA_INSTANCES = [
  'https://lingva.ml',
  'https://lingva.thedaviddelta.com',
];
let lingvaIndex = 0;

const DEBOUNCE_DELAY = 800;
const MAX_CHARS = 5000;
const STORAGE_KEYS = {
  history: 'tx_history',
  favorites: 'tx_favorites',
  theme: 'tx_theme',
  settings: 'tx_settings',
  draft: 'tx_draft'
};

/* ============================================================
   LANGUAGE DATABASE (100+ languages)
   ============================================================ */
const LANGUAGES = [
  // Auto detect (source only)
  { code: 'auto', name: 'Auto Detect', flag: '🌐', popular: false },
  // Popular
  { code: 'en', name: 'English', flag: '🇬🇧', popular: true },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', popular: true },
  { code: 'fr', name: 'French', flag: '🇫🇷', popular: true },
  { code: 'de', name: 'German', flag: '🇩🇪', popular: true },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', popular: true },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', popular: true },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', popular: true },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', popular: true },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', popular: true },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', popular: true },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', popular: true },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', popular: true },
  // All others A–Z
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'ca', name: 'Catalan', flag: '🏳️' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'co', name: 'Corsican', flag: '🇫🇷' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'eo', name: 'Esperanto', flag: '🏳️' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fy', name: 'Frisian', flag: '🏴' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'haw', name: 'Hawaiian', flag: '🌺' },
  { code: 'iw', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hmn', name: 'Hmong', flag: '🏳️' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'jw', name: 'Javanese', flag: '🇮🇩' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'ku', name: 'Kurdish', flag: '🏳️' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  { code: 'la', name: 'Latin', flag: '🏛️' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  { code: 'mi', name: 'Maori', flag: '🇳🇿' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'or', name: 'Odia (Oriya)', flag: '🇮🇳' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'sm', name: 'Samoan', flag: '🇼🇸' },
  { code: 'gd', name: 'Scots Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  { code: 'sd', name: 'Sindhi', flag: '🇵🇰' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'su', name: 'Sundanese', flag: '🇮🇩' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'tt', name: 'Tatar', flag: '🏳️' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'tk', name: 'Turkmen', flag: '🇹🇲' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ug', name: 'Uyghur', flag: '🇨🇳' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  { code: 'yi', name: 'Yiddish', flag: '🏳️' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
];

/* ============================================================
   APP STATE
   ============================================================ */
const state = {
  sourceLang: 'auto',
  targetLang: 'en',
  currentDropdown: null, // 'source' | 'target'
  translating: false,
  speaking: false,
  tts: { rate: 1, pitch: 1, volume: 1 },
  autoTranslate: false,
  saveHistory: true,
  recognizing: false,
  recognition: null,
  currentUtterance: null,
  debounceTimer: null,
};

/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applyTheme(getStoredTheme());
  renderPopularLanguages();
  updateHistoryBadge();
  restoreDraft();
  setupKeyboardNav();
  setupNetworkMonitor();
});

/* ============================================================
   THEME MANAGEMENT
   ============================================================ */
function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  const isDark = theme === 'dark';
  const toggle = document.getElementById('darkModeToggle');
  const moon = document.getElementById('moonIcon');
  const sun = document.getElementById('sunIcon');
  const thumb = toggle?.querySelector('.dark-toggle-thumb');
  if (moon) moon.classList.toggle('hidden', !isDark);
  if (sun) sun.classList.toggle('hidden', isDark);
  toggle?.setAttribute('aria-checked', String(isDark));
  if (thumb) {
    thumb.style.left = isDark ? 'calc(100% - 22px)' : '0.125rem';
  }
}

function toggleDarkMode() {
  const current = getStoredTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ============================================================
   NAVIGATION
   ============================================================ */
const SECTION_TITLES = {
  translator: 'Translator',
  history: 'Translation History',
  favorites: 'Favorites',
  'ai-writing': 'AI Writing',
  voice: 'Voice Translation',
  dictionary: 'Dictionary',
  grammar: 'Grammar Checker',
  settings: 'Settings',
  premium: 'Premium Plan',
};

function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.app-section').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });
  // Show target
  const target = document.getElementById(`section-${name}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === name);
    item.setAttribute('aria-current', item.dataset.section === name ? 'page' : 'false');
  });
  // Update top bar title
  const title = document.getElementById('topbarTitle');
  if (title) title.textContent = SECTION_TITLES[name] || name;

  // Section-specific init
  if (name === 'history') renderHistory();
  if (name === 'favorites') renderFavorites();
  closeSidebar();
  closeLangDropdown();
}

function openSidebar() {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.remove('hidden');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.add('hidden');
}

/* ============================================================
   SETTINGS
   ============================================================ */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
    state.autoTranslate = s.autoTranslate || false;
    state.saveHistory = s.saveHistory !== false;
    const at = document.getElementById('autoTranslateToggle');
    const sh = document.getElementById('saveHistoryToggle');
    if (at) at.checked = state.autoTranslate;
    if (sh) sh.checked = state.saveHistory;
  } catch {}
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({
    autoTranslate: state.autoTranslate,
    saveHistory: state.saveHistory,
  }));
}

function toggleAutoTranslate(val) {
  state.autoTranslate = val;
  saveSettings();
  showToast(val ? 'Auto-translate enabled' : 'Auto-translate disabled', 'info');
}

function toggleSaveHistory(val) {
  state.saveHistory = val;
  saveSettings();
  showToast(val ? 'History saving enabled' : 'History saving disabled', 'info');
}

function exportData() {
  const data = {
    history: getHistory(),
    favorites: getFavorites(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `translatex-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported successfully!', 'success');
}

function clearAllData() {
  if (!confirm('This will clear all history, favorites, and settings. Continue?')) return;
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  state.autoTranslate = false;
  state.saveHistory = true;
  loadSettings();
  updateHistoryBadge();
  showToast('All data cleared', 'success');
}

/* ============================================================
   LANGUAGE SELECTOR
   ============================================================ */
function getLangByCode(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
}

function updateLangButton(side, code) {
  const lang = getLangByCode(code);
  const flag = document.getElementById(`${side}LangFlag`);
  const name = document.getElementById(`${side}LangName`);
  if (flag) flag.textContent = lang.flag;
  if (name) name.textContent = lang.name;
}

function openLangDropdown(side) {
  if (state.currentDropdown === side) { closeLangDropdown(); return; }
  state.currentDropdown = side;

  const btn = document.getElementById(`${side}LangBtn`);
  const dropdown = document.getElementById('langDropdown');
  if (!btn || !dropdown) return;

  const rect = btn.getBoundingClientRect();
  dropdown.style.top = `${rect.bottom + window.scrollY + 6}px`;
  dropdown.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 320)}px`;

  renderLangList('', side);
  dropdown.classList.remove('hidden');

  const searchInput = document.getElementById('langSearchInput');
  if (searchInput) { searchInput.value = ''; searchInput.focus(); }

  setTimeout(() => {
    document.addEventListener('click', outsideLangClick, { once: true });
  }, 0);
}

function outsideLangClick(e) {
  const dd = document.getElementById('langDropdown');
  const srcBtn = document.getElementById('sourceLangBtn');
  const tgtBtn = document.getElementById('targetLangBtn');
  if (dd && !dd.contains(e.target) && e.target !== srcBtn && e.target !== tgtBtn && !srcBtn?.contains(e.target) && !tgtBtn?.contains(e.target)) {
    closeLangDropdown();
  } else if (!dd?.classList.contains('hidden')) {
    document.addEventListener('click', outsideLangClick, { once: true });
  }
}

function closeLangDropdown() {
  document.getElementById('langDropdown')?.classList.add('hidden');
  state.currentDropdown = null;
}

function filterLanguages(query) {
  renderLangList(query, state.currentDropdown);
}

function renderLangList(query, side) {
  const list = document.getElementById('langDropdownList');
  if (!list) return;
  const q = query.toLowerCase().trim();

  const isSource = side === 'source';
  let filtered = LANGUAGES.filter(l => {
    if (!isSource && l.code === 'auto') return false;
    return !q || l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  });

  if (!q) {
    // Sections: Auto (source only), Popular, All
    const groups = [];
    if (isSource) {
      groups.push({ label: 'Auto', items: filtered.filter(l => l.code === 'auto') });
    }
    groups.push({ label: 'Popular', items: filtered.filter(l => l.popular && l.code !== 'auto') });
    groups.push({ label: 'All Languages', items: filtered.filter(l => !l.popular && l.code !== 'auto') });

    list.innerHTML = groups.map(g => g.items.length === 0 ? '' : `
      <div class="lang-group-label">${g.label}</div>
      ${g.items.map(l => langOptionHTML(l, side)).join('')}
    `).join('');
  } else {
    list.innerHTML = filtered.length
      ? filtered.map(l => langOptionHTML(l, side)).join('')
      : '<div class="lang-group-label py-4">No languages found</div>';
  }
}

function langOptionHTML(lang, side) {
  const current = side === 'source' ? state.sourceLang : state.targetLang;
  const isActive = lang.code === current;
  return `<div class="lang-option${isActive ? ' active' : ''}" role="option" aria-selected="${isActive}" onclick="selectLanguage('${side}','${lang.code}')">
    <span style="font-size:1.15em">${lang.flag}</span>
    <span>${sanitizeHTML(lang.name)}</span>
    ${isActive ? '<svg style="margin-left:auto;flex-shrink:0" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>' : ''}
  </div>`;
}

function selectLanguage(side, code) {
  if (side === 'source') {
    state.sourceLang = code;
    updateLangButton('source', code);
  } else {
    state.targetLang = code;
    updateLangButton('target', code);
  }
  closeLangDropdown();
  if (state.autoTranslate) translateText();
}

/* ============================================================
   SOURCE TEXT HANDLING
   ============================================================ */
function handleSourceInput() {
  const ta = document.getElementById('sourceText');
  if (!ta) return;
  const text = ta.value;
  const len = text.length;

  // Counters
  document.getElementById('charCount').textContent = len;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  document.getElementById('wordCount').textContent = words;

  // Limit warning
  const warning = document.getElementById('charLimitWarning');
  if (warning) warning.classList.toggle('hidden', len < MAX_CHARS);

  // Clear placeholder
  const placeholder = document.getElementById('translatePlaceholder');
  if (placeholder) placeholder.style.display = text ? 'none' : '';

  // Auto save draft
  localStorage.setItem(STORAGE_KEYS.draft, text);

  // Auto translate with debounce
  if (state.autoTranslate && text.trim()) {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(translateText, DEBOUNCE_DELAY);
  }
}

function restoreDraft() {
  const draft = localStorage.getItem(STORAGE_KEYS.draft) || '';
  const ta = document.getElementById('sourceText');
  if (ta && draft) {
    ta.value = draft;
    handleSourceInput();
  }
}

function clearSourceText() {
  const ta = document.getElementById('sourceText');
  if (ta) ta.value = '';
  handleSourceInput();
  const translatedDiv = document.getElementById('translatedText');
  if (translatedDiv) translatedDiv.textContent = '';
  const placeholder = document.getElementById('translatePlaceholder');
  if (placeholder) placeholder.style.display = '';
  localStorage.removeItem(STORAGE_KEYS.draft);
}

async function pasteText() {
  try {
    if (!navigator.clipboard) { showToast('Clipboard not available', 'error'); return; }
    const text = await navigator.clipboard.readText();
    const ta = document.getElementById('sourceText');
    if (ta) {
      ta.value = text.substring(0, MAX_CHARS);
      handleSourceInput();
      showToast('Text pasted!', 'success');
    }
  } catch {
    showToast('Could not access clipboard', 'error');
  }
}

function uploadTextFile() {
  document.getElementById('fileInput')?.click();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.name.match(/\.(txt|md)$/i)) { showToast('Only .txt and .md files supported', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const ta = document.getElementById('sourceText');
    if (ta) {
      ta.value = (e.target.result || '').substring(0, MAX_CHARS);
      handleSourceInput();
      showToast(`File "${sanitizeHTML(file.name)}" loaded!`, 'success');
    }
  };
  reader.onerror = () => showToast('Failed to read file', 'error');
  reader.readAsText(file);
  event.target.value = '';
}

function handleDrop(event) {
  event.preventDefault();
  const panel = document.querySelector('.source-panel');
  if (panel) panel.classList.remove('drag-over');
  const text = event.dataTransfer.getData('text');
  if (text) {
    const ta = document.getElementById('sourceText');
    if (ta) { ta.value = text.substring(0, MAX_CHARS); handleSourceInput(); }
    return;
  }
  const file = event.dataTransfer.files[0];
  if (file) {
    const fakeEvent = { target: { files: [file], value: '' } };
    handleFileUpload(fakeEvent);
  }
}

/* ============================================================
   TRANSLATION ENGINE
   Primary:  MyMemory API   (free, no key, works from file://)
   Fallback: Lingva API     (open-source, CORS-friendly)
   ============================================================ */
async function translateText() {
  const ta = document.getElementById('sourceText');
  if (!ta) return;
  const text = ta.value.trim();
  if (!text) { showToast('Please enter some text to translate', 'warning'); return; }
  if (!state.targetLang || state.targetLang === 'auto') {
    showToast('Please select a target language', 'warning'); return;
  }
  if (state.translating) return;

  const srcLang = state.sourceLang === 'auto' ? 'auto' : state.sourceLang;
  if (srcLang !== 'auto' && srcLang === state.targetLang) {
    showToast('Source and target languages are the same', 'warning'); return;
  }

  state.translating = true;
  setTranslateLoading(true);

  try {
    const result = await callMyMemory(text, srcLang, state.targetLang);
    displayTranslation(result);
    if (state.saveHistory) saveToHistory(text, result, srcLang, state.targetLang);
    showToast('Translation complete!', 'success');
  } catch (err) {
    // Fallback to Lingva
    try {
      const result = await callLingva(text, srcLang === 'auto' ? 'en' : srcLang, state.targetLang);
      displayTranslation(result);
      if (state.saveHistory) saveToHistory(text, result, srcLang, state.targetLang);
      showToast('Translation complete!', 'success');
    } catch {
      showToast('Translation failed. Check your internet connection and try again.', 'error');
    }
  } finally {
    state.translating = false;
    setTranslateLoading(false);
  }
}

/**
 * MyMemory Free API — https://mymemory.translated.net
 * No API key. CORS open. Supports 100+ languages.
 * Limit: 5000 chars/day anonymous (generous for casual use).
 */
async function callMyMemory(text, sourceLang, targetLang) {
  // MyMemory uses "en|fr" style langpair; auto-detect = just target
  const src = sourceLang === 'auto' ? '' : normalizeCode(sourceLang);
  const tgt = normalizeCode(targetLang);
  const langpair = src ? `${src}|${tgt}` : `autodetect|${tgt}`;

  // Split long text into 500-char chunks to stay within limits
  const chunks = splitIntoChunks(text, 500);
  const translated = [];

  for (const chunk of chunks) {
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent(langpair)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
    const data = await res.json();
    if (data.responseStatus !== 200 && data.responseStatus !== '200') {
      throw new Error(data.responseDetails || 'MyMemory error');
    }
    translated.push(data.responseData.translatedText);
  }

  return translated.join(' ');
}

/**
 * Lingva Translate API — open-source, no key required.
 * Fallback when MyMemory is unavailable.
 */
async function callLingva(text, sourceLang, targetLang) {
  const src = normalizeCode(sourceLang) || 'en';
  const tgt = normalizeCode(targetLang);
  const baseUrl = LINGVA_INSTANCES[lingvaIndex % LINGVA_INSTANCES.length];
  const url = `${baseUrl}/api/v1/${encodeURIComponent(src)}/${encodeURIComponent(tgt)}/${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) {
    lingvaIndex++;
    throw new Error(`Lingva HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.translation) throw new Error('No translation from Lingva');
  return data.translation;
}

/** Normalize language codes to 2-letter ISO where needed */
function normalizeCode(code) {
  if (!code || code === 'auto') return '';
  // MyMemory prefers simple 2-letter codes
  const map = { 'zh-TW': 'zh-TW', 'iw': 'he', 'jw': 'jv', 'ceb': 'ceb',
    'hmn': 'hmn', 'haw': 'haw', 'ny': 'ny', 'rw': 'rw' };
  return map[code] || code.split('-')[0];
}

/** Split text into chunks without cutting words */
function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    // Try to cut at sentence boundary first, then word boundary
    if (end < text.length) {
      const sentEnd = text.lastIndexOf('. ', end);
      const wordEnd = text.lastIndexOf(' ', end);
      end = sentEnd > start ? sentEnd + 1 : (wordEnd > start ? wordEnd : end);
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

function displayTranslation(text) {
  const div = document.getElementById('translatedText');
  const placeholder = document.getElementById('translatePlaceholder');
  if (div) div.textContent = text;
  if (placeholder) placeholder.style.display = 'none';
}

function setTranslateLoading(loading) {
  const btn = document.getElementById('translateBtn');
  const icon = document.getElementById('translateBtnIcon');
  const txt = document.getElementById('translateBtnText');
  const skeleton = document.getElementById('translateSkeleton');
  const output = document.getElementById('translatedText');
  if (loading) {
    if (btn) btn.disabled = true;
    if (icon) icon.innerHTML = '<div class="spinner"></div>';
    if (txt) txt.textContent = 'Translating…';
    if (skeleton) skeleton.classList.remove('hidden');
    if (output) output.textContent = '';
  } else {
    if (btn) btn.disabled = false;
    if (icon) icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"/></svg>';
    if (txt) txt.textContent = 'Translate';
    if (skeleton) skeleton.classList.add('hidden');
  }
}

/* ============================================================
   SWAP LANGUAGES
   ============================================================ */
function swapLanguages() {
  // Don't swap if source is auto
  const ta = document.getElementById('sourceText');
  const td = document.getElementById('translatedText');
  const srcText = ta?.value || '';
  const tgtText = td?.textContent || '';

  if (state.sourceLang === 'auto') {
    // Just swap, use en as new source
    const oldTarget = state.targetLang;
    state.targetLang = 'en';
    state.sourceLang = oldTarget;
  } else {
    [state.sourceLang, state.targetLang] = [state.targetLang, state.sourceLang];
  }

  updateLangButton('source', state.sourceLang);
  updateLangButton('target', state.targetLang);

  if (ta && tgtText) {
    ta.value = tgtText;
    handleSourceInput();
  }
  if (td) { td.textContent = srcText; }

  const btn = document.getElementById('swapBtn');
  if (btn) {
    btn.style.transform = 'rotate(180deg)';
    setTimeout(() => { btn.style.transform = ''; }, 350);
  }
}

/* ============================================================
   COPY, DOWNLOAD, SHARE
   ============================================================ */
function getTranslatedText() {
  return document.getElementById('translatedText')?.textContent?.trim() || '';
}

function copyTranslation() {
  const text = getTranslatedText();
  if (!text) { showToast('Nothing to copy', 'warning'); return; }
  navigator.clipboard?.writeText(text).then(() => {
    showToast('Copied successfully!', 'success');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied successfully!', 'success');
  });
}

function downloadTxt() {
  const text = getTranslatedText();
  if (!text) { showToast('Nothing to download', 'warning'); return; }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `translation_${Date.now()}.txt`);
  showToast('Downloaded as TXT', 'success');
}

function downloadPdf() {
  const text = getTranslatedText();
  if (!text) { showToast('Nothing to download', 'warning'); return; }
  // Generate simple HTML-based PDF via print
  const win = window.open('', '_blank');
  const srcLang = getLangByCode(state.sourceLang).name;
  const tgtLang = getLangByCode(state.targetLang).name;
  const src = document.getElementById('sourceText')?.value || '';
  win.document.write(`<!DOCTYPE html><html><head><title>TranslateX Translation</title>
    <style>body{font-family:Inter,sans-serif;max-width:700px;margin:40px auto;line-height:1.7;}
    h1{color:#6c63ff;}h3{color:#555;}p{white-space:pre-wrap;}</style></head><body>
    <h1>TranslateX AI Translation</h1>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    <h3>Source (${sanitizeHTML(srcLang)})</h3><p>${sanitizeHTML(src)}</p>
    <h3>Translation (${sanitizeHTML(tgtLang)})</h3><p>${sanitizeHTML(text)}</p>
    </body></html>`);
  win.document.close();
  win.print();
  showToast('PDF ready to print/save', 'success');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function shareTranslation() {
  const text = getTranslatedText();
  if (!text) { showToast('Nothing to share', 'warning'); return; }
  if (navigator.share) {
    navigator.share({ title: 'TranslateX Translation', text }).catch(() => {});
  } else {
    copyTranslation();
    showToast('Link copied to clipboard!', 'info');
  }
}

/* ============================================================
   TEXT-TO-SPEECH
   ============================================================ */
function speakTranslation() {
  const text = getTranslatedText();
  if (!text) { showToast('Nothing to speak', 'warning'); return; }
  if (!window.speechSynthesis) { showToast('TTS not supported in your browser', 'error'); return; }

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.targetLang !== 'auto' ? state.targetLang : 'en';
  utterance.rate = state.tts.rate;
  utterance.pitch = state.tts.pitch;
  utterance.volume = state.tts.volume;

  utterance.onstart = () => {
    state.speaking = true;
    document.getElementById('speakBtn')?.classList.add('hidden');
    document.getElementById('stopSpeakBtn')?.classList.remove('hidden');
    document.getElementById('ttsControls')?.classList.remove('hidden');
  };
  utterance.onend = utterance.onerror = () => {
    state.speaking = false;
    document.getElementById('speakBtn')?.classList.remove('hidden');
    document.getElementById('stopSpeakBtn')?.classList.add('hidden');
  };

  state.currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  speechSynthesis.cancel();
  state.speaking = false;
  document.getElementById('speakBtn')?.classList.remove('hidden');
  document.getElementById('stopSpeakBtn')?.classList.add('hidden');
}

function closeTtsControls() {
  stopSpeaking();
  document.getElementById('ttsControls')?.classList.add('hidden');
}

function updateTtsSpeed(val) {
  state.tts.rate = parseFloat(val);
  document.getElementById('ttsSpeedVal').textContent = `${parseFloat(val).toFixed(1)}×`;
  if (state.currentUtterance) state.currentUtterance.rate = state.tts.rate;
}

function updateTtsPitch(val) {
  state.tts.pitch = parseFloat(val);
  document.getElementById('ttsPitchVal').textContent = parseFloat(val).toFixed(1);
}

function updateTtsVolume(val) {
  state.tts.volume = parseFloat(val);
  document.getElementById('ttsVolumeVal').textContent = `${Math.round(parseFloat(val) * 100)}%`;
}

/* ============================================================
   VOICE INPUT (Web Speech API)
   ============================================================ */
function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast('Voice input not supported in your browser', 'error'); return; }

  if (state.recognizing) {
    state.recognition?.stop();
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.sourceLang !== 'auto' ? state.sourceLang : 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  state.recognition = recognition;

  const btn = document.getElementById('voiceInputBtn');

  recognition.onstart = () => {
    state.recognizing = true;
    if (btn) btn.classList.add('voice-active');
    showToast('Listening… Speak now', 'info');
  };

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
    const ta = document.getElementById('sourceText');
    if (ta) { ta.value = transcript.substring(0, MAX_CHARS); handleSourceInput(); }
  };

  recognition.onend = () => {
    state.recognizing = false;
    if (btn) btn.classList.remove('voice-active');
    if (state.autoTranslate) translateText();
  };

  recognition.onerror = (e) => {
    state.recognizing = false;
    if (btn) btn.classList.remove('voice-active');
    const msgs = { 'no-speech': 'No speech detected', 'audio-capture': 'Microphone not available', 'not-allowed': 'Microphone permission denied' };
    showToast(msgs[e.error] || 'Voice input error', 'error');
  };

  recognition.start();
}

/* ============================================================
   VOICE TRANSLATION SECTION
   ============================================================ */
function startVoiceTranslation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast('Voice input not supported in your browser', 'error'); return; }

  if (state.recognizing) {
    state.recognition?.stop();
    return;
  }

  const micBtn = document.getElementById('voiceMicBtn');
  const status = document.getElementById('voiceStatus');
  const transcript = document.getElementById('voiceTranscript');
  const result = document.getElementById('voiceTranslationResult');

  const recognition = new SpeechRecognition();
  recognition.lang = state.sourceLang !== 'auto' ? state.sourceLang : 'en-US';
  recognition.interimResults = true;
  state.recognition = recognition;

  recognition.onstart = () => {
    state.recognizing = true;
    micBtn?.classList.add('recording');
    if (status) status.textContent = '🎙️ Listening… speak now';
    if (transcript) { transcript.textContent = ''; transcript.classList.remove('hidden'); }
    if (result) result.classList.add('hidden');
  };

  recognition.onresult = (e) => {
    const text = Array.from(e.results).map(r => r[0].transcript).join('');
    if (transcript) transcript.textContent = text;
  };

  recognition.onend = async () => {
    state.recognizing = false;
    micBtn?.classList.remove('recording');
    if (status) status.textContent = 'Translating…';
    const text = transcript?.textContent;
    if (text) {
      try {
        const translated = await callMyMemory(text, state.sourceLang, state.targetLang);
        if (result) { result.textContent = translated; result.classList.remove('hidden'); }
        if (status) status.textContent = 'Done! Click to record again';
        if (state.saveHistory) saveToHistory(text, translated, state.sourceLang, state.targetLang);
      } catch {
        // try fallback
        try {
          const src = state.sourceLang === 'auto' ? 'en' : state.sourceLang;
          const translated = await callLingva(text, src, state.targetLang);
          if (result) { result.textContent = translated; result.classList.remove('hidden'); }
          if (status) status.textContent = 'Done! Click to record again';
          if (state.saveHistory) saveToHistory(text, translated, state.sourceLang, state.targetLang);
        } catch {
          if (status) status.textContent = 'Translation failed. Click to try again';
          showToast('Voice translation failed', 'error');
        }
      }
    } else {
      if (status) status.textContent = 'No speech detected. Click to try again';
    }
  };

  recognition.onerror = (e) => {
    state.recognizing = false;
    micBtn?.classList.remove('recording');
    const msgs = { 'no-speech': 'No speech detected', 'audio-capture': 'Microphone not available', 'not-allowed': 'Microphone permission denied' };
    if (status) status.textContent = msgs[e.error] || 'Error. Click to try again';
  };

  recognition.start();
}

/* ============================================================
   POPULAR LANGUAGES CHIPS
   ============================================================ */
function renderPopularLanguages() {
  const container = document.getElementById('popularLangs');
  if (!container) return;
  const popular = LANGUAGES.filter(l => l.popular && l.code !== 'auto').slice(0, 16);
  container.innerHTML = popular.map(l =>
    `<button class="lang-chip transition-all" onclick="selectPopularLang('${l.code}')" aria-label="Select ${l.name}">
      <span>${l.flag}</span><span>${l.name}</span>
    </button>`
  ).join('');
}

function selectPopularLang(code) {
  state.targetLang = code;
  updateLangButton('target', code);
  showToast(`Target: ${getLangByCode(code).name}`, 'info');
  if (document.getElementById('sourceText')?.value.trim() && state.autoTranslate) translateText();
}

/* ============================================================
   HISTORY
   ============================================================ */
function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]'); } catch { return []; }
}

function saveToHistory(source, translated, srcLang, tgtLang) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    source: source.substring(0, 500),
    translated: translated.substring(0, 500),
    srcLang,
    tgtLang,
    date: new Date().toISOString(),
  };
  history.unshift(entry);
  // Keep last 100
  const trimmed = history.slice(0, 100);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(trimmed));
  updateHistoryBadge();
}

function updateHistoryBadge() {
  const h = getHistory();
  const badge = document.getElementById('historyBadge');
  if (!badge) return;
  if (h.length > 0) {
    badge.textContent = h.length > 99 ? '99+' : h.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderHistory(filter = '') {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');
  if (!list || !empty) return;

  let history = getHistory();
  if (filter) {
    const q = filter.toLowerCase();
    history = history.filter(h => h.source.toLowerCase().includes(q) || h.translated.toLowerCase().includes(q));
  }

  if (history.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    empty.style.display = 'flex';
    return;
  }

  empty.classList.add('hidden');
  empty.style.display = '';
  list.innerHTML = history.map(h => historyCardHTML(h)).join('');
}

function historyCardHTML(h) {
  const srcLang = getLangByCode(h.srcLang);
  const tgtLang = getLangByCode(h.tgtLang);
  const dateStr = new Date(h.date).toLocaleString();
  return `<div class="history-card" id="hcard-${h.id}">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-base">${srcLang.flag}</span>
        <span class="text-xs opacity-60 font-medium">${sanitizeHTML(srcLang.name)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="opacity-40"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        <span class="text-base">${tgtLang.flag}</span>
        <span class="text-xs opacity-60 font-medium">${sanitizeHTML(tgtLang.name)}</span>
      </div>
      <span class="text-xs opacity-40 whitespace-nowrap">${dateStr}</span>
    </div>
    <div class="text-sm mb-1 font-medium">${sanitizeHTML(h.source.substring(0, 150))}${h.source.length > 150 ? '…' : ''}</div>
    <div class="text-sm opacity-70 mb-3">${sanitizeHTML(h.translated.substring(0, 150))}${h.translated.length > 150 ? '…' : ''}</div>
    <div class="flex items-center gap-2">
      <button onclick="reuseHistoryItem(${h.id})" class="panel-action-btn px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/></svg>
        Reuse
      </button>
      <button onclick="favoriteHistoryItem(${h.id})" class="panel-action-btn px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>
        Favorite
      </button>
      <button onclick="deleteHistoryItem(${h.id})" class="panel-action-btn px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5" style="margin-left:auto">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
        Delete
      </button>
    </div>
  </div>`;
}

function reuseHistoryItem(id) {
  const h = getHistory().find(x => x.id === id);
  if (!h) return;
  state.sourceLang = h.srcLang;
  state.targetLang = h.tgtLang;
  updateLangButton('source', h.srcLang);
  updateLangButton('target', h.tgtLang);
  const ta = document.getElementById('sourceText');
  if (ta) { ta.value = h.source; handleSourceInput(); }
  displayTranslation(h.translated);
  showSection('translator');
  showToast('Translation loaded!', 'success');
}

function favoriteHistoryItem(id) {
  const h = getHistory().find(x => x.id === id);
  if (!h) return;
  saveFavoriteItem(h);
}

function deleteHistoryItem(id) {
  let history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  updateHistoryBadge();
  document.getElementById(`hcard-${id}`)?.remove();
  if (history.length === 0) {
    document.getElementById('historyEmpty')?.classList.remove('hidden');
    document.getElementById('historyEmpty').style.display = 'flex';
  }
}

function filterHistory(q) { renderHistory(q); }

function clearAllHistory() {
  if (!confirm('Delete all translation history?')) return;
  localStorage.removeItem(STORAGE_KEYS.history);
  updateHistoryBadge();
  renderHistory();
  showToast('History cleared', 'success');
}

/* ============================================================
   FAVORITES
   ============================================================ */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]'); } catch { return []; }
}

function saveFavoriteItem(item) {
  const favs = getFavorites();
  // Avoid duplicates
  if (favs.some(f => f.source === item.source && f.translated === item.translated)) {
    showToast('Already in favorites', 'warning'); return;
  }
  favs.unshift({ ...item, id: Date.now(), favDate: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favs.slice(0, 200)));
  showToast('Saved to favorites!', 'success');
}

function saveFavorite() {
  const source = document.getElementById('sourceText')?.value?.trim();
  const translated = getTranslatedText();
  if (!source || !translated) { showToast('Nothing to save', 'warning'); return; }
  saveFavoriteItem({
    source,
    translated,
    srcLang: state.sourceLang,
    tgtLang: state.targetLang,
    date: new Date().toISOString(),
  });
}

function renderFavorites() {
  const list = document.getElementById('favoritesList');
  const empty = document.getElementById('favoritesEmpty');
  if (!list || !empty) return;
  const favs = getFavorites();
  if (favs.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    empty.style.display = 'flex';
    return;
  }
  empty.classList.add('hidden');
  empty.style.display = '';
  list.innerHTML = favs.map(h => favoriteCardHTML(h)).join('');
}

function favoriteCardHTML(h) {
  const srcLang = getLangByCode(h.srcLang);
  const tgtLang = getLangByCode(h.tgtLang);
  const dateStr = new Date(h.favDate || h.date).toLocaleString();
  return `<div class="history-card" id="fcard-${h.id}">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-base">${srcLang.flag}</span>
        <span class="text-xs opacity-60 font-medium">${sanitizeHTML(srcLang.name)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="opacity-40"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        <span class="text-base">${tgtLang.flag}</span>
        <span class="text-xs opacity-60 font-medium">${sanitizeHTML(tgtLang.name)}</span>
      </div>
      <span class="text-xs opacity-40 whitespace-nowrap">${dateStr}</span>
    </div>
    <div class="text-sm mb-1 font-medium">${sanitizeHTML(h.source.substring(0, 150))}${h.source.length > 150 ? '…' : ''}</div>
    <div class="text-sm opacity-70 mb-3">${sanitizeHTML(h.translated.substring(0, 150))}${h.translated.length > 150 ? '…' : ''}</div>
    <div class="flex items-center gap-2">
      <button onclick="reuseHistoryItem(${h.id})" class="panel-action-btn px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="currentColor"/></svg>
        Reuse
      </button>
      <button onclick="deleteFavoriteItem(${h.id})" class="panel-action-btn px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5" style="margin-left:auto">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
        Remove
      </button>
    </div>
  </div>`;
}

function deleteFavoriteItem(id) {
  let favs = getFavorites().filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favs));
  document.getElementById(`fcard-${id}`)?.remove();
  if (favs.length === 0) {
    document.getElementById('favoritesEmpty')?.classList.remove('hidden');
    document.getElementById('favoritesEmpty').style.display = 'flex';
  }
  showToast('Removed from favorites', 'info');
}

/* ============================================================
   AI WRITING TOOLS
   ============================================================ */
async function applyAiTool(tool) {
  const input = document.getElementById('aiWritingInput')?.value?.trim();
  if (!input) { showToast('Please enter some text first', 'warning'); return; }

  const outputWrap = document.getElementById('aiWritingOutput');
  const outputText = document.getElementById('aiOutputText');
  if (outputWrap) outputWrap.classList.remove('hidden');
  if (outputText) outputText.textContent = 'Processing…';

  try {
    const result = await transformTextLocally(input, tool);
    if (outputText) outputText.textContent = result;
    showToast('AI tool applied!', 'success');
  } catch {
    if (outputText) outputText.textContent = '';
    if (outputWrap) outputWrap.classList.add('hidden');
    showToast('AI tool failed', 'error');
  }
}

function transformTextLocally(text, tool) {
  // Client-side text transformations (no external AI API needed)
  return new Promise(resolve => {
    setTimeout(() => {
      let result = text;
      switch (tool) {
        case 'rewrite':
          result = rewriteText(text);
          break;
        case 'grammar':
          result = fixBasicGrammar(text);
          break;
        case 'professional':
          result = applyProfessionalTone(text);
          break;
        case 'friendly':
          result = applyFriendlyTone(text);
          break;
        case 'formal':
          result = applyFormalTone(text);
          break;
        case 'academic':
          result = applyAcademicTone(text);
          break;
        case 'shorten':
          result = shortenText(text);
          break;
        case 'expand':
          result = expandText(text);
          break;
      }
      resolve(result);
    }, 600);
  });
}

function rewriteText(t) {
  // Simple synonym substitution & restructuring
  const subs = [
    [/\bvery\b/gi, 'extremely'], [/\bgood\b/gi, 'excellent'], [/\bbad\b/gi, 'poor'],
    [/\bbig\b/gi, 'large'], [/\bsmall\b/gi, 'compact'], [/\bfast\b/gi, 'rapid'],
    [/\bslow\b/gi, 'gradual'], [/\bstart\b/gi, 'commence'], [/\bend\b/gi, 'conclude'],
    [/\buse\b/gi, 'utilize'], [/\bshow\b/gi, 'demonstrate'], [/\bhelp\b/gi, 'assist'],
    [/\bget\b/gi, 'obtain'], [/\bmake\b/gi, 'create'], [/\bneed\b/gi, 'require'],
  ];
  let result = t;
  subs.forEach(([from, to]) => { result = result.replace(from, to); });
  return result;
}

function fixBasicGrammar(t) {
  let result = t;
  // Capitalize first letter of sentences
  result = result.replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, m => m.toUpperCase());
  // Fix common errors
  result = result.replace(/\bi\b/g, 'I');
  result = result.replace(/\s+([.,!?;:])/g, '$1');
  result = result.replace(/([.!?])(?=[A-Z])/g, '$1 ');
  return result.trim();
}

function applyProfessionalTone(t) {
  const opening = 'Please note the following:\n\n';
  const closing = '\n\nThank you for your attention to this matter.';
  let result = fixBasicGrammar(t);
  return opening + result + closing;
}

function applyFriendlyTone(t) {
  const opening = 'Hey there! ';
  const closing = ' Hope that helps! 😊';
  return opening + t + closing;
}

function applyFormalTone(t) {
  let result = fixBasicGrammar(t);
  result = result.replace(/\bcan't\b/gi, 'cannot').replace(/\bwon't\b/gi, 'will not')
    .replace(/\bdon't\b/gi, 'do not').replace(/\bisn't\b/gi, 'is not')
    .replace(/\baren't\b/gi, 'are not').replace(/\bwasn't\b/gi, 'was not');
  return result;
}

function applyAcademicTone(t) {
  const opening = 'This analysis examines the following: ';
  let result = fixBasicGrammar(applyFormalTone(t));
  return opening + result + ' Further research may be warranted to substantiate these findings.';
}

function shortenText(t) {
  const sentences = t.split(/[.!?]+/).filter(s => s.trim());
  const shortened = sentences.slice(0, Math.max(1, Math.ceil(sentences.length * 0.6)));
  return shortened.join('. ').trim() + (shortened.length < sentences.length ? '.' : '');
}

function expandText(t) {
  const sentences = t.split(/[.!?]+/).filter(s => s.trim());
  const expanded = sentences.map(s => {
    const additions = [
      ' This is an important consideration.',
      ' It is worth noting that this aspect plays a significant role.',
      ' This point deserves careful attention.',
      ' One should also consider the broader implications of this.',
    ];
    return s.trim() + additions[Math.floor(Math.random() * additions.length)];
  });
  return expanded.join(' ');
}

function copyAiOutput() {
  const text = document.getElementById('aiOutputText')?.textContent?.trim();
  if (!text) return;
  navigator.clipboard?.writeText(text).then(() => showToast('Copied!', 'success'));
}

/* ============================================================
   DICTIONARY
   ============================================================ */
async function searchDictionary() {
  const input = document.getElementById('dictionaryInput');
  const word = input?.value?.trim();
  if (!word) { showToast('Please enter a word', 'warning'); return; }
  if (word.split(/\s+/).length > 2) { showToast('Dictionary works best with single words', 'info'); }

  const result = document.getElementById('dictionaryResult');
  const empty = document.getElementById('dictionaryEmpty');
  if (result) result.classList.add('hidden');
  if (empty) empty.classList.remove('hidden');

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('Word not found');
    const data = await res.json();
    renderDictionaryResult(data[0]);
    if (empty) empty.classList.add('hidden');
    if (result) result.classList.remove('hidden');
  } catch (err) {
    showToast(err.message === 'Word not found' ? `"${word}" not found in dictionary` : 'Dictionary lookup failed', 'error');
  }
}

function renderDictionaryResult(entry) {
  const wordEl = document.getElementById('dictWord');
  const pronEl = document.getElementById('dictPronunciation');
  const meaningEl = document.getElementById('dictMeaningText');
  const synWrap = document.getElementById('dictSynonyms');
  const synEl = document.getElementById('dictSynonymsText');
  const antWrap = document.getElementById('dictAntonyms');
  const antEl = document.getElementById('dictAntonymsText');

  if (wordEl) wordEl.textContent = entry.word;

  // Pronunciation
  const pron = entry.phonetics?.find(p => p.text)?.text || '';
  if (pronEl) pronEl.textContent = pron ? `/${pron}/` : '';

  // Meanings
  const meanings = entry.meanings || [];
  if (meaningEl) {
    meaningEl.innerHTML = meanings.slice(0, 3).map(m =>
      `<div class="mb-3">
        <span class="text-xs font-bold opacity-60 italic">${sanitizeHTML(m.partOfSpeech)}</span>
        <ol class="list-decimal list-inside mt-1 space-y-1">
          ${m.definitions.slice(0, 3).map(d =>
            `<li class="text-sm leading-relaxed">${sanitizeHTML(d.definition)}
            ${d.example ? `<div class="text-xs italic opacity-60 mt-0.5">"${sanitizeHTML(d.example)}"</div>` : ''}
            </li>`
          ).join('')}
        </ol>
      </div>`
    ).join('');
  }

  // Synonyms & Antonyms
  const allSyns = meanings.flatMap(m => m.definitions.flatMap(d => d.synonyms || [])).slice(0, 10);
  const allAnts = meanings.flatMap(m => m.definitions.flatMap(d => d.antonyms || [])).slice(0, 10);

  if (synWrap && synEl) {
    if (allSyns.length) {
      synEl.innerHTML = allSyns.map(s => `<span class="dict-tag">${sanitizeHTML(s)}</span>`).join('');
      synWrap.classList.remove('hidden');
    } else { synWrap.classList.add('hidden'); }
  }
  if (antWrap && antEl) {
    if (allAnts.length) {
      antEl.innerHTML = allAnts.map(a => `<span class="dict-tag">${sanitizeHTML(a)}</span>`).join('');
      antWrap.classList.remove('hidden');
    } else { antWrap.classList.add('hidden'); }
  }
}

/* ============================================================
   GRAMMAR CHECKER
   ============================================================ */
function checkGrammar() {
  const input = document.getElementById('grammarInput')?.value?.trim();
  if (!input) { showToast('Please enter some text', 'warning'); return; }

  const result = document.getElementById('grammarResult');
  const empty = document.getElementById('grammarEmpty');
  const statusEl = document.getElementById('grammarStatus');
  const suggestionsEl = document.getElementById('grammarSuggestions');

  const issues = detectGrammarIssues(input);

  if (result) result.classList.remove('hidden');
  if (empty) empty.classList.add('hidden');

  const icon = result?.querySelector('.grammar-icon');
  if (issues.length === 0) {
    if (statusEl) statusEl.textContent = '✓ No issues found – great writing!';
    if (suggestionsEl) suggestionsEl.innerHTML = '';
    if (icon) icon.style.background = 'rgba(34,197,94,0.12)';
  } else {
    if (statusEl) statusEl.textContent = `${issues.length} issue${issues.length > 1 ? 's' : ''} found`;
    if (icon) icon.style.background = 'rgba(245,158,11,0.12)';
    if (suggestionsEl) {
      suggestionsEl.innerHTML = issues.map(issue =>
        `<div class="grammar-suggestion">
          <div class="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="mt-0.5 flex-shrink-0" style="color:#f59e0b"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>
            <div>
              <div class="text-xs font-semibold mb-0.5" style="color:#f59e0b">${sanitizeHTML(issue.type)}</div>
              <div class="text-xs opacity-70">${sanitizeHTML(issue.message)}</div>
              ${issue.suggestion ? `<div class="text-xs mt-1 font-medium">Suggestion: ${sanitizeHTML(issue.suggestion)}</div>` : ''}
            </div>
          </div>
        </div>`
      ).join('');
    }
  }
  showToast(`Grammar check complete: ${issues.length} issue${issues.length !== 1 ? 's' : ''} found`, issues.length === 0 ? 'success' : 'warning');
}

function detectGrammarIssues(text) {
  const issues = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  sentences.forEach((sentence, i) => {
    const s = sentence.trim();
    if (!s) return;

    // Check capitalization
    if (s[0] && s[0] === s[0].toLowerCase() && /[a-z]/i.test(s[0])) {
      issues.push({ type: 'Capitalization', message: `Sentence ${i + 1} should start with a capital letter.`, suggestion: s[0].toUpperCase() + s.slice(1) });
    }
    // Double spaces
    if (/  +/.test(s)) {
      issues.push({ type: 'Extra Spaces', message: 'Multiple consecutive spaces detected.', suggestion: s.replace(/  +/g, ' ') });
    }
    // Lowercase "i"
    if (/\bi\b/.test(s)) {
      issues.push({ type: 'Pronoun', message: 'The pronoun "I" should always be capitalized.', suggestion: s.replace(/\bi\b/g, 'I') });
    }
    // Missing space after punctuation
    if (/[,;:][a-zA-Z]/.test(s)) {
      issues.push({ type: 'Spacing', message: 'Missing space after punctuation mark.', suggestion: s.replace(/([,;:])([a-zA-Z])/g, '$1 $2') });
    }
    // Common contractions (its vs it's)
    if (/\bits\s+(is|are|was|were|been|being)\b/i.test(s)) {
      issues.push({ type: 'Word Choice', message: 'Consider using "it\'s" (it is) instead of "its" before a verb.', suggestion: null });
    }
    // Repeated words
    const words = s.split(/\s+/);
    for (let j = 1; j < words.length; j++) {
      if (words[j].toLowerCase() === words[j - 1].toLowerCase() && words[j].length > 2) {
        issues.push({ type: 'Repeated Word', message: `The word "${words[j]}" appears twice in a row.`, suggestion: words.filter((_, k) => k !== j).join(' ') });
        break;
      }
    }
  });

  // Check for missing punctuation at end
  const lastChar = text.trim().slice(-1);
  if (!/[.!?]/.test(lastChar)) {
    issues.push({ type: 'Missing Punctuation', message: 'The text does not end with a punctuation mark.', suggestion: text.trim() + '.' });
  }

  return issues;
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="toast-icon ${type}">${icons[type] || icons.info}</span>
    <span>${sanitizeHTML(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>
    </button>`;

  container.appendChild(toast);

  const duration = type === 'error' ? 5000 : 3000;
  setTimeout(() => {
    toast.classList.add('exiting');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ============================================================
   UTILITIES
   ============================================================ */
function sanitizeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupKeyboardNav() {
  document.addEventListener('keydown', e => {
    // Escape closes dropdown / sidebar
    if (e.key === 'Escape') { closeLangDropdown(); closeSidebar(); }
    // Ctrl+Enter to translate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { translateText(); }
  });
}

function setupNetworkMonitor() {
  window.addEventListener('offline', () => showToast('You are offline. Translation may not work.', 'warning'));
  window.addEventListener('online', () => showToast('Back online!', 'success'));
}

// Init lang buttons with defaults
updateLangButton('source', 'auto');
updateLangButton('target', 'en');
