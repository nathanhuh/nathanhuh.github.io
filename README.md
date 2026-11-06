# Personal Website

This repository contains the source code for Nathan Huh's personal website.

## Overview

This is a static website built using the [Eleventy (11ty)](https://www.11ty.dev/) static site generator. It serves as an online portfolio and presence for Nathan Huh, a Software Engineer (Infrastucture) for LG Uplus, telecommunication arm of LG group we all know and love. 

## Structure

- **Source Files:** Located primarily in the root directory (by default). Eleventy processes these.
  - `index.html`: The main landing page template.
  - `profile.html`: Template for the profile page.
  - `resume.html`: Template for the resume page.
  - `personalProjects.html`: Template for the personal projects page.
  - `style.css`: Provides the styling for the website (copied by Eleventy).
  - `photo/`: Directory containing images used on the site (copied by Eleventy).
  - `pdf/`: Directory potentially containing PDF documents (copied by Eleventy).
- **Output Directory:** `_site/` - This directory contains the generated static website and is the one that should be deployed. It is created by running Eleventy.
- `package.json` / `package-lock.json`: Define project dependencies, including Eleventy.
- `.eleventy.js` (Optional): Configuration file for Eleventy (can be added for customization).
- `README.md`: This file.
- `CNAME`: Configuration file for a custom domain.

## Development

1.  **Install Dependencies:** `npm install`
2.  **Run Eleventy:** `npx @11ty/eleventy` (builds the site to `_site/`)
3.  **Run Eleventy with Hot Reloading:** `npx @11ty/eleventy --serve` (builds and serves locally, automatically rebuilding on changes)

## Deployment

GitHub Pages deployment runs from `.github/workflows/deploy.yml` and:

- Builds on pushes to `main`, including merges, and on manual dispatch
- Installs dependencies with `npm ci`
- Runs `npm run build`
- Uploads and deploys `_site` as the Pages artifact
- Checks the legacy routes in the artifact before upload and on the custom domain after deployment

### Legacy URLs

The route inventory in `src/_data/legacyRoutes.json` comes from the original HTML navigation and asset links, the first Eleventy build, and the stale output removed in NAT-18.

| Old address | Intended result |
| --- | --- |
| `/index.html` | Serves the home page directly. |
| `/index/` | Redirects to `/`. |
| `/profile.html`, `/resume.html`, `/personalProjects.html` | Redirect to `/profile/`, `/resume/`, and `/personalProjects/` respectively. |
| `/amberllama81.github.io/photo/photoHusky.JPG` and its lowercase `.jpg` spelling | Serve the original Husky image so old embeds still work. |
| `/amberllama81.github.io/pdf/resume_nathanHuh.pdf` | Serves the current resume PDF. The original unprefixed PDF and image URLs still serve their files. |
| `/photo/photoHusky 2.JPG`, `/pdf/resume_nathanHuh 2.pdf` | Serve the Husky image and current resume at the old duplicate filenames. |
| `/src/` and its old profile, resume, and projects pages, `/README/` | Return the custom 404. These generated pages were retired in NAT-18. |
| Old Coex photo paths | Return the custom 404. The inventory records each retired path. |

GitHub Pages serves the page redirects as static HTML with an immediate refresh, a canonical URL, and a clickable destination. Unknown paths return HTTP 404 with links back into the site.

Run `npm run build && node scripts/check-routes.mjs` to verify the artifact. Run `node scripts/check-routes.mjs https://nathanhuh.com` to check a deployment.

## Contact

Nathan Huh can be contacted via nhuh@usc.edu.