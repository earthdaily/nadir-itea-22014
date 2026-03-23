# NADIR — ITEA 4 Project 22014 (static site)

Lightweight, static microsite for the **NADIR** project under the [ITEA](https://itea.org/) programme.  
Content is aligned with public ITEA listings; update copy when the official [project page](https://itea4.org/project/nadir.html) changes.

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
3. The workflow `.github/workflows/pages.yml` will deploy on every push to `main`
4. After the first run, the site URL will appear under Pages (typically `https://earthdaily.github.io/nadir-itea-22014/`)

### Optional: custom domain

Add a `CNAME` file at the repo root with your hostname, configure DNS at your provider, and set **Custom domain** in Pages settings.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# visit http://127.0.0.1:8080
```

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Single-page site (News + Partners sections) |
| `css/style.css` | Theme (ITEA-inspired blues / teal accent) |
| `assets/nadir-logo.svg` | Project logo |
| `assets/partners/*.svg` | Partner logos (replace placeholders with approved brand files) |

## Maintenance

- Edit `index.html` for text and structure; adjust `css/style.css` for branding.
- Reconcile consortium names, dates, and links with [itea4.org/project/nadir.html](https://itea4.org/project/nadir.html) before formal communications.
