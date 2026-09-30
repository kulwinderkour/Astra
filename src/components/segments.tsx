import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * SEGMENTS — "Built for consequence"
 *
 * A layered cinematic stage rather than a flat hero image:
 *
 *   hangar plate  ->  atmospheric scrim  ->  technical HUD  ->  content  ->  cards
 *
 * Depth comes from differential motion. Each layer responds to scroll and to the
 * pointer at a different rate, so the plate reads as distant and the HUD as
 * close. The supplied hangar art already contains the holographic drone and its
 * projection platform, so the HUD is registered over that projection rather
 * than compositing a separate drone — none of the project's drone renders carry
 * an alpha channel, and pasting an opaque rectangle over the hangar would read
 * as exactly the kind of fake 3D this section is meant to avoid.
 */

const SEGMENTS = [
  {
    number: '01',
    tag: 'National security',
    name: 'Defence',
    copy: 'Combat-ready UAV platforms for tactical and strategic missions.',
    cta: 'See defence systems',
    href: '#interceptor',
    image: '/assets/images/segments/segment-defence.webp',
    alt: 'An ASTRA tactical UAV on patrol over a mountain valley at sunset, with a ground team and command vehicle on the ridge below',
    testId: 'link-defence-systems',
  },
  {
    number: '02',
    tag: 'Enterprise solutions',
    name: 'Commercial',
    copy: 'Surveillance, mapping and inspection for enterprises.',
    cta: 'See commercial systems',
    href: '#fleet',
    image: '/assets/images/segments/segment-commercial.webp',
    alt: 'An ASTRA cargo UAV carrying a freight container over a river valley at golden hour',
    testId: 'link-commercial-systems',
  },
] as const;

/** Specification callouts flanking the holographic projection. */
const SPEC_RIGHT = ['Modular', 'Scalable', 'Mission-ready'];
const SPEC_LEFT = ['Indian engineered', 'Deployment ready', 'Field tested'];

/**
 * Normalised pointer offset (-1..1 from centre) for the parallax rig.
 * Returns a frozen {x:0,y:0} on touch devices and under reduced motion, so no
 * listener is attached where the effect would be unwanted or meaningless.
 */
function usePointerParallax(enabled: boolean) {
  const [point, setPoint] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setPoint({
          x: (event.clientX / window.innerWidth - 0.5) * 2,
          y: (event.clientY / window.innerHeight - 0.5) * 2,
        });
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
  return point;
}

function SegmentCard({
  segment,
  index,
  tilt,
}: {
  segment: (typeof SEGMENTS)[number];
  index: number;
  tilt: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const onMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!tilt) return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    // Deliberately shallow: ±3deg reads as a panel catching light, more reads
    // as a novelty card.
    setRot({ x: -py * 3, y: px * 3 });
  };
  const reset = () => setRot({ x: 0, y: 0 });

  return (
    <motion.li
      className="seg-card"
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.78, delay: index * 0.14, ease: [0.16, 0.8, 0.26, 1] }}
    >
      <a
        ref={ref}
        className="seg-card-link"
        href={segment.href}
        aria-label={`${segment.name} — ${segment.cta}`}
        data-testid={segment.testId}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onBlur={reset}
        style={{
          transform: `perspective(1200px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        }}
      >
        <span className="seg-card-frame" aria-hidden="true" />
        <div className="seg-card-media">
          <img src={segment.image} alt={segment.alt} loading="lazy" decoding="async" />
          <span className="seg-card-scrim" aria-hidden="true" />
        </div>
        <div className="seg-card-meta">
          <span className="seg-card-number" aria-hidden="true">{segment.number}</span>
          <span className="seg-card-rule" aria-hidden="true" />
          <span className="seg-card-tag">{segment.tag}</span>
          <span className="seg-card-mark" aria-hidden="true" />
        </div>
        <div className="seg-card-body">
          <h3>{segment.name}</h3>
          <p>{segment.copy}</p>
          <span className="seg-card-cta">
            {segment.cta}
            <ArrowRight aria-hidden="true" />
          </span>
        </div>
      </a>
    </motion.li>
  );
}

export function Segments() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const motionOn = !reduce;
  const pointer = usePointerParallax(motionOn);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    mass: 0.4,
    restDelta: 0.0005,
  });

  // The plate settles from a slight push-in and drifts a little slower than the
  // page, which is what sells it as being behind everything else.
  const plateScale = useTransform(progress, [0, 0.5, 1], [1.08, 1.02, 1.06]);
  const plateY = useTransform(progress, [0, 1], ['-3%', '3%']);
  const hudY = useTransform(progress, [0, 1], ['6%', '-6%']);
  const hudOpacity = useTransform(progress, [0.06, 0.24, 0.8, 0.96], [0, 1, 1, 0.25]);

  // Differential pointer response: plate barely moves, HUD moves most.
  const p = motionOn ? pointer : { x: 0, y: 0 };
  const layer = (depth: number) => ({
    transform: `translate3d(${(p.x * depth).toFixed(2)}px, ${(p.y * depth).toFixed(2)}px, 0)`,
  });

  return (
    <section ref={sectionRef} className="segments" id="segments" aria-labelledby="segments-title">
      <div className="seg-stage" aria-hidden="true">
        <motion.div className="seg-plate" style={motionOn ? { scale: plateScale, y: plateY } : undefined}>
          {/* Fixed to the source art's 1554x1012 ratio and sized to cover, so
              every overlay below can be positioned in the image's own
              coordinates and stays registered at any viewport aspect. */}
          <div className="seg-plate-box" style={layer(9)}>
            <div className="seg-plate-img" />

            {/* Registered on the holographic drone at ~51.5% / 51.4% of the plate. */}
            <motion.div
              className="seg-hud"
              style={motionOn ? { y: hudY, opacity: hudOpacity } : undefined}
            >
              <div className="seg-hud-inner" style={layer(22)}>
                <span className="seg-hud-ring" />
                <span className="seg-hud-ring is-outer" />
                <span className="seg-hud-scan" />
                <span className="seg-hud-bracket is-tl" />
                <span className="seg-hud-bracket is-tr" />
                <span className="seg-hud-bracket is-bl" />
                <span className="seg-hud-bracket is-br" />
              </div>
            </motion.div>

            <ul className="seg-spec is-right" style={layer(16)}>
              {SPEC_RIGHT.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ul className="seg-spec is-left" style={layer(16)}>
              {SPEC_LEFT.map((item) => <li key={item}>+ {item}</li>)}
            </ul>
          </div>
        </motion.div>

        <div className="seg-gridlines" style={layer(14)} />
        <div className="seg-atmosphere" />
        <div className="seg-vignette" />
      </div>

      <div className="container seg-content">
        <motion.header
          className="seg-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 0.8, 0.26, 1] }}
          style={layer(6)}
        >
          <span className="eyebrow">Our segments</span>
          <h2 className="section-title" id="segments-title">
            Built for<br /><em>consequence.</em>
          </h2>
          <p className="seg-lede">
            From contested airspace to critical infrastructure, ASTRA builds dependable
            systems for the work that cannot wait.
          </p>
        </motion.header>

        <ul className="seg-grid" style={layer(5)}>
          {SEGMENTS.map((segment, index) => (
            <SegmentCard key={segment.name} segment={segment} index={index} tilt={motionOn} />
          ))}
        </ul>
      </div>
    </section>
  );
}
