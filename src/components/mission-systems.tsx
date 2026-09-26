import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Crosshair, Eye, Cpu, Radio, Box, ChevronDown } from 'lucide-react';

interface MissionCapability {
  id: string;
  keyword: string;
  title: string;
  badge: string;
  image: string;
  fallbackImage: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  startP: number;
  endP: number;
}

const capabilities: MissionCapability[] = [
  {
    id: '01',
    keyword: 'TACTICAL',
    title: 'Tactical Strike',
    badge: 'FPV STRIKE',
    image: 'drone1.png',
    fallbackImage: 'product-fpv.jpg',
    accent: '#e8731c',
    icon: Crosshair,
    startP: 0.08,
    endP: 0.44,
  },
  {
    id: '02',
    keyword: 'SURVEILLANCE',
    title: 'Autonomous ISR',
    badge: 'AI ISR FEED',
    image: 'drone2.png',
    fallbackImage: 'product-surveillance.jpg',
    accent: '#38bdf8',
    icon: Eye,
    startP: 0.16,
    endP: 0.52,
  },
  {
    id: '03',
    keyword: 'AUTONOMOUS',
    title: 'Swarm Navigation',
    badge: 'VISION NAV',
    image: 'drone3.png',
    fallbackImage: 'product-vtol.jpg',
    accent: '#a855f7',
    icon: Cpu,
    startP: 0.24,
    endP: 0.60,
  },
  {
    id: '04',
    keyword: 'ELECTRONIC WARFARE',
    title: 'Anti-Jam EW',
    badge: 'ZERO JAM',
    image: 'drone4.png',
    fallbackImage: 'product-unjamable.jpg',
    accent: '#34d399',
    icon: Radio,
    startP: 0.32,
    endP: 0.68,
  },
  {
    id: '05',
    keyword: 'HEAVY PAYLOAD',
    title: 'Logistics Lift',
    badge: '35KG LIFT',
    image: 'hero-poster.jpg',
    fallbackImage: 'product-logistics.jpg',
    accent: '#fbbf24',
    icon: Box,
    startP: 0.40,
    endP: 0.76,
  },
];

interface SquareCoord {
  startX: number;
  startY: number;
  startSize: number;
  destX: number;
  destY: number;
  destSize: number;
}

