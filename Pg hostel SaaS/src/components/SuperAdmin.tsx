import React, { useState } from 'react';
import { Language, OwnerVerificationDetails, VerificationStatus } from '../types';
import { getTranslation } from '../translations';
import { 
  ShieldAlert, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Sparkles,
  AlertTriangle,
  FileText,
  FileCheck,
  MapPin,
  Phone,
  Mail,
  Camera,
  Check,
  X,
  Filter,
  Eye,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { initialOwnerVerifications } from '../data/mockData';

interface SuperAdminProps {
  language: Language;
  onImpersonateOwner: (propertyId: string) => void;
  verifications?: OwnerVerificationDetails[];
  onUpdateVerificationStatus?: (id: string, newStatus: VerificationStatus, note?: string) => void;
}

export const SuperAdmin: React.FC<SuperAdminProps> = ({
  language,
  onImpersonateOwner,
  verifications = initialOwnerVerifications,
  onUpdateVerificationStatus
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'verifications' | 'customers'>('verifications');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVerif, setSelectedVerif] = useState<OwnerVerificationDetails | null>(null);
  const [localVerifications, setLocalVerifications] = useState<OwnerVerificationDetails[]>(verifications);
  const [adminNote, setAdminNote] = useState('');

  // Synchronize when verifications prop changes
  React.useEffect(() => {
    if (verifications && verifications.length > 0) {
      setLocalVerifications(verifications);
    }
  }, [verifications]);

  const mockCustomerAccounts = [
    { id: 'prop-1', name: "Uyar Men's PG — OMR Thoraipakkam", owner: 'Rajesh K', phone: '+91 98401 23456', city: 'Chennai', beds: 42, plan: 'Growth (₹899/mo)', status: 'paid', mrr: 899 },
    { id: 'prop-2', name: "Uyar Women's Executive PG — Guindy", owner: 'K. Jayalakshmi', phone: '+91 98402 34567', city: 'Chennai', beds: 30, plan: 'Starter (₹399/mo)', status: 'paid', mrr: 399 },
    { id: 'prop-3', name: "Uyar Co-Living Hostel — Peelamedu", owner: 'Arun Prakash', phone: '+91 94433 78901', city: 'Coimbatore', beds: 50, plan: 'Pro (₹1,799/mo)', status: 'paid', mrr: 1799 },
    { id: 'prop-4', name: "Sri Sai Luxury Men's PG — Velachery", owner: 'V. Murugan', phone: '+91 98410 55667', city: 'Chennai', beds: 24, plan: '14-Day Free Trial', status: 'trial', mrr: 0 },
    { id: 'prop-5', name: "Annai Teresa Women's Hostel — Saravanampatti", owner: 'Mary S', phone: '+91 97890 88990', city: 'Coimbatore', beds: 35, plan: '14-Day Free Trial', status: 'trial', mrr: 0 }
  ];

  const handleUpdateStatus = (id: string, newStatus: VerificationStatus, note?: string) => {
    setLocalVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          verificationStatus: newStatus,
          reviewedBy: 'Super Admin',
          superAdminNotes: note || v.superAdminNotes
        };
      }
      return v;
    }));

    if (selectedVerif && selectedVerif.id === id) {
      setSelectedVerif(prev => prev ? { ...prev, verificationStatus: newStatus, superAdminNotes: note || prev.superAdminNotes } : null);
    }

    if (onUpdateVerificationStatus) {
      onUpdateVerificationStatus(id, newStatus, note);
    }
  };

  const filteredVerifications = localVerifications.filter(v => {
    const matchesSearch = 
      v.legalName.toLowerCase().includes(search.toLowerCase()) ||
      v.pgName.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && v.verificationStatus === statusFilter;
  });

  const flaggedCount = localVerifications.filter(v => v.verificationStatus === 'flagged_suspicious').length;
  const docsRequiredCount = localVerifications.filter(v => v.verificationStatus === 'docs_required').length;
  const verifiedCount = localVerifications.filter(v => v.verificationStatus === 'verified').length;

  return (
    <div>
      {/* Super Admin Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0, fontWeight: 850 }}>
                Super Admin Control Tower
              </h2>
              <span style={{ background: '#3b82f6', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '9999px' }}>
                ROOT LEVEL
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              Owner Registration Audits • Suspicious Activity Detector • SaaS Infrastructure
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}>
            ● AI Security Scanner Active
          </span>
          <span className="badge" style={{ background: '#10b981', color: '#ffffff' }}>
            Multi-Tenant PostgreSQL Safe
          </span>
        </div>
      </div>

      {/* Global Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Flagged Suspicious Listings
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '0.2rem' }}>
            {flaggedCount} Registrations
          </div>
          <div style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 600 }}>
            Automated detection triggered review
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Pending Document Resubmissions
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#d97706', marginTop: '0.2rem' }}>
            {docsRequiredCount} Properties
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Missing / unreadable deed or tax proof
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Verified PG Properties
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
            {verifiedCount} Verified
          </div>
          <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
            100% Legitimacy & physical check
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Monthly Platform MRR
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#2563eb', marginTop: '0.2rem' }}>
            ₹2,48,500
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            From 32 Active Customer Subscriptions
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('verifications')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            background: activeTab === 'verifications' ? '#1e293b' : 'transparent',
            color: activeTab === 'verifications' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldAlert size={16} color={activeTab === 'verifications' ? '#38bdf8' : '#94a3b8'} />
          <span>PG Owner Registration & Suspicious Activity Audits</span>
          {flaggedCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px'
            }}>
              {flaggedCount} Flagged
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px 10px 0 0',
            border: 'none',
            background: activeTab === 'customers' ? '#1e293b' : 'transparent',
            color: activeTab === 'customers' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Building2 size={16} color={activeTab === 'customers' ? '#38bdf8' : '#94a3b8'} />
          <span>Active Customer Workspaces & MRR Billing</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PG OWNER REGISTRATION & SUSPICIOUS ACTIVITY REVIEW                 */}
      {/* ========================================================================= */}
      {activeTab === 'verifications' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Header, Search & Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 850 }}>
                  Owner Registrations Verification Review Desk
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Audits identity, property existence, ownership deeds, and operational metrics with automated suspicious check detection.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Filter Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={15} color="#64748b" />
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', height: 'auto' }}
                  >
                    <option value="all">All Statuses ({localVerifications.length})</option>
                    <option value="flagged_suspicious">Flagged Suspicious ({flaggedCount})</option>
                    <option value="docs_required">Docs Required ({docsRequiredCount})</option>
                    <option value="verified">Verified Approved ({verifiedCount})</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search owner, PG, or phone..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    style={{ paddingLeft: '2.4rem', fontSize: '0.82rem', padding: '0.45rem 0.75rem 0.45rem 2.4rem' }}
                  />
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Registrations Review Table */}
            <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <table className="data-table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th>PG Name & Location</th>
                    <th>Owner Identity</th>
                    <th>Role & Ownership Proof</th>
                    <th>Capacity & Operations</th>
                    <th>Automated Security Audit</th>
                    <th>Verification Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerifications.map((v) => {
                    const isFlagged = v.suspiciousFlags.length > 0;
                    return (
                      <tr 
                        key={v.id} 
                        style={{
                          background: selectedVerif?.id === v.id ? '#eff6ff' : isFlagged && v.verificationStatus === 'flagged_suspicious' ? '#fff5f5' : '#ffffff',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedVerif(v)}
                      >
                        {/* PG Name & Location */}
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                            {v.pgName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={11} /> {v.propertyAddress}, {v.city} ({v.pinCode})
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600, marginTop: '0.15rem' }}>
                            {v.genderType === 'boys' ? "Men's PG" : v.genderType === 'girls' ? "Women's PG" : 'Co-living'}
                          </div>
                        </td>

                        {/* Owner Identity */}
                        <td>
                          <div style={{ fontWeight: 750, color: '#1e293b' }}>
                            {v.legalName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {v.phone} {v.phoneVerified && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Verified</span>}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {v.govtIdType.toUpperCase()}: <span style={{ fontFamily: 'monospace' }}>{v.govtIdNumber}</span>
                          </div>
                        </td>

                        {/* Role & Ownership Proof */}
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 750,
                            background: v.roleType === 'owner' ? '#dbeafe' : v.roleType === 'leaseholder' ? '#fef3c7' : '#ede9fe',
                            color: v.roleType === 'owner' ? '#1e40af' : v.roleType === 'leaseholder' ? '#92400e' : '#5b21b6',
                            marginBottom: '0.25rem'
                          }}>
                            {v.roleType === 'owner' ? 'Property Owner' : v.roleType === 'leaseholder' ? 'Leaseholder' : 'Authorized Manager'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                            {v.ownershipProofDoc || v.leaseAgreementDoc || v.managerAuthorizationDoc || (
                              <span style={{ color: '#ef4444', fontWeight: 700 }}>No document attached</span>
                            )}
                          </div>
                        </td>

                        {/* Capacity & Operations */}
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                            {v.bedsCount} Beds ({v.roomsCount} Rooms, {v.floorsCount} Fl)
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {v.currentTenantsCount} Tenants staying • Since {v.operatingSinceYear}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: v.isAcceptingNewTenants ? '#059669' : '#dc2626', fontWeight: 600 }}>
                            {v.isAcceptingNewTenants ? '● Accepting admissions' : '● Full / Paused'}
                          </div>
                        </td>

                        {/* Automated Security Audit */}
                        <td>
                          {v.suspiciousFlags.length === 0 ? (
                            <span className="badge badge-paid" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem' }}>
                              <CheckCircle2 size={12} /> All 7 Checks Passed
                            </span>
                          ) : (
                            <div>
                              <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <AlertTriangle size={12} /> {v.suspiciousFlags.length} Flagged Check{v.suspiciousFlags.length > 1 ? 's' : ''}
                              </span>
                              <div style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600, marginTop: '0.2rem' }}>
                                Action: {v.suspiciousFlags[0].systemAction}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Verification Status */}
                        <td>
                          {v.verificationStatus === 'verified' && (
                            <span className="badge badge-paid">Verified Approved</span>
                          )}
                          {v.verificationStatus === 'flagged_suspicious' && (
                            <span className="badge" style={{ background: '#dc2626', color: '#ffffff' }}>Hold for Review</span>
                          )}
                          {v.verificationStatus === 'docs_required' && (
                            <span className="badge" style={{ background: '#d97706', color: '#ffffff' }}>Docs Resubmission</span>
                          )}
                          {v.verificationStatus === 'pending_review' && (
                            <span className="badge badge-reserved">Pending Review</span>
                          )}
                        </td>

                        {/* Action */}
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVerif(v);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.76rem', fontWeight: 700 }}
                          >
                            <Eye size={13} /> Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SELECTED REGISTRATION FULL AUDIT & SUPER ADMIN ACTION DESK                */}
          {/* ========================================================================= */}
          {selectedVerif && (
            <div className="card" style={{ padding: '1.75rem', border: '2px solid #3b82f6', background: '#ffffff', borderRadius: '16px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
              
              {/* Modal/Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                      ID: {selectedVerif.id}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Submitted: {selectedVerif.submittedAt}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.2rem 0' }}>
                    {selectedVerif.pgName} — Verification Audit File
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                    Owner: <strong>{selectedVerif.legalName}</strong> • {selectedVerif.propertyAddress}, {selectedVerif.city} ({selectedVerif.pinCode})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => onImpersonateOwner('prop-1')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', fontWeight: 700 }}
                  >
                    <ExternalLink size={13} /> Support Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedVerif(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* 4 Tiers Summary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                
                {/* 1. Identity Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                    <UserCheck size={16} color="#2563eb" />
                    <span>1. Owner Identity Verification</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155' }}>
                    <div><strong>Legal Name:</strong> {selectedVerif.legalName}</div>
                    <div><strong>Mobile:</strong> {selectedVerif.phone} {selectedVerif.phoneVerified ? <span style={{ color: '#059669', fontWeight: 700 }}>[✓ OTP Verified]</span> : <span style={{ color: '#dc2626' }}>[Unverified]</span>}</div>
                    <div><strong>Email:</strong> {selectedVerif.email || 'N/A'} {selectedVerif.emailVerified && <span style={{ color: '#059669', fontWeight: 700 }}>[✓ Verified]</span>}</div>
                    <div><strong>Govt ID:</strong> {selectedVerif.govtIdType.toUpperCase()} ({selectedVerif.govtIdNumber})</div>
                    <div><strong>ID Doc:</strong> <span style={{ color: '#2563eb', textDecoration: 'underline' }}>{selectedVerif.govtIdDocName || 'Not uploaded'}</span></div>
                    <div><strong>Photo:</strong> {selectedVerif.ownerPhotoName || 'N/A'}</div>
                  </div>
                </div>

                {/* 2. PG Existence Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                    <Building2 size={16} color="#059669" />
                    <span>2. PG Existence Verification</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155' }}>
                    <div><strong>Official Name:</strong> {selectedVerif.pgName}</div>
                    <div><strong>Address:</strong> {selectedVerif.propertyAddress}</div>
                    <div><strong>PIN & City:</strong> {selectedVerif.pinCode}, {selectedVerif.city}</div>
                    <div><strong>Floors / Rooms / Beds:</strong> {selectedVerif.floorsCount} Fl • {selectedVerif.roomsCount} Rooms • {selectedVerif.bedsCount} Beds</div>
                    <div><strong>Hostel Gender:</strong> {selectedVerif.genderType.toUpperCase()}</div>
                    <div><strong>Photos:</strong> {selectedVerif.buildingPhotos.length} building photos • {selectedVerif.signboardPhoto || 'Signboard N/A'}</div>
                  </div>
                </div>

                {/* 3. Ownership / Authorization Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                    <FileCheck size={16} color="#7c3aed" />
                    <span>3. Ownership / Authorization Check</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155' }}>
                    <div><strong>Operational Role:</strong> <span style={{ fontWeight: 800, color: '#4338ca' }}>{selectedVerif.roleType.replace('_', ' ').toUpperCase()}</span></div>
                    {selectedVerif.roleType === 'owner' && (
                      <div><strong>Ownership Proof:</strong> {selectedVerif.ownershipProofType} ({selectedVerif.ownershipProofDoc || 'Missing'})</div>
                    )}
                    {selectedVerif.roleType === 'leaseholder' && (
                      <div><strong>Lease Agreement:</strong> {selectedVerif.leaseAgreementDoc || 'Missing'}</div>
                    )}
                    {selectedVerif.roleType === 'authorized_manager' && (
                      <div><strong>Manager Authorization:</strong> {selectedVerif.managerAuthorizationDoc || 'Missing Authorization Letter'}</div>
                    )}
                  </div>
                </div>

                {/* 4. Operational Verification Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.86rem', marginBottom: '0.65rem' }}>
                    <Clock size={16} color="#d97706" />
                    <span>4. Operational Verification</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155' }}>
                    <div><strong>Operating Status:</strong> {selectedVerif.isOperational ? 'Currently Operational' : 'Opening Soon'}</div>
                    <div><strong>Operating Since:</strong> {selectedVerif.operatingSinceYear}</div>
                    <div><strong>Current Occupants:</strong> {selectedVerif.currentTenantsCount} / {selectedVerif.bedsCount} Beds</div>
                    <div><strong>Admissions:</strong> {selectedVerif.isAcceptingNewTenants ? 'Open' : 'Full / Paused'}</div>
                    <div><strong>Enquiry Contact:</strong> {selectedVerif.enquiryContactPhone}</div>
                    <div><strong>Licenses ({selectedVerif.localLicenses.length}):</strong> {selectedVerif.localLicenses.join(', ') || 'None listed'}</div>
                  </div>
                </div>
              </div>

              {/* Automated Suspicious Checks Results */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <ShieldAlert size={18} color="#dc2626" />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                    Automated Suspicious Activity Scan Results ({selectedVerif.suspiciousFlags.length} Flags Detected)
                  </h4>
                </div>

                {selectedVerif.suspiciousFlags.length === 0 ? (
                  <div style={{ padding: '1rem', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', color: '#065f46', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>All 7 Automated Suspicious Checks Clean: Zero duplicates, verified phone, valid postal PIN, documents consistent.</span>
                  </div>
                ) : (
                  <div style={{ border: '1px solid #fecaca', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: '#fef2f2', color: '#991b1b', textAlign: 'left', borderBottom: '1px solid #fecaca' }}>
                          <th style={{ padding: '0.65rem 0.85rem' }}>Suspicious Activity Detected</th>
                          <th style={{ padding: '0.65rem 0.85rem' }}>Diagnostic Detail</th>
                          <th style={{ padding: '0.65rem 0.85rem' }}>Automated System Action</th>
                          <th style={{ padding: '0.65rem 0.85rem' }}>Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVerif.suspiciousFlags.map((flag, fIdx) => (
                          <tr key={fIdx} style={{ borderBottom: '1px solid #fee2e2', background: '#ffffff' }}>
                            <td style={{ padding: '0.65rem 0.85rem', fontWeight: 750, color: '#991b1b' }}>
                              {flag.title}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>
                              {flag.detail}
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                background: '#fee2e2',
                                color: '#991b1b',
                                border: '1px solid #fca5a5',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                fontWeight: 700,
                                fontSize: '0.74rem'
                              }}>
                                {flag.systemAction}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                background: flag.severity === 'high' ? '#ef4444' : '#f59e0b',
                                color: '#ffffff',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '9999px',
                                fontSize: '0.68rem',
                                fontWeight: 800
                              }}>
                                {flag.severity.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Super Admin Decision / Review Action Panel */}
              <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 850, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.65rem' }}>
                  Super Admin Decision & Status Override
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedVerif.id, 'verified', 'Verified approved by Super Admin after review.')}
                    className="btn btn-sm"
                    style={{ background: '#10b981', color: '#ffffff', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Check size={14} /> Approve & Mark Verified
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedVerif.id, 'flagged_suspicious', 'Suspicious activity held for manual investigation.')}
                    className="btn btn-sm"
                    style={{ background: '#ef4444', color: '#ffffff', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <AlertTriangle size={14} /> Hold Approval for Review
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedVerif.id, 'docs_required', 'Requested fresh property deed / authorization letter resubmission.')}
                    className="btn btn-sm"
                    style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <FileText size={14} /> Request Document Resubmission
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedVerif.id, 'action_required', 'Requested additional address evidence and postal verification.')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <MapPin size={14} /> Request Address Evidence
                  </button>
                </div>

                {selectedVerif.superAdminNotes && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong>Admin Audit Note:</strong> {selectedVerif.superAdminNotes}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACTIVE CUSTOMER WORKSPACES & MRR BILLING                           */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 850 }}>
                Active PG Customer Subscriptions & MRR
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Monitors multi-tenant database namespaces, paid plan tiers, and support impersonation sessions.
              </div>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search PG, owner, or city..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PG Property Name</th>
                  <th>Owner Details</th>
                  <th>City</th>
                  <th>Managed Beds</th>
                  <th>SaaS Plan</th>
                  <th>Subscription Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCustomerAccounts
                  .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.owner.toLowerCase().includes(search.toLowerCase()))
                  .map(acc => (
                    <tr key={acc.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{acc.name}</td>
                      <td>
                        <div>{acc.owner}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.phone}</div>
                      </td>
                      <td>{acc.city}</td>
                      <td style={{ fontWeight: 700 }}>{acc.beds} Beds</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{acc.plan}</span>
                      </td>
                      <td>
                        {acc.status === 'paid' ? (
                          <span className="badge badge-paid">Paid Subscription (₹{acc.mrr}/mo)</span>
                        ) : (
                          <span className="badge badge-reserved">Active Free Trial</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => onImpersonateOwner(acc.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}
                          title="Logged Support Impersonation"
                        >
                          <ExternalLink size={13} /> Support Login
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
