# Honest Graphics Project Structure

This project is now organized so recurring page layout lives in one place and page-specific content lives in one data file.

## Core Files

- `html/honest-graphics.html`
  - Main landing page.
- `css/styles.css`
  - Main landing page styles.
- `js/script.js`
  - Main landing page interactions (cursor, reveal, theme toggle).
- `js/theme-toggle.js`
  - Shared theme toggle module used by homepage and work pages.

## Category Assets

All category-page media is now grouped under:

- `assets/categories/identity-design/`
- `assets/categories/logo-design/`
- `assets/categories/brochure-design/`
- `assets/categories/social-media-design/`
- `assets/categories/outdoor-design/`
- `assets/categories/packaging-design/`

Each category folder is labeled and keeps category-specific files like:

- `thumb.jpg` (service-card/hero thumbnail)
- `gallery/` (work images for that category)
- `wall/` (logo wall images for logo category)

## Work Pages (Refactored)

- `css/work-pages.css`
  - Shared styling for all work detail pages.
- `js/work-pages.js`
  - Work-page behavior bootstrap (uses shared `js/theme-toggle.js`).
- `js/work-pages-data.js`
  - Central content source for all work pages:
    - title
    - hero image
    - section copy
    - logo wall items
    - gallery items
- `js/work-page-builder.js`
  - Shared renderer that builds page markup from `js/work-pages-data.js`.

## Page Shells

These files are intentionally tiny and only declare which data key to load:

- `html/work-identity-design.html` → `data-work-page="identity-design"`
- `html/work-logo-design.html` → `data-work-page="logo-design"`
- `html/work-brochure-design.html` → `data-work-page="brochure-design"`
- `html/work-social-media-design.html` → `data-work-page="social-media-design"`
- `html/work-outdoor-design.html` → `data-work-page="outdoor-design"`
- `html/work-packaging-design.html` → `data-work-page="packaging-design"`

## How to Make Future Changes

### Update a Work Page's Content

Edit `js/work-pages-data.js` only.

### Change Work Page Layout/Markup Once for All

Edit `js/work-page-builder.js`.

### Change Work Page Styling Once for All

Edit `css/work-pages.css`.

### Change Main Homepage

Edit `html/honest-graphics.html`, `css/styles.css`, and `js/script.js`.
