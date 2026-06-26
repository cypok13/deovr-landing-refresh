# DeoVR — Landing Page Refresh

A modern, premium, conversion-focused refresh of the [DeoVR player download page](https://deovr.com/app), built as an **AI Design Challenge** entry.

**Live demo:** _see the link attached with this submission_

## What this is

A single, self-contained marketing page for DeoVR — the free cross-platform VR video player. It keeps DeoVR's dark, neon-accented brand and reworks the layout, hierarchy, and UX into a focused download experience:

- **Hero** — clear value proposition, single primary CTA, live in-product video with an ambilight bleed.
- **Features** — a bento grid: two featured cards (color grading before/after, A–B loop) plus four supporting capabilities.
- **Social proof** — real Steam-style user testimonials.
- **File-format auto-recognition** — explains DeoVR's filename-tag parsing with a visual marker glossary.
- **Download** — a headset selector that drives a contextual download card (no account, no catch).
- **Footer** — full sitemap and social links.

## Tech

- **Plain HTML + CSS + vanilla JS.** No framework, no build step, no dependencies.
- One small script (`hero-tilt.js`) drives autoplay, 3D card tilt, the floating header, smooth-scroll, and the cursor glow.
- External resources: Google Fonts (Manrope, JetBrains Mono) and [Simple Icons](https://simpleicons.org/) CDN for headset logos.
- Fully responsive (desktop / tablet / mobile), dark-theme native, with `:focus-visible` states for keyboard users.

## Run locally

No tooling required — just serve the folder over HTTP (needed so the video and assets load):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
.
├── index.html        # the page (HTML + inline CSS)
├── hero-tilt.js      # interaction layer (autoplay, tilt, header, scroll)
├── favicon.svg
└── assets/
    ├── deovr-hero.webm   # in-product demo clip
    ├── frame-moto.jpg    # feature still
    └── logo-deovr.svg    # wordmark
```

## Credits

Brand, logo, and product belong to DeoVR. This is a design exercise, not an official page.
