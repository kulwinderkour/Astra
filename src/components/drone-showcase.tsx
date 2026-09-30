import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/**
 * ADVANCED AERIAL SYSTEMS
 *
 * A scroll-controlled cinematic sequence. Scroll position drives the whole
 * composition through a single MotionValue — nothing here is viewport-triggered
 * and no component sets state while scrolling.
 *
 * The section is a tall scroll container holding a sticky viewport stage. Global
 * progress (0 -> 1) is sliced into one window per platform; inside its window
 * each platform runs the same five-beat story:
 *
 *   0.00 - 0.20  image reveal        the aircraft alone, dominant, calm
 *   0.20 - 0.42  information layer   the panel emerges from behind the image
 *   0.42 - 0.62  depth separation    image pushes forward, panel settles back
 *   0.62 - 0.84  final position      stable, no residual motion
 *   0.84 - 1.00  handoff             image recedes, next platform takes over
 */

type Platform = {
  id: string;
  src: string;
  title: string;
  role: string;
  description: string;
  alt: string;
  /** Intrinsic size. The plate uses this so it is exactly image-shaped:
      no letterboxing, no cropping, and a uniform height across all four. */
  w: number;
  h: number;
  specs: [string, string][];
  /** Light-background cutout render vs. full-bleed photograph. */
  cutout: boolean;
};

const PLATFORMS: Platform[] = [
  {
    id: '01',
    src: '/assets/images/drone1.webp',
    w: 960,
    h: 1280,
    title: 'Aerial Surveillance',
    role: 'Persistent ISR',
    description:
      'Designed for real-time observation, monitoring and aerial reconnaissance across extended loiter windows.',
    alt: 'ASTRA aerial surveillance platform',
    specs: [
      ['Role', 'Observation & recon'],
      ['Endurance', 'Extended loiter'],
    ],
    cutout: false,
  },
  {
    id: '02',
    src: '/assets/images/drone2.webp',
    w: 1145,
    h: 622,
    title: 'Tactical Operations',
    role: 'Rapid deployment',
    description:
      'Built for agile missions requiring precision, rapid deployment and continuous situational awareness.',
    alt: 'ASTRA tactical operations platform',
    specs: [
      ['Role', 'Tactical response'],
      ['Handling', 'High agility'],
    ],
    cutout: false,
  },
  {
    id: '03',
    src: '/assets/images/drone3.webp',
    w: 291,
    h: 287,
    title: 'Precision FPV',
    role: 'Low latency',
    description:
      'Optimised for high-speed flight, close-range inspection and precision aerial operations.',
    alt: 'ASTRA precision FPV platform',
    specs: [
      ['Role', 'Close-range precision'],
      ['Link', 'Low-latency FPV'],
    ],
    cutout: true,
  },
  {
    id: '04',
    src: '/assets/images/drone4.webp',
    w: 299,
    h: 303,
    title: 'Heavy Payload',
    role: 'Logistics lift',
    description:
      'Engineered to transport equipment and supplies for demanding logistics and delivery missions.',
    alt: 'ASTRA heavy payload platform',
    specs: [
      ['Role', 'Payload transport'],
      ['Lift', 'Heavy class'],
    ],
    cutout: true,
  },
];

/** Dead space before the first and after the last platform, in progress units. */
const LEAD = 0.02;
const SPAN = (1 - LEAD * 2) / PLATFORMS.length;

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Global scroll progress -> this platform's local 0..1 story progress. */
function localProgress(global: number, index: number) {
  return clamp01((global - (LEAD + index * SPAN)) / SPAN);
}

/**
 * One platform's slide. Every animated value is derived from the shared
 * progress MotionValue, so the whole sequence is a pure function of scroll.
 *
 * `amp` scales every translation and rotation: 1 on desktop, reduced on narrow
 * viewports where large movement reads as noise rather than depth.
 */
