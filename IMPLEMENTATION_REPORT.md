# ASTRA — Implementation Report

Date: 2026-09-30 · Branch: `main2`

The ASTRA design language (navy / white / saffron, condensed uppercase display
type, square buttons, full-bleed media, cinematic scroll) was preserved. No
section was redesigned, reordered or removed except where noted under
**Recognition**. No new dependency was added; no framework was changed.

---

## 1. What was broken

The audit that preceded this work was **partly wrong**, and each claim was
re-verified before acting.

**Did not reproduce** (no change made):

- Build failing — `npm run build` was already clean.
- Typecheck failing — `tsc --noEmit` was already clean.
- Horizontal overflow — measured at 11 widths from 1440 down to 320; none.
- Console errors / failed requests beyond the missing images — none.
- Replit dev plugins leaking into production — `runtimeErrorOverlay` self-gates;
  it is absent from the production bundle (verified by grep over `dist`).
- Missing Three.js — the pseudo-3D showcase is layered 2D + Framer Motion by
  design and works. Nothing was introduced.

**Confirmed and fixed** — see the issue table in §14.

The dominant real problem was assets: **17 referenced images did not exist**,
and `AssetImage` rendered a literal `Upload: <filename>.jpg` box for each one —
visible on the page and announced to screen readers via `aria-label`.

---

## 2. Assets

### Recovered from git history

Branch `origin/Astra-updates` (commit `32cdebc`, never merged) contains five
images and a `lab.mp4` deleted from `main`. All five were extracted and
inspected.

**None were used**, deliberately:

- `award-startup-punjab.jpg` — AI-generated award ceremony carrying **another
  company's branding** ("AETHEL UAV / VAYU AEROSPACE") and a fabricated
  Government of Punjab emblem. Publishing it as evidence of a real state award
  would be a fabricated record about a real institution.
- `award-indian-army.jpg` — AI-generated Indian Army officers, presented as
  documentation of a real Army engagement.
- `recognition-iit-ropar.jpg` — usable composition but visible garbled text
  artifacts ("ADRAL", "Wlrflansber").
- `recognition-ew-combat.jpg`, `recognition-high-altitude.jpg` — good quality
  and on-brand; retained as candidates but not wired in, per the decision to
  supply real photography.

They remain retrievable from that branch. They are documented rather than
silently discarded.

### Optimised

| Asset | Before | After |
|---|---|---|
| `drone1.png` → `drone1.webp` | 1317 KB | 62 KB |
| `drone2.png` → `drone2.webp` | 519 KB | 49 KB |
| `drone3.png` → `drone3.webp` | 49 KB | 10 KB |
| `drone4.png` → `drone4.webp` | 72 KB | 12 KB |
| **Total** | **1957 KB** | **133 KB** |

Alpha channels preserved; output inspected visually against the originals at
full size before the PNGs were deleted.

### Removed

- `public/drones/` — a byte-identical duplicate of `drone-01…04.png` with **zero
  references** anywhere in the codebase. 1.9 MB of dead payload.
- `tsconfig.tsbuildinfo` — tracked in git despite matching `.gitignore`.

### Asset table

| Asset | Status | Location | Used by |
|---|---|---|---|
| `logo1.png` | Present | `public/assets/images/` | Header, footer, favicon, schema.org |
| `hero-poster.jpg` | Present | `public/assets/images/` | Hero poster, `og:image`, `twitter:image` |
| `drone1.webp` | Present (converted) | `public/assets/images/` | Scroll showcase 01 |
| `drone2.webp` | Present (converted) | `public/assets/images/` | Scroll showcase 02 |
| `drone3.webp` | Present (converted) | `public/assets/images/` | Scroll showcase 03 |
| `drone4.webp` | Present (converted) | `public/assets/images/` | Scroll showcase 04 |
| `hero-landing.mp4` | Present | `public/assets/videos/` | Hero film (desktop, full-motion only) |
| `segment-defence.jpg` | **Outstanding** | — | Segments |
| `segment-commercial.jpg` | **Outstanding** | — | Segments |
| `product-fpv.jpg` | **Outstanding** | — | Fleet |
| `product-unjamable.jpg` | **Outstanding** | — | Fleet |
| `product-logistics.jpg` | **Outstanding** | — | Fleet |
| `product-surveillance.jpg` | **Outstanding** | — | Fleet |
| `product-kamikaze.jpg` | **Outstanding** | — | Fleet |
| `product-vtol.jpg` | **Outstanding** | — | Fleet |
| `product-fiber-optic.jpg` | **Outstanding** | — | Fleet |
| `product-training.jpg` | **Outstanding** | — | Fleet |
| `interceptor.jpg` | **Outstanding** | — | Interceptor feature |
| `drone-lab.jpg` | **Outstanding** | — | Drone Lab feature |
| `tile-mission.jpg` | **Outstanding** | — | Story tiles |
| `tile-training.jpg` | **Outstanding** | — | Story tiles |
| `tile-contact.jpg` | **Outstanding** | — | Story tiles |
| `award-startup-punjab.jpg` | Rejected (fabricated) | `origin/Astra-updates` | — |
| `award-indian-army.jpg` | Rejected (fabricated) | `origin/Astra-updates` | — |
| `recognition-*.jpg` (×3) | Unused candidates | `origin/Astra-updates` | — |

