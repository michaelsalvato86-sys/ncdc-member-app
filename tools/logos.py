"""Small logo for each restaurant, taken from its own website, for the list and the restaurant page.

Looks for, in order: an <img> marked as the logo (src/alt/class/id contains "logo"), the apple-touch-icon,
then a large favicon. Saves logos/<id>.png as a 128px square on white and writes logos.js.
Restaurants without a usable logo keep the letter badge. Run when the restaurant list changes.
"""
import io, json, pathlib, re, sys
import requests
from bs4 import BeautifulSoup
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
OUT = ROOT / 'logos'
# Checked by eye 2026-10-08: these sites mark someone else's image as a logo (TripAdvisor badge, Marriott brand,
# a booking-widget logo). Leave them on the letter badge until the restaurant sends its own.
REJECT = {'annies', 'skiff-bar', 'stoneacre-brasserie', 'stoneacre-garden'}


def get(url, **kw):
    return requests.get(url, headers={'User-Agent': UA}, timeout=25, **kw)


def candidates(html, base):
    soup = BeautifulSoup(html, 'html.parser')
    out = []
    for img in soup.find_all('img'):
        attrs = ' '.join(str(img.get(k, '')) for k in ('src', 'alt', 'class', 'id', 'data-src'))
        if re.search(r'logo', attrs, re.I):
            src = img.get('src') or img.get('data-src') or ''
            if src and not src.startswith('data:'):
                out.append(('img', requests.compat.urljoin(base, src)))
    for rel in ('apple-touch-icon', 'apple-touch-icon-precomposed', 'icon', 'shortcut icon'):
        for l in soup.find_all('link', rel=lambda v: v and rel in (' '.join(v) if isinstance(v, list) else v).lower()):
            if l.get('href'):
                out.append(('icon', requests.compat.urljoin(base, l['href'])))
    return out


def square(img):
    img = img.convert('RGBA')
    bbox = Image.new('RGBA', img.size, (255, 255, 255, 0))
    # trim transparent / white margins
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    comp = Image.alpha_composite(bg, img).convert('RGB')
    diff = Image.eval(comp, lambda px: 255 - px)
    box = diff.getbbox()
    if box:
        img = img.crop(box)
    w, h = img.size
    side = max(w, h)
    canvas = Image.new('RGBA', (side, side), (255, 255, 255, 255))
    canvas.alpha_composite(img, ((side - w) // 2, (side - h) // 2))
    return canvas.convert('RGB').resize((128, 128), Image.LANCZOS)


def is_usable(img):
    w, h = img.size
    if max(w, h) < 48:
        return False
    # reject near-blank images (e.g. white logo meant for a dark header)
    rgb = img.convert('RGBA')
    bg = Image.new('RGBA', rgb.size, (255, 255, 255, 255))
    comp = Image.alpha_composite(bg, rgb).convert('L')
    hist = comp.histogram()
    light = sum(hist[230:]) / max(1, sum(hist))
    return light < 0.985


def main():
    js = (ROOT / 'info.js').read_text(encoding='utf8')
    info = json.loads(js[js.index('{'): js.rindex('};') + 1])
    OUT.mkdir(exist_ok=True)
    got, report = {}, {}
    for rid, i in info.items():
        url = i.get('url')
        if rid in REJECT:
            report[rid] = 'rejected by eye'; continue
        if not url:
            report[rid] = 'no website'; continue
        try:
            r = get(url)
            r.raise_for_status()
        except Exception as e:
            report[rid] = f'site error {type(e).__name__}'; continue
        done = False
        for kind, src in candidates(r.text, r.url):
            if src.lower().endswith('.svg'):
                continue
            try:
                im = Image.open(io.BytesIO(get(src).content))
                im.load()
            except Exception:
                continue
            if not is_usable(im):
                continue
            square(im).save(OUT / f'{rid}.png', optimize=True)
            got[rid] = f'logos/{rid}.png'
            report[rid] = f'{kind}: {src[:90]}'
            done = True
            break
        if not done:
            report.setdefault(rid, 'no usable logo')
    (ROOT / 'logos.js').write_text("// Small logos from each restaurant's own website (tools/logos.py).\n"
                                   'const LOGOS = ' + json.dumps(got, sort_keys=True) + ';\n'
                                   'RESTAURANTS.forEach(r => { if (LOGOS[r.id]) r.logo = LOGOS[r.id]; });\n', encoding='utf8', newline='\n')
    (ROOT / 'tools' / 'logo_report.json').write_text(json.dumps(report, indent=1), encoding='utf8')
    print(len(got), 'logos of', len(info))
    for k, v in sorted(report.items()):
        if not v.startswith(('img', 'icon')):
            print(' ', k, v)


if __name__ == '__main__':
    main()
