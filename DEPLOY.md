# Deploying to the Phones

Plain-English guide to pushing changes live so the PWA on David's and Paula's phones updates. Follow top to bottom.

> Set up by Claude on 2026-09-27 (Session 2). The repo, the deploy copy, and GitHub Pages all exist.

## How it works (30-second version)

- **Editing copy:** `C:\Users\hensl\OneDrive\Desktop\Victoria Travel App` — where you (or Claude) edit files. No GitHub connection.
- **Deploy copy:** `C:\Users\hensl\repos\victoria-2026` — a git clone connected to GitHub `1davidhensley/victoria-2026`.
- To deploy: copy changed files editing → deploy copy, commit, push. GitHub Pages rebuilds and phones pick it up on next open.
- Live URL (once Pages is on): **https://1davidhensley.github.io/victoria-2026/**
- This is completely separate from `london-2026` — different repo, different Pages site, different cache name (`victoria-2026-vN`).

## One-time setup (done 2026-09-27; only needed again if the deploy copy is lost)

1. **Create the repo** (Command Prompt, not PowerShell):
   ```cmd
   gh repo create 1davidhensley/victoria-2026 --public --description "Victoria BC trip PWA - Oct 2026"
   ```
2. **Clone the deploy copy:**
   ```cmd
   mkdir C:\Users\hensl\repos
   cd C:\Users\hensl\repos
   git clone https://github.com/1davidhensley/victoria-2026.git
   ```
3. Do the first deploy (below), then **turn on Pages**: GitHub → repo → Settings → Pages → Source "Deploy from a branch" → `main` / `/ (root)` → Save. Or:
   ```cmd
   gh api repos/1davidhensley/victoria-2026/pages -X POST -f "source[branch]=main" -f "source[path]=/"
   ```

## Deploying a change (the usual flow)

### 1. Bump the cache version

Open `sw.js` and find:

```js
const CACHE_NAME = 'victoria-2026-v1';
```

The number must go up by 1 every time `index.html`, `sw.js`, or anything in `ASSETS_TO_CACHE` changes. **Without the bump, phones keep showing the old version.**

### 2. Copy files into the deploy copy

Command Prompt:

```cmd
set SRC=C:\Users\hensl\OneDrive\Desktop\Victoria Travel App
set DST=C:\Users\hensl\repos\victoria-2026
copy /Y "%SRC%\index.html" "%DST%\index.html"
copy /Y "%SRC%\sw.js" "%DST%\sw.js"
copy /Y "%SRC%\manifest.json" "%DST%\manifest.json"
copy /Y "%SRC%\CLAUDE.md" "%DST%\CLAUDE.md"
copy /Y "%SRC%\ARCHITECTURE.md" "%DST%\ARCHITECTURE.md"
copy /Y "%SRC%\DEVELOPMENT.md" "%DST%\DEVELOPMENT.md"
copy /Y "%SRC%\KNOWN-ISSUES.md" "%DST%\KNOWN-ISSUES.md"
copy /Y "%SRC%\DEPLOY.md" "%DST%\DEPLOY.md"
copy /Y "%SRC%\.gitignore" "%DST%\.gitignore"
```

**Never copy `FRS Clipper Booking Confirmation.pdf`** or any other PDF that contains a home address. The site is public.

New ticket PDFs: `mkdir "%DST%\tickets"` once, then `copy /Y "%SRC%\tickets\*.pdf" "%DST%\tickets\"`.

### 3. Commit and push

```cmd
cd C:\Users\hensl\repos\victoria-2026
git add -A
git status
git commit -m "Short description of the change"
git push
```

If `git push` asks for a password, run `gh auth token` and paste its output as the password.

### 4. Verify

- Wait 30–60 s, open https://1davidhensley.github.io/victoria-2026/ and hard-reload (Ctrl+Shift+R).
- Footer should say **`App version: vN ✓`** with the new number.
- On the phones: fully close the app and reopen. If the footer says `Installed: vX · Latest: vY`, close/reopen once more.

## Installing on the phones (first time)

- **iPhone (Safari):** open the URL → Share → *Add to Home Screen*.
- **Android (Chrome):** open the URL → ⋮ menu → *Install app* / *Add to Home screen*.
- Open it once while online so everything caches for offline use.

## Troubleshooting

**Phone still shows old version.** Check https://1davidhensley.github.io/victoria-2026/sw.js — if `CACHE_NAME` shows the new number, the deploy worked; fully close + reopen the app. If it shows the old number, Pages is still rebuilding — wait 2 minutes.

**Edited the wrong copy.** Always edit in the OneDrive editing copy. The deploy copy is disposable — delete it and re-clone if it gets out of sync.

**Command Prompt vs PowerShell.** Use Command Prompt (cmd.exe) for the copy commands above.
