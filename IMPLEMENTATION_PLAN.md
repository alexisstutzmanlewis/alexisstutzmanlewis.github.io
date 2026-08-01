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
| Version control | Git, from day one | Repo initialized locally; push to GitHub when ready |
| Tech stack | Vanilla HTML/CSS/JS | No framework, no bundler, no `npm install` required to run |
| Content data | JSON files in `/data`, rendered client-side via `fetch()` | See §5. Avoids a build step while keeping publications/presentations/media editable without touching markup |
| Hosting | Netlify | Free tier; auto-deploys from GitHub; built-in form handling |
| Contact method | Real contact form (Netlify Forms) | No custom backend needed |
| Domain | Deferred | Launch on a free `*.netlify.app` subdomain first; buy a custom domain after review. **Open item: confirm desired domain name(s) to check availability.** |
| Analytics | Lightweight, privacy-friendly (GoatCounter) | Matches the reference site's approach — anonymous pageviews only, free, no cookie banner needed |

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
   - Education / positions timeline — **open item: need full timeline (institutions, dates, degrees, honors)**
   - Publications (simple chronological list, tags shown as labels, not filterable)
   - Presentations & posters (oral talks + posters, chronological)
   - In the Media (press/interviews, as a subsection here)
   - Prominent "Download CV (PDF)" button, alongside the full interactive web version
3. **Black In Genetics** (`black-in-genetics.html`) — feature page for the org founded in 2020;
   mission, story, link out to blackingenetics.com. **Open item: how much content vs. just a
   feature-and-link?**
4. **Just for Fun** (`just-for-fun.html`) — personal content: research-organism photos/video
   (fly imaginal disc, C. elegans embryo video), "outside the lab" reflections, dedication to Rosie.
5. **Contact** (`contact.html`) — Netlify-powered contact form (name/email/message) plus direct
   email and LinkedIn links. **Open item: confirm exact form fields wanted.**

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

Publications, presentations, and media entries are pre-populated as a starting draft in `/data`
directly from the user's existing Notion page content — **these need a final accuracy pass**,
especially DOIs and years marked `TODO` below:

- [`data/publications.json`](data/publications.json) — 4 entries drafted; DOIs/years need
  confirmation (the Notion page truncated DOI links visually, e.g. `doi.org/10.…0325-2`).
- [`data/presentations.json`](data/presentations.json) — `oral` and `posters` arrays, fully
  populated with titles/venues/dates from Notion.
- [`data/media.json`](data/media.json) — 2 entries (Front Line Genomics interview, NC DNA Day
  article).

Each page's JS (`assets/js/render-cv.js`, etc.) fetches the relevant JSON and renders it into the
DOM at load time — content edits going forward mean editing these files, never the HTML/CSS.

**Still needed from the user, not yet in `/data`:**
- Full education/positions/honors timeline for the CV page
- Confirmed/corrected DOIs and years for all 4 publications
- CV as a downloadable PDF
- Bio/research-statement text (can be drafted from the Notion "My Science" text and refined)
- Headshot photo, research imagery/video, Black In Genetics logo (user confirmed these are mostly
  ready to send)
- Domain name candidate(s) to check availability
- Exact contact form field list

## 6. Folder structure

```
Website/
├── .gitignore
├── netlify.toml
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

## 8. Build sequence (next phase)

Once outstanding content items in §5 are resolved (or explicitly deferred with placeholders):

1. `base.css` + `components.css` — global styles, nav, buttons, cards, cursor-glow, wash backgrounds,
   motion toggle, reduced-motion handling.
2. `main.js` — shared interaction behavior.
3. Home page.
4. CV page + `render-cv.js` + PDF link.
5. Black In Genetics page.
6. Just for Fun page.
7. Contact page + Netlify form wiring.
8. Favicon, OG image, meta tags, sitemap/robots.
9. Cross-browser/mobile pass, accessibility pass (reduced motion, contrast, keyboard nav).
10. Connect GitHub repo to Netlify, deploy to `*.netlify.app`, review live.
11. Buy + connect custom domain (once name is chosen).

## 9. Open items requiring user input before/during build

- [ ] Domain name candidate(s)
- [ ] Full CV timeline (education, positions, honors/awards)
- [ ] Confirmed DOIs + years for the 4 publications
- [ ] CV PDF file
- [ ] Headshot, research photos/video, Black In Genetics logo
- [ ] Black In Genetics page content depth (feature blurb vs. fuller writeup)
- [ ] Exact contact form fields
- [ ] Final bio/research-statement copy for Home + CV
