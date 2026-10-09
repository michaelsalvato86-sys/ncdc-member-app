"""Weekly refresh for the Dinner Club app. Runs every Monday from .github/workflows/weekly-refresh.yml.

1. Menus (with prices) and social links from each restaurant's own website  -> menus.js, social.js
2. Google ratings and hours (when GOOGLE_PLACES_API_KEY is set)              -> places.js
3. Map coordinates for every verified address                                -> geo.js
4. Quality gate: every data file must parse, and menu coverage must not collapse.
   If the gate fails, the previous files are restored and the run exits 1 (GitHub emails the repo owner).
5. Writes tools/weekly_report.md (also shown on the GitHub Actions run page).
"""
import datetime, json, pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ['menus.js', 'social.js', 'places.js', 'geo.js']


def load(name, var):
    t = (ROOT / name).read_text(encoding='utf8')
    return json.loads(t[t.index('{'): t.index('};') + 1]) if '{' in t else {}


def run(step, *args):
    p = subprocess.run([sys.executable, *args], cwd=ROOT, capture_output=True, text=True)
    out = (p.stdout + p.stderr).strip()
    return p.returncode, '\n'.join(l for l in out.splitlines() if 'fontTools' not in l and 'wrong pointing' not in l)


def main():
    backup = {f: (ROOT / f).read_text(encoding='utf8') for f in FILES if (ROOT / f).exists()}
    before = len(load('menus.js', 'MENUS')) if (ROOT / 'menus.js').exists() else 0
    log = []
    for step, args in [('Menus and social links', ['tools/scrape_menus.py']),
                       ('Google ratings and hours', ['tools/places.py']),
                       ('Map coordinates', ['tools/geocode.py'])]:
        rc, out = run(step, *args)
        log.append((step, rc, out))

    problems = []
    for f in FILES:
        try:
            load(f, '')
        except Exception as e:
            problems.append(f'{f} does not parse: {e}')
    after = len(load('menus.js', 'MENUS')) if not problems else 0
    if before and after < before * 0.7:
        problems.append(f'menu coverage fell from {before} to {after} restaurants')
    geo = len(load('geo.js', 'GEO')) if not problems else 0
    if geo < 50:
        problems.append(f'only {geo} restaurants have map coordinates')

    if problems:
        for f, t in backup.items():
            (ROOT / f).write_text(t, encoding='utf8', newline='\n')

    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    md = [f'# Dinner Club weekly refresh - {now}', '',
          f'**Result:** {"FAILED - previous data kept" if problems else "OK"}',
          f'**Menus on the app:** {after} restaurants (was {before})', f'**On the map:** {geo} restaurants', '']
    if problems:
        md += ['## Problems'] + [f'- {p}' for p in problems] + ['']
    for step, rc, out in log:
        md += [f'## {step} (exit {rc})', '```', out[-4000:], '```', '']
    (ROOT / 'tools' / 'weekly_report.md').write_text('\n'.join(md), encoding='utf8')
    print('\n'.join(md))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
