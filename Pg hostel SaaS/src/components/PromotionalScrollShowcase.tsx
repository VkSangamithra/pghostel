import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PromotionalScrollShowcaseProps {
  language?: string;
  onStartTrial?: () => void;
  onOpenLogin?: () => void;
}

export const PromotionalScrollShowcase: React.FC<PromotionalScrollShowcaseProps> = ({
  language = 'en'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoDuration, setVideoDuration] = useState<number>(10);

  // Smooth lerp damping references for steady, smooth scroll scrubbing
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Handle Video Metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  // Scroll-driven frame scrubbing (pure scroll technology)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      const dur = videoRef.current.duration || videoDuration || 10;
      targetTimeRef.current = rawProgress * dur;
    };

    const updateVideoScrub = () => {
      const vid = videoRef.current;
      if (vid) {
        const dur = vid.duration || videoDuration || 10;
        // Steady, fluid 60fps lerp damping
        currentTimeRef.current += (targetTimeRef.current - currentTimeRef.current) * 0.14;

        if (!vid.seeking && !isSeekingRef.current && Math.abs(currentTimeRef.current - vid.currentTime) > 0.012) {
          isSeekingRef.current = true;
          const target = Math.max(0, Math.min(dur, currentTimeRef.current));
          const fastVid = vid as HTMLVideoElement & { fastSeek?: (time: number) => void };
          if (typeof fastVid.fastSeek === 'function') {
            try {
              fastVid.fastSeek(target);
            } catch {
              vid.currentTime = target;
            }
          } else {
            vid.currentTime = target;
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoScrub);
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    const vidEl = videoRef.current;
    if (vidEl) {
      vidEl.pause();
      vidEl.addEventListener('seeked', handleSeeked);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateVideoScrub);
    handleScroll();

    return () => {
      if (vidEl) {
        vidEl.removeEventListener('seeked', handleSeeked);
      }
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoDuration]);

  return (
    <div
      id="promotional-scroll-showcase"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '380vh', // Steady, comfortable scroll distance
        width: '100%',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
        border: 'none',
      }}
    >
      <span id="why-uyar" style={{ position: 'absolute', top: '-80px', left: 0 }} />
      <span id="why-choose-us" style={{ position: 'absolute', top: '-80px', left: 0 }} />
      {/* 100vh Sticky Viewport: Centered sleek theater frame floating on panoramic background */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          padding: '1.5rem',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Header badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem', zIndex: 10 }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              padding: '0.35rem 1rem', 
              borderRadius: '999px', 
              background: 'rgba(255, 255, 255, 0.94)', 
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(37, 99, 235, 0.25)', 
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
              color: '#2563eb', 
              fontWeight: 800, 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '0.5rem' 
            }}
          >
            <Sparkles size={14} />
            <span>{language === 'ta' ? 'அறிமுகம்' : 'WHY CHOOSE US'}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.35rem)', color: '#090d16', fontWeight: 850, margin: 0, letterSpacing: '-0.025em', textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)' }}>
            {language === 'ta' ? 'ஏன் எங்களை தேர்ந்தெடுக்க வேண்டும்?' : 'Why Choose Us'}
          </h2>
        </div>

        {/* Video Theater Frame (Pure Scroll Driven, Zero Buttons / No Controls, Clean Watermark-Free Video) */}
        <div 
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            maxHeight: 'min(64vh, 580px)',
            aspectRatio: '16/9',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            background: '#090d16'
          }}
        >
          {/* Watermark-Free Video scrubbed purely by scroll */}
          <video
            ref={videoRef}
            src="/promotional_showcase_clean.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              border: 'none',
              outline: 'none',
              margin: 0,
              padding: 0
            }}
          />
        </div>

        {/* Scrub Hint */}
        <div style={{ marginTop: '0.9rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 700 }}>
          {language === 'ta' ? '↓ ஸ்க்ரோல் செய்து வீடியோவை இயக்கவும்' : '↓ Scroll down to play through the software tour'}
        </div>
      </div>
    </div>
  );
};
