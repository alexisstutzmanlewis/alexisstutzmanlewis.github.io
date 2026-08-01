# alexisstutzmanlewis — personal site

Personal academic/professional site for Alexis Stutzman Lewis, Ph.D. Vanilla HTML/CSS/JS, no
build step, deployed on Netlify.

See [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) for the full design system, information
architecture, and build plan.

## Local development

No install or build step — open any `.html` file directly in a browser, or serve the folder with
any static file server (e.g. `python3 -m http.server`) so `fetch()` calls to `/data/*.json` work
correctly (some browsers block `fetch` on the `file://` protocol).

## Deploy

Connected to Netlify: pushes to `main` auto-deploy. No build command; publish directory is the
repo root (see `netlify.toml`).