The 15 outstanding files are being supplied separately. Required subject, aspect
ratio and minimum resolution for each are specified in **`ASSET-MANIFEST.md`**.
Until then each slot renders a neutral ASTRA-branded panel — navy, subtle
diagonal texture, saffron diamond motif, **no text of any kind**.

---

## 3. Files modified

| File | Change |
|---|---|
| `src/App.tsx` | Rewritten: production-safe `AssetImage`, `<h1>`, hero media strategy, text-only Recognition, a11y, dead providers removed, showcase lazy-loaded |
| `src/index.css` | Placeholder restyle, `Upload:` overlay removed, skip link, anchor offsets, award cards, font `@import` removed |
| `src/components/drone-showcase.tsx` | PNG → WebP references |
| `index.html` | Viewport, social metadata, font loading, JSON-LD |
| `package.json` | Added `verify:assets` and `lint` scripts |
| `scripts/verify-assets.mjs` | **New** — automated asset reference verification |
| `ASSET-MANIFEST.md` | **New** — specification for the outstanding photography |
| `IMPLEMENTATION_REPORT.md` | **New** — this document |

Deleted: `public/drones/` (4 files), `public/assets/images/drone[1-4].png`,
`tsconfig.tsbuildinfo`.

---

## 4. CSS changes

- `.asset-placeholder` — grey dev box with filename → neutral navy panel with
  saffron diamond, no text, `aria-hidden`.
- `.hero-poster::before` — **removed**. It hard-coded
  `content: 'Upload: hero-poster.jpg'` and rendered unconditionally over a
  poster image that *does* exist. Visible whenever the video was absent — i.e.
  on every mobile visit and every reduced-motion visit.
- `scroll-margin-top: 92px` on all eight anchor targets (`#top` excluded — it is
  the page origin). Previously anchor jumps landed headings underneath the
  fixed header.
- `.skip-link` — new, first tab stop, revealed on focus.
- `.award-card` — image frame replaced with a 2px navy rule + tag/heading/body.
- `.drone-stage-fallback` — reserves the exact stage height during lazy load.
- Google Fonts `@import` removed from CSS (see §8).

Deliberately **not** changed: `320vh` stage height, `100svh` sticky, `100dvh`
hero, negative-margin and `overflow: clip` containers. Each was checked against
the design intent and measured; all are load-bearing and none caused clipping or
overflow at any tested width.

---

## 5. Animation changes

None to timing, easing, or choreography. The showcase, hero reveal and parallax
are byte-for-byte the same behaviour. Two structural changes:

- The showcase is `React.lazy`-loaded with a height-reserving fallback.
- The hero film no longer mounts at all on narrow viewports, reduced-motion, or
  Save-Data; previously it mounted, downloaded and played everywhere.

---

## 6. Performance changes

Measured on the production build over a local static server, Chromium.
Mobile column: 390×844, 4× CPU throttle, 1.6 Mbps / 150 ms RTT.

| Metric | Before | After |
|---|---|---|
| JS (gzip) | 151.3 KB | **65.6 KB** initial + 45.0 KB deferred |
| Desktop FCP | 276 ms | **88 ms** |
| Desktop LCP | 320 ms | **176 ms** |
| Desktop CLS | — | **0.016** |
| Mobile FCP | 2856 ms | **2144 ms** |
| Mobile LCP | 3684 ms | **2812 ms** |
| Mobile CLS | — | **0.002** |
| Mobile transfer | — | **676 KB** (desktop 1965 KB — video correctly skipped) |

Contributing changes:

1. `@tanstack/react-query`, `Toaster` and `TooltipProvider` were mounted but
   **never used** — no `useQuery`, no `toast()`, no `<Tooltip>` anywhere. Removed
   from the render tree.
2. Showcase (and with it all of Framer Motion) split into a deferred chunk.
3. Fonts moved out of the CSS `@import` chain to a preloaded, async-applied
   stylesheet with `preconnect` and a `<noscript>` fallback.
4. Hero poster preloaded at high priority; hero video `preload="auto"` →
   `"metadata"`, and not mounted at all below 768 px / reduced-motion / Save-Data.
5. `loading="lazy"` + `decoding="async"` on all below-fold imagery; `eager` +
   `fetchpriority="high"` on the logo.
6. 3.8 MB of duplicate and unoptimised image payload eliminated.

---

## 7. Accessibility changes

- **Added the page's only `<h1>`.** The document previously had **zero** — the
  Sanskrit motto was a `<p>`. It is now `<h1 lang="sa">`, visually identical.
- Removed `maximum-scale=1` from the viewport meta, which blocked pinch-zoom.
- Skip link to main content as the first tab stop.
- `Upload: <filename>` is no longer exposed to screen readers; the fallback
  panel is `aria-hidden` and the surrounding heading carries the meaning.
- Descriptive alt text on every content image; story-tile images are decorative
  (`alt=""`) since their headings already name them.
- Mobile menu: closes on `Escape`, locks background scroll while open, correct
  `aria-expanded` / `aria-controls`.
- Every section is `aria-labelledby` its own heading.
- Three identical "Explore" links now carry distinct `aria-label`s.
- All decorative icons `aria-hidden`; hero video `aria-hidden` + `tabIndex={-1}`.
- `lang="sa"` on both Sanskrit strings.

