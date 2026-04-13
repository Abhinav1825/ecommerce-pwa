# Ecommerce PWA (NovaCart)

This project is a lightweight Ecommerce Progressive Web App (PWA) designed to run well on GitHub Pages.

## What this project now includes

- Responsive storefront UI with product cards
- Cart persistence using localStorage
- Online/offline status indicator
- Install prompt support (`beforeinstallprompt`)
- Service worker with app-shell caching for offline usage
- PWA manifest with install metadata and icon
- All assets referenced with relative paths (important for GitHub Pages)

## Local preview

Open `index.html` in a browser to view the UI.

For full service worker behavior, use a local static server. Example with Node:

```bash
npx serve .
```

## GitHub Pages deployment (step by step)

1. Create a new GitHub repository.
2. Copy this project into the repository root.
3. Ensure these files are present:
   - `index.html`
   - `app.js`
   - `style.css`
   - `sw.js`
   - `manifest.json`
   - `images/` folder
4. Commit and push to the `main` branch.

```bash
git init
git add .
git commit -m "Refine ecommerce PWA for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

5. Open your GitHub repository in browser.
6. Go to `Settings` -> `Pages`.
7. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
8. Click `Save`.
9. Wait about 1-3 minutes for deployment.
10. Open your site at:

```text
https://<your-username>.github.io/<your-repo>/
```

## Important GitHub Pages notes

- Keep `start_url` in `manifest.json` as `./index.html`.
- Keep service worker cache paths relative (`./...`) not root (`/...`).
- After updates to `sw.js`, reload once with hard refresh (Ctrl+F5) to get the newest cache behavior.

## Verify PWA installation

1. Open deployed site in Chrome/Edge.
2. Open DevTools -> Application:
   - `Manifest` should load without errors
   - `Service Workers` should show active worker
3. Toggle offline mode in DevTools network tab and reload.
4. Site should still load from cache.
