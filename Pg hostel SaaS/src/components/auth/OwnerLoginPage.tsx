import React, { useState } from 'react';
import { Language, OwnerVerificationDetails } from '../../types';
import { Building2, Lock, Mail, ArrowRight, Eye, EyeOff, ArrowLeft, Sparkles, UserPlus } from 'lucide-react';
import { LoginUserData } from '../MultiRoleLoginModal';
import { api } from '../../services/api';
import { InteractiveHexagonBackground } from './InteractiveHexagonBackground';

interface OwnerLoginPageProps {
  language: Language;
  onLoginSuccess: (userData: LoginUserData) => void;
  onBack: () => void;
  onSwitchRole: (role: 'hub' | 'superadmin' | 'owner' | 'warden' | 'accountant' | 'resident') => void;
  onOpenSignUp: () => void;
  existingVerifications?: OwnerVerificationDetails[];
}

export const OwnerLoginPage: React.FC<OwnerLoginPageProps> = ({
  language,
  onLoginSuccess,
  onBack,
  onSwitchRole,
  onOpenSignUp,
  existingVerifications = []
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setError(language === 'en' ? 'Please enter your registered Owner ID or Email.' : 'பதிவுசெய்யப்பட்ட உரிமையாளர் ஐடி அல்லது மின்னஞ்சலை உள்ளிடவும்.');
      return;
    }

    if (!cleanPass) {
      setError(language === 'en' ? 'Please enter your Master Password.' : 'கடவுச்சொல்லை உள்ளிடவும்.');
      return;
    }

    // 1. Try Real Backend Authentication
    try {
      const res = await api.auth.login(cleanId, cleanPass);
      if (res && res.user) {
        onLoginSuccess({
          name: res.user.name,
          email: res.user.email,
          role: 'owner',
          propertyId: 'prop-1'
        });
        return;
      }
    } catch (apiErr: any) {
      // 2. Check locally registered Owner Verification Records
      const foundVerif = existingVerifications?.find(
        v => (v.username && v.username.toLowerCase() === cleanId.toLowerCase()) ||
             (v.loginId && v.loginId.toLowerCase() === cleanId.toLowerCase()) ||
             (v.email && v.email.toLowerCase() === cleanId.toLowerCase())
      );

      if (foundVerif) {
        onLoginSuccess({
          name: foundVerif.legalName || cleanId,
          email: foundVerif.email,
          role: 'owner',
          propertyId: 'prop-1'
        });
        return;
      }

      // 3. Fallback for demo owner account
      if ((cleanId.toLowerCase() === 'owner' || cleanId.toLowerCase() === 'owner@staynest.com') && 
          (cleanPass === 'Password@123' || cleanPass === '12345678')) {
        onLoginSuccess({
          name: 'Owner',
          email: 'owner@staynest.com',
          role: 'owner',
          propertyId: 'prop-1'
        });
        return;
      }

      setError(language === 'en'
        ? 'Invalid Owner ID or Password. If you are a new owner, please register your PG and set your credentials.'
        : 'தவறான உரிமையாளர் ஐடி அல்லது கடவுச்சொல். நீங்கள் புதிய உரிமையாளர் எனில் பதிவு செய்யவும்.'
      );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF5FF',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2.5rem 1.25rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <InteractiveHexagonBackground />
      {/* Top back navigation bar */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        zIndex: 10
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(15, 23, 42, 0.70)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#f8fafc',
            padding: '0.5rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={15} />
          <span>{language === 'en' ? 'Back to Website' : 'முகப்புக்குத் திரும்பு'}</span>
        </button>

        <button
          onClick={() => onSwitchRole('hub')}
          style={{
            background: 'rgba(37, 99, 235, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(147, 197, 253, 0.5)',
            color: '#ffffff',
            padding: '0.5rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
          }}
        >
          {language === 'en' ? 'All 5 Logins' : 'அனைத்து 5 உள்நுழைவுகள்'}
        </button>
      </div>

      {/* Main Frosted Glass Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '470px',
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1.5px solid rgba(255, 255, 255, 0.22)',
        borderRadius: '24px',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.65), 0 0 35px rgba(134, 239, 172, 0.08)',
        zIndex: 5
      }}>
        {/* Emblem & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Building2 size={30} />
          </div>

          <div style={{
            display: 'inline-block',
            background: 'rgba(37, 99, 235, 0.25)',
            color: '#bfdbfe',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            padding: '0.2rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid rgba(147, 197, 253, 0.35)',
            marginBottom: '0.5rem'
          }}>
            HOSTEL & PG MANAGEMENT
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            {language === 'en' ? 'PG Owner Login' : 'பிஜி உரிமையாளர் உள்நுழைவு'}
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
            {language === 'en'
              ? 'Access bed occupancy matrix, rent collections, staff & EB split engine'
              : 'படுக்கை இருப்பு, வாடகை வரவு மற்றும் மின் கட்டண கணக்குகளை நிர்வகிக்கவும்'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.84rem',
            marginBottom: '1.25rem'
          }}>
            {error}
          </div>
        )}

        {/* Clean Registration CTA for New PG Owners */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(165, 180, 252, 0.35)',
          borderRadius: '14px',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#e0e7ff' }}>
              {language === 'en' ? 'New PG Owner? Register First' : 'புதிய பிஜி உரிமையாளரா? பதிவு செய்க'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
              {language === 'en' ? 'Create your custom Login ID and secure Master Password' : 'உங்கள் சொந்த உள்நுழைவு ஐடி மற்றும் கடவுச்சொல்லை அமைக்கவும்'}
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenSignUp}
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 800,
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <UserPlus size={14} />
            <span>Create Owner Account</span>
          </button>
        </div>

        {/* Clean form without default credentials */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.45rem' }}>
              {language === 'en' ? 'Owner User ID / Mobile / Email' : 'உரிமையாளர் ஐடி / மொபைல் எண் / மின்னஞ்சல்'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={language === 'en' ? 'Enter ID (default: owner)' : 'ஐடியை உள்ளிடவும் (owner)'}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#93c5fd' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9' }}>
                {language === 'en' ? 'Password' : 'கடவுச்சொல்'}
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert(language === 'en' ? 'Password reset OTP will be sent to your registered mobile number.' : 'கடவுச்சொல் மீட்டெடுப்பு OTP உங்கள் மொபைலுக்கு அனுப்பப்படும்.'); }}
                style={{ fontSize: '0.76rem', color: '#93c5fd', textDecoration: 'none', fontWeight: 700 }}
              >
                {language === 'en' ? 'Forgot Password?' : 'கடவுச்சொல் மறந்ததா?'}
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'en' ? 'Enter password' : 'கடவுச்சொல்லை உள்ளிடவும்'}
                style={{
                  width: '100%',
                  padding: '0.85rem 2.6rem 0.85rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#93c5fd' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="ownerRemember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <label htmlFor="ownerRemember" style={{ fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
              {language === 'en' ? 'Remember login on this device' : 'இந்த சாதனத்தில் என்னை நினைவில் கொள்க'}
            </label>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{language === 'en' ? 'Sign In to PG Owner Workspace' : 'பிஜி பணியகத்தில் நுழைக'}</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Sign up prompt for new PG Owners */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem 1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px dashed rgba(255, 255, 255, 0.25)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
            {language === 'en' ? "New to UYAR Hostel SaaS?" : "புதிய பிஜி உரிமையாளரா?"}
          </div>
          <button
            type="button"
            onClick={onOpenSignUp}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#93c5fd',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={14} />
            <span>{language === 'en' ? 'Start 14-Day Free Trial (Register PG)' : '14 நாட்கள் இலவச சோதனை தொடங்கவும்'}</span>
          </button>
        </div>

        {/* Other Portals Switcher */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span>{language === 'en' ? 'Other separate logins:' : 'பிற உள்நுழைவுகள்:'}</span>
          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
            <button
              onClick={() => onSwitchRole('warden')}
              style={{ background: 'none', border: 'none', color: '#86efac', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Warden
            </button>
            <span>•</span>
            <button
              onClick={() => onSwitchRole('accountant')}
              style={{ background: 'none', border: 'none', color: '#d8b4fe', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Accountant
            </button>
            <span>•</span>
            <button
              onClick={() => onSwitchRole('resident')}
              style={{ background: 'none', border: 'none', color: '#fde68a', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Tenant
            </button>
            <span>•</span>
            <button
              onClick={() => onSwitchRole('superadmin')}
              style={{ background: 'none', border: 'none', color: '#a5b4fc', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