Verified: skip link is the first tab stop and visible on focus; tab order is
Skip → Brand → 5 nav items → Replay → Scroll → content.

---

## 8. SEO changes

- `og:type`, `og:site_name`, `og:locale`, `og:image:alt` added.
- `og:image` / `twitter:image` switched from the logo to `hero-poster.jpg`
  (1920×1080) — a logo does not render as a social card.
- `theme-color` added.
- Organization JSON-LD with the real address, phone and email already in the app.
- Semantic heading order now starts at `h1`.

**`canonical` and `og:url` were deliberately omitted, and no sitemap was
generated.** No production domain exists anywhere in the project configuration,
and the brief forbids inventing one. Both are one-line additions once the
hostname is known; the omission is commented in `index.html`.

---

## 9. Dependency changes

**None.** No package added, removed, or version-changed. Recharts and the
remaining Radix packages were left alone: they are `devDependencies` that
tree-shake out of the bundle, and upgrading them carries risk with no benefit
here. `@tanstack/react-query`, `sonner` and the tooltip primitives are no longer
*mounted*, but remain installed — `src/components/ui/` still imports them, and
removing that library was out of scope.

---

## 10. Responsive changes

Tested at 1440, 1280, 1024, 834, 768, 600, 430, 414, 390, 375 and 320 px.

- **Zero horizontal overflow at every width**, before and after.
- Anchor navigation verified at desktop: all five nav targets land their heading
  clear of the fixed header (heading top 217–243 px vs header bottom 93 px).
  Mobile nav verified too — menu closes and `#fleet` lands at 93 px.
- Showcase cards measured against the sticky container bottom at 320/390/768 px:
  17–31 px of clearance, no clipping.
- Recognition grid reflows cleanly now that it is text-only.

---

## 11. Error handling

- Missing or corrupt image → neutral branded panel, never a broken-image icon or
  developer text. Confirmed: 15 missing files produce 15 panels and **0** broken
  visible images.
- Failed video → poster remains; `play()` rejection resolves the motto reveal so
  the hero can never stall unrevealed.
- `ErrorBoundary` retained; its diagnostic `<pre>` is already `import.meta.env.DEV`-gated.
- Reduced motion → static showcase, no video mounted, motto visible immediately.

---

## 12. Development artifacts

Repository-wide sweep for `Upload:`, `TODO`, `FIXME`, `HACK`, `TEMP`, `DEBUG`,
`dummy`, `mock`, `placeholder`, `localhost`, `127.0.0.1`, `console.log`.

Removed: the two `Upload:` sites (component + CSS).
Kept as legitimate: Tailwind `placeholder:` utility classes in `src/components/ui/`;
`console.log` in `scripts/verify-assets.mjs` (a CLI tool, not shipped);
`console.error` in the error boundary; `data-testid` attributes (test hooks).

Live DOM assertion at four widths: `devText=false` — no such string reaches the
rendered page.

---

## 13. Results

| Check | Result |
|---|---|
| `npm run build` | **Pass** — 869 ms, no warnings |
| `npm run typecheck` | **Pass** — 0 errors |
| `npm run lint` | **Pass** — aliased to `tsc --noEmit`; no ESLint config exists in this project |
| `npm run verify:assets` | **Pass** — 22 references checked, 0 broken, 15 awaiting supply |
| Browser testing | **Pass** — Playwright 1.63 + Chromium, 11 viewports |
| Broken imports | None |
| Broken asset references | None (15 files pending supply, tracked) |
| Visible placeholders | None |
| Console errors | Only the 15 pending-image 404s |
| Horizontal overflow | None at any width |

---

## 14. Issue table

| ID | Severity | Issue | Resolution | File |
|---|---|---|---|---|
| 1 | Critical | 17 images referenced, 0 present | Fallback made production-safe; 2 resolved by removing fabricated award photos; 15 specified in `ASSET-MANIFEST.md` | `src/App.tsx` |
| 2 | Critical | `AssetImage` rendered `Upload: <file>.jpg` on the page | Neutral branded panel, no text | `src/App.tsx` |
| 3 | Critical | `.hero-poster::before` hard-coded `Upload: hero-poster.jpg`, shown unconditionally over a real asset | Rule removed | `src/index.css` |
| 4 | Critical | Fabricated AI award photos depicting a real government award and the Indian Army, one with a competitor's branding | Not used; Recognition rebuilt as text-only editorial cards | `src/App.tsx` |
| 5 | High | Document had **no `<h1>`** | Motto promoted to `<h1 lang="sa">`, visually identical | `src/App.tsx` |
| 6 | High | `maximum-scale=1` blocked pinch-zoom | Removed | `index.html` |
| 7 | High | Anchor navigation put headings under the fixed header | `scroll-margin-top: 92px` on all targets | `src/index.css` |
| 8 | High | `Upload: <file>` announced to screen readers via `aria-label` | Fallback `aria-hidden`; heading carries meaning | `src/App.tsx` |
| 9 | High | 1.96 MB of unoptimised PNGs | WebP, 133 KB, alpha preserved | `public/assets/images/` |
| 10 | High | `public/drones/` — 1.9 MB duplicate, zero references | Deleted | — |
| 11 | Medium | react-query / Toaster / TooltipProvider mounted, never used | Unmounted; −45 KB gzip | `src/App.tsx` |
| 12 | Medium | Framer Motion in the initial bundle for a below-fold section | Lazy-loaded with height-reserving fallback | `src/App.tsx` |
| 13 | Medium | Hero video `preload="auto"`, downloaded on every device | `preload="metadata"`; not mounted <768px / reduced-motion / Save-Data | `src/App.tsx` |
| 14 | Medium | Fonts `@import`-ed from CSS — serialised behind the stylesheet | `preconnect` + async `preload`, `<noscript>` fallback | `index.html`, `src/index.css` |
| 15 | Medium | No skip link | Added as first tab stop | `src/App.tsx` |
| 16 | Medium | Mobile menu: no `Escape`, no scroll lock | Both added | `src/App.tsx` |
| 17 | Medium | `og:image` was the logo — does not render as a social card | Switched to `hero-poster.jpg` | `index.html` |
| 18 | Medium | Footer Privacy / Terms linked to `#top` — dead links | Removed rather than fabricate policy pages | `src/App.tsx` |
| 19 | Low | Three identical "Explore" links | Distinct `aria-label`s | `src/App.tsx` |
| 20 | Low | No structured data | Organization JSON-LD | `index.html` |
| 21 | Low | `tsconfig.tsbuildinfo` tracked despite `.gitignore` | Untracked and deleted | — |
| 22 | Low | No automated asset verification | `npm run verify:assets` | `scripts/verify-assets.mjs` |

