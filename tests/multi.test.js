// multi.test.js — loads REAL capsule zips through the REAL app.js in jsdom
// and asserts the multi-capsule flow the user reported broken on 2026-11-25:
// load two distinct capsules -> panel lists 2, badge shows 2, switching
// works, re-loading the same file dedupes (no duplicate), unload works,
// and the "load another" button opens the file picker. Also asserts the
// file input is rendered-but-invisible, never `hidden` (a display:none
// input is the prime suspect for the picker not opening on Chrome Android).
// Run: node tests/multi.test.js   (jsdom lives in /tmp/dc-render-test)
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/tmp/dc-render-test/node_modules/jsdom');
const JSZip = require(path.join(__dirname, '..', 'js', 'vendor', 'jszip.min.js'));
const root = path.join(__dirname, '..');
let fails = 0;
function check(name, ok, extra) {
  if (ok) console.log('  PASS ' + name);
  else { fails++; console.log('  FAIL ' + name + ' ' + (extra || '')); }
}

async function buildZip(id, name, pages) {
  const zip = new JSZip();
  const toc = pages.map(([file, title]) => ({
    group: null, title, path: '/' + file.replace(/^docs\//, '').replace(/\.md$/, ''), file,
  }));
  zip.file('manifest.json', JSON.stringify({
    id, name, version: '1.0.0', source: 'https://example.invalid/',
    updated: '2026-11-25', icon: 'icon.svg', docsRoot: 'docs', toc,
  }, null, 2));
  zip.file('icon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"></svg>');
  pages.forEach(([file, , body]) => zip.file(file, body));
  return zip.generateAsync({ type: 'nodebuffer' });
}

const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
  url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true,
});
const { window } = dom;
window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, addListener() {}, removeEventListener() {} });
// jsdom gaps the harness must fill (real browsers have all of these):
// - setImmediate: without it, JSZip's bundled polyfill picks the script
//   onreadystatechange trick, which never fires in jsdom and hangs .async().
// - URL.createObjectURL: jsdom does not implement it; the app uses it for
//   capsule images, so stub it with a stable fake URL.
window.setImmediate = setImmediate;
let blobN = 0;
window.URL.createObjectURL = () => 'blob:jsdom-test-' + (++blobN);
window.URL.revokeObjectURL = () => {};
const load = (p) => window.eval(fs.readFileSync(path.join(root, p), 'utf8'));
load('js/vendor/jszip.min.js');
load('js/vendor/marked.min.js');
load('js/vendor/highlight.min.js');
load('js/version.js');
window.eval(fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8') +
  '\n;window.__dc = { loadCapsuleFile, state };');
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

(async () => {
  await new Promise((r) => setTimeout(r, 50));
  const doc = window.document;
  const panelRows = () => Array.from(doc.querySelectorAll('#capsPanelList .cap-row'));
  const badge = () => (doc.getElementById('capsCount').textContent || '').trim();
  // Cross-realm note: bytes built in Node must be copied into the jsdom
  // window's own Uint8Array, or the window's JSZip rejects them as an
  // unsupported type. On a real phone the File already comes from the
  // browser realm, so this conversion is test-harness only.
  const toWindowBytes = (buf) => { const u = new window.Uint8Array(buf.length); u.set(buf); return u; };

  // The real test capsule shipped for the user to try on his phone.
  const testZip = fs.readFileSync(path.join(root, 'capsules', 'offdoc-test-capsule-v1.zip'));
  await window.__dc.loadCapsuleFile(toWindowBytes(testZip));
  await new Promise((r) => setTimeout(r, 20));
  check('loading the test capsule gives 1 loaded capsule', window.__dc.state.capsules.length === 1,
    'got ' + window.__dc.state.capsules.length);
  check('panel lists 1 row after first load', panelRows().length === 1);
  check('badge shows 1 after first load', badge() === '· 1', 'got "' + badge() + '"');
  check('reader main becomes visible after load', doc.getElementById('readerMain').hidden === false);
  check('first chapter of test capsule opens', (doc.getElementById('docTitle').textContent || '').includes('What is this capsule'));

  // A second, distinct capsule built in-memory.
  const secondZip = await buildZip('offdoc-test-2', 'Second Test Capsule', [
    ['docs/a.md', 'Second A', '# Second A\n\nBody A.\n'],
    ['docs/b.md', 'Second B', '# Second B\n\nBody B.\n'],
  ]);
  await window.__dc.loadCapsuleFile(toWindowBytes(secondZip));
  await new Promise((r) => setTimeout(r, 20));
  check('loading a second distinct capsule gives 2 loaded', window.__dc.state.capsules.length === 2,
    'got ' + window.__dc.state.capsules.length);
  check('panel lists 2 rows', panelRows().length === 2, 'got ' + panelRows().length);
  check('badge shows 2', badge() === '· 2', 'got "' + badge() + '"');
  check('active capsule is the second one', window.__dc.state.activeId.includes('offdoc-test-2'));
  check('second capsule first chapter opens', (doc.getElementById('docTitle').textContent || '').includes('Second A'));

  // Switch back to the first capsule by tapping its panel row.
  panelRows()[0].querySelector('.cap-pick').click();
  await new Promise((r) => setTimeout(r, 20));
  check('tapping a panel row switches the active capsule', window.__dc.state.activeId.includes('offdoc-test@'));
  check('switching restores the first capsule chapter', (doc.getElementById('docTitle').textContent || '').includes('What is this capsule'));

  // Re-loading the same file replaces itself — no duplicate row.
  await window.__dc.loadCapsuleFile(toWindowBytes(testZip));
  await new Promise((r) => setTimeout(r, 20));
  check('re-loading the same capsule dedupes (still 2, no duplicate)', window.__dc.state.capsules.length === 2,
    'got ' + window.__dc.state.capsules.length);
  check('panel still lists 2 rows after re-load', panelRows().length === 2);

  // Unload the second capsule from the panel.
  const secondRow = panelRows().find((row) => (row.textContent || '').includes('Second Test Capsule'));
  secondRow.querySelector('[data-unload-capsule]').click();
  await new Promise((r) => setTimeout(r, 20));
  check('unloading from the panel leaves 1 capsule', window.__dc.state.capsules.length === 1,
    'got ' + window.__dc.state.capsules.length);
  check('panel lists 1 row after unload', panelRows().length === 1);

  // "Load another capsule" opens the file picker.
  let pickerOpened = false;
  const input = doc.getElementById('fileInput');
  const realClick = input.click.bind(input);
  input.click = () => { pickerOpened = true; return realClick(); };
  doc.getElementById('capsAddBtn').click();
  await new Promise((r) => setTimeout(r, 20));
  check('"Load another capsule" triggers the file picker', pickerOpened);

  // The picker input must be rendered (not display:none) for Chrome Android.
  check('file input has no `hidden` attribute', !input.hasAttribute('hidden'));
  check('file input uses the rendered-but-invisible class', input.classList.contains('file-picker'));
  const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
  const rule = (css.match(/\.file-picker\{[^}]*\}/) || [''])[0];
  check('file-picker CSS keeps the input rendered (no display:none)', rule.length > 0 && !/display:\s*none/.test(rule), rule);

  console.log('\nmulti.test: ' + (fails ? fails + ' failed' : 'all passed'));
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error('multi.test crashed:', e); process.exit(1); });
