import React from 'react';
import { Language } from '../../types';
import { 
  Building2, 
  ShieldAlert, 
  Smartphone, 
  Calculator, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { InteractiveHexagonBackground } from './InteractiveHexagonBackground';

interface LoginHubPageProps {
  language: Language;
  onSelectRole: (role: 'superadmin' | 'owner' | 'warden' | 'accountant' | 'resident') => void;
  onBack: () => void;
}

export const LoginHubPage: React.FC<LoginHubPageProps> = ({
  language,
  onSelectRole,
  onBack
}) => {
  const portals = [
    {
      id: 'owner' as const,
      defaultId: 'owner',
      hashPath: '#/login/owner',
      roleName: language === 'en' ? 'PG Owner Login' : 'பிஜி உரிமையாளர் உள்நுழைவு',
      badge: language === 'en' ? 'PRIMARY TENANT OWNER' : 'முதன்மை உரிமையாளர்',
      icon: Building2,
      themeColor: '#60a5fa',
      bgGradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
      cardBorder: 'rgba(96, 165, 250, 0.35)',
      description: language === 'en' 
        ? 'Complete PG business management: Bed matrix occupancy, rent collection, EB splitting engine, tenant check-in and staff management.'
        : 'படுக்கை மேட்ரிக்ஸ், வாடகை வசூல், மின் கட்டணப் பகிர்வு மற்றும் பணியாளர் நிர்வாகம்.',
      buttonText: language === 'en' ? 'Open PG Owner Login Page' : 'பிஜி உரிமையாளர் உள்நுழைவுப் பக்கம்',
      features: [
        'Live Bed Inventory & Matrix',
        'Automated Rent Invoicing & UPI',
        'Sub-meter Electricity Splitting',
        'Staff & Expense Control'
      ]
    },
    {
      id: 'warden' as const,
      defaultId: 'warden',
      hashPath: '#/login/warden',
      roleName: language === 'en' ? 'Manager / Warden Login' : 'மேலாளர் / வார்டன் உள்நுழைவு',
      badge: language === 'en' ? 'FIELD OPERATIONS' : 'களப்பணி மேற்பார்வை',
      icon: Smartphone,
      themeColor: '#86efac',
      bgGradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
      cardBorder: 'rgba(134, 239, 172, 0.35)',
      description: language === 'en'
        ? 'Mobile-first field console: Daily room checks, new tenant physical check-in, maintenance complaints resolution and visitor gate pass verification.'
        : 'விடுதி களப்பணி: தினசரி ஆய்வு, குடியேற்றம், பராமரிப்பு தீர்வு மற்றும் பார்வையாளர் பாஸ்.',
      buttonText: language === 'en' ? 'Open Warden Login Page' : 'வார்டன் உள்நுழைவுப் பக்கம்',
      features: [
        'Mobile Floor & Room Inspection',
        'Instant Physical Check-in',
        'Maintenance Ticket Tracking',
        'Visitor Security Approvals'
      ]
    },
    {
      id: 'accountant' as const,
      defaultId: 'accountant',
      hashPath: '#/login/accountant',
      roleName: language === 'en' ? 'Accountant Login' : 'கணக்காளர் உள்நுழைவு',
      badge: language === 'en' ? 'FINANCE & AUDIT' : 'நிதி மற்றும் தணிக்கை',
      icon: Calculator,
      themeColor: '#d8b4fe',
      bgGradient: 'linear-gradient(135deg, #581c87 0%, #9333ea 100%)',
      cardBorder: 'rgba(216, 180, 254, 0.35)',
      description: language === 'en'
        ? 'Dedicated financial desk: Reconcile bank UTRs with rent invoices, manage petty cash expense vouchers, audit EB charges and generate monthly P&L balance sheets.'
        : 'வங்கி UTR வரவு சரிபார்ப்பு, செலவு ரசீதுகள் மற்றும் மாதாந்திர லாப-நஷ்ட நிதி அறிக்கை.',
      buttonText: language === 'en' ? 'Open Accountant Login Page' : 'கணக்காளர் உள்நுழைவுப் பக்கம்',
      features: [
        'Bank Statement UTR Reconciliation',
        'Voucher Bookkeeping & Tax Audit',
        'Electricity Sub-meter Verification',
        'Monthly P&L & Cash Flow Reports'
      ]
    },
    {
      id: 'resident' as const,
      defaultId: 'tenant',
      hashPath: '#/login/tenant',
      roleName: language === 'en' ? 'Tenant / Resident Login' : 'குடியிருப்பாளர் உள்நுழைவு',
      badge: language === 'en' ? 'TENANT SELF-SERVICE' : 'குடியிருப்பாளர் போர்ட்டல்',
      icon: User,
      themeColor: '#fde68a',
      bgGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
      cardBorder: 'rgba(253, 230, 138, 0.35)',
      description: language === 'en'
        ? 'Tenant self-service app: Instant UPI rent payments with digital receipts, view individual room EB unit breakdown, submit maintenance tickets and request guest passes.'
        : 'UPI மூலம் வாடகை செலுத்துதல், மின்சாரக் கணக்கு மற்றும் டிஜிட்டல் பாஸ்.',
      buttonText: language === 'en' ? 'Open Tenant Login Page' : 'குடியிருப்பாளர் உள்நுழைவுப் பக்கம்',
      features: [
        '1-Click UPI Rent Payment',
        'Dispute-free Room EB Meter Split',
        'Instant Maintenance Ticket Filing',
        'Digital QR Guest Entry Pass'
      ]
    },
    {
      id: 'superadmin' as const,
      defaultId: 'superadmin',
      hashPath: '#/login/superadmin',
      roleName: language === 'en' ? 'Super Admin Login' : 'முதன்மை நிர்வாகி உள்நுழைவு',
      badge: language === 'en' ? 'PLATFORM MASTER CONTROL' : 'முதன்மை கட்டுப்பாடு',
      icon: ShieldAlert,
      themeColor: '#a5b4fc',
      bgGradient: 'linear-gradient(135deg, #312e81 0%, #4f46e5 100%)',
      cardBorder: 'rgba(165, 180, 252, 0.35)',
      description: language === 'en'
        ? 'SaaS infrastructure master command: Platform-wide telemetry, multi-tenant database oversight, subscription MRR tracking and owner account provisioning.'
        : 'அனைத்து பிஜி அமைப்புகள் மற்றும் சந்தா கண்காணிப்பு நிர்வாகம்.',
      buttonText: language === 'en' ? 'Open Super Admin Login Page' : 'நிர்வாகி உள்நுழைவுப் பக்கம்',
      features: [
        'Multi-Hostel Tenant Telemetry',
        'SaaS Recurring MRR Analytics',
        'Database & Node Health Monitor',
        '1-Click Owner Support Impersonation'
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF5FF',
      color: '#ffffff',
      padding: '3rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <InteractiveHexagonBackground />
      {/* Top back button */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto 2.5rem auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(15, 23, 42, 0.70)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#f8fafc',
            padding: '0.5rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} />
          <span>{language === 'en' ? 'Back to Website' : 'முகப்புக்குத் திரும்பு'}</span>
        </button>

        <div style={{
          background: 'rgba(15, 23, 42, 0.70)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#e2e8f0',
          padding: '0.45rem 1.1rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 800,
          letterSpacing: '0.04em'
        }}>
          ⚡ 5 DEDICATED ROLE PORTALS • ENTERPRISE RBAC ACCESS CONTROL
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ maxWidth: '860px', margin: '0 auto 3.5rem auto', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          margin: '0 0 0.75rem 0',
          lineHeight: 1.2,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          {language === 'en' ? 'Select Your Dedicated Login Portal' : 'உங்கள் பிரத்யேக உள்நுழைவைத் தேர்ந்தெடுக்கவும்'}
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: '#e2e8f0',
          margin: 0,
          lineHeight: 1.6,
          textShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}>
          {language === 'en'
            ? 'Each user role has a completely separate, standalone login page with dedicated security credentials. Click any portal below to open its specific login page.'
            : 'ஒவ்வொரு பயனருக்கும் தனித்தனியான முழுமையான உள்நுழைவுப் பக்கங்கள் உள்ளன. உங்கள் பிரிவைத் தேர்வுசெய்க.'}
        </p>
      </div>

      {/* Portals Cards Grid */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.75rem'
      }}>
        {portals.map((portal) => {
          const IconComp = portal.icon;
          return (
            <div
              key={portal.id}
              style={{
                background: 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: `1.5px solid ${portal.cardBorder}`,
                borderRadius: '22px',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.65)'
              }}
            >
              <div>
                {/* Header row with Icon and Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: portal.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 8px 20px -4px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <IconComp size={26} />
                  </div>

                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: `1px solid ${portal.cardBorder}`
                  }}>
                    {portal.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                  {portal.roleName}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  {portal.description}
                </p>

                {/* Feature checkmarks */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {portal.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={14} color={portal.themeColor} style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Port, URL, ID & Default Password Box */}
                <div style={{
                  padding: '0.75rem 0.95rem',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: `1px solid ${portal.cardBorder}`,
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8' }}>Direct URL:</span>
                    <code style={{ color: portal.themeColor, fontWeight: 700, fontSize: '0.75rem' }}>
                      http://localhost:5173/{portal.hashPath}
                    </code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>Auth Protocol:</span>
                    <strong style={{ color: portal.themeColor, fontSize: '0.74rem', fontWeight: 800 }}>JWT Secured Login</strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectRole(portal.id)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  background: portal.bgGradient,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 20px -6px rgba(0,0,0,0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{portal.buttonText}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoginHubPage;
