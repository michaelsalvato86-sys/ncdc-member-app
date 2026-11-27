"""Geocode every address in signup.js that geo.js does not have yet (new restaurants). US Census first, OSM fallback."""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import geocode as G
ROOT = G.ROOT
sj = (ROOT / 'signup.js').read_text(encoding='utf8')
sign = json.loads(sj[sj.index('{'): sj.index('};\nconst SIGNUP_IDS') + 1])
gj = (ROOT / 'geo.js').read_text(encoding='utf8')
end = gj.index('};' + chr(10) + 'RESTAURANTS') + 1
geo = json.loads(gj[gj.index('{'): end])
changed = []
for rid, e in sign.items():
    if rid in geo and not e.get('isNew'):
        continue
    a = e.get('address')
    if not a:
        continue
    r = G.census(a) or G.nominatim(e['name'] + ', ' + a) or G.nominatim(a)
    print(rid, a, '->', r)
    if r:
        geo[rid] = [r[0], r[1]]
        changed.append(rid)
head = gj[:gj.index('{')]
(ROOT / 'geo.js').write_text(head + json.dumps(geo) + gj[end:], encoding='utf8')
print('added', changed)
