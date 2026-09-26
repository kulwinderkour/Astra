import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Check, Mail, MapPin, Menu, Phone, RotateCcw, X } from 'lucide-react';
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
  ['FPV Drone', 'High-speed, agile, low-latency', imageFiles.fpv],
  ['Unjamable Drone', 'Secure, jam-resistant, long-range', imageFiles.unjamable],
  ['Logistics Drone', 'Heavy-lift, autonomous, reliable', imageFiles.logistics],
  ['Surveillance Drone', 'Day and night reconnaissance with real-time intelligence', imageFiles.surveillance],
  ['Kamikaze Drone', 'Precision strike with autonomous navigation', imageFiles.kamikaze],
  ['VTOL Drone', 'Vertical take-off, long range, ideal for mapping and ISR', imageFiles.vtol],
  ['Fiber Optic Drone', 'Unbroken, high-bandwidth link for critical missions', imageFiles.fiber],
  ['Training Drone', 'Durable, crash-resistant, indoor and outdoor use', imageFiles.training],
];

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
  const nav = [['Segments', '#segments'], ['Products', '#fleet'], ['Interceptor', '#interceptor'], ['Drone Lab', '#drone-lab'], ['About', '#about']];
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
            {nav.map(([label, href]) => <a href={href} key={href} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
          </nav>
          <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
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
      <a className="explore-link" href="#mission" data-testid="link-explore">Scroll down <ChevronDown /></a>
    </section>
  );
}

function Segments() {
  return (
    <section className="segments" id="segments">
      <div className="container">
        <SectionHeading eyebrow="Our segments" title={<>Built for <em>consequence.</em></>} intro="From contested airspace to critical infrastructure, ASTRA builds dependable systems for the work that cannot wait." light />
        <div className="segment-grid">
          <article className="segment-card">
            <div className="image-frame segment-image"><AssetImage file={imageFiles.defence} alt="Defence UAV platform" /></div>
            <div className="segment-copy"><h3>Defence</h3><p>Combat-ready UAV platforms for tactical and strategic missions.</p><a className="outline-link" href="#interceptor" data-testid="link-defence-systems">See defence systems</a></div>
          </article>
          <article className="segment-card">
            <div className="image-frame segment-image"><AssetImage file={imageFiles.commercial} alt="Commercial inspection drone" /></div>
            <div className="segment-copy"><h3>Commercial</h3><p>Surveillance, mapping and inspection for enterprises.</p><a className="outline-link" href="#fleet" data-testid="link-commercial-systems">See commercial systems</a></div>
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
          <div><span className="eyebrow">Our fleet</span><h2 className="section-title">Mission <em>ready.</em></h2></div>
          <p className="section-intro">A modular family of platforms designed, assembled and supported in India.</p>
        </div>
        <div className="fleet-grid">
          {fleet.map(([name, detail, file]) => (
            <article key={name} data-testid={`card-fleet-${name.toLowerCase().replaceAll(' ', '-')}`}>
              <div className="image-frame fleet-image"><AssetImage file={file} alt={`${name} from ASTRA`} /></div>
              <div className="fleet-label"><h3>{name}</h3><p>{detail}</p></div>
            </article>
          ))}
        </div>
        <div className="fleet-callout"><p>Need custom battery packs or a mission-specific build?</p><a href="#contact" data-testid="link-talk-engineers">Talk to our engineers</a></div>
      </div>
    </section>
  );
}

