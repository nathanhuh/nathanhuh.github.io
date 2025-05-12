# Personal Website

This repository contains the source code for Nathan Huh's personal website.

## Overview

This is a static website built using the [Eleventy (11ty)](https://www.11ty.dev/) static site generator. It serves as an online portfolio and presence for Nathan Huh, a Computer Science student at the University of Southern California.

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

## Contact

Nathan Huh can be contacted via nhuh@usc.edu.