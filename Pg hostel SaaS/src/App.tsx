import React, { useState, useEffect } from 'react';
import { UserRole, Language, Property, Room, Bed, Resident, Invoice, Expense, Complaint, VisitorPass, NotificationLog, OwnerVerificationDetails, VerificationStatus } from './types';
import { initialProperties, initialRooms, initialBeds, initialResidents, initialInvoices, initialExpenses, initialComplaints, initialVisitorPasses, initialNotificationLogs, initialOwnerVerifications } from './data/mockData';
import { getTranslation } from './translations';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { LoginUserData } from './components/MultiRoleLoginModal';
import { AccountantPortal } from './components/AccountantPortal';
import { BedMatrix } from './components/BedMatrix';
import { ResidentManager } from './components/ResidentManager';
import { BillingManager } from './components/BillingManager';
import { EBEngine } from './components/EBEngine';
import { DepositManager } from './components/DepositManager';
import { NotificationCenter } from './components/NotificationCenter';
import { ExpenseManager } from './components/ExpenseManager';
import { ReportsManager } from './components/ReportsManager';
import { WardenPortal } from './components/WardenPortal';
import { ResidentPortal } from './components/ResidentPortal';
import { SuperAdmin } from './components/SuperAdmin';
import { OwnerVerificationModal } from './components/OwnerVerificationModal';
import { UnifiedAuthPage } from './components/auth/UnifiedAuthPage';
import { OwnerRegistrationPage } from './components/auth/OwnerRegistrationPage';

// 5 Separate Standalone Login Pages & Portal Hub (Single Unified Port)
import { SuperAdminLoginPage } from './components/auth/SuperAdminLoginPage';
import { OwnerLoginPage } from './components/auth/OwnerLoginPage';
import { WardenLoginPage } from './components/auth/WardenLoginPage';
import { AccountantLoginPage } from './components/auth/AccountantLoginPage';
import { TenantLoginPage } from './components/auth/TenantLoginPage';
import { LoginHubPage } from './components/auth/LoginHubPage';
import { StayNestOwnerPortal } from './components/owner/StayNestOwnerPortal';
import { api } from './services/api';

