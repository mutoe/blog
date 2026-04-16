# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal technical blog (blog.mutoe.com) built with **Hexo 8.0.0** and the **NexT v8.25.0** theme. Content is in Chinese (zh-CN). Package manager is **pnpm**.

## Common Commands

```bash
pnpm dev          # Local dev server with live reload (hexo server + browsersync)
pnpm build        # Generate static site to public/ (hexo generate)
pnpm preview      # Serve public/ with http-server for local preview
```

### Gulp pipeline (full release flow)

```bash
npx gulp build    # Clean + hexo generate
npx gulp minify   # HTML minification on public/
npx gulp release  # build + minify + hexo deploy (to gh-pages branch)
```

## Architecture

- **`source/_posts/`** — Published blog posts (Markdown with YAML front matter)
- **`source/_drafts/`** — Draft posts (not published)
- **`source/_data/`** — Theme customization injection files:
  - `head.njk` — Custom `<head>` HTML
  - `footer.njk` — Custom footer HTML + Utterances theme switcher
  - `styles.styl` — Custom Stylus CSS overrides
- **`scripts/anchor.js`** — Custom Hexo filter that modifies header anchor link placement during post rendering
- **`themes/next/`** — NexT theme (vendored, not a submodule)

## Configuration

- **`_config.yml`** — Main Hexo config (site metadata, permalink format `/:year/:title/`, plugins)
- **`_config.next.yml`** — NexT theme config (scheme, dark mode, comments, search, analytics)
- **`wrangler.jsonc`** — Cloudflare Workers deployment (alternative to GitHub Pages)
- **`gulpfile.js`** — Gulp tasks for HTML minification and deployment orchestration

## Deployment

Two deployment targets:
1. **GitHub Pages**: `hexo deploy` pushes to `gh-pages` branch via hexo-deployer-git
2. **Cloudflare Workers**: via `wrangler deploy` serving the `public/` directory

## Key Conventions

- Blog content language is **Simplified Chinese**
- Permalink format: `/:year/:title/` (no trailing `.html`)
- Comments use **Utterances** (backed by GitHub Issues)
- Editor config: 2-space indentation, LF line endings, UTF-8, 120 char line limit
