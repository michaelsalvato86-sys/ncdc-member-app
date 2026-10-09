"""Geocode each restaurant's verified address into geo.js for the map and "near me" sorting.

Uses the US Census Bureau geocoder (free, no key); falls back to OpenStreetMap Nominatim (1 request/second).
Run when addresses change:  python tools/geocode.py
"""
import json, pathlib, time, urllib.parse
import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = 'NewportCountyDinnerClubApp/1.0 (msalvato@mwmwealth.com)'


def census(addr):
    u = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?' + urllib.parse.urlencode(
        {'address': addr, 'benchmark': 'Public_AR_Current', 'format': 'json'})
    m = requests.get(u, timeout=30).json()['result']['addressMatches']
    if m:
        c = m[0]['coordinates']
        return round(c['y'], 6), round(c['x'], 6), 'census'
    return None


def nominatim(q):
    u = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': q, 'format': 'json', 'limit': 1, 'countrycodes': 'us'})
    time.sleep(1.1)
    r = requests.get(u, headers={'User-Agent': UA}, timeout=30).json()
    if r:
        return round(float(r[0]['lat']), 6), round(float(r[0]['lon']), 6), 'osm'
    return None


# Addresses neither geocoder matched on the full string; coordinates from an OSM lookup of the street address.
MANUAL = {'portsmouth-publick': [41.590964, -71.267453]}


def main():
    js = (ROOT / 'info.js').read_text(encoding='utf8')
    info = json.loads(js[js.index('{'): js.rindex('};') + 1])
    out, report = {}, {}
    for rid, i in info.items():
        a = i.get('address')
        if not a:
            report[rid] = 'no address'; continue
        hit = None
        try:
            hit = census(a)
        except Exception as e:
            report[rid] = 'census error ' + type(e).__name__
        for q in ([a, a.split(',')[0] + ', ' + (i.get('town') or '') + ', RI'] if not hit else []):
            try:
                hit = nominatim(q)
            except Exception:
                hit = None
            if hit:
                break
        if hit:
            lat, lng, src = hit
            # sanity: Newport County and nearby (Bristol / Tiverton) only
            if 41.40 < lat < 41.80 and -71.50 < lng < -71.05:
                out[rid] = [lat, lng]; report[rid] = src
            else:
                report[rid] = f'rejected out-of-area {lat},{lng}'
        else:
            report.setdefault(rid, 'no match')
    for k, v in MANUAL.items():
        out.setdefault(k, v)
    (ROOT / 'geo.js').write_text('// Restaurant coordinates from tools/geocode.py (US Census geocoder, OSM fallback).\n'
                                 'const GEO = ' + json.dumps(out, sort_keys=True) + ';\n'
                                 'RESTAURANTS.forEach(r => { if (GEO[r.id]) r.geo = GEO[r.id]; });\n', encoding='utf8', newline='\n')
    print(len(out), 'of', len(info), 'geocoded')
    for k, v in sorted(report.items()):
        if v not in ('census',):
            print(' ', k, v)


if __name__ == '__main__':
    main()
