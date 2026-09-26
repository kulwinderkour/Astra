import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, RotateCcw, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MissionSystems } from '@/components/mission-systems';
import { CurvedRecognition } from '@/components/curved-recognition';

const queryClient = new QueryClient();

const imageFiles = {
  logo: 'logo1.png',
  poster: 'hero-poster.jpg',
  fpv: 'product-fpv.jpg',
  unjamable: 'product-unjamable.jpg',
  logistics: 'product-logistics.jpg',
  surveillance: 'product-surveillance.jpg',
  kamikaze: 'product-kamikaze.jpg',
  vtol: 'product-vtol.jpg',
  fiber: 'product-fiber-optic.jpg',
  training: 'product-training.jpg',
  lab: 'drone-lab.jpg',
  startup: 'award-startup-punjab.jpg',
  army: 'award-indian-army.jpg',
} as const;

const fleet = [
  ['FPV Drone', 'High-speed, agile, ultra-low latency tactical platform', 'TACTICAL FPV', imageFiles.fpv],
  ['Unjamable Drone', 'Secure, jam-resistant EW-hardened navigation', 'ANTI-JAM EW', imageFiles.unjamable],
  ['Logistics Drone', 'Heavy-lift autonomous payload delivery system', 'HEAVY PAYLOAD', imageFiles.logistics],
  ['Surveillance Drone', 'Day & night reconnaissance with real-time AI feeds', 'TACTICAL ISR', imageFiles.surveillance],
  ['Kamikaze Drone', 'Precision loitering strike with autonomous terminal guidance', 'PRECISION STRIKE', imageFiles.kamikaze],
  ['VTOL Drone', 'Vertical take-off, long range for mapping and ISR', 'HYBRID VTOL', imageFiles.vtol],
  ['Fiber Optic Drone', 'Zero-latency, unbroken physical high-bandwidth link', 'SECURE FIBER', imageFiles.fiber],
  ['Training Drone', 'Durable, crash-resistant flight simulation platform', 'PILOT TRAINING', imageFiles.training],
] as const;

function AssetImage({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <div className={`asset-placeholder ${className}`} role="img" aria-label={`Upload: ${file}`}>
      <span>Upload: {file}</span>
    </div>
  ) : (
    <img
      className={`asset-image ${className}`}
      src={`/assets/images/${file}`}
      alt={alt}
      onError={() => setMissing(true)}
    />
  );
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: string; light?: boolean }) {
  return (
    <div className="section-heading">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
        </div>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
    </div>
  );
}

function Header({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = [
    ['Mission', '#mission'],
    ['Fleet', '#fleet'],
    ['Drone Lab', '#drone-lab'],
    ['Recognition', '#about'],
  ];
  const closeMenu = () => setMenuOpen(false);
  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <a className="brand" href="#top" onClick={closeMenu} data-testid="link-brand">
            <AssetImage file={imageFiles.logo} alt="ASTRA logo" className="brand-mark" />
            <span className="brand-lockup">
              <span className="brand-name">ASTRA</span>
              <span className="brand-sub">DRONES AND ROBOTICS<br />SOLUTIONS PVT. LTD.</span>
            </span>
          </a>
          <nav className="primary-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => (
              <a href={href} key={href} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
                {label}
              </a>
            ))}
          </nav>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
          {nav.map(([label, href]) => (
            <a href={href} onClick={closeMenu} key={href} data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>
              {label}
            </a>
          ))}
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

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      videoRef.current?.pause();
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 2600);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playback = video.play();
      playback?.catch(() => setVisible(true));
    }
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const replay = () => {
    const video = videoRef.current;
    setEnded(false);
    setVisible(reducedMotion);
    if (video && !reducedMotion) {
      video.currentTime = 0;
      void video.play().catch(() => setVisible(true));
      window.setTimeout(() => setVisible(true), 2600);
    }
  };

  return (
    <section className="hero" id="top" aria-label="ASTRA introduction">
      <div className="hero-poster" style={{ backgroundImage: `url(/assets/images/${imageFiles.poster})` }} aria-hidden="true" />
      <video ref={videoRef} className="hero-video" muted playsInline preload="auto" poster={`/assets/images/${imageFiles.poster}`} onEnded={() => setEnded(true)} aria-label="ASTRA drone landing">
        <source src="/assets/videos/hero-landing.mp4" type="video/mp4" />
      </video>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <div className={`motto-lockup ${visible ? 'is-visible' : ''}`}>
          <h1 className="motto-brand">ASTRA DROBOTICS</h1>
          <p className="motto-sanskrit">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</p>
          <p className="motto-translation"><span>Indigenous technology is the source of national strength</span></p>
        </div>
      </div>
      <button className="hero-replay" type="button" onClick={replay} aria-label={ended ? 'Replay hero video' : 'Restart hero video'} data-testid="button-hero-replay">
        <RotateCcw />
      </button>
      <a className="explore-link" href="#mission" data-testid="link-explore">
        Explore ASTRA <ChevronDown />
      </a>
    </section>
  );
}

