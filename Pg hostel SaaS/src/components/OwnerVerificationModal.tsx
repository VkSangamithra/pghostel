import React, { useState } from 'react';
import { OwnerVerificationDetails, Language, VerificationStatus } from '../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  X, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Bed, 
  UploadCloud,
  Check,
  AlertCircle,
  Activity
} from 'lucide-react';

interface OwnerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: OwnerVerificationDetails;
  language?: Language;
  onResubmitDoc?: (docType: string) => void;
}

export const OwnerVerificationModal: React.FC<OwnerVerificationModalProps> = ({
  isOpen,
  onClose,
  verification,
  language = 'en',
  onResubmitDoc
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'security'>('tiers');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [resubmitted, setResubmitted] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          text: '#065f46',
          icon: <CheckCircle2 size={16} color="#059669" />,
          label: 'Verified & Approved'
        };
      case 'flagged_suspicious':
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          text: '#991b1b',
          icon: <ShieldAlert size={16} color="#dc2626" />,
          label: 'Flagged for Review — Suspicious Activity'
        };
      case 'action_required':
        return {
          bg: '#fff1f2',
          border: '#fecdd3',
          text: '#9f1239',
          icon: <XCircle size={16} color="#e11d48" />,
          label: 'Action Required / Temporarily Restricted'
        };
      case 'docs_required':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#92400e',
          icon: <AlertTriangle size={16} color="#d97706" />,
          label: 'Resubmission / Address Evidence Requested'
        };
      case 'pending_review':
      default:
        return {
          bg: '#f8fafc',
          border: '#cbd5e1',
          text: '#334155',
          icon: <Activity size={16} color="#475569" />,
          label: 'Under Super Admin Review'
        };
    }
  };

  const statusBadge = getStatusBadge(verification.verificationStatus);

  // 7 Standard Suspicious Detection System Actions from Prompt
  const checksMatrix = [
    {
      type: 'duplicate_phone_email' as const,
      label: 'Same phone number or email used for multiple owner accounts',
      systemAction: 'Flag for review',
      flag: verification.suspiciousFlags.find(f => f.type === 'duplicate_phone_email')
    },
    {
      type: 'duplicate_address' as const,
      label: 'Duplicate PG address or property already registered',
      systemAction: 'Check for duplicate ownership; don\'t auto-reject',
      flag: verification.suspiciousFlags.find(f => f.type === 'duplicate_address')
    },
    {
      type: 'otp_failures' as const,
      label: 'Invalid OTP or repeated verification failures',
      systemAction: 'Temporarily restrict attempts',
      flag: verification.suspiciousFlags.find(f => f.type === 'otp_failures')
    },
    {
      type: 'missing_docs' as const,
      label: 'Missing or unreadable property documents',
      systemAction: 'Request resubmission',
      flag: verification.suspiciousFlags.find(f => f.type === 'missing_docs')
    },
    {
      type: 'photo_reuse' as const,
      label: 'PG photos reused across unrelated properties',
      systemAction: 'Flag for manual review',
      flag: verification.suspiciousFlags.find(f => f.type === 'photo_reuse')
    },
    {
      type: 'unverified_address' as const,
      label: 'Property address cannot be verified',
      systemAction: 'Request additional evidence',
      flag: verification.suspiciousFlags.find(f => f.type === 'unverified_address')
    },
    {
      type: 'inconsistent_details' as const,
      label: 'False or inconsistent registration details',
      systemAction: 'Hold approval for review',
      flag: verification.suspiciousFlags.find(f => f.type === 'inconsistent_details')
    }
  ];

  const handleSimulateResubmit = (docType: string) => {
    setResubmitted(docType);
    if (onResubmitDoc) onResubmitDoc(docType);
    setTimeout(() => setResubmitted(null), 3000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #bfdbfe',
                letterSpacing: '0.04em'
              }}>
                REG REF: {verification.id.toUpperCase()}
              </span>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: statusBadge.bg,
                border: `1px solid ${statusBadge.border}`,
                color: statusBadge.text,
                fontSize: '0.76rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px'
              }}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </div>
            </div>

            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              {verification.pgName} — Verification Dossier
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
              Owner: <strong>{verification.legalName}</strong> • Submitted: {verification.submittedAt} • Reviewed by: {verification.reviewedBy || 'Super Admin Desk'}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Super Admin Notice Banner (If flagged or instructions given) */}
        {verification.superAdminNotes && (
          <div style={{
            background: verification.verificationStatus === 'verified' ? '#f0fdf4' : '#fffbeb',
            borderBottom: verification.verificationStatus === 'verified' ? '1px solid #bbf7d0' : '1px solid #fde68a',
            padding: '0.85rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} color={verification.verificationStatus === 'verified' ? '#16a34a' : '#d97706'} />
              <div>
                <strong style={{ color: verification.verificationStatus === 'verified' ? '#166534' : '#92400e' }}>
                  Super Admin Note:
                </strong>{' '}
                <span style={{ color: '#334155' }}>{verification.superAdminNotes}</span>
              </div>
            </div>

            {(verification.verificationStatus === 'docs_required' || verification.verificationStatus === 'action_required') && (
              <button
                type="button"
                onClick={() => handleSimulateResubmit('property_deed')}
                className="btn btn-sm btn-primary"
                style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
              >
                <UploadCloud size={14} /> Upload Fresh Document
              </button>
            )}
          </div>
        )}

        {/* Notification Toast for simulated upload */}
        {resubmitted && (
          <div style={{
            background: '#047857',
            color: '#ffffff',
            padding: '0.6rem 1.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} /> Document resubmitted successfully. Super Admin desk updated.
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 1.75rem',
          background: '#ffffff',
          gap: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('tiers')}
            style={{
              padding: '0.85rem 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: activeTab === 'tiers' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'tiers' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <Building2 size={16} /> 4-Tier Verification Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            style={{
              padding: '0.85rem 0',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: activeTab === 'security' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'security' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            <ShieldCheck size={16} /> Suspicious-Registration Detection Audit ({verification.suspiciousFlags.length} Flags)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
          {activeTab === 'tiers' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* TIER 1: Owner Identity Verification */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    1
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Owner Identity Verification
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Legal credentials, OTP handshakes, and government ID validation
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Full Legal Name
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.legalName}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Mobile + OTP Status
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Phone size={14} color="#64748b" />
                      <strong style={{ color: '#0f172a' }}>{verification.phone}</strong>
                      {verification.phoneVerified ? (
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          ✓ OTP VERIFIED
                        </span>
                      ) : (
                        <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          FAILED
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Email Verification
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                      <Mail size={14} color="#64748b" />
                      <strong style={{ color: '#0f172a' }}>{verification.email}</strong>
                      {verification.emailVerified ? (
                        <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          ✓ VERIFIED
                        </span>
                      ) : (
                        <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Government ID Type & Number
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.govtIdType.toUpperCase()}: <span style={{ fontFamily: 'monospace' }}>{verification.govtIdNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Owner Photo & Govt ID Preview */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f1f5f9', padding: '0.6rem 0.85rem', borderRadius: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#2563eb',
                      fontSize: '1rem'
                    }}>
                      {verification.legalName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Owner Live Photo</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{verification.ownerPhotoName || 'photo_id_captured.jpg'} • Biometric matched</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f1f5f9', padding: '0.6rem 0.85rem', borderRadius: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.72rem'
                    }}>
                      DOC
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Govt ID Document Copy</div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{verification.govtIdDocName || `${verification.govtIdType}_verified.pdf`}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIER 2: PG Existence Verification */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    2
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      PG Existence & Physical Property Verification
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Physical address, PIN validation, entrance & signboard photos
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Official PG / Hostel Name
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.pgName}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Address & PIN Code
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.propertyAddress}, {verification.city} • <strong>PIN: {verification.pinCode}</strong>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Floors, Rooms & Beds
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.floorsCount} Floors • {verification.roomsCount} Rooms • {verification.bedsCount} Beds
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Accommodation & Map Pin
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                      <span style={{ fontWeight: 800, textTransform: 'uppercase', color: '#2563eb' }}>
                        {verification.genderType} Accommodation
                      </span>
                      {verification.googleMapsLocation && (
                        <a 
                          href={verification.googleMapsLocation} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <MapPin size={12} /> Map Pin <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Building & Signboard Photos Gallery */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Building, Entrance & Signboard Photos ({verification.buildingPhotos.length + (verification.signboardPhoto ? 1 : 0)})
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {verification.signboardPhoto && (
                      <div 
                        onClick={() => setSelectedPhoto(verification.signboardPhoto || null)}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                      >
                        <img 
                          src={verification.signboardPhoto} 
                          alt="Signboard" 
                          style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '0.2rem' }}>Signboard</div>
                      </div>
                    )}
                    {verification.buildingPhotos.map((url, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedPhoto(url)}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                      >
                        <img 
                          src={url} 
                          alt={`Building ${i+1}`} 
                          style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', marginTop: '0.2rem' }}>Exterior {i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TIER 3: Ownership / Authorization Check */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    3
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Ownership & Legal Authorization Check
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Property title deeds, lease deeds, or manager power of attorney
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Ownership Status
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.roleType === 'owner' ? 'Direct Property Owner' : verification.roleType === 'authorized_manager' ? 'Authorized PG Manager' : 'Leaseholder / Tenant'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Ownership / Tax Proof Document
                    </div>
                    <div style={{ fontWeight: 700, color: verification.ownershipProofDoc ? '#059669' : '#dc2626', marginTop: '0.15rem' }}>
                      {verification.ownershipProofDoc ? `✓ ${verification.ownershipProofType.replace('_', ' ').toUpperCase()} Attached` : 'Missing Document'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Rental / Lease Agreement
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.leaseAgreementDoc ? `✓ ${verification.leaseAgreementDoc}` : 'N/A (Owner Occupied)'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Manager Authorization Document
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.managerAuthorizationDoc ? `✓ ${verification.managerAuthorizationDoc}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* TIER 4: Operational Verification */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#f3e8ff',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    4
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      Operational Verification & Local Licenses
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Active status, start year, staying tenants, enquiry phone, and municipal registrations
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Currently Operational?
                    </div>
                    <div style={{ fontWeight: 800, color: verification.isOperational ? '#059669' : '#dc2626', marginTop: '0.15rem' }}>
                      {verification.isOperational ? '✓ Yes, Actively Running' : 'Under Renovation / Pending'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Operating Start Year
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      Since {verification.operatingSinceYear}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Current Tenants Staying
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.currentTenantsCount} Active Tenants
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Accepting New Tenants?
                    </div>
                    <div style={{ fontWeight: 800, color: verification.isAcceptingNewTenants ? '#059669' : '#d97706', marginTop: '0.15rem' }}>
                      {verification.isAcceptingNewTenants ? '✓ Yes, Open for Booking' : 'Currently Fully Booked'}
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Enquiry Contact Number
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                      {verification.enquiryContactPhone}
                    </div>
                  </div>
                </div>

                {/* Local Licences Badges */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Local Municipal & Safety Licenses
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {verification.localLicenses && verification.localLicenses.length > 0 ? (
                      verification.localLicenses.map((lic: string, i: number) => (
                        <span 
                          key={i}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '8px'
                          }}
                        >
                          ✓ {lic}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No optional licenses attached</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* SECURITY DETECTION ENGINE REPORT */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <ShieldAlert size={20} color="#ef4444" />
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 850, color: '#ffffff' }}>
                      Automated Suspicious-Registration Detection Engine
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Automated background checks executed continuously. Reviewed by Super Admin Control Tower.
                  </div>
                </div>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '10px',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  {verification.suspiciousFlags.length === 0 ? '✓ CLEAN PASS — ZERO FLAGS' : `⚠ ${verification.suspiciousFlags.length} SUSPICIOUS FLAGS DETECTED`}
                </div>
              </div>

              {/* Exact 7 Checks Matrix Table */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#475569' }}>Suspicious Activity Check</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#475569' }}>Mandated System Action</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#475569' }}>Status</th>
                      <th style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: '#475569' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checksMatrix.map((item, idx) => {
                      const isTriggered = !!item.flag;
                      return (
                        <tr 
                          key={idx}
                          style={{
                            borderBottom: idx === checksMatrix.length - 1 ? 'none' : '1px solid #f1f5f9',
                            background: isTriggered ? '#fef2f2' : '#ffffff'
                          }}
                        >
                          <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: isTriggered ? '#991b1b' : '#0f172a' }}>
                            {item.label}
                          </td>
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              background: isTriggered ? '#fee2e2' : '#f1f5f9',
                              color: isTriggered ? '#b91c1c' : '#334155',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              fontFamily: 'monospace'
                            }}>
                              {item.systemAction}
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            {isTriggered ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: '#dc2626',
                                fontWeight: 800,
                                fontSize: '0.78rem'
                              }}>
                                <XCircle size={15} /> Flagged
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: '#16a34a',
                                fontWeight: 800,
                                fontSize: '0.78rem'
                              }}>
                                <CheckCircle2 size={15} /> Passed
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.9rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                            {item.flag?.detail || 'Standard verification clear; no conflict identified.'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Super Admin Control Tower Review Details */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  Super Admin Control Tower Governance
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  Any automated flag is immediately placed on hold and escalated to the Super Admin desk. If duplicate ownership is detected, existing owners are notified to confirm lease transfers rather than auto-rejecting. For unverified addresses or blurry tax deeds, owners receive a direct resubmission link.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Verification Protocol: <strong>UYAR Trust-Guard v4.2</strong> • Tamper-evident ledger
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontWeight: 700 }}
          >
            Close Dossier
          </button>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal if user clicked any photo */}
      {selectedPhoto && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            background: 'rgba(0, 0, 0, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div style={{ position: 'relative', maxWidth: '800px', maxHeight: '80vh' }}>
            <img 
              src={selectedPhoto} 
              alt="Preview" 
              style={{ width: '100%', height: 'auto', borderRadius: '12px', border: '2px solid #ffffff' }}
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                background: '#ffffff',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
