import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, RotateCcw, ShieldCheck, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

const imageFiles = {
  logo: 'logo1.png',
  poster: 'hero-poster.jpg',
  defence: 'segment-defence.jpg',
  commercial: 'segment-commercial.jpg',
  fpv: 'product-fpv.jpg',
  unjamable: 'product-unjamable.jpg',
  logistics: 'product-logistics.jpg',
  surveillance: 'product-surveillance.jpg',
  kamikaze: 'product-kamikaze.jpg',
  vtol: 'product-vtol.jpg',
  fiber: 'product-fiber-optic.jpg',
  training: 'product-training.jpg',
  interceptor: 'interceptor.jpg',
  lab: 'drone-lab.jpg',
  startup: 'award-startup-punjab.jpg',
  army: 'award-indian-army.jpg',
  mission: 'tile-mission.jpg',
  tileTraining: 'tile-training.jpg',
  contact: 'tile-contact.jpg',
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
    ['Segments', '#segments'],
    ['Fleet', '#fleet'],
    ['Interceptor', '#interceptor'],
    ['Drone Lab', '#drone-lab'],
    ['Recognition', '#about'],
    ['Contact', '#contact']
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
      <video ref={videoRef} className="hero-video" muted playsInline preload="auto" poster={`/assets/images/${imageFiles.poster}`} onEnded={() => setEnded(true)} aria-label="ASTRA drone landing"><source src="/assets/videos/hero-landing.mp4" type="video/mp4" /></video>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <div className={`motto-lockup ${visible ? 'is-visible' : ''}`}>
          <h1 className="motto-brand">ASTRA DROBOTICS</h1>
          <p className="motto-sanskrit">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</p>
          <p className="motto-translation"><span>Indigenous technology is the source of national strength</span></p>
        </div>
      </div>
      <button className="hero-replay" type="button" onClick={replay} aria-label={ended ? 'Replay hero video' : 'Restart hero video'} data-testid="button-hero-replay"><RotateCcw /></button>
      <a className="explore-link" href="#mission" data-testid="link-explore">Explore ASTRA <ChevronDown /></a>
    </section>
  );
}