function PlatformSlide({
  platform,
  index,
  progress,
  amp,
  isFirst,
  isLast,
}: {
  platform: Platform;
  index: number;
  progress: MotionValue<number>;
  amp: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const t = useTransform(progress, (value) => localProgress(value, index));
  // The last platform never hands off — it holds its settled pose until the
  // sticky stage releases, so the section never ends on an empty frame.
  const exitAt = isLast ? 4 : 1;
  // The first platform is already on screen when the stage engages — the
  // section opens on the aircraft, not on an empty frame.
  const enterAt = isFirst ? 0 : 1;

  // Only the active platform participates in hit-testing and paints on top.
  const zIndex = useTransform(t, (v) => (v > 0.001 && v < 0.999 ? 2 : 1));
  const stageOpacity = useTransform(t, [0, 0.04 * enterAt, 0.9 * exitAt, 1 * exitAt], [enterAt ? 0 : 1, 1, 1, 0]);

  // ── Image: reveal -> shift aside -> push forward in depth -> recede ──
  const imgOpacity = useTransform(t, [0, 0.16 * enterAt, 0.86 * exitAt, 0.99 * exitAt], [enterAt ? 0 : 1, 1, 1, 0]);
  const imgScale = useTransform(t, [0, 0.2, 0.46, 0.62, 1 * exitAt], [0.92, 1, 1.05, 1.03, 0.96]);
  const imgY = useTransform(
    t,
    [0, 0.2, 0.46, 0.62, 1 * exitAt],
    [46 * amp, 0, -14 * amp, -8 * amp, -38 * amp],
  );
  const imgX = useTransform(t, [0.2, 0.46, 0.62], [0, -26 * amp, -20 * amp]);
  const imgRotateY = useTransform(t, [0.2, 0.46, 0.62, 1 * exitAt], [0, 5 * amp, 2.5 * amp, 0]);
  const imgRotateZ = useTransform(t, [0.2, 0.46, 0.62], [0, -1.6 * amp, -0.8 * amp]);

  // ── Information layer: emerges from behind the image, then settles ──
  const infoOpacity = useTransform(t, [0.2, 0.38, 0.86 * exitAt, 0.97 * exitAt], [0, 1, 1, 0]);
  const infoY = useTransform(t, [0.2, 0.42, 0.62, 1 * exitAt], [58 * amp, 6 * amp, 0, -18 * amp]);
  const infoX = useTransform(t, [0.2, 0.42, 0.62], [-22 * amp, 6 * amp, 0]);
  const infoScale = useTransform(t, [0.2, 0.42, 0.62], [0.96, 1.005, 1]);
  const infoRotateY = useTransform(t, [0.2, 0.42, 0.62], [-6 * amp, -1.5 * amp, 0]);

  // Specs trail the panel very slightly so the block assembles rather than pops.
  const specsOpacity = useTransform(t, [0.32, 0.5, 0.86 * exitAt, 0.96 * exitAt], [0, 1, 1, 0]);
  const specsY = useTransform(t, [0.32, 0.54], [22 * amp, 0]);

  return (
    <motion.article className="aas-slide" style={{ opacity: stageOpacity, zIndex }}>
      <motion.div
        className={`aas-media ${platform.cutout ? 'is-cutout' : 'is-photo'}`}
        style={{
          aspectRatio: `${platform.w} / ${platform.h}`,
          opacity: imgOpacity,
          scale: imgScale,
          y: imgY,
          x: imgX,
          rotateY: imgRotateY,
          rotateZ: imgRotateZ,
        }}
      >
        <img src={platform.src} alt={platform.alt} draggable={false} />
        <span className="aas-media-rule" aria-hidden="true" />
      </motion.div>

      <motion.div
        className="aas-info"
        style={{
          opacity: infoOpacity,
          y: infoY,
          x: infoX,
          scale: infoScale,
          rotateY: infoRotateY,
        }}
      >
        <span className="aas-info-index" aria-hidden="true">{platform.id}</span>
        <span className="aas-info-role">{platform.role}</span>
        <h3>{platform.title}</h3>
        <p>{platform.description}</p>
        <motion.dl className="aas-specs" style={{ opacity: specsOpacity, y: specsY }}>
          {platform.specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </motion.article>
  );
}

/** Progress rail marker. Driven by the same MotionValue — no state. */
function RailMarker({ platform, index, progress }: { platform: Platform; index: number; progress: MotionValue<number> }) {
  const t = useTransform(progress, (value) => localProgress(value, index));
  const opacity = useTransform(t, [0, 0.12, 0.9, 1], [0.34, 1, 1, 0.34]);
  const scaleX = useTransform(t, [0, 1], [0, 1]);
  return (
    <motion.li className="aas-rail-item" style={{ opacity }}>
      <span className="aas-rail-id">{platform.id}</span>
      <span className="aas-rail-track">
        <motion.span className="aas-rail-fill" style={{ scaleX }} />
      </span>
      <span className="aas-rail-title">{platform.title}</span>
    </motion.li>
  );
}

function DroneShowcaseAnimated() {
  const stageRef = useRef<HTMLElement>(null);
  const [amp, setAmp] = useState(1);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 899px)');
    const update = () => setAmp(narrow.matches ? 0.45 : 1);
    update();
    narrow.addEventListener('change', update);
    return () => narrow.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // Light smoothing: enough to take the edge off wheel steps, not enough to
  // feel disconnected from the scrollbar.
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 42,
    mass: 0.35,
    restDelta: 0.0004,
  });

  const headingOpacity = useTransform(progress, [0, 0.03, 0.09], [1, 0.9, 0]);
  const headingY = useTransform(progress, [0, 0.09], [0, -26]);

  return (
    <section ref={stageRef} className="aas" id="aerial-systems" aria-label="Advanced aerial systems">
      <div className="aas-sticky">
        <div className="aas-grid-bg" aria-hidden="true" />

        <motion.header className="aas-heading" style={{ opacity: headingOpacity, y: headingY }}>
          <span className="eyebrow">Platforms</span>
          <h2 className="section-title">
            Advanced <em>aerial systems</em>
          </h2>
          <p className="aas-lede">
            Engineered aerial platforms for surveillance, defence, logistics and mission-critical operations.
          </p>
        </motion.header>

        <div className="aas-stage">
          {PLATFORMS.map((platform, index) => (
            <PlatformSlide
              key={platform.id}
              platform={platform}
              index={index}
              progress={progress}
              amp={amp}
              isFirst={index === 0}
              isLast={index === PLATFORMS.length - 1}
            />
          ))}
        </div>

        <ul className="aas-rail" aria-hidden="true">
          {PLATFORMS.map((platform, index) => (
            <RailMarker key={platform.id} platform={platform} index={index} progress={progress} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Reduced-motion and no-JS-motion fallback: the same content, laid out flat. */
function DroneShowcaseStatic() {
  return (
    <section className="aas is-static" id="aerial-systems" aria-label="Advanced aerial systems">
      <div className="aas-static-inner">
        <header className="aas-heading">
          <span className="eyebrow">Platforms</span>
          <h2 className="section-title">
            Advanced <em>aerial systems</em>
          </h2>
          <p className="aas-lede">
            Engineered aerial platforms for surveillance, defence, logistics and mission-critical operations.
          </p>
        </header>
        <div className="aas-static-list">
          {PLATFORMS.map((platform) => (
            <article className="aas-slide is-static" key={platform.id}>
              <div
                className={`aas-media ${platform.cutout ? 'is-cutout' : 'is-photo'}`}
                style={{ aspectRatio: `${platform.w} / ${platform.h}` }}
              >
                <img src={platform.src} alt={platform.alt} draggable={false} />
                <span className="aas-media-rule" aria-hidden="true" />
              </div>
              <div className="aas-info">
                <span className="aas-info-index" aria-hidden="true">{platform.id}</span>
                <span className="aas-info-role">{platform.role}</span>
                <h3>{platform.title}</h3>
                <p>{platform.description}</p>
                <dl className="aas-specs">
                  {platform.specs.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DroneShowcase() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <DroneShowcaseStatic />;
  return <DroneShowcaseAnimated />;
}
