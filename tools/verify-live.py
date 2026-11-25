import hashlib, json, os, subprocess, time
GH = os.path.expanduser('~/workspace/custom-connectors/custom.github-pat/bin/gh.py')
ROOT = os.path.expanduser('~/workspace/docs-capsules')
FILES = ['index.html','README.md','manifest.webmanifest','sw.js','version.json','css/style.css','js/app.js','js/version.js','js/vendor/highlight-dark.css','js/vendor/highlight.css','js/vendor/highlight.min.js','js/vendor/jszip.min.js','js/vendor/marked.min.js','fonts/Vazirmatn-Bold.woff2','fonts/Vazirmatn-Regular.woff2','icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','capsules/index.json','capsules/nestjs-build-log.json','capsules/nestjs-docs-v1.zip','tools/build-capsule.py','tests/app.test.js','tests/render.test.js','tests/test-capsule.py']
def gh(method, path):
    out = subprocess.run(['python3', GH, method, path], capture_output=True, text=True, timeout=120)
    return json.loads(out.stdout)
def blob_sha(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
for i in range(12):
    p = gh('GET', '/repos/kianodd/offdoc/pages')
    st = (p.get('result') or {}).get('status')
    print('pages status:', st)
    if st == 'built': break
    time.sleep(10)
tree = gh('GET', '/repos/kianodd/offdoc/git/trees/main?recursive=1')
remote = {t['path']: t['sha'] for t in (tree.get('result') or {}).get('tree', []) if t['type'] == 'blob'}
missing, mismatch = [], []
for rel in FILES:
    data = open(os.path.join(ROOT, rel), 'rb').read()
    ls = blob_sha(data); rs = remote.get(rel)
    if rs is None: missing.append(rel)
    elif rs != ls: mismatch.append(rel)
print('remote blobs:', len(remote))
print('missing:', missing); print('mismatch:', mismatch)
print('VERIFY:', 'PASS' if not missing and not mismatch else 'FAIL')
