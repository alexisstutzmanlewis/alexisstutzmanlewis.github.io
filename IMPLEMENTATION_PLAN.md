# Alexis Stutzman Lewis — personal site: implementation plan

Living reference for the build. Update this file as decisions change; don't let it drift from reality.

## 1. Project summary

A personal academic/professional site for Alexis Stutzman Lewis, Ph.D. — postdoctoral research
scientist, Zuckerman Institute at Columbia University (genomics/molecular biology). Audience is
mixed: academic colleagues and collaborators, employers/recruiters, grad school/fellowship/award
committees, and general visitors. Content and structure are richer than a typical portfolio site
because the subject has a real academic record (publications, presentations, press) alongside a
personal/community dimension (Black In Genetics, personal reflections).

Inspiration source: https://skyelowe.com — a vanilla HTML/CSS/JS single-page portfolio. We are
borrowing its *interaction techniques* (cursor-glow trail, hover-lift, scroll reveals) and general
build approach (no framework), but not its content structure, tone, or exact visual language — this
site is multi-page, more restrained/elegant, and uses a different palette and type system tailored
to the audience and to accessibility (bolder text weights, no italic headings).

## 2. Infrastructure decisions (confirmed)

| Decision | Choice | Notes |
|---|---|---|
| Version control | Git, from day one | Repo initialized locally; remote is the user's existing **private** repo, https://github.com/14stutzmanav/14stutzmanav.github.io (superseding an earlier abandoned attempt) |
| Tech stack | Vanilla HTML/CSS/JS | No framework, no bundler, no `npm install` required to run |
| Content data | JSON files in `/data`, rendered client-side via `fetch()` | See §5. Avoids a build step while keeping publications/presentations/media editable without touching markup |
| Hosting | **GitHub Pages** (switched from Netlify) | Free, served directly from the repo above at `14stutzmanav.github.io`. `netlify.toml` removed — no longer applicable. |
| Contact method | Real contact form via **Formspree** (switched from Netlify Forms) | GitHub Pages has no built-in form handling; Formspree is a free third-party form backend. Form in `contact.html` currently points at a placeholder `YOUR_FORM_ID` — needs the user to sign up at formspree.io and swap it in. |
| Domain | Deferred | Launch on the free `14stutzmanav.github.io` subdomain first. Candidate custom name: **alexis-stutzmanlewis** (`.com` — availability not yet checked). GitHub Pages custom domains need a `CNAME` file added at repo root once purchased. |
| Analytics | Lightweight, privacy-friendly (GoatCounter) | Matches the reference site's approach — anonymous pageviews only, free, no cookie banner needed. Placeholder script tag (commented out) is on every page pending the user's own signup. |

**SEO/JS tradeoff to flag:** rendering publications/presentations/media via client-side `fetch()`
of JSON means that content isn't in the initial HTML payload. For a personal site at this scale
that's a reasonable tradeoff for editability, but if search-engine indexing of individual
publications becomes important later, we can add a small build script that pre-renders the JSON
into static HTML at deploy time without changing the data files themselves.

## 3. Information architecture — 5 pages

