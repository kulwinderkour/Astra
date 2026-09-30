import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * SEGMENTS — "Built for consequence"
 *
 * A single cinematic stage: the hangar plate, an engineering HUD registered on
 * its holographic drone, and the headline. No cards — the environment carries
 * the section.
 *
 * Depth is a real perspective rig rather than stacked 2D offsets. One shared
 * `perspective` lives on the stage; each layer inside it takes its own
 * translate *and* rotation off the same pointer vector, scaled by how close it
 * is meant to sit. Rotating the near layers harder than the far ones is what
 * produces parallax that survives a moving viewpoint.
 */

const SPEC_RIGHT = ['Modular', 'Scalable', 'Mission-ready'];
const SPEC_LEFT = ['Indian engineered', 'Deployment ready', 'Field tested'];

/**
 * Normalised pointer offset (-1..1 from centre). Returns a frozen origin on
 * touch devices and under reduced motion, so no listener is ever attached
 * where the effect would be unwanted.
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

  const plateScale = useTransform(progress, [0, 0.5, 1], [1.1, 1.02, 1.08]);
  const plateY = useTransform(progress, [0, 1], ['-4%', '4%']);
  const hudY = useTransform(progress, [0, 1], ['8%', '-8%']);
  const hudOpacity = useTransform(progress, [0.08, 0.3, 0.76, 0.96], [0, 1, 1, 0.2]);

  const p = motionOn ? pointer : { x: 0, y: 0 };
  /**
   * `shift` is lateral travel in px, `spin` the rotation in degrees and `lift`
   * the Z offset. Near layers get more of all three.
   */
  const layer = (shift: number, spin = 0, lift = 0) => ({
    transform:
      `translate3d(${(p.x * shift).toFixed(2)}px, ${(p.y * shift).toFixed(2)}px, ${lift}px)` +
      (spin
        ? ` rotateY(${(p.x * spin).toFixed(3)}deg) rotateX(${(-p.y * spin * 0.68).toFixed(3)}deg)`
        : ''),
  });

  return (
    <section ref={sectionRef} className="segments" id="segments" aria-labelledby="segments-title">
      <div className="seg-stage" aria-hidden="true">
        <motion.div className="seg-plate" style={motionOn ? { scale: plateScale, y: plateY } : undefined}>
          {/* Held at the source art's 1554x1012 ratio so every overlay can be
              positioned in the image's own coordinates and stays registered on
              the hologram at any viewport aspect. */}
          <div className="seg-plate-box" style={layer(10, 1.5, -60)}>
            <div className="seg-plate-img" />

            {/* Centred on the holographic drone at ~51.5% / 51.4% of the plate. */}
            <motion.div
              className="seg-hud"
              style={motionOn ? { y: hudY, opacity: hudOpacity } : undefined}
            >
              <div className="seg-hud-inner" style={layer(26, 3.4, 90)}>
                <span className="seg-hud-ring" />
                <span className="seg-hud-ring is-outer" />
                <span className="seg-hud-scan" />
                <span className="seg-hud-bracket is-tl" />
                <span className="seg-hud-bracket is-tr" />
                <span className="seg-hud-bracket is-bl" />
                <span className="seg-hud-bracket is-br" />
                <span className="seg-hud-crosshair" />
              </div>
            </motion.div>

            <ul className="seg-spec is-right" style={layer(18, 2.4, 60)}>
              {SPEC_RIGHT.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ul className="seg-spec is-left" style={layer(18, 2.4, 60)}>
              {SPEC_LEFT.map((item) => <li key={item}>+ {item}</li>)}
            </ul>
          </div>
        </motion.div>

        <div className="seg-gridlines" style={layer(16)} />
        <div className="seg-atmosphere" />
        <div className="seg-vignette" />
      </div>

      <div className="container seg-content">
        {/* The parallax lives on a plain wrapper: framer-motion owns `transform`
            on the header for its entry animation and would overwrite it. */}
        <div className="seg-heading-rig" style={layer(7, 0.9, 40)}>
          <motion.header
            className="seg-heading"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 0.8, 0.26, 1] }}
          >
            <span className="eyebrow">Our focus</span>
            <h2 className="section-title" id="segments-title">
              Built for<br /><em>consequence.</em>
            </h2>
            <p className="seg-lede">
              From contested airspace to critical infrastructure, ASTRA builds dependable
              systems for the work that cannot wait.
            </p>
            <a className="seg-cta" href="#interceptor" data-testid="link-defence-systems">
              See defence systems
              <ArrowRight aria-hidden="true" />
            </a>
          </motion.header>
        </div>
      </div>
    </section>
  );
}
