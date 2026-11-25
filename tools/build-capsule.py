#!/usr/bin/env python3
"""Build the NestJS docs capsule ZIP from /tmp/nestdocs-probe.
Capsule layout: manifest.json, LICENSE, icon.svg, docs/**/*.md, assets/** (only
images actually referenced by the .md files). TOC order comes from nav-items.ts.
Logs every unmapped nav path and every md file not in the TOC (appendix).
"""
import json, os, re, sys, zipfile
from datetime import date

SRC = '/tmp/nestdocs-probe'
NAV = os.path.expanduser('~/workspace/nestjs-docs-pwa/nav-items.ts')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'capsules', 'nestjs-docs-v1.zip')
LOG = os.path.join(ROOT, 'capsules', 'nestjs-build-log.json')

OVERRIDES = {
    '/': 'introduction.md',
    '/providers': 'components.md',
    '/middleware': 'middlewares.md',
    '/fundamentals/custom-providers': 'fundamentals/dependency-injection.md',
    '/fundamentals/async-providers': 'fundamentals/async-components.md',
    '/fundamentals/injection-scopes': 'fundamentals/provider-scopes.md',
    '/fundamentals/module-ref': 'fundamentals/module-reference.md',
    '/fundamentals/testing': 'fundamentals/unit-testing.md',
    '/data/mongodb': 'data/mongo.md',
    '/cli/monorepo': 'cli/workspaces.md',
    '/http/session': 'http/sessions.md',
    '/graphql/resolvers': 'graphql/resolvers-map.md',
    '/graphql/generating-sdl': 'graphql/schema-generator.md',
    '/faq/common-errors': 'faq/errors.md',
    '/devtools/ci-cd-integration': 'devtools/ci-cd.md',
    '/standalone-applications': 'application-context.md',
    '/migration-guide': 'migration.md',
    '/discover/companies': 'discover/who-uses.md',
    '/deployment': 'deployment.md',
    '/support': 'support.md',
}

def md_files():
    out = []
    for dp, _, fns in os.walk(os.path.join(SRC, 'content')):
        for fn in fns:
            if fn.endswith('.md'):
                out.append(os.path.relpath(os.path.join(dp, fn), os.path.join(SRC, 'content')))
    return sorted(out)

