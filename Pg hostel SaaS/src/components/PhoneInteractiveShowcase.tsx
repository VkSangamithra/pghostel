import React, { useRef, useState, useEffect } from 'react';
import {
  TrendingUp,
  Building,
  Users,
  MessageSquare,
  QrCode,
  KeyRound,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PhoneInteractiveShowcaseProps {
  language: 'en' | 'ta';
  onStartTrial: () => void;
  onOpenLogin: () => void;
}

export type TabKey = 'dashboard' | 'rooms' | 'tenants' | 'whatsapp' | 'visitors' | 'staff';

interface StepConfig {
  id: TabKey;
  stepNum: number;
  label: string;
  labelTa: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  centerTime: number; // Exact timestamp in seconds where screen is active in video
}

const STEPS: StepConfig[] = [
  {
    id: 'dashboard',
    stepNum: 1,
    label: 'Dashboard',
    labelTa: 'டாஷ்போர்டு',
    icon: TrendingUp,
    centerTime: 1.0, // Dashboard screen: UYAR TECH PG, Rooms: 48/60, Active Tasks, Performance chart
  },
  {
    id: 'rooms',
    stepNum: 2,
    label: 'Rooms & Beds',
    labelTa: 'அறைகள் & படுக்கைகள்',
    icon: Building,
    centerTime: 3.3, // Rooms & Beds grid: Available Beds, Occupied Beds, Bed Matrix
  },
  {
    id: 'tenants',
    stepNum: 3,
    label: 'Tenants & KYC',
    labelTa: 'வாடகைதாரர்கள் & KYC',
    icon: Users,
    centerTime: 5.1, // Tenants list: Jani Hordo, Johan Gaclar, etc. with WhatsApp buttons
  },
  {
    id: 'whatsapp',
    stepNum: 4,
    label: 'WhatsApp Reminders',
    labelTa: 'வாட்ஸ்அப் நினைவூட்டல்',
    icon: MessageSquare,
    centerTime: 6.1, // Finger taps green "Send WhatsApp Reminder" button
  },
  {
    id: 'visitors',
    stepNum: 5,
    label: 'Visitor QR & Gate',
    labelTa: 'பார்வையாளர் QR',
    icon: QrCode,
    centerTime: 7.4, // Gate QR code with scan logs: Visitor & Wardens
  },
  {
    id: 'staff',
    stepNum: 6,
    label: 'Staff & Wardens',
    labelTa: 'ஊழியர் மேலாண்மை',
    icon: KeyRound,
    centerTime: 9.3, // Warden tasks & Staff assignments checklist
  },
];

// Helper to compute the exact video timestamp for any continuous progress (0.0 to 5.0)
const getVideoTimeForProgress = (cur: number): number => {
  const clamped = Math.max(0, Math.min(STEPS.length - 1, cur));
  const i = Math.min(STEPS.length - 2, Math.floor(clamped));
  const ratio = clamped - i;
  return STEPS[i].centerTime + ratio * (STEPS[i + 1].centerTime - STEPS[i].centerTime);
};

export const PhoneInteractiveShowcase: React.FC<PhoneInteractiveShowcaseProps> = ({
  language,
  onStartTrial,
  onOpenLogin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);

  // Synchronize video and horizontal card slider with scroll step-by-step
  // Cards stop cleanly at each step in both directions without endless drifting
  useEffect(() => {
    const syncToStep = (targetStep: number) => {
      if (targetStep === activeIndexRef.current) return;
      activeIndexRef.current = targetStep;
      setActiveIndex(targetStep);

      const v = videoRef.current;
      if (v && v.readyState >= 1) {
        const targetTime = STEPS[targetStep].centerTime;
        const vid = v as HTMLVideoElement & { fastSeek?: (time: number) => void };
        if (typeof vid.fastSeek === 'function') {
          try {
            vid.fastSeek(targetTime);
          } catch {
            v.currentTime = targetTime;
          }
        } else {
          v.currentTime = targetTime;
        }
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Track scroll range within the sticky showcase
      const totalScrollable = containerHeight - windowHeight;
      if (totalScrollable <= 0) return;

      // Progress within showcase section: 0.0 at top, 1.0 at bottom
      const currentScrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScrolled / totalScrollable));

      // Calculate the discrete step index (0 to 5) so cards stop firmly on each step
      const targetStep = Math.min(
        STEPS.length - 1,
        Math.max(0, Math.round(progress * (STEPS.length - 1)))
      );

      syncToStep(targetStep);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = STEPS[activeIndexRef.current].centerTime;
    }
  };

  // Click handler to smoothly jump to a specific step
  const handleTabClick = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(STEPS.length - 1, index));
    setActiveIndex(clampedIndex);
    activeIndexRef.current = clampedIndex;

    const v = videoRef.current;
    if (v && v.readyState >= 1) {
      const targetTime = STEPS[clampedIndex].centerTime;
      const vid = v as HTMLVideoElement & { fastSeek?: (time: number) => void };
      if (typeof vid.fastSeek === 'function') {
        try {
          vid.fastSeek(targetTime);
        } catch {
          v.currentTime = targetTime;
        }
      } else {
        v.currentTime = targetTime;
      }
    }

    if (containerRef.current) {
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const totalScrollable = containerHeight - window.innerHeight;
      const targetScroll = containerTop + (clampedIndex / (STEPS.length - 1)) * totalScrollable;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const currentTab = STEPS[activeIndex];

  return (
    <section
      ref={containerRef}
      id="screens"
      style={{
        position: 'relative',
        height: '320vh', // Extended scroll distance so user can scroll through all 6 cards
        background: 'transparent',
        border: 'none',
      }}
    >
      {/* ===================================================================== */}
      {/* STICKY VIEWPORT CONTAINER: PINNED ON SCREEN WHILE USER SCROLLS        */}
      {/* ===================================================================== */}
      <div
        style={{
          position: 'sticky',
          top: '72px',
          height: 'calc(100vh - 72px)',
          minHeight: '620px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '1.5rem',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.35rem'
            }}
          >
            <Sparkles size={16} />
            {language === 'en' ? 'App Walkthrough' : 'செயலி முன்னோட்டம்'}
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              color: 'var(--primary-900)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 0.4rem 0',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'en' ? 'Your whole PG on one screen' : 'உங்கள் மொத்த பிஜி-யும் ஒரே திரையில்'}
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.98rem',
              margin: '0 auto',
              lineHeight: 1.5,
              maxWidth: '720px',
            }}
          >
            {language === 'en'
              ? 'Open the app and see the month at a glance: net profit, revenue, expenses and pending rent, live occupancy, and shortcuts to everything you do daily.'
              : 'மாதாந்திர லாபம், வசூல், மின்சாரக் கட்டணம், மற்றும் காலியான படுக்கைகள் அனைத்தையும் ஒரே பார்வையில் நிர்வகிக்கலாம்.'}
          </p>
        </div>

        {/* =================================================================== */}
        {/* HORIZONTAL BUTTONS ROW                                              */}
        {/* =================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}
        >
          {STEPS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeIndex === idx;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive
                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                    : 'rgba(255, 255, 255, 0.88)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  border: isActive
                    ? '1px solid #1d4ed8'
                    : '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: isActive
                    ? '0 6px 16px rgba(37, 99, 235, 0.3)'
                    : '0 2px 6px rgba(0, 0, 0, 0.03)',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : '#2563eb'} />
                <span>{language === 'en' ? tab.label : tab.labelTa}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* MAIN HORIZONTAL SPLIT: VIDEO ALONE (LEFT) + SLIDING CARDS (RIGHT)    */}
        {/* =================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 420px) 1fr',
            gap: '2.5rem',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* --------------------------------------------------------------- */}
          {/* LEFT: VIDEO ALONE (NO PHONE BORDERS, NO FAKE BEZELS/NOTCH)       */}
          {/* --------------------------------------------------------------- */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Ambient Back Glow */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.14) 0%, rgba(59, 130, 246, 0.02) 70%, transparent 100%)',
                filter: 'blur(25px)',
                zIndex: 0,
              }}
            />

            {/* Video Container Alone: Smooth borderless rounded display */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                height: '490px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                background: '#000000',
                zIndex: 1,
              }}
            >
              <video
                ref={videoRef}
                src="/finger_tap_showcase.mp4"
                preload="auto"
                muted
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '56% center',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* RIGHT: HORIZONTAL SLIDING CARDS (MOVES NEXT TO NEXT ON SCROLL)   */}
          {/* --------------------------------------------------------------- */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            {/* Horizontal Slider Viewport */}
            <div
              style={{
                overflow: 'hidden',
                width: '100%',
                borderRadius: '24px',
              }}
            >
              <div
                ref={trackRef}
                style={{
                  display: 'flex',
                  width: '600%', // 6 cards side-by-side
                  transform: `translateX(-${activeIndex * (100 / 6)}%)`,
                  transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'transform',
                }}
              >

                {/* CARD 1: DASHBOARD OVERVIEW */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(134, 239, 172, 0.75)',
                      boxShadow: '0 0 0 1px rgba(134, 239, 172, 0.45), 0 8px 24px -4px rgba(134, 239, 172, 0.42), 0 20px 48px -6px rgba(134, 239, 172, 0.28), 0 36px 72px -12px rgba(134, 239, 172, 0.18), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#2563eb', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <TrendingUp size={16} /> Step 1: Real-Time Intelligence
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                            October 2026 Monthly Overview
                          </h3>
                          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.88rem' }}>
                            Sri Balaji PG — OMR Branch (65 Total Beds)
                          </p>
                        </div>
                        <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                          ● 92% Occupancy Rate
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ padding: '0.95rem', background: '#ffffff', borderRadius: '12px', border: '1.2px solid rgba(134, 239, 172, 0.65)', boxShadow: '0 4px 14px -2px rgba(134, 239, 172, 0.3)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Monthly Profit</div>
                          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#059669', margin: '0.2rem 0' }}>₹1,42,500</div>
                          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>+12% vs last month</div>
                        </div>
                        <div style={{ padding: '0.95rem', background: '#ffffff', borderRadius: '12px', border: '1.2px solid rgba(147, 197, 253, 0.65)', boxShadow: '0 4px 14px -2px rgba(147, 197, 253, 0.3)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rent Collected</div>
                          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#2563eb', margin: '0.2rem 0' }}>₹2,10,000</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>From 46 active tenants</div>
                        </div>
                        <div style={{ padding: '0.95rem', background: '#ffffff', borderRadius: '12px', border: '1.2px solid rgba(254, 202, 202, 0.75)', boxShadow: '0 4px 14px -2px rgba(239, 68, 68, 0.22)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Rent Dues</div>
                          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#ef4444', margin: '0.2rem 0' }}>₹18,000</div>
                          <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 600 }}>3 tenants due soon</div>
                        </div>
                        <div style={{ padding: '0.95rem', background: '#ffffff', borderRadius: '12px', border: '1.2px solid rgba(253, 230, 138, 0.75)', boxShadow: '0 4px 14px -2px rgba(245, 158, 11, 0.25)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Live Beds Available</div>
                          <div style={{ fontSize: '1.55rem', fontWeight: 800, color: '#f59e0b', margin: '0.2rem 0' }}>5 Free Beds</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2 on notice this week</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                      <button onClick={onStartTrial} className="btn btn-primary" style={{ padding: '0.6rem 1.35rem', fontSize: '0.85rem' }}>
                        Create Owner Account
                      </button>
                      <button onClick={onOpenLogin} className="btn btn-secondary" style={{ padding: '0.6rem 1.35rem', fontSize: '0.85rem' }}>
                        Owner Login
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD 2: ROOMS & BEDS */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(252, 211, 77, 0.75)',
                      boxShadow: '0 0 0 1px rgba(252, 211, 77, 0.45), 0 8px 24px -4px rgba(252, 211, 77, 0.40), 0 20px 48px -6px rgba(252, 211, 77, 0.26), 0 36px 72px -12px rgba(252, 211, 77, 0.16), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <Building size={16} /> Step 2: Occupancy & Floor Matrix
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                        Every Floor and Bed, Always Up to Date
                      </h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontSize: '0.88rem' }}>
                        Know exactly which bed is vacant before the next inquiry calls. Avoid double booking and track vacating notices.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        {[
                          { room: '101-A', type: '2-Share AC', status: 'Occupied', tenant: 'Kavin Kumar', color: '#059669', bg: '#ecfdf5' },
                          { room: '101-B', type: '2-Share AC', status: 'Available', tenant: 'Ready to Book', color: '#2563eb', bg: '#eff6ff' },
                          { room: '102-A', type: '3-Share Non-AC', status: 'Occupied', tenant: 'R. Vignesh', color: '#059669', bg: '#ecfdf5' },
                          { room: '102-B', type: '3-Share Non-AC', status: 'Vacating', tenant: 'Notice: 31 Oct', color: '#d97706', bg: '#fffbeb' },
                        ].map((b, i) => (
                          <div key={i} style={{ padding: '0.85rem', borderRadius: '12px', background: b.bg, border: `1px solid ${b.color}35` }}>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-900)' }}>Bed {b.room}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>{b.type}</div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: b.color }}>{b.status}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{b.tenant}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <CheckCircle2 size={16} /> Instant EB meter reading attachment eliminates room-sharing electricity fights.
                    </div>
                  </div>
                </div>

                {/* CARD 3: TENANTS & KYC */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(147, 197, 253, 0.75)',
                      boxShadow: '0 0 0 1px rgba(147, 197, 253, 0.45), 0 8px 24px -4px rgba(147, 197, 253, 0.40), 0 20px 48px -6px rgba(147, 197, 253, 0.26), 0 36px 72px -12px rgba(147, 197, 253, 0.16), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#10b981', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <Users size={16} /> Step 3: Paperless Onboarding
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                        Digital Tenant Records & Aadhaar KYC
                      </h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontSize: '0.88rem' }}>
                        Tenants onboard in 10 minutes via WhatsApp without filling paper forms. Auto-generates police verification.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                        {[
                          { name: 'Kavin Kumar', room: 'Room 101-A', phone: '+91 98401 23456', rent: '₹8,500', kyc: 'Aadhaar Verified', status: 'Paid' },
                          { name: 'Vignesh Ramanathan', room: 'Room 101-C', phone: '+91 99401 56789', rent: '₹8,323', kyc: 'Aadhaar Verified', status: 'Due in 2 Days' },
                          { name: 'Praveen Chandran', room: 'Room 203-B', phone: '+91 94440 98765', rent: '₹9,200', kyc: 'Aadhaar Verified', status: 'Paid' },
                        ].map((t, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.95rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary-900)' }}>
                                {t.name} • <span style={{ color: '#2563eb' }}>{t.room}</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {t.phone} • <span style={{ color: '#059669', fontWeight: 600 }}>✓ {t.kyc}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-900)' }}>{t.rent}</div>
                              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: t.status === 'Paid' ? '#ecfdf5' : '#fffbeb', color: t.status === 'Paid' ? '#059669' : '#d97706', fontWeight: 700 }}>
                                {t.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <ShieldCheck size={16} /> 1-Click police station tenant verification report download.
                    </div>
                  </div>
                </div>

                {/* CARD 4: WHATSAPP REMINDERS */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(110, 231, 183, 0.75)',
                      boxShadow: '0 0 0 1px rgba(110, 231, 183, 0.45), 0 8px 24px -4px rgba(110, 231, 183, 0.40), 0 20px 48px -6px rgba(110, 231, 183, 0.26), 0 36px 72px -12px rgba(110, 231, 183, 0.16), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#16a34a', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <MessageSquare size={16} /> Step 4: Frictionless Collections
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                        1-Tap WhatsApp Rent Reminders & Dynamic UPI
                      </h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontSize: '0.88rem' }}>
                        No awkward phone calls. WhatsApp opens pre-filled with the exact rent, sub-meter EB split, and direct UPI link.
                      </p>

                      <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '14px', border: '1px solid #bbf7d0', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MessageSquare size={15} /> Live Bilingual Message Preview
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#14532d', lineHeight: 1.55, background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                          "வணக்கம் <b>Vignesh</b>, அறை எண் 101-C அக்டோபர் மாத வாடகை ₹7,500 + மின்சாரப் பகிர்வு (EB) ₹823 = மொத்தம் <b>₹8,323</b>. கட்டணம் செலுத்த இந்த லிங்கை கிளிக் செய்யவும்: <u>https://uyar.in/pay/101-C</u> - Uyar PG."
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.82rem', fontWeight: 700, borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <CheckCircle2 size={16} /> 0 Fake Screenshot fraud. 12-digit UTR bank reconciliation protects your account.
                    </div>
                  </div>
                </div>

                {/* CARD 5: VISITOR QR & GATE */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(125, 211, 252, 0.75)',
                      boxShadow: '0 0 0 1px rgba(125, 211, 252, 0.45), 0 8px 24px -4px rgba(125, 211, 252, 0.40), 0 20px 48px -6px rgba(125, 211, 252, 0.26), 0 36px 72px -12px rgba(125, 211, 252, 0.16), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#0284c7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <QrCode size={16} /> Step 5: Gate Security & Maintenance
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                        Visitor QR Gate Pass & Complaint Ticketing
                      </h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontSize: '0.88rem' }}>
                        Print the branch QR code once and stick it at your gate. Visitors scan to log entry; tenants scan to submit repair requests.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                          <div style={{ width: '48px', height: '48px', background: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                            <QrCode size={30} color="#2563eb" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Gate QR Code</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Main Entry • Zero hardware cost</div>
                          </div>
                        </div>

                        <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real-Time Entry Log</div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--primary-900)', marginTop: '0.15rem' }}>Suresh (Visiting Room 204)</div>
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Approved by Warden Manickam</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <CheckCircle2 size={16} /> Eliminates physical paper visitor registers and messy phone calls.
                    </div>
                  </div>
                </div>

                {/* CARD 6: STAFF & WARDEN LOGINS */}
                <div style={{ width: `${100 / 6}%`, padding: '0 0.5rem', boxSizing: 'border-box' }}>
                  <div
                    className="card"
                    style={{
                      padding: '2rem 2.25rem',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1.5px solid rgba(192, 132, 252, 0.75)',
                      boxShadow: '0 0 0 1px rgba(192, 132, 252, 0.45), 0 8px 24px -4px rgba(192, 132, 252, 0.40), 0 20px 48px -6px rgba(192, 132, 252, 0.26), 0 36px 72px -12px rgba(192, 132, 252, 0.16), 0 16px 36px -8px rgba(15, 23, 42, 0.06)',
                      minHeight: '410px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#7c3aed', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <KeyRound size={16} /> Step 6: Multi-Branch & Staff Control
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--primary-900)' }}>
                        Restricted Staff Logins & Multi-Branch Tower
                      </h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontSize: '0.88rem' }}>
                        Give wardens restricted logins for daily tasks in Tamil. Bank accounts and owner profit margins stay 100% private.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ padding: '0.85rem', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#5b21b6' }}>Warden Manickam</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>Tamil Interface Mode</div>
                          <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>Can record cash, visitors & room checks</div>
                        </div>
                        <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-900)' }}>Owner Control Tower</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>Master Multi-Property View</div>
                          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Complete P&L, bank transfers & audit logs</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <CheckCircle2 size={16} /> 100% warden adoption with zero computer training required.
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Slider Navigation Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                padding: '0 0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleTabClick(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    style={{
                      width: activeIndex === i ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeIndex === i ? '#2563eb' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {activeIndex + 1} of {STEPS.length}: <b style={{ color: 'var(--primary-900)' }}>{language === 'en' ? currentTab.label : currentTab.labelTa}</b>
                </span>

                <button
                  onClick={() => handleTabClick(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  aria-label="Previous screen"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    background: activeIndex === 0 ? '#f1f5f9' : '#ffffff',
                    color: activeIndex === 0 ? '#cbd5e1' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={() => handleTabClick(Math.min(STEPS.length - 1, activeIndex + 1))}
                  disabled={activeIndex === STEPS.length - 1}
                  aria-label="Next screen"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    background: activeIndex === STEPS.length - 1 ? '#f1f5f9' : '#ffffff',
                    color: activeIndex === STEPS.length - 1 ? '#cbd5e1' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: activeIndex === STEPS.length - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
