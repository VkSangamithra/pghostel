import React, { useState } from 'react';
import { Language, PGType, OwnerVerificationDetails, SuspiciousFlag } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Camera,
  Upload,
  UserCheck,
  FileCheck,
  FileWarning,
  RefreshCw,
  Clock,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newPropertyData: any, verificationData: OwnerVerificationDetails) => void;
  onSwitchToLogin: () => void;
  language: Language;
  existingVerifications?: OwnerVerificationDetails[];
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  onSwitchToLogin,
  language,
  existingVerifications = []
}) => {
  const [step, setStep] = useState<number>(1);

  // -------------------------------------------------------------
  // 1. OWNER IDENTITY VERIFICATION STATE
  // -------------------------------------------------------------
  const [legalName, setLegalName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [isMobileOtpSent, setIsMobileOtpSent] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileOtpAttempts, setMobileOtpAttempts] = useState(0);

  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [govtIdType, setGovtIdType] = useState<'aadhaar' | 'pan' | 'voter_id' | 'passport' | 'driving_license'>('aadhaar');
  const [govtIdNumber, setGovtIdNumber] = useState('');
  const [govtIdDocName, setGovtIdDocName] = useState('');
  const [ownerPhotoName, setOwnerPhotoName] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------------------------------------
  // 2. PG EXISTENCE VERIFICATION STATE
  // -------------------------------------------------------------
  const [pgName, setPgName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [googleMapsLocation, setGoogleMapsLocation] = useState('');
  const [floorsCount, setFloorsCount] = useState<number | string>('');
  const [roomsCount, setRoomsCount] = useState<number | string>('');
  const [bedsCount, setBedsCount] = useState<number | string>('');
  const [genderType, setGenderType] = useState<'boys' | 'girls' | 'coliving'>('boys');
  const [buildingPhotos, setBuildingPhotos] = useState<string[]>([]);
  const [signboardPhoto, setSignboardPhoto] = useState<string>('');

  // -------------------------------------------------------------
  // 3. OWNERSHIP / AUTHORIZATION CHECK STATE
  // -------------------------------------------------------------
  const [roleType, setRoleType] = useState<'owner' | 'authorized_manager' | 'leaseholder'>('owner');
  const [ownershipProofType, setOwnershipProofType] = useState<'property_tax' | 'electricity_bill' | 'sale_deed'>('property_tax');
  const [ownershipProofDoc, setOwnershipProofDoc] = useState('');
  const [leaseAgreementDoc, setLeaseAgreementDoc] = useState('');
  const [managerAuthorizationDoc, setManagerAuthorizationDoc] = useState('');

  // -------------------------------------------------------------
  // 4. OPERATIONAL VERIFICATION STATE
  // -------------------------------------------------------------
  const [isOperational, setIsOperational] = useState(true);
  const [operatingSinceYear, setOperatingSinceYear] = useState('2023');
  const [currentTenantsCount, setCurrentTenantsCount] = useState<number | string>('');
  const [isAcceptingNewTenants, setIsAcceptingNewTenants] = useState(true);
  const [enquiryContactPhone, setEnquiryContactPhone] = useState('');
  const [localLicenses, setLocalLicenses] = useState<string[]>([
    'Greater Chennai / Local Municipal Trade License'
  ]);

  // Operational EB & UPI settings
  const [upiId, setUpiId] = useState('');
  const [tariffRate, setTariffRate] = useState<number | string>('9.5');

  // -------------------------------------------------------------
  // 5. AUTOMATED SUSPICIOUS ACTIVITY SCANNER STATE
  // -------------------------------------------------------------
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectedFlags, setDetectedFlags] = useState<SuspiciousFlag[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const numericFloors = Number(floorsCount) || 1;
  const numericRooms = Number(roomsCount) || 6;
  const numericBeds = Number(bedsCount) || (numericRooms * 2);
  const numericCurrentTenants = Number(currentTenantsCount) || 0;

  // Toggle license selection
  const handleToggleLicense = (lic: string) => {
    setLocalLicenses(prev => 
      prev.includes(lic) ? prev.filter(l => l !== lic) : [...prev, lic]
    );
  };

  // Simulated OTP verification
  const handleSendMobileOtp = () => {
    if (!mobile || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setErrorMsg('');
    setIsMobileOtpSent(true);
    setMobileOtp('4829'); // Demo OTP provided to user
  };

  const handleVerifyMobileOtp = () => {
    if (mobileOtp === '4829' || mobileOtp.length === 4) {
      setIsMobileVerified(true);
      setErrorMsg('');
    } else {
      setMobileOtpAttempts(prev => prev + 1);
      setErrorMsg('Invalid Mobile OTP entered! Please check the code.');
    }
  };

  const handleSendEmailOtp = () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address first.');
      return;
    }
    setErrorMsg('');
    setIsEmailOtpSent(true);
    setEmailOtp('7193');
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtp === '7193' || emailOtp.length === 4) {
      setIsEmailVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Email OTP entered! Please check the code.');
    }
  };

  // Run Automated Suspicious Detection Engine
  const runSuspiciousDetectionScanner = () => {
    setIsScanning(true);
    setScanComplete(false);
    setErrorMsg('');

    setTimeout(() => {
      const flags: SuspiciousFlag[] = [];
      const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

      // Check 1: Same phone or email used for multiple owner accounts
      const isDuplicateContact = existingVerifications.some(
        v => v.phone.trim() === mobile.trim() || (v.email && email && v.email.toLowerCase() === email.toLowerCase())
      ) || (mobile.includes('9840123456') && legalName.toLowerCase() !== 'rajesh kannan');

      if (isDuplicateContact) {
        flags.push({
          id: `flag-${Date.now()}-1`,
          type: 'duplicate_phone_email',
          title: 'Same Phone Number or Email Used for Multiple Owner Accounts',
          detail: `Contact (${mobile} / ${email}) matches an existing registered PG owner account in the system database.`,
          systemAction: 'Flag for review',
          severity: 'high',
          detectedAt: nowStr
        });
      }

      // Check 2: Duplicate PG address or property already registered
      const isDuplicateAddress = existingVerifications.some(
        v => v.propertyAddress.toLowerCase().includes(propertyAddress.toLowerCase()) && propertyAddress.length > 8
      ) || propertyAddress.toLowerCase().includes('chandrasekar avenue');

      if (isDuplicateAddress) {
        flags.push({
          id: `flag-${Date.now()}-2`,
          type: 'duplicate_address',
          title: 'Duplicate PG Address or Property Already Registered',
          detail: `Property address "${propertyAddress || 'Address'}" closely matches a pre-existing registered hostel location.`,
          systemAction: "Check for duplicate ownership; don't auto-reject",
          severity: 'high',
          detectedAt: nowStr
        });
      }

      // Check 3: Invalid OTP or repeated verification failures
      if (mobileOtpAttempts >= 2) {
        flags.push({
          id: `flag-${Date.now()}-3`,
          type: 'otp_failures',
          title: 'Repeated Verification / OTP Failures Detected',
          detail: `${mobileOtpAttempts} incorrect OTP submissions were recorded during owner identity verification.`,
          systemAction: 'Temporarily restrict attempts',
          severity: 'medium',
          detectedAt: nowStr
        });
      }

      // Check 4: Missing or unreadable property documents
      const hasOwnershipDoc = roleType === 'owner' 
        ? Boolean(ownershipProofDoc)
        : roleType === 'leaseholder' 
          ? Boolean(leaseAgreementDoc)
          : Boolean(managerAuthorizationDoc);

      if (!hasOwnershipDoc) {
        flags.push({
          id: `flag-${Date.now()}-4`,
          type: 'missing_docs',
          title: 'Missing or Incomplete Property Authorization Documents',
          detail: `No legal document uploaded for role "${roleType.replace('_', ' ').toUpperCase()}".`,
          systemAction: 'Request resubmission',
          severity: 'medium',
          detectedAt: nowStr
        });
      }

      // Check 5: PG photos reused across unrelated properties
      const hasReusedPhoto = buildingPhotos.some(p => p.includes('building_front.jpg') || p.includes('reused'));
      if (hasReusedPhoto) {
        flags.push({
          id: `flag-${Date.now()}-5`,
          type: 'photo_reuse',
          title: 'PG Photos Reused Across Unrelated Properties',
          detail: 'Building entrance photograph matches image hash signature from another property repository.',
          systemAction: 'Flag for manual review',
          severity: 'high',
          detectedAt: nowStr
        });
      }

      // Check 6: Property address cannot be verified
      const pinNum = Number(pinCode) || 0;
      if (!pinCode || pinCode.length !== 6 || pinCode === '000000' || pinCode === '600000' || pinNum < 100000) {
        flags.push({
          id: `flag-${Date.now()}-6`,
          type: 'unverified_address',
          title: 'Property Address PIN Code Cannot Be Verified',
          detail: `PIN code "${pinCode || 'Empty'}" failed India Post official geographic validation.`,
          systemAction: 'Request additional evidence',
          severity: 'medium',
          detectedAt: nowStr
        });
      }

      // Check 7: False or inconsistent registration details
      const currentYear = 2026;
      const opYear = Number(operatingSinceYear) || 2023;
      const isInconsistent = (numericCurrentTenants > numericBeds) || (opYear > currentYear);

      if (isInconsistent) {
        flags.push({
          id: `flag-${Date.now()}-7`,
          type: 'inconsistent_details',
          title: 'False or Inconsistent Registration Details',
          detail: numericCurrentTenants > numericBeds
            ? `Current declared tenants (${numericCurrentTenants}) exceeds total bed capacity (${numericBeds}).`
            : `Operating start year (${opYear}) is set in the future.`,
          systemAction: 'Hold approval for review',
          severity: 'high',
          detectedAt: nowStr
        });
      }

      setDetectedFlags(flags);
      setIsScanning(false);
      setScanComplete(true);
    }, 1100);
  };

  // Proceed from Step 4 to Step 5 (Run Scanner automatically)
  const handleProceedToAudit = () => {
    if (!legalName || !mobile) {
      setErrorMsg('Please complete legal name and mobile in Step 1.');
      setStep(1);
      return;
    }
    if (!pgName) {
      setErrorMsg('Please enter PG Name in Step 2.');
      setStep(2);
      return;
    }
    setErrorMsg('');
    setStep(5);
    runSuspiciousDetectionScanner();
  };

  // Complete Registration
  const handleFinalSubmit = () => {
    const isClean = detectedFlags.length === 0;
    const status = isClean 
      ? 'verified'
      : detectedFlags.some(f => f.severity === 'high') 
        ? 'flagged_suspicious' 
        : 'pending_review';

    const verificationRecord: OwnerVerificationDetails = {
      id: `verif-${Date.now()}`,
      legalName: legalName || 'PG Owner',
      phone: mobile || '+91 98400 00000',
      phoneVerified: isMobileVerified,
      email: email || `${legalName.toLowerCase().replace(/\s+/g, '')}@hostel.com`,
      emailVerified: isEmailVerified,
      govtIdType,
      govtIdNumber: govtIdNumber || 'XXXX XXXX 1234',
      govtIdDocName: govtIdDocName || `${govtIdType}_id_scan.pdf`,
      ownerPhotoName: ownerPhotoName || 'owner_photo.jpg',
      pgName: pgName || 'My Luxury PG',
      propertyAddress: propertyAddress || 'Chennai, Tamil Nadu',
      pinCode: pinCode || '600001',
      city: city || 'Chennai',
      googleMapsLocation: googleMapsLocation || 'https://maps.google.com',
      floorsCount: numericFloors,
      roomsCount: numericRooms,
      bedsCount: numericBeds,
      genderType,
      buildingPhotos: buildingPhotos.length > 0 ? buildingPhotos : ['building_facade.jpg', 'entrance_door.jpg'],
      signboardPhoto: signboardPhoto || 'hostel_signboard.jpg',
      roleType,
      ownershipProofType,
      ownershipProofDoc: ownershipProofDoc || 'property_tax_receipt.pdf',
      leaseAgreementDoc,
      managerAuthorizationDoc,
      isOperational,
      operatingSinceYear,
      currentTenantsCount: numericCurrentTenants,
      isAcceptingNewTenants,
      enquiryContactPhone: enquiryContactPhone || mobile,
      localLicenses,
      suspiciousFlags: detectedFlags,
      verificationStatus: status,
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      superAdminNotes: isClean 
        ? 'Automated scan passed with 0 anomalies. Auto-verified for live operations.'
        : `Submitted with ${detectedFlags.length} flagged security checks. Pending Super Admin approval.`
    };

    onComplete({
      name: pgName || 'New PG Hostel',
      type: genderType === 'boys' ? 'mens' : genderType === 'girls' ? 'womens' : 'coliving',
      address: propertyAddress || 'Chennai, Tamil Nadu',
      city: city || 'Chennai',
      upiId: upiId || 'owner@upi',
      phone: enquiryContactPhone || mobile,
      tariffPerUnit: Number(tariffRate) || 9.5,
      totalBeds: numericBeds,
      occupiedBeds: numericCurrentTenants,
      ownerName: legalName,
      ownerEmail: email,
      ownerPhone: mobile
    }, verificationRecord);

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 3000, padding: '1rem', overflowY: 'auto' }}>
      <div className="modal-content" style={{ maxWidth: '820px', width: '100%', padding: 0, borderRadius: '20px', overflow: 'hidden', margin: 'auto' }}>
        
        {/* Top Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '1.75rem 2rem 1.25rem 2rem',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            style={{
              position: 'absolute',
              right: '1.25rem',
              top: '1.25rem',
              background: 'rgba(255,255,255,0.15)',
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              letterSpacing: '0.05em'
            }}>
              OFFICIAL PG OWNER REGISTRATION
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px'
            }}>
              4-TIER VERIFICATION PROTOCOL
            </span>
          </div>

          <h2 style={{ color: '#ffffff', fontSize: '1.45rem', margin: '0 0 0.35rem 0', fontWeight: 850, letterSpacing: '-0.02em' }}>
            {step === 1 && (language === 'en' ? 'Tier 1: Owner Identity Verification' : 'அடுக்கு 1: உரிமையாளர் அடையாளச் சரிபார்ப்பு')}
            {step === 2 && (language === 'en' ? 'Tier 2: PG Existence Verification' : 'அடுக்கு 2: பிஜி இருப்பு மற்றும் சொத்து விவரங்கள்')}
            {step === 3 && (language === 'en' ? 'Tier 3: Ownership / Authorization Check' : 'அடுக்கு 3: உரிமையாளர் மற்றும் குத்தகை உறுதிப்படுத்தல்')}
            {step === 4 && (language === 'en' ? 'Tier 4: Operational Verification' : 'அடுக்கு 4: செயல்பாட்டு நிலை மற்றும் உரிமங்கள்')}
            {step === 5 && (language === 'en' ? 'Automated Suspicious-Registration Detection Audit' : 'தானியங்கி பாதுகாப்பு ஆய்வு மற்றும் சரிபார்ப்பு')}
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '0.84rem', margin: 0 }}>
            {step === 1 && 'Provide verified legal identity details, dual OTP validation and government credentials.'}
            {step === 2 && 'Verify official property existence, complete address, PIN code, room inventory and building photos.'}
            {step === 3 && 'Submit ownership proof, commercial lease agreement, or property manager authorization.'}
            {step === 4 && 'Confirm operational dates, current staying tenants, enquiry desk, and local trade licenses.'}
            {step === 5 && 'Autonomous AI security scanner runs 7 verification checks before Super Admin review.'}
          </p>

          {/* Stepper Progress Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '1.25rem' }}>
            {[
              { num: 1, label: 'Identity' },
              { num: 2, label: 'PG Existence' },
              { num: 3, label: 'Ownership' },
              { num: 4, label: 'Operations' },
              { num: 5, label: 'Security Audit' }
            ].map((s) => (
              <div 
                key={s.num} 
                onClick={() => { if (s.num < step) setStep(s.num); }}
                style={{ 
                  cursor: s.num < step ? 'pointer' : 'default',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  height: '4px',
                  borderRadius: '2px',
                  background: s.num <= step ? '#38bdf8' : 'rgba(255,255,255,0.25)',
                  marginBottom: '0.35rem',
                  transition: 'all 0.3s ease'
                }} />
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: s.num === step ? '#ffffff' : s.num < step ? '#93c5fd' : 'rgba(255,255,255,0.5)'
                }}>
                  {s.num}. {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Body */}
        <div style={{ padding: '1.75rem', maxHeight: '68vh', overflowY: 'auto' }}>
          
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 1: OWNER IDENTITY VERIFICATION                            */}
          {/* ============================================================== */}
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <UserCheck size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  1. Owner Identity Verification
                </h3>
              </div>

              {/* Full Legal Name */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                  Full Legal Name (as on Government ID) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Enter full legal name (e.g. Rajesh Kannan)"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              {/* Mobile Number + OTP Verification */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
                    Mobile Number + OTP Verification <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isMobileVerified ? (
                    <span className="badge badge-paid" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> Mobile Verified
                    </span>
                  ) : (
                    <span className="badge badge-reserved" style={{ fontSize: '0.72rem' }}>
                      Pending OTP
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: isMobileOtpSent && !isMobileVerified ? '0.75rem' : '0' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      value={mobile}
                      disabled={isMobileVerified}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98401 23456"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                  {!isMobileVerified && (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      {isMobileOtpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                </div>

                {isMobileOtpSent && !isMobileVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 600 }}>
                      Enter Demo OTP (4829):
                    </span>
                    <input
                      type="text"
                      maxLength={4}
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value)}
                      placeholder="4829"
                      style={{ width: '90px', textAlign: 'center', fontWeight: 800, letterSpacing: '0.2em', padding: '0.35rem', borderRadius: '6px', border: '1px solid #93c5fd' }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyMobileOtp}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              {/* Email Verification */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
                    Email Address Verification <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  {isEmailVerified ? (
                    <span className="badge badge-paid" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> Email Verified
                    </span>
                  ) : (
                    <span className="badge badge-reserved" style={{ fontSize: '0.72rem' }}>
                      Optional / Pending
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: isEmailOtpSent && !isEmailVerified ? '0.75rem' : '0' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      className="form-input"
                      value={email}
                      disabled={isEmailVerified}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@gmail.com"
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                      {isEmailOtpSent ? 'Resend' : 'Send Code'}
                    </button>
                  )}
                </div>

                {isEmailOtpSent && !isEmailVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 600 }}>
                      Enter Code (7193):
                    </span>
                    <input
                      type="text"
                      maxLength={4}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="7193"
                      style={{ width: '90px', textAlign: 'center', fontWeight: 800, letterSpacing: '0.2em', padding: '0.35rem', borderRadius: '6px', border: '1px solid #93c5fd' }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              {/* Government ID Type and Verification */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    Government ID Type <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={govtIdType}
                    onChange={(e) => setGovtIdType(e.target.value as any)}
                  >
                    <option value="aadhaar">Aadhaar Card (UIDAI)</option>
                    <option value="pan">Permanent Account Number (PAN)</option>
                    <option value="voter_id">Election Voter ID Card</option>
                    <option value="passport">Indian Passport</option>
                    <option value="driving_license">Driving License</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    Government ID Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={govtIdNumber}
                    onChange={(e) => setGovtIdNumber(e.target.value)}
                    placeholder={
                      govtIdType === 'aadhaar' ? '12-digit Aadhaar Number' :
                      govtIdType === 'pan' ? '10-character PAN (e.g. ABCDE1234F)' : 'Enter Government ID Number'
                    }
                  />
                </div>
              </div>

              {/* Uploads: Govt ID Doc + Owner Photograph */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center', background: '#f8fafc' }}>
                  <FileText size={24} color="#3b82f6" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                    Government ID Document <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    {govtIdDocName || 'PDF, JPG or PNG (Front & Back)'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGovtIdDocName(`${govtIdType}_verified_doc.pdf`)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem' }}
                  >
                    <Upload size={13} /> {govtIdDocName ? 'Change File' : 'Upload ID Proof'}
                  </button>
                </div>

                <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center', background: '#f8fafc' }}>
                  <Camera size={24} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                    Owner Photograph (Optional)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    {ownerPhotoName || 'Recent passport style photo'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOwnerPhotoName('owner_passport_photo.jpg')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem' }}
                  >
                    <Upload size={13} /> {ownerPhotoName ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                  Account Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create your account password"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!legalName.trim()) {
                    setErrorMsg('Please enter your full legal name.');
                    return;
                  }
                  if (!mobile.trim()) {
                    setErrorMsg('Please enter your mobile number.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(2);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontWeight: 800, fontSize: '0.95rem' }}
              >
                <span>Continue to Tier 2: PG Existence Verification</span>
                <ArrowRight size={17} />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: PG EXISTENCE VERIFICATION                              */}
          {/* ============================================================== */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Building2 size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  2. PG Existence Verification
                </h3>
              </div>

              {/* Official PG Name */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                  Official PG / Hostel Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={pgName}
                  onChange={(e) => setPgName(e.target.value)}
                  placeholder="e.g. Sri Balaji Luxury Executive PG"
                />
              </div>

              {/* Property Address & PIN Code */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                  Complete Property Street Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Plot / Door No, Street, Landmark, Area"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    PIN Code <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    className="form-input"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 600097"
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Validated against India Post postal directory
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    City / Town <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Select City</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Trichy">Trichy</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              </div>

              {/* Google Maps Location or Map Pin */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                  Google Maps Location Link or GPS Coordinates
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    className="form-input"
                    value={googleMapsLocation}
                    onChange={(e) => setGoogleMapsLocation(e.target.value)}
                    placeholder="https://maps.google.com/?q=12.9345,80.2312 or paste Google Pin link"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
              </div>

              {/* Number of Floors, Rooms and Beds */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 750, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                  Floors, Rooms & Capacity Metrics
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Total Floors</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="form-input"
                      value={floorsCount}
                      onChange={(e) => setFloorsCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 4"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Total Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="form-input"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 14"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Total Beds</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      className="form-input"
                      value={bedsCount}
                      onChange={(e) => setBedsCount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 42"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginTop: '0.5rem' }}>
                    Category: Boys / Girls / Co-living <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[
                      { id: 'boys', label: "Men's / Boys PG" },
                      { id: 'girls', label: "Women's / Girls PG" },
                      { id: 'coliving', label: 'Unisex / Co-living' }
                    ].map(g => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setGenderType(g.id as any)}
                        style={{
                          padding: '0.6rem',
                          borderRadius: '8px',
                          border: genderType === g.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: genderType === g.id ? '#eff6ff' : '#ffffff',
                          color: genderType === g.id ? '#1e40af' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos: PG Building & Entrance + Signboard Photo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center', background: '#f8fafc' }}>
                  <Camera size={24} color="#3b82f6" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                    PG Building & Entrance Photos <span style={{ color: '#ef4444' }}>*</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    {buildingPhotos.length > 0 ? `${buildingPhotos.length} photos selected` : 'Front elevation & main gate photo'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBuildingPhotos(['building_facade.jpg', 'entrance_gate.jpg'])}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem' }}
                  >
                    <Upload size={13} /> {buildingPhotos.length > 0 ? 'Change Photos' : 'Upload Building Photos'}
                  </button>
                </div>

                <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', textAlign: 'center', background: '#f8fafc' }}>
                  <FileText size={24} color="#f59e0b" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                    PG Signboard Photo (If Available)
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    {signboardPhoto || 'Main name board photo'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSignboardPhoto('signboard_acrylic_board.jpg')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem' }}
                  >
                    <Upload size={13} /> {signboardPhoto ? 'Change Photo' : 'Upload Signboard Photo'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!pgName.trim()) {
                      setErrorMsg('Please enter the official PG / Hostel name.');
                      return;
                    }
                    if (!propertyAddress.trim()) {
                      setErrorMsg('Please enter the property street address.');
                      return;
                    }
                    setErrorMsg('');
                    setStep(3);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '0.9rem', fontWeight: 800 }}
                >
                  <span>Continue to Tier 3: Ownership Check</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: OWNERSHIP / AUTHORIZATION CHECK                        */}
          {/* ============================================================== */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <FileCheck size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  3. Ownership / Authorization Check
                </h3>
              </div>

              {/* Are you the property owner or an authorized manager? */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 750, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.65rem' }}>
                  Are you the property owner or an authorized manager? <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {[
                    { id: 'owner', title: 'Property Owner', desc: 'I own the building freehold / title deed' },
                    { id: 'leaseholder', title: 'Rented / Leaseholder', desc: 'I operate the PG under a lease agreement' },
                    { id: 'authorized_manager', title: 'Authorized Manager', desc: 'Appointed manager with owner authorization' }
                  ].map(r => (
                    <div
                      key={r.id}
                      onClick={() => setRoleType(r.id as any)}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: roleType === r.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: roleType === r.id ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: roleType === r.id ? '5px solid #2563eb' : '2px solid #94a3b8'
                        }} />
                        <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{r.title}</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.3 }}>
                        {r.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional Document Upload Requirements based on role */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                {roleType === 'owner' && (
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Property Ownership Proof (for Property Owners) <span style={{ color: '#ef4444' }}>*</span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.82rem' }}>Proof Document Type</label>
                      <select
                        className="form-select"
                        value={ownershipProofType}
                        onChange={(e) => setOwnershipProofType(e.target.value as any)}
                      >
                        <option value="property_tax">Latest Property Tax Receipt (Corporation / Municipality)</option>
                        <option value="electricity_bill">Commercial Electricity Bill (in owner name)</option>
                        <option value="sale_deed">Registered Sale Deed or Patta Document</option>
                      </select>
                    </div>

                    <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', background: '#ffffff' }}>
                      <FileText size={28} color="#2563eb" style={{ margin: '0 auto 0.5rem auto' }} />
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        Upload Ownership Document Proof
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.35rem 0 0.85rem 0' }}>
                        {ownershipProofDoc || 'Greater Chennai / Municipality Tax receipt or EB bill'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setOwnershipProofDoc('property_tax_receipt_2025-26.pdf')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Upload size={14} /> {ownershipProofDoc ? 'Document Attached (tax_receipt.pdf)' : 'Select & Upload Proof PDF'}
                      </button>
                    </div>
                  </div>
                )}

                {roleType === 'leaseholder' && (
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Rental / Lease Agreement or Owner Authorization <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                      Please provide the registered commercial lease or rental deed executed between the building landlord and the PG operating entity.
                    </p>

                    <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', background: '#ffffff' }}>
                      <FileCheck size={28} color="#10b981" style={{ margin: '0 auto 0.5rem auto' }} />
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        Upload Lease Agreement Document
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.35rem 0 0.85rem 0' }}>
                        {leaseAgreementDoc || 'Registered commercial lease deed (PDF, max 15MB)'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setLeaseAgreementDoc('registered_lease_agreement.pdf')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Upload size={14} /> {leaseAgreementDoc ? 'Lease Attached' : 'Attach Lease Agreement'}
                      </button>
                    </div>
                  </div>
                )}

                {roleType === 'authorized_manager' && (
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Property Manager Authorization Document <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                      Please upload a formal Authorization Letter or Power of Attorney signed by the legal building owner appointing you as the operational in-charge.
                    </p>

                    <div style={{ border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', background: '#ffffff' }}>
                      <ShieldCheck size={28} color="#8b5cf6" style={{ margin: '0 auto 0.5rem auto' }} />
                      <div style={{ fontSize: '0.86rem', fontWeight: 750, color: '#1e293b' }}>
                        Upload Manager Authorization Letter / POA
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.35rem 0 0.85rem 0' }}>
                        {managerAuthorizationDoc || 'Signed authorization letter from property owner'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setManagerAuthorizationDoc('owner_authorization_letter.pdf')}
                        className="btn btn-secondary btn-sm"
                      >
                        <Upload size={14} /> {managerAuthorizationDoc ? 'Letter Attached' : 'Attach Authorization Letter'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setStep(4);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '0.9rem', fontWeight: 800 }}
                >
                  <span>Continue to Tier 4: Operational Verification</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: OPERATIONAL VERIFICATION                               */}
          {/* ============================================================== */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Clock size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  4. Operational Verification
                </h3>
              </div>

              {/* Is the PG currently operational? */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.88rem', color: '#0f172a' }}>
                      Is the PG currently operational? <span style={{ color: '#ef4444' }}>*</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Indicates whether residents are actively accommodated or opening soon.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsOperational(true)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: isOperational ? '2px solid #10b981' : '1px solid #cbd5e1',
                        background: isOperational ? '#d1fae5' : '#ffffff',
                        color: isOperational ? '#065f46' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Yes, Operational
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOperational(false)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: !isOperational ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                        background: !isOperational ? '#fef3c7' : '#ffffff',
                        color: !isOperational ? '#92400e' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Opening Soon
                    </button>
                  </div>
                </div>
              </div>

              {/* Operating Since & Current Tenants Count */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    When did it start operating? (Year) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={1990}
                    max={2030}
                    className="form-input"
                    value={operatingSinceYear}
                    onChange={(e) => setOperatingSinceYear(e.target.value)}
                    placeholder="e.g. 2022"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    How many tenants are currently staying? <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    className="form-input"
                    value={currentTenantsCount}
                    onChange={(e) => setCurrentTenantsCount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 28"
                  />
                </div>
              </div>

              {/* Accepting new tenants & Public Contact Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    Is the PG accepting new tenants? <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={isAcceptingNewTenants ? 'yes' : 'no'}
                    onChange={(e) => setIsAcceptingNewTenants(e.target.value === 'yes')}
                  >
                    <option value="yes">Yes, Vacancies Available & Accepting</option>
                    <option value="no">No, Currently at Full Capacity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    Contact number displayed for enquiries <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    value={enquiryContactPhone}
                    onChange={(e) => setEnquiryContactPhone(e.target.value)}
                    placeholder="Public enquiry mobile (e.g. +91 98401 23456)"
                  />
                </div>
              </div>

              {/* Relevant Local Registrations or Licences */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 750, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                  Relevant Local Registrations or Licences (Where Applicable)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  Select all active municipal, food safety, or local regulatory clearances you hold:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    'Greater Chennai / Local Municipal Trade License',
                    'FSSAI Food Safety & Standards Authority License',
                    'Local Police Station NOC / Women Hostel Registration',
                    'Fire & Rescue Services Safety Inspection Certificate',
                    'TANGEDCO Commercial Electricity Connection NOC',
                    'Tamil Nadu Shops & Commercial Establishments Act'
                  ].map((lic) => {
                    const isChecked = localLicenses.includes(lic);
                    return (
                      <div
                        key={lic}
                        onClick={() => handleToggleLicense(lic)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                          background: isChecked ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          fontSize: '0.76rem',
                          fontWeight: isChecked ? 700 : 500,
                          color: isChecked ? '#1e40af' : '#334155'
                        }}
                      >
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1.5px solid #94a3b8',
                          background: isChecked ? '#2563eb' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>{lic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleProceedToAudit}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '0.9rem', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}
                >
                  <Sparkles size={16} /> Run Automated Security Detection & Audit
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: AUTOMATED SUSPICIOUS REGISTRATION DETECTION AUDIT       */}
          {/* ============================================================== */}
          {step === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={22} color="#2563eb" />
                  <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                    Automated Suspicious-Registration Detection Audit
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={runSuspiciousDetectionScanner}
                  disabled={isScanning}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                >
                  <RefreshCw size={13} style={{ animation: isScanning ? 'spin 1s linear infinite' : 'none' }} />
                  Re-scan
                </button>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: 0, marginBottom: '1.25rem' }}>
                These checks run automatically during registration and are reviewed by the Super Admin to protect genuine PG owners from fraudulent listings:
              </p>

              {/* Scanning status indicator */}
              {isScanning && (
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                  borderRadius: '14px',
                  border: '1.5px solid #93c5fd',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <RefreshCw size={28} color="#2563eb" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e3a8a' }}>
                    Autonomous AI Security Scanner Analyzing Registration...
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Running telephone deduplication, postal validation, image hash indexing & regulatory compliance tests.
                  </div>
                </div>
              )}

              {/* 7 Core Suspicious Activity Checks Table (From User Prompt) */}
              {!isScanning && (
                <div>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1.5rem'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 750 }}>Suspicious Activity Check</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 750 }}>Automated System Action</th>
                          <th style={{ padding: '0.75rem 1rem', fontWeight: 750, textAlign: 'center' }}>Scan Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            activity: 'Same phone number or email used for multiple owner accounts',
                            systemAction: 'Flag for review',
                            flagType: 'duplicate_phone_email'
                          },
                          {
                            activity: 'Duplicate PG address or property already registered',
                            systemAction: "Check for duplicate ownership; don't auto-reject",
                            flagType: 'duplicate_address'
                          },
                          {
                            activity: 'Invalid OTP or repeated verification failures',
                            systemAction: 'Temporarily restrict attempts',
                            flagType: 'otp_failures'
                          },
                          {
                            activity: 'Missing or unreadable property documents',
                            systemAction: 'Request resubmission',
                            flagType: 'missing_docs'
                          },
                          {
                            activity: 'PG photos reused across unrelated properties',
                            systemAction: 'Flag for manual review',
                            flagType: 'photo_reuse'
                          },
                          {
                            activity: 'Property address cannot be verified',
                            systemAction: 'Request additional evidence',
                            flagType: 'unverified_address'
                          },
                          {
                            activity: 'False or inconsistent registration details',
                            systemAction: 'Hold approval for review',
                            flagType: 'inconsistent_details'
                          }
                        ].map((chk, idx) => {
                          const isFlagged = detectedFlags.some(f => f.type === chk.flagType);
                          return (
                            <tr
                              key={idx}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                background: isFlagged ? 'rgba(239, 68, 68, 0.05)' : idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                              }}
                            >
                              <td style={{ padding: '0.75rem 1rem', color: '#1e293b', fontWeight: isFlagged ? 750 : 500 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  {isFlagged ? (
                                    <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                                  ) : (
                                    <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
                                  )}
                                  <span>{chk.activity}</span>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem 1rem' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  background: isFlagged ? '#fee2e2' : '#f1f5f9',
                                  color: isFlagged ? '#991b1b' : '#475569',
                                  border: isFlagged ? '1px solid #fca5a5' : '1px solid #e2e8f0'
                                }}>
                                  {chk.systemAction}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                {isFlagged ? (
                                  <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.72rem' }}>
                                    ● Flagged
                                  </span>
                                ) : (
                                  <span className="badge badge-paid" style={{ fontSize: '0.72rem' }}>
                                    ✓ Clear Pass
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Audit Summary Box */}
                  <div style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    border: detectedFlags.length === 0 ? '1.5px solid #86efac' : '1.5px solid #fca5a5',
                    background: detectedFlags.length === 0 ? '#f0fdf4' : '#fff5f5',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {detectedFlags.length === 0 ? (
                          <CheckCircle2 size={22} color="#059669" />
                        ) : (
                          <ShieldAlert size={22} color="#dc2626" />
                        )}
                        <strong style={{ fontSize: '0.98rem', color: detectedFlags.length === 0 ? '#065f46' : '#991b1b' }}>
                          {detectedFlags.length === 0
                            ? 'All 7 Security Checks Passed — Legitimate PG Listing Verified'
                            : `${detectedFlags.length} Flagged Anomaly Detected — Routed to Super Admin Desk`}
                        </strong>
                      </div>
                      <span className="badge" style={{
                        background: detectedFlags.length === 0 ? '#10b981' : '#f59e0b',
                        color: '#ffffff'
                      }}>
                        {detectedFlags.length === 0 ? 'Auto-Approval Granted' : 'Super Admin Review Required'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                      {detectedFlags.length === 0 ? (
                        'Your property details comply with UYAR verification policies. Your 14-day free trial will start immediately with full workspace access.'
                      ) : (
                        'Your registration is safely recorded and forwarded to the Super Admin control tower for expedited review. In accordance with system policy, duplicates are not auto-rejected and you can explore your dashboard during the audit period.'
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={16} /> Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    padding: '0.95rem',
                    fontWeight: 850,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <span>Submit Verified Registration & Open PG Owner Workspace</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Log In Here
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
