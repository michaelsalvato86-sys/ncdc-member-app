"""Weekly menu scrape for the Dinner Club app.

Reads each restaurant's menu URL from info.js, pulls dish names and descriptions (prices removed) from the
restaurant's own menu page or PDF, and writes menus.js. A menu is published only when it passes a quality gate;
otherwise the app shows a link to the full menu instead. Restaurant-submitted menus (portal) override these.

Run:  python tools/scrape_menus.py            (writes menus.js + tools/menu_report.json)
      python tools/scrape_menus.py --only brick-alley,reef
"""
import io, json, re, sys, time, datetime, pathlib
import requests
from bs4 import BeautifulSoup, NavigableString

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
MIN_ITEMS = 6           # fewer than this and we link out instead
MAX_ITEMS = 220

PRICE = re.compile(r'(?:(?<=\s)|^)(?:\$\s?)?\d{1,3}(?:[.,]\d{2})?(?:\s*/\s*\$?\d{1,3}(?:[.,]\d{2})?)*\s*$|\$\s?\d{1,3}(?:[.,]\d{2})?|\bM\.?P\.?\b|\bmarket price\b', re.I)
JUNK = re.compile(r'(cookie|privacy|copyright|©|all rights|reservations?|order online|gift card|sign up|newsletter|subscribe|follow us|instagram|facebook|powered by|hours|call us|contact|directions|menu\s*$|^home$|^about|^jobs|careers|download|view (the )?menu|^back|^close|consum|raw or undercooked|food allerg|gratuity|parties of|please inform|^\W+$)', re.I)
HEAD_CLASS = re.compile(r'(menu|section|category)[-_ ]?(section[-_ ]?)?(title|header|heading|name)', re.I)
ITEM_CLASS = re.compile(r'(menu|dish|food)[-_ ]?item[-_ ]?(title|name|header|heading)?$|(dish|item)[-_ ]?(title|name)', re.I)
DESC_CLASS = re.compile(r'desc', re.I)


PRICE_ONLY = re.compile(r'(\$\s?\d{1,3}(?:[.,]\d{2})?(?:\s*[/|]\s*\$?\d{1,3}(?:[.,]\d{2})?)*|\b\d{1,3}(?:\.\d{2})?(?:\s*[/|]\s*\d{1,3}(?:\.\d{2})?)*\s*$|\bM\.?P\.?\b|market price)', re.I)


def price_of(t):
    m = PRICE_ONLY.search(t or '')
    if not m:
        return ''
    p = m.group(0).strip()
    if re.fullmatch(r'[\d.]+', p):
        p = '$' + p
    return 'MP' if p.lower().replace('.', '') in ('mp', 'market price') else p


def clean(t):
    t = re.sub(r'\s+', ' ', t or '').strip('  |•·-–—:')
    t = PRICE.sub('', t).strip('  |•·-–—:')
    return t


def load_info():
    js = (ROOT / 'info.js').read_text(encoding='utf8')
    body = js[js.index('{'): js.rindex('};') + 1]
    return json.loads(body)


