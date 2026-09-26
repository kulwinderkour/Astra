import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Award, Shield, Cpu, Mountain, Radio, Zap, Box, CheckCircle2 } from 'lucide-react';

export interface RecognitionItem {
  id: string;
  number: string;
  tag: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  location: string;
  partner: string;
  statLabel: string;
  statValue: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const recognitionData: RecognitionItem[] = [
  {
    id: 'punjab-conclave',
    number: '01',
    tag: 'GOVERNMENT RECOGNITION',
    category: 'STATE AWARD',
    title: 'Startup Punjab Conclave',
    subtitle: 'Chief Minister Innovation Commendation',
    description:
      'The Hon’ble Chief Minister of Punjab appreciated ASTRA for pioneering indigenous drone manufacturing, high-reliability UAV avionics, and advancing sovereign aerospace engineering.',
    image: 'award-startup-punjab.jpg',
    badge: 'CM APPRECIATION',
    location: 'Chandigarh / Punjab',
    partner: 'Government of Punjab',
    statLabel: 'INDIGENOUS CONTENT',
    statValue: '100% DESIGNED IN INDIA',
    icon: Award,
  },
  {
    id: 'indian-army',
    number: '02',
    tag: 'DEFENCE COLLABORATION',
    category: 'TACTICAL DEPLOYMENT',
    title: 'Indian Army Tactical Workshop',
    subtitle: 'Field-Ready Systems & Operational Training',
    description:
      'Conducted high-intensity tactical drone workshops and operational demonstrations for Indian Army personnel, delivering robust combat UAV platforms engineered for harsh field environments.',
    image: 'award-indian-army.jpg',
    badge: 'MILITARY FIELD VALIDATION',
    location: 'Forward Command Units',
    partner: 'Indian Armed Forces',
    statLabel: 'FIELD READINESS',
    statValue: 'COMBAT TESTED',
    icon: Shield,
  },
  {
    id: 'iit-ropar',
    number: '03',
    tag: 'DEEP TECH INCUBATION',
    category: 'R&D ACCELERATION',
    title: 'IIT Ropar Incubation Facility',
    subtitle: 'Visvesvaraya Block Advanced Robotics Lab',
    description:
      'Operating out of IIT Ropar’s deep-tech incubator to engineer sovereign flight controllers, AI vision edge computing, and modular aerospace airframes with world-class faculty and facilities.',
    image: 'recognition-iit-ropar.jpg',
    badge: 'INSTITUTIONAL INCUBATION',
    location: 'IIT Ropar, Visvesvaraya Block',
    partner: 'DST & IIT Ropar',
    statLabel: 'R&D VALIDATION',
    statValue: 'IIT ROPAR INCUBATED',
    icon: Cpu,
  },
  {
    id: 'high-altitude',
    number: '04',
    tag: 'EXTREME ENVIRONMENT',
    category: 'HIGH-ALTITUDE TRIALS',
    title: 'Border & Mountain Trials',
    subtitle: 'Sub-Zero High Altitude Endurance',
    description:
      'Rigorous flight endurance and telemetry tests conducted in severe sub-zero mountain conditions, proving exceptional lift, battery thermal stability, and encrypted video link integrity.',
    image: 'recognition-high-altitude.jpg',
    badge: 'SUB-ZERO ENDURANCE',
    location: 'Himalayan Ridge Line',
    partner: 'Defence Field Trials',
    statLabel: 'OPERATING CEILING',
    statValue: '15,000+ FT AMSL',
    icon: Mountain,
  },
  {
    id: 'ew-combat',
    number: '05',
    tag: 'ELECTRONIC COUNTERMEASURES',
    category: 'ANTI-JAM EW',
    title: 'Anti-Jam Telemetry Testing',
    subtitle: 'Dense RF Jamming Environment Resistance',
    description:
      'Validated frequency-hopping spread spectrum algorithms and optical fiber tethered links that maintain 100% command-and-control even under active electronic warfare jamming.',
    image: 'recognition-ew-combat.jpg',
    badge: 'EW-HARDENED LINK',
    location: 'Tactical EW Testing Range',
    partner: 'Aero Electronic Warfare Cell',
    statLabel: 'JAM RESISTANCE',
    statValue: 'ZERO-PACKET LOSS',
    icon: Radio,
  },
  {
    id: 'tactical-fpv',
    number: '06',
    tag: 'PRECISION STRIKE',
    category: 'FPV PLATFORMS',
    title: 'Tactical FPV Rapid Interceptor',
    subtitle: 'Ultra-Low Latency Close-Quarter ISR',
    description:
      'High-speed, agile multi-rotor platforms capable of 140+ km/h burst maneuvers, engineered for CQB reconnaissance, trench clearance, and high-precision loitering interception.',
    image: 'drone1.png',
    badge: '140+ KM/H SPRINT',
    location: 'Outdoor Piloting Rigs',
    partner: 'Special Operations Units',
    statLabel: 'CONTROL LATENCY',
    statValue: '< 18MS DIGITAL LINK',
    icon: Zap,
  },
  {
    id: 'heavy-logistics',
    number: '07',
    tag: 'AUTONOMOUS LOGISTICS',
    category: 'HEAVY PAYLOAD',
    title: 'Heavy-Lift Autonomous Delivery',
    subtitle: 'Forward Node Autonomous Resupply',
    description:
      'Autonomous heavy-lift transport system designed to deliver medical cargo, critical spare parts, and ammunition crates across inaccessible terrain without risking pilot lives.',
    image: 'drone2.png',
    badge: 'HEAVY CARGO AIRLIFT',
    location: 'Logistic Test Corridors',
    partner: 'Disaster & Defence Logistics',
    statLabel: 'PAYLOAD CAPACITY',
    statValue: 'MODULAR PAYLOAD BAYS',
    icon: Box,
  },
];

export function CurvedRecognition() {
  const sceneContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0); // Floating continuous card index
  const scrollPosRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  
  // Radius and angle step for 3D cylinder
  const radius = isMobile ? 420 : isTablet ? 650 : 880;
  const angleStepDeg = isMobile ? 26 : isTablet ? 20 : 16;
  const angleStepRad = (angleStepDeg * Math.PI) / 180;
  // Drag sensitivity (px per card unit)
  const dragSensitivity = isMobile ? 180 : 250;

