# NADIR — ITEA 4 Project 22014 (static site)

Lightweight, static microsite for the **NADIR** project under the [ITEA](https://itea4.org/) programme.  
Content is aligned with public ITEA listings; update copy when the official [project page](https://itea4.org/project/nadir.html) changes.

## Layout: fragments + build

The page is split into small HTML files under `src/`, then assembled into **`index.html`** by `build.py` (Python 3, stdlib only). This keeps each section in its own file without adding Node or other heavy tooling.

| Location | Role |
|----------|------|
| `src/includes/head.html` | `<head>` contents (meta, title, CSS link) |
| `src/includes/top.html` | Skip link + site header / nav |
| `src/includes/hero.html` | Hero block (above `<main>`) |
| `src/includes/footer.html` | Footer + year script |
| `src/sections/*.html` | One file per main section |
| `src/sections/order.txt` | Section order inside `<main>` (one filename per line) |

After editing any fragment:

```bash
python3 build.py
```

Commit both **`src/`** and the regenerated **`index.html`** so local `file://` opens and PR checks stay in sync. Pull requests run **`python3 build.py --check`** to ensure `index.html` matches the fragments.

### Tabs

Main sections are shown as **tabs**: a tab strip under the hero switches panels; the **header links** control the same tabs. URLs use fragments (`#news`, `#partners`, …) for sharing and back/forward. Behaviour is implemented in **`js/tabs.js`** (loaded with `defer`). Tab labels and order follow **`build.py`** (`TAB_LABELS` + `src/sections/order.txt`).

## Publish under EarthDaily on GitHub

This repository must be created in the **EarthDaily** GitHub organization (we cannot create it from here).

### 1. Create the repository

- On GitHub: **New repository** → Owner: **earthdaily** → name e.g. `nadir-itea-22014` → **Public** → Create (no README, or replace with this project).

### 2. Push this folder as the initial commit 

From your machine (adjust the remote URL if you chose a different repo name):

```bash
cd nadir-itea-22014
git init
git add .
git commit -m "Initial NADIR ITEA project site"
git branch -M main
git remote add origin https://github.com/earthdaily/nadir-itea-22014.git
git push -u origin main
```

Or with [GitHub CLI](https://cli.github.com/) (as an org member with permission to create repos):

```bash
cd nadir-itea-22014
git init && git add . && git commit -m "Initial NADIR ITEA project site"
gh repo create earthdaily/nadir-itea-22014 --public --source=. --remote=origin --push
```

### 3. Enable GitHub Pages

1. Repo **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. The workflow `.github/workflows/pages.yml` runs `build.py`, then publishes `index.html`, `css/`, and `assets/`
4. After the first run, the site URL will appear under Pages (typically `https://earthdaily.github.io/nadir-itea-22014/`)

### Optional: custom domain

Add a `CNAME` file at the repo root with your hostname, configure DNS at your provider, and set **Custom domain** in Pages settings.

## Local preview

```bash
python3 build.py
python3 -m http.server 8080
# visit http://127.0.0.1:8080
```

## Other paths

| Path | Purpose |
|------|---------|
| `build.py` | Assembles `index.html` from `src/` |
| `index.html` | Generated full page (commit after `build.py`) |
| `css/style.css` | Theme (ITEA-inspired blues / teal accent) |
| `js/tabs.js` | Tab UI for main sections + hash / header sync |
| `assets/nadir-logo.svg` | Project logo |
| `assets/partners/*.svg` | Partner logos (replace placeholders with approved brand files) |

## Maintenance

- Edit files under `src/`, run `python3 build.py`, commit `src/` and `index.html`.
- Reconcile consortium names, dates, and links with [itea4.org/project/nadir.html](https://itea4.org/project/nadir.html) before formal communications.