---

## 15. Remaining known issues

1. **15 photographs outstanding.** The blocking item. Spec in `ASSET-MANIFEST.md`;
   `npm run verify:assets -- --strict` gates CI once supplied.
2. **No canonical URL, `og:url` or sitemap** — blocked on a production domain.
3. **`drone3.webp` / `drone4.webp` are 291×287 and 299×303.** Adequate at 1× but
   soft on high-DPI displays. Re-export from source at ≥600 px if available.
4. **Footer has no Privacy or Terms page.** Links removed rather than left dead;
   restore them when the policies exist.
5. **Mobile LCP 2.8 s** under deliberately harsh throttling (4× CPU, 1.6 Mbps).
   Real 4G on a mid-range device will be well under this. Further gains would
   need server-side rendering — a larger change than this work warranted.
6. **`src/pages/not-found.tsx` is orphaned** — no router is installed. Harmless
   (tree-shaken), left in place in case routing is planned.
7. **Testing was Chromium-only.** No Safari or Firefox engine is available in
   this environment, so iOS Safari `100dvh` / `100svh` and safe-area behaviour is
   **unverified on a real device**. The CSS is correct by spec and behaves under
   Chromium's mobile emulation, but this should be checked on hardware.

---

## 16. Production readiness

**Ready to deploy, with one gate.**

Build, typecheck, asset verification, responsive behaviour, accessibility,
keyboard navigation, reduced motion, error handling and performance are all
green. The site is coherent and contains no placeholder text, no dead links and
no fabricated claims.

The gate is the 15 photographs. The site is fully functional without them —
every slot degrades to a deliberate branded panel rather than a broken state —
but the Fleet and Segments sections will not read as a finished product
portfolio until real imagery lands. Dropping correctly named files into
`public/assets/images/` requires no code change.

Recommended before launch: supply the photography, add `canonical` + `og:url`
once the domain exists, and spot-check on a physical iOS device.

---

# Addendum — Cinematic redesign (2026-09-30)

Two sections were redesigned: **Advanced Aerial Systems** and **Mission Ready**.
No other section was touched.

## 1. Advanced Aerial Systems — what changed

`src/components/drone-showcase.tsx` was rewritten. The old version flew all four
drone images from a top row into a bottom grid *simultaneously* (staggered by
only 0.045 of progress), which is why it read as four cards animating
independently rather than as a sequence.

**New model.** A 440vh scroll container holds a sticky 100svh stage. One
MotionValue drives everything:

```
useScroll(target: section, offset: ['start start','end end'])
  -> useSpring(stiffness 260, damping 42, mass 0.35, restDelta 0.0004)
  -> localProgress(global, index)   // per-platform 0..1 window
  -> useTransform(...)              // every animated property
```

Global progress is sliced into one window per platform (`LEAD` 0.02, span
0.245). Inside its window each platform runs the same five beats:

| Local t | Beat | Behaviour |
|---|---|---|
| 0.00–0.20 | Image reveal | opacity 0→1, scale 0.92→1, y 46→0. The aircraft alone. |
| 0.20–0.42 | Information layer | Panel emerges from behind the plate: opacity 0→1, y 58→6, x −22→6, rotateY −6°→−1.5°. Image begins shifting aside. |
| 0.42–0.62 | Depth separation | Plate pushes forward — scale →1.05, rotateY →5°, rotateZ →−1.6°, y →−14. Panel settles to rotateY 0. |
| 0.62–0.84 | Final position | Stable. No residual motion, no wobble. |
| 0.84–1.00 | Handoff | Plate recedes (scale →0.96, y →−38, opacity →0); next platform takes over. |

Specs trail the panel by ~0.12 of progress so the block assembles rather than
pops. A four-segment progress rail at the bottom fills as each platform runs —
also driven by the same MotionValue.

Two edge cases were found by tracing the sequence in the browser and fixed:

- **The stage opened on an empty frame.** Platform 01 is now pre-revealed
  (`enterAt = 0`), so the section opens on the aircraft as specified.
