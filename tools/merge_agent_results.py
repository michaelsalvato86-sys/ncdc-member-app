"""Merge the research agents' menus and star ratings (2026-10-08) into menus.js and ratings.js.

Agent menus are added only where the weekly scraper has none. The scraper keeps a last good copy, so these
stay until a restaurant's own site yields a better one, or the restaurant sends an update in the portal.
Ratings carry their source (Google / TripAdvisor / Yelp) and the page they were read from.
Usage: python tools/merge_agent_results.py <dir with agent_out*.json>
"""
import datetime, glob, json, os, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def load_js(name):
    t = (ROOT / name).read_text(encoding='utf8')
    return json.loads(t[t.index('{'): t.rindex('};') + 1]) if '{' in t else {}


def main(src):
    menus = load_js('menus.js')
    ratings = load_js('ratings.js') if (ROOT / 'ratings.js').exists() else {}
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    added, rated, skipped = [], [], []
    for f in sorted(glob.glob(os.path.join(src, 'agent_out*.json'))):
        for r in json.load(open(f, encoding='utf8')):
            rid = r.get('id')
            rt = r.get('rating') or None
            # fewer than 10 reviews says little about a restaurant; leave those off
            if rt and isinstance(rt.get('value'), (int, float)) and 1 <= rt['value'] <= 5 and rt.get('source_url') and (rt.get('count') or 0) >= 10:
                ratings[rid] = {'value': round(float(rt['value']), 1), 'count': rt.get('count'), 'source': rt.get('source') or 'Reviews',
                                'url': rt['source_url'], 'asOf': now[:10]}
                rated.append(rid)
            m = r.get('menu') or None
            if m and m.get('sections'):
                secs = []
                for s in m['sections']:
                    items = [{'name': str(i.get('name', '')).strip()[:90], 'desc': str(i.get('desc') or '').strip()[:220],
                              'price': str(i.get('price') or '').strip()[:40]} for i in s.get('items', []) if str(i.get('name', '')).strip()]
                    if items:
                        secs.append({'title': str(s.get('title') or 'Menu').strip()[:50], 'items': items})
                n = sum(len(s['items']) for s in secs)
                if n >= 6 and rid not in menus:
                    menus[rid] = {'checked': now, 'source': r.get('menu_source') or '', 'how': 'agent', 'sections': secs}
                    added.append(f'{rid} ({n})')
                elif rid in menus:
                    skipped.append(f'{rid} (already had one)')
    (ROOT / 'menus.js').write_text("// Restaurant menus, scraped weekly from each restaurant's own website by tools/scrape_menus.py.\n"
                                   '// Prices as printed. Restaurant-submitted menus in the portal take priority.\n'
                                   'const MENUS = ' + json.dumps(menus, ensure_ascii=False, indent=0, sort_keys=True) + ';\n', encoding='utf8', newline='\n')
    (ROOT / 'ratings.js').write_text('// Star ratings with their source page, gathered 2026-10-08. Google Places data (places.js) replaces these when enabled.\n'
                                     'const RATINGS = ' + json.dumps(ratings, ensure_ascii=False, indent=0, sort_keys=True) + ';\n', encoding='utf8', newline='\n')
    print(f'menus added: {len(added)} -> {", ".join(added)}')
    print(f'ratings: {len(ratings)} total ({len(rated)} this run)')
    by = {}
    for v in ratings.values():
        by[v['source']] = by.get(v['source'], 0) + 1
    print('by source:', by)
    print(f'menus now: {len(menus)} of 58')


if __name__ == '__main__':
    main(sys.argv[1])
