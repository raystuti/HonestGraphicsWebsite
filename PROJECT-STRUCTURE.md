# Honest Graphics Project Structure

This project is now organized so recurring page layout lives in one place and page-specific content lives in one data file.

## Core Files

- `honest-graphics.html`
  - Main landing page.
- `styles.css`
  - Main landing page styles.
- `script.js`
  - Main landing page interactions (cursor, reveal, theme toggle).
- `theme-toggle.js`
  - Shared theme toggle module used by homepage and work pages.

## Work Pages (Refactored)

- `work-pages.css`
  - Shared styling for all work detail pages.
- `work-pages.js`
  - Work-page behavior bootstrap (uses shared `theme-toggle.js`).
- `work-pages-data.js`
  - Central content source for all work pages:
    - title
    - hero image
    - section copy
    - logo wall items
    - gallery items
- `work-page-builder.js`
  - Shared renderer that builds page markup from `work-pages-data.js`.

## Page Shells

These files are intentionally tiny and only declare which data key to load:

- `work-identity-design.html` → `data-work-page="identity-design"`
- `work-logo-design.html` → `data-work-page="logo-design"`
- `work-brochure-design.html` → `data-work-page="brochure-design"`
- `work-social-media-design.html` → `data-work-page="social-media-design"`
- `work-outdoor-design.html` → `data-work-page="outdoor-design"`
- `work-packaging-design.html` → `data-work-page="packaging-design"`

## How to Make Future Changes

### Update a Work Page's Content

Edit `work-pages-data.js` only.

### Change Work Page Layout/Markup Once for All

Edit `work-page-builder.js`.

### Change Work Page Styling Once for All

Edit `work-pages.css`.

### Change Main Homepage

Edit `honest-graphics.html`, `styles.css`, and `script.js`.