- **The stage ended on an empty frame.** Platform 04 now holds its settled pose
  (`exitAt = 4` pushes its exit keyframes past t=1) until the sticky releases.

**Bugs found during visual QA and repaired:**

| Symptom | Cause | Fix |
|---|---|---|
| Heading overflowed the viewport to the right | Framer Motion writes `transform` on `motion.header`, clobbering the CSS `translateX(-50%)` used for centring | Centre with `inset-inline: 0` + `margin-inline: auto`; motion owns `transform` exclusively |
| Progress rail shifted off-centre | A later `margin: 0` in the same rule overrode `margin-inline: auto` | Removed |
| Dark band inside the media plate | Stale `aspect-ratio` rules in the responsive blocks forced plate height beyond the image | Removed; plate is now `width: fit-content` and hugs its image |
| Portrait render heavily pillarboxed; square render floated as a white box on navy | A single fixed 16:10 frame cannot serve four very different source ratios | Plate sizes to its image. `webpinfo` confirmed **no alpha** in any render, so the two white-background shots sit on a plate colour sampled from their own corners (`#f9fbfc`) and the edge disappears |

**Performance.** No scroll listeners, no `setState` during scroll. The only
component state is a `matchMedia` flag for motion amplitude. All animation is
MotionValue-driven.

**Mobile.** Motion amplitude drops to 0.45 below 900px, perspective from 1800px
to 1100px, the slide stacks image-over-information, the rail drops its titles,
and the section shortens to 400vh.

**Reduced motion.** Unchanged approach: a flat editorial list of all four
platforms, `height: auto`, no transforms. Verified: 4 slides, no video, 0 errors.

## 2. Mission Ready — what changed

Rebuilt from a bare 4-column image grid into a fleet catalogue matching the
supplied reference.

- **Data-driven.** One `fleet` array of eight objects (`number`, `tag`, `name`,
  `detail`, `image`, `alt`); a single card template renders all eight.
- **Card anatomy.** Category tag over the image (top-left), 16:10 media with a
  centred `cover` crop, then a `number / name + description / arrow` row.
- **Surface.** Near-black card on a navy stage, 1px `rgba(255,255,255,.1)`
  border, saffron reserved for the tag, number and arrow.
- **Background.** Radial vignette + 84px technical grid, kept well below the
  images in contrast.
- **Hover** (pointer devices only): image `scale(1.045)`, border warms to
  saffron, arrow fills and shifts 3px, tag inverts. No rotation, no bounce.
- **Reveal.** CSS scroll-driven `animation-timeline: view()` with a per-card
  stagger (70ms across, 110ms down) — opacity + 18px rise only. No transform
  work on the main thread, and it is inside
  `@media (prefers-reduced-motion: no-preference)`.
- **CTA strip.** Lead line, detail copy and `TALK TO OUR ENGINEERS →` pointing
  at the existing `#contact` anchor. No new backend.
- **Responsive.** 4 columns ≥1080px, 2 columns ≥768px, 1 column below.

## 3. Assets — all 8 mappings

Installed to `public/assets/images/fleet/`, re-encoded with
`cwebp -q 86 -sharp_yuv -m 6`. **Source files were not modified or deleted.**

| # | Card | Source file | Installed as | Size |
|---|---|---|---|---|
| 01 | FPV Drone | `Tactical FPV Drone at Golden Hour.png` | `fleet-fpv.webp` | 179 KB |
| 02 | Unjamable Drone | `Tactical Hexacopter Over Alpine Ridge.png` | `fleet-unjamable.webp` | 203 KB |
| 03 | Logistics Drone | `Golden-Hour Mountain Cargo Drone.png` | `fleet-logistics.webp` | 190 KB |
| 04 | Surveillance Drone | `Golden-Hour Surveillance Drone Over Mountain Valley.png` | `fleet-surveillance.webp` | 199 KB |
| 05 | Kamikaze Drone | `Sunset Loitering Munition Launch Platform.png` | `fleet-kamikaze.webp` | 163 KB |
| 06 | VTOL Drone | `Futuristic VTOL at Sunset.png` | `fleet-vtol.webp` | 171 KB |
| 07 | Fiber Optic Drone | `ndustrial Drone Deploying Fiber Cable at Sunset.png` | `fleet-fiber-optic.webp` | 245 KB |
| 08 | Training Drone | `Training Done.png` | `fleet-training.webp` | 211 KB |

The filename `ndustrial…` was verified on disk before use — it does begin with
`n`, not `I`. Total 16.6 MB PNG → **1.56 MB WebP**. All are 1584×993 except FPV
and Unjamable at 1586×992; all share the same golden-hour grade, so the grid
reads as one portfolio.

`object-fit` was decided per composition rather than globally: the fleet cards
use **cover** (wide environmental shots, aircraft centred — the crop removes
only sky and foreground), while the Advanced Aerial Systems plates use
**contain** (mixed portrait/landscape/square product renders that must stay
whole).

**Outstanding assets: 15 → 7.** All eight `product-*.jpg` references are gone;
no dead image references remain (verified by grep and by `npm run verify:assets`).

## 4. Other changes

- **Active nav section.** `useActiveSection()` uses `IntersectionObserver`
  (threshold set + `-92px` root margin), not a scroll handler — state changes
  once per section crossing. Verified: viewing `#fleet` marks the fleet nav item
  active, and so on for all five.
