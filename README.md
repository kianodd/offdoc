# OffDoc

Generic offline PWA for reading documentation as separate **capsules** — one
compressed file per site, loaded in the browser and read offline.

- **Generic, not NestJS-only.** The first capsule is the NestJS docs; later
  sites get their own capsule in the same format.
- **Capsule = Markdown + images + site icon** (+ a small `manifest.json`
  with the reading order). Format is ZIP.
- **Fully offline PWA.** The app shell works offline. There is no online
  doc browsing: you download a capsule file, then load that file in the app.
- **Session-only.** A loaded capsule is kept only in memory and is **not**
  cached by the browser — load the file again each session.
- **Bilingual UI** (Persian / English). Doc text itself stays English, LTR.
- **Settings:** language, appearance (Auto / Light / Dark), and app update
  check (current version, check now, apply update & reload).
- **Code blocks** render fully syntax-highlighted, never truncated, with a
  copy button that copies the whole block.

## Capsules

| Capsule | Version | Files | Size |
| --- | --- | --- | --- |
| NestJS Documentation | 1.0.0 | 233 | 8.4 MB |

Source of the NestJS docs: https://github.com/nestjs/docs.nestjs.com
(MIT License, included in the capsule). Source commit
`8decee4911aacaabfbd7d8c67a48af350c560501`.

## Build a capsule

`tools/build-capsule.py` builds `capsules/nestjs-docs-v1.zip` from a sparse
clone of the NestJS docs repo (see the script header). It copies every `.md`
file, only the images actually referenced by the docs, the site icon, the
MIT license, and a `manifest.json` whose TOC follows the official
`nav-items.ts` reading order.

## Publish

`push.py` uploads every file serially via the GitHub Contents API with a
per-file SHA check, then enables GitHub Pages. Live site:
https://kianodd.github.io/docs-capsules/
