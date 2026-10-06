import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * CONFIGURATION
 * All copy, rotating phrases, and intervals in one place.
 */
export const DRONE_LAB_CONFIG = {
  heading: 'Set up a drone lab.',
  intro:
    'We build drone and robotics labs inside  schools, colleges and institutions, then train students and staff to run them.',
  sentencePrefix: 'We run a school. We want a small lab where students can ',
  sentenceMid: '. We need help with ',
  sentenceSuffix: '.',
  phraseA: [
    'learn to fly FPV',
    'build and repair drones',
    'code autonomous flights',
    'do all of it',
  ],
  phraseB: [
    'lab design, equipment and installation',
    'workshops and FPV flight training',
    'the build, code and fly curriculum',
    'ongoing technical support',
    'the whole setup',
  ],
  intervalA: 3200, // 3.2 seconds
  intervalB: 4000, // 4.0 seconds
  delayB: 1200,    // phrase B starts ~1.2 seconds later
};

export function DroneLab() {
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [isLockedA, setIsLockedA] = useState(false);
  const [isLockedB, setIsLockedB] = useState(false);
  const [cycleA, setCycleA] = useState(0);
  const [cycleB, setCycleB] = useState(0);

  // Interaction pause states
  const [isHovered, setIsHovered] = useState(false);
  const [isSentenceFocused, setIsSentenceFocused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  const phraseA = DRONE_LAB_CONFIG.phraseA[indexA];
  const phraseB = DRONE_LAB_CONFIG.phraseB[indexB];
  const currentSentence = `${DRONE_LAB_CONFIG.sentencePrefix}${phraseA}${DRONE_LAB_CONFIG.sentenceMid}${phraseB}${DRONE_LAB_CONFIG.sentenceSuffix}`;

  // Screen reader accessible sentence: updates on initial load or lock toggle
  const [accessibleSentence, setAccessibleSentence] = useState(currentSentence);

  // Listen to tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.visibilityState !== 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Ensure lab video autoplays safely
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      void video.play().catch(() => {});
    }
  }, []);

  const isPaused = isHovered || isSentenceFocused || isTabHidden;

  // Advance phrase A
  const advancePhraseA = useCallback(() => {
    setIndexA((prev) => (prev + 1) % DRONE_LAB_CONFIG.phraseA.length);
    setCycleA((c) => c + 1);
  }, []);

  // Advance phrase B
  const advancePhraseB = useCallback(() => {
    setIndexB((prev) => (prev + 1) % DRONE_LAB_CONFIG.phraseB.length);
    setCycleB((c) => c + 1);
  }, []);

  // Click handler for Phrase A: toggle lock or manual advance in reduced-motion
  const handleClickPhraseA = () => {
    if (reducedMotion) {
      advancePhraseA();
      return;
    }
    const nextLocked = !isLockedA;
    setIsLockedA(nextLocked);
    if (!nextLocked) {
      setCycleA((c) => c + 1);
    }
    setAccessibleSentence(currentSentence);
  };

  // Click handler for Phrase B: toggle lock or manual advance in reduced-motion
  const handleClickPhraseB = () => {
    if (reducedMotion) {
      advancePhraseB();
      return;
    }
    const nextLocked = !isLockedB;
    setIsLockedB(nextLocked);
    if (!nextLocked) {
      setCycleB((c) => c + 1);
    }
    setAccessibleSentence(currentSentence);
  };

  // Check if phrase B is on its initial delay
  const isInitialB = cycleB === 0 && indexB === 0;

  return (
    <section className="drone-lab-section" id="drone-lab" aria-labelledby="lab-title">
      <div className="drone-lab-layout">
        {/* Left Column: Clean Typography (~52%) */}
        <div className="drone-lab-content">
          <header className="drone-lab-header">
            <h2 className="drone-lab-heading" id="lab-title">
              {DRONE_LAB_CONFIG.heading}
            </h2>
            <p className="drone-lab-intro">{DRONE_LAB_CONFIG.intro}</p>
          </header>

          {/* The Brief Sentence */}
          <div
            className="drone-lab-sentence-box"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsSentenceFocused(true)}
            onBlurCapture={() => setIsSentenceFocused(false)}
          >
            {/* Screen reader plain text snapshot that updates on lock */}
            <span className="sr-only" aria-live="off">
              {accessibleSentence}
            </span>

            <p className="drone-lab-sentence" aria-hidden="true">
              <span>{DRONE_LAB_CONFIG.sentencePrefix}</span>

              {/* Rotating Phrase A */}
              <button
                type="button"
                className={`phrase-slot ${isLockedA ? 'is-locked' : ''}`}
                onClick={handleClickPhraseA}
                title={isLockedA ? 'Click to resume rotating' : 'Click to lock this phrase'}
                aria-label={`Option: ${phraseA}. ${isLockedA ? 'Locked.' : 'Click to lock.'}`}
              >
                <motion.span
                  layout
                  className="phrase-anim-wrap"
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={phraseA}
                      className="phrase-text"
                      initial={reducedMotion ? false : { y: '100%', opacity: 0 }}
                      animate={reducedMotion ? undefined : { y: '0%', opacity: 1 }}
                      exit={reducedMotion ? undefined : { y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      {phraseA}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>

                {/* Underline timer track & filling bar */}
                <span className="phrase-timer-track" />
                <span
                  key={`timer-a-${indexA}-${cycleA}`}
                  className="phrase-timer-bar"
                  style={{
                    animationDuration: `${DRONE_LAB_CONFIG.intervalA}ms`,
                    animationPlayState:
                      isPaused || isLockedA || reducedMotion ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => {
                    if (!isLockedA && !isPaused && !reducedMotion) {
                      advancePhraseA();
                    }
                  }}
                />
              </button>

              <span>{DRONE_LAB_CONFIG.sentenceMid}</span>

              {/* Rotating Phrase B */}
              <button
                type="button"
                className={`phrase-slot ${isLockedB ? 'is-locked' : ''}`}
                onClick={handleClickPhraseB}
                title={isLockedB ? 'Click to resume rotating' : 'Click to lock this phrase'}
                aria-label={`Option: ${phraseB}. ${isLockedB ? 'Locked.' : 'Click to lock.'}`}
              >
                <motion.span
                  layout
                  className="phrase-anim-wrap"
                  transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={phraseB}
                      className="phrase-text"
                      initial={reducedMotion ? false : { y: '100%', opacity: 0 }}
                      animate={reducedMotion ? undefined : { y: '0%', opacity: 1 }}
                      exit={reducedMotion ? undefined : { y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      {phraseB}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>

                {/* Underline timer track & filling bar */}
                <span className="phrase-timer-track" />
                <span
                  key={`timer-b-${indexB}-${cycleB}`}
                  className="phrase-timer-bar"
                  style={{
                    animationDelay: isInitialB ? `${DRONE_LAB_CONFIG.delayB}ms` : '0ms',
                    animationDuration: `${DRONE_LAB_CONFIG.intervalB}ms`,
                    animationPlayState:
                      isPaused || isLockedB || reducedMotion ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => {
                    if (!isLockedB && !isPaused && !reducedMotion) {
                      advancePhraseB();
                    }
                  }}
                />
              </button>

              <span>{DRONE_LAB_CONFIG.sentenceSuffix}</span>
            </p>
          </div>
        </div>

        {/* Right Column: Full-Height Clean Video (~48%) */}
        <div className="drone-lab-video-panel">
          <video
            ref={videoRef}
            className="drone-lab-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="ASTRA drone laboratory testing footage"
          >
            <source src="/assets/videos/labvideo.mp4" type="video/mp4" />
          </video>
          {/* Soft gradient edge fading left into content side */}
          <div className="drone-lab-video-fade" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
