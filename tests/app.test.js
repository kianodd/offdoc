// app.test.js — node, no deps. i18n parity + version match + no leftover tokens.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
let fails = 0;
function check(name, ok, extra) {
  if (ok) console.log('  PASS ' + name);
  else { fails++; console.log('  FAIL ' + name + ' ' + (extra || '')); }
}
const appSrc = fs.readFileSync(path.join(root, 'js', 'app.js'), 'utf8');
// Extract the I18N literal only (app.js touches localStorage at top level).
const start = appSrc.indexOf('const I18N = ');
const end = appSrc.indexOf(';\nconst $', start);
const I18N = eval('(' + appSrc.slice(start + 'const I18N = '.length, end) + ')'); // eslint-disable-line no-eval
const faKeys = Object.keys(I18N.fa).sort();
const enKeys = Object.keys(I18N.en).sort();
check('i18n fa/en identical key sets', JSON.stringify(faKeys) === JSON.stringify(enKeys),
  'fa-only=' + faKeys.filter((k) => !I18N.en[k]) + ' en-only=' + enKeys.filter((k) => !I18N.fa[k]));
check('i18n has >=40 keys', faKeys.length >= 40, 'got ' + faKeys.length);
const empty = faKeys.filter((k) => !I18N.fa[k] || !I18N.en[k] || /undefined|TODO|XXX/.test(I18N.fa[k] + I18N.en[k]));
check('no empty/undefined/TODO strings', empty.length === 0, empty.join(','));
const verJs = fs.readFileSync(path.join(root, 'js', 'version.js'), 'utf8');
const verJson = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
const m = verJs.match(/APP_VERSION\s*=\s*'([^']+)'/);
check('version.json matches js/version.js', m && m[1] === verJson.version, (m && m[1]) + ' vs ' + verJson.version);
check('sw.js cache name matches version', fs.readFileSync(path.join(root, 'sw.js'), 'utf8').includes('docs-capsules-v' + verJson.version));
for (const f of ['index.html', 'js/app.js', 'css/style.css']) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  check(f + ' has no CDN references', !/https?:\/\/(cdn|unpkg|cdnjs|fonts\.googleapis)/.test(src));
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
check('index.html references local vendor files', html.includes('js/vendor/jszip.min.js') && html.includes('js/vendor/marked.min.js'));
console.log('\napp.test: ' + (fails ? fails + ' failed' : 'all passed'));
process.exit(fails ? 1 : 0);
