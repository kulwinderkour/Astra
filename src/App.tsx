import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ChevronDown, Check, Mail, MapPin, Menu, Phone, RotateCcw, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
// Segments and the scroll showcase are the only consumers of framer-motion and
// both sit below the fold, so they share a deferred chunk. Each fallback
// reserves its section's height to keep the swap free of layout shift.
const Segments = lazy(() =>
  import('@/components/segments').then((m) => ({ default: m.Segments })),
);
const DroneShowcase = lazy(() =>
  import('@/components/drone-showcase').then((m) => ({ default: m.DroneShowcase })),
);
import { ProofEditorial } from '@/components/proof-editorial';

/**
 * Canonical image manifest. Every filename here resolves to
 * public/assets/images/<file>. Dropping a correctly named file into that
 * directory is all that is required to light up the matching slot — no code
 * change. See ASSET-MANIFEST.md for the required subject and aspect ratio of
 * each slot, and `npm run verify:assets` for the automated check.
 */
const imageFiles = {
  logo: 'logo1.png',
  poster: 'hero-poster.jpg',
  interceptor: 'interceptor.jpg',
  lab: 'drone-lab.jpg',
  mission: 'tile-mission.jpg',
  tileTraining: 'tile-training.jpg',
  contact: 'tile-contact.jpg',
} as const;

/**
 * The eight fleet platforms, in catalogue order. Each image lives in
 * public/assets/images/fleet/ and is a 1584x993 source re-encoded to WebP.
 * `tag` is the technical category shown over the image.
 */
const fleet = [
  {
    number: '01',
    tag: 'Tactical FPV',
    name: 'FPV Drone',
    detail: 'High-speed, agile, low-latency tactical platform.',
    image: 'fleet/fleet-fpv.webp',
    alt: 'ASTRA tactical FPV drone on a ridge at golden hour',
  },
  {
    number: '02',
    tag: 'Anti-jam EW',
    name: 'Unjamable Drone',
    detail: 'Secure, jam-resistant, long-range navigation.',
    image: 'fleet/fleet-unjamable.webp',
    alt: 'ASTRA jam-resistant hexacopter over an alpine ridge',
  },
  {
    number: '03',
    tag: 'Heavy Payload',
    name: 'Logistics Drone',
    detail: 'Heavy-lift, autonomous payload delivery system.',
    image: 'fleet/fleet-logistics.webp',
    alt: 'ASTRA logistics drone carrying a cargo crate over mountains',
  },
  {
    number: '04',
    tag: 'Tactical ISR',
    name: 'Surveillance Drone',
    detail: 'Day and night reconnaissance with real-time feeds.',
    image: 'fleet/fleet-surveillance.webp',
    alt: 'ASTRA fixed-wing surveillance UAV over a mountain valley',
  },
  {
    number: '05',
    tag: 'Precision Strike',
    name: 'Kamikaze Drone',
    detail: 'Precision strike with autonomous navigation.',
    image: 'fleet/fleet-kamikaze.webp',
    alt: 'ASTRA loitering munition on its launch platform at sunset',
  },
  {
    number: '06',
    tag: 'Hybrid VTOL',
    name: 'VTOL Drone',
    detail: 'Vertical take-off, long range, ideal for mapping and ISR.',
    image: 'fleet/fleet-vtol.webp',
    alt: 'ASTRA fixed-wing VTOL aircraft on a runway at sunset',
  },
  {
    number: '07',
    tag: 'Secure Fiber',
    name: 'Fiber Optic Drone',
    detail: 'Unbroken, high-bandwidth link for critical missions.',
    image: 'fleet/fleet-fiber-optic.webp',
    alt: 'ASTRA drone deploying a fiber-optic spool at sunset',
  },
  {
    number: '08',
    tag: 'Pilot Training',
    name: 'Training Drone',
    detail: 'Durable, crash-resistant, indoor and outdoor use.',
    image: 'fleet/fleet-training.webp',
    alt: 'ASTRA training drones and controllers on a bench',
  },
] as const;

/**
 * Renders an image from the asset manifest. If the file is absent or fails to
 * decode, it falls back to a neutral ASTRA-branded panel rather than any
 * developer-facing text. The panel is decorative and hidden from assistive
 * technology — the surrounding heading and copy carry the meaning.
 */
function AssetImage({
  file,
  alt,
  className = '',
  priority = false,
}: {
  file: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <div className={`asset-placeholder ${className}`} aria-hidden="true" />
  ) : (
    <img
      className={`asset-image ${className}`}
      src={`/assets/images/${file}`}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setMissing(true)}
    />
  );
}

function SectionHeading({ eyebrow, title, intro, light = false }: { eyebrow: string; title: ReactNode; intro?: string; light?: boolean }) {
  return (
    <div className="section-heading">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title" style={light ? { color: 'var(--white)' } : undefined}>{title}</h2>
        </div>
        {intro ? <p className="section-intro" style={light ? { color: 'rgba(255,255,255,.68)' } : undefined}>{intro}</p> : null}
      </div>
    </div>
  );
}

