# Build and dependency security audit

**6 November 2026 · NAT-28.** A clean install of the original lockfile produced 16 npm findings by affected package (3 critical, 12 high, 1 moderate). A clean install of the replacement produced **0 reported npm findings**. All 88 captured Dependabot alerts matched versions in the original lockfile. None matched any version in the replacement, including nested and platform-specific entries. GitHub will reassess its default branch after the lockfile lands.

## Evidence and exposure

Both audits used the public npm registry, macOS arm64, Node 22.23.2, npm 10.9.8, and included development dependencies. The original manifest and lock came from commit `172269920835073bb088015bddfd32cba73532ec`. The final audit used the working tree on `b8f928b75f36cf2da3ed9a1b1a5de06f174e81ac`. The intervening legacy-route commit used the same dependency inputs. Build verification included the site's in-progress local content and route changes.

| Measure | Baseline | Final |
| --- | --- | --- |
| Lockfile SHA-256 | `154ca7d7f44bb5d00751829b0f21ee74832e993efc6cebd6ccbb98817ee3ecfd` | `ce3d5f84443158e9e073402a8ecedcd82f4e0d83539075a0f039038799fe1acf` |
| Dependencies inventoried by npm audit, including optional packages | 407 | 222 |
| Unique npm advisory IDs | 73 | 0 |
| GitHub alert ranges matching the lock | 88 (3 critical, 54 high, 27 medium, 4 low) | 0 of the same 88 |

GitHub reported 71 distinct advisories across 88 alerts. Some advisories have separate alerts for different affected major versions. npm also reported GHSA-c83g-rgw3-j3cx (browserslist) and GHSA-48c2-rrv3-qjmp (yaml). Repository security advisories and published advisories for the five Actions listed below returned empty lists.

GitHub Pages serves the generated HTML, CSS, images and PDFs. The Node packages run during installation, site generation or local development. The generated HTML contains no scripts or forms. A contributor who controls templates or build inputs can affect a build, so pull-request builds matter even for a static site. The critical findings had different entry points:

- **LiquidJS remote code execution** depended on rendering attacker-controlled Liquid templates. This site enables HTML, Nunjucks and Markdown. Eleventy still installed LiquidJS, so upgrading removed the vulnerable version.
- **shell-quote command injection** affected quoting of crafted operator objects. The build runner uses fixed, repository-defined commands. Replacing the runner preserved the commands and upgraded the quoting dependency.
- **tar denial of service** affected unbounded decompression and parsing. Tailwind's native tooling brought tar into the install path. The new tree removes it entirely.

The remaining findings affect build inputs such as Markdown, configuration, CSS and file patterns, or the local Eleventy WebSocket server. The generated site has no Node request handler. Blog editor authentication remains in NAT-24.

## Remediation and compatibility

| Direct dependency | Original version | Final version | Use |
| --- | --- | --- | --- |
| @11ty/eleventy | 3.0.0 | 3.1.8 | Site generation and local server |
| @tailwindcss/postcss and tailwindcss | 4.1.6 | 4.3.4 | CSS generation and watch |
| postcss | 8.5.3 | 8.5.32 | CSS processor |
| postcss-cli | 11.0.1 | 11.0.1 | Build and watch entry points |
| npm-run-all | 4.1.5 | Replaced by npm-run-all2 9.0.4 | Same sequential build and parallel watch commands |
| autoprefixer | 10.4.21 | Removed | Unused by the PostCSS configuration |

A trial of semver-compatible `npm audit fix` still reported findings in the old Eleventy copy/glob chain. Updating Eleventy within v3 and regenerating the tree removed that chain. All six direct packages are build or development tools. The lock includes native packages for both macOS arm64 and the Linux x64 Actions runner. CI uses Node 22, a supported LTS release that satisfies the replacement runner's engine requirements. [Node release schedule](https://nodejs.org/en/about/previous-releases)

The original workflows referenced checkout v5, setup-node v5, upload-pages-artifact v4 and deploy-pages v4.0.5. Both workflows now use official release commit SHAs. The new versions are checkout v7.0.1, setup-node v7.1.0, upload-pages-artifact v5.0.0 and deploy-pages v5.0.1. The upload action itself pins upload-artifact v7.0.0. The build and post-deploy verification jobs have read-only repository access, and checkout discards credentials. Only the deploy job can publish Pages and request an OIDC token. It runs the deployment action without executing repository scripts.