- **`scripts/verify-assets.mjs`** now recurses into subdirectories, so
  `fleet/*.webp` is checked and the directory is no longer misreported as an
  orphan.

## 5. Validation

| Check | Result |
|---|---|
| `npm run typecheck` | **Pass** — 0 errors |
| `npm run lint` | **Pass** — `tsc --noEmit`; no ESLint config in this project |
| `npm run build` | **Pass** — 878 ms, no warnings |
| `npm run verify:assets` | **Pass** — 22 references, 0 broken, 7 awaiting supply |
| Browser | **Pass** — Playwright 1.63 + Chromium |

Browser results, production build served statically:

- **11 widths** (1440→320): zero horizontal overflow, 8/8 fleet images loaded,
  0 broken images, exactly 1 `<h1>`, no developer text, **0 console errors**
  other than the 7 known missing-asset 404s.
- **Scroll sequence traced at 12 progress points**, desktop and mobile: exactly
  one platform visible at a time, information emerging after its image, no
  navbar overlap, no bottom clipping, no dead frames, 0 page errors.
- **Anchors**: all five land their heading clear of the 93px fixed header.
- **Reduced motion**: static list of 4 platforms, no video, cards fully opaque,
  0 errors.

Core Web Vitals (production build; mobile = 390×844, 4× CPU, 1.6 Mbps/150 ms):

| Metric | Before addendum | After |
|---|---|---|
| Desktop FCP / LCP / CLS | 88 ms / 176 ms / 0.016 | **48 ms / 156 ms / 0.008** |
| Mobile FCP / LCP / CLS | 2144 ms / 2812 ms / 0.002 | **2176 ms / 2852 ms / 0.002** |
| Initial JS (gzip) | 65.6 KB | 66.4 KB |

Adding 1.56 MB of photography cost ~8 KB on initial transfer, because every
fleet image is below the fold and lazy-loaded.

## 6. Git

- Branch: **`main2`** (unchanged; never switched).
- Identity: the local config read `Kkour8585@gmail.com` with a capital K. Per
  the instruction to set it if necessary, it is now exactly
  **`Kulwinder Kour <kkour8585@gmail.com>`**.
- **No commit was made.** All work is in the working tree. No history was
  rewritten, nothing was force-pushed, no destructive Git command was run, and
  the pre-existing uncommitted work was preserved.

## 7. Open item

The nav item pointing at `#fleet` is still labelled **“Products”**, while the
supplied reference shows **“FLEET”**. The existing navbar was preserved as
instructed, so this was left alone — it is a one-word content change if wanted.
`Astra im/mission.png` was supplied but not in the mapping, so it was not
installed; it would suit `tile-mission.jpg`.

---

## Addendum 2 — Advanced Aerial Systems vertical rhythm

**Reported:** too much empty space around the platform image.

**Cause.** `.aas-media img` was sized `width/height: auto` with only *maximum*
caps. Two of the four renders are tiny at source (`drone3` 291×287,
`drone4` 299×303), so they drew at natural size — roughly 300px of artwork
floating in a 100svh stage, with ~240px of dead navy above and below.

**Fix.** Each platform now carries its intrinsic dimensions in the data, and the
plate takes that exact `aspect-ratio` with a fixed height. The plate is
therefore always image-shaped — nothing is letterboxed or cropped — and all
four fill the same height regardless of source size. Stage and heading padding
were tightened alongside.

| Viewport | Plate before | Plate after | Gap above/below |
|---|---|---|---|
| 1440×900 | 419px | **604px** | 240px → **146px** |
| 1440×1000 | 419px | **671px** | 240px → **162px** |
| 1440×1100 | 419px | **713px** | 254px → **191px** |

The plate is `min(64svh, 680px)` on desktop and `min(48svh, 400px)` below
900px, where the information panel stacks under the image and the extra height
is not available.

Re-verified after the change: 11 widths with zero overflow, sequence traced at
12 progress points, anchors clear, reduced motion intact, 0 page errors.

**Known consequence.** `drone3`/`drone4` are now drawn at roughly 2.2× their
native resolution and are visibly soft. Re-exporting those two frames at
≥800px on the long edge would resolve it; no CSS change can.

---

# Addendum 3 — Segments / "Built for consequence" (2026-09-30)

Only the Segments section changed. Hero, Advanced Aerial Systems, Mission Ready,
Interceptor, Drone Lab, Recognition, Story tiles, Contact and Footer are
untouched.

## Assets

All three supplied files were verified on disk before use — both carry quirks
worth noting, and both were used verbatim rather than guessed at:

- `backgroun image.png` — misspelled, no `d`.
- `Cargo Drone Over Golden Valley  .png` — two spaces before the extension.

| Source | Installed as | Size |
|---|---|---|
| `backgroun image.png` (1554×1012) | `segments/segments-hangar.webp` | 2.1 MB → 204 KB |
| `Tactical Drone Over Mountain Valley.png` (1536×1024) | `segments/segment-defence.webp` | 2.2 MB → 202 KB |
| `Cargo Drone Over Golden Valley  .png` (1536×1024) | `segments/segment-commercial.webp` | 2.5 MB → 303 KB |

6.8 MB → 709 KB. Originals were not modified or deleted.

## Composition

