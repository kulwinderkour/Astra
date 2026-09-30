# ASTRA — Image Asset Manifest

Every file below belongs in `public/assets/images/`. Filenames are matched
**exactly**, including case and extension. Drop a file in and it appears on the
site — no code change is needed.

Verify at any time:

```bash
npm run verify:assets          # reports what is still outstanding
npm run verify:assets -- --strict   # exits non-zero if anything is missing (for CI)
```

Until a file is supplied, its slot renders a neutral ASTRA-branded panel
(navy, orange diamond motif). No filename or developer text is ever shown.

## Supplied

| Asset | Used by | Notes |
|---|---|---|
| `logo1.png` | Header, footer, favicon, schema.org | 1024×828 |
| `hero-poster.jpg` | Hero poster + `og:image` | 1920×1080 |
| `drone1.webp` … `drone4.webp` | Advanced Aerial Systems | Converted from PNG, 1.96 MB → 133 KB |
| `fleet/fleet-*.webp` (×8) | Mission Ready grid | Supplied 2026-09-30, 16.6 MB PNG → 1.56 MB WebP |
| `segments/segments-hangar.webp` | Segments stage plate | 1554×1012, 2.1 MB → 204 KB |
| `../videos/hero-landing.mp4` | Hero film | 1.3 MB, desktop + full-motion only |

## Outstanding — 5 files

Shoot or select to these ratios. Anything wider/taller still works (the frames
use `object-fit: cover`), but the ratio below is what crops cleanly.

### Segments — supplied ✓

The section is now a layered cinematic stage rather than two flat cards. Assets
live in `public/assets/images/segments/`:

| Slot | File | Source |
|---|---|---|
| Stage plate | `segments-hangar.webp` | backgroun image.png |

The section is now a single full-viewport cinematic stage with no cards, so the
hangar plate is its only asset. `Tactical Drone Over Mountain Valley.png` and
`Cargo Drone Over Golden Valley  .png` were installed for the earlier card
layout and removed with it; both source files are untouched in `Astra im/` if
the cards ever come back.

The plate covers while staying locked to the source art's 1554×1012 ratio, so
the HUD's percentage coordinates stay valid at every viewport shape. A
replacement plate with a different ratio needs `.seg-plate-box` and
`.seg-hud-inner` re-checked in `src/index.css`.

The plate is held at its exact 1554×1012 ratio so the HUD overlay stays
registered on the holographic drone (51.5% / 51.4%) at any viewport. A
replacement plate with a different ratio needs those two numbers re-checked in
`src/index.css` (`.seg-plate-box`, `.seg-hud-inner`).

### Fleet — supplied ✓

All eight Mission Ready platforms now use real photography at 1584×993,
installed as `public/assets/images/fleet/fleet-*.webp`. Mapping:

| Card | File | Source |
|---|---|---|
| 01 FPV Drone | `fleet-fpv.webp` | Tactical FPV Drone at Golden Hour.png |
| 02 Unjamable Drone | `fleet-unjamable.webp` | Tactical Hexacopter Over Alpine Ridge.png |
| 03 Logistics Drone | `fleet-logistics.webp` | Golden-Hour Mountain Cargo Drone.png |
| 04 Surveillance Drone | `fleet-surveillance.webp` | Golden-Hour Surveillance Drone Over Mountain Valley.png |
| 05 Kamikaze Drone | `fleet-kamikaze.webp` | Sunset Loitering Munition Launch Platform.png |
| 06 VTOL Drone | `fleet-vtol.webp` | Futuristic VTOL at Sunset.png |
| 07 Fiber Optic Drone | `fleet-fiber-optic.webp` | ndustrial Drone Deploying Fiber Cable at Sunset.png |
| 08 Training Drone | `fleet-training.webp` | Training Done.png |

Cards crop these to 16:10 with a centred `cover`. Replacements should keep a
landscape ratio and a centred subject.

### Feature sections — landscape, min 1600×1200

| File | Subject | Frame |
|---|---|---|
| `interceptor.jpg` | Interceptor / counter-UAV platform | Half-screen, ≥620px tall on desktop |
| `drone-lab.jpg` | Educational drone laboratory | Half-screen, ≥650px tall on desktop |

### Story tiles — 3:4 portrait, min 1200×1600

Full-bleed behind a dark top gradient, so keep the **upper third visually
quiet** — the kicker, heading and "Explore" link sit there.

| File | Subject |
|---|---|
| `tile-mission.jpg` | Who we are / Our Mission |
| `tile-training.jpg` | Learn to build and fly / Training |
| `tile-contact.jpg` | Work with us / Contact |

## Guidance

- **Format**: JPEG at quality ~82, sRGB. Convert to WebP if you want the
  smaller payload — update the filename in `src/App.tsx` (`imageFiles`) to match.
- **Weight**: keep each under ~250 KB. `cwebp -q 84 in.jpg -o out.webp` is what
  was used for the existing drone renders.
- **Consistency**: matching lighting direction, colour grading and background
  treatment matters more than any single image. They must read as one portfolio.
- **Avoid**: watermarks, embedded text, other companies' branding, visible AI
  artifacts, mismatched aspect ratios.

## Unused source file

`Astra im/mission.png` (1586×992) was supplied alongside the eight fleet images
but was not in the mapping, so it has not been installed. It is a plausible
candidate for `tile-mission.jpg` — say the word and it takes about a minute.

## Not used

Branch `origin/Astra-updates` holds five further images
(`award-*.jpg`, `recognition-*.jpg`). They are AI-generated;
`award-startup-punjab.jpg` carries another company's branding and a fabricated
government emblem. They are deliberately not referenced. See
`IMPLEMENTATION_REPORT.md`.
