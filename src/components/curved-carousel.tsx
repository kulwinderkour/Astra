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
    src: '/assets/images/image1.png',
    chipLeft: '01 / FIELD PROOF',
    chipRight: 'LAT 30.9894° N // ELEV 260M',
    title: 'Army drone demonstration',
    subtitle: 'Field demo at sunset, Unit 21',
    caption: 'Tactical field demonstration and sovereign payload validation with military leadership.',
  },
  {
    src: '/assets/images/image2.png',
    chipLeft: '02 / SYSTEM DEVELOPMENT',
    chipRight: 'AWARD // STATE CONCLAVE',
    title: 'Punjab State Technology Award',
    subtitle: 'Honored by the Chief Minister of Punjab',
    caption: 'State recognition for indigenous aerospace innovation and high-reliability UAV architecture.',
  },
  {
    src: '/assets/images/image3.png',
    chipLeft: '03 / ENGINEERING',
    chipRight: 'AVIONICS RIG // HANGAR-01',
    title: 'UCAV Sensor Integration',
    subtitle: 'Sensor integration in the hangar',
    caption: 'Hardware-in-the-loop avionics testing, optical payload calibration, and airframe assembly.',
  },
  {
    src: '/assets/images/image4.png',
    chipLeft: '04 / OPERATIONS',
    chipRight: 'IIT ROPAR // VISVESVARAYA',
    title: 'ADRAL Lab, IIT Ropar',
    subtitle: 'Autonomous drone research and assembly lab',
    caption: 'Sovereign robotics R&D facility, embedded telemetry programming, and pilot simulators.',
  },
  {
    src: '/assets/images/image5.png',
    chipLeft: '05 / DEPLOYMENT',
    chipRight: 'HIGH ALTITUDE // MIL-SPEC',
    title: 'High-Altitude Tactical Drone',
    subtitle: 'Tactical drone over snow',
    caption: 'Sub-zero operational deployment, extreme-altitude endurance, and contested airspace navigation.',
  },
];

export function CurvedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const [isGrabbed, setIsGrabbed] = useState(false);

  const totalSlides = CAROUSEL_SLIDES.length;

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

  const activeSlide = CAROUSEL_SLIDES[currentIndex];

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
          {CAROUSEL_SLIDES.map((slide, index) => {
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
          <span className="curved-slider-label">0{currentIndex + 1}</span>
          <div className="curved-slider-track-wrap">
            <div className="curved-slider-track">
              <div
                className="curved-slider-fill"
                style={{ width: `${(currentIndex / (totalSlides - 1)) * 100}%` }}
              />
              <div className="curved-slider-ticks" aria-hidden="true">
                {CAROUSEL_SLIDES.map((_, i) => (
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
          <span className="curved-slider-total">0{totalSlides}</span>
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
          {CAROUSEL_SLIDES.map((_, idx) => (
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
