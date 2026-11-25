// render.test.js — renders REAL chapters through the REAL app.js renderer
// (jsdom) and asserts: zero fences lost, full text per block, colourful
// highlighting (incl. unlabelled -> TypeScript), TS/JS toggle and full-block
// copy of the visible variant, scrollable (not clipped) code CSS, and a
// distinct dark-mode code-box background.
// Run: node tests/render.test.js   (jsdom lives in /tmp/dc-render-test)
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/tmp/dc-render-test/node_modules/jsdom');
const root = path.join(__dirname, '..');
let fails = 0;
function check(name, ok, extra) {
  if (ok) console.log('  PASS ' + name);
  else { fails++; console.log('  FAIL ' + name + ' ' + (extra || '')); }
}

// ---- 1. highlight.js language coverage (node require of the vendored file) ----
const hljs = require(path.join(root, 'js', 'vendor', 'highlight.min.js'));
for (const lang of ['typescript', 'javascript', 'bash', 'json', 'xml', 'sql', 'plaintext']) {
  check('hljs covers ' + lang, !!hljs.getLanguage(lang));
}

// ---- 2. CSS: code never clipped, dark code-box distinct ----
const css = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
const preRule = (css.match(/\.doc pre\{[^}]*\}/) || [''])[0];
check('code <pre> scrolls horizontally', /overflow-x:\s*auto/.test(preRule), preRule);
check('code <pre> has no max-height', !/max-height/.test(preRule));
check('code keeps pre whitespace (no wrap-cut)', /white-space:\s*pre/.test(preRule));
const darkBlock = (css.match(/html\[data-theme="dark"\]\{[^}]*\}/) || [''])[0];
const darkVal = (name) => (darkBlock.match(new RegExp('--' + name + ':\\s*([^;]+);')) || [])[1];
const darkBg = (darkVal('bg') || '').trim(), darkCard = (darkVal('card') || '').trim(), darkCode = (darkVal('code-bg') || '').trim();
check('dark code-box distinct from page+card', darkBg && darkCard && darkCode && darkBg !== darkCode && darkCard !== darkCode,
  `bg=${darkBg} card=${darkCard} code=${darkCode}`);

// ---- 3. Parse a chapter's fences independently (line-based, pairs not markers) ----
function parseFences(md) {
  // Mirror the renderer's dequoting: fences inside blockquotes count as blocks.
  const qlines = md.split('\n');
  let inQ = false;
  md = qlines.map((line) => {
    if (/^>\s*```/.test(line)) { inQ = !inQ; return line.replace(/^>\s*/, ''); }
    if (inQ) return line.replace(/^>\s?/, '');
    return line;
  }).join('\n');
  const lines = md.split('\n');
  const fences = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^```(\w*)\s*$/);
    if (!m) { i++; continue; }
    const lang = m[1];
    const body = [];
    i++;
    while (i < lines.length && !lines[i].startsWith('```')) { body.push(lines[i]); i++; }
    i++; // closing fence
    fences.push({ lang, body: body.join('\n') });
  }
  return fences;
}
function splitVariants(body) {
  const kept = [];
  let js = null;
  for (const line of body.split('\n')) {
    if (/^@@filename\(.+\)\s*$/.test(line)) continue;
    if (line.trim() === '@@switch') { js = ''; continue; }
    if (js !== null) js += line + '\n'; else kept.push(line);
  }
  return { ts: kept.join('\n'), js };
}
const md = fs.readFileSync('/tmp/nestdocs-probe/content/controllers.md', 'utf8');
const fences = parseFences(md);
const expected = fences.map((f) => ({ lang: f.lang, ...splitVariants(f.body) }));
check('controllers.md has fences to test', fences.length === 31, 'got ' + fences.length);
console.log('  INFO controllers.md code blocks: ' + fences.length +
  ' (typescript=' + fences.filter((f) => f.lang === 'typescript').length +
  ', plaintext=' + fences.filter((f) => f.lang === 'plaintext').length +
  ', unlabelled=' + fences.filter((f) => !f.lang).length +
  ', with @@switch=' + expected.filter((e) => e.js !== null).length +
  ', with @@filename=' + (md.match(/@@filename/g) || []).length + ')');

// ---- 4. Render through the real app.js in jsdom ----
const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
  url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true,
});
const { window } = dom;
window.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, addListener() {}, removeEventListener() {} });
Object.defineProperty(window.navigator, 'clipboard', {
  value: { writeText: async (txt) => { window.__copied = txt; } },
});
const load = (p) => window.eval(fs.readFileSync(path.join(root, p), 'utf8'));
load('js/vendor/jszip.min.js');
load('js/vendor/marked.min.js');
load('js/vendor/highlight.min.js');
load('js/version.js');
// app.js starts with 'use strict', so its top-level consts stay scoped to one
// eval call: load it together with an explicit window export for the test.
window.eval(fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8') +
  '\n;window.__dc = { renderMarkdown, state };');
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