const NAV = [
  ['Segments', '#segments'],
  ['Products', '#fleet'],
  ['Interceptor', '#interceptor'],
  ['Drone Lab', '#drone-lab'],
  ['About', '#about'],
] as const;

/**
 * Marks the section currently filling the viewport. Uses IntersectionObserver
 * rather than a scroll handler, so state changes once per section crossing
 * instead of once per scroll event.
 */
function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = NAV.map(([, href]) => href.slice(1));
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        let best = '';
        let bestRatio = 0.12;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { threshold: [0, 0.12, 0.3, 0.55, 0.8], rootMargin: '-92px 0px 0px 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return active;
}

function Header({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection();
  const nav = NAV;
  const closeMenu = () => setMenuOpen(false);

  // Close on Escape and stop the page scrolling behind the open menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="#top" onClick={closeMenu} data-testid="link-brand">
            <AssetImage file={imageFiles.logo} alt="ASTRA Drones and Robotics Solutions" className="brand-mark" priority />
            <span className="brand-lockup">
              <span className="brand-name">ASTRA</span>
              <span className="brand-sub">DRONES AND ROBOTICS<br />SOLUTIONS PVT. LTD.</span>
            </span>
          </a>
          <nav className="primary-nav" aria-label="Primary">
            {nav.map(([label, href]) => (
              <a
                href={href}
                key={href}
                className={active === href.slice(1) ? 'is-active' : undefined}
                aria-current={active === href.slice(1) ? 'true' : undefined}
                data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}
              >
                {label}
              </a>
            ))}
          </nav>
          <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile">
          {nav.map(([label, href]) => <a href={href} onClick={closeMenu} key={href} data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
        </nav>
      ) : null}
    </>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [ended, setEnded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // The hero film is a 1.3 MB decorative layer. On small screens and on
  // metered connections the poster alone carries the section, so the video is
  // never fetched there.
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      setReducedMotion(motion.matches);
      setUseVideo(wide.matches && !motion.matches && !connection?.saveData);
    };
    update();
    motion.addEventListener('change', update);
    wide.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      wide.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!useVideo) {
      setVisible(true);
      videoRef.current?.pause();
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 2600);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play()?.catch(() => setVisible(true));
    }
    return () => window.clearTimeout(timer);
  }, [useVideo]);

  const replay = () => {
    const video = videoRef.current;
    setEnded(false);
    if (!video || !useVideo) return;
    setVisible(false);
    video.currentTime = 0;
    void video.play().catch(() => setVisible(true));
    window.setTimeout(() => setVisible(true), 2600);
  };

  return (
    <section className="hero" id="top" aria-label="ASTRA introduction">
      <div className="hero-poster" style={{ backgroundImage: `url(/assets/images/${imageFiles.poster})` }} aria-hidden="true" />
      {useVideo ? (
        <video
          ref={videoRef}
          className="hero-video"
          muted
          playsInline
          preload="metadata"
          poster={`/assets/images/${imageFiles.poster}`}
          onEnded={() => setEnded(true)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/assets/videos/hero-landing.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="hero-scrim" aria-hidden="true" />
      <span className="hero-label" aria-hidden="true">INDIGENOUS SYSTEMS / FIELD READY</span>
      <div className="hero-content">
        <div className={`motto-lockup ${visible ? 'is-visible' : ''}`}>
          <h1 className="motto-sanskrit" lang="sa">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</h1>
          <p className="motto-translation"><span>Indigenous technology is the source of national strength</span></p>
        </div>
      </div>
      {useVideo ? (
        <button className="hero-replay" type="button" onClick={replay} aria-label={ended ? 'Replay hero film' : 'Restart hero film'} data-testid="button-hero-replay">
          <RotateCcw aria-hidden="true" />
        </button>
      ) : null}
      <a className="explore-link" href="#aerial-systems" data-testid="link-explore">Scroll down <ChevronDown aria-hidden="true" /></a>
    </section>
  );
}

function Fleet() {
  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-title">
      <div className="fleet-backdrop" aria-hidden="true" />
      <div className="container">
        <div className="fleet-heading">
          <div className="fleet-heading-main">
            <span className="eyebrow">Our fleet</span>
            <h2 className="section-title" id="fleet-title">Mission <em>ready.</em></h2>
          </div>
          <p className="fleet-intro">
            A modular family of platforms designed, assembled, tested and supported in India.
          </p>
          <p className="fleet-strap" aria-hidden="true">
            Indigenous technology<br />for a stronger, safer India.
          </p>
        </div>

        <ul className="fleet-grid">
          {fleet.map((platform, index) => (
            <li
              key={platform.name}
              className="fleet-card"
              style={{ '--stagger': `${(index % 4) * 70 + Math.floor(index / 4) * 110}ms` } as React.CSSProperties}
              data-testid={`card-fleet-${platform.name.toLowerCase().replaceAll(' ', '-')}`}
            >
              <a className="fleet-card-link" href="#contact" aria-label={`${platform.name} — enquire`}>
                <div className="fleet-card-media">
                  <AssetImage file={platform.image} alt={platform.alt} />
                  <span className="fleet-tag">{platform.tag}</span>
                </div>
                <div className="fleet-card-body">
                  <span className="fleet-number" aria-hidden="true">{platform.number}</span>
                  <div className="fleet-card-text">
                    <h3>{platform.name}</h3>
                    <p>{platform.detail}</p>
                  </div>
                  <span className="fleet-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="fleet-callout">
          <p className="fleet-callout-lead">Need a mission-specific platform?</p>
          <p className="fleet-callout-detail">
            Custom configurations, payloads and support for defence, security and research missions.
          </p>
          <a className="fleet-callout-action" href="#contact" data-testid="link-talk-engineers">
            Talk to our engineers <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Interceptor() {
  const specs = [['Role', 'Counter-UAV operations'], ['Handling', 'High agility and speed'], ['Guidance', 'Real-time target tracking'], ['Build', 'Designed and made in India']];
  return (
    <section className="interceptor" id="interceptor" aria-labelledby="interceptor-title">
      <div className="image-frame interceptor-image"><AssetImage file={imageFiles.interceptor} alt="The ASTRA Interceptor counter-UAV platform" /></div>
      <div className="interceptor-copy">
        <span className="eyebrow">Featured platform</span><h2 className="section-title" id="interceptor-title">Interceptor <em>Drone</em></h2>
        <p className="lead">A vertical-launch counter-UAV platform built to find, track and neutralise hostile drones.</p>
        <dl className="spec-grid">{specs.map(([label, value]) => <div className="spec" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <a className="button-primary" href="#contact" data-testid="link-request-briefing">Request a briefing</a>
      </div>
    </section>
  );
}

function DroneLab() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      void video.play().catch(() => {});
    }
  }, []);

  const items = [
    'Lab design, equipment and installation',
    'Hands-on workshops and FPV flight training',
    'Curriculum for build, code and fly',
    'Ongoing technical support'
  ];
  return (
    <section className="lab" id="drone-lab" aria-labelledby="lab-title">
      <div className="lab-copy">
        <span className="eyebrow">Institutional capability</span>
        <h2 className="section-title" id="lab-title">Set up a <em>drone lab.</em></h2>
        <p>We build drone and robotics labs inside schools, colleges and institutions, then train students and staff to run them.</p>
        <ul className="checklist">
          {items.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}
        </ul>
        <a className="button-primary" href="#contact" data-testid="link-plan-lab">Plan your lab</a>
      </div>
      <div className="image-frame lab-image">
        <video
          ref={videoRef}
          className="lab-video"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          aria-label="ASTRA drone lab demonstration"
        >
          <source src="/assets/videos/labvideo.mp4" type="video/mp4" />
        </video>
        <div className="lab-video-overlay" aria-hidden="true" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand" href="#top" data-testid="link-footer-brand">
              <AssetImage file={imageFiles.logo} alt="ASTRA Drones and Robotics Solutions" className="brand-mark" />
              <span className="brand-lockup">
                <span className="brand-name">ASTRA</span>
                <span className="brand-sub">DROBOTICS</span>
              </span>
            </a>
            <div className="footer-motto" lang="sa">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</div>
            <p className="footer-about">Made-in-India drones and robotic systems for defence, disaster response and surveillance.</p>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h3>Quick links</h3>
              <a href="#about">About Us</a>
              <a href="#segments">Our Focus</a>
              <a href="#fleet">Products</a>
            </div>
            <div className="footer-column">
              <h3>Capability</h3>
              <a href="#interceptor">Defence Drones</a>
              <a href="#fleet">Platforms</a>
              <a href="#drone-lab">Drone Lab</a>
            </div>
            <div className="footer-column">
              <h3>Get in touch</h3>
              <a href="tel:+916239663762">+91 62396 63762</a>
              <a href="mailto:astradrobotics@gmail.com">astradrobotics@gmail.com</a>
              <a href="#contact">Visit us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Astra Drones and Robotics Solutions Pvt. Ltd. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="astra-page">
      <a className="skip-link" href="#aerial-systems">Skip to content</a>
      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <Suspense fallback={<div className="aas-stage-fallback" aria-hidden="true" />}>
          <DroneShowcase />
        </Suspense>
        <Suspense fallback={<div className="seg-fallback" aria-hidden="true" />}>
          <Segments />
        </Suspense>
        <Fleet />
        <Interceptor />
        <DroneLab />
        <ProofEditorial />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LandingPage />
    </ErrorBoundary>
  );
}

export default App;
