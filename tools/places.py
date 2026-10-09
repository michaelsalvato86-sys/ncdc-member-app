"""Google rating, review count and opening hours for each restaurant, via the Places API (New).

Needs GOOGLE_PLACES_API_KEY in the environment, with "Places API (New)" enabled on that Google Cloud project.
Cost: one Text Search per restaurant per run (58 a week).
Writes places.js. If the key is missing or refused, places.js is left as it was and the reason is reported.
"""
import json, os, pathlib, sys, time
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIELDS = 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.regularOpeningHours.weekdayDescriptions,places.googleMapsUri,places.businessStatus'


def main():
    key = os.environ.get('GOOGLE_PLACES_API_KEY', '').strip()
    if not key:
        print('places: skipped - GOOGLE_PLACES_API_KEY not set'); return 0
    data = ROOT / 'data.js'
    js = (ROOT / 'info.js').read_text(encoding='utf8')
    info = json.loads(js[js.index('{'): js.rindex('};') + 1])
    names = dict(__import__('re').findall(r"\{ id: '([^']+)', name: [\"']([^\"']+)", data.read_text(encoding='utf8')))
    out, miss = {}, []
    for rid, i in info.items():
        if not i.get('address'):
            continue
        q = f"{names.get(rid, rid)}, {i['address']}"
        r = requests.post('https://places.googleapis.com/v1/places:searchText', json={'textQuery': q, 'maxResultCount': 1},
                          headers={'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS}, timeout=30)
        if r.status_code == 403:
            print('places: refused -', r.json().get('error', {}).get('message', '')[:160]); return 0
        r.raise_for_status()
        p = (r.json().get('places') or [None])[0]
        # only accept a match whose street number agrees with our verified address
        if not p or i['address'].split(' ')[0] not in (p.get('formattedAddress') or ''):
            miss.append(rid); continue
        out[rid] = {k: v for k, v in {
            'rating': p.get('rating'), 'count': p.get('userRatingCount'),
            'hours': (p.get('regularOpeningHours') or {}).get('weekdayDescriptions'),
            'url': p.get('googleMapsUri'), 'status': p.get('businessStatus')}.items() if v}
        time.sleep(0.2)
    (ROOT / 'places.js').write_text('// Google ratings and hours, refreshed weekly by tools/places.py.\nconst PLACES = '
                                   + json.dumps(out, sort_keys=True, indent=0) + ';\n', encoding='utf8', newline='\n')
    print(f'places: {len(out)} matched, {len(miss)} not matched: {", ".join(miss)}')
    closed = [k for k, v in out.items() if v.get('status') in ('CLOSED_PERMANENTLY', 'CLOSED_TEMPORARILY')]
    if closed:
        print('places: Google marks closed:', ', '.join(closed))
    return 0


if __name__ == '__main__':
    sys.exit(main())