function Fleet() {
  return (
    <section className="fleet" id="fleet">
      <div className="container">
        <div className="fleet-heading section-heading">
          <div>
            <span className="eyebrow">Our fleet</span>
            <h2 className="section-title">Mission <em>ready.</em></h2>
          </div>
          <p className="section-intro">A modular family of platforms designed, assembled, tested and supported in India.</p>
        </div>
        <div className="fleet-grid">
          {fleet.map(([name, detail, tag, file]) => (
            <article className="fleet-card" key={name} data-testid={`card-fleet-${name.toLowerCase().replaceAll(' ', '-')}`}>
              <div className="image-frame fleet-image">
                <AssetImage file={file} alt={`${name} from ASTRA`} />
                <span className="fleet-tag">{tag}</span>
              </div>
              <div className="fleet-label">
                <h3>{name}</h3>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="fleet-callout">
          <div className="fleet-callout-text">
            <h4>Custom Configurations &amp; Power Units</h4>
            <p>Need custom battery packs, tethered power, or mission-specific sensor payloads?</p>
          </div>
          <a className="button-primary" href="mailto:astradrobotics@gmail.com" data-testid="link-talk-engineers">
            <span>Talk to our engineers</span> <ArrowRight className="btn-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}

function DroneLab() {
  const items = [
    'Complete lab architecture, workstation design and assembly setup',
    'Hands-on FPV flight simulators and outdoor piloting rigs',
    'Custom curriculum spanning aerodynamics, embedded coding & telemetry',
    'Continuous firmware upgrades, spare parts supply & expert mentorship'
  ];
  return (
    <section className="lab" id="drone-lab">
      <div className="container lab-container">
        <div className="lab-copy">
          <span className="eyebrow">Institutional Capability</span>
          <h2 className="section-title">Set up a <em>drone lab.</em></h2>
          <p>We build state-of-the-art drone and robotics labs inside schools, colleges, and national institutions, training students and researchers to build, code, and deploy sovereign UAV technologies.</p>
          <ul className="checklist">
            {items.map(item => (
              <li key={item}>
                <span className="check-icon-wrapper"><Check aria-hidden="true" /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a className="button-primary" href="mailto:astradrobotics@gmail.com" data-testid="link-plan-lab">
            <span>Plan your lab</span> <ArrowRight className="btn-icon" />
          </a>
        </div>
        <div className="lab-media-wrapper">
          <div className="lab-video-card">
            <video
              className="lab-video"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/images/drone-lab.jpg"
            >
              <source src="/assets/videos/lab.mp4" type="video/mp4" />
            </video>
            <div className="lab-video-badge">
              <span className="live-dot" />
              <span>FLIGHT SIMULATION &amp; LAB RIGS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="brand" href="#top" data-testid="link-footer-brand">
              <AssetImage file={imageFiles.logo} alt="ASTRA logo" className="brand-mark" />
              <span className="brand-lockup">
                <span className="brand-name">ASTRA</span>
                <span className="brand-sub">DRONES &amp; ROBOTICS<br />SOLUTIONS PVT. LTD.</span>
              </span>
            </a>
            <div className="footer-motto-box">
              <div className="footer-motto">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</div>
              <span className="footer-motto-sub">Indigenous Defence Technology</span>
            </div>
            <p className="footer-about">
              Engineering sovereign, Made-in-India drone platforms and autonomous robotics for defence, security, tactical ISR, and critical national infrastructure.
            </p>
            <div className="footer-incubation-badge">
              <span className="status-dot" />
              <span>Incubated at IIT Ropar • Make in India</span>
            </div>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h3>Navigation</h3>
              <a href="#top">Overview</a>
              <a href="#mission">Our Mission</a>
              <a href="#fleet">Drone Fleet</a>
              <a href="#drone-lab">Drone Lab Infrastructure</a>
              <a href="#about">About &amp; Recognition</a>
            </div>
            <div className="footer-column">
              <h3>Capabilities</h3>
              <a href="#fleet">Tactical FPV</a>
              <a href="#fleet">Anti-Jam EW</a>
              <a href="#fleet">Heavy Payload</a>
              <a href="#fleet">Autonomous ISR</a>
              <a href="#drone-lab">Pilot Training</a>
            </div>
            <div className="footer-column footer-contact-col">
              <h3>Contact &amp; HQ</h3>
              <a href="tel:+916239663762" className="footer-contact-link">
                <Phone className="footer-link-icon" /> +91 62396 63762
              </a>
              <a href="mailto:astradrobotics@gmail.com" className="footer-contact-link">
                <Mail className="footer-link-icon" /> astradrobotics@gmail.com
              </a>
              <div className="footer-location">
                <MapPin className="footer-link-icon" />
                <span>IIT Ropar, Visvesvaraya Block, Rupnagar, Punjab 140001</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 Astra Drones and Robotics Solutions Pvt. Ltd. All rights reserved.</span>
          </div>
          <div className="footer-bottom-right">
            <div className="legal-links">
              <a href="#top">Privacy Policy</a>
              <a href="#top">Terms of Service</a>
              <a href="mailto:astradrobotics@gmail.com">Security Briefings</a>
            </div>
            <button type="button" onClick={scrollToTop} className="back-to-top" aria-label="Back to top">
              Top <ArrowUpRight className="top-arrow" />
            </button>
          </div>
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
      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <MissionSystems />
        <Fleet />
        <DroneLab />
        <CurvedRecognition />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <LandingPage />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;