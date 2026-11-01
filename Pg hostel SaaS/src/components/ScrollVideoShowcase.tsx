import React, { useEffect, useRef, useState } from 'react';

interface ScrollVideoShowcaseProps {
  language?: 'en' | 'ta';
  children: React.ReactNode;
}

export const ScrollVideoShowcase: React.FC<ScrollVideoShowcaseProps> = ({ 
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoDuration, setVideoDuration] = useState(10);

  // References for ultra-responsive, zero-delay, non-blocking scroll scrubbing
  const targetTimeRef = useRef(0);
  const pendingTimeRef = useRef<number | null>(null);
  const isSeekingRef = useRef(false);

  // Handle scroll-driven video scrubbing with zero delay and no decoder lockup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is paused and preloaded
    video.pause();

    const applySeek = (time: number) => {
      if (!video || isNaN(time)) return;
      const dur = video.duration || videoDuration || 10;
      const clampedTime = Math.max(0, Math.min(dur, time));

      if (video.seeking || isSeekingRef.current) {
        // Decoder is currently processing a frame; queue latest target time
        pendingTimeRef.current = clampedTime;
      } else {
        // Immediate seek: zero delay
        if (Math.abs(video.currentTime - clampedTime) > 0.015) {
          isSeekingRef.current = true;
          const vid = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
          if (typeof vid.fastSeek === 'function') {
            try {
              vid.fastSeek(clampedTime);
            } catch {
              video.currentTime = clampedTime;
            }
          } else {
            video.currentTime = clampedTime;
          }
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        applySeek(nextTime);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const dur = videoRef.current.duration || videoDuration || 10;
      const newTarget = rawProgress * dur;
      targetTimeRef.current = newTarget;

      applySeek(newTarget);
    };

    // Safety RAF watchdog: ensures if a fast scroll occurred during seeking, it catches up instantly
    let rafId: number;
    const watchdogLoop = () => {
      if (video && !video.seeking && !isSeekingRef.current) {
        if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
          applySeek(targetTimeRef.current);
        }
      }
      rafId = requestAnimationFrame(watchdogLoop);
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(watchdogLoop);

    // Initial sync
    handleScroll();

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [videoDuration]);

  // Handle Video Metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  return (
    <div 
      id="saas-hero-container"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '240vh', // Extended scroll track for comfortable scrolling video scrub
        width: '100%',
        background: 'transparent',
        margin: 0,
        padding: 0
      }}
    >
      {/* ========================================================================= */}
      {/* STICKY 100vh VIEWPORT: LOCKS EVERYTHING (LETTERS STAY STILL / DONT MOVE) */}
      {/* Only the background video scrubs when user scrolls                        */}
      {/* ========================================================================= */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        {/* Background Touring Video: 100% Original Brightness, Clean Watermark-Free All-Intra MP4 */}
        <video
          ref={videoRef}
          src="/Touring_modern_living_space.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            zIndex: 0,
            filter: 'none' // 100% natural, crisp, original video brightness & contrast
          }}
        />

        {/* Foreground Content (Letters, Headline, Cards): PINNED STILL (DOES NOT MOVE ON SCROLL) */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