function Segments() {
  return (
    <section className="segments" id="segments">
      <div className="container">
        <SectionHeading eyebrow="Our segments" title={<>Built for <em>consequence.</em></>} intro="From contested airspace to critical infrastructure, ASTRA builds dependable systems for the work that cannot wait." />
        <div className="segment-grid">
          <article className="segment-card">
            <div className="image-frame segment-image">
              <AssetImage file={imageFiles.defence} alt="Defence UAV platform" />
              <div className="card-badge">TACTICAL &amp; DEFENCE</div>
            </div>
            <div className="segment-copy">
              <h3>Defence Systems</h3>
              <p>Combat-ready, EW-resistant UAV platforms engineered for tactical strike, reconnaissance, and battlefield advantage.</p>
              <a className="outline-link" href="#interceptor" data-testid="link-defence-systems">
                <span>See defence systems</span> <ArrowRight className="link-icon" />
              </a>
            </div>
          </article>
          <article className="segment-card">
            <div className="image-frame segment-image">
              <AssetImage file={imageFiles.commercial} alt="Commercial inspection drone" />
              <div className="card-badge">COMMERCIAL &amp; INDUSTRIAL</div>
            </div>
            <div className="segment-copy">
              <h3>Commercial Solutions</h3>
              <p>Precision surveillance, autonomous aerial mapping, and infrastructure inspection platforms for enterprise scale.</p>
              <a className="outline-link" href="#fleet" data-testid="link-commercial-systems">
                <span>See commercial systems</span> <ArrowRight className="link-icon" />
              </a>
            </div>
          </article>
        </div>
      </div>
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
          <a className="button-primary" href="#contact" data-testid="link-talk-engineers">
            <span>Talk to our engineers</span> <ArrowRight className="btn-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Interceptor() {
  const specs = [
    ['Role', 'Counter-UAV & Air Defence Intercept'],
    ['Handling', 'Extreme Agility, Thrust-to-Weight 4:1'],
    ['Guidance', 'On-Device AI Real-time Target Tracking'],
    ['Build', 'Designed, Programmed & Built in India']
  ];
  return (
    <section className="interceptor" id="interceptor">
      <div className="image-frame interceptor-image"><AssetImage file={imageFiles.interceptor} alt="ASTRA interceptor drone" /></div>
      <div className="interceptor-copy">
        <span className="eyebrow">Featured Flagship Platform</span>
        <h2 className="section-title">Interceptor <em>Drone</em></h2>
        <p className="lead">A rapid vertical-launch counter-UAV platform engineered to identify, intercept, and neutralise rogue drones in contested airspace.</p>
        <dl className="spec-grid">
          {specs.map(([label, value]) => (
            <div className="spec" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <a className="button-primary" href="#contact" data-testid="link-request-briefing">
          <span>Request a briefing</span> <ArrowRight className="btn-icon" />
        </a>
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
      <div className="lab-copy">
        <span className="eyebrow">Institutional Capability</span>
        <h2 className="section-title">Set up a <em>drone lab.</em></h2>
        <p>We build state-of-the-art drone and robotics labs inside schools, colleges, and national institutions, training students and researchers to build, code, and deploy.</p>
        <ul className="checklist">
          {items.map(item => (
            <li key={item}>
              <span className="check-icon-wrapper"><Check aria-hidden="true" /></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <a className="button-primary" href="#contact" data-testid="link-plan-lab">
          <span>Plan your lab</span> <ArrowRight className="btn-icon" />
        </a>
      </div>
      <div className="image-frame lab-image"><AssetImage file={imageFiles.lab} alt="Students working in an ASTRA drone lab" /></div>
    </section>
  );
}

function Recognition() {
  const awards = [
    ['2026', 'Startup Punjab Conclave', 'The Chief Minister of Punjab appreciated ASTRA for indigenous innovation and excellence in UAV technology.', imageFiles.startup, 'Startup Punjab'],
    ['Indian Army', 'Workshop and Delivery', 'ASTRA conducted tactical drone workshops and delivered high-performance field-ready systems to the Indian Army.', imageFiles.army, 'Indian Army']
  ];
  return (
    <section className="recognition" id="about">
      <div className="container">
        <SectionHeading eyebrow="Reward & recognition" title={<>Proof in the <em>field.</em></>} intro="Trusted by government bodies and defence forces for reliable indigenous engineering." />
        <div className="recognition-grid">
          {awards.map(([tag, title, text, file, alt]) => (
            <article className="award-card" key={title}>
              <div className="image-frame award-image"><AssetImage file={file} alt={alt} /></div>
              <div className="award-content">
                <span className="award-tag">{tag}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryTiles() {
  const tiles = [
    ['Who we are', 'Our Mission', imageFiles.mission, '#mission'],
    ['Learn to build and fly', 'Training & Labs', imageFiles.tileTraining, '#drone-lab'],
    ['Work with us', 'Procurement & Contact', imageFiles.contact, '#contact']
  ];
  return (
    <section className="story-tiles">
      {tiles.map(([kicker, title, file, href]) => (
        <article className="story-tile" key={title}>
          <div className="image-frame"><AssetImage file={file} alt={title} /></div>
          <div className="story-copy">
            <span className="story-kicker">{kicker}</span>
            <h3>{title}</h3>
            <a href={href} data-testid={`link-story-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
              <span>Explore</span> <ArrowRight className="link-icon" />
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-band" id="contact">
      <div className="container contact-layout">
        <div className="contact-main">
          <span className="eyebrow">Start a conversation</span>
          <h2 className="section-title">Talk to <em>ASTRA.</em></h2>
          <p className="contact-copy">For defense procurement, product briefings, institutional drone labs, or custom payload engineering, connect directly with our team.</p>
          <div className="contact-badge-box">
            <ShieldCheck className="shield-icon" />
            <span>High-Security Defence Clearance &amp; NDAs Supported</span>
          </div>
        </div>
        <div className="contact-details">
          <div className="contact-cards">
            <a className="contact-card-link" href="tel:+916239663762" data-testid="link-contact-phone">
              <span className="contact-icon-box"><Phone aria-hidden="true" /></span>
              <div className="contact-card-text">
                <span className="contact-card-label">Direct Phone Line</span>
                <span className="contact-card-val">+91 62396 63762</span>
              </div>
            </a>
            <a className="contact-card-link" href="mailto:astradrobotics@gmail.com" data-testid="link-contact-email">
              <span className="contact-icon-box"><Mail aria-hidden="true" /></span>
              <div className="contact-card-text">
                <span className="contact-card-label">Official Email</span>
                <span className="contact-card-val">astradrobotics@gmail.com</span>
              </div>
            </a>
          </div>
          <div className="contact-address-card">
            <span className="contact-icon-box"><MapPin aria-hidden="true" /></span>
            <div className="contact-card-text">
              <span className="contact-card-label">Headquarters &amp; R&amp;D Facility</span>
              <span className="contact-card-val">307, Top Floor, Visvesvaraya Block, Indian Institute of Technology (IIT) Ropar, Rupnagar, Punjab 140001</span>
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
              <a href="#segments">Segments</a>
              <a href="#fleet">Drone Fleet</a>
              <a href="#about">About &amp; Recognition</a>
            </div>
            <div className="footer-column">
              <h3>Capabilities</h3>
              <a href="#interceptor">Defence Interceptor</a>
              <a href="#fleet">Commercial Solutions</a>
              <a href="#drone-lab">Drone Lab Infrastructure</a>
              <a href="#contact">Custom Payloads</a>
              <a href="#contact">Field Training</a>
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
              <a href="#contact">Security Briefings</a>
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
        <section className="mission-band" id="mission">
          <div className="container">
            <span className="mission-mark" aria-hidden="true" />
            <p>
              ASTRA Drones &amp; Robotics Solutions is an Indian deep-tech defense enterprise designing sovereign, field-ready UAV systems. We eliminate dependency on foreign supply chains through modular hardware, indigenous flight algorithms, and mission-tested reliability.
            </p>
          </div>
        </section>
        <Segments />
        <Fleet />
        <Interceptor />
        <DroneLab />
        <Recognition />
        <StoryTiles />
        <Contact />
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