/* OffDoc — vanilla JS. Capsule content is session-only, in-memory. */
'use strict';
const I18N = {
  fa: {
    appName: 'OffDoc', tabCapsules: 'کپسول‌ها', tabReader: 'خواننده', tabSettings: 'تنظیمات',
    search: 'جستجو', searchPlaceholder: 'در این کپسول جستجو کنید…', searchHint: 'جستجو فقط داخل کپسولی که بارگذاری کرده‌اید انجام می‌شود.',
    capsulesTitle: 'کپسول‌ها', capsulesSub: 'داکیومنت هر سایت را به‌صورت یک کپسول جدا دانلود کنید، بعد فایلش را اینجا بارگذاری کنید و آفلاین بخوانید.',
    loadTitle: 'بارگذاری کپسول', loadButton: 'انتخاب فایل کپسول', dropHint: 'فایل .zip کپسول را اینجا رها کنید، یا انتخابش کنید.',
    downloadNote: 'بعد از دانلود، فایل کپسول را از همین بخش بارگذاری کنید تا خوانده شود. کپسول در مرورگر ذخیره نمی‌شود؛ هر بار که اپ را باز می‌کنید، دوباره فایل را انتخاب کنید.',
    files: 'فایل', version: 'نسخه', updated: 'به‌روز شده', size: 'حجم', download: 'دانلود',
    noCapsuleTitle: 'هنوز کپسولی بارگذاری نشده', noCapsuleSub: 'یک فایل کپسول (.zip) را بارگذاری کنید تا داکیومنتش را آفلاین بخوانید.',
    noCapsuleAction: 'بارگذاری کپسول', toc: 'فهرست', prev: 'قبلی', next: 'بعدی', copy: 'کپی', copied: 'کپی شد',
    hint: 'راهنمایی', warning: 'هشدار', settingsTitle: 'تنظیمات',
    language: 'زبان', languageHint: 'زبان رابط کاربری؛ متن داکیومنت همیشه انگلیسی و چپ‌چین است.',
    appearance: 'ظاهر', appearanceHint: 'پیش‌فرض خودکار است و از سیستم پیروی می‌کند.',
    auto: 'خودکار', light: 'روشن', dark: 'تیره',
    updateTitle: 'به‌روزرسانی اپ', updateCheck: 'بررسی به‌روزرسانی', checking: 'در حال بررسی…',
    upToDate: 'شما به‌روز هستید.', updateAvailable: 'نسخه جدید در دسترس است.', applyUpdate: 'اعمال به‌روزرسانی و بارگذاری دوباره',
    lastChecked: 'آخرین بررسی', never: 'هنوز بررسی نشده',
    aboutTitle: 'درباره کپسول', aboutText: 'کپسول یک فایل فشرده است که فایل‌های مارک‌داون، عکس‌ها و آیکون داکیومنت یک سایت را دارد.',
    offlineTitle: 'آفلاین', offlineNote: 'اپ کاملاً آفلاین کار می‌کند. برای خواندن داکیومنت نیازی به اینترنت نیست.',
    noCacheTitle: 'بدون ذخیره کپسول', noCacheNote: 'فایل کپسول در مرورگر کش یا ذخیره نمی‌شود؛ فقط در همین جلسه در حافظه خوانده می‌شود.',
    attributionTitle: 'منبع', attribution: 'داکیومنت NestJS با لایسنس MIT از nestjs/docs.nestjs.com است.',
    sessionTitle: 'جلسه', unloadCapsule: 'خارج کردن کپسول', unloadHint: 'کپسول فعلی را از حافظه خارج می‌کند.',
    loading: 'در حال بارگذاری کپسول…', loadError: 'فایل کپسول خوانده نشد', loadErrorText: 'مطمئن شوید فایل .zip یک کپسول معتبر است و دوباره تلاش کنید.',
    searchNoResults: 'نتیجه‌ای پیدا نشد.', results: 'نتیجه', close: 'بستن', chapters: 'فصل',
    loadedCapsule: 'کپسول بارگذاری‌شده', source: 'منبع', openChapter: 'باز کردن فصل'
  },
  en: {
    appName: 'OffDoc', tabCapsules: 'Capsules', tabReader: 'Reader', tabSettings: 'Settings',
    search: 'Search', searchPlaceholder: 'Search inside this capsule…', searchHint: 'Search runs only inside the capsule you loaded.',
    capsulesTitle: 'Capsules', capsulesSub: 'Download each site’s docs as a separate capsule, then load its file here and read offline.',
    loadTitle: 'Load capsule', loadButton: 'Choose capsule file', dropHint: 'Drop a capsule .zip file here, or choose it.',
    downloadNote: 'After downloading, load the capsule file from this section to read it. The capsule is not stored in the browser; choose the file again each time you open the app.',
    files: 'files', version: 'Version', updated: 'Updated', size: 'Size', download: 'Download',
    noCapsuleTitle: 'No capsule loaded yet', noCapsuleSub: 'Load a capsule (.zip) file to read its docs offline.',
    noCapsuleAction: 'Load capsule', toc: 'Contents', prev: 'Previous', next: 'Next', copy: 'Copy', copied: 'Copied',
    hint: 'Hint', warning: 'Warning', settingsTitle: 'Settings',
    language: 'Language', languageHint: 'Interface language; doc text is always English, left-to-right.',
    appearance: 'Appearance', appearanceHint: 'Auto follows the system by default.',
    auto: 'Auto', light: 'Light', dark: 'Dark',
    updateTitle: 'App update', updateCheck: 'Check for update', checking: 'Checking…',
    upToDate: 'You are up to date.', updateAvailable: 'A new version is available.', applyUpdate: 'Apply update & reload',
    lastChecked: 'Last checked', never: 'Never checked',
    aboutTitle: 'About capsules', aboutText: 'A capsule is one archive holding a site’s Markdown files, images and icon.',
    offlineTitle: 'Offline', offlineNote: 'The app works fully offline. No internet is needed to read docs.',
    noCacheTitle: 'No capsule caching', noCacheNote: 'The capsule file is never cached or stored in the browser; it is read in memory for this session only.',
    attributionTitle: 'Source', attribution: 'NestJS docs are MIT-licensed, from nestjs/docs.nestjs.com.',
    sessionTitle: 'Session', unloadCapsule: 'Unload capsule', unloadHint: 'Removes the current capsule from memory.',
    loading: 'Loading capsule…', loadError: 'Could not read the capsule file', loadErrorText: 'Make sure the .zip file is a valid capsule and try again.',
    searchNoResults: 'No results found.', results: 'results', close: 'Close', chapters: 'chapters',
    loadedCapsule: 'Loaded capsule', source: 'Source', openChapter: 'Open chapter'
  }
};
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const state = {
  lang: localStorage.getItem('dc-lang') || 'fa',
  theme: localStorage.getItem('dc-theme') || 'auto',
  tab: 'capsules', capsule: null, current: 0,
  codeBlocks: {}, searchIndex: null
};
function t(k) { const v = (I18N[state.lang] && I18N[state.lang][k]) || I18N.en[k]; return v == null ? k : v; }