## Verification and follow-up

- Clean install, full dependency-tree inspection and production build passed. All generated HTML pages, feed and binary assets matched the baseline byte for byte. The sitemap contained the same URLs. The compiled stylesheet parsed and contained the responsive navigation, layout and article selectors.
- The legacy-route smoke check passed, including redirects, binary aliases and the custom 404. All 99 generated same-site HTML link and asset references resolved. Both external destinations returned HTTP 200 after redirects.
- The development server served the home page and rebuilt both CSS and HTML after edits in a temporary copy. Both workflows passed actionlint 1.7.12. This repository defined no separate unit-test or application-lint script at audit time.
- Hosted CI and Pages deployment still require a run on GitHub. At merge, verify the Validate Build and Deploy workflows, the published-route job and the refreshed Dependabot alert count. The existing default branch remains exposed to its old build dependencies until then.
- GitHub reported no code-scanning analysis and secret scanning was disabled. Those surfaces have no scan result. Recheck their availability and the default-branch alerts on **13 November 2026** if still pending. [Repository security](https://github.com/nathanhuh/nathanhuh.github.io/security)

## Repeat the audit

Run these commands from the repository root on a supported Node version. Keep the lockfile and include development dependencies. The PR validation workflow uses the same audit threshold alongside the pre-merge build covered by NAT-26.

```sh
git rev-parse HEAD
node --version
npm --version
npm ci
npm ls --all
npm audit --include=dev --audit-level=low
npm run build
node scripts/check-routes.mjs
```

For a dated comparison, capture `npm audit --include=dev --json` before and after the changes. Use `npm explain <package>` to identify each dependency path. Review the repository's [Dependabot alerts](https://github.com/nathanhuh/nathanhuh.github.io/security/dependabot) and [security advisories](https://github.com/nathanhuh/nathanhuh.github.io/security/advisories), and check every locked version against the reported ranges. Record remaining exposure and a review date when a patch is unavailable.

## Advisory inventory

The table records each affected package version in the baseline and its disposition in the final lock. The advisory rows below it give severity, vulnerable ranges and the corresponding baseline Dependabot alert numbers. A dash in the alert column indicates an npm-only finding.

| Package | Baseline | Final |
| --- | --- | --- |
| brace-expansion | 1.1.11, 2.0.1 | 1.1.21 |
| browserslist | 4.24.5 | Removed |
| glob | 10.4.5 | Removed |
| js-yaml | 3.14.1, 4.1.0 | 4.3.2 |
| linkify-it | 5.0.0 | 5.0.2 |
| liquidjs | 10.21.0 | 10.30.1 |
| markdown-it | 14.1.0 | 14.3.3 |
| minimatch | 3.1.2, 9.0.5 | Removed |
| nanoid | 3.3.11 | 3.3.20 |
| picomatch | 2.3.1, 4.0.2 | 2.3.2, 4.0.7 |
| postcss | 8.5.3 | 8.5.32 |
| shell-quote | 1.8.2 | 1.12.0 |
| source-map-js | 1.2.1 | 1.2.2 |
| tar | 7.4.3 | Removed |
| ws | 8.18.2 | 8.22.1 |
| yaml | 2.7.1 | 2.9.1 |

| Package | Advisory | Severity | Affected versions | GitHub alerts |
| --- | --- | --- | --- | --- |
| brace-expansion | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | high | `>=2.0.0 <2.1.2 or <1.1.16` | 56, 53 |
| brace-expansion | [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | high | `<1.1.19 or >=2.0.0 <2.1.5` | 103, 86 |
| brace-expansion | [GHSA-f886-m6hf-6m8v](https://github.com/advisories/GHSA-f886-m6hf-6m8v) | moderate | `<1.1.13 or >=2.0.0 <2.0.3` | 101, 32 |
| brace-expansion | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | high | `<1.1.17 or >=2.0.0 <2.1.3` | 69, 68 |
| brace-expansion | [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) | moderate | `<1.1.21 or >=2.0.0 <2.1.7` | 89, 87 |
| brace-expansion | [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | high | `<1.1.20 or >=2.0.0 <2.1.6` | 88, 85 |
| brace-expansion | [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | high | `>=2.0.0 <2.1.4 or <1.1.18` | 71, 70 |
| brace-expansion | [GHSA-v6h2-p8h4-qcjw](https://github.com/advisories/GHSA-v6h2-p8h4-qcjw) | low | `>=1.0.0 <=1.1.11 or >=2.0.0 <=2.0.1` | 3, 2 |
| browserslist | [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | high | `<=4.28.6` | 80 |
| browserslist | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | high | `<=4.28.6` | — |
| glob | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) | moderate | `>=9.0.0 <=14.0.1` | 104 |
| glob | [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) | high | `>=10.2.0 <10.5.0` | 9 |
| js-yaml | [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | high | `>=3.0.0 <3.15.2 or >=4.0.0 <4.3.2` | 83, 82 |
| js-yaml | [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | high | `>=4.0.0 <4.3.0 or >=3.0.0 <3.15.0` | 55, 54 |
| js-yaml | [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | high | `>=3.0.0 <3.15.1 or >=4.0.0 <4.3.1` | 73, 72 |
| js-yaml | [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68) | moderate | `<3.15.0 or >=4.0.0 <=4.1.1` | 52, 51 |
| js-yaml | [GHSA-mh29-5h37-fv8m](https://github.com/advisories/GHSA-mh29-5h37-fv8m) | moderate | `<3.14.2 or >=4.0.0 <4.1.1` | 6, 5 |
| linkify-it | [GHSA-22p9-wv53-3rq4](https://github.com/advisories/GHSA-22p9-wv53-3rq4) | high | `<=5.0.0` | 50 |
| linkify-it | [GHSA-v245-v573-v5vm](https://github.com/advisories/GHSA-v245-v573-v5vm) | high | `<=5.0.1` | 57 |
| liquidjs | [GHSA-2qv6-9wx5-cwv4](https://github.com/advisories/GHSA-2qv6-9wx5-cwv4) | moderate | `<10.26.0` | 97 |
| liquidjs | [GHSA-4r6h-5v86-94p3](https://github.com/advisories/GHSA-4r6h-5v86-94p3) | high | `<=10.27.1` | 81 |
| liquidjs | [GHSA-4rc3-7j7w-m548](https://github.com/advisories/GHSA-4rc3-7j7w-m548) | high | `<10.25.7` | 37 |
| liquidjs | [GHSA-56p5-8mhr-2fph](https://github.com/advisories/GHSA-56p5-8mhr-2fph) | high | `<=10.25.2` | 34 |
| liquidjs | [GHSA-6q5m-63h6-5x4v](https://github.com/advisories/GHSA-6q5m-63h6-5x4v) | high | `<10.25.1` | 100 |
| liquidjs | [GHSA-8xx9-69p8-7jp3](https://github.com/advisories/GHSA-8xx9-69p8-7jp3) | moderate | `<10.26.0` | 98 |
| liquidjs | [GHSA-9r5m-9576-7f6x](https://github.com/advisories/GHSA-9r5m-9576-7f6x) | high | `<=10.24.0` | 25 |
| liquidjs | [GHSA-9x9p-qf8f-mvjg](https://github.com/advisories/GHSA-9x9p-qf8f-mvjg) | moderate | `<10.26.0` | 99 |
| liquidjs | [GHSA-fwxr-j5w2-587m](https://github.com/advisories/GHSA-fwxr-j5w2-587m) | moderate | `<=10.27.1` | 91 |
| liquidjs | [GHSA-g357-x5c3-c72p](https://github.com/advisories/GHSA-g357-x5c3-c72p) | high | `<=10.27.0` | 63 |
| liquidjs | [GHSA-gf2q-c269-pqgc](https://github.com/advisories/GHSA-gf2q-c269-pqgc) | critical | `<10.26.0` | 43 |
| liquidjs | [GHSA-hh27-hf48-9f5q](https://github.com/advisories/GHSA-hh27-hf48-9f5q) | high | `<=10.25.7` | 41 |
| liquidjs | [GHSA-mmg9-6m6j-jqqx](https://github.com/advisories/GHSA-mmg9-6m6j-jqqx) | low | `<=10.25.2` | 33 |
| liquidjs | [GHSA-r7g9-xpmj-5fcq](https://github.com/advisories/GHSA-r7g9-xpmj-5fcq) | high | `<10.26.0` | 42 |
| liquidjs | [GHSA-rv5g-f82m-qrvv](https://github.com/advisories/GHSA-rv5g-f82m-qrvv) | moderate | `<=10.25.3` | 35 |
| liquidjs | [GHSA-v273-448j-v4qj](https://github.com/advisories/GHSA-v273-448j-v4qj) | moderate | `<=10.25.4` | 36 |
| liquidjs | [GHSA-wmfp-5q7x-987x](https://github.com/advisories/GHSA-wmfp-5q7x-987x) | high | `<10.25.0` | 23 |
| markdown-it | [GHSA-253c-mchw-3w2r](https://github.com/advisories/GHSA-253c-mchw-3w2r) | moderate | `<14.3.1` | 84 |
| markdown-it | [GHSA-38c4-r59v-3vqw](https://github.com/advisories/GHSA-38c4-r59v-3vqw) | moderate | `>=13.0.0 <14.1.1` | 13 |
| markdown-it | [GHSA-6v5v-wf23-fmfq](https://github.com/advisories/GHSA-6v5v-wf23-fmfq) | moderate | `<=14.1.1` | 47 |
| markdown-it | [GHSA-gfr2-rv44-r23c](https://github.com/advisories/GHSA-gfr2-rv44-r23c) | high | `>=14.1.0 <14.3.3` | 95 |
| markdown-it | [GHSA-r7fv-28h4-cvq7](https://github.com/advisories/GHSA-r7fv-28h4-cvq7) | high | `<14.3.2` | 94 |
| markdown-it | [GHSA-vfgh-jcmw-g37q](https://github.com/advisories/GHSA-vfgh-jcmw-g37q) | low | `<14.3.3` | 96 |
| minimatch | [GHSA-23c5-xmqv-rm74](https://github.com/advisories/GHSA-23c5-xmqv-rm74) | high | `<3.1.4 or >=9.0.0 <9.0.7` | 21, 19 |
| minimatch | [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26) | high | `<3.1.3 or >=9.0.0 <9.0.6` | 17, 16 |
| minimatch | [GHSA-7r86-cg39-jmmj](https://github.com/advisories/GHSA-7r86-cg39-jmmj) | high | `<3.1.3 or >=9.0.0 <9.0.7` | 20, 18 |
| minimatch | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) | moderate | `>=7.0.0 <11.0.1` | 105 |
| nanoid | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | high | `<3.3.16` | 76 |
| nanoid | [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | high | `<3.3.18` | 77 |
| nanoid | [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) | high | `<3.3.12` | 78 |
| picomatch | [GHSA-3v7f-55p6-f55p](https://github.com/advisories/GHSA-3v7f-55p6-f55p) | moderate | `<2.3.2 or >=4.0.0 <4.0.4` | 29, 28 |
| picomatch | [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) | high | `<2.3.2 or >=4.0.0 <4.0.4` | 30 |
| postcss | [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | high | `<=8.5.11` | 66 |
| postcss | [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp) | moderate | `<=8.5.22` | 74 |
| postcss | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) | moderate | `<8.5.10` | 102 |
| postcss | [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | high | `<=8.5.17` | 67 |
| shell-quote | [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | high | `<=1.8.4` | 58 |
| shell-quote | [GHSA-w7jw-789q-3m8p](https://github.com/advisories/GHSA-w7jw-789q-3m8p) | critical | `>=1.1.0 <=1.8.3` | 45 |
| source-map-js | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | high | `>=1.0.0 <1.2.2` | 92 |
| tar | [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw) | critical | `<=7.5.18` | 62 |
| tar | [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v) | high | `<7.5.7` | 12 |
| tar | [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx) | high | `<7.5.8` | 14 |
| tar | [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97) | high | `<=7.5.2` | 10 |
| tar | [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w) | high | `<=7.5.17` | 59 |
| tar | [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256) | high | `<=7.5.10` | 24 |
| tar | [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j) | moderate | `<=7.5.16` | 61 |
| tar | [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96) | high | `<=7.5.9` | 22 |
| tar | [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) | high | `<=7.5.20` | 65 |
| tar | [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w) | high | `<=7.5.3` | 11 |
| tar | [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh) | moderate | `<=7.5.15` | 48 |
| tar | [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp) | moderate | `<=7.5.17` | 60 |
| ws | [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) | moderate | `>=8.0.0 <8.20.1` | 44 |
| ws | [GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) | high | `>=8.0.0 <8.21.0` | 49 |
| yaml | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) | moderate | `>=2.0.0 <2.8.3` | — |
