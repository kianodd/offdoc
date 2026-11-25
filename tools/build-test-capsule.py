#!/usr/bin/env python3
"""Build the tiny OffDoc test capsule (3 short pages, ~4 KB).

Purpose: give the user a SECOND, distinct capsule so multi-capsule loading
can actually be observed. Right now the catalog has only the NestJS capsule,
so re-loading the same zip just replaces itself (dedupe by id) and the panel
still shows 1 entry — which looks like "multi-capsule doesn't work".

This capsule is deliberately NOT added to capsules/index.json or the live
catalog: it is handed to the user as a file to load from Downloads.
Run: python3 tools/build-test-capsule.py
Output: capsules/offdoc-test-capsule-v1.zip
"""
import json
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'capsules', 'offdoc-test-capsule-v1.zip')

PAGES = [
    ('docs/01-what-is-this.md', 'What is this capsule?', '''# What is this capsule?

This is a tiny test capsule for OffDoc. It has only three short pages and
no images, so it loads instantly.

It exists for one reason: to check that loading **several capsules at once**
works. The app's download list has only one real capsule (NestJS), so loading
the same NestJS file twice just replaces itself — the panel still shows one
entry. That is the dedupe rule working as designed, not a bug.

Load this capsule **as well as** the NestJS capsule, and the panel should
show two entries.
'''),
    ('docs/02-multi-capsule.md', 'How multi-capsule works', '''# How multi-capsule works

- Each loaded capsule stays in memory for this session only. Closing the
  app unloads them all; nothing is cached in the browser.
- Loading the same capsule file again replaces it — it never creates a
  duplicate entry.
- The button above the article (loaded capsules) opens the side panel.
  Tap a capsule there to switch to it; tap the ✕ to unload it.
- Switching capsules keeps each capsule's place: reopening one returns to
  the chapter you were reading in it.
'''),
    ('docs/03-try-it.md', 'Try it', '''# Try it

1. Load the NestJS capsule from the Reading tab.
2. Open the loaded-capsules panel and tap "Load another capsule".
3. Pick this file (`offdoc-test-capsule-v1.zip`).
4. The panel should now list **two** capsules, with a badge showing 2.
5. Tap each row to switch between NestJS docs and this test capsule.

If the file picker never opens in step 2, or the panel still shows only
one capsule after step 3, that is a real bug — send a screenshot.
'''),
]

ICON_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="42" fill="#e0234e"/><text x="96" y="128" font-family="sans-serif" font-size="96" font-weight="bold" fill="#fff" text-anchor="middle">T</text></svg>
'''

manifest = {
    'id': 'offdoc-test',
    'name': 'OffDoc Test Capsule',
    'nameFa': 'کپسول تست OffDoc',
    'version': '1.0.0',
    'source': 'https://kianodd.github.io/offdoc/',
    'updated': '2026-11-25',
    'icon': 'icon.svg',
    'docsRoot': 'docs',
    'toc': [
        {'group': None, 'title': title, 'path': '/' + os.path.splitext(os.path.basename(f))[0], 'file': f}
        for f, title, _ in PAGES
    ],
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    z.writestr('manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2))
    z.writestr('icon.svg', ICON_SVG)
    for fname, _title, body in PAGES:
        z.writestr(fname, body)

print('wrote', OUT, os.path.getsize(OUT), 'bytes,',
      len(PAGES), 'pages')
