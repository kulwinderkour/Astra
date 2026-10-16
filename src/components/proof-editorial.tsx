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
    tag: '01 / FIELD VALIDATION',
    telemetry: 'LAT 30.9894° N // ELEV 260M',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM.jpeg',
    alt: 'ASTRA UAV tactical multirotor deployment and field validation',
    caption: 'Indigenous tactical multirotor platform undergoing rigorous flight endurance, sensor payload calibration, and telemetry validation in field environments.',
  },
  {
    id: '02',
    tag: '02 / INSTITUTIONAL',
    telemetry: 'DST GOVT OF INDIA // DEEP-TECH',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM (1).jpeg',
    alt: 'Technology Development Board Department of Science and Technology pitch session',
    caption: 'ASTRA presenting sovereign aerospace platforms and autonomous defense robotics during the Technology Development Board 30th Foundation national session.',
  },
  {
    id: '03',
    tag: '03 / STRATEGIC ALLIANCE',
    telemetry: 'MOU SIGNING // DEFENCE LABS',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM (2).jpeg',
    alt: 'MoU signing for drone robotics laboratory and training academy',
    caption: 'Bilateral agreement formalizing advanced robotics lab establishment and tactical pilot curriculum with Sandeepni Gurukul.',
  },
  {
    id: '04',
    tag: '04 / DEFENCE BRIEFING',
    telemetry: 'INDIAN ARMY // COMMAND EVALUATION',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.39 AM.jpeg',
    alt: 'Senior Indian Army command technical briefing on sovereign UAVs',
    caption: 'Technical review of sovereign fixed-wing and hybrid VTOL tactical reconnaissance UAVs with senior Indian Army commanders.',
  },
  {
    id: '05',
    tag: '05 / COUNTER-UAS',
    telemetry: 'AVIONICS RIG // HIGH-VELOCITY',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.39 AM (1).jpeg',
    alt: 'Indian Army officer inspecting high-velocity kinetic interceptor prototype',
    caption: "Military leadership inspecting ASTRA's high-speed interceptor prototype engineered for contested airspace interdiction and swarm neutralization.",
  },
  {
    id: '06',
    tag: '06 / SOVEREIGN AVIONICS',
    telemetry: 'SECURE LINK // TELEM ACTIVE',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.41 AM.jpeg',
    alt: 'Detailed evaluation of tactical UAV airframe and avionics',
    caption: 'Demonstration of encrypted telemetry links, rapid-swap payload bays, and sovereign flight computer architecture for defense deployments.',
  },
  {
    id: '07',
    tag: '07 / R&D VALIDATION',
    telemetry: 'IIT ROPAR LABS // DEFENCE VISIT',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.41 AM (1).jpeg',
    alt: 'Defence delegation visit to Astra R&D facility at IIT Ropar',
    caption: 'Armed forces delegation conducting technical inspections of multi-role UAV platforms and autonomous navigation telemetry at the ASTRA lab.',
  },
  {
    id: '08',
    tag: '08 / JOINT SERVICES',
    telemetry: 'ARMY & AIR FORCE // FLIGHT DECK',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.42 AM.jpeg',
    alt: 'Tri-service demonstration to Indian Army and Indian Air Force officers',
    caption: "Joint military delegation examining ASTRA's aerodynamic airframe geometry, low radar cross-section profiles, and tactical flight readiness.",
  },
  {
    id: '09',
    tag: '09 / FIELD CAPACITY',
    telemetry: 'FIELD WORKSHOP // NATIONAL DEFENCE',
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.44 AM.jpeg',
    alt: 'Armed forces operational drone workshop and technical training session',
    caption: 'Specialized training workshop and technical briefing conducted for Indian Army and Air Force personnel on next-generation UAV deployment.',
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
