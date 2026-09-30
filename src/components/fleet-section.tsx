import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

/**
 * FLEET DATA CONFIGURATION
 * All drone platforms, categories, images, descriptions, and spec chips in one array.
 */
export interface DroneSpec {
  label: string;
  value: string;
}

export interface DronePlatform {
  id: string;
  number: string;
  name: string;
  tag: string;
  category: 'Attack' | 'Surveillance' | 'Logistics' | 'Training';
  detail: string;
  image: string;
  alt: string;
  specs: DroneSpec[];
}

const FLEET_CATEGORIES = ['Attack', 'Surveillance', 'Logistics', 'Training'] as const;
type FleetCategory = (typeof FLEET_CATEGORIES)[number];

const FLEET_DATA: DronePlatform[] = [
  // ── Attack Category ──
  {
    id: 'fpv-drone',
    number: '01',
    name: 'FPV Drone',
    tag: 'Tactical FPV',
    category: 'Attack',
    detail: 'High-speed, agile, low-latency tactical platform engineered for frontline precision.',
    image: '/assets/images/fleet/fleet-fpv.webp',
    alt: 'ASTRA tactical FPV drone',
    specs: [
      { label: 'RANGE', value: '12 km' },
      { label: 'SPEED', value: '160 km/h' },
      { label: 'PAYLOAD', value: '1.5 kg' },
      { label: 'LATENCY', value: '< 18 ms' },
    ],
  },
  {
    id: 'kamikaze-drone',
    number: '05',
    name: 'Kamikaze Drone',
    tag: 'Precision Strike',
    category: 'Attack',
    detail: 'Precision strike loitering munition with autonomous terminal lock on targets.',
    image: '/assets/images/fleet/fleet-kamikaze.webp',
    alt: 'ASTRA loitering munition platform',
    specs: [
      { label: 'RANGE', value: '25 km' },
      { label: 'LOITER', value: '35 min' },
      { label: 'WARHEAD', value: '2.5 kg' },
      { label: 'SPEED', value: '180 km/h' },
    ],
  },
  {
    id: 'fiber-optic-drone',
    number: '07',
    name: 'Fibre Optic Drone',
    tag: 'Secure Fibre',
    category: 'Attack',
    detail: 'Unbroken tethered optical link guaranteeing zero EW interference in contested zones.',
    image: '/assets/images/fleet/fleet-fiber-optic.webp',
    alt: 'ASTRA drone deploying fiber-optic spool',
    specs: [
      { label: 'RANGE', value: '15 km' },
      { label: 'JAMMING', value: 'IMMUNE' },
      { label: 'FEED', value: '4K UNCOMP' },
      { label: 'LINK', value: 'OPTICAL' },
    ],
  },

  // ── Surveillance Category ──
  {
    id: 'surveillance-drone',
    number: '04',
    name: 'Surveillance Drone',
    tag: 'Tactical ISR',
    category: 'Surveillance',
    detail: 'Day and night aerial reconnaissance with real-time encrypted intelligence feeds.',
    image: '/assets/images/fleet/fleet-surveillance.webp',
    alt: 'ASTRA fixed-wing surveillance UAV',
    specs: [
      { label: 'RANGE', value: '40 km' },
      { label: 'ENDURANCE', value: '180 min' },
      { label: 'CEILING', value: '4,500 m' },
      { label: 'SENSOR', value: 'EO / IR' },
    ],
  },
  {
    id: 'unjammable-drone',
    number: '02',
    name: 'Unjammable Drone',
    tag: 'Anti-jam EW',
    category: 'Surveillance',
    detail: 'Multi-constellation anti-spoofing and visual odometry for GPS-denied environments.',
    image: '/assets/images/fleet/fleet-unjamable.webp',
    alt: 'ASTRA jam-resistant hexacopter',
    specs: [
      { label: 'RANGE', value: '30 km' },
      { label: 'NAVIGATION', value: 'GPS-DENIED' },
      { label: 'ENDURANCE', value: '55 min' },
      { label: 'PAYLOAD', value: '3.5 kg' },
    ],
  },
  {
    id: 'vtol-drone',
    number: '06',
    name: 'VTOL Drone',
    tag: 'Hybrid VTOL',
    category: 'Surveillance',
    detail: 'Runway-independent vertical takeoff combined with efficient fixed-wing cruise.',
    image: '/assets/images/fleet/fleet-vtol.webp',
    alt: 'ASTRA fixed-wing VTOL aircraft',
    specs: [
      { label: 'RANGE', value: '65 km' },
      { label: 'ENDURANCE', value: '120 min' },
      { label: 'CRUISE', value: '95 km/h' },
      { label: 'TAKEOFF', value: 'VERTICAL' },
    ],
  },

  // ── Logistics Category ──
  {
    id: 'logistics-drone',
    number: '03',
    name: 'Logistics Drone',
    tag: 'Heavy Payload',
    category: 'Logistics',
    detail: 'Heavy-lift autonomous cargo delivery system designed for forward operating bases and critical resupply.',
    image: '/assets/images/fleet/fleet-logistics.webp',
    alt: 'ASTRA logistics heavy lift drone',
    specs: [
      { label: 'MAX PAYLOAD', value: '15 kg' },
      { label: 'RANGE', value: '20 km' },
      { label: 'PROPULSION', value: 'OCTA-COAXIAL' },
      { label: 'RELEASE', value: 'WINCH AUTO' },
      { label: 'ENDURANCE', value: '45 min' },
      { label: 'SPEED', value: '65 km/h' },
    ],
  },

  // ── Training Category ──
  {
    id: 'training-drone',
    number: '08',
    name: 'Training Drone',
    tag: 'Pilot Training',
    category: 'Training',
    detail: 'High-durability crash-resilient airframe built for institutional pilot simulation and flight certification.',
    image: '/assets/images/fleet/fleet-training.webp',
    alt: 'ASTRA training drones and controllers',
    specs: [
      { label: 'AIRFRAME', value: '3K CARBON' },
      { label: 'FLIGHT TIME', value: '18 min' },
      { label: 'SIM-READY', value: 'TRUE' },
      { label: 'PROTECTION', value: 'DUCTED 360' },
      { label: 'SPEED', value: '85 km/h' },
      { label: 'WEIGHT', value: '420 g' },
    ],
  },
];