`src/components/segments.tsx` (new) replaces the inline `Segments` function that
was in `App.tsx`. Layer order:

```
hangar plate -> gridlines -> atmosphere -> vignette -> content -> cards
                    (HUD + spec callouts live inside the plate)
```

**On the "3D drone" requirement.** None of the project's drone renders carry an
alpha channel — `webpinfo` reports `Alpha: 0` for all four. Compositing one over
the hangar would have pasted an opaque rectangle into the scene, which is
exactly the fake-looking 3D the brief warns against. The supplied hangar art
already contains a holographic drone on a lit projection platform, so that is
the centrepiece, and the depth is built around it instead of on top of it.

**How the depth is actually produced.** The plate is held at the source art's
exact 1554×1012 ratio, so every overlay can be positioned in the *image's own*
coordinates and stays locked to the hologram at any viewport aspect. The HUD —
two counter-rotating rings, a sweeping scan line and four corner brackets — is
centred at 51.5% / 51.4%, which is where the holographic drone sits in the art.

Depth then comes from differential motion, not from stacking transforms:

| Layer | Pointer response | Scroll response |
|---|---|---|
| Hangar plate | 9px | scale 1.08 → 1.02 → 1.06, y −3% → 3% |
| Gridlines | 14px | — |
| Spec callouts | 16px | — |
| HUD | 22px | y 6% → −6%, opacity ramp |
| Heading / cards | 6px / 5px | staggered rise |

Measured in the browser: moving the pointer corner-to-corner shifts the plate
**13px** and the HUD **31.8px**. The HUD moving ~2.4× the plate is what makes
the scene read as dimensional.

Cards carry a ±3° pointer tilt with `transform-style: preserve-3d`, and their
contents sit on real Z offsets (media 18px, body 30px, meta 40px) so the copy is
embedded in the panel rather than painted on it. Corner brackets are 18px
pseudo-elements. Hover: image `scale(1.045)`, border warms, CTA fills, arrow
shifts 4px — 550–700ms with a single premium easing curve.

## Self-review and repairs

Per the brief I reviewed the render myself rather than waiting. Four real faults,
all found by looking at screenshots and all fixed:

| Fault | Cause | Fix |
|---|---|---|
| Hangar art crushed to near-black; the platform, sunset opening and orange light strips were all lost | Atmosphere gradient far too heavy (.90/.92 stops) | Rebalanced to .78/.10/.20/.90 — dark at the edges, open through the middle |
| HUD brackets floated ~160px above the hologram they were meant to frame | HUD was centred in the *section*, while the plate was `cover`-cropped, so the two drifted apart | HUD moved inside the plate box, which is ratio-locked; registration is now exact at every aspect |
| Hologram and projection platform hidden behind the cards | Plate was vertically centred in a 1.64× viewport section, pushing the focal point down ~270px | Plate anchored to the top of the section; art masked to fade into the card field |
| Mobile showed a thin strip of art and a large dead band above the cards | At 100% width the 1.535 ratio plate is only ~0.65× as tall as it is wide | Plate overscaled to 225% below 768px and 128% on tablet; the hologram is at 51.5% so it stays centred |

Also tightened: spec callouts were illegible over bright hangar detail, so each
now carries its own blurred dark backing rather than relying on the art staying
dark behind it.

## Removed

The old `.segment-grid`, `.segment-card`, `.segment-copy` and `.segment-image`
rules are gone, along with the `defence` / `commercial` entries in `imageFiles`.
No dead references remain (`grep` clean; `verify:assets` clean). The grey
diagonal placeholder panels no longer appear anywhere in this section.

## Accessibility and motion

- Descriptive alt text on both card images; the entire stage is `aria-hidden`.
- Pointer parallax attaches **only** behind `(hover: hover) and (pointer: fine)`
  and is rAF-throttled to one state update per frame.
- Under `prefers-reduced-motion: reduce`: parallax frozen (verified — transform
  identical before and after pointer movement), ring/scan animations `none`,
  card tilt and transitions off, all content fully visible.
- On a touch context the plate transform stays `matrix(1,0,0,1,0,0)` — no
  listener is attached at all.

## Performance

Segments is `React.lazy`-loaded. It and the showcase now share one deferred
Framer Motion chunk, so initial JS is unchanged at **66.3 KB gzip** despite the
new section. Only `transform` and `opacity` are animated; `will-change` is set
on the four layers that actually move.

## Validation

| Check | Result |
|---|---|
| `npm run typecheck` | **Pass** — 0 errors |
| `npm run build` | **Pass** — 950 ms, no warnings |
| `npm run verify:assets` | **Pass** — 23 references, 0 broken, 5 awaiting supply |
| Browser | **Pass** — Chromium, 11 widths incl. 1920 and 320 |

Across 1920 / 1440 / 1280 / 1024 / 834 / 768 / 600 / 430 / 390 / 375 / 320:
zero horizontal overflow, 2/2 segment images, 8/8 fleet images, 0 broken images,
one `<h1>`, no developer text, **0 console errors** beyond the 5 known
missing-asset 404s. All five anchors clear the fixed header. Both segment CTAs
resolve to their existing targets (`#interceptor`, `#fleet`).

**Outstanding assets: 7 → 5** (`interceptor`, `drone-lab`, and the three story
tiles).

---

# Addendum 4 — Defence-only positioning