function SquareVisualTile({
  capability,
  index,
  scrollYProgress,
  coords,
}: {
  capability: MissionCapability;
  index: number;
  scrollYProgress: MotionValue<number>;
  coords: SquareCoord | null;
}) {
  const Icon = capability.icon;
  const { startP, endP } = capability;
  const [imgSrc, setImgSrc] = useState(`/assets/images/${capability.image}`);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    if (imgSrc.endsWith(capability.image)) {
      setImgSrc(`/assets/images/${capability.fallbackImage}`);
    } else {
      setImgFailed(true);
    }
  };

  // Interpolate X along smooth cubic ease
  const x = useTransform(scrollYProgress, (p) => {
    if (!coords) return 0;
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    return coords.startX + (coords.destX - coords.startX) * ease;
  });

  // Interpolate Y with smooth parabolic flight lift arc
  const y = useTransform(scrollYProgress, (p) => {
    if (!coords) return 0;
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const arc = Math.sin(t * Math.PI) * -45; // Arched trajectory
    return coords.startY + (coords.destY - coords.startY) * ease + arc;
  });

  // UNIFORM SQUARE SIZE: width === height AT ALL TIMES!
  const size = useTransform(scrollYProgress, (p) => {
    if (!coords) return 32;
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return coords.startSize + (coords.destSize - coords.startSize) * ease;
  });

  // Border radius expands smoothly from 9px to 26px
  const borderRadius = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    return 9 + t * 17; // 9px -> 26px
  });

  // Dynamic aerodynamic tilt during mid-air flight
  const rotate = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    if (t <= 0 || t >= 1) return 0;
    const tilt = index % 2 === 0 ? 6 : -6;
    return Math.sin(t * Math.PI) * tilt;
  });

  // Glow halo mid-air
  const glowOpacity = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    return Math.sin(t * Math.PI) * 0.85;
  });

  // Label badge fades in as the tile settles
  const labelOpacity = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
    if (t < 0.55) return 0;
    return Math.min(1, (t - 0.55) / 0.35);
  });

  const visibility = useTransform(scrollYProgress, (p) => {
    if (!coords) return 'hidden';
    return p >= startP - 0.02 ? 'visible' : 'hidden';
  });

  if (!coords) return null;

  return (
    <motion.div
      className="transforming-square-wrapper"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        x,
        y,
        width: size,
        height: size,
        borderRadius,
        rotate,
        visibility,
        zIndex: 35,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="square-visual-tile"
        style={{
          borderRadius,
        }}
      >
        {/* Mid-air aerospace glow ring */}
        <motion.div
          className="square-flight-glow"
          style={{
            opacity: glowOpacity,
            borderRadius,
            borderColor: capability.accent,
          }}
        />

        {/* Glossy 3D Highlight layer */}
        <div className="square-gloss-shine" />

        {/* Visual Image / Artwork filling the square */}
        <div className="square-media-layer">
          {imgFailed ? (
            <div className="square-fallback-art">
              <Icon className="square-fallback-icon" style={{ color: capability.accent }} />
              <span className="square-fallback-label">{capability.keyword}</span>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={capability.title}
              className="square-tile-image"
              onError={handleImgError}
              loading="lazy"
            />
          )}
        </div>

        {/* Minimal Bottom Label Pill (Visible when settled into position) */}
        <motion.div
          className="square-tile-pill"
          style={{ opacity: labelOpacity }}
        >
          <span className="pill-index">{capability.id}</span>
          <span className="pill-keyword">{capability.keyword}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function MissionSystems() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // 5 Inline source thumbnail refs embedded in paragraph
  const sourceRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];

  // 5 Destination square slot anchors inside the stage row
  const destAnchorRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [coordsList, setCoordsList] = useState<(SquareCoord | null)[]>([null, null, null, null, null]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Calculate pixel bounds of source inline icons and destination slots
  const updateCoordinates = useCallback(() => {
    if (!stickyRef.current) return;
    const stickyRect = stickyRef.current.getBoundingClientRect();

    const newCoords: (SquareCoord | null)[] = capabilities.map((_, i) => {
      const sEl = sourceRefs[i].current;
      const dEl = destAnchorRefs[i].current;
      if (!sEl || !dEl) return null;

      const sRect = sEl.getBoundingClientRect();
      const dRect = dEl.getBoundingClientRect();

      // Uniform square sizes: width === height
      const startSize = Math.max(sRect.width, sRect.height);
      const destSize = Math.max(dRect.width, dRect.height);

      return {
        startX: sRect.left - stickyRect.left,
        startY: sRect.top - stickyRect.top,
        startSize,
        destX: dRect.left - stickyRect.left,
        destY: dRect.top - stickyRect.top,
        destSize,
      };
    });

    setCoordsList(newCoords);
  }, []);

  useLayoutEffect(() => {
    updateCoordinates();
  }, [updateCoordinates]);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(updateCoordinates);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });
    const timer = setTimeout(updateCoordinates, 300);

    let ro: ResizeObserver | null = null;
    if (stickyRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(updateCoordinates);
      });
      ro.observe(stickyRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
      clearTimeout(timer);
      if (ro) ro.disconnect();
    };
  }, [updateCoordinates]);

  // Source inline icon opacities (disappear cleanly from paragraph as they detach)
  const sourceOpacities = capabilities.map((cap) =>
    useTransform(scrollYProgress, [cap.startP - 0.02, cap.startP + 0.03], [1, 0])
  );

  return (
    <section className="mission-systems-track" id="mission" ref={trackRef}>
      <div className="mission-systems-sticky" ref={stickyRef}>
        <div className="container mission-systems-inner">
          {/* Section Heading */}
          <div className="mission-systems-header">
            <span className="eyebrow">Mission Architecture</span>
            <h2 className="section-title">
              Engineered for the <em>Mission.</em>
            </h2>
          </div>

          {/* PARAGRAPH WITH 5 EMBEDDED INLINE SQUIRCLE ICONS */}
          <div className="mission-paragraph-wrapper">
            <p className="mission-interactive-paragraph">
              ASTRA builds{' '}
              <span className="inline-tile-pill" ref={sourceRefs[0]}>
                <motion.span className="inline-tile-gfx" style={{ opacity: sourceOpacities[0] }}>
                  <img
                    src="/assets/images/drone1.png"
                    alt="Tactical"
                    className="inline-tile-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/product-fpv.jpg';
                    }}
                  />
                </motion.span>
              </span>{' '}
              sovereign systems for{' '}
              <span className="inline-tile-pill" ref={sourceRefs[1]}>
                <motion.span className="inline-tile-gfx" style={{ opacity: sourceOpacities[1] }}>
                  <img
                    src="/assets/images/drone2.png"
                    alt="Surveillance"
                    className="inline-tile-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/product-surveillance.jpg';
                    }}
                  />
                </motion.span>
              </span>{' '}
              surveillance and{' '}
              <span className="inline-tile-pill" ref={sourceRefs[2]}>
                <motion.span className="inline-tile-gfx" style={{ opacity: sourceOpacities[2] }}>
                  <img
                    src="/assets/images/drone3.png"
                    alt="Autonomous"
                    className="inline-tile-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/product-vtol.jpg';
                    }}
                  />
                </motion.span>
              </span>{' '}
              autonomous operations with{' '}
              <span className="inline-tile-pill" ref={sourceRefs[3]}>
                <motion.span className="inline-tile-gfx" style={{ opacity: sourceOpacities[3] }}>
                  <img
                    src="/assets/images/drone4.png"
                    alt="Electronic Warfare"
                    className="inline-tile-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/product-unjamable.jpg';
                    }}
                  />
                </motion.span>
              </span>{' '}
              resilient{' '}
              <span className="inline-tile-pill" ref={sourceRefs[4]}>
                <motion.span className="inline-tile-gfx" style={{ opacity: sourceOpacities[4] }}>
                  <img
                    src="/assets/images/hero-poster.jpg"
                    alt="Heavy Payload"
                    className="inline-tile-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/product-logistics.jpg';
                    }}
                  />
                </motion.span>
              </span>{' '}
              mission capability.
            </p>
            <div className="scroll-indicator-cue">
              <span className="cue-dot" />
              <span>Scroll to deploy mission capability matrix</span>
              <ChevronDown className="cue-arrow" />
            </div>
          </div>

          {/* FLYING SQUARE VISUAL TILES LAYER */}
          <div className="flying-tiles-layer" aria-hidden="true">
            {capabilities.map((cap, index) => (
              <SquareVisualTile
                key={cap.id}
                capability={cap}
                index={index}
                scrollYProgress={scrollYProgress}
                coords={coordsList[index]}
              />
            ))}
          </div>

          {/* SEAMLESS BORDERLESS SQUARE TILES STAGE (Completely empty initially!) */}
          <div className="mission-square-stage">
            <div className="mission-square-slots-row">
              {capabilities.map((_, index) => (
                <div
                  key={index}
                  className="mission-square-anchor"
                  ref={destAnchorRefs[index]}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MissionSystems;
