import React, { useState, useEffect } from 'react';
import { UserRole, Language, Property } from '../types';
import { getTranslation } from '../translations';
import PillNav, { PillNavItem } from './PillNav';
import { 
  Building2, 
  Languages, 
  UserCheck, 
  ShieldAlert, 
  Smartphone, 
  User, 
  Clock, 
  Sparkles,
  ChevronDown,
  Lock,
  LogOut,
  ArrowRight,
  Zap,
  Calculator,
  ShieldCheck,
  FileText,
  HelpCircle,
  MapPin,
  Phone,
  Layers,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageToggle: () => void;
  properties: Property[];
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  onOpenLogin: (role?: UserRole | 'hub') => void;
  onOpenSignUp: () => void;
  onLogout: () => void;
  ownerName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  currentRole,
  onRoleChange,
  language,
  onLanguageToggle,
  properties,
  selectedPropertyId,
  onSelectProperty,
  onOpenLogin,
  onOpenSignUp,
  onLogout,
  ownerName = ''
}) => {
  const t = getTranslation(language);
  const activeProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // Public Navigation state for PillNav
  const [activeHref, setActiveHref] = useState('#saas-page');

  useEffect(() => {
    if (isLoggedIn) return;
    const handleScroll = () => {
      const sectionIds = ['contact', 'why-uyar', 'work', 'about'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            setActiveHref(`#${id}`);
            return;
          }
        }
      }
      setActiveHref('#saas-page');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoggedIn]);

  // Login dropdown menu state
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoginMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#login-dropdown-container')) {
        setIsLoginMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isLoginMenuOpen]);

  // -------------------------------------------------------------
  // STATE 1: PUBLIC / LANDING PAGE HEADER (When user is NOT logged in)
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    const navItems: PillNavItem[] = [
      { label: language === 'en' ? 'Home' : 'முகப்பு', href: '#saas-page' },
      { label: language === 'en' ? 'About' : 'அறிமுகம்', href: '#about' },
      { label: language === 'en' ? 'Work' : 'செயல்முறை', href: '#work' },
      { label: language === 'en' ? 'Why Uyar' : 'ஏன் உயர்?', href: '#why-uyar' },
      { label: language === 'en' ? 'Contact' : 'தொடர்பு', href: '#contact' }
    ];

    const handleItemClick = (item: PillNavItem, _index: number, event?: React.MouseEvent) => {
      if (item.href.startsWith('#')) {
        event?.preventDefault();
        if (item.href === '#saas-page') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.querySelector(item.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        setActiveHref(item.href);
      }
    };

    return (
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100, 
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div 
          style={{ 
            maxWidth: '1360px', 
            margin: '0 auto', 
            padding: '0.65rem 1.75rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1.25rem'
          }}
        >
          {/* Brand Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {t.brandName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t.tagline}
              </div>
            </div>
          </div>

          {/* Center: Modern Animated Pill Navigation Bar (PillNav) */}
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1, minWidth: 0 }}>
            <PillNav
              items={navItems}
              activeHref={activeHref}
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              layout="split"
              surface="glass"
              size="md"
              bounce={0.3}
              stretch={0.5}
              collapse="auto"
              intro
              theme="light"
              highlightColor="#2563eb"
              onItemClick={handleItemClick}
            />
          </div>

          {/* Action Buttons: Language Toggle, 5-Portals Login Dropdown, CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Language Toggle */}
            <button
              onClick={onLanguageToggle}
              className="btn btn-secondary btn-sm"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                fontWeight: 700, 
                borderColor: '#bfdbfe', 
                color: '#1e40af', 
                background: '#ffffff'
              }}
              title="Toggle Language / மொழியை மாற்றுக"
            >
              <Languages size={15} color="#2563eb" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* 5-Portals Separate Logins Dropdown */}
            <div id="login-dropdown-container" style={{ position: 'relative' }}>
              <button
                onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                className="btn btn-secondary btn-sm"
                style={{ 
                  fontWeight: 750, 
                  borderColor: isLoginMenuOpen ? '#2563eb' : '#93c5fd', 
                  color: '#1e40af', 
                  background: isLoginMenuOpen ? '#eff6ff' : '#ffffff', 
                  padding: '0.5rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: isLoginMenuOpen ? '0 0 0 3px rgba(37,99,235,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Lock size={14} color="#2563eb" />
                <span>{language === 'en' ? 'Portals Login' : 'உள்நுழைவு'}</span>
                <ChevronDown size={14} style={{ transform: isLoginMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {/* Dropdown Menu */}
              {isLoginMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '280px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                  padding: '0.65rem',
                  zIndex: 1000,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{
                    padding: '0.45rem 0.65rem 0.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    marginBottom: '0.45rem'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ⚡ 1 Port • 5 Dedicated Logins
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 600 }}>
                      {language === 'en' ? 'Select a separate portal to login:' : 'உள்நுழைவுப் பக்கத்தைத் தேர்ந்தெடுக்கவும்:'}
                    </div>
                  </div>

                  {/* 1. PG Owner */}
                  <button
                    onClick={() => { onOpenLogin('owner'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        {language === 'en' ? 'PG Owner Login' : 'பிஜி உரிமையாளர்'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Bed matrix, rent & bills
                      </div>
                    </div>
                  </button>

                  {/* 2. Manager / Warden */}
                  <button
                    onClick={() => { onOpenLogin('warden'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ecfdf5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        {language === 'en' ? 'Manager / Warden Login' : 'மேலாளர் / வார்டன்'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Check-ins, repairs & gate pass
                      </div>
                    </div>
                  </button>

                  {/* 3. Accountant */}
                  <button
                    onClick={() => { onOpenLogin('accountant'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f3ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ede9fe', color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Calculator size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        {language === 'en' ? 'Accountant Login' : 'கணக்காளர்'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        UTR reconcile & P&L audit
                      </div>
                    </div>
                  </button>

                  {/* 4. Tenant */}
                  <button
                    onClick={() => { onOpenLogin('resident'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <User size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        {language === 'en' ? 'Tenant / Resident Login' : 'குடியிருப்பாளர்'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        UPI rent payment & EB bill
                      </div>
                    </div>
                  </button>

                  {/* 5. Super Admin */}
                  <button
                    onClick={() => { onOpenLogin('superadmin'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldAlert size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        {language === 'en' ? 'Super Admin Login' : 'முதன்மை நிர்வாகி'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Platform control & MRR
                      </div>
                    </div>
                  </button>

                  {/* Divider & Hub */}
                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.45rem 0' }} />

                  <button
                    onClick={() => { onOpenLogin('hub'); setIsLoginMenuOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      color: '#2563eb',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>{language === 'en' ? 'View All 5 Portals Directory' : 'அனைத்து போர்டல் விவரங்கள்'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Create PG Owner Account CTA */}
            <button
              onClick={onOpenSignUp}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700, padding: '0.5rem 1.15rem' }}
            >
              <UserCheck size={14} />
              <span>{language === 'en' ? 'Get Started' : 'தொடங்குக'}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: AUTHENTICATED PG OWNER HEADER (When logged in)
  // -------------------------------------------------------------
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-light)' }}>
      {/* Top Utility Alert Strip */}
      <div style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', padding: '0.35rem 1.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
            <Clock size={12} /> 11 Days Trial Active
          </span>
          <span>Logged in as: <strong style={{ color: '#93c5fd' }}>{currentRole === 'superadmin' ? 'Super Admin' : currentRole === 'owner' ? 'PG Owner' : currentRole === 'warden' ? 'Manager/Warden' : currentRole === 'accountant' ? 'Accountant' : 'Tenant'}</strong> ({ownerName}) • {activeProperty.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ opacity: 0.85 }}>Support Helpline: +91 98400 12345</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div style={{ padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Brand identity & Property Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Building2 size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-900)', lineHeight: 1.1 }}>
                {t.brandName}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                ● PG Owner Dashboard
              </div>
            </div>
          </div>

          {/* Property Branch Switcher */}
          <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
            <select
              value={selectedPropertyId}
              onChange={(e) => onSelectProperty(e.target.value)}
              style={{
                background: 'var(--surface-bg)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 2rem 0.45rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-900)',
                cursor: 'pointer',
                appearance: 'none'
              }}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* View Switcher: Allows switching between the 5 portals on the single port */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-bg)', padding: '0.2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          <button
            onClick={() => onRoleChange('owner')}
            className={`btn btn-sm ${currentRole === 'owner' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
          >
            <UserCheck size={14} /> PG Owner
          </button>
          <button
            onClick={() => onRoleChange('warden')}
            className={`btn btn-sm ${currentRole === 'warden' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            title="Preview what your ground warden sees"
          >
            <Smartphone size={14} /> Warden
          </button>
          <button
            onClick={() => onRoleChange('accountant')}
            className={`btn btn-sm ${currentRole === 'accountant' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            title="Accountant Ledger & Financial Console"
          >
            <Calculator size={14} /> Accountant
          </button>
          <button
            onClick={() => onRoleChange('resident')}
            className={`btn btn-sm ${currentRole === 'resident' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            title="Preview what your resident sees"
          >
            <User size={14} /> Tenant
          </button>
          <button
            onClick={() => onRoleChange('superadmin')}
            className={`btn btn-sm ${currentRole === 'superadmin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', whiteSpace: 'nowrap' }}
            title="Uyar Platform Oversight"
          >
            <ShieldAlert size={14} /> Super Admin
          </button>
        </div>


        {/* Action Controls: Language Toggle & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, borderColor: '#bfdbfe', color: '#1e40af' }}
            title="Toggle Language / மொழியை மாற்றுக"
          >
            <Languages size={15} color="#2563eb" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Owner Profile Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-light)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
              {ownerName.charAt(0)}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              {ownerName}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--accent-rose)', borderColor: '#fecdd3', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Log out of PG Owner Dashboard"
          >
            <LogOut size={14} />
            <span>{language === 'en' ? 'Log Out' : 'வெளியேறு'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