Persistent top nav bar on every page (name/monogram on the left, links on the right, matching the
reference site's nav pattern but pointing to pages, not anchors).

1. **Home** (`index.html`) — hero: name, title/institution, one-line research hook, two CTAs
   (`View CV` → cv.html, `Get in touch` → contact.html). Full ambient design treatment (watercolor
   washes + cursor glow) lives here.
2. **CV** (`cv.html`) — the core professional record:
   - Research statement ("My Science")
   - Education, grants/fellowships, awards/honors, teaching, service, mentoring — all from `data/cv.json`
   - Publications (simple chronological list, tags shown as labels, not filterable)
   - Presentations & posters (oral talks + posters, chronological)
   - In the Media (press/interviews, as a subsection here)
   - Prominent "Download CV (PDF)" button (`assets/documents/Stutzman_CV.pdf`), alongside the
     full interactive web version
3. **Black In Genetics** (`black-in-genetics.html`) — feature page for the org founded in 2020;
   full biosketch paragraph + highlights + link out to blackingenetics.com (content finalized,
   see `data/black-in-genetics.json`).
4. **Just for Fun** (`just-for-fun.html`) — personal content: research-organism photos/video
   (fly imaginal disc, C. elegans embryo video), a candid personal photo, "outside the lab"
   reflections, dedication to Rosie.
5. **Contact** (`contact.html`) — Formspree-powered contact form (name/email/message) plus a
   LinkedIn link (see `data/contact.json`). **Confirmed:** no public email address anywhere on
   the site — user wants the Columbia email kept private, matching the CV's own choice. LinkedIn:
   https://www.linkedin.com/in/alexis-stutzman-lewis-phd-975418100/

## 4. Design system (locked)

Source of truth: [`design-system/reference-mockup.html`](design-system/reference-mockup.html) and
[`assets/css/tokens.css`](assets/css/tokens.css) — open the mockup in a browser to see it live,
including the cursor-glow interaction.

**Palette** — warm cream base with three botanical watercolor accents, each with a lighter
decorative variant (washes/swatches) and a darker text-safe variant (links/emphasis/tags):

- Paper `#F7F1E3` · Ink `#2A2A22` · Mid `#5A5848` · Rule `#E3DBC7`
- Plum (decorative `#C7AEC9` / text `#7A5D82`) — warmed toward mauve to sit well against the cream
- Blue (decorative `#ABC5D6` / text `#3F647E`)
- Sage (decorative `#B9CBA9` / text `#4F6B45`)

**Typography** — Cormorant Garamond (headings, **upright only — no italic headings anywhere on
the site**, weight 500–600) + Jost (body/UI, weight 400–500). Weights were deliberately bumped up
from a typical "elegant" pairing for low-vision legibility, per explicit feedback during design
review. A small italic accent word within body copy (like "heredity" in the mockup) is fine as a
one-off flourish — it's not a heading.

**Motion & interaction:**
- Cursor-glow trailing effect (soft blurred radial gradient, lerped position) used **sitewide** —
  nav, buttons, publication rows, cards — not just the homepage.
- Hover-lift on buttons, nav links, and list rows (translateY + shadow/underline), sitewide.
- Background "watercolor wash" blurred blobs (plum/blue/sage), used at least on the homepage hero;
  can extend to other pages at reduced opacity so the CV page doesn't feel visually busy.
- Opening intro animation: a **shortened/subtler** version of the reference site's ~2s veil reveal
  — not the full staged letter-by-letter build, just a brief fade-in.
- Accessibility: auto-respect `prefers-reduced-motion` (disable all animation for those users, like
  the reference site) **plus** a visible manual motion toggle in the nav/footer for anyone who wants
  it off regardless of system setting.

**Branding:** favicon is a simple monogram (initials) set in Cormorant Garamond on the site palette.

## 5. Content/data model

Publications, presentations, and CV data are now sourced from the user's official CV
(`260212_Stutzman_CV.pdf`), which superseded the earlier Notion-derived draft:

- [`data/publications.json`](data/publications.json) — 6 entries, full DOIs/PMIDs/years confirmed
  from the CV (includes a 2025 bioRxiv preprint not in the original Notion page).
- [`data/presentations.json`](data/presentations.json) — `oral` and `posters` arrays; enriched
  with co-presenter names from the Black In Genetics biosketch excerpt. The ASHG 2020 talk
  ("The Creation of Black in Genetics...") date conflict between the CV (Oct 29) and biosketch
  (Oct 27) is resolved — user confirmed the talk took place Monday, October 26, 2020.
- [`data/cv.json`](data/cv.json) — header info, education, grants/fellowships, awards/honors,
  teaching experience, service, and mentoring — all from the CV.
- [`data/black-in-genetics.json`](data/black-in-genetics.json) — full biosketch paragraph, key
  highlights (CZI funding, UNCF Ernest E. Just recognition), logo path, and link to
  blackingenetics.com.
- [`data/media.json`](data/media.json) — 2 entries (Front Line Genomics interview, NC DNA Day
  article), from the earlier Notion pass; still accurate.
- [`data/just-for-fun.json`](data/just-for-fun.json) — 4 entries: wing imaginal disc, C. elegans
  embryo, "outside the lab" reflection, and the Rosie dedication (with a placeholder Wikipedia
  link for "learn more about Rosalind Franklin" — swap if the original had a specific target).

Each page's JS (`assets/js/render-cv.js`, etc.) fetches the relevant JSON and renders it into the
DOM at load time — content edits going forward mean editing these files, never the HTML/CSS.

**Assets received and placed:**
- `assets/images/media/headshot.jpg` — primary headshot (white background, resized for web)
- `assets/images/media/black-in-genetics-logo.png` — org logo
- `assets/images/research/imaginal-disc.gif` — wing imaginal disc microscopy
- `assets/images/research/celegans-embryo.mov` — C. elegans embryo cell division video
  (**needs conversion to `.mp4`/`.webm` during build** — `.mov` isn't reliably playable in
  Chrome/Firefox; `ffmpeg` isn't installed locally, so this is a build-phase task)

**Still open:**
- [x] Resolved: Oct 27 vs. Oct 29, 2020 date discrepancy — confirmed as October 26, 2020
- [x] Just for Fun media (imaginal disc GIF, C. elegans video) — placed; video needs format conversion
- CV as a downloadable PDF (the source CV PDF itself can likely be used directly — confirm)
- A second, more personal/candid photo for the Just for Fun page (candidates exist in
  `/Users/alexisv7/Documents/Professional Headshots/Favorite Headshots/`) — optional
- Domain availability check for **alexis-stutzmanlewis.com**
- Contact form fields — delegated to Claude to design; user will request edits after reviewing

## 6. Folder structure

```
Website/
├── .gitignore
├── robots.txt
├── sitemap.xml
├── IMPLEMENTATION_PLAN.md        ← this file
├── README.md
├── index.html                    (Home)
├── cv.html
├── black-in-genetics.html
├── just-for-fun.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── tokens.css            (design tokens — done)
│   │   ├── base.css              (reset, typography, layout — to build)
│   │   └── components.css        (nav, buttons, cards, cursor-glow, washes — to build)
│   ├── js/
│   │   ├── main.js               (nav state, cursor-glow, intro anim, motion toggle, scroll reveal)
│   │   ├── render-cv.js          (fetches data/*.json, renders CV page sections)
│   │   └── render-just-for-fun.js
│   └── images/
│       ├── favicon/
│       ├── research/              (organism photos/video)
│       └── media/                 (headshot, Black In Genetics logo, OG share image)
├── data/
│   ├── publications.json         (drafted)
│   ├── presentations.json        (drafted)
│   └── media.json                (drafted)
└── design-system/
    └── reference-mockup.html     (live palette/type reference — open in a browser)
```

## 7. Cross-cutting technical commitments

- Semantic HTML5, ARIA labels where needed, meaningful `alt` text on all images.
- Mobile-first responsive CSS; nav collapses sensibly on small screens (reference site's horizontal
  scroll pattern is a reasonable fallback if a hamburger menu feels like overkill for 5 links).
- `prefers-reduced-motion` support is non-negotiable, plus the manual toggle noted above.
- Per-page `<title>`, meta description, and Open Graph/Twitter card tags (with a shared OG image)
  for clean link previews when shared.
- `sitemap.xml` and `robots.txt` for discoverability.
- A `@media print` stylesheet on the CV page so it prints cleanly even before the PDF link is used.
- GoatCounter analytics script tag (single `<script>`, no cookie banner needed).

## 8. Build sequence

1. [x] `base.css` + `components.css` — global styles, nav, buttons, cards, cursor-glow, wash
   backgrounds, motion toggle, reduced-motion handling.
2. [x] `main.js` — shared interaction behavior (cursor-glow, photo tilt, veil, motion toggle,
   scroll-reveal via `window.observeFadeIns()` — re-callable so dynamically fetched content can
   register for the fade-in animation too).
3. [x] Home page (`index.html`).
4. [x] CV page (`cv.html`) + `render-cv.js` + PDF download link.
5. [x] Black In Genetics page (`black-in-genetics.html`) + `render-black-in-genetics.js`.
6. [x] Just for Fun page (`just-for-fun.html`) + `render-just-for-fun.js`.
7. [x] Contact page (`contact.html`) + Formspree form (name/email/message + honeypot) + LinkedIn
   link. **Placeholder** — form posts to `YOUR_FORM_ID`, needs the user's real Formspree form ID.
8. [x] Favicon (SVG monogram), OG tags (reusing headshot/logo/personal-photo per page), meta
   descriptions, `sitemap.xml`/`robots.txt`. **Analytics is a placeholder** — GoatCounter requires
   a free account signup only the user can do; a commented-out script tag with instructions is at
   the bottom of every page's `<body>`, ready to uncomment once a site code exists.
9. [x] Local testing pass: served via a local static server (see `.claude/launch.json`), verified
   all 5 pages load with zero console errors and zero failed network requests, verified the
   motion toggle and reduced-motion path, verified responsive layout at 1280px and ~700px widths.
   **Not yet done:** a real cross-browser pass (Safari/Firefox) and a screen-reader/keyboard-nav
   audit — recommended before or shortly after launch.
10. [x] Pushed to github.com/14stutzmanav/14stutzmanav.github.io (force-pushed over an empty,
    abandoned prior attempt — user confirmed). Repo made **public** (required for GitHub Pages on
    the free plan — private-repo Pages needs a paid plan). GitHub Pages enabled, branch build from
    `main` root. Live at https://14stutzmanav.github.io/ once the push finishes deploying.
11. [ ] Sign up at formspree.io and swap `YOUR_FORM_ID` in `contact.html` for the contact form to work.
12. [ ] Buy + connect custom domain (alexis-stutzmanlewis.com, once availability is confirmed) —
    would need a `CNAME` file added at the repo root pointing to the domain.

## 9. Open items requiring user input before/during build

- [x] Domain name candidate — alexis-stutzmanlewis.com (availability still needs checking)
- [x] Full CV timeline (education, positions, honors/awards) — in `data/cv.json`
- [x] Confirmed DOIs + years for all publications — in `data/publications.json`
- [x] Headshot, Black In Genetics logo — placed in `assets/images/media/`
- [x] Black In Genetics page content — full biosketch text provided, in `data/black-in-genetics.json`
- [x] Contact form fields — delegated to Claude
- [x] Resolve Oct 27 vs. Oct 29, 2020 date discrepancy — confirmed as October 26, 2020
- [x] Research imagery/video for Just for Fun — imaginal disc GIF + C. elegans video, placed
- [x] CV PDF file for the "Download CV" button — using `260731_Stutzman_CV-online.pdf` (the
      privacy-conscious "online" version, no direct email listed), at `assets/documents/Stutzman_CV.pdf`
- [x] A second, more personal photo for Just for Fun — `fullsizeoutput_3985.jpeg` chosen, placed
      as `assets/images/media/personal-photo.jpg`
- [x] Contact page privacy — confirmed no public email; form + LinkedIn only, in `data/contact.json`
- [x] Final bio copy for Home + CV — approved, in `data/bio.json` (3rd person tagline, 1st person
      research statement)

All open items are resolved. Ready to move into the build sequence (§8).