(async () => {
  await new Promise((r) => setTimeout(r, 50));
  const doc = window.document;
  const renderInto = (text, file) => {
    window.__dc.state.capsule = {
      manifest: { name: 'NestJS Documentation', version: '1.0.0', toc: [{ group: null, title: 'T', path: '/t', file }] },
      docs: { [file]: text }, blobs: {},
    };
    doc.getElementById('docBody').innerHTML = window.__dc.renderMarkdown(text, file);
    return Array.from(doc.querySelectorAll('#docBody .codebox'));
  };

  const boxes = renderInto(md, 'docs/controllers.md');
  check('rendered code blocks == source fences (31)', boxes.length === fences.length,
    'rendered ' + boxes.length);
  let full = 0, cut = [];
  boxes.forEach((box, i) => {
    const code = box.querySelector('code');
    const got = (code.textContent || '').replace(/\n$/, '');
    const want = (expected[i].ts || '').replace(/\n$/, '');
    if (got === want) full++;
    else cut.push(i);
  });
  check('every code block shows its FULL text (no truncation)', full === fences.length,
    'full=' + full + '/' + fences.length + ' mismatched=' + cut.slice(0, 5).join(','));
  const colourful = boxes.filter((b) => /hljs-(keyword|string|title|built_in|attr|comment|number)/.test(b.querySelector('code').innerHTML)).length;
  check('code blocks are syntax-highlighted (colourful)', colourful >= fences.length - 2,
    'highlighted=' + colourful + '/' + fences.length);
  const withSwitch = expected.findIndex((e) => e.js !== null);
  check('a @@switch block exists in the render', withSwitch >= 0, 'index=' + withSwitch);
  if (withSwitch >= 0) {
    const box = boxes[withSwitch];
    const jsBtn = box.querySelector('[data-variant="js"]');
    const tsBtn = box.querySelector('[data-variant="ts"]');
    const copyBtn = box.querySelector('[data-copy]');
    jsBtn.click();
    await new Promise((r) => setTimeout(r, 20));
    const jsShown = box.querySelector('code').textContent.replace(/\n$/, '');
    check('TS/JS toggle shows the JS variant', jsShown === (expected[withSwitch].js || '').replace(/\n$/, ''));
    copyBtn.click();
    await new Promise((r) => setTimeout(r, 20));
    check('copy copies the FULL visible (JS) block', window.__copied === expected[withSwitch].js,
      'copied chars=' + (window.__copied || '').length + ' expected=' + (expected[withSwitch].js || '').length);
    tsBtn.click();
    await new Promise((r) => setTimeout(r, 20));
    copyBtn.click();
    await new Promise((r) => setTimeout(r, 20));
    check('copy copies the FULL TS block after toggling back', window.__copied === expected[withSwitch].ts);
  }
  // Unlabelled fence defaults to TypeScript: the only one in the whole corpus
  // is in microservices/pre-request-hooks.md.
  const hooksMd = fs.readFileSync('/tmp/nestdocs-probe/content/microservices/pre-request-hooks.md', 'utf8');
  const hooksFences = parseFences(hooksMd);
  const unlabIdx = hooksFences.findIndex((f) => !f.lang);
  check('corpus has an unlabelled fence to test the TS default', unlabIdx >= 0, 'index=' + unlabIdx);
  if (unlabIdx >= 0) {
    const hboxes = renderInto(hooksMd, 'docs/microservices/pre-request-hooks.md');
    check('unlabelled fence renders as a code block', hboxes.length === hooksFences.length,
      'rendered ' + hboxes.length + ' vs ' + hooksFences.length);
    check('unlabelled fence defaults to TypeScript highlighting',
      /hljs-/.test(hboxes[unlabIdx].querySelector('code').innerHTML));
  }
  // Regression: fences inside blockquotes ("> ```...") render as real code
  // blocks, counted, with the "> " prefix stripped from every code line.
  const introMd = fs.readFileSync('/tmp/nestdocs-probe/content/openapi/introduction.md', 'utf8');
  const introFences = parseFences(introMd);
  const introBoxes = renderInto(introMd, 'docs/openapi/introduction.md');
  check('blockquote fences render as code blocks (openapi/introduction.md: 18)', introBoxes.length === 18,
    'rendered ' + introBoxes.length + ' vs parsed ' + introFences.length);
  const strayQuote = introBoxes.some((b) => (b.querySelector('code').textContent || '').split('\n').some((l) => l.startsWith('> ')));
  check('no rendered code line keeps a "> " blockquote prefix', !strayQuote);
  // No banner leftovers in rendered output.
  const bannerMd = fs.readFileSync('/tmp/nestdocs-probe/content/first-steps.md', 'utf8');
  if (bannerMd.includes('<app-banner')) {
    renderInto(bannerMd, 'docs/first-steps.md');
    check('no <app-banner-*> survives rendering', !doc.getElementById('docBody').innerHTML.includes('app-banner'));
  } else {
    console.log('  INFO first-steps.md has no banner to test stripping');
  }
  console.log('\nrender.test: ' + (fails ? fails + ' failed' : 'all passed'));
  process.exit(fails ? 1 : 0);
})().catch((e) => { console.error('render.test crashed:', e); process.exit(1); });