def first_heading(path):
    with open(os.path.join(SRC, 'content', path), encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if line.startswith('#'):
                return line.lstrip('#').strip()
    return ''

def parse_nav():
    """Return ordered [(group, title, path)] — group is the enclosing section title."""
    src = open(NAV, encoding='utf-8').read()
    # Split into top-level items by tracking brace depth at the NAV_ITEMS array level.
    items = []
    # Find each title occurrence in order with its following block up to next title.
    titles = list(re.finditer(r"title:\s*'([^']+)'", src))
    # Determine groups: a title whose block (until next title) contains 'children:' is a group.
    groups = []
    for i, m in enumerate(titles):
        end = titles[i + 1].start() if i + 1 < len(titles) else len(src)
        block = src[m.start():end]
        if 'children:' in block and 'path:' not in block.split('children:')[0]:
            groups.append((m.start(), m.group(1)))
    entries = []
    for i, m in enumerate(titles):
        end = titles[i + 1].start() if i + 1 < len(titles) else len(src)
        block = src[m.start():end]
        pm = re.search(r"path:\s*'([^']+)'", block)
        if not pm:
            continue  # group header or external-only item
        if 'children:' in block and block.index('children:') < block.index('path:'):
            continue  # group header that also carries a path (e.g. Deployment is a leaf; handled below)
        title, path = m.group(1), pm.group(1)
        # enclosing group = last group title starting before this title
        grp = None
        for gs, gt in groups:
            if gs < m.start():
                grp = gt
        # A top-level leaf (Deployment, Standalone apps, Migration guide, Support us)
        # must not inherit the previous section as its group.
        if grp and title in ('Deployment', 'Standalone apps', 'Migration guide', 'Support us'):
            grp = None
        entries.append((grp, title, path))
    return entries

def resolve(path, all_md, by_stem, by_title):
    if path in OVERRIDES:
        return OVERRIDES[path]
    p = path.lstrip('/')
    cand = p + '.md'
    if cand in all_md:
        return cand
    stem = p.rsplit('/', 1)[-1]
    if stem in by_stem:
        return by_stem[stem]
    return None

def main():
    if not os.path.isdir(os.path.join(SRC, 'content')):
        print('ERROR: source probe missing at', SRC); sys.exit(1)
    commit = open(os.path.join(SRC, '.git', 'HEAD'), encoding='utf-8').read().strip() if False else None
    import subprocess
    commit = subprocess.run(['git', '-C', SRC, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    all_md = md_files()
    by_stem = {}
    for f in all_md:
        by_stem.setdefault(os.path.splitext(os.path.basename(f))[0], f)
    by_title = {}
    for f in all_md:
        h = first_heading(f).lower()
        if h:
            by_title.setdefault(h, f)

    nav = parse_nav()
    toc, used, unmapped = [], set(), []
    for grp, title, path in nav:
        f = resolve(path, set(all_md), by_stem, by_title)
        if not f:
            # title match fallback
            f = by_title.get(title.lower())
        if not f:
            unmapped.append({'title': title, 'path': path})
            continue
        used.add(f)
        toc.append({'group': grp, 'title': title, 'path': path, 'file': 'docs/' + f})

    appendix = [f for f in all_md if f not in used]
    for f in appendix:
        toc.append({'group': 'Appendix', 'title': first_heading(f) or os.path.basename(f), 'path': '/appendix/' + os.path.splitext(os.path.basename(f))[0], 'file': 'docs/' + f})

    # Referenced images only
    refs = set()
    for f in all_md:
        txt = open(os.path.join(SRC, 'content', f), encoding='utf-8', errors='replace').read()
        for r in re.findall(r'/assets/([^\s)"\'`]+)', txt):
            refs.add(r)
    assets = []
    missing_assets = []
    for r in sorted(refs):
        p = os.path.join(SRC, 'src', 'assets', r)
        if os.path.isfile(p):
            assets.append(r)
        else:
            missing_assets.append(r)

    manifest = {
        'id': 'nestjs-docs', 'name': 'NestJS Documentation', 'nameFa': 'داکیومنت NestJS',
        'version': '1.0.0', 'source': 'https://github.com/nestjs/docs.nestjs.com',
        'sourceCommit': commit, 'updated': str(date.today()), 'icon': 'icon.svg',
        'docsRoot': 'docs', 'toc': toc,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        z.writestr('manifest.json', json.dumps(manifest, ensure_ascii=False, indent=2))
        z.write(os.path.join(SRC, 'LICENSE'), 'LICENSE')
        icon_src = os.path.join(SRC, 'src', 'assets', 'logo-small.svg')
        z.write(icon_src, 'icon.svg')
        for f in all_md:
            z.write(os.path.join(SRC, 'content', f), 'docs/' + f)
        for r in assets:
            z.write(os.path.join(SRC, 'src', 'assets', r), 'assets/' + r)
    stats = {
        'mdCount': len(all_md), 'imageCount': len(assets), 'zipBytes': os.path.getsize(OUT),
        'zipFile': 'nestjs-docs-v1.zip', 'sourceCommit': commit, 'updated': str(date.today()),
        'tocEntries': len(toc), 'unmappedNav': unmapped, 'appendixFiles': appendix,
        'missingAssets': missing_assets,
    }
    with open(LOG, 'w', encoding='utf-8') as fh:
        json.dump(stats, fh, ensure_ascii=False, indent=2)
    index = {'capsules': [{
        'id': 'nestjs-docs', 'name': 'NestJS Documentation', 'nameFa': 'داکیومنت NestJS',
        'version': '1.0.0', 'file': 'nestjs-docs-v1.zip', 'bytes': stats['zipBytes'],
        'files': len(all_md) + len(assets), 'updated': str(date.today()),
        'source': 'https://github.com/nestjs/docs.nestjs.com',
    }]}
    with open(os.path.join(ROOT, 'capsules', 'index.json'), 'w', encoding='utf-8') as fh:
        json.dump(index, fh, ensure_ascii=False, indent=2)
    print(json.dumps(stats, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
