import React, { useState, useEffect } from 'react';
import { UserRole, Language } from '../types';
import { 
  Building2, 
  ShieldAlert, 
  Smartphone, 
  Calculator, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  X, 
  Eye, 
  EyeOff,
  UserCheck
} from 'lucide-react';

export interface LoginUserData {
  name: string;
  email: string;
  role: UserRole;
  propertyId?: string;
  residentId?: string;
}

interface MultiRoleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: LoginUserData) => void;
  onOpenSignUp: () => void;
  language: Language;
  initialRole?: UserRole;
}

interface RoleConfig {
  role: UserRole;
  title: string;
  titleTa: string;
  badge: string;
  description: string;
  descriptionTa: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  gradient: string;
  accentColor: string;
  icon: React.ReactNode;
}

export const MultiRoleLoginModal: React.FC<MultiRoleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSignUp,
  language,
  initialRole = 'owner'
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole === 'public' ? 'owner' : initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Sync initialRole when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveRole(initialRole === 'public' ? 'owner' : initialRole);
      setIdentifier('');
      setPassword('');
      setError('');
    }
  }, [isOpen, initialRole]);

  const roles: RoleConfig[] = [
    {
      role: 'owner',
      title: 'PG Owner Login',
      titleTa: 'பிஜி உரிமையாளர் உள்நுழைவு',
      badge: 'PG OWNER',
      description: 'Sign in with your registered owner credentials to manage properties, rooms & collections',
      descriptionTa: 'உங்கள் விடுதி, படுக்கைகள் மற்றும் வாடகையை நிர்வகிக்க உங்கள் கணக்கில் உள்நுழையவும்',
      emailPlaceholder: 'Enter your owner email or mobile number',
      passwordPlaceholder: 'Enter your password',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
      accentColor: '#2563eb',
      icon: <Building2 size={16} />
    },
    {
      role: 'warden',
      title: 'Manager / Warden Login',
      titleTa: 'மேலாளர் / வார்டன் உள்நுழைவு',
      badge: 'MANAGER / WARDEN',
      description: 'Sign in to access daily room audits, visitor gate passes & maintenance tickets',
      descriptionTa: 'அறை ஆய்வு, பார்வையாளர் வருகை மற்றும் புகார்களை நிர்வகிக்க உள்நுழையவும்',
      emailPlaceholder: 'Enter manager / warden username or mobile',
      passwordPlaceholder: 'Enter your password',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
      accentColor: '#059669',
      icon: <Smartphone size={16} />
    },
    {
      role: 'accountant',
      title: 'Accountant Login',
      titleTa: 'கணக்காளர் உள்நுழைவு',
      badge: 'ACCOUNTANT',
      description: 'Sign in to manage rent reconciliation, EB sub-meter computations & expense ledger',
      descriptionTa: 'வாடகை கணக்கு புத்தகம், மின்சார பில் கணக்கீடு & செலவு வவுச்சர்கள்',
      emailPlaceholder: 'Enter accountant email or username',
      passwordPlaceholder: 'Enter your password',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
      accentColor: '#7c3aed',
      icon: <Calculator size={16} />
    },
    {
      role: 'resident',
      title: 'Tenant Login',
      titleTa: 'வாடகைதாரர் உள்நுழைவு',
      badge: 'TENANT',
      description: 'Sign in to view your rent invoice, pay via UPI QR & raise maintenance tickets',
      descriptionTa: 'வாடகை பில் பார்க்க, UPI மூலம் செலுத்த மற்றும் புகார்களை பதிவு செய்ய',
      emailPlaceholder: 'Enter tenant registered mobile or email',
      passwordPlaceholder: 'Enter your password',
      gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
      accentColor: '#d97706',
      icon: <User size={16} />
    },
    {
      role: 'superadmin',
      title: 'Super Admin Login',
      titleTa: 'முதன்மை நிர்வாகி உள்நுழைவு',
      badge: 'SUPER ADMIN',
      description: 'Sign in with master administrator credentials to access platform operations',
      descriptionTa: 'தளத்தின் முழுமையான மேலாண்மை மற்றும் அமைப்புகளுக்குள் நுழையவும்',
      emailPlaceholder: 'Enter super administrator email',
      passwordPlaceholder: 'Enter administrator master password',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
      accentColor: '#4f46e5',
      icon: <ShieldAlert size={16} />
    }
  ];

  if (!isOpen) return null;

  const currentRoleConfig = roles.find(r => r.role === activeRole) || roles[0];

  const handleSelectRoleTab = (r: UserRole) => {
    setActiveRole(r);
    setIdentifier('');
    setPassword('');
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError(language === 'en' ? 'Please enter your User ID / Email and Password.' : 'பயனர் ஐடி மற்றும் கடவுச்சொல்லை உள்ளிடவும்.');
      return;
    }

    // Format display name from user input
    let displayName = cleanId;
    if (cleanId.includes('@')) {
      const prefix = cleanId.split('@')[0];
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    } else {
      displayName = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
    }

    onLoginSuccess({
      name: displayName,
      email: cleanId,
      role: activeRole,
      propertyId: 'prop-1'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '540px', 
          padding: 0, 
          borderRadius: '24px', 
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Top Header Bar with Dynamic Role Gradient */}
        <div style={{ 
          background: currentRoleConfig.gradient, 
          color: '#ffffff', 
          padding: '1.75rem 2rem 1.4rem 2rem', 
          position: 'relative',
          transition: 'background 0.3s ease'
        }}>
          {/* Close button */}
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute', 
              right: '1.25rem', 
              top: '1.25rem', 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              color: '#ffffff', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
          >
            <X size={18} />
          </button>

          {/* Role badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(8px)',
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.72rem', 
            fontWeight: 800, 
            letterSpacing: '0.06em',
            marginBottom: '0.6rem' 
          }}>
            {currentRoleConfig.icon}
            <span>{currentRoleConfig.badge}</span>
          </div>

          <h2 style={{ color: '#ffffff', fontSize: '1.5rem', margin: 0, fontWeight: 850, letterSpacing: '-0.02em' }}>
            {language === 'en' ? currentRoleConfig.title : currentRoleConfig.titleTa}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.84rem', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
            {language === 'en' ? currentRoleConfig.description : currentRoleConfig.descriptionTa}
          </p>
        </div>

        {/* 5-Role Switcher Tabs */}
        <div style={{
          background: '#f8fafc',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {roles.map(r => {
            const isSelected = r.role === activeRole;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleSelectRoleTab(r.role)}
                style={{
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? r.accentColor : '#64748b',
                  border: isSelected ? `1.5px solid ${r.accentColor}` : '1.5px solid transparent',
                  borderRadius: '10px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{r.icon}</span>
                <span>{r.role === 'owner' ? 'PG Owner' : r.role === 'warden' ? 'Warden' : r.role === 'accountant' ? 'Accountant' : r.role === 'resident' ? 'Tenant' : 'Super Admin'}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body — Clean inputs for user's own credentials */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1.25rem', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* User ID / Email Input */}
            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                {language === 'en' ? `${currentRoleConfig.badge} User ID / Email` : 'பயனர் ஐடி / மின்னஞ்சல்'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  autoFocus
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', borderRadius: '10px' }}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentRoleConfig.emailPlaceholder}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                  {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); alert('Password reset link or OTP will be sent to your registered contact.'); }} 
                  style={{ fontSize: '0.76rem', color: currentRoleConfig.accentColor, textDecoration: 'none', fontWeight: 700 }}
                >
                  {language === 'en' ? 'Forgot Password?' : 'கடவுச்சொல் மறந்ததா?'}
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem', borderRadius: '10px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={currentRoleConfig.passwordPlaceholder}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="rememberRole"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: currentRoleConfig.accentColor, cursor: 'pointer' }}
              />
              <label htmlFor="rememberRole" style={{ fontSize: '0.82rem', color: '#64748b', cursor: 'pointer' }}>
                {language === 'en' ? 'Remember login session on this port' : 'இந்த போர்ட்டில் உள்நுழைவை நினைவில் கொள்க'}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: '#ffffff',
                background: currentRoleConfig.gradient,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: `0 8px 20px -4px ${currentRoleConfig.accentColor}55`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span>{language === 'en' ? `Log In as ${currentRoleConfig.badge}` : 'உள்நுழைக'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Bottom create PG Owner account link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.84rem', color: '#64748b' }}>
            {language === 'en' ? "New property owner?" : 'புதிய பிஜி உரிமையாளரா?'}{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {language === 'en' ? 'Start 14-Day Free Trial' : '14 நாள் இலவச கணக்கு தொடங்குங்கள்'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRoleLoginModal;
