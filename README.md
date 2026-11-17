# Immersive scroll portfolio template

A single-page portfolio where you fly through a tunnel of light past your projects. Built with Three.js (loaded from a CDN, no build step), for GitHub Pages.

## Use it
1. Edit **content.js**. It is the only file you need to change.
2. Put images in **images/** and set each project's `cover` (shown on the floating panel) and `images` (shown in the project window). Empty covers get a generated colour panel.
3. Upload everything to a GitHub repo, then Settings → Pages → deploy from the `main` branch (root).

## Test locally
Browsers block ES modules from `file://`, so run a tiny server in the folder, for example `python3 -m http.server`, and open http://localhost:8000.

## Controls
Wheel, swipe, arrow keys or Space move between stops. Click a panel or "View project" to open it. The nav and the dots on the right jump to a section.

## Notes
- If WebGL is unavailable the page falls back to a plain scrolling layout.
- Visitors who prefer reduced motion get a calmer version.
- Use JPG or WebP covers around 1600 px wide to keep it fast.
