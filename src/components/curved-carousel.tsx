import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export interface CarouselSlide {
  src: string;
  chipLeft: string;
  chipRight: string;
  title: string;
  subtitle: string;
  caption: string;
}

/**
 * 5 Slides data array - editable at top of component as requested.
 * Slide order preserved:
 * 1. Army drone demo at sunset (01 / FIELD PROOF)
 * 2. Punjab State Technology Award (02 / SYSTEM DEVELOPMENT)
 * 3. UCAV sensor integration in the hangar
 * 4. ADRAL Lab, IIT Ropar
 * 5. High-altitude tactical drone over snow
 */
export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM.jpeg',
    chipLeft: '01 / FIELD VALIDATION',
    chipRight: 'LAT 30.9894° N // ELEV 260M',
    title: 'Tactical Multirotor Deployment',
    subtitle: 'Autonomous payload validation in field conditions',
    caption: 'Indigenous tactical multirotor platform undergoing rigorous flight endurance, sensor payload calibration, and telemetry validation in field environments.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM (1).jpeg',
    chipLeft: '02 / INSTITUTIONAL',
    chipRight: 'DST GOVT OF INDIA // DEEP-TECH',
    title: 'TDB National Deep-Tech Pitch',
    subtitle: 'Department of Science & Technology, Govt. of India',
    caption: 'ASTRA presenting sovereign aerospace platforms and autonomous defense robotics during the Technology Development Board 30th Foundation national session.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.38 AM (2).jpeg',
    chipLeft: '03 / STRATEGIC ALLIANCE',
    chipRight: 'MOU SIGNING // DEFENCE LABS',
    title: 'Aerospace Academy MoU Signing',
    subtitle: 'Institutional robotics lab & training initiative',
    caption: 'Bilateral agreement formalizing advanced robotics lab establishment and tactical pilot curriculum with Sandeepni Gurukul.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.39 AM.jpeg',
    chipLeft: '04 / DEFENCE BRIEFING',
    chipRight: 'INDIAN ARMY // COMMAND EVALUATION',
    title: 'Armed Forces Technical Evaluation',
    subtitle: 'Briefing senior army leadership on indigenous airframes',
    caption: 'Technical review of sovereign fixed-wing and hybrid VTOL tactical reconnaissance UAVs with senior Indian Army commanders.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.39 AM (1).jpeg',
    chipLeft: '05 / COUNTER-UAS',
    chipRight: 'AVIONICS RIG // HIGH-VELOCITY',
    title: 'Kinetic Interceptor Airframe Review',
    subtitle: 'Close-quarters assessment of counter-drone hardware',
    caption: "Military leadership inspecting ASTRA's high-speed interceptor prototype engineered for contested airspace interdiction and swarm neutralization.",
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.41 AM.jpeg',
    chipLeft: '06 / SOVEREIGN AVIONICS',
    chipRight: 'SECURE LINK // TELEM ACTIVE',
    title: 'Tactical Drone Architecture Review',
    subtitle: 'Hands-on evaluation of sovereign flight systems',
    caption: 'Demonstration of encrypted telemetry links, rapid-swap payload bays, and sovereign flight computer architecture for defense deployments.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.41 AM (1).jpeg',
    chipLeft: '07 / R&D VALIDATION',
    chipRight: 'IIT ROPAR LABS // DEFENCE VISIT',
    title: 'Defence Delegation Lab Assessment',
    subtitle: 'Autonomous fleet demonstration at IIT Ropar R&D center',
    caption: 'Armed forces delegation conducting technical inspections of multi-role UAV platforms and autonomous navigation telemetry at the ASTRA lab.',
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.42 AM.jpeg',
    chipLeft: '08 / JOINT SERVICES',
    chipRight: 'ARMY & AIR FORCE // FLIGHT DECK',
    title: 'Tri-Service Tactical Demonstration',
    subtitle: 'Presentation to Indian Army & Indian Air Force leadership',
    caption: "Joint military delegation examining ASTRA's aerodynamic airframe geometry, low radar cross-section profiles, and tactical flight readiness.",
  },
  {
    src: '/assets/images/collabs/WhatsApp Image 2026-10-14 at 12.38.44 AM.jpeg',
    chipLeft: '09 / FIELD CAPACITY',
    chipRight: 'FIELD WORKSHOP // NATIONAL DEFENCE',
    title: 'Armed Forces Technical Workshop',
    subtitle: 'Capacity building & tactical drone workshop for defense personnel',
    caption: 'Specialized training workshop and technical briefing conducted for Indian Army and Air Force personnel on next-generation UAV deployment.',
  },
];

interface CurvedCarouselProps {
  slides?: CarouselSlide[];
}