  // Sync state with ref
  const setPosition = useCallback((newPos: number) => {
    scrollPosRef.current = newPos;
    setScrollPos(newPos);
  }, []);

  // Momentum decay loop after release / wheel flick
  const startMomentum = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const decay = () => {
      if (Math.abs(velocityRef.current) > 0.001) {
        setPosition(scrollPosRef.current + velocityRef.current);
        velocityRef.current *= 0.92; // Smooth friction
        animFrameRef.current = requestAnimationFrame(decay);
      } else {
        velocityRef.current = 0;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(decay);
  }, [setPosition]);

  // Handle Wheel / Horizontal trackpad events
  useEffect(() => {
    const container = sceneContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If user scrolls horizontally or uses shift+wheel or normal wheel over the carousel
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 1) {
        // Prevent default vertical scrolling when user is scrolling the 3D carousel horizontally
        if (isHorizontal || e.shiftKey || Math.abs(e.deltaY) > 0) {
          e.preventDefault();
        }
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }

        const deltaUnits = delta / dragSensitivity;
        velocityRef.current = deltaUnits * 0.15;
        setPosition(scrollPosRef.current + deltaUnits);
        startMomentum();
      }
    };

    // Attach non-passive wheel listener
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [dragSensitivity, setPosition, startMomentum]);

  // Pointer / Touch Swipe Handling
  const pointerStartRef = useRef<{ x: number; time: number; lastX: number; lastTime: number }>({
    x: 0,
    time: 0,
    lastX: 0,
    lastTime: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    isInteractingRef.current = true;
    const now = performance.now();
    pointerStartRef.current = {
      x: e.clientX,
      time: now,
      lastX: e.clientX,
      lastTime: now,
    };
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteractingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - pointerStartRef.current.lastX;
    const dt = Math.max(1, now - pointerStartRef.current.lastTime);

    // Track instantaneous release velocity
    const v = -(dx / dragSensitivity) * (16 / dt);
    velocityRef.current = velocityRef.current * 0.4 + v * 0.6;

    pointerStartRef.current.lastX = e.clientX;
    pointerStartRef.current.lastTime = now;

    const deltaUnits = -dx / dragSensitivity;
    setPosition(scrollPosRef.current + deltaUnits);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    startMomentum();
  };

  // Compute active centered card index (wrapped [0, N-1])
  const N = recognitionData.length;
  const rawCenter = Math.round(scrollPos) % N;
  const activeIndex = (rawCenter + N) % N;
  const activeItem = recognitionData[activeIndex] || recognitionData[0];

  return (
    <section
      className="curved-recognition-section"
      id="about"
      aria-label="ASTRA Proof and Recognition Infinite 3D Curved Horizontal Slider"
    >
      {/* Background Visual Atmosphere */}
      <div className="curved-bg-radial" aria-hidden="true" />
      <div className="curved-bg-grid" aria-hidden="true" />

      <div className="container">
        {/* Section Heading with generous bottom spacing */}
        <div className="curved-header section-heading">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">PROOF &amp; RECOGNITION</span>
              <h2 className="section-title">
                PROVEN IN THE <em>FIELD.</em>
              </h2>
            </div>
            <div className="curved-header-right">
              <p className="section-intro">
                Validated by defence forces, government bodies, and premier technical institutions across operational field trials.
              </p>
              <div className="curved-scroll-cue">
                <span className="scroll-cue-arrow">←</span>
                <span className="scroll-cue-text">HORIZONTAL SCROLL TO EXPLORE 3D ARC</span>
                <span className="scroll-cue-arrow">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Horizontal 3D Perspective Stage */}
        <div
          ref={sceneContainerRef}
          className="curved-3d-scene"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="region"
          aria-label="Horizontal infinite 3D curved image wall. Scroll horizontally with trackpad or mouse wheel."
          tabIndex={0}
        >
          {/* Subtle 3D Horizon Arc Line */}
          <div className="curved-arc-horizon" aria-hidden="true" />

          {/* 3D Track */}
          <div className="curved-3d-track">
            {recognitionData.map((item, index) => {
              // Calculate shortest wrapped difference from current continuous scroll position
              let diff = (index - (scrollPos % N));
              while (diff < -N / 2) diff += N;
              while (diff >= N / 2) diff -= N;

              const absDiff = Math.abs(diff);

              // Cylindrical 3D math
              const theta = diff * angleStepRad;
              const xPos = radius * Math.sin(theta);
              const zPos = radius * (Math.cos(theta) - 1) + 60; // Center card projects forward (+60px)
              const rotY = -diff * (angleStepDeg * 1.08); // Inward facing towards center camera
              const yPos = Math.pow(absDiff, 1.7) * 4.5; // Natural subtle panoramic arc
              const scale = Math.max(0.68, 1.0 - absDiff * 0.08);

              // Fade out smoothly when card moves into back half of the 3D cylinder
              const isCulled = absDiff > 3.4;
              const opacity = isCulled ? 0 : Math.max(0, 1.0 - (absDiff / 3.2) * 0.55);
              const brightness = Math.max(0.65, 1.0 - absDiff * 0.1);
              const zIndex = Math.round(100 - absDiff * 10);
              const isCenter = absDiff < 0.45;

              return (
                <div
                  key={item.id}
                  className={`curved-3d-card-wrapper ${isCenter ? 'is-active-card' : ''} ${isCulled ? 'is-culled' : ''}`}
                  style={{
                    transform: `translate3d(${xPos}px, ${yPos}px, ${zPos}px) rotateY(${rotY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    filter: `brightness(${brightness}) drop-shadow(0 ${15 + (1 - Math.min(1, absDiff * 0.2)) * 25}px ${25 + (1 - Math.min(1, absDiff * 0.2)) * 30}px rgba(0,0,0,0.85))`,
                  }}
                  data-testid={`card-recognition-${item.id}`}
                >
                  <div className="curved-card-inner">
                    {/* Corner Tech Accents */}
                    <div className="curved-tech-bracket top-left" aria-hidden="true" />
                    <div className="curved-tech-bracket top-right" aria-hidden="true" />
                    <div className="curved-tech-bracket bottom-left" aria-hidden="true" />
                    <div className="curved-tech-bracket bottom-right" aria-hidden="true" />

                    {/* Image Layer */}
                    <div className="curved-card-media">
                      <img
                        src={`/assets/images/${item.image}`}
                        alt={item.title}
                        className="curved-card-img"
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="curved-card-scrim" aria-hidden="true" />
                    </div>

                    {/* Card Header */}
                    <div className="curved-card-header">
                      <span className="curved-card-num">{item.number}</span>
                      <span className="curved-card-badge">{item.badge}</span>
                    </div>

                    {/* Card Footer */}
                    <div className="curved-card-footer">
                      <span className="curved-card-category">{item.category}</span>
                      <h3 className="curved-card-title">{item.title}</h3>
                    </div>

                    {/* Active Halo on center card */}
                    {isCenter && <div className="curved-active-halo" aria-hidden="true" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Card Intelligence Dock (Seamlessly synchronized with horizontal scroll) */}
        <div className="curved-meta-dock">
          <div className="curved-meta-panel" key={activeItem.id}>
            <div className="curved-meta-main">
              <div className="curved-meta-title-group">
                <div className="curved-meta-tag-row">
                  <span className="meta-tag-pill">{activeItem.category}</span>
                  <span className="meta-loc-label">
                    <CheckCircle2 className="meta-verified-icon" /> {activeItem.location}
                  </span>
                  <span className="meta-seq-num">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="meta-primary-title">{activeItem.title}</h3>
                <h4 className="meta-sub-title">{activeItem.subtitle}</h4>
              </div>
              <p className="meta-description-text">{activeItem.description}</p>
            </div>

            <div className="curved-meta-specs">
              <div className="meta-spec-block">
                <span className="meta-spec-label">STAKEHOLDER / CLIENT</span>
                <span className="meta-spec-val">{activeItem.partner}</span>
              </div>
              <div className="meta-spec-block">
                <span className="meta-spec-label">{activeItem.statLabel}</span>
                <span className="meta-spec-val highlight">{activeItem.statValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
