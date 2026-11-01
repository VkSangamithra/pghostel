import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import { getTranslation } from '../translations';
import {
  Building,
  Building2,
  Zap,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Star,
  Calculator,
  FileText,
  Sparkles,
  Lock,
  UserCheck,
  User,
  Check,
  Tag,
  Calendar,
  Crown,
  Users,
  QrCode,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Clock,
  Send,
  HelpCircle,
  ChevronRight,
  Layers,
  LayoutGrid,
  Home,
  Wallet,
  Globe
} from 'lucide-react';
import { ScrollVideoShowcase } from './ScrollVideoShowcase';
import { PhoneInteractiveShowcase } from './PhoneInteractiveShowcase';
import { PromotionalScrollShowcase } from './PromotionalScrollShowcase';
import { Header } from './Header';
import Carousel from './Carousel';
import AnimatedList from './AnimatedList';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface LandingPageProps {
  language: Language;
  onLanguageToggle: () => void;
  onOpenLogin: (role?: UserRole | 'hub') => void;
  onStartTrial: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageToggle,
  onOpenLogin,
  onStartTrial,
}) => {
  const t = getTranslation(language);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [pricingView, setPricingView] = useState<'stack' | 'grid'>('stack');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Demo Form State
  const [demoForm, setDemoForm] = useState({
    name: '',
    phone: '',
    pgName: '',
    city: 'Chennai',
    beds: '50',
    submitted: false
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoForm.name && demoForm.phone) {
      setDemoForm(prev => ({ ...prev, submitted: true }));
    }
  };

  // Uyar Tech FAQs
  const faqList = [
    {
      q: language === 'en' ? 'What is Uyar Tech / Uyar PG?' : 'Uyar Tech / Uyar PG மென்பொருள் என்றால் என்ன?',
      a: language === 'en'
        ? 'Uyar Tech PG SaaS is an all-in-one PG and hostel management platform for property owners. It consolidates rooms & beds, tenants & digital KYC, rent dues, visitor QR check-ins, tenant maintenance complaints, staff permissions, and expense tracking into one unified system, replacing outdated register books and paper records.'
        : 'Uyar PG என்பது பிஜி மற்றும் விடுதி உரிமையாளர்களுக்கான முழுமையான மேலாண்மை மென்பொருள். படுக்கைகள், வாடகைதாரர் ஆவணங்கள், வாடகை கணக்குகள், பார்வையாளர் QR வருகை மற்றும் ஊழியர் பணிகளை ஒரே இடத்தில் எளிதாக நிர்வகிக்கலாம்.'
    },
    {
      q: language === 'en' ? 'How does the system track rent and due dates?' : 'வாடகை நிலுவைகள் எவ்வாறு கண்காணிக்கப்படுகின்றன?',
      a: language === 'en'
        ? 'Every tenant has an automated billing cycle calculated from their move-in date. The platform automatically tags each tenant as Current, Due Soon, or Overdue, complete with our proprietary zero-dispute electricity (EB) sub-meter split calculation, so follow-ups are clear and dispute-free.'
        : 'ஒவ்வொரு வாடகைதாரரின் குடிபுகுந்த தேதியில் இருந்து வாடகை சுழற்சி தானாக கணக்கிடப்படுகிறது. நிலுவைத் தேதிகள், அபராதங்கள் மற்றும் தனி அறை மின்சார (EB) கட்டணம் தானாக இணைக்கப்பட்டு தெளிவான பட்டியல் தயாராகிறது.'
    },
    {
      q: language === 'en' ? 'Can I send rent reminders on WhatsApp?' : 'வாட்ஸ்அப் மூலம் வாடகை நினைவூட்டல் அனுப்ப முடியுமா?',
      a: language === 'en'
        ? 'Yes! WhatsApp opens with each tenant’s personalized message already formatted with their name, exact rent, EB split amount, and UPI payment link. You only tap send. You can also broadcast payment receipts, house announcements, and birthday wishes in Tamil and English.'
        : 'ஆம்! வாடகைதாரரின் பெயர், வாடகை தொகை மற்றும் UPI கட்டண லிங்க் அடங்கிய வாட்ஸ்அப் செய்தி தானாக உருவாகும். ஒரே தட்டலில் தமிழ் மற்றும் ஆங்கிலத்தில் அனுப்பலாம்.'
    },
    {
      q: language === 'en' ? 'How does visitor QR check-in and complaint logging work?' : 'பார்வையாளர் QR குறியீடு மற்றும் புகார்கள் எவ்வாறு செயல்படுகின்றன?',
      a: language === 'en'
        ? 'Print your branch QR code once and display it at your entrance gate. Visitors scan with their mobile camera to submit their name, phone number, and whom they are visiting, generating instant security logs. Existing tenants can scan the same QR code to register maintenance issues (plumbing, Wi-Fi, electricity) directly without calling you.'
        : 'உங்கள் பிரதான நுழைவாயிலில் QR குறியீட்டை ஒட்டலாம். பார்வையாளர்கள் அதை ஸ்கேன் செய்து பெயர் மற்றும் விபரங்களை பதிவு செய்யலாம். வாடகைதாரர்கள் பழுது மற்றும் புகார்களை உடனடியாக தெரிவிக்கலாம்.'
    },
    {
      q: language === 'en' ? 'Can my staff or warden use the platform with limited access?' : 'வார்டன் அல்லது ஊழியர்களுக்கு தனி லாகின் உள்ளதா?',
      a: language === 'en'
        ? 'Yes. Staff and wardens get restricted logins for daily operations such as room checking, visitor entry approval, complaint resolution, and recording cash collections. Financial reports, owner profit/loss dashboards, and staff management permissions remain private to the property owner.'
        : 'ஆம். வார்டன்களுக்கு தினசரி பணிகளுக்கான பிரத்யேக லாகின் உண்டு. நிதி நிலவரங்கள் மற்றும் லாப நஷ்ட விவரங்களை உரிமையாளர் மட்டுமே காண முடியும்.'
    },
    {
      q: language === 'en' ? 'Does it support more than one PG branch or property?' : 'ஒன்றுக்கும் மேற்பட்ட பிஜி கிளைகளை நிர்வகிக்க முடியுமா?',
      a: language === 'en'
        ? 'Yes! You can manage multiple PG branches (e.g. OMR, Guindy, Electronic City, Madhapur) from a single master owner account, switch properties with 1-click, and assign wardens to their respective locations.'
        : 'ஆம்! ஒரே உரிமையாளர் கணக்கின் கீழ் பல பிஜி கிளைகளை இணைத்து, தனித்தனியாக ஊழியர்களை நியமித்து நிர்வகிக்கலாம்.'
    },
    {
      q: language === 'en' ? 'Is the platform available on Android, iOS, and Web?' : 'ஆண்ட்ராய்டு, ஐபோன் மற்றும் கணினியில் வேலை செய்யுமா?',
      a: language === 'en'
        ? 'Yes! The responsive cloud platform works seamlessly across Android mobile browsers, iPhone/iPad, laptops, and desktop computers. Request a demo and our support team will configure your property setup in 10 minutes.'
        : 'ஆம்! மொபைல், டேப்லெட் மற்றும் கணினி என அனைத்து சாதனங்களிலும் தடையின்றி இயங்கும்.'
    }
  ];


  return (
    <div className="landing-page-root">
      <div id="home" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div className="landing-page-content">
        {/* ========================================================================= */}
        {/* HEADER: STICKY AT TOP OF PAGE                                            */}
        {/* ========================================================================= */}
        <div id="saas-page" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
          <Header
            isLoggedIn={false}
            currentRole="owner"
            onRoleChange={() => { }}
            language={language}
            onLanguageToggle={onLanguageToggle}
            properties={[]}
            selectedPropertyId=""
            onSelectProperty={() => { }}
            onOpenLogin={onOpenLogin}
            onOpenSignUp={onStartTrial}
            onLogout={() => { }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 1. HERO SECTION: FLOATING OVER UNIFIED PANORAMIC PLATFORM BACKGROUND     */}
        {/* ========================================================================= */}
        <ScrollVideoShowcase language={language}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
            {/* Left-Aligned Hero Content Box */}
            <div style={{ maxWidth: '780px', textAlign: 'left', marginBottom: '2.5rem' }}>
              {/* Trust Badge Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#ffffff',
                color: '#9e3f1b',
                border: '1.5px solid #a3431e',
                padding: '0.45rem 1.15rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 750,
                marginBottom: '1.35rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
              }}>
                <Home size={16} color="#9e3f1b" strokeWidth={2.4} />
                <span>{language === 'en' ? 'Smart PG & Hostel Management' : 'ஸ்மார்ட் பிஜி & விடுதி மேலாண்மை'}</span>
              </div>

              {/* Main Headline with Editorial Serif & Warm Terracotta Highlight */}
              <h1 style={{
                fontFamily: "'Fraunces', 'DM Serif Display', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3.1rem, 5.8vw, 4.8rem)',
                color: '#ffffff',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                margin: '0 0 1.25rem 0',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.45)'
              }}>
                {language === 'en' ? (
                  <>
                    Manage Your<br />
                    <span style={{ color: '#b95028' }}>PG or Hostel</span><br />
                    in One Place
                  </>
                ) : (
                  <>
                    உங்கள் பிஜி அல்லது விடுதியை<br />
                    <span style={{ color: '#b95028' }}>ஒரே இடத்தில்</span><br />
                    நிர்வகியுங்கள்
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.08rem',
                color: '#ffffff',
                lineHeight: 1.6,
                fontWeight: 500,
                margin: '0 0 1.85rem 0',
                maxWidth: '640px',
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.5)'
              }}>
                {language === 'en'
                  ? 'Simplify tenant management, room allocation, rent collection, visitor tracking and staff management — all in one secure platform.'
                  : 'படுக்கை ஒதுக்கீடு, வாடகை வசூல், பார்வையாளர் வருகை மற்றும் பணியாளர் மேலாண்மை — அனைத்தும் ஒரே பாதுகாப்பான தளத்தில்.'}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.35rem' }}>
                <button
                  onClick={onStartTrial}
                  style={{
                    padding: '0.95rem 1.85rem',
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    background: '#a3431e',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 24px rgba(163, 67, 30, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LayoutGrid size={18} />
                  <span>{language === 'en' ? 'Create PG Owner Account' : 'கணக்கு தொடங்க'}</span>
                  <ArrowRight size={18} />
                </button>

                <a
                  href="#demo"
                  style={{
                    padding: '0.95rem 1.85rem',
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    border: '2px solid #a3431e',
                    color: '#a3431e',
                    background: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Phone size={18} color="#a3431e" />
                  <span>{language === 'en' ? 'Request a Demo' : 'டெமோ பார்க்க'}</span>
                </a>
              </div>

              {/* 5 Portals Quick Bar (Strict Single-Line Straight Horizontal Layout) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                marginBottom: '1.25rem',
                width: 'max-content',
                maxWidth: '100%'
              }}>
                <button
                  type="button"
                  onClick={() => onOpenLogin('superadmin')}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '9999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={14} color="#6366f1" />
                  <span>Super Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin('owner')}
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '9999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <Building size={14} color="#2563eb" />
                  <span>PG Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin('warden')}
                  style={{
                    background: '#ffffff',
                    color: '#064e3b',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '9999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <Users size={14} color="#059669" />
                  <span>Manager / Warden</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin('accountant')}
                  style={{
                    background: '#ffffff',
                    color: '#c2410c',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '9999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <FileText size={14} color="#ea580c" />
                  <span>Accountant</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLogin('resident')}
                  style={{
                    background: '#ffffff',
                    color: '#db2777',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    borderRadius: '9999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  <User size={14} color="#db2777" />
                  <span>Tenant</span>
                </button>
              </div>

              {/* 3 Checkmark Trust Badges (Solid Terracotta Circles with White Check & White Text) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.45rem',
                flexWrap: 'wrap',
                fontSize: '0.92rem',
                color: '#ffffff',
                marginBottom: '1rem',
                fontWeight: 650,
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#a3431e',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  <span>{language === 'en' ? '14-Day Free Trial' : '14 நாள் இலவச சோதனை'}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#a3431e',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  <span>{language === 'en' ? 'No Credit Card Required' : 'கிரெடிட் கார்டு தேவையில்லை'}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#a3431e',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  <span>{language === 'en' ? 'Setup in 10 Minutes' : '10 நிமிடங்களில் தயார்'}</span>
                </span>
              </div>
            </div>

            {/* 4 Floating Porcelain Glass Cards (Exact Match to Screenshot) */}
            <div className="hero-porcelain-grid">
              {/* Card 1: 100% Dispute-Free Rent Split */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                padding: '1.25rem 1.45rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                textAlign: 'left',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#fff7ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(254, 215, 170, 0.5)'
                }}>
                  <Wallet size={24} color="#964322" />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Newsreader', 'Playfair Display', Georgia, serif",
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em'
                  }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.3 }}>
                    Dispute-Free<br />Rent Split
                  </div>
                </div>
              </div>

              {/* Card 2: 10 Mins WhatsApp Tenant Onboarding */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                padding: '1.25rem 1.45rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                textAlign: 'left',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(167, 243, 208, 0.5)'
                }}>
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    <path d="M9.5 9.5c.3.8.8 1.4 1.4 1.9.7.6 1.4.9 2.1 1.1l.8-.8c.2-.2.5-.2.7-.1l1.6.8c.3.1.4.4.4.7v1.4c0 .5-.4.9-.9.9-4.7 0-8.5-3.8-8.5-8.5 0-.5.4-.9.9-.9h1.4c.3 0 .6.1.7.4l.8 1.6c.1.2.1.5-.1.7l-.8.8z" fill="#16a34a" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Newsreader', 'Playfair Display', Georgia, serif",
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em'
                  }}>
                    10 Mins
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.3 }}>
                    WhatsApp Tenant<br />Onboarding
                  </div>
                </div>
              </div>

              {/* Card 3: Tamil + English Bilingual Warden Usability */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                padding: '1.25rem 1.45rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                textAlign: 'left',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#f5f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(221, 214, 254, 0.5)'
                }}>
                  <Globe size={24} color="#7c3aed" />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Newsreader', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.25rem, 1.45vw, 1.55rem)',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap'
                  }}>
                    Tamil + English
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.3 }}>
                    Bilingual Warden<br />Usability
                  </div>
                </div>
              </div>

              {/* Card 4: 0 Fake UTRs Reconciliation Shield */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                padding: '1.25rem 1.45rem',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
                textAlign: 'left',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(191, 219, 254, 0.5)'
                }}>
                  <ShieldCheck size={24} color="#0284c7" />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Newsreader', 'Playfair Display', Georgia, serif",
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em'
                  }}>
                    0 Fake UTRs
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.3 }}>
                    Reconciliation<br />Shield
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollVideoShowcase>

        {/* ========================================================================= */}
        {/* ALL SECTIONS BELOW HERO: Features user-uploaded luxury PG background      */}
        {/* ========================================================================= */}
        <div className="all-sections-bg-container">
          <div id="about" style={{ position: 'relative', top: '-70px' }} />
          {/* 2. UYAR TECH SMARTPHONE SCROLLING SHOWCASE & INTERACTIVE SCREENS          */}
          <PhoneInteractiveShowcase
          language={language}
          onStartTrial={onStartTrial}
          onOpenLogin={onOpenLogin}
        />

        {/* ========================================================================= */}
        {/* PG OWNER REGISTRATION — 4-TIER VERIFICATION & TRUST DETAILS SECTION       */}
        {/* ========================================================================= */}
        <section id="owner-verification" style={{
          maxWidth: '1240px',
          margin: '3rem auto 4.5rem auto',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 5
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '24px',
            padding: '3rem 2.25rem',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12)'
          }}>
            {/* Header Badge & Title */}
            <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2.75rem auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
                textTransform: 'uppercase'
              }}>
                <ShieldCheck size={16} color="#2563eb" />
                <span>{language === 'en' ? 'PG OWNER REGISTRATION PROTOCOL' : 'உரிமையாளர் பதிவு மற்றும் சரிபார்ப்பு'}</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                margin: '0 0 0.85rem 0',
                lineHeight: 1.2
              }}>
                {language === 'en' ? (
                  <>
                    PG Owner Registration — <span style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verification Details</span>
                  </>
                ) : (
                  <>
                    பிஜி உரிமையாளர் பதிவு — <span style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>முழுமையான சரிபார்ப்பு முறை</span>
                  </>
                )}
              </h2>

              <p style={{
                fontSize: '1.05rem',
                color: '#475569',
                margin: 0,
                lineHeight: 1.6,
                fontWeight: 500
              }}>
                {language === 'en'
                  ? 'To prevent fraudulent listings and maintain bank-grade safety, every PG owner on UYAR completes a verified 4-tier onboarding with autonomous suspicious-registration detection reviewed by the Super Admin.'
                  : 'பாதுகாப்பான பிஜி தங்குமிடங்களுக்கு 4 அடுக்கு சரிபார்ப்பு மற்றும் தானியங்கி பாதுகாப்பு முறை மூலம் போலி பதிவுகள் தடுக்கப்படுகின்றன.'}
              </p>
            </div>

            {/* 4 Verification Tiers Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              {/* 1. Owner Identity Verification */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #dbeafe',
                borderRadius: '18px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}>
                  <UserCheck size={22} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Tier 1
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
                  1. Owner Identity Verification
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.7, flex: 1 }}>
                  <li><strong>Full legal name</strong> (as on official records)</li>
                  <li><strong>Mobile number + OTP verification</strong></li>
                  <li><strong>Email verification</strong> for monthly audits</li>
                  <li><strong>Government ID type and verification</strong> (Aadhaar, PAN, Voter ID, Passport, DL)</li>
                  <li><strong>Owner photograph</strong> (based on verification policy)</li>
                </ul>
              </div>

              {/* 2. PG Existence Verification */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #bbf7d0',
                borderRadius: '18px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                }}>
                  <Building2 size={22} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Tier 2
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
                  2. PG Existence Verification
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.7, flex: 1 }}>
                  <li><strong>Official PG / Hostel name</strong></li>
                  <li><strong>Complete property address & PIN code</strong></li>
                  <li><strong>Google Maps location or GPS pin</strong></li>
                  <li><strong>Number of floors, rooms and beds</strong></li>
                  <li><strong>Boys / Girls / Co-living designation</strong></li>
                  <li><strong>PG building and entrance photos</strong></li>
                  <li><strong>PG signboard photo</strong>, if available</li>
                </ul>
              </div>

              {/* 3. Ownership / Authorization Check */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #ddd6fe',
                borderRadius: '18px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
                }}>
                  <FileCheck size={22} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Tier 3
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
                  3. Ownership / Authorization Check
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.7, flex: 1 }}>
                  <li><strong>Property owner vs Authorized manager?</strong></li>
                  <li><strong>Property ownership proof</strong> (tax receipt, electricity bill, sale deed)</li>
                  <li><strong>Rental / lease agreement</strong> or owner authorization, if rented</li>
                  <li><strong>Property manager authorization document</strong>, if applicable</li>
                </ul>
              </div>

              {/* 4. Operational Verification */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                borderRadius: '18px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 8px 24px rgba(249, 115, 22, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(234,88,12,0.3)'
                }}>
                  <Clock size={22} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Tier 4
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
                  4. Operational Verification
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.7, flex: 1 }}>
                  <li><strong>Is the PG currently operational?</strong></li>
                  <li><strong>When did it start operating?</strong> (Year)</li>
                  <li><strong>How many tenants are currently staying?</strong></li>
                  <li><strong>Is the PG accepting new tenants?</strong></li>
                  <li><strong>Contact number displayed for enquiries</strong></li>
                  <li><strong>Relevant local registrations or licences</strong> (FSSAI, Trade, Police NOC)</li>
                </ul>
              </div>
            </div>

            {/* Suspicious-Registration Detection Banner & Interactive Matrix */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 850, color: '#ffffff' }}>
                      Automated Suspicious-Registration Detection Engine
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                      These checks run automatically during registration and are reviewed by the Super Admin control tower.
                    </div>
                  </div>
                </div>

                <span style={{
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#fca5a5',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  REAL-TIME PRE-SUBMISSION AUDIT
                </span>
              </div>

              {/* Exact Suspicious Activity & Action Table */}
              <div style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '14px',
                overflow: 'hidden',
                background: 'rgba(15, 23, 42, 0.65)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#93c5fd', borderBottom: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800 }}>Suspicious Activity Check</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800 }}>Automated System Action</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, textAlign: 'center' }}>Super Admin Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { act: 'Same phone number or email used for multiple owner accounts', action: 'Flag for review' },
                      { act: 'Duplicate PG address or property already registered', action: "Check for duplicate ownership; don't auto-reject" },
                      { act: 'Invalid OTP or repeated verification failures', action: 'Temporarily restrict attempts' },
                      { act: 'Missing or unreadable property documents', action: 'Request resubmission' },
                      { act: 'PG photos reused across unrelated properties', action: 'Flag for manual review' },
                      { act: 'Property address cannot be verified', action: 'Request additional evidence' },
                      { act: 'False or inconsistent registration details', action: 'Hold approval for review' }
                    ].map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        style={{ 
                          borderBottom: rIdx < 6 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                          background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '0.8rem 1.25rem', color: '#f1f5f9', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
                            <span>{row.act}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.8rem 1.25rem' }}>
                          <span style={{
                            display: 'inline-block',
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            color: '#38bdf8',
                            fontSize: '0.78rem',
                            fontWeight: 750,
                            padding: '0.2rem 0.65rem',
                            borderRadius: '6px'
                          }}>
                            {row.action}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1.25rem', textAlign: 'center' }}>
                          <span style={{ color: '#86efac', fontSize: '0.78rem', fontWeight: 700 }}>
                            ✓ Live Inspection
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct Action Call to Action */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.75rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 850, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  {language === 'en' ? 'Ready to Register Your PG with 14-Day Free Access?' : 'உங்கள் பிஜி-யை உடனே பதிவு செய்ய தயாரா?'}
                </h4>
                <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                  {language === 'en'
                    ? 'Start your 4-tier verified onboarding in 5 minutes. No credit card required.'
                    : '5 நிமிடங்களில் எளிய 4 அடுக்கு சரிபார்ப்பை முடித்து பணியகத்தை தொடங்கவும்.'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onStartTrial}
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.75rem',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <UserCheck size={18} />
                  <span>{language === 'en' ? 'Start PG Owner Verification Registration' : 'உரிமையாளர் சரிபார்ப்பு பதிவு தொடங்க'}</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenLogin('owner')}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.85rem 1.35rem',
                    fontSize: '0.96rem',
                    fontWeight: 750,
                    borderRadius: '12px',
                    borderColor: '#cbd5e1',
                    background: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Lock size={16} color="#2563eb" />
                  <span>{language === 'en' ? 'PG Owner Login' : 'உரிமையாளர் உள்நுழைவு'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HOW IT WORKS: 4-STEP TIMELINE & STEPPER                                */}
        {/* ========================================================================= */}
        <section id="features" className="how-it-works-hero-section">
          <span id="how-it-works" style={{ position: 'absolute', top: '-80px', left: 0 }} />
          <span id="work" style={{ position: 'absolute', top: '-80px', left: 0 }} />

          <div className="how-it-works-content-wrap">
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '3.75rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.38rem 1rem',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                color: '#2563eb',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.9rem'
              }}>
                <Sparkles size={15} /> {language === 'en' ? 'HOW IT WORKS' : 'எவ்வாறு செயல்படுகிறது?'}
              </div>
              <h2 style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 2.85rem)',
                color: 'var(--primary-900)',
                fontWeight: 850,
                letterSpacing: '-0.025em',
                marginBottom: '0.85rem',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}>
                {language === 'en' ? 'Get Started in 4 Simple Steps' : 'எளிய 4 படிகளில் உங்கள் பிஜி ஆன்லைனில்'}
              </h2>
              <p style={{
                color: '#334155',
                fontSize: '1.08rem',
                fontWeight: 500,
                maxWidth: '640px',
                margin: '0 auto',
                lineHeight: 1.6,
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}>
                {language === 'en'
                  ? 'From registration to automated rent collection in less than 10 minutes. Zero complicated training needed.'
                  : 'பதிவு செய்வதிலிருந்து தானியங்கி வாடகை வசூல் வரை 10 நிமிடங்களில். கடினமான பயிற்சிகள் தேவையில்லை.'}
              </p>
            </div>

            {/* Zig-Zag Alternating Horizontal Timeline (Image 1 Structure) */}
            <div className="zigzag-timeline-wrapper">
              {/* DESKTOP 4-COLUMN ROW WITH MATHEMATICALLY ANCHORED Y=200px TRACK */}
              <div className="zigzag-desktop-row">
                {/* The Central Horizontal Track Line with Right Arrow */}
                <div className="zigzag-track-line">
                  <div className="zigzag-track-arrow">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ filter: 'drop-shadow(0 2px 6px rgba(217, 119, 6, 0.35))' }}>
                      <polygon points="6,5 18,17 6,29" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
                      <polygon points="15,5 27,17 15,29" fill="#d97706" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* COLUMN 1: STEP 01 (DOWN) */}
                <div className="zigzag-col">
                  {/* Top Zone: Spacer */}
                  <div className="zigzag-zone-top" />

                  {/* Mid Zone: Connector Down */}
                  <div className="zigzag-zone-mid">
                    <div className="zigzag-node" style={{ background: '#0284c7' }} />
                    <div className="zigzag-stalk-down" style={{ background: '#0284c7' }} />
                    <div className="zigzag-number-down" style={{ color: '#0284c7' }}>01</div>
                    <div className="zigzag-arrow-down" style={{ borderTop: '11px solid #0284c7' }} />
                  </div>

                  {/* Bot Zone: Card with Fluid Backdrop Aura */}
                  <div className="zigzag-zone-bot">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Fluid Organic Liquid Backdrop (Peeking out behind card) */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-12px',
                          right: '-10px',
                          bottom: '-12px',
                          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.75) 0%, rgba(2, 132, 199, 0.55) 100%)',
                          borderRadius: '28px 52px 38px 24px',
                          filter: 'blur(3px)',
                          opacity: 0.85,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      <div
                        className="zigzag-card"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 55%, #e0f2fe 100%)',
                          border: '1.5px solid #bae6fd',
                          boxShadow: '0 14px 30px -6px rgba(2, 132, 199, 0.22), 0 2px 8px rgba(0, 0, 0, 0.03)',
                          borderRadius: '22px',
                          padding: '1.1rem 1.25rem',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decorative Inner Fluid Aura */}
                        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '110px', height: '110px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(2, 132, 199, 0.15) 70%, transparent 100%)', filter: 'blur(12px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ marginBottom: '0.35rem' }}>
                              <span style={{ display: 'inline-block', background: '#dbeafe', color: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                                {language === 'en' ? 'STEP 01' : 'படி 01'}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0', lineHeight: 1.25 }}>
                              {language === 'en' ? 'Create your account' : 'கணக்கை தொடங்குங்கள்'}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.65rem 0', fontWeight: 600, lineHeight: 1.35 }}>
                              {language === 'en' ? 'Quick 30-sec mobile signup' : '30 நொடி விரைவுப் பதிவு'}
                            </p>
                            <button
                              onClick={onStartTrial}
                              style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                padding: '0.4rem 0.95rem',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                                cursor: 'pointer'
                              }}
                            >
                              <UserCheck size={13} />
                              <span>{language === 'en' ? 'Zero credit card' : 'இலவச சோதனை'}</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>

                          {/* 3D Visual Document Badge with Checkmark */}
                          <div style={{ position: 'relative', width: '68px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: '54px', height: '66px', background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '12px', boxShadow: '0 8px 22px -3px rgba(2, 132, 199, 0.25)', border: '1.5px solid #e0f2fe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.35)' }}>
                                <User size={14} color="#ffffff" strokeWidth={2.5} />
                              </div>
                              <div style={{ width: '32px', height: '3.5px', background: '#bae6fd', borderRadius: '3px' }} />
                              <div style={{ width: '22px', height: '3px', background: '#e0f2fe', borderRadius: '3px' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(2, 132, 199, 0.45)', zIndex: 2 }}>
                              <Check size={13} color="#ffffff" strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: STEP 02 (UP) */}
                <div className="zigzag-col">
                  {/* Top Zone: Card with Fluid Backdrop Aura */}
                  <div className="zigzag-zone-top">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Fluid Organic Liquid Backdrop */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '-10px',
                          right: '-12px',
                          bottom: '-8px',
                          background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.75) 0%, rgba(124, 58, 237, 0.55) 100%)',
                          borderRadius: '44px 28px 46px 32px',
                          filter: 'blur(3px)',
                          opacity: 0.85,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      <div
                        className="zigzag-card"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
                          border: '1.5px solid #e9d5ff',
                          boxShadow: '0 14px 30px -6px rgba(124, 58, 237, 0.22), 0 2px 8px rgba(0, 0, 0, 0.03)',
                          borderRadius: '22px',
                          padding: '1.1rem 1.25rem',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decorative Inner Fluid Aura */}
                        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '110px', height: '110px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(124, 58, 237, 0.15) 70%, transparent 100%)', filter: 'blur(12px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ marginBottom: '0.35rem' }}>
                              <span style={{ display: 'inline-block', background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                                {language === 'en' ? 'STEP 02' : 'படி 02'}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0', lineHeight: 1.25 }}>
                              {language === 'en' ? 'Add rooms & beds' : 'அறைகள் & படுக்கைகள்'}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.65rem 0', fontWeight: 600, lineHeight: 1.35 }}>
                              {language === 'en' ? 'Map room types, pricing & sharing' : 'நேரடி படுக்கை நிலவர அமைப்பு'}
                            </p>
                            <a
                              href="#rooms"
                              style={{
                                background: '#7c3aed',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                padding: '0.4rem 0.95rem',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)',
                                textDecoration: 'none'
                              }}
                            >
                              <Building size={13} />
                              <span>{language === 'en' ? 'Visual bed matrix' : 'படுக்கை நிலவரம்'}</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>

                          {/* 3D Isometric Bed SVG Graphic */}
                          <div style={{ position: 'relative', width: '74px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" style={{ filter: 'drop-shadow(0 8px 18px rgba(124, 58, 237, 0.35))' }}>
                              {/* Headboard back */}
                              <polygon points="34,16 56,28 56,21 34,9" fill="#7c3aed" />
                              <polygon points="12,28 34,16 34,9 12,21" fill="#6d28d9" />
                              {/* Bed Base / Frame */}
                              <polygon points="12,28 34,16 56,28 34,40" fill="#a855f7" />
                              {/* Pillows */}
                              <polygon points="20,24 28,19 34,22 26,27" fill="#ffffff" stroke="#ddd6fe" strokeWidth="0.8" />
                              <polygon points="32,22 40,18 46,21 38,25" fill="#ffffff" stroke="#ddd6fe" strokeWidth="0.8" />
                              {/* Folded Sheet Top */}
                              <polygon points="14,31 34,20 54,31 34,42" fill="#9333ea" />
                              <polygon points="18,34 34,25 50,34 34,43" fill="#c084fc" />
                              {/* Mattress Sides */}
                              <polygon points="14,31 34,42 34,50 14,39" fill="#6b21a8" />
                              <polygon points="34,42 54,31 54,39 34,50" fill="#581c87" />
                              {/* Sparkles */}
                              <circle cx="58" cy="14" r="2.2" fill="#c084fc" opacity="0.9" />
                              <circle cx="63" cy="20" r="1.3" fill="#e9d5ff" opacity="0.95" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mid Zone: Connector Up */}
                  <div className="zigzag-zone-mid">
                    <div className="zigzag-arrow-up" style={{ borderBottom: '11px solid #7c3aed' }} />
                    <div className="zigzag-number-up" style={{ color: '#7c3aed' }}>02</div>
                    <div className="zigzag-stalk-up" style={{ background: '#7c3aed' }} />
                    <div className="zigzag-node" style={{ background: '#7c3aed' }} />
                  </div>

                  {/* Bot Zone: Spacer */}
                  <div className="zigzag-zone-bot" />
                </div>

                {/* COLUMN 3: STEP 03 (DOWN) */}
                <div className="zigzag-col">
                  {/* Top Zone: Spacer */}
                  <div className="zigzag-zone-top" />

                  {/* Mid Zone: Connector Down */}
                  <div className="zigzag-zone-mid">
                    <div className="zigzag-node" style={{ background: '#e11d48' }} />
                    <div className="zigzag-stalk-down" style={{ background: '#e11d48' }} />
                    <div className="zigzag-number-down" style={{ color: '#e11d48' }}>03</div>
                    <div className="zigzag-arrow-down" style={{ borderTop: '11px solid #e11d48' }} />
                  </div>

                  {/* Bot Zone: Card with Fluid Backdrop Aura */}
                  <div className="zigzag-zone-bot">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Fluid Organic Liquid Backdrop */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-12px',
                          right: '-10px',
                          bottom: '-12px',
                          background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.75) 0%, rgba(225, 29, 72, 0.55) 100%)',
                          borderRadius: '28px 50px 36px 48px',
                          filter: 'blur(3px)',
                          opacity: 0.85,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      <div
                        className="zigzag-card"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 55%, #ffe4e6 100%)',
                          border: '1.5px solid #fecdd3',
                          boxShadow: '0 14px 30px -6px rgba(225, 29, 72, 0.22), 0 2px 8px rgba(0, 0, 0, 0.03)',
                          borderRadius: '22px',
                          padding: '1.1rem 1.25rem',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decorative Inner Fluid Aura */}
                        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '110px', height: '110px', background: 'radial-gradient(circle, rgba(251, 113, 133, 0.45) 0%, rgba(225, 29, 72, 0.15) 70%, transparent 100%)', filter: 'blur(12px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ marginBottom: '0.35rem' }}>
                              <span style={{ display: 'inline-block', background: '#ffe4e6', color: '#e11d48', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                                {language === 'en' ? 'STEP 03' : 'படி 03'}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0', lineHeight: 1.25 }}>
                              {language === 'en' ? 'Onboard your tenants' : 'வாடகைதாரர் பதிவு'}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.65rem 0', fontWeight: 600, lineHeight: 1.35 }}>
                              {language === 'en' ? 'Instant KYC & rent rules' : 'விரைவு KYC & வாடகை விதி'}
                            </p>
                            <a
                              href="#calculator"
                              style={{
                                background: '#e11d48',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                padding: '0.4rem 0.95rem',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)',
                                textDecoration: 'none'
                              }}
                            >
                              <Users size={13} />
                              <span>{language === 'en' ? 'Automated EB split' : 'மின் கட்டணப் பகிர்வு'}</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>

                          {/* 3D Visual Tenant ID Card with Green Checkmark */}
                          <div style={{ position: 'relative', width: '68px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: '54px', height: '66px', background: 'linear-gradient(145deg, #ffffff 0%, #fff1f2 100%)', borderRadius: '12px', boxShadow: '0 8px 22px -3px rgba(225, 29, 72, 0.25)', border: '1.5px solid #fecdd3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 2px 6px rgba(225, 29, 72, 0.35)' }}>
                                <User size={14} color="#ffffff" strokeWidth={2.5} />
                              </div>
                              <div style={{ width: '32px', height: '3.5px', background: '#fecdd3', borderRadius: '3px' }} />
                              <div style={{ width: '22px', height: '3px', background: '#ffe4e6', borderRadius: '3px' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(16, 185, 129, 0.45)', zIndex: 2 }}>
                              <Check size={13} color="#ffffff" strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 4: STEP 04 (UP) */}
                <div className="zigzag-col">
                  {/* Top Zone: Card with Fluid Backdrop Aura */}
                  <div className="zigzag-zone-top">
                    <div style={{ position: 'relative', width: '100%' }}>
                      {/* Fluid Organic Liquid Backdrop */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '-10px',
                          right: '-12px',
                          bottom: '-8px',
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.75) 0%, rgba(217, 119, 6, 0.55) 100%)',
                          borderRadius: '46px 28px 48px 34px',
                          filter: 'blur(3px)',
                          opacity: 0.85,
                          pointerEvents: 'none',
                          zIndex: 0
                        }}
                      />

                      <div
                        className="zigzag-card"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 55%, #fef3c7 100%)',
                          border: '1.5px solid #fde68a',
                          boxShadow: '0 14px 30px -6px rgba(217, 119, 6, 0.22), 0 2px 8px rgba(0, 0, 0, 0.03)',
                          borderRadius: '22px',
                          padding: '1.1rem 1.25rem',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Decorative Inner Fluid Aura */}
                        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '110px', height: '110px', background: 'radial-gradient(circle, rgba(250, 204, 21, 0.45) 0%, rgba(217, 119, 6, 0.15) 70%, transparent 100%)', filter: 'blur(12px)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ marginBottom: '0.35rem' }}>
                              <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                                {language === 'en' ? 'STEP 04' : 'படி 04'}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0', lineHeight: 1.25 }}>
                              {language === 'en' ? 'Bills & collection' : 'கட்டணம் & வசூல்'}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.65rem 0', fontWeight: 600, lineHeight: 1.35 }}>
                              {language === 'en' ? '1-tap WhatsApp UPI collection' : '1-டேப் வாட்ஸ்அப் வசூல்'}
                            </p>
                            <a
                              href="#demo"
                              style={{
                                background: '#d97706',
                                color: '#ffffff',
                                borderRadius: '9999px',
                                padding: '0.4rem 0.95rem',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                                textDecoration: 'none'
                              }}
                            >
                              <TrendingUp size={13} />
                              <span>{language === 'en' ? 'Instant profit reports' : 'நிகர லாப அறிக்கை'}</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>

                          {/* 3D Visual Invoice / Receipt with Rupee Badge */}
                          <div style={{ position: 'relative', width: '68px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ width: '54px', height: '66px', background: 'linear-gradient(145deg, #ffffff 0%, #fffbeb 100%)', borderRadius: '12px', boxShadow: '0 8px 22px -3px rgba(217, 119, 6, 0.25)', border: '1.5px solid #fde68a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px', marginBottom: '2px' }}>
                                <div style={{ width: '4px', height: '9px', background: '#fde68a', borderRadius: '1.5px' }} />
                                <div style={{ width: '4px', height: '15px', background: '#fbbf24', borderRadius: '1.5px' }} />
                                <div style={{ width: '4px', height: '22px', background: '#d97706', borderRadius: '1.5px' }} />
                              </div>
                              <div style={{ width: '32px', height: '3px', background: '#fde68a', borderRadius: '2px' }} />
                              <div style={{ width: '20px', height: '3px', background: '#fef3c7', borderRadius: '2px' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(245, 158, 11, 0.45)', color: '#ffffff', fontWeight: 900, fontSize: '12px', lineHeight: 1, zIndex: 2 }}>
                              ₹
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mid Zone: Connector Up */}
                  <div className="zigzag-zone-mid">
                    <div className="zigzag-arrow-up" style={{ borderBottom: '11px solid #d97706' }} />
                    <div className="zigzag-number-up" style={{ color: '#d97706' }}>04</div>
                    <div className="zigzag-stalk-up" style={{ background: '#d97706' }} />
                    <div className="zigzag-node" style={{ background: '#d97706' }} />
                  </div>

                  {/* Bot Zone: Spacer */}
                  <div className="zigzag-zone-bot" />
                </div>
              </div>

              {/* MOBILE STEPPER VIEW (< 960px) */}
              <div className="zigzag-mobile-stepper">
                {/* Continuous Multi-Color Gradient Timeline Line */}
                <div
                  className="zigzag-mobile-line"
                  style={{
                    background: 'linear-gradient(180deg, #0284c7 0%, #7c3aed 33%, #e11d48 66%, #d97706 100%)',
                    width: '5px'
                  }}
                >
                  <div className="zigzag-mobile-arrow" style={{ bottom: '-14px', left: '8px' }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <polygon points="4,5 11,17 18,5" fill="#d97706" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Mobile Step 1 */}
                <div className="zigzag-mobile-step">
                  <div className="zigzag-mobile-node" style={{ background: '#0284c7' }} />
                  <div className="zigzag-mobile-stalk" style={{ background: '#0284c7' }} />
                  <div className="zigzag-mobile-arrow-head" style={{ borderLeft: '8px solid #0284c7' }} />
                  <div
                    className="zigzag-card"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 55%, #e0f2fe 100%)',
                      border: '1.5px solid #bae6fd',
                      boxShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.2)',
                      borderRadius: '18px',
                      padding: '1rem 1.15rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <span style={{ display: 'inline-block', background: '#dbeafe', color: '#0284c7', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                            {language === 'en' ? 'STEP 01' : 'படி 01'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Create your account' : 'கணக்கை தொடங்குங்கள்'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.6rem 0', fontWeight: 600 }}>
                          {language === 'en' ? 'Quick 30-sec mobile signup' : '30 நொடி விரைவுப் பதிவு'}
                        </p>
                        <button
                          onClick={onStartTrial}
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.85rem',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 3px 10px rgba(2, 132, 199, 0.35)',
                            cursor: 'pointer'
                          }}
                        >
                          <UserCheck size={12} />
                          <span>{language === 'en' ? 'Zero credit card' : 'இலவச சோதனை'}</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>

                      {/* 3D Visual Document Badge */}
                      <div style={{ position: 'relative', width: '56px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: '46px', height: '56px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 16px -2px rgba(2, 132, 199, 0.25)', border: '1.5px solid #e0f2fe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <User size={11} color="#fff" />
                          </div>
                          <div style={{ width: '24px', height: '3px', background: '#bae6fd', borderRadius: '2px' }} />
                          <div style={{ width: '16px', height: '2.5px', background: '#e0f2fe', borderRadius: '2px' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '18px', height: '18px', borderRadius: '50%', background: '#0284c7', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)' }}>
                          <Check size={11} color="#fff" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Step 2 */}
                <div className="zigzag-mobile-step">
                  <div className="zigzag-mobile-node" style={{ background: '#7c3aed' }} />
                  <div className="zigzag-mobile-stalk" style={{ background: '#7c3aed' }} />
                  <div className="zigzag-mobile-arrow-head" style={{ borderLeft: '8px solid #7c3aed' }} />
                  <div
                    className="zigzag-card"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
                      border: '1.5px solid #e9d5ff',
                      boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.2)',
                      borderRadius: '18px',
                      padding: '1rem 1.15rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <span style={{ display: 'inline-block', background: '#f3e8ff', color: '#7c3aed', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                            {language === 'en' ? 'STEP 02' : 'படி 02'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Add rooms & beds' : 'அறைகள் & படுக்கைகள்'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.6rem 0', fontWeight: 600 }}>
                          {language === 'en' ? 'Map room types, pricing & sharing' : 'நேரடி படுக்கை நிலவர அமைப்பு'}
                        </p>
                        <a
                          href="#rooms"
                          style={{
                            background: '#7c3aed',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.85rem',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 3px 10px rgba(124, 58, 237, 0.35)',
                            textDecoration: 'none'
                          }}
                        >
                          <Building size={12} />
                          <span>{language === 'en' ? 'Visual bed matrix' : 'படுக்கை நிலவரம்'}</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>

                      {/* 3D Isometric Bed SVG Graphic */}
                      <div style={{ position: 'relative', width: '58px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="54" height="54" viewBox="0 0 68 68" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(124, 58, 237, 0.3))' }}>
                          <polygon points="34,16 56,28 56,21 34,9" fill="#7c3aed" />
                          <polygon points="12,28 34,16 34,9 12,21" fill="#6d28d9" />
                          <polygon points="12,28 34,16 56,28 34,40" fill="#a855f7" />
                          <polygon points="20,24 28,19 34,22 26,27" fill="#ffffff" stroke="#ddd6fe" strokeWidth="0.8" />
                          <polygon points="32,22 40,18 46,21 38,25" fill="#ffffff" stroke="#ddd6fe" strokeWidth="0.8" />
                          <polygon points="14,31 34,20 54,31 34,42" fill="#9333ea" />
                          <polygon points="18,34 34,25 50,34 34,43" fill="#c084fc" />
                          <polygon points="14,31 34,42 34,50 14,39" fill="#6b21a8" />
                          <polygon points="34,42 54,31 54,39 34,50" fill="#581c87" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Step 3 */}
                <div className="zigzag-mobile-step">
                  <div className="zigzag-mobile-node" style={{ background: '#e11d48' }} />
                  <div className="zigzag-mobile-stalk" style={{ background: '#e11d48' }} />
                  <div className="zigzag-mobile-arrow-head" style={{ borderLeft: '8px solid #e11d48' }} />
                  <div
                    className="zigzag-card"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 55%, #ffe4e6 100%)',
                      border: '1.5px solid #fecdd3',
                      boxShadow: '0 8px 24px -4px rgba(225, 29, 72, 0.2)',
                      borderRadius: '18px',
                      padding: '1rem 1.15rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <span style={{ display: 'inline-block', background: '#ffe4e6', color: '#e11d48', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                            {language === 'en' ? 'STEP 03' : 'படி 03'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Onboard your tenants' : 'வாடகைதாரர் பதிவு'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.6rem 0', fontWeight: 600 }}>
                          {language === 'en' ? 'Instant KYC & rent rules' : 'விரைவு KYC & வாடகை விதி'}
                        </p>
                        <a
                          href="#calculator"
                          style={{
                            background: '#e11d48',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.85rem',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 3px 10px rgba(225, 29, 72, 0.35)',
                            textDecoration: 'none'
                          }}
                        >
                          <Users size={12} />
                          <span>{language === 'en' ? 'Automated EB split' : 'மின் கட்டணப் பகிர்வு'}</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>

                      {/* 3D Visual Tenant ID Card */}
                      <div style={{ position: 'relative', width: '56px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: '46px', height: '56px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 16px -2px rgba(225, 29, 72, 0.25)', border: '1.5px solid #fecdd3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <User size={11} color="#fff" />
                          </div>
                          <div style={{ width: '24px', height: '3px', background: '#fecdd3', borderRadius: '2px' }} />
                          <div style={{ width: '16px', height: '2.5px', background: '#ffe4e6', borderRadius: '2px' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)' }}>
                          <Check size={11} color="#fff" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Step 4 */}
                <div className="zigzag-mobile-step">
                  <div className="zigzag-mobile-node" style={{ background: '#d97706' }} />
                  <div className="zigzag-mobile-stalk" style={{ background: '#d97706' }} />
                  <div className="zigzag-mobile-arrow-head" style={{ borderLeft: '8px solid #d97706' }} />
                  <div
                    className="zigzag-card"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 55%, #fef3c7 100%)',
                      border: '1.5px solid #fde68a',
                      boxShadow: '0 8px 24px -4px rgba(217, 119, 6, 0.2)',
                      borderRadius: '18px',
                      padding: '1rem 1.15rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: '0.35rem' }}>
                          <span style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                            {language === 'en' ? 'STEP 04' : 'படி 04'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Bills & collection' : 'கட்டணம் & வசூல்'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 0.6rem 0', fontWeight: 600 }}>
                          {language === 'en' ? '1-tap WhatsApp UPI collection' : '1-டேப் வாட்ஸ்அப் வசூல்'}
                        </p>
                        <a
                          href="#demo"
                          style={{
                            background: '#d97706',
                            color: '#ffffff',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.85rem',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 3px 10px rgba(217, 119, 6, 0.35)',
                            textDecoration: 'none'
                          }}
                        >
                          <TrendingUp size={12} />
                          <span>{language === 'en' ? 'Instant profit reports' : 'நிகர லாப அறிக்கை'}</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>

                      {/* 3D Visual Invoice / Receipt */}
                      <div style={{ position: 'relative', width: '56px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: '46px', height: '56px', background: '#ffffff', borderRadius: '10px', boxShadow: '0 6px 16px -2px rgba(217, 119, 6, 0.25)', border: '1.5px solid #fde68a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '5px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
                            <div style={{ width: '3px', height: '7px', background: '#fde68a', borderRadius: '1px' }} />
                            <div style={{ width: '3px', height: '12px', background: '#fbbf24', borderRadius: '1px' }} />
                            <div style={{ width: '3px', height: '18px', background: '#d97706', borderRadius: '1px' }} />
                          </div>
                          <div style={{ width: '24px', height: '2.5px', background: '#fde68a', borderRadius: '2px' }} />
                          <div style={{ width: '16px', height: '2px', background: '#fef3c7', borderRadius: '2px' }} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '18px', height: '18px', borderRadius: '50%', background: '#d97706', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(217, 119, 6, 0.4)', color: '#fff', fontSize: '10px', fontWeight: 900 }}>
                          ₹
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Launch CTA Banner */}
            <div className="how-it-works-cta-banner">
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                  {language === 'en' ? 'Ready to launch your PG in 10 minutes?' : '10 நிமிடங்களில் உங்கள் பிஜியை ஆன்லைனில் தொடங்க தயாரா?'}
                </div>
                <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>
                  {language === 'en' ? 'No upfront fees. Unlimited phone and WhatsApp support in Tamil & English.' : 'முன்பண கட்டணங்கள் இல்லை. தமிழ் மற்றும் ஆங்கிலத்தில் முழுமையான ஆதரவு.'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={onStartTrial}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '0.8rem 1.6rem',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{language === 'en' ? 'Start 14-Day Free Trial' : '14 நாள் இலவச சோதனை'}</span>
                  <ArrowRight size={17} />
                </button>
                <a
                  href="#demo"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#ffffff',
                    color: '#1e293b',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    padding: '0.8rem 1.4rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {language === 'en' ? 'Request Demo' : 'டெமோ முன்பதிவு'}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. UYAR TECH TRANSPARENT BED-PRICING CALCULATOR                          */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 4. SUBSCRIPTION PLANS & PRICING CARDS (IMAGE 2 DESIGN)                   */}
        {/* ========================================================================= */}
        <section id="pricing" style={{ background: 'transparent', padding: '5.5rem 1.5rem', border: 'none', position: 'relative' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#4f46e5',
                fontWeight: 800,
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                marginBottom: '0.85rem'
              }}>
                <span>SIMPLE</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>AFFORDABLE</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>POWERFUL</span>
              </div>

              <h2 style={{
                fontSize: '2.6rem',
                fontWeight: 900,
                color: '#090d16',
                margin: '0 0 0.6rem 0',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}>
                {language === 'en' ? (
                  <>Choose the Right Plan for <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your PG</span></>
                ) : (
                  <>உங்கள் பிஜிக்கு ஏற்ற <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>சிறந்த கட்டணத் திட்டம்</span></>
                )}
              </h2>

              <p style={{
                color: '#475569',
                fontSize: '1.08rem',
                maxWidth: '680px',
                margin: '0 auto 1.75rem auto',
                fontWeight: 500,
                lineHeight: 1.5
              }}>
                {language === 'en'
                  ? 'Flexible subscription plans designed for PG owners, hostels and co-living operators.'
                  : 'பிஜி உரிமையாளர்கள் மற்றும் விடுதி நடத்துநர்களுக்கான நெகிழ்வான சந்தா திட்டங்கள்.'}
              </p>

              {/* Monthly / Annual Billing Toggle with Save Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '0.3rem',
                borderRadius: '9999px',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
                gap: '0.25rem'
              }}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  style={{
                    background: billingCycle === 'monthly' ? '#4f46e5' : 'transparent',
                    color: billingCycle === 'monthly' ? '#ffffff' : '#64748b',
                    border: 'none',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '9999px',
                    fontWeight: 750,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: billingCycle === 'monthly' ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none'
                  }}
                >
                  {language === 'en' ? 'Monthly Billing' : 'மாதாந்திர கட்டணம்'}
                </button>

                <button
                  onClick={() => setBillingCycle('annual')}
                  style={{
                    background: billingCycle === 'annual' ? '#4f46e5' : 'transparent',
                    color: billingCycle === 'annual' ? '#ffffff' : '#64748b',
                    border: 'none',
                    padding: '0.55rem 1.35rem',
                    borderRadius: '9999px',
                    fontWeight: 750,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: billingCycle === 'annual' ? '0 4px 12px rgba(79, 70, 229, 0.35)' : 'none'
                  }}
                >
                  <span>{language === 'en' ? 'Annual Billing' : 'ஆண்டு கட்டணம்'}</span>
                  <span style={{
                    background: billingCycle === 'annual' ? 'rgba(255, 255, 255, 0.25)' : '#ecfdf5',
                    color: billingCycle === 'annual' ? '#ffffff' : '#059669',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    border: billingCycle === 'annual' ? 'none' : '1px solid #a7f3d0'
                  }}>
                    {language === 'en' ? 'Save 20%' : '20% சேமிப்பு'}
                  </span>
                </button>
              </div>

              {/* View Mode Toggle (3D Stacking Cards vs Grid) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1.15rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(226, 232, 240, 0.85)',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                  gap: '0.2rem'
                }}>
                  <button
                    onClick={() => setPricingView('stack')}
                    style={{
                      background: pricingView === 'stack' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                      color: pricingView === 'stack' ? '#ffffff' : '#64748b',
                      border: 'none',
                      padding: '0.45rem 1.15rem',
                      borderRadius: '9999px',
                      fontWeight: 750,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.2s ease',
                      boxShadow: pricingView === 'stack' ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                    }}
                  >
                    <Layers size={14} />
                    <span>{language === 'en' ? '3D Stacking Cards' : '3D அடுக்கு கார்டுகள்'}</span>
                  </button>

                  <button
                    onClick={() => setPricingView('grid')}
                    style={{
                      background: pricingView === 'grid' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                      color: pricingView === 'grid' ? '#ffffff' : '#64748b',
                      border: 'none',
                      padding: '0.45rem 1.15rem',
                      borderRadius: '9999px',
                      fontWeight: 750,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.2s ease',
                      boxShadow: pricingView === 'grid' ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none'
                    }}
                  >
                    <LayoutGrid size={14} />
                    <span>{language === 'en' ? '4-Column Grid' : '4-நெடுவரிசை கிரிட்'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Conditional Display: 3D Stacking Cards OR 4-Column Grid */}
            {pricingView === 'stack' ? (
              <div style={{ position: 'relative', marginTop: '1.25rem', marginBottom: '3.5rem' }}>
                {/* Visual Scroll Hint Pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.84rem',
                  fontWeight: 650,
                  color: '#4f46e5',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)'
                  }} />
                  <span>
                    {language === 'en'
                      ? 'Scroll mouse wheel or swipe up/down inside the cards to stack and compare plans'
                      : 'அனைத்து திட்டங்களையும் காண கார்டுகளின் மேல் ஸ்க்ரோல் செய்யவும்'}
                  </span>
                </div>

                <div style={{ height: 600, width: '100%', position: 'relative' }}>
                  <ScrollStack
                    itemDistance={90}
                    itemStackDistance={24}
                    stackPosition="8%"
                    itemScale={0.04}
                    baseScale={0.88}
                    dimAmount={0.12}
                    holdDistance={180}
                    smoothScroll={true}
                    snap={true}
                  >
                    {/* CARD 1: STARTER */}
                    <ScrollStackItem
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 243, 255, 0.94) 100%)',
                        border: '1.5px solid #c7d2fe',
                        boxShadow: '0 16px 36px -10px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.12)'
                      }}
                    >
                      <div className="scroll-stack-card-layout">
                        {/* Left Column: Brand, Price, Capacity & Button */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(99, 102, 241, 0.28))' }}>
                              <polygon points="12,32 30,42 30,54 12,44" fill="#818cf8" />
                              <polygon points="30,42 48,32 48,44 30,54" fill="#6366f1" />
                              <polygon points="8,30 30,16 30,28 8,42" fill="#c7d2fe" />
                              <polygon points="30,16 52,30 30,42 8,30" fill="#a5b4fc" />
                              <polygon points="30,28 52,42 48,44 30,30" fill="#4f46e5" />
                              <polygon points="38,18 43,15 43,24 38,27" fill="#6366f1" />
                              <polygon points="43,15 46,17 46,26 43,24" fill="#4f46e5" />
                              <polygon points="20,41 26,44 26,51 20,48" fill="#312e81" />
                              <polygon points="36,40 42,37 42,42 36,45" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="0.8" />
                              <circle cx="50" cy="14" r="2" fill="#818cf8" opacity="0.9" />
                            </svg>
                            <div>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                                {language === 'en' ? 'Starter' : 'தொடக்கத் திட்டம்'}
                              </h3>
                              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                                {language === 'en' ? 'Perfect for small PGs to get started' : 'சிறிய பிஜிகளுக்கு ஏற்ற எளிய தொடக்கம்'}
                              </p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.03em' }}>
                                {billingCycle === 'annual' ? '₹319' : '₹399'}
                              </span>
                              <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                              {billingCycle === 'annual' ? '₹3,828 billed annually (Save ₹960)' : 'Billed monthly, cancel anytime'}
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.35rem' }}>
                            <span style={{
                              display: 'inline-block',
                              background: '#eef2ff',
                              color: '#4f46e5',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '9999px',
                              border: '1px solid #c7d2fe'
                            }}>
                              {language === 'en' ? 'Up to 25 beds' : '25 படுக்கைகள் வரை'}
                            </span>
                          </div>

                          <button
                            onClick={onStartTrial}
                            style={{
                              background: '#4f46e5',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.4rem',
                              fontWeight: 750,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem'
                            }}
                          >
                            <span>{language === 'en' ? 'Choose Starter' : 'ஸ்டார்ட்டர் திட்டம்'}</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>

                        {/* Right Column: Features Checklist */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '18px',
                          padding: '1.35rem 1.5rem',
                          border: '1px solid rgba(224, 231, 255, 0.8)'
                        }}>
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: '#4f46e5',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.85rem'
                          }}>
                            {language === 'en' ? 'Included in Starter Plan' : 'ஸ்டார்ட்டர் திட்டத்தில் அடங்கியவை'}
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {[
                              language === 'en' ? 'Tenant management' : 'வாடகைதாரர் மேலாண்மை',
                              language === 'en' ? 'Rent collection & ledger' : 'வாடகை வசூல் & கணக்கு புத்தகம்',
                              language === 'en' ? 'Electricity & other bills' : 'மின்சாரம் & இதர கட்டணப் பகிர்வு',
                              language === 'en' ? 'PDF invoices & receipts' : 'PDF ரசீதுகள் & பில்கள்',
                              language === 'en' ? 'Manual payment reminders' : 'கட்டண நினைவூட்டல்'
                            ].map((feat, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)' }}>
                                  <Check size={11} color="#ffffff" strokeWidth={3} />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollStackItem>

                    {/* CARD 2: GROWTH (RECOMMENDED HERO) */}
                    <ScrollStackItem
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 241, 242, 0.94) 100%)',
                        border: '2px solid #fb7185',
                        boxShadow: '0 20px 48px -10px rgba(244, 63, 94, 0.32), 0 0 0 1px rgba(244, 63, 94, 0.2)'
                      }}
                    >
                      <div className="scroll-stack-card-layout">
                        {/* Left Column: Brand, Price, Capacity & Button */}
                        <div>
                          {/* Recommended Badge */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                            color: '#ffffff',
                            padding: '0.3rem 0.9rem',
                            borderRadius: '9999px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)',
                            marginBottom: '0.85rem'
                          }}>
                            <Crown size={13} fill="#ffffff" color="#ffffff" />
                            <span>{language === 'en' ? 'Most Recommended Plan' : 'பரிந்துரைக்கப்படும் திட்டம்'}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(244, 63, 94, 0.32))' }}>
                              <polygon points="10,40 18,35 18,50 10,55" fill="#fb7185" />
                              <polygon points="18,35 26,40 26,55 18,50" fill="#f43f5e" />
                              <polygon points="10,40 18,35 26,40 18,45" fill="#fda4af" />
                              <polygon points="22,30 30,25 30,50 22,55" fill="#f43f5e" />
                              <polygon points="30,25 38,30 38,55 30,50" fill="#e11d48" />
                              <polygon points="22,30 30,25 38,30 30,35" fill="#fb7185" />
                              <polygon points="34,20 42,15 42,50 34,55" fill="#e11d48" />
                              <polygon points="42,15 50,20 50,55 42,50" fill="#be123c" />
                              <polygon points="34,20 42,15 50,20 42,25" fill="#f43f5e" />
                              <path d="M12,32 L26,22 L36,26 L52,10" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                              <polygon points="44,8 54,9 53,19" fill="#e11d48" />
                            </svg>
                            <div>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                                {language === 'en' ? 'Growth' : 'வளர்ச்சித் திட்டம்'}
                              </h3>
                              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                                {language === 'en' ? 'For growing PGs with more tenants' : 'அதிக வாடகைதாரர்கள் கொண்ட பிஜிகளுக்கு'}
                              </p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.03em' }}>
                                {billingCycle === 'annual' ? '₹719' : '₹899'}
                              </span>
                              <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 600, marginTop: '0.15rem' }}>
                              {billingCycle === 'annual' ? '₹8,628 billed annually (Save ₹2,160)' : 'Most popular choice for 30–75 beds'}
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.35rem' }}>
                            <span style={{
                              display: 'inline-block',
                              background: '#ffe4e6',
                              color: '#e11d48',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '9999px',
                              border: '1px solid #fecdd3'
                            }}>
                              {language === 'en' ? 'Up to 75 beds' : '75 படுக்கைகள் வரை'}
                            </span>
                          </div>

                          <button
                            onClick={onStartTrial}
                            style={{
                              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.4rem',
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 6px 18px rgba(225, 29, 72, 0.38)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem'
                            }}
                          >
                            <span>{language === 'en' ? 'Choose Growth' : 'வளர்ச்சித் திட்டம் தொடங்கு'}</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>

                        {/* Right Column: Features Checklist */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.85)',
                          borderRadius: '18px',
                          padding: '1.35rem 1.5rem',
                          border: '1px solid #fda4af'
                        }}>
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: '#e11d48',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.85rem'
                          }}>
                            {language === 'en' ? 'Everything in Starter, plus:' : 'ஸ்டார்ட்டர் வசதிகளுடன் கூடுதலாக:'}
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {[
                              language === 'en' ? 'All Starter features' : 'அனைத்து ஸ்டார்ட்டர் வசதிகள்',
                              language === 'en' ? 'Automated workflows' : 'தானியங்கி செயல்முறை',
                              language === 'en' ? 'Advanced reports' : 'விரிவான லாப அறிக்கைகள்',
                              language === 'en' ? 'Staff management' : 'ஊழியர் மேலாண்மை',
                              language === 'en' ? 'Up to 2 properties' : '2 கட்டிடங்கள் வரை',
                              language === 'en' ? 'WhatsApp & email reminders' : 'வாட்ஸ்அப் & மின்னஞ்சல் நினைவூட்டல்'
                            ].map((feat, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(225, 29, 72, 0.35)' }}>
                                  <Check size={11} color="#ffffff" strokeWidth={3} />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollStackItem>

                    {/* CARD 3: BUSINESS */}
                    <ScrollStackItem
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.94) 100%)',
                        border: '1.5px solid #bae6fd',
                        boxShadow: '0 16px 36px -10px rgba(2, 132, 199, 0.2), 0 0 0 1px rgba(2, 132, 199, 0.12)'
                      }}
                    >
                      <div className="scroll-stack-card-layout">
                        {/* Left Column: Brand, Price, Capacity & Button */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(2, 132, 199, 0.28))' }}>
                              <polygon points="14,24 30,14 30,54 14,44" fill="#38bdf8" />
                              <polygon points="30,14 46,24 46,54 30,54" fill="#0284c7" />
                              <polygon points="14,24 30,14 46,24 30,34" fill="#bae6fd" />
                              <line x1="18" y1="28" x2="26" y2="33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <line x1="18" y1="34" x2="26" y2="39" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <line x1="18" y1="40" x2="26" y2="45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <line x1="34" y1="33" x2="42" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <line x1="34" y1="39" x2="42" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <line x1="34" y1="45" x2="42" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                              <polygon points="26,48 30,46 34,48 34,54 30,52 26,54" fill="#0369a1" />
                            </svg>
                            <div>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                                {language === 'en' ? 'Business' : 'வணிகத் திட்டம்'}
                              </h3>
                              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                                {language === 'en' ? 'For established PGs with multiple properties' : 'பல கிளைகள் கொண்ட பெரிய பிஜிகளுக்கு'}
                              </p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.03em' }}>
                                {billingCycle === 'annual' ? '₹1,599' : '₹1,999'}
                              </span>
                              <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                              {billingCycle === 'annual' ? '₹19,188 billed annually (Save ₹4,800)' : 'Billed monthly, priority queue'}
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.35rem' }}>
                            <span style={{
                              display: 'inline-block',
                              background: '#e0f2fe',
                              color: '#0284c7',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '9999px',
                              border: '1px solid #bae6fd'
                            }}>
                              {language === 'en' ? 'Up to 200 beds' : '200 படுக்கைகள் வரை'}
                            </span>
                          </div>

                          <button
                            onClick={onStartTrial}
                            style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.4rem',
                              fontWeight: 750,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem'
                            }}
                          >
                            <span>{language === 'en' ? 'Choose Business' : 'பிசினஸ் திட்டம்'}</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>

                        {/* Right Column: Features Checklist */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '18px',
                          padding: '1.35rem 1.5rem',
                          border: '1px solid rgba(186, 230, 253, 0.8)'
                        }}>
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: '#0284c7',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.85rem'
                          }}>
                            {language === 'en' ? 'Everything in Growth, plus:' : 'வளர்ச்சி திட்ட வசதிகளுடன் கூடுதலாக:'}
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {[
                              language === 'en' ? 'All Growth features' : 'அனைத்து வளர்ச்சி திட்ட வசதிகள்',
                              language === 'en' ? 'Multi-property management' : 'பல கட்டிடங்கள் ஒரே இடத்தில்',
                              language === 'en' ? 'Advanced analytics & reports' : 'முழுமையான நிதி பகுப்பாய்வு',
                              language === 'en' ? 'Staff permissions and roles' : 'ஊழியர் கட்டுப்பாடுகள் & உரிமைகள்',
                              language === 'en' ? 'Expense and financial reports' : 'செலவு மற்றும் வரவு அறிக்கைகள்',
                              language === 'en' ? 'Priority support' : 'முன்னுரிமை வாடிக்கையாளர் சேவை'
                            ].map((feat, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)' }}>
                                  <Check size={11} color="#ffffff" strokeWidth={3} />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollStackItem>

                    {/* CARD 4: ENTERPRISE */}
                    <ScrollStackItem
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 251, 235, 0.94) 100%)',
                        border: '1.5px solid #fde68a',
                        boxShadow: '0 16px 36px -10px rgba(217, 119, 6, 0.2), 0 0 0 1px rgba(217, 119, 6, 0.12)'
                      }}
                    >
                      <div className="scroll-stack-card-layout">
                        {/* Left Column: Brand, Price, Capacity & Button */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(217, 119, 6, 0.28))' }}>
                              <polygon points="12,28 26,18 26,54 12,44" fill="#fbbf24" />
                              <polygon points="26,18 40,28 40,54 26,54" fill="#f59e0b" />
                              <polygon points="12,28 26,18 40,28 26,38" fill="#fef08a" />
                              <polygon points="34,18 46,10 46,50 34,42" fill="#f59e0b" />
                              <polygon points="46,10 54,16 54,50 46,50" fill="#d97706" />
                              <polygon points="34,18 46,10 54,16 42,24" fill="#fde047" />
                              <circle cx="19" cy="30" r="1.5" fill="#78350f" opacity="0.75" />
                              <circle cx="19" cy="36" r="1.5" fill="#78350f" opacity="0.75" />
                              <circle cx="33" cy="36" r="1.5" fill="#78350f" opacity="0.75" />
                              <circle cx="33" cy="42" r="1.5" fill="#78350f" opacity="0.75" />
                              <circle cx="49" cy="22" r="1.5" fill="#ffffff" opacity="0.9" />
                              <circle cx="49" cy="28" r="1.5" fill="#ffffff" opacity="0.9" />
                              <circle cx="49" cy="34" r="1.5" fill="#ffffff" opacity="0.9" />
                            </svg>
                            <div>
                              <h3 style={{ fontSize: '1.45rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                                {language === 'en' ? 'Enterprise' : 'கார்ப்பரேட் திட்டம்'}
                              </h3>
                              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                                {language === 'en' ? 'For large PG chains and custom requirements' : 'பெரிய விடுதி சங்கிலிகள் மற்றும் தனிப்பயன் தேவை'}
                              </p>
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                              <span style={{ fontSize: '2.1rem', fontWeight: 900, color: '#d97706', letterSpacing: '-0.02em' }}>
                                {language === 'en' ? 'Custom pricing' : 'தனிப்பயன் விலை'}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                              {language === 'en' ? 'Tailored annual contract & dedicated SLA' : 'சிறப்பு ஒப்பந்தம் மற்றும் சேவை'}
                            </div>
                          </div>

                          <div style={{ marginBottom: '1.35rem' }}>
                            <span style={{
                              display: 'inline-block',
                              background: '#fef3c7',
                              color: '#d97706',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '0.35rem 0.85rem',
                              borderRadius: '9999px',
                              border: '1px solid #fde68a'
                            }}>
                              {language === 'en' ? '200+ beds' : '200+ படுக்கைகள்'}
                            </span>
                          </div>

                          <a
                            href="#contact"
                            style={{
                              background: '#d97706',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '0.75rem 1.4rem',
                              fontWeight: 750,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              textDecoration: 'none'
                            }}
                          >
                            <span>{language === 'en' ? 'Contact Sales' : 'தொடர்பு கொள்ள'}</span>
                            <ArrowRight size={15} />
                          </a>
                        </div>

                        {/* Right Column: Features Checklist */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '18px',
                          padding: '1.35rem 1.5rem',
                          border: '1px solid rgba(253, 230, 138, 0.8)'
                        }}>
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: '#d97706',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.85rem'
                          }}>
                            {language === 'en' ? 'Enterprise SLA & Infrastructure:' : 'கார்ப்பரேட் SLA & வசதிகள்:'}
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {[
                              language === 'en' ? 'All Business features' : 'அனைத்து பிசினஸ் வசதிகள்',
                              language === 'en' ? 'Custom onboarding' : 'நேரடி பயிற்சி & தரவு மாற்றம்',
                              language === 'en' ? 'Integrations (payment, ERP)' : 'வங்கி & ERP ஒருங்கிணைப்பு',
                              language === 'en' ? 'Dedicated account manager' : 'பிரத்யேக கணக்கு மேலாளர்',
                              language === 'en' ? 'SLA and tailored support' : 'உத்தரவாத சேவை SLA',
                              language === 'en' ? 'Advanced security & audit logs' : 'மேம்பட்ட பாதுகாப்பு & பதிவுகள்'
                            ].map((feat, idx) => (
                              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)' }}>
                                  <Check size={11} color="#ffffff" strokeWidth={3} />
                                </div>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollStackItem>
                  </ScrollStack>
                </div>
              </div>
            ) : (
              /* 4 Tiered Plan Cards Grid */
              <div className="pricing-grid">
                {/* CARD 1: STARTER */}
                <div
                  className="pricing-plan-card"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 243, 255, 0.88) 100%)',
                    border: '1.5px solid #e0e7ff',
                    boxShadow: '0 12px 30px -8px rgba(99, 102, 241, 0.12), 0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div>
                    {/* Top Icon & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                      {/* 3D Isometric House Icon */}
                      <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(99, 102, 241, 0.28))' }}>
                        <polygon points="12,32 30,42 30,54 12,44" fill="#818cf8" />
                        <polygon points="30,42 48,32 48,44 30,54" fill="#6366f1" />
                        <polygon points="8,30 30,16 30,28 8,42" fill="#c7d2fe" />
                        <polygon points="30,16 52,30 30,42 8,30" fill="#a5b4fc" />
                        <polygon points="30,28 52,42 48,44 30,30" fill="#4f46e5" />
                        <polygon points="38,18 43,15 43,24 38,27" fill="#6366f1" />
                        <polygon points="43,15 46,17 46,26 43,24" fill="#4f46e5" />
                        <polygon points="20,41 26,44 26,51 20,48" fill="#312e81" />
                        <polygon points="36,40 42,37 42,42 36,45" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="0.8" />
                        <circle cx="50" cy="14" r="2" fill="#818cf8" opacity="0.9" />
                      </svg>

                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Starter' : 'தொடக்கத் திட்டம்'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                          {language === 'en' ? 'Perfect for small PGs to get started' : 'சிறிய பிஜிகளுக்கு ஏற்ற எளிய தொடக்கம்'}
                        </p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '2.3rem', fontWeight: 900, color: '#4f46e5', letterSpacing: '-0.03em' }}>
                          {billingCycle === 'annual' ? '₹319' : '₹399'}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                        {billingCycle === 'annual' ? '₹3,828 billed annually (Save ₹960)' : 'Billed monthly, cancel anytime'}
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#eef2ff',
                        color: '#4f46e5',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid #c7d2fe'
                      }}>
                        {language === 'en' ? 'Up to 25 beds' : '25 படுக்கைகள் வரை'}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      {[
                        language === 'en' ? 'Tenant management' : 'வாடகைதாரர் மேலாண்மை',
                        language === 'en' ? 'Rent collection & ledger' : 'வாடகை வசூல் & கணக்கு புத்தகம்',
                        language === 'en' ? 'Electricity & other bills' : 'மின்சாரம் & இதர கட்டணப் பகிர்வு',
                        language === 'en' ? 'PDF invoices & receipts' : 'PDF ரசீதுகள் & பில்கள்',
                        language === 'en' ? 'Manual payment reminders' : 'கட்டண நினைவூட்டல்'
                      ].map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)' }}>
                            <Check size={11} color="#ffffff" strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Button */}
                  <button
                    onClick={onStartTrial}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#4f46e5',
                      border: '1.5px solid #c7d2fe',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontWeight: 750,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(99, 102, 241, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4f46e5';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#4f46e5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#4f46e5';
                      e.currentTarget.style.borderColor = '#c7d2fe';
                    }}
                  >
                    {language === 'en' ? 'Choose Starter' : 'ஸ்டார்ட்டர் திட்டம்'}
                  </button>
                </div>

                {/* CARD 2: GROWTH (RECOMMENDED HERO) */}
                <div
                  className="pricing-plan-card recommended-card"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 241, 242, 0.92) 100%)',
                    border: '2px solid #fda4af',
                    boxShadow: '0 18px 42px -10px rgba(244, 63, 94, 0.28), 0 4px 14px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  {/* Crown Recommended Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    color: '#ffffff',
                    padding: '0.35rem 1.15rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                    zIndex: 2
                  }}>
                    <Crown size={13} fill="#ffffff" color="#ffffff" />
                    <span>{language === 'en' ? 'Recommended' : 'பரிந்துரைக்கப்படுகிறது'}</span>
                  </div>

                  <div>
                    {/* Top Icon & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem', marginTop: '0.25rem' }}>
                      {/* 3D Isometric Growth Bar Chart Icon */}
                      <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(244, 63, 94, 0.32))' }}>
                        <polygon points="10,40 18,35 18,50 10,55" fill="#fb7185" />
                        <polygon points="18,35 26,40 26,55 18,50" fill="#f43f5e" />
                        <polygon points="10,40 18,35 26,40 18,45" fill="#fda4af" />
                        <polygon points="22,30 30,25 30,50 22,55" fill="#f43f5e" />
                        <polygon points="30,25 38,30 38,55 30,50" fill="#e11d48" />
                        <polygon points="22,30 30,25 38,30 30,35" fill="#fb7185" />
                        <polygon points="34,20 42,15 42,50 34,55" fill="#e11d48" />
                        <polygon points="42,15 50,20 50,55 42,50" fill="#be123c" />
                        <polygon points="34,20 42,15 50,20 42,25" fill="#f43f5e" />
                        <path d="M12,32 L26,22 L36,26 L52,10" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polygon points="44,8 54,9 53,19" fill="#e11d48" />
                      </svg>

                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Growth' : 'வளர்ச்சித் திட்டம்'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                          {language === 'en' ? 'For growing PGs with more tenants' : 'அதிக வாடகைதாரர்கள் கொண்ட பிஜிகளுக்கு'}
                        </p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '2.3rem', fontWeight: 900, color: '#e11d48', letterSpacing: '-0.03em' }}>
                          {billingCycle === 'annual' ? '₹719' : '₹899'}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#e11d48', fontWeight: 600, marginTop: '0.15rem' }}>
                        {billingCycle === 'annual' ? '₹8,628 billed annually (Save ₹2,160)' : 'Most popular choice for 30–75 beds'}
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#ffe4e6',
                        color: '#e11d48',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid #fecdd3'
                      }}>
                        {language === 'en' ? 'Up to 75 beds' : '75 படுக்கைகள் வரை'}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      {[
                        language === 'en' ? 'All Starter features' : 'அனைத்து ஸ்டார்ட்டர் வசதிகள்',
                        language === 'en' ? 'Automated workflows' : 'தானியங்கி செயல்முறை',
                        language === 'en' ? 'Advanced reports' : 'விரிவான லாப அறிக்கைகள்',
                        language === 'en' ? 'Staff management' : 'ஊழியர் மேலாண்மை',
                        language === 'en' ? 'Up to 2 properties' : '2 கட்டிடங்கள் வரை',
                        language === 'en' ? 'WhatsApp & email reminders' : 'வாட்ஸ்அப் & மின்னஞ்சல் நினைவூட்டல்'
                      ].map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(225, 29, 72, 0.35)' }}>
                            <Check size={11} color="#ffffff" strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Button */}
                  <button
                    onClick={onStartTrial}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.8rem',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 6px 18px rgba(225, 29, 72, 0.38)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(225, 29, 72, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(225, 29, 72, 0.38)';
                    }}
                  >
                    <span>{language === 'en' ? 'Choose Growth' : 'வளர்ச்சித் திட்டம் தொடங்கு'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* CARD 3: BUSINESS */}
                <div
                  className="pricing-plan-card"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 249, 255, 0.88) 100%)',
                    border: '1.5px solid #bae6fd',
                    boxShadow: '0 12px 30px -8px rgba(2, 132, 199, 0.12), 0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div>
                    {/* Top Icon & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                      {/* 3D Isometric Blue PG Glass Tower Icon */}
                      <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(2, 132, 199, 0.28))' }}>
                        <polygon points="14,24 30,14 30,54 14,44" fill="#38bdf8" />
                        <polygon points="30,14 46,24 46,54 30,54" fill="#0284c7" />
                        <polygon points="14,24 30,14 46,24 30,34" fill="#bae6fd" />
                        <line x1="18" y1="28" x2="26" y2="33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <line x1="18" y1="34" x2="26" y2="39" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <line x1="18" y1="40" x2="26" y2="45" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <line x1="34" y1="33" x2="42" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <line x1="34" y1="39" x2="42" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <line x1="34" y1="45" x2="42" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <polygon points="26,48 30,46 34,48 34,54 30,52 26,54" fill="#0369a1" />
                      </svg>

                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Business' : 'வணிகத் திட்டம்'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                          {language === 'en' ? 'For established PGs with multiple properties' : 'பல கிளைகள் கொண்ட பெரிய பிஜிகளுக்கு'}
                        </p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '2.3rem', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.03em' }}>
                          {billingCycle === 'annual' ? '₹1,599' : '₹1,999'}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>/ month</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                        {billingCycle === 'annual' ? '₹19,188 billed annually (Save ₹4,800)' : 'Billed monthly, priority queue'}
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#e0f2fe',
                        color: '#0284c7',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid #bae6fd'
                      }}>
                        {language === 'en' ? 'Up to 200 beds' : '200 படுக்கைகள் வரை'}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      {[
                        language === 'en' ? 'All Growth features' : 'அனைத்து வளர்ச்சி திட்ட வசதிகள்',
                        language === 'en' ? 'Multi-property management' : 'பல கட்டிடங்கள் ஒரே இடத்தில்',
                        language === 'en' ? 'Advanced analytics & reports' : 'முழுமையான நிதி பகுப்பாய்வு',
                        language === 'en' ? 'Staff permissions and roles' : 'ஊழியர் கட்டுப்பாடுகள் & உரிமைகள்',
                        language === 'en' ? 'Expense and financial reports' : 'செலவு மற்றும் வரவு அறிக்கைகள்',
                        language === 'en' ? 'Priority support' : 'முன்னுரிமை வாடிக்கையாளர் சேவை'
                      ].map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)' }}>
                            <Check size={11} color="#ffffff" strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Button */}
                  <button
                    onClick={onStartTrial}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#0284c7',
                      border: '1.5px solid #bae6fd',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontWeight: 750,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0284c7';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#0284c7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#0284c7';
                      e.currentTarget.style.borderColor = '#bae6fd';
                    }}
                  >
                    {language === 'en' ? 'Choose Business' : 'பிசினஸ் திட்டம்'}
                  </button>
                </div>

                {/* CARD 4: ENTERPRISE */}
                <div
                  className="pricing-plan-card"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 251, 235, 0.88) 100%)',
                    border: '1.5px solid #fde68a',
                    boxShadow: '0 12px 30px -8px rgba(217, 119, 6, 0.12), 0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div>
                    {/* Top Icon & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
                      {/* 3D Isometric Golden Headquarters Icon */}
                      <svg width="52" height="52" viewBox="0 0 60 60" fill="none" style={{ filter: 'drop-shadow(0 6px 14px rgba(217, 119, 6, 0.28))' }}>
                        <polygon points="12,28 26,18 26,54 12,44" fill="#fbbf24" />
                        <polygon points="26,18 40,28 40,54 26,54" fill="#f59e0b" />
                        <polygon points="12,28 26,18 40,28 26,38" fill="#fef08a" />
                        <polygon points="34,18 46,10 46,50 34,42" fill="#f59e0b" />
                        <polygon points="46,10 54,16 54,50 46,50" fill="#d97706" />
                        <polygon points="34,18 46,10 54,16 42,24" fill="#fde047" />
                        <circle cx="19" cy="30" r="1.5" fill="#78350f" opacity="0.75" />
                        <circle cx="19" cy="36" r="1.5" fill="#78350f" opacity="0.75" />
                        <circle cx="33" cy="36" r="1.5" fill="#78350f" opacity="0.75" />
                        <circle cx="33" cy="42" r="1.5" fill="#78350f" opacity="0.75" />
                        <circle cx="49" cy="22" r="1.5" fill="#ffffff" opacity="0.9" />
                        <circle cx="49" cy="28" r="1.5" fill="#ffffff" opacity="0.9" />
                        <circle cx="49" cy="34" r="1.5" fill="#ffffff" opacity="0.9" />
                      </svg>

                      <div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#090d16', margin: '0 0 0.2rem 0' }}>
                          {language === 'en' ? 'Enterprise' : 'கார்ப்பரேட் திட்டம்'}
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.3 }}>
                          {language === 'en' ? 'For large PG chains and custom requirements' : 'பெரிய விடுதி சங்கிலிகள் மற்றும் தனிப்பயன் தேவை'}
                        </p>
                      </div>
                    </div>

                    {/* Price Block */}
                    <div style={{ marginBottom: '1.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#d97706', letterSpacing: '-0.02em' }}>
                          {language === 'en' ? 'Custom pricing' : 'தனிப்பயன் விலை'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>
                        {language === 'en' ? 'Tailored annual contract & dedicated SLA' : 'சிறப்பு ஒப்பந்தம் மற்றும் சேவை'}
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#fef3c7',
                        color: '#d97706',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: '1px solid #fde68a'
                      }}>
                        {language === 'en' ? '200+ beds' : '200+ படுக்கைகள்'}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      {[
                        language === 'en' ? 'All Business features' : 'அனைத்து பிசினஸ் வசதிகள்',
                        language === 'en' ? 'Custom onboarding' : 'நேரடி பயிற்சி & தரவு மாற்றம்',
                        language === 'en' ? 'Integrations (payment, ERP)' : 'வங்கி & ERP ஒருங்கிணைப்பு',
                        language === 'en' ? 'Dedicated account manager' : 'பிரத்யேக கணக்கு மேலாளர்',
                        language === 'en' ? 'SLA and tailored support' : 'உத்தரவாத சேவை SLA',
                        language === 'en' ? 'Advanced security & audit logs' : 'மேம்பட்ட பாதுகாப்பு & பதிவுகள்'
                      ].map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)' }}>
                            <Check size={11} color="#ffffff" strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Action Button */}
                  <a
                    href="#contact"
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      color: '#d97706',
                      border: '1.5px solid #fde68a',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      fontWeight: 750,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(217, 119, 6, 0.08)',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'block',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#d97706';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#d97706';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#d97706';
                      e.currentTarget.style.borderColor = '#fde68a';
                    }}
                  >
                    {language === 'en' ? 'Contact Sales' : 'தொடர்பு கொள்ள'}
                  </a>
                </div>
              </div>
            )}


            {/* 14 Days Free Trial Banner (Image 2 Full Width Card) */}
            <div className="free-trial-banner">
              {/* Left Column: 3D Calendar Graphic + Heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {/* 3D Calendar Icon with Clock Badge */}
                <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '54px',
                    height: '56px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #ede9fe 100%)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 20px -3px rgba(99, 102, 241, 0.25)',
                    border: '1.5px solid #ddd6fe',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4px',
                    position: 'relative'
                  }}>
                    <div style={{ width: '100%', height: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '8px 8px 4px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px' }}>
                      <div style={{ width: '3px', height: '6px', background: '#fff', borderRadius: '2px' }} />
                      <div style={{ width: '3px', height: '6px', background: '#fff', borderRadius: '2px' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem', color: '#4f46e5', letterSpacing: '-0.02em' }}>
                      14
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(79, 70, 229, 0.4)',
                    color: '#ffffff'
                  }}>
                    <Clock size={13} strokeWidth={2.5} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                    {language === 'en' ? 'TRY BEFORE YOU SUBSCRIBE' : 'முன்-பரிசோதனை சலுகை'}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#090d16', lineHeight: 1.15 }}>
                    {language === 'en' ? '14 Days Free Trial' : '14 நாட்கள் இலவச சோதனை'}
                  </div>
                </div>
              </div>

              {/* Center Column: Trial Checklist */}
              <div className="trial-bullets" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem 1.25rem' }}>
                {[
                  language === 'en' ? 'Explore core features' : 'அனைத்து முக்கிய அம்சங்கள்',
                  language === 'en' ? 'Import your tenant data' : 'வாடகைதாரர் தகவல் ஏற்றுமதி',
                  language === 'en' ? 'Generate sample invoices' : 'மாதிரி ரசீது தயாரித்தல்',
                  language === 'en' ? 'Experience the full workflow' : 'முழுமையான பணிப்பாய்வு'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={10} color="#ffffff" strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Right Column: CTA Button */}
              <div className="trial-cta-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <button
                  onClick={onStartTrial}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.85rem 1.75rem',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.55)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
                  }}
                >
                  <span>{language === 'en' ? 'Start Free Trial' : 'இலவச சோதனையைத் தொடங்கு'}</span>
                  <ArrowRight size={16} />
                </button>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 500 }}>
                  {language === 'en' ? 'Up to 25 beds | 1 property during trial' : 'சோதனைக் காலத்தில் 25 படுக்கைகள் | 1 கட்டிடம்'}
                </div>
              </div>
            </div>

            {/* Bottom 4 Key Value Pillars (Info Strip) */}
            <div className="pricing-value-strip">
              {/* Item 1: Annual Discount */}
              <div className="pricing-value-item">
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Tag size={19} color="#e11d48" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#090d16', marginBottom: '0.15rem' }}>
                    {language === 'en' ? 'Annual Discount' : 'ஆண்டு தள்ளுபடி'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, fontWeight: 500 }}>
                    {language === 'en' ? '15 – 20% off on yearly subscription' : 'வருடாந்திர சந்தாவில் 15-20% நேரடி தள்ளுபடி'}
                  </div>
                </div>
              </div>

              {/* Item 2: Per Bed Model */}
              <div className="pricing-value-item">
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building size={19} color="#0284c7" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#090d16', marginBottom: '0.15rem' }}>
                    {language === 'en' ? 'Per Bed Model (Optional)' : 'படுக்கை வாரியான திட்டம்'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, fontWeight: 500 }}>
                    {language === 'en' ? '₹10 – ₹20 per bed/month (Minimum ₹299 – ₹499)' : 'ஒரு படுக்கைக்கு மாதம் ₹10 – ₹20'}
                  </div>
                </div>
              </div>

              {/* Item 3: Additional Charges */}
              <div className="pricing-value-item">
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={19} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#090d16', marginBottom: '0.15rem' }}>
                    {language === 'en' ? 'Additional Charges' : 'கூடுதல் கட்டணங்கள்'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, fontWeight: 500 }}>
                    {language === 'en' ? 'WhatsApp/SMS usage charges and payment gateway fees may be extra.' : 'வாட்ஸ்அப் SMS பயன்பாடு & கேட்வே கட்டணம்'}
                  </div>
                </div>
              </div>

              {/* Item 4: Trial Expiry & Renewal */}
              <div className="pricing-value-item">
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={19} color="#d97706" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#090d16', marginBottom: '0.15rem' }}>
                    {language === 'en' ? 'Trial Expiry & Renewal' : 'சோதனை முடிவு & புதுப்பித்தல்'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.35, fontWeight: 500 }}>
                    {language === 'en' ? 'Defined grace period and restricted access policy for unpaid subscriptions.' : 'சலுகை காலம் மற்றும் பாதுகாப்பு விதிகள்'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PROMOTIONAL VIDEO SHOWCASE (SCROLLING TECHNOLOGY)                     */}
        {/* ========================================================================= */}
        <PromotionalScrollShowcase
          language={language}
          onStartTrial={onStartTrial}
          onOpenLogin={onOpenLogin}
        />


        {/* ========================================================================= */}
        {/* 7. UYAR TECH FAQ ACCORDION                                               */}
        {/* ========================================================================= */}
        <section id="faq" style={{ padding: '5.5rem 1.5rem', maxWidth: '900px', margin: '0 auto', background: 'transparent' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              <HelpCircle size={16} /> {language === 'en' ? 'Got Questions?' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்'}
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              {language === 'en' ? 'Frequently Asked Questions' : 'சந்தேகங்களும் விளக்கங்களும்'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Everything you need to know about running your PG without notebooks.
            </p>
          </div>

          {/* AnimatedList FAQ cards */}
          <AnimatedList
            items={faqList.map((faq, idx) => {
              const icons = [
                <Building key={1} size={18} color="#2563eb" />,
                <Zap key={2} size={18} color="#059669" />,
                <MessageSquare key={3} size={18} color="#16a34a" />,
                <QrCode key={4} size={18} color="#7c3aed" />,
                <ShieldCheck key={5} size={18} color="#0284c7" />,
                <Users key={6} size={18} color="#d97706" />,
                <Smartphone key={7} size={18} color="#e11d48" />
              ];
              return {
                id: idx,
                title: faq.q,
                description: faq.a,
                icon: icons[idx % icons.length],
                meta: `0${idx + 1}`
              };
            })}
            animation="pop"
            theme="light"
            width="100%"
            maxHeight={2400}
            radius={16}
            gap={14}
            stagger={0.06}
            frame={false}
            showGradients={false}
            displayScrollbar={false}
            selectOnHover={false}
            enableArrowNavigation
            loop={false}
            animateOnce={false}
            initialSelectedIndex={openFaqIndex !== null ? openFaqIndex : -1}
            onItemSelect={(item, index) => {
              setOpenFaqIndex(openFaqIndex === index ? null : index);
            }}
            renderItem={(item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  style={{ width: '100%', padding: '0.4rem 0.2rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFaqIndex(isOpen ? null : idx);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.16)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <div style={{
                        fontWeight: 750,
                        fontSize: '1.05rem',
                        color: '#0f172a',
                        lineHeight: 1.35
                      }}>
                        {item.title}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#64748b',
                        background: 'rgba(241, 245, 249, 0.95)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        {item.meta}
                      </span>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? '#2563eb' : 'rgba(241, 245, 249, 0.95)',
                        color: isOpen ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.25s ease'
                      }}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{
                      marginTop: '0.9rem',
                      paddingTop: '0.9rem',
                      borderTop: '1px solid rgba(226, 232, 240, 0.85)',
                      color: '#334155',
                      fontSize: '0.98rem',
                      lineHeight: 1.65,
                      paddingLeft: '3.5rem',
                      paddingRight: '0.5rem',
                      fontWeight: 500,
                      animation: 'fadeIn 0.25s ease-out'
                    }}>
                      {item.description}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </section>

        {/* ========================================================================= */}
        {/* 8. UYAR TECH: REQUEST A DEMO / QUICK LEAD SECTION                       */}
        {/* ========================================================================= */}
        <section id="demo" style={{ background: 'transparent', padding: '5.5rem 1.5rem', border: 'none', position: 'relative' }}>
          <span id="contact" style={{ position: 'absolute', top: '-80px', left: 0 }} />
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                <Sparkles size={16} /> 10-Minute Setup
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-900)', lineHeight: 1.2, marginBottom: '1rem' }}>
                Ready to run your PG without the register book?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Request a free walkthrough. Our team will set up your rooms, floors, and billing rules, and show you around the platform in 10 minutes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--primary-900)', fontWeight: 600 }}>
                  <Phone size={18} color="#2563eb" /> Direct Call: <a href="tel:+919363237167" style={{ color: '#2563eb', textDecoration: 'none' }}>+91 93632 37167</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--primary-900)', fontWeight: 600 }}>
                  <Mail size={18} color="#2563eb" /> Email: <a href="mailto:contact@uyartech.com" style={{ color: '#2563eb', textDecoration: 'none' }}>contact@uyartech.com</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--primary-900)', fontWeight: 600 }}>
                  <MessageSquare size={18} color="#16a34a" /> WhatsApp: <a href="https://wa.me/919363237167?text=Hi%2C%20I%20would%20like%20a%20demo%20of%20Uyar%20Tech%20for%20my%20PG" target="_blank" rel="noreferrer" style={{ color: '#16a34a', textDecoration: 'none' }}>Chat on WhatsApp</a>
                </div>
              </div>
            </div>

            {/* Quick Demo Request Form */}
            <div className="card" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.95)', boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)' }}>
              {demoForm.submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.5rem' }}>Demo Request Received!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                    Our property onboarding specialist will call you at <b>{demoForm.phone}</b> to configure your PG setup.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '1.25rem' }}>
                    Request a Free Demo
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senthil Kumar"
                        value={demoForm.name}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Phone Number (for WhatsApp / Call)</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98400 12345"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, phone: e.target.value }))}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>PG / Hostel Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Balaji Luxury PG"
                          value={demoForm.pgName}
                          onChange={(e) => setDemoForm(prev => ({ ...prev, pgName: e.target.value }))}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>City</label>
                        <select
                          value={demoForm.city}
                          onChange={(e) => setDemoForm(prev => ({ ...prev, city: e.target.value }))}
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', background: '#ffffff' }}
                        >
                          <option value="Chennai">Chennai</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Coimbatore">Coimbatore</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Kochi">Kochi</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.85rem', fontWeight: 700, marginTop: '0.5rem', borderRadius: '8px' }}
                    >
                      Submit Demo Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. HASHNODE-INSPIRED FLOATING CARD FOOTER                                 */}
        {/* ========================================================================= */}
        <footer className="hashnode-footer-wrapper">
          <div className="hashnode-footer-card">
            <div className="hashnode-footer-grid">
              {/* Left Brand Identity & Status Column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {/* Brand Logo & Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)'
                  }}>
                    <Building size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span>uyar</span>
                    <span style={{ color: '#2563eb' }}>pg</span>
                  </div>
                </div>

                {/* Tagline / Mission */}
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#64748b', maxWidth: '320px', marginBottom: '1.5rem', fontWeight: 500 }}>
                  {language === 'en'
                    ? 'Hassle-free PG & hostel management platform that owners and wardens love.'
                    : 'விடுதி மற்றும் பிஜி உரிமையாளர்கள் விரும்பும் எளிய மற்றும் துல்லியமான மேலாண்மை செயலி.'}
                </p>

                {/* Social Media Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {/* X (Twitter) */}
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    title="X (Twitter)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Discord / Community */}
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#5865f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    title="Discord"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#0a66c2')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    title="LinkedIn"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e1306c')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    title="Instagram"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff0000')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    title="YouTube"
                  >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>

                {/* All Systems Operational Pill Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    borderRadius: '9999px',
                    padding: '0.38rem 0.95rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                    cursor: 'pointer'
                  }}
                  title="Cloud Infrastructure & WhatsApp Automation 99.98% Uptime"
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block',
                    boxShadow: '0 0 0 2.5px rgba(16, 185, 129, 0.25)'
                  }} />
                  <span>{language === 'en' ? 'All systems operational' : 'அனைத்து சேவைகளும் சீராக உள்ளன'}</span>
                </div>
              </div>

              {/* Right Multi-Column Navigation Links */}
              <div className="hashnode-footer-cols">
                {/* Column 1: Product & Explore */}
                <div>
                  {/* Product */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Product' : 'தயாரிப்புகள்'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li>
                        <a href="#screens" className="hashnode-link">
                          <span>{language === 'en' ? 'Mobile App Simulation' : 'மொபைல் செயலி மாதிரி'}</span>
                          <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '9999px', marginLeft: '6px' }}>New</span>
                        </a>
                      </li>
                      <li><a href="#pricing" className="hashnode-link">{language === 'en' ? 'Transparent Bed Pricing' : 'விலைப்பட்டியல்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Dispute-Free EB Split' : 'EB கணக்கீட்டு முறை'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Multi-Branch Master Portal' : 'கிளைகளுக்கான ஒருங்கிணைப்பு'}</a></li>
                    </ul>
                  </div>

                  {/* Explore */}
                  <div>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Explore' : 'பயன்பாடுகள்'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="#screens" className="hashnode-link">{language === 'en' ? 'Live Room Matrix' : 'படுக்கை நிலவரம்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'WhatsApp 1-Tap Reminders' : 'வாட்ஸ்அப் நினைவூட்டல்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Entrance QR Check-In' : 'வாயில் QR வருகைப்பதிவு'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Tenant KYC Cloud Vault' : 'வாடகைதாரர் ஆவணப் பெட்டகம்'}</a></li>
                    </ul>
                  </div>
                </div>

                {/* Column 2: Company & Resources */}
                <div>
                  {/* Company */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Company' : 'நிறுவனம்'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'About Uyar Tech' : 'உயர் டெக் பற்றி'}</a></li>
                      <li><a href="#pricing" className="hashnode-link">{language === 'en' ? 'Plans & Pricing' : 'கட்டணத் திட்டங்கள்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Security & Encryption' : 'பாதுகாப்பு & மறைகுறியாக்கம்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Changelog & Updates' : 'செயலி புதுப்பிப்புகள்'}</a></li>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Request a Demo' : 'டெமோ முன்பதிவு'}</a></li>
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Resources' : 'வழிகாட்டிகள்'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="#faq" className="hashnode-link">{language === 'en' ? 'Hostel Owner Guides' : 'உரிமையாளர் கையேடு'}</a></li>
                      <li><a href="#pricing" className="hashnode-link">{language === 'en' ? 'TNEB Sub-Meter Formula' : 'TNEB கட்டணக் கணக்கீடு'}</a></li>
                      <li><a href="#screens" className="hashnode-link">{language === 'en' ? 'Warden Tamil Manual' : 'வார்டன் தமிழ் கையேடு'}</a></li>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Tamil Support Center' : 'தமிழ் உதவி மையம்'}</a></li>
                    </ul>
                  </div>
                </div>

                {/* Column 3: Partner, Support & Comparisons */}
                <div>
                  {/* Partner with us */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Partner with us' : 'இணைந்து பணியாற்ற'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Hostel Associations' : 'விடுதி சங்கங்கள்'}</a></li>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Referral Program (₹1,000)' : 'பரிந்துரை வெகுமதி (₹1,000)'}</a></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <h4 style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
                      {language === 'en' ? 'Support' : 'உதவி மையம்'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="tel:+919363237167" className="hashnode-link">{language === 'en' ? 'WhatsApp Helpline' : 'வாட்ஸ்அப் உதவி'}</a></li>
                      <li><a href="#faq" className="hashnode-link">{language === 'en' ? 'Support Docs' : 'விளக்கக் குறிப்புகள்'}</a></li>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Contact Onboarding' : 'நேரடி தொடர்பு'}</a></li>
                      <li><a href="#demo" className="hashnode-link">{language === 'en' ? 'Join Owner Community' : 'உரிமையாளர் குழு'}</a></li>
                    </ul>
                  </div>

                  {/* Comparisons > */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0f172a', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.85rem' }}>
                      <span>{language === 'en' ? 'Comparisons' : 'ஒப்பீடுகள்'}</span>
                      <ChevronRight size={14} />
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Uyar vs Excel Sheets' : 'Uyar vs எக்செல் தாள்கள்'}</a></li>
                      <li><a href="#features" className="hashnode-link">{language === 'en' ? 'Uyar vs Paper Registers' : 'Uyar vs நோட்டுப் புத்தகங்கள்'}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Copyright & Legal Strip */}
            <div style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.84rem',
              color: '#64748b'
            }}>
              <div>
                © {new Date().getFullYear()} Uyar PG — Uyar Technologies Inc. {language === 'en' ? 'All rights reserved.' : 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a
                  href="#privacy"
                  onClick={(e) => { e.preventDefault(); alert("Privacy Policy: All PG financial records, tenant KYC documents, and WhatsApp reminders are encrypted and strictly private to property owners."); }}
                  className="hashnode-link"
                >
                  {language === 'en' ? 'Privacy Policy' : 'தனியுரிமைக் கொள்கை'}
                </a>
                <a
                  href="#terms"
                  onClick={(e) => { e.preventDefault(); alert("Terms of Service: Standard software service agreement for hostel and PG owners across India."); }}
                  className="hashnode-link"
                >
                  {language === 'en' ? 'Terms' : 'விதிமுறைகள்'}
                </a>
                <a
                  href="#code-of-conduct"
                  onClick={(e) => { e.preventDefault(); alert("Code of Conduct: Zero data sharing, transparent billing, and respectful tenant communications."); }}
                  className="hashnode-link"
                >
                  {language === 'en' ? 'Code of conduct' : 'நடைமுறைக் குறியீடு'}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
);
};