function Interceptor() {
  const specs = [['Role', 'Counter-UAV operations'], ['Handling', 'High agility and speed'], ['Guidance', 'Real-time target tracking'], ['Build', 'Designed and made in India']];
  return (
    <section className="interceptor" id="interceptor">
      <div className="image-frame interceptor-image"><AssetImage file={imageFiles.interceptor} alt="ASTRA interceptor drone" /></div>
      <div className="interceptor-copy">
        <span className="eyebrow">Featured platform</span><h2 className="section-title">Interceptor <em>Drone</em></h2>
        <p className="lead">A vertical-launch counter-UAV platform built to find, track and neutralise hostile drones.</p>
        <dl className="spec-grid">{specs.map(([label, value]) => <div className="spec" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <a className="button-primary" href="#contact" data-testid="link-request-briefing">Request a briefing</a>
      </div>
    </section>
  );
}

function DroneLab() {
  const items = ['Lab design, equipment and installation', 'Hands-on workshops and FPV flight training', 'Curriculum for build, code and fly', 'Ongoing technical support'];
  return (
    <section className="lab" id="drone-lab">
      <div className="lab-copy"><span className="eyebrow">Institutional capability</span><h2 className="section-title">Set up a <em>drone lab.</em></h2><p>We build drone and robotics labs inside schools, colleges and institutions, then train students and staff to run them.</p><ul className="checklist">{items.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><a className="button-primary" href="#contact" data-testid="link-plan-lab">Plan your lab</a></div>
      <div className="image-frame lab-image"><AssetImage file={imageFiles.lab} alt="Students working in an ASTRA drone lab" /></div>
    </section>
  );
}

function Recognition() {
  const awards = [['2026', 'Startup Punjab Conclave', 'The Chief Minister of Punjab appreciated ASTRA for indigenous innovation and excellence in UAV technology.', imageFiles.startup, 'Startup Punjab'], ['Indian Army', 'Workshop and delivery', 'ASTRA ran a drone workshop and delivered high-performance drones to the Indian Army.', imageFiles.army, 'Indian Army']];
  return (
    <section className="recognition" id="about">
      <div className="container"><SectionHeading eyebrow="Reward & recognition" title={<>Proof in the <em>field.</em></>} />
        <div className="recognition-grid">{awards.map(([tag, title, text, file, alt]) => <article className="award-card" key={title}><div className="image-frame award-image"><AssetImage file={file} alt={alt} /></div><span className="award-tag">{tag}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>
  );
}

function StoryTiles() {
  const tiles = [['Who we are', 'Our Mission', imageFiles.mission, '#about'], ['Learn to build and fly', 'Training', imageFiles.tileTraining, '#drone-lab'], ['Work with us', 'Contact', imageFiles.contact, '#contact']];
  return <section className="story-tiles">{tiles.map(([kicker, title, file, href]) => <article className="story-tile" key={title}><div className="image-frame"><AssetImage file={file} alt={title} /></div><div className="story-copy"><span className="story-kicker">{kicker}</span><h3>{title}</h3><a href={href} data-testid={`link-story-${title.toLowerCase()}`}>Explore</a></div></article>)}</section>;
}

function Contact() {
  return (
    <section className="contact-band" id="contact">
      <div className="container contact-layout"><div><span className="eyebrow">Start a conversation</span><h2 className="section-title">Talk to <em>ASTRA.</em></h2><p className="contact-copy">For product briefings, drone labs or custom builds, call or write to us.</p></div>
        <div><div className="contact-links"><a className="contact-link" href="tel:+916239663762" data-testid="link-contact-phone"><Phone aria-hidden="true" /> +91 62396 63762</a><a className="contact-link" href="mailto:astradrobotics@gmail.com" data-testid="link-contact-email"><Mail aria-hidden="true" /> astradrobotics@gmail.com</a></div><p className="contact-address"><MapPin aria-hidden="true" />307, Top Floor, Visvesvaraya Block, Indian Institute of Technology Ropar, Rupnagar, Punjab 140001</p></div>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><a className="brand" href="#top" data-testid="link-footer-brand"><AssetImage file={imageFiles.logo} alt="ASTRA logo" className="brand-mark" /><span className="brand-lockup"><span className="brand-name">ASTRA</span><span className="brand-sub">DROBOTICS</span></span></a><div className="footer-motto">राष्ट्रबलस्य मूलं स्वदेशी विज्ञानम्।</div><p className="footer-about">Made-in-India drones and robotic systems for defence, disaster response, surveillance and industry.</p></div><div className="footer-columns"><div className="footer-column"><h3>Quick links</h3><a href="#about">About Us</a><a href="#segments">Our Segments</a><a href="#fleet">Products</a></div><div className="footer-column"><h3>Segments</h3><a href="#interceptor">Defence Drones</a><a href="#fleet">Commercial Drones</a><a href="#drone-lab">Drone Lab</a></div><div className="footer-column"><h3>Get in touch</h3><a href="tel:+916239663762">+91 62396 63762</a><a href="mailto:astradrobotics@gmail.com">astradrobotics@gmail.com</a></div></div></div><div className="footer-bottom"><span>© 2026 Astra Drones and Robotics Solutions Pvt. Ltd. All rights reserved.</span><span className="legal-links"><a href="#top">Privacy</a><a href="#top">Terms</a></span></div></div></footer>;
}

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="astra-page"><Header scrolled={scrolled} /><main><Hero /><section className="mission-band" id="mission"><div className="container"><span className="mission-mark" aria-hidden="true" /><p>ASTRA Drones &amp; Robotics Solutions is an Indian deep-tech company that designs and builds Made-in-India drones and robotic systems for defence, disaster response, surveillance and industry. We reduce dependence on imported UAVs with affordable, modular, field-ready systems and local support.</p></div></section><Segments /><Fleet /><Interceptor /><DroneLab /><Recognition /><StoryTiles /><Contact /></main><Footer /></div>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><LandingPage /></ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;