function applyTheme() {
  const want = state.theme === 'auto'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : state.theme;
  document.documentElement.dataset.theme = want;
}
function applyLang() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$('#langSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang)));
  $$('#themeSeg button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === state.theme)));
  renderTabs(); renderCapsuleList(); renderReader(); updateVersionUI();
}
function renderTabs() {
  const tabs = [['capsules', '▣', t('tabCapsules')], ['reader', '▤', t('tabReader')], ['settings', '⚙', t('tabSettings')]];
  $('#tabbar').innerHTML = tabs.map(([id, ic, label]) =>
    `<button type="button" data-tab="${id}" aria-selected="${state.tab === id}"><span class="ic" aria-hidden="true">${ic}</span>${label}</button>`).join('');
  $('#sideNav').innerHTML = tabs.map(([id, ic, label]) =>
    `<button type="button" data-tab="${id}" aria-selected="${state.tab === id}"><span class="ic" aria-hidden="true">${ic}</span>${label}</button>`).join('');
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));
}
function switchTab(tab) {
  if (state.tab === tab) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  state.tab = tab;
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + tab));
  renderTabs();
  window.scrollTo({ top: 0 });
}

/* ---------- capsules catalog ---------- */
let catalog = [];
async function loadCatalog() {
  try {
    const res = await fetch('capsules/index.json');
    const data = await res.json();
    catalog = data.capsules || [];
  } catch (e) { catalog = []; }
  renderCapsuleList();
}
function fmtSize(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}
function renderCapsuleList() {
  const list = $('#capsuleList');
  if (!list) return;
  if (!catalog.length) { list.innerHTML = ''; return; }
  list.innerHTML = catalog.map((c) => `
    <div class="row" role="listitem">
      <div class="lead" aria-hidden="true">▣</div>
      <div class="texts"><b>${esc(c.name)}</b><span>${t('version')} ${esc(c.version)} · ${esc(c.updated)} · ${c.files} ${t('files')} · ${fmtSize(c.bytes)}</span></div>
      <a class="btn secondary" href="capsules/${esc(c.file)}" download>${t('download')}</a>
    </div>`).join('');
}
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }

/* ---------- capsule loading (session-only, in-memory) ---------- */
async function loadCapsuleFile(file) {
  if (!window.JSZip) { showLoadError(); return; }
  const dz = $('#dropzone');
  dz.querySelector('p').textContent = t('loading');
  try {
    const zip = await JSZip.loadAsync(file);
    const manifestRaw = await zip.file('manifest.json').async('string');
    const manifest = JSON.parse(manifestRaw);
    if (!manifest || !Array.isArray(manifest.toc) || !manifest.toc.length) throw new Error('bad manifest');
    const docs = {};
    const blobs = {};
    const names = Object.keys(zip.files);
    for (const name of names) {
      const entry = zip.files[name];
      if (entry.dir) continue;
      if (name.endsWith('.md')) docs[name] = await entry.async('string');
      else if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
        const blob = await entry.async('blob');
        blobs[name] = URL.createObjectURL(blob);
      }
    }
    state.capsule = { manifest, docs, blobs, name: file.name };
    state.current = 0; state.searchIndex = null;
    renderToc(); openDoc(0); switchTab('reader');
    dz.querySelector('p').textContent = t('dropHint');
  } catch (e) {
    dz.querySelector('p').textContent = t('dropHint');
    showLoadError();
  }
}
function showLoadError() {
  const body = $('#docBody');
  alert(t('loadError') + ' — ' + t('loadErrorText'));
}
function unloadCapsule() {
  if (state.capsule) Object.values(state.capsule.blobs).forEach((u) => URL.revokeObjectURL(u));
  state.capsule = null; state.current = 0; state.searchIndex = null;
  renderToc(); renderReader();
}
function tocEntries() { return state.capsule ? state.capsule.manifest.toc : []; }
function renderToc() {
  const entries = tocEntries();
  const side = $('#sideToc');
  const sheet = $('#tocSheetBody');
  if (!entries.length) { side.hidden = true; side.innerHTML = ''; sheet.innerHTML = ''; return; }
  let html = '<h3>' + esc(state.capsule.manifest.name) + '</h3>';
  let group = null;
  entries.forEach((e, i) => {
    if (e.group !== group) { group = e.group; if (group) html += '<div class="toc-group">' + esc(group) + '</div>'; }
    html += `<a href="#" data-doc="${i}" class="${i === state.current ? 'active' : ''}">${esc(e.title)}</a>`;
  });
  side.hidden = false; side.innerHTML = html;
  sheet.innerHTML = html;
  $$('[data-doc]', side.parentElement || document).forEach((a) => a.addEventListener('click', (ev) => {
    ev.preventDefault(); openDoc(Number(a.dataset.doc)); closeSheets(); switchTab('reader');
  }));
}