export function CurvedCarousel({ slides = CAROUSEL_SLIDES }: CurvedCarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const [isGrabbed, setIsGrabbed] = useState(false);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex((index + totalSlides) % totalSlides);
  };

  // Autoplay every 5s unless hovered or prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || lightboxOpen || prefersReducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, lightboxOpen, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        return;
      }

      // If user is focused within or near the carousel
      if (document.activeElement && containerRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextSlide, prevSlide]);

  // Horizontal wheel / trackpad scroll listener:
  // When scrolling horizontally from left to right or right to left, move the carousel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulatedDeltaX = 0;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    let isCoolingDown = false;

    const handleWheel = (e: WheelEvent) => {
      const horizontalDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : (e.shiftKey ? e.deltaY : 0);

      if (Math.abs(horizontalDelta) > 12) {
        // Prevent browser horizontal back/forward navigation or jitter
        e.preventDefault();

        if (isCoolingDown) return;

        accumulatedDeltaX += horizontalDelta;

        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          accumulatedDeltaX = 0;
        }, 220);

        if (accumulatedDeltaX > 35) {
          nextSlide();
          accumulatedDeltaX = 0;
          isCoolingDown = true;
          setTimeout(() => {
            isCoolingDown = false;
          }, 350);
        } else if (accumulatedDeltaX < -35) {
          prevSlide();
          accumulatedDeltaX = 0;
          isCoolingDown = true;
          setTimeout(() => {
            isCoolingDown = false;
          }, 350);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 35;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse Drag Handlers (Desktop click & drag left/right)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // Don't drag if clicking buttons or range inputs
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    isDragging.current = true;
    dragStartX.current = e.clientX;
    setIsGrabbed(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    isDragging.current = false;
    setIsGrabbed(false);
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setIsGrabbed(false);
    setIsPaused(false);
  };

  // Helper to calculate circular distance and position
  const getSlidePosition = (index: number) => {
    let diff = (index - currentIndex) % totalSlides;
    if (diff < -Math.floor(totalSlides / 2)) diff += totalSlides;
    if (diff > Math.floor(totalSlides / 2)) diff -= totalSlides;
    return diff;
  };

  const activeSlide = slides[currentIndex];

  return (
    <div
      ref={containerRef}
      className={`curved-carousel-wrapper ${isGrabbed ? 'is-grabbed' : ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Field Proof 3D Curved Carousel"
    >
      {/* 3D Cylinder Stage */}
      <div className="curved-carousel-viewport">
        <div className="curved-carousel-stage">
          {slides.map((slide, index) => {
            const pos = getSlidePosition(index);
            const isCenter = pos === 0;
            const isLeft = pos === -1;
            const isRight = pos === 1;
            const isVisible = isCenter || isLeft || isRight;

            let posClass = 'slide-hidden';
            if (isCenter) posClass = 'slide-center';
            else if (isLeft) posClass = 'slide-left';
            else if (isRight) posClass = 'slide-right';

            return (
              <div
                key={slide.src}
                className={`curved-slide ${posClass}`}
                onClick={() => {
                  if (isLeft) prevSlide();
                  else if (isRight) nextSlide();
                  else if (isCenter) setLightboxOpen(true);
                }}
                aria-hidden={!isCenter}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={
                  isCenter
                    ? `${slide.title} - Click to expand`
                    : `Go to ${slide.title}`
                }
              >
                <div className="curved-slide-card">
                  {/* Subtle technical corner brackets */}
                  <span className="curved-corner curved-corner-tl" aria-hidden="true" />
                  <span className="curved-corner curved-corner-br" aria-hidden="true" />

                  {/* Main Slide Image */}
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="curved-slide-img"
                    loading="eager"
                  />

                  {/* Gradient side-fade vignette */}
                  <div className="curved-slide-vignette" aria-hidden="true" />

                  {/* Existing Chips (visible only on center slide) */}
                  <div className={`curved-chips ${isCenter ? 'is-visible' : ''}`}>
                    <span className="chip-left">{slide.chipLeft}</span>
                    <span className="chip-right">{slide.chipRight}</span>
                  </div>

                  {/* Center "View" Pill Hover Indicator */}
                  {isCenter && (
                    <div className="curved-view-pill">
                      <span>View</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption under center slide */}
      <div className="curved-caption-area">
        <h4 className="curved-caption-title">{activeSlide.title}</h4>
        <p className="curved-caption-subtitle">{activeSlide.subtitle}</p>
        <p className="curved-caption-desc">{activeSlide.caption}</p>
      </div>

      {/* Centered Controls Row (<  |  >) + Horizontal Slider */}
      <div className="curved-controls-row">
        {/* Horizontal Slider / Scrubber */}
        <div className="curved-slider-bar-container" role="group" aria-label="Horizontal slide scrubber">
          <span className="curved-slider-label">{String(currentIndex + 1).padStart(2, '0')}</span>
          <div className="curved-slider-track-wrap">
            <div className="curved-slider-track">
              <div
                className="curved-slider-fill"
                style={{ width: `${(currentIndex / (totalSlides - 1)) * 100}%` }}
              />
              <div className="curved-slider-ticks" aria-hidden="true">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`curved-slider-tick ${i === currentIndex ? 'is-active' : ''} ${i <= currentIndex ? 'is-passed' : ''}`}
                    style={{ left: `${(i / (totalSlides - 1)) * 100}%` }}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={totalSlides - 1}
              step={1}
              value={currentIndex}
              onChange={(e) => goToSlide(Number(e.target.value))}
              className="curved-slider-input"
              aria-label="Slide scrubber slider"
            />
          </div>
          <span className="curved-slider-total">{String(totalSlides).padStart(2, '0')}</span>
        </div>

        <div className="curved-nav-pill" role="group" aria-label="Carousel navigation">
          <button
            type="button"
            className="curved-nav-btn"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="curved-nav-divider" aria-hidden="true" />
          <button
            type="button"
            className="curved-nav-btn"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Minimal indicator dots */}
        <div className="curved-dots-row" aria-hidden="true">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`curved-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="curved-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen photo view"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="curved-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="curved-lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              <X size={22} />
            </button>

            <img
              src={activeSlide.src}
              alt={activeSlide.title}
              className="curved-lightbox-img"
            />

            <div className="curved-lightbox-footer">
              <div>
                <span className="chip-left" style={{ marginBottom: 6, display: 'inline-block' }}>
                  {activeSlide.chipLeft}
                </span>
                <h3 className="lightbox-title">{activeSlide.title}</h3>
                <p className="lightbox-subtitle">{activeSlide.subtitle}</p>
                <p className="lightbox-desc">{activeSlide.caption}</p>
              </div>

              <div className="lightbox-nav-buttons">
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={prevSlide}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="lightbox-nav-btn"
                  onClick={nextSlide}
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