/**
 * Animated number counter component with IntersectionObserver
 */
function CountUp({ end, suffix = '', duration = 1200 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const updateNumber = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));

            if (progress < 1) {
              requestAnimationFrame(updateNumber);
            }
          };

          requestAnimationFrame(updateNumber);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, reducedMotion]);

  return (
    <span ref={ref} className="stat-number">
      {count}
      {suffix}
    </span>
  );
}

/**
 * Single Bento Card with Spotlight, HUD Brackets, Scanline, and Spec Chips
 */
function BentoCard({
  platform,
  isFeatured = false,
  isHero = false,
}: {
  platform: DronePlatform;
  isFeatured?: boolean;
  isHero?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className={`bento-card ${isFeatured ? 'is-featured' : ''} ${isHero ? 'is-hero' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          '--mouse-x': `${mousePos.x}%`,
          '--mouse-y': `${mousePos.y}%`,
        } as React.CSSProperties
      }
      data-testid={`card-fleet-${platform.id}`}
    >
      {/* Background Image with Slow Zoom */}
      <div className="bento-image-wrapper">
        <img
          src={platform.image}
          alt={platform.alt}
          loading="lazy"
          width="1584"
          height="993"
          className="bento-image"
        />
        <div className="bento-gradient" aria-hidden="true" />
      </div>

      {/* Cursor-Following Spotlight */}
      <div className="bento-spotlight" aria-hidden="true" />

      {/* Sweep Scanline on Hover */}
      {isHovered && <div className="bento-scanline" aria-hidden="true" />}

      {/* HUD Corner Brackets */}
      <div className="hud-bracket hud-tl" aria-hidden="true" />
      <div className="hud-bracket hud-tr" aria-hidden="true" />
      <div className="hud-bracket hud-bl" aria-hidden="true" />
      <div className="hud-bracket hud-br" aria-hidden="true" />

      {/* Top Bar: Glass Pill Tag & Large Outlined Number */}
      <div className="bento-top-bar">
        <span className="bento-tag">{platform.tag}</span>
        <span className="bento-number" aria-hidden="true">
          {platform.number}
        </span>
      </div>

      {/* Bottom Content: Title, Description, Spec Chips & Action Button */}
      <div className="bento-bottom-content">
        <div className="bento-text-area">
          <h3 className="bento-title">{platform.name}</h3>

          {/* Reveal Info: Description & Spec Chips */}
          <div className="card-reveal-info">
            <p className="bento-detail">{platform.detail}</p>

            <div className="bento-specs-row">
              {platform.specs.map((spec) => (
                <div key={spec.label} className="bento-spec-chip">
                  <span className="spec-chip-label">{spec.label}</span>
                  <span className="spec-chip-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circular Action Arrow Button */}
        <a
          href="#contact"
          className="bento-action-btn"
          aria-label={`Enquire about ${platform.name}`}
          data-testid={`link-enquire-${platform.id}`}
        >
          <ArrowUpRight className="bento-arrow-icon" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Main Fleet Component with Category Tabs & Dynamic Bento Layout
 */
export function Fleet() {
  const [activeCategory, setActiveCategory] = useState<FleetCategory>('Attack');
  const reducedMotion = useReducedMotion();

  // Support Deep-Linking with URL Hash (#attack, #surveillance, #logistics, #training)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const matched = FLEET_CATEGORIES.find((cat) => cat.toLowerCase() === hash);
      if (matched) {
        setActiveCategory(matched);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabClick = (category: FleetCategory) => {
    setActiveCategory(category);
    // Update URL hash without causing page jump
    window.history.replaceState(null, '', `#${category.toLowerCase()}`);
  };

  const platforms = FLEET_DATA.filter((p) => p.category === activeCategory);
  const platformCount = platforms.length;

  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-title">
      <div className="container">
        {/* Section Header */}
        <header className="fleet-header-block">
          <div className="fleet-header-top">
            <div className="fleet-title-wrapper">
              <div className="fleet-eyebrow-row">
                <span className="fleet-eyebrow-line" aria-hidden="true" />
                <span className="fleet-eyebrow-text">Our Fleet</span>
              </div>
              <h2 className="fleet-heading-text" id="fleet-title">
                MISSION <span className="fleet-ready-accent">READY.</span>
              </h2>
            </div>

            <div className="fleet-intro-wrapper">
              <p className="fleet-intro-text">
                A modular family of platforms designed, assembled, tested and supported in India.
                Indigenous technology for a stronger, safer India.
              </p>
            </div>
          </div>

          {/* Slim Stats Strip with Count-Up Numbers */}
          <div className="fleet-stats-strip">
            <div className="fleet-stat-item">
              <CountUp end={8} />
              <span className="stat-label">Platforms</span>
            </div>
            <div className="fleet-stat-sep" aria-hidden="true" />
            <div className="fleet-stat-item">
              <CountUp end={4} />
              <span className="stat-label">Mission Roles</span>
            </div>
            <div className="fleet-stat-sep" aria-hidden="true" />
            <div className="fleet-stat-item">
              <CountUp end={100} suffix="%" />
              <span className="stat-label">Designed & Made in India</span>
            </div>
          </div>
        </header>

        {/* Category Tabs Bar */}
        <div className="fleet-tabs-bar" role="tablist" aria-label="Fleet category filter">
          <div className="fleet-tabs-scroll-row">
            {FLEET_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-pressed={isActive}
                  tabIndex={0}
                  className={`fleet-tab-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleTabClick(category)}
                  data-testid={`tab-fleet-${category.toLowerCase()}`}
                >
                  <span className="fleet-tab-text">{category}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeTabUnderline"
                      className="fleet-tab-active-indicator"
                      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Counter */}
          <div className="fleet-tab-counter">
            <span>{platformCount} {platformCount === 1 ? 'platform' : 'platforms'}</span>
          </div>
        </div>

        {/* Dynamic Bento Grid (Fades out old & staggers new in 80ms apart) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className={`bento-grid count-${platformCount}`}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={reducedMotion ? undefined : { opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {platforms.map((platform, index) => {
              const isFeatured = platformCount === 3 && index === 0;
              const isHero = platformCount === 1;

              return (
                <motion.div
                  key={platform.id}
                  className={`bento-grid-item ${isFeatured ? 'item-featured' : ''} ${
                    isHero ? 'item-hero' : ''
                  }`}
                  initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                  animate={reducedMotion ? false : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: reducedMotion ? 0 : index * 0.08,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                >
                  <BentoCard platform={platform} isFeatured={isFeatured} isHero={isHero} />
                </motion.div>
              );
            })}

            {/* Extra Hero Stats Strip for 1-Card Categories (Logistics, Training) */}
            {platformCount === 1 && (
              <motion.div
                className="hero-specs-banner"
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={reducedMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <div className="hero-specs-label">TECHNICAL SPECIFICATIONS MATRIX</div>
                <div className="hero-specs-grid">
                  {platforms[0].specs.map((spec) => (
                    <div key={spec.label} className="hero-spec-item">
                      <span className="hero-spec-lbl">{spec.label}</span>
                      <span className="hero-spec-val">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Bar */}
        <div className="fleet-bottom-cta">
          <div className="fleet-cta-inner">
            <div className="fleet-cta-text">
              <h3 className="fleet-cta-title">Need a mission-specific platform?</h3>
              <p className="fleet-cta-desc">
                Custom configurations, payloads and support for defence, security and research teams.
              </p>
            </div>
            <a
              href="#contact"
              className="fleet-cta-button"
              data-testid="link-talk-engineers"
            >
              <span>Talk to our engineers</span>
              <ArrowRight className="fleet-cta-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
