import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { CurvedCarousel } from './curved-carousel';

interface ProofItem {
  id: string;
  tag: string;
  telemetry: string;
  src: string;
  alt: string;
  caption: string;
}

const proofImages: ProofItem[] = [
  {
    id: '01',
    tag: '01 / FIELD PROOF',
    telemetry: 'LAT 30.9664° N // ELEV 260M',
    src: '/assets/images/image1.png',
    alt: 'ASTRA UAV tactical field demonstration and deployment proof',
    caption: 'Indigenous UAV platform undergoing rigorous operational validation in contested field conditions.',
  },
  {
    id: '02',
    tag: '02 / SYSTEM DEVELOPMENT',
    telemetry: 'AVIONICS RIG // TELEM ACTIVE',
    src: '/assets/images/image2.png',
    alt: 'ASTRA advanced system development and hardware integration',
    caption: 'Full-stack embedded hardware and low-latency digital link engineering.',
  },
  {
    id: '03',
    tag: '03 / ENGINEERING',
    telemetry: 'R&D FACILITY // ROPAR',
    src: '/assets/images/image3.png',
    alt: 'ASTRA engineering laboratory and airframe fabrication',
    caption: 'Precision CAD airframe fabrication and carbon-composite structural assembly.',
  },
  {
    id: '04',
    tag: '04 / OPERATIONS',
    telemetry: 'TACTICAL OPS // FLIGHT DECK',
    src: '/assets/images/image4.png',
    alt: 'ASTRA tactical flight operations and ground telemetry control',
    caption: 'Long-range secure command-and-control telemetry stations in live operation.',
  },
  {
    id: '05',
    tag: '05 / DEPLOYMENT',
    telemetry: 'FIELD READY // MIL-SPEC',
    src: '/assets/images/image5.png',
    alt: 'ASTRA sovereign drone deployment and defense handoff',
    caption: 'Mission-ready payload delivery and sovereign operational deployment.',
  },
];

export function ProofEditorial() {

  return (
    <section className="proof-editorial" id="about" aria-labelledby="proof-title">
      {/* Blueprint & technical background matrix */}
      <div className="proof-bg-grid" aria-hidden="true" />
      <div className="proof-bg-vignette" aria-hidden="true" />

      <div className="container proof-container">
        {/* Editorial Section Introduction */}
        <header className="proof-intro">
          <div className="proof-intro-meta">
            <span className="proof-eyebrow">WHO WE ARE</span>
            <span className="proof-code" aria-hidden="true">SEC. 04 / SOVEREIGN AEROSPACE</span>
          </div>

          <div className="proof-heading-lockup">
            <h2 className="proof-title" id="proof-title">
              PROOF IN THE <span className="proof-title-accent">FIELD.</span>
            </h2>
            <p className="proof-lead">
              ASTRA engineers indigenous unmanned aerial systems, counter-UAV interceptors, and tactical robotics built to withstand contested airspace. Field-tested, military-validated, and deployed with national institutions.
            </p>
          </div>

          <div className="proof-rule-line" aria-hidden="true">
            <span className="proof-rule-tick" />
            <span className="proof-rule-diamond" />
          </div>
        </header>

        {/* 3D Curved Carousel Gallery */}
        <CurvedCarousel />

        {/* Citations & Institutional Field Validation */}
        <div className="proof-citations" aria-label="Institutional recognition">
          <div className="citation-block">
            <span className="citation-tag">2026 // PUNJAB STARTUP CONCLAVE</span>
            <p className="citation-text">
              The Chief Minister of Punjab appreciated ASTRA for indigenous innovation and excellence in UAV technology.
            </p>
          </div>
          <div className="citation-block">
            <span className="citation-tag">FIELD DEPLOYMENT // INDIAN ARMY</span>
            <p className="citation-text">
              ASTRA conducted tactical drone workshops and delivered high-performance, field-ready UAV systems to the Indian Army.
            </p>
          </div>
        </div>

        {/* Three-Pillar Lower Editorial Grid */}
        <div className="proof-pillars" id="contact" role="region" aria-label="Capabilities and contact">
          {/* COLUMN 01 */}
          <article className="pillar-column">
            <div className="pillar-header">
              <span className="pillar-diamond" aria-hidden="true" />
              <span className="pillar-index">01</span>
              <span className="pillar-meta">SOVEREIGN ARCHITECTURE</span>
            </div>
            <div className="pillar-divider" aria-hidden="true" />
            <h3 className="pillar-title">OUR MISSION</h3>
            <p className="pillar-kicker">Learn to build and fly</p>
            <p className="pillar-copy">
              We engineer sovereign drone platforms and autonomous robotics in India, reducing reliance on imported UAVs through field-proven, modular, and unjamable deep-tech systems.
            </p>
            <a
              href="#aerial-systems"
              className="editorial-explore"
              aria-label="Explore Our Mission"
              data-testid="link-story-our-mission"
            >
              <span>EXPLORE</span>
              <ArrowRight className="explore-arrow" aria-hidden="true" />
            </a>
          </article>

          {/* COLUMN 02 */}
          <article className="pillar-column">
            <div className="pillar-header">
              <span className="pillar-diamond" aria-hidden="true" />
              <span className="pillar-index">02</span>
              <span className="pillar-meta">INSTITUTIONAL CAPACITY</span>
            </div>
            <div className="pillar-divider" aria-hidden="true" />
            <h3 className="pillar-title">TRAINING</h3>
            <p className="pillar-kicker">Work with us</p>
            <p className="pillar-copy">
              We design and establish state-of-the-art drone and robotics labs inside colleges, defense schools, and research institutions, training pilots and engineers in embedded coding and flight telemetry.
            </p>
            <a
              href="#drone-lab"
              className="editorial-explore"
              aria-label="Explore Training and Labs"
              data-testid="link-story-training"
            >
              <span>EXPLORE</span>
              <ArrowRight className="explore-arrow" aria-hidden="true" />
            </a>
          </article>

          {/* COLUMN 03 */}
          <article className="pillar-column pillar-contact">
            <div className="pillar-header">
              <span className="pillar-diamond" aria-hidden="true" />
              <span className="pillar-index">03</span>
              <span className="pillar-meta">DEFENCE BRIEFINGS &amp; HQ</span>
            </div>
            <div className="pillar-divider" aria-hidden="true" />
            <h3 className="pillar-title">CONTACT</h3>
            <p className="pillar-kicker">Start a conversation</p>
            <div className="pillar-contact-details">
              <a
                className="pillar-contact-row"
                href="tel:+916239663762"
                data-testid="link-contact-phone"
              >
                <Phone className="pillar-icon" aria-hidden="true" />
                <span>+91 62396 63762</span>
              </a>
              <a
                className="pillar-contact-row"
                href="mailto:astradrobotics@gmail.com"
                data-testid="link-contact-email"
              >
                <Mail className="pillar-icon" aria-hidden="true" />
                <span>astradrobotics@gmail.com</span>
              </a>
              <div className="pillar-contact-row pillar-address">
                <MapPin className="pillar-icon" aria-hidden="true" />
                <span>307, Top Floor, Visvesvaraya Block, Indian Institute of Technology Ropar, Rupnagar, Punjab 140001</span>
              </div>
            </div>
            <a
              href="mailto:astradrobotics@gmail.com"
              className="editorial-explore"
              aria-label="Contact ASTRA Engineers"
              data-testid="link-story-contact"
            >
              <span>EXPLORE</span>
              <ArrowRight className="explore-arrow" aria-hidden="true" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
