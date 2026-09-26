# ASTRA Drobotics

Premium, responsive single-page presentation site for ASTRA Drones & Robotics Solutions Pvt. Ltd. The frontend is self-contained React + Vite with no backend, external APIs, or environment variables.

## Run locally

```bash
npm install
npm run dev
```

Build and serve the production bundle:

```bash
npm run build
npm run serve
```

The project has local defaults (`5173` and `/`) and does not require environment variables. To override them in a hosted environment, use for example:

```bash
PORT=5173 BASE_PATH=/ npm run build
```

## Asset map

All image references point to `/public/assets/images/` and intentionally preserve the approved filenames. When an image is not present, the page renders a striped, export-ready `Upload: <filename>` placeholder in its exact position.

| Filename | Section / use |
| --- | --- |
| `logo1.png` | Header and footer brand mark, browser tab icon |
| `hero-poster.jpg` | Hero poster and reduced-motion fallback |
| `segment-defence.jpg` | Our Segments — Defence |
| `segment-commercial.jpg` | Our Segments — Commercial |
| `product-fpv.jpg` | Fleet — FPV Drone |
| `product-unjamable.jpg` | Fleet — Unjamable Drone |
| `product-logistics.jpg` | Fleet — Logistics Drone |
| `product-surveillance.jpg` | Fleet — Surveillance Drone |
| `product-kamikaze.jpg` | Fleet — Kamikaze Drone |
| `product-vtol.jpg` | Fleet — VTOL Drone |
| `product-fiber-optic.jpg` | Fleet — Fiber Optic Drone |
| `product-training.jpg` | Fleet — Training Drone |
| `interceptor.jpg` | Interceptor feature |
| `drone-lab.jpg` | Set Up a Drone Lab |
| `award-startup-punjab.jpg` | Recognition — Startup Punjab Conclave |
| `award-indian-army.jpg` | Recognition — Indian Army |
| `tile-mission.jpg` | Story tile — Our Mission |
| `tile-training.jpg` | Story tile — Training |
| `tile-contact.jpg` | Story tile — Contact |
| `hero-landing.mp4` | `/public/assets/videos/hero-landing.mp4`; muted hero video, plays once |

## Interaction notes

- Header navigation uses semantic anchors and becomes a solid navy bar after the hero.
- The mobile menu is keyboard reachable and closes when a destination is selected.
- The hero video is muted, inline, non-looping, and holds its final frame. Its motto reveals at approximately 2.6 seconds, with autoplay failure and `prefers-reduced-motion` falling back to an immediately visible motto.
- The circular replay control restarts the video and the `Scroll down` control in the lower right moves to the mission band.
- Product imagery uses a restrained 1.04 hover zoom only on image tiles.
- All phone, email, briefing, lab, segment and fleet calls-to-action are wired to real page anchors or telephone/email links.