/* ---------- markdown rendering ---------- */
function stripBanners(md) {
  return md.replace(/<app-banner-[\s\S]*?<\/app-banner-[^>]*>/gi, '')
           .replace(/<app-banner-[^>]*\/>/gi, '')
           .replace(/<app-banner-[^>]*>[\s\S]*?/gi, (m) => (m.includes('</app-banner') ? m : ''));
}
function dequoteFences(md) {
  // Fences inside blockquotes ("> ```typescript" ... "> ```") are real code
  // blocks: strip the "> " prefix from the fence lines and every line
  // between them, so they render as normal fences without "> " in the code.
  const lines = md.split('\n');
  let inQ = false;
  return lines.map((line) => {
    if (/^>\s*```/.test(line)) { inQ = !inQ; return line.replace(/^>\s*/, ''); }
    if (inQ) return line.replace(/^>\s?/, '');
    return line;
  }).join('\n');
}
function renderMarkdown(md, docFile) {
  state.codeBlocks = {};
  let text = dequoteFences(stripBanners(md));
  // Split code fences out first so @@filename / @@switch are handled exactly.
  const parts = [];
  const fenceRe = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  let last = 0, m, idx = 0;
  while ((m = fenceRe.exec(text)) !== null) {
    parts.push({ type: 'md', text: text.slice(last, m.index) });
    parts.push({ type: 'code', lang: (m[1] || '').toLowerCase(), body: m[2] });
    last = fenceRe.lastIndex; idx++;
  }
  parts.push({ type: 'md', text: text.slice(last) });
  let html = '';
  parts.forEach((p, i) => {
    if (p.type === 'md') { html += window.marked ? marked.parse(p.text) : esc(p.text); return; }
    html += codeBoxHtml(p.lang, p.body, 'cb' + i);
  });
  const host = document.createElement('div');
  host.innerHTML = html;
  // Callouts: > info **Hint** / > warning **Warning**
  $$('blockquote', host).forEach((bq) => {
    const txt = (bq.textContent || '').trim().toLowerCase();
    let kind = null;
    if (txt.startsWith('info')) kind = 'info';
    else if (txt.startsWith('warning')) kind = 'warn';
    if (!kind) return;
    const div = document.createElement('div');
    div.className = 'callout ' + kind;
    const label = document.createElement('b');
    label.textContent = kind === 'info' ? t('hint') : t('warning');
    const body = bq.innerHTML.replace(/^\s*(info|warning)\s*/i, '');
    div.appendChild(label);
    const span = document.createElement('span');
    span.innerHTML = body;
    div.appendChild(span);
    bq.replaceWith(div);
  });
  // Images: /assets/... -> assets/... in the zip; relative -> relative to the doc file.
  $$('img', host).forEach((img) => {
    const src = img.getAttribute('src') || '';
    const resolved = resolveAsset(src, docFile);
    if (resolved) img.setAttribute('src', resolved);
    img.setAttribute('loading', 'lazy');
  });
  // Internal links -> in-app navigation
  $$('a', host).forEach((a) => {
    const href = a.getAttribute('href') || '';
    const target = matchTocLink(href);
    if (target != null) {
      a.setAttribute('href', '#');
      a.addEventListener('click', (ev) => { ev.preventDefault(); openDoc(target); });
    } else if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
    }
  });
  return host.innerHTML;
}
function resolveAsset(src, docFile) {
  if (!state.capsule || !src || src.startsWith('data:') || /^https?:\/\//i.test(src)) return null;
  let key = null;
  if (src.startsWith('/assets/')) key = 'assets/' + src.slice(8);
  else if (src.startsWith('assets/')) key = src;
  else {
    const dir = (docFile || '').split('/').slice(0, -1).join('/');
    const parts = (dir ? dir + '/' : '') + src;
    const norm = [];
    parts.split('/').forEach((p) => { if (p === '..') norm.pop(); else if (p !== '.') norm.push(p); });
    key = norm.join('/');
  }
  if (state.capsule.blobs[key]) return state.capsule.blobs[key];
  // assets may live under docs/ prefix in some capsules
  const alt = key.startsWith('assets/') ? key : 'assets/' + key.split('/').pop();
  return state.capsule.blobs[alt] || null;
}
function matchTocLink(href) {
  if (!state.capsule) return null;
  let path = href.replace(/^https?:\/\/docs\.nestjs\.com/i, '').replace(/^https?:\/\/[^/]+/i, '');
  path = path.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
  const entries = tocEntries();
  for (let i = 0; i < entries.length; i++) {
    if (entries[i].path === path) return i;
  }
  return null;
}
function codeBoxHtml(lang, body, id) {
  let filename = '';
  let ts = body, js = null;
  const lines = body.split('\n');
  // The fence body ends with the newline before the closing ``` — drop that
  // artifact empty line so neither variant gains a phantom trailing newline.
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  const kept = [];
  lines.forEach((line) => {
    const fm = line.match(/^@@filename\((.+)\)\s*$/);
    if (fm) { filename = fm[1].trim(); return; }
    if (line.trim() === '@@switch') { js = ''; return; }
    if (js !== null) js += line + '\n'; else kept.push(line);
  });
  ts = kept.join('\n');
  const language = lang || 'typescript';
  state.codeBlocks[id] = { ts, js, language, filename, current: 'ts' };
  const highlighted = highlightCode(ts, language);
  const toggle = js !== null
    ? `<button type="button" class="mini" data-cb="${id}" data-variant="ts" aria-pressed="true">TS</button><button type="button" class="mini" data-cb="${id}" data-variant="js" aria-pressed="false">JS</button>` : '';
  return `<div class="codebox"><div class="code-head"><span class="fname">${esc(filename || language)}</span>${toggle}<button type="button" class="mini" data-copy="${id}">${t('copy')}</button></div><pre><code id="${id}" class="hljs language-${esc(language)}">${highlighted}</code></pre></div>`;
}
function highlightCode(code, language) {
  try {
    if (window.hljs) {
      const lang = hljs.getLanguage(language) ? language : 'typescript';
      return hljs.highlight(code, { language: lang }).value;
    }
  } catch (e) { /* fall through */ }
  return esc(code);
}
function openDoc(i) {
  const entries = tocEntries();
  if (!entries.length || i < 0 || i >= entries.length) return;
  state.current = i;
  const entry = entries[i];
  const md = state.capsule.docs[entry.file] || '';
  $('#docTitle').textContent = entry.title;
  $('#docMeta').textContent = state.capsule.manifest.name + ' · ' + (entry.group || '') + ' · ' + (i + 1) + ' / ' + entries.length;
  $('#docBody').innerHTML = renderMarkdown(md, entry.file);
  $('#prevBtn').textContent = '‹ ' + t('prev') + (i > 0 ? ': ' + entries[i - 1].title : '');
  $('#nextBtn').textContent = t('next') + (i < entries.length - 1 ? ': ' + entries[i + 1].title : '') + ' ›';
  $('#prevBtn').disabled = i === 0;
  $('#nextBtn').disabled = i === entries.length - 1;
  renderReader(); renderToc();
  window.scrollTo({ top: 0 });
}
function renderReader() {
  const has = !!state.capsule;
  $('#readerEmpty').hidden = has;
  $('#readerMain').hidden = !has;
  $('#searchFab').disabled = !has;
  $('#tocBtn').style.display = has ? '' : 'none';
  if (has) $('#sideVer').textContent = state.capsule.manifest.name + ' ' + state.capsule.manifest.version;
}

/* ---------- in-capsule search ---------- */
function buildSearchIndex() {
  if (state.searchIndex) return state.searchIndex;
  state.searchIndex = tocEntries().map((e, i) => ({
    i, title: e.title, text: (state.capsule.docs[e.file] || '').toLowerCase()
  }));
  return state.searchIndex;
}
function runSearch(q) {
  const box = $('#searchResults');
  q = (q || '').trim().toLowerCase();
  if (!q || !state.capsule) { box.innerHTML = ''; return; }
  const hits = buildSearchIndex().filter((e) =>
    e.title.toLowerCase().includes(q) || e.text.includes(q)).slice(0, 20);
  if (!hits.length) { box.innerHTML = `<p class="small">${t('searchNoResults')}</p>`; return; }
  box.innerHTML = hits.map((h) => {
    const pos = h.text.indexOf(q);
    const snip = pos >= 0 ? h.text.slice(Math.max(0, pos - 60), pos + 90).replace(/\s+/g, ' ') : '';
    return `<button type="button" class="result" data-doc="${h.i}"><b>${esc(h.title)}</b><span>${esc(snip)}</span></button>`;
  }).join('') + `<p class="small">${hits.length} ${t('results')}</p>`;
}

/* ---------- sheets ---------- */
function openSheet(id) {
  closeSheets();
  $('#sheetBack').classList.add('open');
  $(id).classList.add('open');
}
function closeSheets() {
  $('#sheetBack').classList.remove('open');
  $$('.sheet').forEach((s) => s.classList.remove('open'));
}

/* ---------- update check ---------- */
function updateVersionUI() {
  const v = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '1.0.0';
  $('#verFoot').textContent = 'OffDoc ' + v;
  $('#sideVer').textContent = $('#sideVer').textContent || ('v' + v);
  const last = localStorage.getItem('dc-last-checked');
  $('#lastChecked').textContent = t('lastChecked') + ': ' + (last ? new Date(Number(last)).toLocaleString(state.lang === 'fa' ? 'fa-IR' : 'en') : t('never'));
}
async function checkUpdate() {
  const status = $('#updateStatus');
  const btn = $('#checkUpdateBtn');
  status.textContent = t('checking');
  btn.disabled = true;
  try {
    const res = await fetch('version.json?x=' + Date.now());
    const data = await res.json();
    localStorage.setItem('dc-last-checked', String(Date.now()));
    const current = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '1.0.0';
    if (data.version && data.version !== current) {
      status.textContent = t('updateAvailable') + ' (' + data.version + ')';
      btn.textContent = t('applyUpdate');
      btn.disabled = false;
      btn.onclick = async () => {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          else if (reg) await reg.update();
        }
        location.reload();
      };
    } else {
      status.textContent = t('upToDate') + ' (' + current + ')';
      btn.disabled = false;
    }
  } catch (e) {
    status.textContent = t('upToDate');
    btn.disabled = false;
  }
  updateVersionUI();
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLang();
  loadCatalog();
  switchTab('capsules');
  renderReader();

  $$('#langSeg button').forEach((b) => b.addEventListener('click', () => {
    state.lang = b.dataset.lang; localStorage.setItem('dc-lang', state.lang); applyLang();
  }));
  $$('#themeSeg button').forEach((b) => b.addEventListener('click', () => {
    state.theme = b.dataset.theme; localStorage.setItem('dc-theme', state.theme); applyTheme(); applyLang();
  }));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.theme === 'auto') applyTheme(); });

  const fileInput = $('#fileInput');
  $('#pickBtn').addEventListener('click', () => fileInput.click());
  $('#emptyLoadBtn').addEventListener('click', () => { switchTab('capsules'); fileInput.click(); });
  fileInput.addEventListener('change', () => { if (fileInput.files[0]) loadCapsuleFile(fileInput.files[0]); fileInput.value = ''; });
  const dz = $('#dropzone');
  ['dragover', 'dragenter'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('over'); }));
  dz.addEventListener('drop', (e) => { const f = e.dataTransfer.files[0]; if (f) loadCapsuleFile(f); });
  dz.addEventListener('keydown', (e) => { if (e.key === 'Enter') fileInput.click(); });

  $('#prevBtn').addEventListener('click', () => openDoc(state.current - 1));
  $('#nextBtn').addEventListener('click', () => openDoc(state.current + 1));
  $('#tocBtn').addEventListener('click', () => openSheet('#tocSheet'));
  $('#tocClose').addEventListener('click', closeSheets);
  $('#sheetBack').addEventListener('click', closeSheets);
  $('#searchFab').addEventListener('click', () => { openSheet('#searchSheet'); setTimeout(() => $('#searchInput').focus(), 50); });
  $('#sheetClose').addEventListener('click', closeSheets);
  $('#searchInput').addEventListener('input', (e) => runSearch(e.target.value));
  $('#unloadBtn').addEventListener('click', () => { unloadCapsule(); switchTab('capsules'); });
  $('#checkUpdateBtn').addEventListener('click', checkUpdate);

  // Delegated clicks: TOC links, code copy, TS/JS toggle
  document.addEventListener('click', (e) => {
    const docLink = e.target.closest('[data-doc]');
    if (docLink) { e.preventDefault(); openDoc(Number(docLink.dataset.doc)); closeSheets(); switchTab('reader'); return; }
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      const cb = state.codeBlocks[copyBtn.dataset.copy];
      if (cb) {
        // Copy the full block in its currently visible variant (TS or JS), never a clipped view.
        const text = cb.current === 'js' && cb.js != null ? cb.js : cb.ts;
        navigator.clipboard.writeText(text).then(() => { copyBtn.textContent = t('copied'); setTimeout(() => { copyBtn.textContent = t('copy'); }, 1200); });
      }
      return;
    }
    const tog = e.target.closest('[data-cb]');
    if (tog) {
      const cb = state.codeBlocks[tog.dataset.cb];
      if (!cb) return;
      const code = document.getElementById(tog.dataset.cb);
      const variant = tog.dataset.variant;
      cb.current = variant;
      $$('[data-cb="' + tog.dataset.cb + '"]').forEach((b) => b.setAttribute('aria-pressed', String(b === tog)));
      if (code) code.innerHTML = highlightCode(variant === 'js' && cb.js != null ? cb.js : cb.ts, cb.language);
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) { refreshing = true; location.reload(); }
    });
  }
});