import { 
  Building2, 
  Bed as BedIcon, 
  Users, 
  Receipt, 
  Zap, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  FileText,
  UserCheck,
  MessageSquare, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';

export type AuthPageType = 'none' | 'hub' | 'superadmin' | 'owner' | 'warden' | 'accountant' | 'resident' | 'owner-register';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');

  // Authentication State: Default to NOT logged in so visitor starts on Landing Page
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<LoginUserData | null>(null);

  // 5 Separate Standalone Logins Page State ('none' = Landing Page, 'hub' = All 5 Hub, or dedicated role page)
  const [authPage, setAuthPage] = useState<AuthPageType>('none');

  // Active View / Role when logged in (defaults to 'owner')
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeTab, setActiveTab] = useState<'overview' | 'bedMatrix' | 'residents' | 'billing' | 'ebEngine' | 'deposits' | 'reminders' | 'expenses' | 'reports'>('overview');

  // Main Entities State
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('prop-1');
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [visitorPasses, setVisitorPasses] = useState<VisitorPass[]>(initialVisitorPasses);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(initialNotificationLogs);

  // Modals & Verifications
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [ownerVerifications, setOwnerVerifications] = useState<OwnerVerificationDetails[]>(initialOwnerVerifications);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = getTranslation(language);
  const activeProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize URL hash with separate logins and registration on single port
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#/register') || hash === '#/signup') {
        setAuthPage('owner-register');
      } else if (hash.startsWith('#/login/')) {
        const portal = hash.replace('#/login/', '');
        if (portal === 'superadmin') setAuthPage('superadmin');
        else if (portal === 'owner') setAuthPage('owner');
        else if (portal === 'warden') setAuthPage('warden');
        else if (portal === 'accountant') setAuthPage('accountant');
        else if (portal === 'tenant' || portal === 'resident') setAuthPage('resident');
        else if (portal === 'hub') setAuthPage('hub');
      } else if (hash === '#/owner-portal' || hash === '#/owner' || hash === '#/dashboard') {
        setIsLoggedIn(true);
        setCurrentRole('owner');
        setAuthPage('none');
      } else if (hash === '#saas-page' || hash === '' || hash.startsWith('#contact') || hash.startsWith('#work') || hash.startsWith('#about') || hash.startsWith('#why-uyar')) {
        if (!isLoggedIn) {
          setAuthPage('none');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  // Navigate to dedicated separate PG Owner 4-tier registration page
  const handleOpenRegister = () => {
    setAuthPage('owner-register');
    window.location.hash = '#/register/owner';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to dedicated separate login page
  const handleOpenLogin = (role?: UserRole | 'hub') => {
    if (!role || role === 'public' || role === 'hub') {
      setAuthPage('hub');
      window.location.hash = '#/login/hub';
    } else {
      setAuthPage(role);
      const hashName = role === 'resident' ? 'tenant' : role;
      window.location.hash = `#/login/${hashName}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from standalone login page to landing page
  const handleBackFromAuth = () => {
    setAuthPage('none');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump directly between separate login pages
  const handleSwitchAuthRole = (role: 'hub' | 'superadmin' | 'owner' | 'warden' | 'accountant' | 'resident') => {
    setAuthPage(role);
    const hashName = role === 'resident' ? 'tenant' : role;
    window.location.hash = `#/login/${hashName}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler for all 5 roles
  const handleLoginSuccess = (userData: LoginUserData) => {
    setIsLoggedIn(true);
    setAuthPage('none');
    window.location.hash = '';
    setLoggedInUser(userData);
    setCurrentRole(userData.role);
    setActiveTab('overview');
    if (userData.propertyId) {
      setSelectedPropertyId(userData.propertyId);
    }
    const roleTitles: Record<UserRole, string> = {
      superadmin: 'Super Admin',
      owner: 'PG Owner',
      warden: 'Manager / Warden',
      accountant: 'Accountant',
      resident: 'Tenant',
      public: 'Public'
    };
    showToast(`Welcome, ${userData.name}! Logged in as ${roleTitles[userData.role]}.`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setCurrentRole('owner');
    setAuthPage('none');
    window.location.hash = '';
    showToast('Logged out successfully. Returned to Landing Page.');
  };

  // User profile updater
  const handleUpdateLoggedInUser = (updatedData: Partial<LoginUserData>) => {
    setLoggedInUser(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updatedData };
      try {
        localStorage.setItem('staynest_auth_user', JSON.stringify(next));
      } catch {}
      return next;
    });
  };


  // Handlers for state updates
  const handleAddResident = (newRes: any) => {
    const resId = `res-${Date.now()}`;
    const residentObj: Resident = {
      ...newRes,
      id: resId,
      propertyId: activeProperty.id
    };

    setResidents(prev => [residentObj, ...prev]);

    // Update bed status to occupied
    setBeds(prev => prev.map(b => b.id === newRes.bedId ? { ...b, status: 'occupied', residentId: resId } : b));
    showToast(`Resident ${newRes.name} allocated to Bed ${newRes.bedNumber} successfully!`);
  };

  const handleRecordPayment = (invoiceId: string, amount: number, mode: string, utr: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balanceAmount: newBalance,
          status: newBalance === 0 ? 'paid' : 'partial',
          paidDate: '2026-10-24',
          paymentMode: mode as any,
          utrNumber: utr
        };
      }
      return inv;
    }));

    showToast(`Payment of ₹${amount} reconciled via ${mode} (UTR: ${utr || 'Auto'})`);
  };

  const handlePostEBBills = (calculatedBills: any[]) => {
    showToast('Electricity sub-meter charges computed and posted to draft invoices!');
    setActiveTab('billing');
  };

  const handleMoveOut = (resident: Resident) => {
    setActiveTab('deposits');
    showToast(`Initiating move-out checkout ledger for ${resident.name}...`);
  };

  const handleAddExpense = (expenseData: any) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      propertyId: activeProperty.id
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense of ₹${expenseData.amount} recorded.`);
  };

  const handleResolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
    showToast('Maintenance complaint marked as resolved.');
  };

  const handleApproveVisitor = (id: string) => {
    setVisitorPasses(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    showToast('Visitor gate pass approved.');
  };

  const handleSendNotification = (log: NotificationLog) => {
    setNotificationLogs(prev => [log, ...prev]);
    showToast(`WhatsApp message delivered to ${log.residentName}`);
  };

  const handleUpdateVerificationStatus = (id: string, status: VerificationStatus, note?: string) => {
    setOwnerVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          verificationStatus: status,
          superAdminNotes: note || v.superAdminNotes,
          lastReviewedAt: new Date().toISOString().split('T')[0]
        };
      }
      return v;
    }));
    showToast(`Owner verification status updated to ${status.replace('_', ' ').toUpperCase()}`);
  };

  const handleCompleteOnboarding = (propertyData: any, verificationData?: OwnerVerificationDetails) => {
    const newPropId = `prop-${Date.now()}`;
    const newProperty: Property = {
      ...propertyData,
      id: newPropId,
      phone: propertyData.ownerPhone || '',
      subMeterType: 'per_room'
    };

    if (verificationData) {
      setOwnerVerifications(prev => [verificationData, ...prev]);
    }

    setProperties(prev => [newProperty, ...prev]);
    setSelectedPropertyId(newPropId);
    setIsLoggedIn(true);
    const ownerDisplayName = propertyData.ownerName || 'PG Owner';
    const ownerLoginId = propertyData.loginId || propertyData.username || '';
    setLoggedInUser({ 
      name: ownerDisplayName, 
      email: propertyData.ownerEmail || '',
      role: 'owner'
    });
    setCurrentRole('owner');
    setActiveTab('overview');

    // Asynchronously save registered credentials to SQLite backend
    api.auth.register({
      name: ownerDisplayName,
      email: propertyData.ownerEmail || '',
      phone: propertyData.ownerPhone || '',
      username: ownerLoginId,
      password: propertyData.password || 'Password@123',
      role: 'owner',
      pgName: propertyData.name || '',
      address: propertyData.address || '',
      city: propertyData.city || 'Chennai',
      totalRooms: propertyData.totalRooms || 10,
      totalBeds: propertyData.totalBeds || 30,
      accommodationType: propertyData.type || 'boys'
    }).catch(err => {
      console.warn('Backend sync registration note:', err.message);
    });

    showToast(`Welcome, ${ownerDisplayName}! ${newProperty.name || 'Your PG'} registered successfully. Login ID: @${ownerLoginId || 'owner'}`);
  };

  // Metrics for overview
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const availableBeds = beds.filter(b => b.status === 'available');
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const totalBilled = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalPending = invoices.reduce((s, i) => s + i.balanceAmount, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          borderLeft: '4px solid #10b981',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header: Only displayed at top when Logged In (non-owner) */}
      {isLoggedIn && currentRole !== 'owner' && (
        <Header
          isLoggedIn={isLoggedIn}
          currentRole={currentRole}
          onRoleChange={(r) => setCurrentRole(r)}
          language={language}
          onLanguageToggle={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={(id) => setSelectedPropertyId(id)}
          onOpenLogin={handleOpenLogin}
          onOpenSignUp={handleOpenRegister}
          onLogout={handleLogout}
          ownerName={loggedInUser?.name || 'User'}
        />
      )}

      {/* Main Body */}
      <main style={{ flex: 1 }}>
        {/* ========================================================= */}
        {/* VIEW 1: PUBLIC LANDING PAGE (When visitor has not selected login) */}
        {/* ========================================================= */}
        {!isLoggedIn && authPage === 'none' && (
          <LandingPage
            language={language}
            onLanguageToggle={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
            onOpenLogin={handleOpenLogin}
            onStartTrial={handleOpenRegister}
            onExploreDemo={() => {
              setIsLoggedIn(true);
              setLoggedInUser({ name: 'PG Owner', email: '', role: 'owner' });
              setCurrentRole('owner');
              setActiveTab('overview');
              showToast('Entered PG Owner Workspace.');
            }}
          />
        )}

        {/* ========================================================= */}
        {/* PG OWNER REGISTRATION PAGE (Matching User Mockup Screenshot) */}
        {/* ========================================================= */}
        {!isLoggedIn && authPage === 'owner-register' && (
          <OwnerRegistrationPage
            language={language}
            onComplete={handleCompleteOnboarding}
            onBack={handleBackFromAuth}
            onSwitchToLogin={() => handleOpenLogin('owner')}
            onLanguageToggle={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
            existingVerifications={ownerVerifications}
          />
        )}

        {/* ========================================================= */}
        {/* 5 STANDALONE LOGINS (Role-Isolated, No 5 Tabs, No Shared Password Banner) */}
        {/* ========================================================= */}
        {!isLoggedIn && authPage !== 'none' && authPage !== 'owner-register' && (
          <UnifiedAuthPage
            initialMode="signin"
            initialRole={
              authPage === 'superadmin' ? 'superadmin' :
              authPage === 'warden' ? 'warden' :
              authPage === 'accountant' ? 'accountant' :
              authPage === 'resident' ? 'resident' : 'owner'
            }
            language={language}
            onLoginSuccess={handleLoginSuccess}
            onRegisterComplete={handleCompleteOnboarding}
            onBack={handleBackFromAuth}
            onLanguageToggle={() => setLanguage(l => l === 'en' ? 'ta' : 'en')}
            existingVerifications={ownerVerifications}
          />
        )}


        {/* ========================================================= */}
        {/* VIEW 2: AUTHENTICATED PG OWNER WORKSPACE (StayNest Enterprise Portal) */}
        {/* ========================================================= */}
        {isLoggedIn && currentRole === 'owner' && (
          <StayNestOwnerPortal
            currentUser={loggedInUser}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateLoggedInUser}
            onNavigateLanding={() => {
              setIsLoggedIn(false);
              setAuthPage('none');
              window.location.hash = '';
            }}
          />
        )}

        {false && isLoggedIn && currentRole === 'owner' && (
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1.5rem' }}>
            
            {/* PG Owner Verification Status Banner */}
            {(() => {
              const currentOwnerVerif = ownerVerifications.find(
                v => v.pgName.toLowerCase() === activeProperty.name.toLowerCase() || 
                     v.propertyAddress.toLowerCase().includes(activeProperty.address.toLowerCase()) ||
                     v.legalName.toLowerCase().includes((loggedInUser?.name || '').toLowerCase())
              ) || ownerVerifications[0];

              const isVerified = currentOwnerVerif?.verificationStatus === 'verified';
              const isFlagged = currentOwnerVerif?.verificationStatus === 'flagged_suspicious';

              return (
                <div style={{
                  background: isVerified ? '#f0fdf4' : isFlagged ? '#fff5f5' : '#fffbeb',
                  border: isVerified ? '1px solid #86efac' : isFlagged ? '1px solid #fca5a5' : '1px solid #fde68a',
                  borderRadius: '14px',
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {isVerified ? (
                      <CheckCircle2 size={22} color="#059669" />
                    ) : isFlagged ? (
                      <ShieldAlert size={22} color="#dc2626" />
                    ) : (
                      <AlertTriangle size={22} color="#d97706" />
                    )}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isVerified ? '#065f46' : isFlagged ? '#991b1b' : '#92400e' }}>
                        {isVerified 
                          ? '✓ Property Legally Verified & Safe — All 4 Verification Tiers Approved' 
                          : isFlagged
                            ? '⚠ Registration Under Super Admin Review — Suspicious Activity Flagged'
                            : '● Registration Verification File Under Review by Super Admin'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.1rem' }}>
                        Owner: <strong>{currentOwnerVerif?.legalName || loggedInUser?.name}</strong> • Govt ID: {currentOwnerVerif?.govtIdType?.toUpperCase()} • {currentOwnerVerif?.propertyAddress}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 750,
                      background: '#ffffff',
                      borderColor: isVerified ? '#86efac' : isFlagged ? '#fca5a5' : '#fde68a',
                      color: isVerified ? '#065f46' : isFlagged ? '#991b1b' : '#92400e',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <FileCheck size={14} /> View 4-Tier Verification File & Security Audit
                  </button>
                </div>
              );
            })()}

            {/* Owner Navigation Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '0.4rem', 
              borderBottom: '1px solid var(--border-light)', 
              marginBottom: '1.75rem', 
              overflowX: 'auto',
              paddingBottom: '0.2rem'
            }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <Building2 size={14} /> {t.nav.overview}
              </button>
              <button
                onClick={() => setActiveTab('bedMatrix')}
                className={`btn btn-sm ${activeTab === 'bedMatrix' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <BedIcon size={14} /> {t.nav.bedMatrix}
              </button>
              <button
                onClick={() => setActiveTab('residents')}
                className={`btn btn-sm ${activeTab === 'residents' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <Users size={14} /> {t.nav.residents}
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`btn btn-sm ${activeTab === 'billing' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <Receipt size={14} /> {t.nav.billing}
              </button>
              <button
                onClick={() => setActiveTab('ebEngine')}
                className={`btn btn-sm ${activeTab === 'ebEngine' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)', background: activeTab === 'ebEngine' ? '#7c3aed' : undefined }}
              >
                <Zap size={14} /> {t.nav.ebEngine}
              </button>
              <button
                onClick={() => setActiveTab('deposits')}
                className={`btn btn-sm ${activeTab === 'deposits' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <ShieldCheck size={14} /> {t.nav.deposits}
              </button>
              <button
                onClick={() => setActiveTab('reminders')}
                className={`btn btn-sm ${activeTab === 'reminders' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <MessageSquare size={14} /> {t.nav.reminders}
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`btn btn-sm ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <TrendingUp size={14} /> {t.nav.expenses}
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`btn btn-sm ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', borderRadius: 'var(--radius-md)' }}
              >
                <BarChart3 size={14} /> {t.nav.reports}
              </button>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                {/* 14-Day Free Trial Alert Strip */}
                <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Sparkles size={20} color="#2563eb" />
                    <div>
                      <strong style={{ color: '#1e3a8a' }}>14-Day Free Trial Mode Active</strong>
                      <div style={{ fontSize: '0.8rem', color: '#1e40af' }}>
                        11 days remaining on your trial. All features (Bed matrix, WhatsApp reminders, and EB engine) are unlocked.
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      showToast('Subscription renewal simulator: Plan renewed for 1 year.');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Subscribe Now (₹899/mo)
                  </button>
                </div>

                {/* KPI Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div className="card" style={{ borderLeft: '4px solid var(--primary-600)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.metrics.occupancy}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-900)' }}>{occupancyRate}%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      {occupiedBeds} of {totalBeds} Beds Occupied
                    </div>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.metrics.collectedAmount}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{totalCollected.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Total Billed: ₹{totalBilled.toLocaleString()}
                    </div>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.metrics.pendingAmount}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>₹{totalPending.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                      From 2 tenants overdue
                    </div>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Electricity Sub-Meter Status</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6d28d9' }}>835 Units</div>
                    <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 600 }}>
                      ₹7,933 Shared Among Rooms
                    </div>
                  </div>
                </div>

                {/* Quick Action Navigation Grid */}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>
                  Frequently Used Operations
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div 
                    onClick={() => setActiveTab('ebEngine')} 
                    className="card" 
                    style={{ cursor: 'pointer', borderTop: '3px solid #8b5cf6' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Enter Sub-Meter Readings</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Input room meter units, verify meter photos, and auto-split among roommates.
                    </p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('billing')} 
                    className="card" 
                    style={{ cursor: 'pointer', borderTop: '3px solid #10b981' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Receipt size={20} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Record Payment & UTR Check</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Log cash or UPI receipts with 12-digit UTR validation to stop fake screenshots.
                    </p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('reminders')} 
                    className="card" 
                    style={{ cursor: 'pointer', borderTop: '3px solid #2563eb' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={20} />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Dispatch WhatsApp Reminders</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                      Send pre-approved Tamil & English rent alerts with dynamic UPI pay links.
                    </p>
                  </div>
                </div>

                {/* Inline Bed Matrix Preview */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
                      Live Room & Bed Occupancy
                    </h3>
                    <button onClick={() => setActiveTab('bedMatrix')} className="btn btn-secondary btn-sm">
                      View Full Matrix <ArrowRight size={14} />
                    </button>
                  </div>

                  <BedMatrix
                    rooms={rooms.slice(0, 3)}
                    beds={beds.filter(b => rooms.slice(0, 3).some(r => r.id === b.roomId))}
                    residents={residents}
                    language={language}
                    onAllocateBed={() => setActiveTab('residents')}
                    onViewResident={() => setActiveTab('residents')}
                  />
                </div>
              </div>
            )}

            {/* TAB: BED MATRIX */}
            {activeTab === 'bedMatrix' && (
              <BedMatrix
                rooms={rooms}
                beds={beds}
                residents={residents}
                language={language}
                onAllocateBed={() => setActiveTab('residents')}
                onViewResident={() => setActiveTab('residents')}
              />
            )}

            {/* TAB: RESIDENTS */}
            {activeTab === 'residents' && (
              <ResidentManager
                residents={residents}
                availableBeds={availableBeds}
                language={language}
                onAddResident={handleAddResident}
                onMoveOut={handleMoveOut}
              />
            )}

            {/* TAB: BILLING */}
            {activeTab === 'billing' && (
              <BillingManager
                invoices={invoices}
                language={language}
                onRecordPayment={handleRecordPayment}
                onGenerateMonthlyInvoices={() => {
                  showToast('Automated monthly billing cycle generated for all active stays.');
                }}
              />
            )}

            {/* TAB: EB ENGINE */}
            {activeTab === 'ebEngine' && (
              <EBEngine
                rooms={rooms}
                beds={beds}
                residents={residents}
                language={language}
                onPostEBBills={handlePostEBBills}
              />
            )}

            {/* TAB: DEPOSITS */}
            {activeTab === 'deposits' && (
              <DepositManager
                residents={residents}
                invoices={invoices}
                language={language}
                onFinalizeSettlement={(resId, amt) => {
                  showToast(`Deposit refund voucher of ₹${amt} processed.`);
                }}
              />
            )}

            {/* TAB: WHATSAPP REMINDERS */}
            {activeTab === 'reminders' && (
              <NotificationCenter
                residents={residents}
                invoices={invoices}
                notificationLogs={notificationLogs}
                language={language}
                onSendNotification={handleSendNotification}
              />
            )}

            {/* TAB: EXPENSES */}
            {activeTab === 'expenses' && (
              <ExpenseManager
                expenses={expenses}
                totalCollectedRevenue={totalCollected}
                language={language}
                onAddExpense={handleAddExpense}
              />
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <ReportsManager
                property={activeProperty}
                rooms={rooms}
                beds={beds}
                residents={residents}
                invoices={invoices}
                language={language}
              />
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: WARDEN MOBILE CONSOLE (Preview for Owner) */}
        {/* ========================================================= */}
        {isLoggedIn && currentRole === 'warden' && (
          <div style={{ padding: '1.5rem' }}>
            <WardenPortal
              property={activeProperty}
              rooms={rooms}
              residents={residents}
              complaints={complaints}
              visitorPasses={visitorPasses}
              language={language}
              onResolveComplaint={handleResolveComplaint}
              onApproveVisitor={handleApproveVisitor}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: RESIDENT SELF-SERVICE PORTAL (Preview for Owner) */}
        {/* ========================================================= */}
        {isLoggedIn && currentRole === 'resident' && (
          <div style={{ padding: '1.5rem' }}>
            <ResidentPortal
              resident={residents[0]}
              invoice={invoices[0]}
              complaints={complaints}
              language={language}
              onPayRent={(invId, utr) => {
                handleRecordPayment(invId, invoices[0].balanceAmount, 'UPI', utr);
              }}
              onSubmitComplaint={(cmp) => {
                setComplaints(prev => [cmp, ...prev]);
                showToast('Maintenance ticket submitted to caretaker.');
              }}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: SUPER ADMIN CONSOLE */}
        {/* ========================================================= */}
        {isLoggedIn && currentRole === 'superadmin' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
            <SuperAdmin
              language={language}
              verifications={ownerVerifications}
              onUpdateVerificationStatus={handleUpdateVerificationStatus}
              onImpersonateOwner={(propId) => {
                setSelectedPropertyId(propId);
                setCurrentRole('owner');
                showToast('Support login successful: Viewing PG Owner workspace.');
              }}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: ACCOUNTANT FINANCIAL CONSOLE */}
        {/* ========================================================= */}
        {isLoggedIn && currentRole === 'accountant' && (
          <AccountantPortal
            property={activeProperty}
            rooms={rooms}
            residents={residents}
            invoices={invoices}
            expenses={expenses}
            language={language}
            onRecordPayment={handleRecordPayment}
            onAddExpense={handleAddExpense}
          />
        )}
      </main>

      {/* PG Owner 4-Tier Verification Dossier & Security Audit Inspection Modal */}
      {(() => {
        const currentOwnerVerif = ownerVerifications.find(
          v => v.pgName.toLowerCase() === activeProperty.name.toLowerCase() || 
               v.propertyAddress.toLowerCase().includes(activeProperty.address.toLowerCase()) ||
               v.legalName.toLowerCase().includes((loggedInUser?.name || '').toLowerCase())
        ) || ownerVerifications[0];

        return currentOwnerVerif ? (
          <OwnerVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            verification={currentOwnerVerif}
            language={language}
            onResubmitDoc={(docType) => {
              handleUpdateVerificationStatus(
                currentOwnerVerif.id, 
                'pending_review', 
                `Owner resubmitted document for ${docType}. Sent to Super Admin desk for immediate re-audit.`
              );
              showToast('Fresh document resubmitted to Super Admin for verification review.');
            }}
          />
        ) : null;
      })()}
    </div>
  );
};


export default App;
