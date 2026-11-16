# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio for Jean-Luc Gauvrit: a static single-page site (plain HTML/CSS/vanilla JS, no build step, no dependencies, no tests) deployed to GitHub Pages at the custom domain in `CNAME` (`jeanluc.gvrt.fr`). Content, comments, commit messages and the README are written in French.

## Commands

- Local preview: `python -m http.server 8000`, then open http://localhost:8000 (`.claude/launch.json` defines the same server on `127.0.0.1:8765`).
- Deploy: push to `main`. `.github/workflows/pages.yml` runs a `check` job and then publishes.
- Reproduce the CI check locally: every `src="assets/..."` / `href="assets/..."` in `index.html` must exist, except `assets/img/photo.jpg`, `assets/cv/*` and `assets/img/logos/*`, which are optional. The check strips query strings first.
- Replacing an image in place: bump its `?v=N` in `index.html` (`photo.jpg` is referenced twice: the `<img>` and `og:image`). GitHub Pages lets browsers cache files for 10 minutes, so without the bump visitors keep seeing the old image.

## Architecture

All content lives in `index.html`. `assets/js/main.js` is a single IIFE that wires the page's behavior, and `assets/css/style.css` holds every style.

**Bilingual content (FR/EN).** Every piece of visible text appears twice, as sibling `<span lang="fr">…</span><span lang="en">…</span>`. The CSS rule `html[lang="fr"] [lang="en"], html[lang="en"] [lang="fr"] { display: none }` hides the inactive language, and the toggle only flips `<html lang>`. Any new text needs both spans; text without them shows in both languages. The default language is French, or English when the browser language is not French. The choice is saved in `localStorage`.

**Theme.** Colors are CSS custom properties on `:root`. Dark mode is defined twice: once under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`, and once under `:root[data-theme="dark"]`. Keep both in sync. An inline script in `<head>` applies the saved theme and language before first paint to prevent a flash. Keep it inline.

**Projects.** Each project is an `<article class="project" data-tags="…">`. The tags (`ia`, `green`, `hw`, `dev`, separated by spaces) must match the `data-filter` values on the `.filters .chip` buttons. To add a project, copy an existing article.

**Graceful degradation for optional assets.** These features work without their files:
- Missing profile photo: an `onerror` handler removes the photo and the figure shows the "JLG" initials.
- Missing logos: an `onerror` handler removes each logo and leaves a text monogram.
- CV button: it stays `hidden` until a `HEAD` request finds `assets/cv/CV_Jean-Luc_Gauvrit.pdf`.

Preserve this behavior when touching these elements; the CI exclusions depend on it.

**Other conventions:**
- `.reveal` elements fade in through an `IntersectionObserver` that adds `is-visible`.
- The nav highlights the current section by scroll position, which needs `main section[id]` to match the nav `href="#…"` anchors.
- The contact e-mail is assembled client-side from `data-u`/`data-d` on `#mailLink` to limit scraping. Never write the address in plain text.

## Deployment scope

The workflow copies only `index.html`, `assets/`, `.nojekyll` and `CNAME` into `_site`. `branding/` (the LinkedIn banner as an HTML source and a PNG export at 2×, 3168×792) is not deployed. Any new top-level file the site needs must be added to the workflow's `cp` line.
