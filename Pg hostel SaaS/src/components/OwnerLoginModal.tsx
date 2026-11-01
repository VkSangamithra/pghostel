import React, { useState } from 'react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (ownerData: any) => void;
  onOpenSignUp: () => void;
  language: Language;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenSignUp,
  language
}) => {
  const t = getTranslation(language);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter your registered email/mobile and password.');
      return;
    }

    const cleanId = identifier.trim();
    let displayName = cleanId;
    if (cleanId.includes('@')) {
      const prefix = cleanId.split('@')[0];
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    onLoginSuccess({
      name: displayName,
      email: cleanId,
      role: 'owner',
      propertyId: 'prop-1'
    });
    onClose();
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px', padding: 0 }}>
        {/* Header Bar */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', 
          color: '#ffffff', 
          padding: '1.75rem 2rem 1.25rem 2rem', 
          borderTopLeftRadius: 'var(--radius-xl)', 
          borderTopRightRadius: 'var(--radius-xl)', 
          position: 'relative' 
        }}>
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
              cursor: 'pointer' 
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Building2 size={13} /> PG Owner Portal
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.45rem', margin: 0, fontWeight: 800 }}>
            {language === 'en' ? 'PG Owner Login' : 'பிஜி உரிமையாளர் உள்நுழைவு'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
            {language === 'en' ? 'Sign in to manage your properties, beds & collections' : 'உங்கள் விடுதி, படுக்கைகள் மற்றும் வாடகையை நிர்வகிக்க உள்நுழையவும்'}
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '2rem' }}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.65rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Registered Email or Mobile Number' : 'பதிவுசெய்த மின்னஞ்சல் / அலைபேசி எண்'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Enter email address or mobile number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">{language === 'en' ? 'Password' : 'கடவுச்சொல்'}</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('In a live environment, an OTP will be sent to your mobile to reset your password.'); }} style={{ fontSize: '0.75rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: 600 }}>
                  {language === 'en' ? 'Forgot Password?' : 'கடவுச்சொல் மறந்ததா?'}
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                id="rememberOwner"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <label htmlFor="rememberOwner" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {language === 'en' ? 'Remember this browser for 30 days' : '30 நாட்களுக்கு என்னை நினைவில் கொள்க'}
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <span>{language === 'en' ? 'Log In as PG Owner' : 'உரிமையாளராக உள்நுழைக'}</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Sign Up Link */}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {language === 'en' ? "Don't have a PG Owner account?" : 'பிஜி உரிமையாளர் கணக்கு இல்லையா?'}{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {language === 'en' ? 'Create Account (14-Day Free Trial)' : 'இலவச கணக்கு தொடங்குங்கள்'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