def fetch(url):
    r = requests.get(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/pdf,*/*'}, timeout=30, allow_redirects=True)
    r.raise_for_status()
    return r


# ---------- structured HTML (menu platforms that mark items with classes) ----------
def from_structured(soup):
    names = [el for el in soup.find_all(True) if el.get('class') and ITEM_CLASS.search(' '.join(el.get('class')))]
    if len(names) < MIN_ITEMS:
        return None
    sections, cur = [], None
    for el in soup.find_all(True):
        cls = ' '.join(el.get('class') or [])
        # a heading that is, holds, or sits inside a dish name is the dish, not a new section
        is_head = el.name in ('h1', 'h2', 'h3') or (cls and HEAD_CLASS.search(cls) and not ITEM_CLASS.search(cls))
        if is_head and (el in names or any(n in names for n in el.find_all(True)) or any(p in names for p in el.parents)):
            is_head = False
        if is_head:
            t = clean(el.get_text(' '))
            if 2 <= len(t) <= 50 and not JUNK.search(t):
                cur = {'title': t, 'items': []}; sections.append(cur)
        elif el in names:
            n = clean(el.get_text(' '))
            if not (2 <= len(n) <= 80) or JUNK.search(n):
                continue
            desc, price = '', ''
            box = el.parent
            for _ in range(3):
                if box is None: break
                pr = box.find(class_=re.compile('price', re.I))
                if pr is not None and not price:
                    price = price_of(pr.get_text(' '))
                d = box.find(class_=DESC_CLASS)
                if d and d is not el:
                    desc = re.sub(r'\s+', ' ', d.get_text(' ')).strip(); break
                box = box.parent
            if cur is None:
                cur = {'title': 'Menu', 'items': []}; sections.append(cur)
            if not any(i['name'] == n for i in cur['items']):
                cur['items'].append({'name': n, 'desc': desc[:220] if desc and desc != n else '', 'price': price or price_of(el.get_text(' '))})
    return sections


# ---------- text lines (plain HTML or PDF): an item line carries a price, which we then drop ----------
def from_lines(lines):
    sections, cur, prev = [], None, None
    for raw in lines:
        line = re.sub(r'\s+', ' ', raw).strip()
        if not line or len(line) > 260:
            prev = None; continue
        has_price = bool(re.search(r'(\$\s?\d|\b\d{1,3}(?:\.\d{2})?\s*$|\bM\.?P\.?\b|market price)', line, re.I))
        name_part = clean(line)
        if has_price and 2 <= len(name_part) <= 120 and not JUNK.search(name_part):
            # "Dish name ... 18" or "Dish name - description 18"
            m = re.match(r'^([^,.:–—-]{2,70}?)(?:\s*[,:–—-]\s+|\s{2,})(.+)$', name_part)
            name, desc = (m.group(1), m.group(2)) if m and len(m.group(2)) > 12 else (name_part, '')
            if cur is None:
                cur = {'title': 'Menu', 'items': []}; sections.append(cur)
            cur['items'].append({'name': name.strip(), 'desc': desc.strip()[:220], 'price': price_of(line)})
            prev = cur['items'][-1]
        elif (line.isupper() or re.match(r'^[A-Z][A-Za-z&\' ]{2,30}$', line)) and len(line) <= 40 and not JUNK.search(line) and not has_price:
            cur = {'title': line.title() if line.isupper() else line, 'items': []}; sections.append(cur); prev = None
        elif prev is not None and not prev['desc'] and 12 < len(name_part) <= 220 and not JUNK.search(name_part) and name_part[:1].islower() | (',' in name_part):
            prev['desc'] = name_part[:220]
        else:
            prev = None
    return sections


def html_lines(soup):
    for t in soup(['script', 'style', 'noscript', 'nav', 'footer', 'header', 'form', 'svg', 'iframe']):
        t.decompose()
    text = soup.get_text('\n')
    return [l for l in text.split('\n')]


def pdf_lines(data):
    from pypdf import PdfReader
    rd = PdfReader(io.BytesIO(data))
    out = []
    for pg in rd.pages[:12]:
        out += (pg.extract_text() or '').split('\n')
    return out


def normalize(sections):
    """One heading per real section. Fixes pages where every dish name was read as a heading,
    repeated section titles (lunch and dinner copies), and menus shattered into one-dish sections."""
    out, seen_names = [], set()
    for s in sections:
        t = re.sub(r'\s+', ' ', s.get('title') or 'Menu').strip()
        if t.isupper() and len(t) > 3:
            t = t.title().replace("'S ", "'s ")
        items = list(s.get('items') or [])
        if out and (t.lower() in seen_names or t.lower() == 'menu'):
            out[-1]['items'] += items          # a dish name read as a heading
        else:
            same = next((o for o in out if o['title'].lower() == t.lower()), None)
            if same is not None:
                same['items'] += items         # the same section again (lunch/dinner copies)
            else:
                out.append({'title': t, 'items': items})
        seen_names.update(i['name'].lower() for i in items)
    for o in out:                              # drop repeated dishes within a section
        u, k = [], set()
        for i in o['items']:
            if i['name'].lower() not in k:
                k.add(i['name'].lower()); u.append(i)
        o['items'] = u
    out = [o for o in out if o['items']]
    if len(out) >= 8 and sum(1 for o in out if len(o['items']) == 1) > 0.5 * len(out):
        merged = []                            # shattered menu: fold one-dish sections into the one before
        for o in out:
            if merged and len(o['items']) == 1:
                merged[-1]['items'] += o['items']
            else:
                merged.append(o)
        out = merged
    return out


def tidy(sections):
    sections = normalize(sections)
    out, total = [], 0
    for s in sections:
        items = [i for i in s['items'] if 2 <= len(i['name']) <= 80 and not re.fullmatch(r'[\d\W]+', i['name'])]
        seen, uniq = set(), []
        for i in items:
            k = i['name'].lower()
            if k not in seen:
                seen.add(k); uniq.append(i)
        if uniq:
            out.append({'title': s['title'][:50], 'items': uniq})
            total += len(uniq)
    # trim to MAX_ITEMS keeping section order
    trimmed, n = [], 0
    for s in out:
        if n >= MAX_ITEMS: break
        s['items'] = s['items'][:MAX_ITEMS - n]; n += len(s['items']); trimmed.append(s)
    return trimmed, total


_PW = None


def rendered_html(url):
    """Render JavaScript-built menus (Popmenu, Wix, Toast pages) in headless Chromium."""
    global _PW
    from playwright.sync_api import sync_playwright
    if _PW is None:
        _PW = sync_playwright().start()
        _PW.browser = _PW.chromium.launch()
    pg = _PW.browser.new_page(user_agent=UA)
    try:
        pg.goto(url, wait_until='domcontentloaded', timeout=45000)
        pg.wait_for_timeout(4000)
        for _ in range(6):
            pg.mouse.wheel(0, 2500)
            pg.wait_for_timeout(400)
        return pg.content()
    finally:
        pg.close()


def parse_html(text):
    soup = BeautifulSoup(text, 'html.parser')
    secs = from_structured(soup)
    if secs and sum(len(x['items']) for x in secs) >= MIN_ITEMS:
        return secs, 'structured'
    return from_lines(html_lines(BeautifulSoup(text, 'html.parser'))), 'text'


def scrape(rid, url):
    try:
        r = fetch(url)
    except requests.HTTPError:
        secs, how = parse_html(rendered_html(url))
        secs, total = tidy(secs or [])
        return secs, total, how + '+rendered'

    ctype = r.headers.get('content-type', '')
    if 'pdf' in ctype or url.lower().split('?')[0].endswith('.pdf'):
        secs, how = from_lines(pdf_lines(r.content)), 'pdf'
    else:
        soup = BeautifulSoup(r.text, 'html.parser')
        secs, how = from_structured(soup), 'structured'
        if not secs or sum(len(s['items']) for s in secs) < MIN_ITEMS:
            # a linked PDF menu on the page?
            pdf = next((a['href'] for a in soup.find_all('a', href=True) if a['href'].lower().split('?')[0].endswith('.pdf') and 'menu' in (a['href'] + a.get_text()).lower()), None)
            if pdf:
                pdf = requests.compat.urljoin(r.url, pdf)
                try:
                    secs, how = from_lines(pdf_lines(fetch(pdf).content)), 'linked-pdf'
                except Exception:
                    secs = None
            if not secs or sum(len(s['items']) for s in secs) < MIN_ITEMS:
                secs, how = from_lines(html_lines(BeautifulSoup(r.text, 'html.parser'))), 'text'
    secs, total = tidy(secs or [])
    if total < MIN_ITEMS and 'pdf' not in how:
        try:
            s2, h2 = parse_html(rendered_html(url))
            s2, t2 = tidy(s2 or [])
            if t2 > total:
                secs, total, how = s2, t2, h2 + '+rendered'
        except Exception:
            pass
    return secs, total, how


SOCIAL = {'instagram': re.compile(r'https?://(www\.)?instagram\.com/[A-Za-z0-9_.]+/?$'),
          'facebook': re.compile(r'https?://(www\.|m\.)?facebook\.com/(?!sharer|share|dialog|plugins|tr\b)[A-Za-z0-9_.\-/]+/?$'),
          'tiktok': re.compile(r'https?://(www\.)?tiktok\.com/@[A-Za-z0-9_.]+/?$'),
          'x': re.compile(r'https?://(www\.)?(twitter|x)\.com/(?!intent|share)[A-Za-z0-9_]+/?$')}


def socials(url):
    try:
        html = fetch(url).text
    except Exception:
        try:
            html = rendered_html(url)
        except Exception:
            return {}
    out = {}
    for a in BeautifulSoup(html, 'html.parser').find_all('a', href=True):
        h = a['href'].split('?')[0]
        for k, rx in SOCIAL.items():
            if k not in out and rx.match(h):
                out[k] = h
    return out


def main():
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    info = load_info()
    out_path = ROOT / 'menus.js'
    old = {}
    if out_path.exists():
        t = out_path.read_text(encoding='utf8')
        if '{' in t:
            try: old = json.loads(t[t.index('{'): t.rindex('};') + 1])
            except Exception: old = {}
    menus, report = dict(old), {}
    social = {}
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    for rid, i in info.items():
        if only and rid not in only: continue
        if i.get('url'):
            social[rid] = socials(i['url'])
        url = i.get('menu')
        if not url:
            report[rid] = 'no menu url' + (' (kept checked copy)' if (menus.get(rid) or {}).get('how') == 'agent' else ''); (menus.get(rid) or {}).get('how') == 'agent' or menus.pop(rid, None); continue
        try:
            secs, total, how = scrape(rid, url)
            prev = menus.get(rid) or {}
            if total >= MIN_ITEMS and prev.get('how') == 'agent' and how.split('+')[0] in ('text', 'pdf', 'linked-pdf'):
                # a hand-checked copy beats a line-by-line text guess; keep it and say so
                report[rid] = f'kept checked copy (scrape found {total} items by {how})'
            elif total >= MIN_ITEMS:
                menus[rid] = {'checked': now, 'source': url, 'how': how, 'sections': secs}
                report[rid] = f'ok {total} items ({how})'
            else:
                report[rid] = f'too few items ({total}, {how}) - link only'
                if rid in menus and menus[rid].get('source') == url:
                    menus[rid]['stale_since'] = menus[rid].get('stale_since', now)   # keep last good copy, mark stale
                    report[rid] += ' (kept last good copy)'
        except Exception as e:
            report[rid] = f'error {type(e).__name__}: {str(e)[:80]}'
        time.sleep(1.0)   # be polite
    js = ('// Restaurant menus, scraped weekly from each restaurant\'s own website by tools/scrape_menus.py.\n'
          '// Prices are removed. Restaurant-submitted menus in the portal take priority.\n'
          'const MENUS = ' + json.dumps(menus, ensure_ascii=False, indent=0, sort_keys=True) + ';\n')
    out_path.write_text(js, encoding='utf8', newline='\n')
    if not only:
        (ROOT / 'social.js').write_text("// Social links found on each restaurant's own website, refreshed weekly.\n"
                                        'const SOCIAL = ' + json.dumps({k: v for k, v in social.items() if v}, sort_keys=True, indent=0) + ';\n'
                                        'RESTAURANTS.forEach(r => { if (SOCIAL[r.id]) r.social = SOCIAL[r.id]; });\n', encoding='utf8', newline='\n')
    if _PW is not None:
        _PW.browser.close(); _PW.stop()
    (ROOT / 'tools' / 'menu_report.json').write_text(json.dumps({'run': now, 'report': report}, indent=1), encoding='utf8')
    ok = sum(1 for v in report.values() if v.startswith('ok'))
    print(f'{ok} menus published of {len(report)} checked')
    for k, v in sorted(report.items()):
        print(f'  {k:22} {v}')


if __name__ == '__main__':
    main()
