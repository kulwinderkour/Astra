import { useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type Rect = { x: number; y: number; w: number; h: number };

const EMPTY: Rect = { x: 0, y: 0, w: 1, h: 1 };

const DRONES = [
  {
    id: '01',
    src: '/assets/images/drone1.png',
    title: 'Aerial Surveillance',
    description:
      'Designed for real-time observation, monitoring and aerial reconnaissance.',
    alt: 'Aerial surveillance drone',
    cutout: false,
    arcX: -48,
    arcY: -64,
    tilt: -6,
  },
  {
    id: '02',
    src: '/assets/images/drone2.png',
    title: 'Tactical Operations',
    description:
      'Built for agile missions requiring precision, rapid deployment and situational awareness.',
    alt: 'Tactical operations drone',
    cutout: false,
    arcX: 18,
    arcY: -36,
    tilt: 5,
  },
  {
    id: '03',
    src: '/assets/images/drone3.png',
    title: 'Precision FPV',
    description:
      'Optimized for high-speed flight, close-range inspection and precision aerial operations.',
    alt: 'Precision FPV drone',
    cutout: true,
    arcX: -22,
    arcY: 28,
    tilt: -8,
  },
  {
    id: '04',
    src: '/assets/images/drone4.png',
    title: 'Heavy Payload',
    description:
      'Engineered to transport equipment and supplies for demanding logistics and delivery missions.',
    alt: 'Heavy payload drone',
    cutout: true,
    arcX: 44,
    arcY: 16,
    tilt: 7,
  },
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function flightT(progress: number, index: number) {
  const start = 0.06 + index * 0.045;
  const span = 0.78;
  return easeInOutCubic(clamp01((progress - start) / span));
}

function readRect(element: HTMLElement | null, root: HTMLElement | null): Rect {
  if (!element || !root) return EMPTY;
  const a = element.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return {
    x: a.left - b.left,
    y: a.top - b.top,
    w: a.width,
    h: a.height,
  };
}

function DestinationCard({
  drone,
  progress,
  wellRef,
}: {
  drone: (typeof DRONES)[number];
  progress: MotionValue<number>;
  wellRef: (node: HTMLDivElement | null) => void;
}) {
  const imageOpacity = useTransform(progress, (value) => {
    const t = flightT(value, Number(drone.id) - 1);
    return clamp01((t - 0.86) / 0.12);
  });

  return (
    <article className="drone-dest-card">
      <div className={`drone-dest-well ${drone.cutout ? 'is-cutout' : 'is-photo'}`} ref={wellRef}>
        <motion.img src={drone.src} alt={drone.alt} draggable={false} style={{ opacity: imageOpacity }} />
      </div>
      <div className="drone-dest-copy">
        <span>{drone.id}</span>
        <h3>{drone.title}</h3>
        <p>{drone.description}</p>
      </div>
    </article>
  );
}

function FlyingDrone({
  drone,
  index,
  progress,
  layout,
  originSize,
  visible,
}: {
  drone: (typeof DRONES)[number];
  index: number;
  progress: MotionValue<number>;
  layout: MutableRefObject<{ origin: Rect; dest: Rect }[]>;
  originSize: { w: number; h: number };
  visible: boolean;
}) {
  const x = useTransform(progress, (value) => {
    const t = flightT(value, index);
    const pair = layout.current[index] ?? { origin: EMPTY, dest: EMPTY };
    return pair.origin.x + (pair.dest.x - pair.origin.x) * t + Math.sin(t * Math.PI) * drone.arcX;
  });
  const y = useTransform(progress, (value) => {
    const t = flightT(value, index);
    const pair = layout.current[index] ?? { origin: EMPTY, dest: EMPTY };
    return pair.origin.y + (pair.dest.y - pair.origin.y) * t + Math.sin(t * Math.PI) * drone.arcY;
  });
  const scaleX = useTransform(progress, (value) => {
    const t = flightT(value, index);
    const pair = layout.current[index] ?? { origin: EMPTY, dest: EMPTY };
    const target = pair.origin.w ? pair.dest.w / pair.origin.w : 1;
    const lift = 1 + Math.sin(t * Math.PI) * 0.07;
    return (1 + (target - 1) * t) * lift;
  });
  const scaleY = useTransform(progress, (value) => {
    const t = flightT(value, index);
    const pair = layout.current[index] ?? { origin: EMPTY, dest: EMPTY };
    const target = pair.origin.h ? pair.dest.h / pair.origin.h : 1;
    const lift = 1 + Math.sin(t * Math.PI) * 0.07;
    return (1 + (target - 1) * t) * lift;
  });
  const rotate = useTransform(progress, (value) => {
    const t = flightT(value, index);
    return Math.sin(t * Math.PI) * drone.tilt;
  });
  const opacity = useTransform(progress, (value) => {
    const t = flightT(value, index);
    const fade = clamp01((0.98 - t) / 0.08);
    return visible ? fade : 0;
  });

  return (
    <motion.div
      className={`drone-flyer ${drone.cutout ? 'is-cutout' : 'is-photo'}`}
      style={{
        x,
        y,
        scaleX,
        scaleY,
        rotate,
        opacity,
        width: originSize.w,
        height: originSize.h,
      }}
      aria-hidden="true"
    >
      <img src={drone.src} alt="" draggable={false} />
    </motion.div>
  );
}

function DroneShowcaseAnimated() {
  const stageRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const originRefs = useRef<(HTMLDivElement | null)[]>([]);
  const destRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useRef(DRONES.map(() => ({ origin: EMPTY, dest: EMPTY })));

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.16, 0.34], [1, 0.85, 0]);
  const originChrome = useTransform(scrollYProgress, [0.04, 0.26], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0.18, 0.42], [0, 1]);
  const [originSizes, setOriginSizes] = useState(DRONES.map(() => ({ w: 0, h: 0 })));
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const measure = () => {
      const next = DRONES.map((_, index) => ({
        origin: readRect(originRefs.current[index], sticky),
        dest: readRect(destRefs.current[index], sticky),
      }));
      layout.current = next;
      setOriginSizes(next.map((pair) => ({ w: pair.origin.w, h: pair.origin.h })));
      setMeasured(next.every((pair) => pair.origin.w > 8 && pair.dest.w > 8));
    };

    measure();
    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(sticky);
    originRefs.current.forEach((node) => node && observer.observe(node));
    destRefs.current.forEach((node) => node && observer.observe(node));
    window.addEventListener('resize', measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="drone-stage"
      id="aerial-systems"
      aria-label="Advanced aerial systems"
    >
      <div ref={stickyRef} className="drone-sticky">
        <motion.header className="drone-heading" style={{ opacity: headingOpacity }}>
          <span className="eyebrow">Platforms</span>
          <h2 className="section-title">
            Advanced <em>aerial systems</em>
          </h2>
          <p className="drone-lede">
            Engineered aerial platforms for surveillance, defence, logistics and mission-critical operations.
          </p>
        </motion.header>

        <motion.div className="drone-origin-row" style={{ opacity: originChrome }} aria-hidden="true">
          {DRONES.map((drone, index) => (
            <div key={drone.id} className={`drone-origin ${drone.cutout ? 'is-cutout' : 'is-photo'}`}>
              <span className="drone-kicker">{drone.id}</span>
              <div
                className="drone-origin-well"
                ref={(node) => {
                  originRefs.current[index] = node;
                }}
              />
            </div>
          ))}
        </motion.div>

        <motion.div className="drone-grid" style={{ opacity: gridOpacity }}>
          {DRONES.map((drone, index) => (
            <DestinationCard
              key={drone.id}
              drone={drone}
              progress={scrollYProgress}
              wellRef={(node) => {
                destRefs.current[index] = node;
              }}
            />
          ))}
        </motion.div>

        <div className="drone-flight-layer">
          {measured
            ? DRONES.map((drone, index) => (
                <FlyingDrone
                  key={drone.id}
                  drone={drone}
                  index={index}
                  progress={scrollYProgress}
                  layout={layout}
                  originSize={originSizes[index]}
                  visible={measured}
                />
              ))
            : null}
        </div>
      </div>
    </section>
  );
}

function DroneShowcaseStatic() {
  return (
    <section className="drone-stage is-static" id="aerial-systems" aria-label="Advanced aerial systems">
      <div className="drone-static-inner">
        <header className="drone-heading">
          <span className="eyebrow">Platforms</span>
          <h2 className="section-title">
            Advanced <em>aerial systems</em>
          </h2>
          <p className="drone-lede">
            Engineered aerial platforms for surveillance, defence, logistics and mission-critical operations.
          </p>
        </header>
        <div className="drone-grid is-static">
          {DRONES.map((drone) => (
            <article className="drone-dest-card" key={drone.id}>
              <div className={`drone-dest-well ${drone.cutout ? 'is-cutout' : 'is-photo'}`}>
                <img src={drone.src} alt={drone.alt} draggable={false} />
              </div>
              <div className="drone-dest-copy">
                <span>{drone.id}</span>
                <h3>{drone.title}</h3>
                <p>{drone.description}</p>
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