ASTRA is a defence company, so all commercial/enterprise positioning was removed
site-wide, not just from the Segments card.

| Location | Before | After |
|---|---|---|
| Segments | Two cards: 01 Defence, 02 Commercial | Single Defence panel |
| Segments eyebrow | "Our segments" | "Our focus" |
| Fleet callout | "defence, enterprise and research missions" | "defence, security and research missions" |
| Footer column | "Segments": Defence / Commercial Drones / Drone Lab | "Capability": Defence Drones / Platforms / Drone Lab |
| Footer quick link | "Our Segments" | "Our Focus" |
| Footer blurb | "...surveillance and industry." | "...disaster response and surveillance." |
| Mission band | "...surveillance and industry." | "...disaster response and surveillance." |
| `index.html` meta description | "...surveillance and industry." | "...disaster response and surveillance." |
| `index.html` JSON-LD | "...surveillance and industry." | "...disaster response and surveillance." |

`grep -inE "commercial|enterprise"` over `src/` and `index.html` returns nothing.

**Layout.** A lone card sitting in a 2-up grid reads as a gap where something
was deleted, so `.seg-grid.is-single` gives the panel full width and splits it
horizontally — media left (57.5%), copy right, vertically centred. The meta bar
is pinned to the media column edge (`right: calc(42.5% + 12px)`), verified
aligned at 1440, 834 and 390. Below 768px it stacks as before.

`segment-commercial.webp` was deleted since nothing references it; the source
original in `Astra im/` is untouched.

**Left alone deliberately:** the eight Mission Ready platforms. Logistics,
Surveillance, VTOL and Training are dual-use defence platforms, not a commercial
product line — removing them would gut the fleet. Say the word if any should go.

Re-verified: typecheck and build pass, `verify:assets` clean (22 references, 5
awaiting supply, no orphans). 11 widths from 1920 to 320 — no overflow, no
broken images, no developer text, 0 console errors beyond the 5 known 404s.
Anchors clear the header; the Defence CTA still resolves to `#interceptor`.

---

# Addendum 5 — Segments as a pure cinematic stage

The Defence card was removed too. The section is now the hangar environment,
the engineering HUD, the headline and one CTA — nothing else.

## Removed

- The `SEGMENTS` data array, the `SegmentCard` component and the card grid.
- Every `.seg-card*` and `.seg-grid*` rule (the single-panel layout added in
  Addendum 4 went with them).
- `segment-defence.webp` and `segment-commercial.webp`, now unreferenced. Both
  source originals are untouched in `Astra im/`.

The section dropped from ~1.5× viewport to **1.0–1.04×**, and the Segments
chunk from 5.23 KB to **3.28 KB**.

A single `See defence systems →` link was kept under the lede so the section
still leads somewhere; the card was the only route to `#interceptor` from here.
Say the word if it should go too.

## Real 3D, not stacked 2D offsets

Earlier the depth was translation only. It is now a genuine perspective rig: one
`perspective: 1500px` with a shared `perspective-origin` on the stage, and every
layer inside it takes its **translate, rotation and Z offset** from the same
pointer vector, scaled by how near it is meant to sit. `transform-style:
preserve-3d` is set along the chain so the rotations compose rather than
flatten.

Measured corner-to-corner in Chromium — all four layers report a real
`matrix3d`, on a clean monotonic gradient:

| Layer | Lateral travel | Rotation component | Z |
|---|---|---|---|
| Heading | 11.1 px | 0.0249 | +40 |
| Hangar plate | 15.8 px | 0.0415 | −60 |
| Spec callouts | 28.5 px | 0.0663 | +60 |
| HUD | 41.2 px | 0.0939 | +90 |

The HUD moves and rotates ~2.3× the plate, and sits 150px nearer in Z. That
spread is what makes the scene hold together as one space when the viewpoint
moves.

A centre crosshair was added to the HUD over the projection.

## Two faults found and fixed during review

| Fault | Cause | Fix |
|---|---|---|
| The heading's parallax was dead code — it never moved | `style` set a `transform` on a `motion.header`, which framer-motion overwrites every frame for its entry animation | Parallax moved to a plain `.seg-heading-rig` wrapper; the header keeps `transform` for its own animation |
| On tall viewports the plate read as a horizontal band with flat navy above and below | A ratio-locked box at `width: 100%` cannot cover a viewport taller than its own ratio; the per-breakpoint `min-width: 225%` / `128%` overscale hacks only papered over it | `min-width: 100%` **and** `min-height: 100%` with `aspect-ratio` — the box now grows until it fills on either axis. Both hacks deleted |

Cover verified at 1920×1080, 1440×900, 1024×768, 834×1112, 390×844 and
320×568: covers on both axes every time, HUD centre stays at 52–55% / 56%.

## Validation

Typecheck, build and `verify:assets` (21 references, 5 awaiting supply, no
orphans) all pass. Eleven widths from 1920 to 320: no horizontal overflow, no
broken images, no developer text, **0 console errors** beyond the 5 known
missing-asset 404s. Anchors clear the header; the CTA resolves to
`#interceptor`.

Reduced motion: parallax frozen (transform byte-identical before and after
pointer movement), ring and scan animations `none`, heading at full opacity, CTA
present, 0 errors. On a touch context the plate stays at identity `matrix3d` —
no listener is attached at all.
