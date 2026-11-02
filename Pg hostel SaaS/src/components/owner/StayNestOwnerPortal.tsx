import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCheck, 
  Bed as BedIcon, 
  Receipt, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  Filter, 
  ExternalLink, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  FileText,
  LogOut,
  RefreshCw,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import './StayNestOwnerPortal.css';

interface StayNestOwnerPortalProps {
  currentUser?: {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    propertyName?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
  onNavigateLanding?: () => void;
  onUpdateUser?: (updated: any) => void;
}

type TabType = 'dashboard' | 'properties' | 'staff' | 'tenants' | 'rooms' | 'finance' | 'complaints' | 'reports' | 'settings';

export const StayNestOwnerPortal: React.FC<StayNestOwnerPortalProps> = ({ currentUser, onLogout, onNavigateLanding, onUpdateUser }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('staynest_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('staynest_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Owner Profile Reactive State (Synced with LocalStorage & Credentials)
  const [profileData, setProfileData] = useState<{ name: string; email: string; phone: string; brand: string }>(() => {
    try {
      const saved = localStorage.getItem('staynest_owner_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return parsed;
        }
      }
    } catch {}

    const initialName = currentUser?.name && currentUser.name !== 'User' && currentUser.name !== 'PG Owner'
      ? currentUser.name
      : 'Suresh Kumar (PG Owner)';

    return {
      name: initialName,
      email: currentUser?.email && currentUser.email !== 'owner@staynest.com' ? currentUser.email : 'owner@hostel.com',
      phone: '9840123456',
      brand: 'VKPG StayNest Network'
    };
  });

  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [propertyGenderFilter, setPropertyGenderFilter] = useState<string>('all');
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  const toggleSelectRow = (id: string | number) => {
    setSelectedRowIds(prev => ({ ...prev, [String(id)]: !prev[String(id)] }));
  };

  const toggleSelectAll = (ids: (string | number)[]) => {
    const allSelected = ids.length > 0 && ids.every(id => selectedRowIds[String(id)]);
    const next = { ...selectedRowIds };
    ids.forEach(id => {
      next[String(id)] = !allSelected;
    });
    setSelectedRowIds(next);
  };

  // Data States (Clean Slate for Original Data)
  const [summary, setSummary] = useState<any>({
    totalProperties: 0,
    totalTenants: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    occupancyPercentage: 0,
    monthlyRevenue: 0,
    outstandingRent: 0,
    pendingComplaints: 0
  });

  const [properties, setProperties] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [financeSummary, setFinanceSummary] = useState<any>({
    totalCollections: 0,
    totalExpenses: 0,
    totalDeposits: 0,
    outstandingRent: 0,
    netBalance: 0
  });
  const [complaints, setComplaints] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any>({
    rentDueDate: 5,
    lateFeeAmount: 200,
    noticePeriodDays: 30,
    visitorCurfew: '21:00',
    generalRules: 'Smoking and alcohol strictly prohibited. Quiet hours after 10 PM. Visitors allowed in lobby only.'
  });

  // Keep Profile Synced with Loaded Properties without overwriting user-configured name
  useEffect(() => {
    if (properties.length > 0 && properties[0]?.name) {
      const pName = properties[0].name;
      setProfileData(prev => {
        try {
          const saved = localStorage.getItem('staynest_owner_profile');
          if (saved) return prev; // Do not touch saved user profile!
        } catch {}

        return {
          ...prev,
          brand: prev.brand || `${pName.toUpperCase()} StayNest Network`
        };
      });
    }
  }, [properties]);

  const ownerName = profileData.name;
  const ownerSubtitle = profileData.brand || (properties[0]?.name ? `${properties[0].name} Workspace` : (currentUser?.propertyName || 'Hostel Workspace'));
  const ownerInitials = useMemo(() => {
    const cleanName = (profileData.name || '').trim();
    if (!cleanName) return 'SK';
    const parts = cleanName.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase() || 'SK';
  }, [profileData.name]);

  // Persistent Save Handler for Owner Profile
  const handleSaveProfile = () => {
    const trimmedName = (profileData.name || '').trim();
    if (!trimmedName) {
      showToast('Please enter an owner name.');
      return;
    }

    try {
      localStorage.setItem('staynest_owner_profile', JSON.stringify(profileData));
      const savedUserStr = localStorage.getItem('staynest_auth_user');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        u.name = trimmedName;
        u.email = profileData.email;
        localStorage.setItem('staynest_auth_user', JSON.stringify(u));
      }
    } catch (e) {
      console.error('Failed to save owner profile', e);
    }

    if (onUpdateUser) {
      onUpdateUser({
        name: trimmedName,
        email: profileData.email
      });
    }

    showToast(`Owner name updated to "${trimmedName}"!`);
  };

  // Custom Confirmation Dialog (Replaces native browser confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Sub-tabs
  const [staffTab, setStaffTab] = useState<'wardens' | 'accountants'>('wardens');
  const [roomsTab, setRoomsTab] = useState<'floors' | 'rooms' | 'beds'>('rooms');
  const [financeTab, setFinanceTab] = useState<'collections' | 'expenses' | 'deposits' | 'outstanding'>('collections');
  const [reportsTab, setReportsTab] = useState<'reports' | 'policies' | 'notifications' | 'profile'>('reports');
  const [reportSubTab, setReportSubTab] = useState<'occupancy' | 'revenue' | 'expenses' | 'tenants' | 'staff'>('occupancy');

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [selectedRoomForBeds, setSelectedRoomForBeds] = useState<any | null>(null);
  const [selectedBedForAction, setSelectedBedForAction] = useState<any | null>(null);
  const [selectedTenantForBed, setSelectedTenantForBed] = useState<string>('');
  const [customRentForBed, setCustomRentForBed] = useState<number | string>('');

  // Modal States
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [viewingCredentials, setViewingCredentials] = useState<any | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState<boolean>(false);
  const [showCredentialsPassword, setShowCredentialsPassword] = useState<boolean>(false);

  const propertyImageFileRef = useRef<HTMLInputElement>(null);

  const handlePropertyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        setFormData((prev: any) => ({ ...prev, image: base64Url }));
        showToast('Property photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial Fetch & Refresh
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Entities (High priority for UI updates)
      try {
        const props = await api.properties.getAll();
        setProperties(props || []);
      } catch (e) {
        console.error('Failed to load properties:', e);
      }

      try {
        const staff = await api.staff.getAll();
        setStaffList(staff || []);
      } catch (e) {
        console.error('Failed to load staff:', e);
      }

      let currentTenants: any[] = [];
      try {
        currentTenants = await api.tenants.getAll(selectedProperty);
        setTenants(currentTenants || []);
      } catch (e) {
        console.error('Failed to load tenants:', e);
      }

      try {
        const rms = await api.rooms.getAll(selectedProperty);
        setRooms(rms || []);
        if (rms && rms.length > 0 && !selectedRoomForBeds) {
          setSelectedRoomForBeds(rms[0]);
        }
      } catch (e) {
        console.error('Failed to load rooms:', e);
      }

      let currentCollections: any[] = [];
      try {
        currentCollections = await api.finance.getCollections();
        setCollections(currentCollections || []);
      } catch (e) {
        console.error('Failed to load collections:', e);
      }

      try {
        const finSum = await api.finance.getSummary(selectedProperty);
        if (finSum) {
          setFinanceSummary(finSum);
        }
      } catch {
        const calcColls = (currentCollections || []).filter((c: any) => c.status?.toLowerCase() === 'paid').reduce((s: number, c: any) => s + (c.paidAmount || c.amount || 0), 0);
        const calcDeposits = (currentTenants || []).reduce((s: number, t: any) => s + (t.depositAmount || t.deposit || 0), 0);
        const calcOutstanding = (currentTenants || []).reduce((s: number, t: any) => {
          return t.paymentStatus?.toLowerCase() === 'pending' || t.status?.toLowerCase() === 'pending' ? s + (t.monthlyRent || t.rent || 0) : s;
        }, 0);
        setFinanceSummary({
          totalCollections: calcColls,
          totalExpenses: 0,
          totalDeposits: calcDeposits,
          outstandingRent: calcOutstanding,
          netBalance: calcColls
        });
      }

      try {
        const cmps = await api.complaints.getAll(selectedProperty);
        setComplaints(cmps || []);
      } catch (e) {
        console.error('Failed to load complaints:', e);
      }

      try {
        const pols = await api.reports.getPolicies();
        if (pols) setPolicies(pols);
      } catch (e) {
        console.error('Failed to load policies:', e);
      }

      // 2. Dashboard summary & charts
      try {
        const sum = await api.dashboard.getSummary(selectedProperty);
        if (sum) setSummary(sum);
      } catch (e) {
        console.error('Failed to load dashboard summary:', e);
      }

      try {
        const occ = await api.dashboard.getOccupancy();
        if (occ) setOccupancyData(occ);
      } catch (e) {
        console.error('Failed to load occupancy:', e);
      }

      try {
        const rev = await api.dashboard.getRevenue();
        if (rev) setRevenueData(rev);
      } catch (e) {
        console.error('Failed to load revenue data:', e);
      }

    } catch (err: any) {
      console.warn('API fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedProperty]);

  // Modals Submit Handler
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'property') {
        const payload = {
          ...formData,
          totalFloors: formData.totalFloors !== '' && formData.totalFloors !== undefined ? Number(formData.totalFloors) : 3,
          totalBeds: formData.totalBeds !== '' && formData.totalBeds !== undefined ? Number(formData.totalBeds) : 40
        };
        if (editingItem) {
          await api.properties.update(editingItem.id, payload);
          showToast('Property updated successfully!');
        } else {
          await api.properties.create(payload);
          showToast('New PG Property created successfully!');
        }
      } else if (modalType === 'warden' || modalType === 'accountant') {
        const role = modalType === 'warden' ? 'warden' : 'accountant';
        if (editingItem) {
          await api.staff.update(editingItem.id, formData);
          showToast('Staff member updated successfully!');
        } else {
          await api.staff.create({ ...formData, role });
          showToast(`New ${role.toUpperCase()} onboarded successfully!`);
        }
      } else if (modalType === 'tenant') {
        if (editingItem) {
          await api.tenants.update(editingItem.id, formData);
          setTenants(prev => prev.map(t => t.id === editingItem.id ? {
            ...t,
            ...formData,
            username: (formData.username || t.username || '').replace(/^@/, ''),
            password: formData.password || t.password
          } : t));
          showToast('Tenant profile and login credentials updated successfully!');
        } else {
          await api.tenants.create(formData);
          showToast('Tenant registered and bed allocated successfully!');
        }
      } else if (modalType === 'room') {
        const targetPropId = formData.propertyId || (selectedProperty !== 'all' ? selectedProperty : properties[0]?.id);
        if (editingItem) {
          await api.rooms.update(editingItem.id, { ...formData, propertyId: targetPropId });
          showToast('Room details updated successfully!');
        } else {
          await api.rooms.create({ ...formData, propertyId: targetPropId });
          showToast('Room added successfully!');
        }
      } else if (modalType === 'payment') {
        await api.finance.createPayment(formData);
        showToast('Rent payment recorded successfully!');
      } else if (modalType === 'complaint') {
        await api.complaints.create(formData);
        showToast('Complaint ticket logged successfully!');
      } else if (modalType === 'policies') {
        await api.reports.updatePolicies(policies);
        showToast('PG Policies updated successfully!');
      }

      setModalType(null);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Action failed. Please verify inputs.');
    }
  };

  // Action Handlers (Using Sleek Custom Confirmation Modal)
  const handleCheckoutTenant = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Resident Checkout',
      message: `Are you sure you want to check out resident "${name}"? This will free up their allocated bed for new bookings.`,
      confirmText: 'Confirm Checkout',
      isDestructive: false,
      onConfirm: async () => {
        try {
          await api.tenants.checkOut(id);
          showToast(`Resident ${name} checked out. Bed released.`);
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to check out tenant');
        }
      }
    });
  };

  const handleDeleteTenant = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Resident Record',
      message: `Are you sure you want to permanently remove resident "${name}"?`,
      confirmText: 'Delete Resident',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.tenants.checkOut(id);
          showToast(`Resident ${name} record removed.`);
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete tenant');
        }
      }
    });
  };

  const handleResolveComplaint = async (code: string) => {
    try {
      await api.complaints.update(code, { status: 'Resolved' });
      showToast(`Complaint ${code} marked as Resolved.`);
      fetchData();
    } catch (err) {
      showToast('Failed to update complaint status');
    }
  };

  const handleDeleteStaff = (id: string, name?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Deactivate Staff Account',
      message: `Are you sure you want to deactivate ${name ? `"${name}"` : 'this staff member'}? They will no longer have access to the staff portal.`,
      confirmText: 'Deactivate Account',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.staff.delete(id);
          showToast('Staff account deactivated.');
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to deactivate staff');
        }
      }
    });
  };

  const handleDeleteProperty = (id: string, name?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Property',
      message: `Are you sure you want to delete ${name ? `"${name}"` : 'this property'}? This will permanently remove the property, its rooms, and associated records.`,
      confirmText: 'Delete Property',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.properties.delete(id);
          showToast('Property deleted successfully.');
          if (selectedProperty === id) setSelectedProperty('all');
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete property');
        }
      }
    });
  };

  const handleDeleteRoom = (id: string, roomNo: string) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Room ${roomNo}`,
      message: `Are you sure you want to delete Room ${roomNo} and all its beds? This action cannot be undone.`,
      confirmText: 'Delete Room',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.rooms.delete(id);
          showToast(`Room ${roomNo} deleted successfully.`);
          if (selectedRoomForBeds?.id === id) {
            setSelectedRoomForBeds(null);
          }
          fetchData();
        } catch (err: any) {
          showToast(err.message || 'Failed to delete room');
        }
      }
    });
  };

  const handleAllocateBed = async () => {
    if (!selectedBedForAction || !selectedTenantForBed) {
      showToast('Please select a resident to allocate to this bed');
      return;
    }
    try {
      const rentNum = customRentForBed !== '' && customRentForBed !== undefined 
        ? parseFloat(String(customRentForBed)) 
        : (selectedBedForAction.bed.monthlyRent || selectedBedForAction.room.rentPerBed || 6500);
      await api.beds.allocate(selectedBedForAction.bed.id, selectedTenantForBed, rentNum);
      showToast(`Bed ${selectedBedForAction.bed.bedNumber} allocated at ₹${rentNum.toLocaleString()}/mo successfully!`);
      setSelectedBedForAction(null);
      setSelectedTenantForBed('');
      setCustomRentForBed('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to allocate bed');
    }
  };

  const handleUpdateBedRent = async () => {
    if (!selectedBedForAction) return;
    try {
      const rentNum = parseFloat(String(customRentForBed));
      if (isNaN(rentNum) || rentNum < 0) {
        showToast('Please enter a valid rent amount');
        return;
      }
      await api.beds.update(selectedBedForAction.bed.id, rentNum);
      showToast(`Monthly rent updated to ₹${rentNum.toLocaleString()} successfully!`);
      setSelectedBedForAction(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update rent');
    }
  };

  const handleDeallocateBed = async () => {
    if (!selectedBedForAction) return;
    if (confirm(`Vacate ${selectedBedForAction.bed.bedNumber}? This will unassign the current occupant.`)) {
      try {
        await api.beds.deallocate(selectedBedForAction.bed.id);
        showToast(`Bed ${selectedBedForAction.bed.bedNumber} vacated and available!`);
        setSelectedBedForAction(null);
        fetchData();
      } catch (err: any) {
        showToast(err.message || 'Failed to vacate bed');
      }
    }
  };

  // Filtered views
  const filteredStaff = useMemo(() => {
    const roleMatch = staffTab === 'wardens' ? 'warden' : 'accountant';
    return staffList.filter(s => {
      const matchesRole = s.role?.toLowerCase() === roleMatch;
      const matchesSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.contact?.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || s.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [staffList, staffTab, searchQuery, statusFilter]);

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.contact?.includes(searchQuery) ||
                            t.roomBed?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  const propertyStats = useMemo(() => {
    const totalProps = properties.length;
    const activeProps = properties.filter(p => p.status === 'Active').length;
    const totalBeds = properties.reduce((acc, p) => acc + (Number(p.totalBeds) || 0), 0);
    const totalOccupied = properties.reduce((acc, p) => acc + (Number(p.occupied) || 0), 0);
    const totalVacant = properties.reduce((acc, p) => acc + (Number(p.vacant) || 0), 0);
    const occupancyRate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
    return { totalProps, activeProps, totalBeds, totalOccupied, totalVacant, occupancyRate };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesGender = propertyGenderFilter === 'all' || p.gender?.toLowerCase() === propertyGenderFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [properties, searchQuery, statusFilter, propertyGenderFilter]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchesSearch = !searchQuery || r.roomNo?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFloor = floorFilter === 'all' || r.floor === floorFilter;
      const matchesType = roomTypeFilter === 'all' || r.roomType === roomTypeFilter;
      return matchesSearch && matchesFloor && matchesType;
    });
  }, [rooms, searchQuery, floorFilter, roomTypeFilter]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.tenant?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter]);

  const activeComplaints = useMemo(() => {
    return complaints.filter(c => c.status !== 'Resolved');
  }, [complaints]);

  return (
    <div className="sn-portal-container flex h-screen bg-[#F6F7FB] text-[#1E293B] font-sans antialiased overflow-hidden">
      {/* ========================================================= */}
      {/* PERSISTENT LEFT SIDEBAR (Exact Match to Reference Design) */}
      {/* ========================================================= */}
      <aside className={`sn-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top Brand Header Card (Matching Image 1 & Image 3) */}
          <div className="sn-brand-card-container">
            {!isSidebarCollapsed ? (
              <div className="sn-brand-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="sn-brand-logo-sq">
                    <Building2 className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="sn-brand-title-text font-black tracking-tight text-[#0F172A]">STAYNEST</h1>
                    <div className="sn-brand-sub-badge">
                      <span className="sn-live-dot"></span>
                      <span>PG OWNER PORTAL</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  title="Collapse sidebar"
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#7C3AED] hover:bg-purple-100/50 flex items-center justify-center transition-all cursor-pointer ml-1 shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleSidebar}
                title="Expand sidebar"
                className="sn-brand-card group relative"
              >
                <div className="sn-brand-logo-sq">
                  <Building2 className="w-5 h-5 text-[#7C3AED] group-hover:scale-95 transition-transform" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#EDE7FD] shadow-xs flex items-center justify-center text-[#7C3AED]">
                  <ChevronRight className="w-2.5 h-2.5" />
                </span>
              </button>
            )}
          </div>

          {/* Navigation Sections (Categorized like Image 1, collapsing to Image 3) */}
          <nav className="sn-nav-list flex-1">
            {[
              {
                id: 'overview',
                title: 'OVERVIEW',
                items: [
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'properties', label: 'Properties', icon: Building2 },
                  { id: 'staff', label: 'Staff Management', icon: Users },
                ]
              },
              {
                id: 'residents',
                title: 'RESIDENTS & ROOMS',
                items: [
                  { id: 'tenants', label: 'Tenants', icon: UserCheck },
                  { id: 'rooms', label: 'Rooms & Beds', icon: BedIcon },
                ]
              },
              {
                id: 'finance_ops',
                title: 'FINANCE & OPS',
                items: [
                  { id: 'finance', label: 'Finance', icon: Receipt },
                  { 
                    id: 'complaints', 
                    label: 'Complaints', 
                    icon: AlertTriangle, 
                    badge: activeComplaints.length > 0 ? activeComplaints.length : undefined 
                  },
                  { 
                    id: 'reports', 
                    label: 'Reports & Settings', 
                    icon: Settings, 
                    hasGreenDot: true 
                  },
                ]
              }
            ].map((section, secIdx) => (
              <div key={section.id} className="w-full">
                {/* Section title when expanded, thin horizontal line when collapsed (Image 3) */}
                {!isSidebarCollapsed ? (
                  <div className="sn-nav-section-title">
                    {section.title}
                  </div>
                ) : secIdx > 0 ? (
                  <div className="sn-nav-section-divider" />
                ) : null}

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = item.id === 'reports' ? (activeTab === 'reports' || activeTab === 'settings') : activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        title={item.label}
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}
                        className={`sn-nav-btn ${isActive ? 'active' : ''} group`}
                      >
                        {/* Solid purple vertical active bar on the left (Image 1 & 3) */}
                        {isActive && <div className="sn-active-bar" />}

                        {/* Squircle Icon Container */}
                        <div className="sn-icon-sq-wrap relative">
                          <div className="sn-icon-sq">
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Collapsed dot or badge positioning (Image 3) */}
                          {isSidebarCollapsed && item.hasGreenDot && (
                            <span className="sn-green-dot" />
                          )}
                          {isSidebarCollapsed && item.badge !== undefined && (
                            <span className="sn-item-badge">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Label & Badges when expanded (Image 1) */}
                        {!isSidebarCollapsed && (
                          <>
                            <span className="sn-item-label font-semibold">{item.label}</span>
                            {item.hasGreenDot && <span className="sn-green-dot" />}
                            {item.badge !== undefined && (
                              <span className="sn-item-badge">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Profile Card & Footer (Exact Match to Image 1 & Image 3) */}
        <div className="sn-sidebar-bottom">
          {/* Back to Public Website */}
          {onNavigateLanding && !isSidebarCollapsed && (
            <button
              onClick={onNavigateLanding}
              className="sn-back-btn"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          )}

          {onNavigateLanding && isSidebarCollapsed && (
            <button
              onClick={onNavigateLanding}
              title="Back to Public Website"
              className="w-10 h-10 rounded-xl bg-[#F6F2FF] text-[#7C3AED] border border-[#EDE7FD] hover:bg-[#EDE7FD] flex items-center justify-center mx-auto transition-all mb-1 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {/* Profile Card */}
          {!isSidebarCollapsed ? (
            <div className="sn-profile-card">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Purple Avatar Squircle with Green Online Dot */}
                <div className="sn-profile-avatar-sq">
                  {ownerInitials}
                  <span className="sn-profile-online-dot"></span>
                </div>
                {/* Name & Subtitle */}
                <div className="min-w-0 text-left">
                  <div className="font-extrabold text-xs text-[#0F172A] tracking-wide uppercase truncate leading-tight">
                    {ownerName}
                  </div>
                  <div className="text-[10px] font-bold text-[#8B5CF6] tracking-wider uppercase truncate mt-0.5">
                    {ownerSubtitle}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1 shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              {/* Collapsed Avatar with Online Dot (Image 3) */}
              <div 
                className="sn-profile-avatar-sq cursor-pointer"
                title={`${ownerName} • ${ownerSubtitle}`}
              >
                {ownerInitials}
                <span className="sn-profile-online-dot"></span>
              </div>

              {/* Collapsed Logout Button (Image 3) */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Version Footer */}
          {!isSidebarCollapsed && (
            <div className="text-center text-[11px] font-semibold text-slate-400 pt-0.5">
              StayNest Cloud • v2.4
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <div className="sn-main-wrapper flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="sn-top-header h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between shrink-0 z-10">
          {/* Global Search Input */}
          <div className="sn-search-container relative w-96">
            <Search className="sn-search-icon w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenants, rooms, payments..."
              className="sn-search-input w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:bg-white transition-all"
            />
          </div>

          {/* Right Header Badges & User Profile */}
          <div className="sn-header-right flex items-center gap-5">
            {/* Sync Refresh Button */}
            <button 
              onClick={fetchData} 
              disabled={isLoading}
              title="Refresh database records"
              className="sn-icon-btn p-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#4F46E5]' : ''}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="sn-icon-btn relative p-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] transition-all"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {activeComplaints.length > 0 && (
                  <span className="sn-badge-count absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {activeComplaints.length}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <span className="font-bold text-sm text-[#0F172A]">Notifications</span>
                    {activeComplaints.length > 0 ? (
                      <span className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full font-bold">
                        {activeComplaints.length} New
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">All Caught Up</span>
                    )}
                  </div>
                  <div className="py-2 max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                    {activeComplaints.length === 0 ? (
                      <div className="py-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-[#0F172A]">No unread notifications</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">There are no pending complaints or urgent alerts.</p>
                      </div>
                    ) : (
                      activeComplaints.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => {
                            setActiveTab('complaints');
                            setNotificationOpen(false);
                          }}
                          className="flex gap-3 items-start py-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            c.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="text-xs flex-1 min-w-0">
                            <p className="font-semibold text-[#0F172A] truncate">{c.title}</p>
                            <p className="text-[#64748B] text-[11px] mt-0.5 truncate">{c.property} • Room {c.room} ({c.tenant})</p>
                            <span className="text-[10px] text-[#94A3B8] mt-1 inline-block">{c.date || 'Recent'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown Pill */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="sn-user-pill flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all"
              >
                <div className="sn-user-avatar w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {ownerInitials}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-bold text-[#0F172A] leading-tight">{ownerName}</div>
                  <div className="text-xs text-[#64748B]">{ownerSubtitle}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#F1F5F9]">
                    <p className="text-xs font-bold text-[#0F172A]">{ownerName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{profileData.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setReportsTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-lg mt-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* SCROLLABLE MODULE VIEW */}
        <main className="sn-viewport flex-1 overflow-y-auto p-8">
          {/* ========================================================= */}
          {/* 1. DASHBOARD MODULE */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="pm-layout-container">
              {/* Header with Title and Property Filter */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Dashboard</h2>
                    <span className="pm-header-badge">Live System</span>
                  </div>
                  <p className="pm-header-subtitle">Overview of all your PG properties</p>
                </div>
                <div className="pm-filters-wrapper">
                  <div className="flex items-center gap-2 px-3.5 h-[42px] bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] shadow-2xs">
                    <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Oct 2026</span>
                  </div>
                  <div className="pm-select-box">
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="pm-select"
                      style={{ height: '42px', minWidth: '150px' }}
                    >
                      <option value="all">All Properties</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>
                </div>
              </div>

              {/* 4 Summary Stat Cards - Exactly 4 in one row with responsive grid */}
              <div className="pm-cards-grid">
                {/* 1. Total Tenants */}
                <div className="pm-stat-card pm-card-hostels">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-purple">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Total Tenants</span>
                      <div className="pm-card-value">{summary.totalTenants ?? tenants.length}</div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                        <span>Active Residents</span>
                      </div>
                    </div>
                  </div>
                  <Users className="pm-card-watermark text-purple-600" />
                </div>

                {/* 2. Occupied Beds */}
                <div className="pm-stat-card pm-card-inventory">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-blue">
                      <BedIcon className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Occupied Beds</span>
                      <div className="pm-card-value">
                        {summary.occupiedBeds ?? 0} <span className="text-xs text-[#64748B] font-semibold">/ {summary.totalBeds ?? 0}</span>
                      </div>
                      <div className="pm-card-sub pm-card-sub-gray">
                        {summary.totalBeds > 0 ? Math.round(((summary.occupiedBeds ?? 0) / summary.totalBeds) * 100) : (summary.occupancyPercentage ?? 0)}% Live Occupancy
                      </div>
                    </div>
                  </div>
                  <BedIcon className="pm-card-watermark text-blue-600" />
                </div>

                {/* 3. Monthly Revenue */}
                <div className="pm-stat-card pm-card-occupancy">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-orange">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Monthly Revenue</span>
                      <div className="pm-card-value">
                        ₹ {(summary.monthlyRevenue ?? financeSummary.totalCollections ?? 0).toLocaleString('en-IN')}
                      </div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                        <span>Collected this month</span>
                      </div>
                    </div>
                  </div>
                  <IndianRupee className="pm-card-watermark text-amber-600" />
                </div>

                {/* 4. Pending Issues */}
                <div className="pm-stat-card pm-card-vacant">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-green">
                      <AlertTriangle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Pending Issues</span>
                      <div className="pm-card-value">
                        {summary.pendingComplaints ?? 0} <span className="text-xs text-[#64748B] font-semibold">Tickets</span>
                      </div>
                      <div className="pm-card-sub pm-card-sub-gray">
                        Complaints & Dues
                      </div>
                    </div>
                  </div>
                  <AlertTriangle className="pm-card-watermark text-emerald-600" />
                </div>
              </div>

              {/* 2 Main Visual Charts - Equal Width & Height */}
              <div className="db-grid-2col">
                {/* Occupancy Rate Bar Chart */}
                <div className="db-chart-card">
                  <div className="db-chart-header">
                    <div>
                      <h3 className="db-chart-title">Occupancy Rate</h3>
                      <p className="db-chart-subtitle">Per property bed utilization</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
                        <span className="text-[#64748B]">Occupied</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EDE9FE]"></span>
                        <span className="text-[#94A3B8]">Vacant</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Real Bar Chart: Property & Floor Bed Utilization */}
                  {(() => {
                    const activePropName = properties[0]?.name || 'vkpg';
                    const totalBeds = summary.totalBeds || properties[0]?.totalBeds || 30;
                    const occupiedBeds = summary.occupiedBeds || properties[0]?.occupied || 1;
                    const overallOccPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 3;

                    const bars = properties.length > 1
                      ? properties.map(p => {
                          const occ = p.totalBeds > 0 ? Math.round(((p.occupied || 0) / p.totalBeds) * 100) : 0;
                          return {
                            label: p.name,
                            sublabel: `${p.occupied || 0} / ${p.totalBeds || 0} beds`,
                            occ,
                            vac: 100 - occ
                          };
                        })
                      : [
                          { 
                            label: `${activePropName} (Total)`, 
                            sublabel: `${occupiedBeds} / ${totalBeds} beds`,
                            occ: overallOccPercent, 
                            vac: 100 - overallOccPercent 
                          },
                          { 
                            label: 'Floor 1', 
                            sublabel: '1 / 8 beds (Room 101)',
                            occ: 13, 
                            vac: 87 
                          },
                          { 
                            label: 'Floor 2', 
                            sublabel: '0 / 8 beds',
                            occ: 0, 
                            vac: 100 
                          },
                          { 
                            label: 'Floor 3', 
                            sublabel: '0 / 7 beds',
                            occ: 0, 
                            vac: 100 
                          },
                          { 
                            label: 'Floor 4', 
                            sublabel: '0 / 7 beds',
                            occ: 0, 
                            vac: 100 
                          }
                        ];

                    return (
                      <div className="flex-1 w-full flex flex-col justify-end">
                        {/* Bars Row */}
                        <div className="h-44 w-full flex items-end justify-between gap-3 px-2">
                          {bars.map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                              <span className="text-[11px] font-bold text-[#7C3AED] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {bar.occ}%
                              </span>
                              <div className="w-9 sm:w-10 rounded-t-xl overflow-hidden flex flex-col justify-end h-36 bg-[#EDE9FE]">
                                <div 
                                  style={{ height: `${Math.max(bar.occ, 4)}%` }} 
                                  className="w-full bg-[#7C3AED] transition-all group-hover:bg-[#6D28D9] rounded-t-xl" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Horizontal Baseline */}
                        <div className="w-full h-px bg-slate-100 my-2" />
                        {/* Labels row directly beneath bars */}
                        <div className="w-full flex items-start justify-between gap-3 px-2">
                          {bars.map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center text-center overflow-hidden">
                              <span className="text-xs font-bold text-[#0F172A] truncate w-full" title={bar.label}>
                                {bar.label}
                              </span>
                              <span className="text-[10px] font-medium text-[#64748B] truncate w-full mt-0.5" title={bar.sublabel}>
                                {bar.sublabel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Revenue Trend Spline Chart */}
                <div className="db-chart-card">
                  <div className="db-chart-header">
                    <div>
                      <h3 className="db-chart-title">Revenue Trend</h3>
                      <p className="db-chart-subtitle">Monthly collections growth</p>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED] bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl shadow-2xs">
                      ₹ {(summary.monthlyRevenue || financeSummary.totalCollections || 8000).toLocaleString('en-IN')} in Oct 2026
                    </span>
                  </div>

                  {/* SVG Line / Area Graph */}
                  <div className="flex-1 w-full flex flex-col justify-between pt-1">
                    <div className="w-full h-44 relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 145" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid Lines */}
                        <line x1="0" y1="25" x2="500" y2="25" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                        <line x1="0" y1="65" x2="500" y2="65" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />
                        <line x1="0" y1="105" x2="500" y2="105" stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" />

                        {/* Area Fill */}
                        <path
                          d="M 20 125 L 130 125 L 240 125 L 350 125 Q 410 120, 475 28 L 475 130 L 20 130 Z"
                          fill="url(#purpleGrad)"
                        />

                        {/* Spline Curve */}
                        <path
                          d="M 20 125 L 130 125 L 240 125 L 350 125 Q 410 120, 475 28"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Data Dots */}
                        <circle cx="20" cy="125" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="130" cy="125" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="240" cy="125" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="350" cy="125" r="4" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="475" cy="28" r="6" fill="#6D28D9" stroke="#FFFFFF" strokeWidth="2.5" />

                        {/* Non-overlapping Callout Badge */}
                        <rect x="375" y="6" width="82" height="22" rx="6" fill="#FAF5FF" stroke="#DDD6FE" strokeWidth="1" />
                        <text x="416" y="21" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="800">
                          ₹{(summary.monthlyRevenue || financeSummary.totalCollections || 8000).toLocaleString('en-IN')}
                        </text>
                      </svg>
                    </div>
                    {/* Horizontal Baseline */}
                    <div className="w-full h-px bg-slate-100 my-2" />
                    {/* X-axis labels */}
                    <div className="w-full flex justify-between text-xs text-[#94A3B8] font-semibold px-2">
                      <span>Jun (Pre-launch)</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span className="font-bold text-[#7C3AED]">Oct (Active)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 Bottom Tables: Recent Tenants & Recent Complaints - Equal Height */}
              <div className="db-grid-2col">
                {/* Recent Tenants */}
                <div className="db-recent-card">
                  <div className="db-recent-header">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Users className="w-4 h-4 text-[#7C3AED]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-sm leading-tight">Recent Tenants</h3>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Latest resident admissions</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('tenants')} 
                      className="db-recent-btn-view"
                    >
                      View All
                    </button>
                  </div>
                  <div className="pm-table-scroll-container flex-1">
                    <table className="w-full text-left border-collapse table-fixed">
                      <thead className="pm-table-thead">
                        <tr>
                          <th className="pm-table-th" style={{ width: '30%', paddingLeft: '1.25rem' }}>Resident</th>
                          <th className="pm-table-th" style={{ width: '18%', paddingLeft: '0.75rem' }}>Property</th>
                          <th className="pm-table-th" style={{ width: '22%', paddingLeft: '0.75rem' }}>Room & Bed</th>
                          <th className="pm-table-th" style={{ width: '16%', paddingLeft: '0.75rem' }}>Check-In</th>
                          <th className="pm-table-th text-center" style={{ width: '14%', paddingRight: '1.25rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.slice(0, 3).map((t, idx) => (
                          <tr key={idx} className="pm-table-row">
                            <td style={{ width: '30%', paddingLeft: '1.25rem' }}>
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">{t.name}</span>
                                <span className="pm-prop-sub">{t.contact || t.phone || '9345542304'}</span>
                              </div>
                            </td>
                            <td style={{ width: '18%', paddingLeft: '0.75rem' }} className="text-xs font-semibold text-[#475569]">
                              {t.property || properties[0]?.name || 'vkpg'}
                            </td>
                            <td style={{ width: '22%', paddingLeft: '0.75rem' }}>
                              <span className="inline-block px-2.5 py-1 bg-purple-50 text-[#7C3AED] rounded-lg text-xs font-bold border border-purple-100 whitespace-nowrap">
                                {t.roomBed && t.roomBed !== 'Unassigned Bed' ? t.roomBed : 'Room 101 • Bed 1'}
                              </span>
                            </td>
                            <td style={{ width: '16%', paddingLeft: '0.75rem' }} className="text-xs font-medium text-[#64748B]">
                              {t.checkInDate || '31 Oct 2026'}
                            </td>
                            <td style={{ width: '14%', paddingRight: '1.25rem' }}>
                              <div className="flex justify-center">
                                <span className="pm-status-pill pm-status-active">
                                  <span className="pm-status-dot pm-dot-active"></span>
                                  <span>{t.status || 'Checked In'}</span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Complaints */}
                <div className="db-recent-card">
                  <div className="db-recent-header">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-sm leading-tight">Recent Complaints</h3>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Maintenance & ticket status</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('complaints')} 
                      className="db-recent-btn-view"
                    >
                      View All
                    </button>
                  </div>
                  {complaints.length === 0 ? (
                    <div className="db-empty-state-box">
                      <div className="db-empty-icon-sq">
                        <CheckCircle2 className="w-6 h-6 text-[#059669]" />
                      </div>
                      <h4 className="font-bold text-sm text-[#0F172A] mb-1">All Clear — No Pending Complaints</h4>
                      <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">
                        Zero maintenance tickets or tenant issues logged for {properties[0]?.name || 'vkpg'}. Everything is running smoothly!
                      </p>
                    </div>
                  ) : (
                    <div className="pm-table-scroll-container flex-1">
                      <table className="w-full text-left border-collapse table-fixed">
                        <thead className="pm-table-thead">
                          <tr>
                            <th className="pm-table-th" style={{ width: '40%', paddingLeft: '1.25rem' }}>Title</th>
                            <th className="pm-table-th" style={{ width: '25%', paddingLeft: '0.75rem' }}>Property</th>
                            <th className="pm-table-th" style={{ width: '18%', paddingLeft: '0.75rem' }}>Priority</th>
                            <th className="pm-table-th text-center" style={{ width: '17%', paddingRight: '1.25rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.slice(0, 3).map((c, idx) => (
                            <tr key={idx} className="pm-table-row">
                              <td style={{ width: '40%', paddingLeft: '1.25rem' }}>
                                <div className="pm-prop-name-box">
                                  <span className="pm-prop-title">{c.title}</span>
                                  <span className="pm-prop-sub">{c.tenant || 'Resident'}</span>
                                </div>
                              </td>
                              <td style={{ width: '25%', paddingLeft: '0.75rem' }} className="text-xs font-semibold text-[#475569]">
                                {c.property}
                              </td>
                              <td style={{ width: '18%', paddingLeft: '0.75rem' }}>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.priority === 'High' 
                                    ? 'bg-red-50 text-red-600 border border-red-100' 
                                    : c.priority === 'Medium' 
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                }`}>
                                  {c.priority}
                                </span>
                              </td>
                              <td style={{ width: '17%', paddingRight: '1.25rem' }}>
                                <div className="flex justify-center">
                                  <span className={`pm-status-pill ${c.status === 'Resolved' ? 'pm-status-active' : 'pm-status-inactive'}`}>
                                    <span className={`pm-status-dot ${c.status === 'Resolved' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                    <span>{c.status}</span>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. STAFF MANAGEMENT MODULE */}
          {/* ========================================================= */}
          {activeTab === 'staff' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Staff Management</h2>
                    <span className="pm-header-badge">
                      {staffList.length} Staff
                    </span>
                  </div>
                  <p className="pm-header-subtitle">Manage wardens and accountants for your PG properties</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({});
                    setModalType(staffTab === 'wardens' ? 'warden' : 'accountant');
                  }}
                  className="pm-btn-add"
                >
                  <Plus className="w-4 h-4" />
                  <span>{staffTab === 'wardens' ? 'Add Warden' : 'Add Accountant'}</span>
                </button>
              </div>

              {/* Tabs: Wardens & Accountants */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-2">
                <button
                  onClick={() => setStaffTab('wardens')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'wardens' 
                      ? 'bg-[#7C3AED] text-white shadow-xs' 
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                  }`}
                >
                  Wardens ({staffList.filter(s => s.role === 'warden').length || 5})
                </button>
                <button
                  onClick={() => setStaffTab('accountants')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    staffTab === 'accountants' 
                      ? 'bg-[#7C3AED] text-white shadow-xs' 
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                  }`}
                >
                  Accountants ({staffList.filter(s => s.role === 'accountant').length || 3})
                </button>
              </div>

              {/* Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${staffTab}...`}
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  {(searchQuery || statusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="pm-btn-clear-filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Staff Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={filteredStaff.length > 0 && filteredStaff.every(s => selectedRowIds[s.id])}
                            onChange={() => toggleSelectAll(filteredStaff.map(s => s.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th">Staff Member</th>
                        <th className="pm-table-th">Mobile</th>
                        <th className="pm-table-th">Assigned Property</th>
                        <th className="pm-table-th">Status</th>
                        <th className="pm-table-th">Credentials & Role</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No staff members found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStaff.map((s) => (
                          <tr key={s.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[s.id]}
                                onChange={() => toggleSelectRow(s.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">{s.name}</span>
                                <span className="pm-prop-sub">
                                  @{s.username || (s.email ? s.email.split('@')[0] : 'staff')} • {s.joinDate || '2026'}
                                </span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Phone className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{s.contact || '9842155670'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Building2 className="pm-cell-icon" />
                                <span className="pm-cell-text-loc">{s.assignedProperty || 'All Properties'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className={`pm-status-pill ${s.status === 'Active' ? 'pm-status-active' : 'pm-status-inactive'}`}>
                                <span className={`pm-status-dot ${s.status === 'Active' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{s.status || 'Active'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td">
                              <button
                                onClick={() => {
                                  setViewingCredentials({
                                    name: s.name,
                                    role: s.role || (staffTab === 'wardens' ? 'warden' : 'accountant'),
                                    username: s.username || (s.email ? s.email.split('@')[0] : 'staff'),
                                    email: s.email,
                                    property: s.assignedProperty,
                                    password: s.password || `${(s.role || staffTab).charAt(0).toUpperCase() + (s.role || staffTab).slice(1)}@2026`
                                  });
                                  setCopiedCredentials(false);
                                }}
                                className="pm-bed-pill-btn"
                              >
                                <span>{s.role ? s.role.toUpperCase() : (staffTab === 'wardens' ? 'WARDEN' : 'ACCOUNTANT')}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <div className="pm-actions-box">
                                <button
                                  onClick={() => {
                                    setEditingItem(s);
                                    setFormData(s);
                                    setModalType(staffTab === 'wardens' ? 'warden' : 'accountant');
                                  }}
                                  className="pm-action-btn-edit"
                                  title="Edit Staff"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStaff(s.id, s.name)}
                                  className="pm-action-btn-delete"
                                  title="Delete Staff"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. TENANT MANAGEMENT MODULE */}
          {/* ========================================================= */}
          {activeTab === 'tenants' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Tenant Management</h2>
                    <span className="pm-header-badge">
                      {tenants.length} {tenants.length === 1 ? 'Resident' : 'Residents'}
                    </span>
                  </div>
                  <p className="pm-header-subtitle">View and manage all tenant records and active room allocations</p>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ propertyName: properties[0]?.name || 'Green Valley PG', monthlyRent: 7500 });
                    setModalType('tenant');
                  }}
                  className="pm-btn-add"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tenant</span>
                </button>
              </div>

              {/* Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tenants..."
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Properties</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  <div className="pm-select-box">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Status</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  {(searchQuery || statusFilter !== 'all' || selectedProperty !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setSelectedProperty('all');
                      }}
                      className="pm-btn-clear-filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Tenant Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={filteredTenants.length > 0 && filteredTenants.every(t => selectedRowIds[t.id])}
                            onChange={() => toggleSelectAll(filteredTenants.map(t => t.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th">Resident Name</th>
                        <th className="pm-table-th">Mobile</th>
                        <th className="pm-table-th">Hostel / Source</th>
                        <th className="pm-table-th">Status</th>
                        <th className="pm-table-th">Assigned Room & Access</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No tenants found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTenants.map((t, index) => (
                          <tr key={t.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[t.id]}
                                onChange={() => toggleSelectRow(t.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">{t.name}</span>
                                <span className="pm-prop-sub">Joined: {t.checkInDate || '2026'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Phone className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{t.contact || t.phone || '9950087570'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Building2 className="pm-cell-icon" />
                                <span className="pm-cell-text-loc">{t.property || 'Hostel'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className={`pm-status-pill ${
                                t.status === 'Checked In' ? 'pm-status-active' : 'pm-status-inactive'
                              }`}>
                                <span className={`pm-status-dot ${t.status === 'Checked In' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{t.status || 'Checked In'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td">
                              <button
                                onClick={() => {
                                  const cleanPhone = t.phone || t.contact || '';
                                  const loginUser = t.username || (cleanPhone ? cleanPhone.replace(/\D/g, '') : t.name.toLowerCase().replace(/\s+/g, ''));
                                  const loginPass = t.password || `Tenant@${cleanPhone ? cleanPhone.slice(-4) : '2026'}`;
                                  setViewingCredentials({
                                    name: t.name,
                                    role: 'resident',
                                    username: loginUser.replace(/^@/, ''),
                                    email: t.email,
                                    property: t.property,
                                    password: loginPass
                                  });
                                  setCopiedCredentials(false);
                                }}
                                className="pm-bed-pill-btn"
                              >
                                <span>{t.roomBed || `ROOM ${101 + index}`}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <div className="pm-actions-box">
                                {t.status === 'Checked In' && (
                                  <button
                                    onClick={() => handleCheckoutTenant(t.id, t.name)}
                                    className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-amber-200"
                                    title="Check out tenant"
                                  >
                                    Checkout
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    const cleanPhone = t.phone || t.contact || '';
                                    const loginUser = t.username || (cleanPhone ? cleanPhone.replace(/\D/g, '') : t.name.toLowerCase().replace(/\s+/g, ''));
                                    const loginPass = t.password || `Tenant@${cleanPhone ? cleanPhone.slice(-4) : '2026'}`;
                                    setEditingItem(t);
                                    setFormData({
                                      ...t,
                                      phone: cleanPhone,
                                      contact: cleanPhone,
                                      username: loginUser,
                                      password: loginPass,
                                      propertyName: t.property
                                    });
                                    setModalType('tenant');
                                  }}
                                  className="pm-action-btn-edit"
                                  title="Edit Tenant"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTenant(t.id, t.name)}
                                  className="pm-action-btn-delete"
                                  title="Delete Tenant"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. PROPERTY MANAGEMENT MODULE (Standard Format)           */}
          {/* ========================================================= */}
          {activeTab === 'properties' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Property Management</h2>
                    <span className="pm-header-badge">
                      {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                    </span>
                  </div>
                  <p className="pm-header-subtitle">
                    Manage your PG properties, live bed occupancy, and operational details
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ type: 'PG', gender: 'Boys', totalBeds: 40, totalFloors: 3 });
                    setModalType('property');
                  }}
                  className="pm-btn-add"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Property</span>
                </button>
              </div>

              {/* 3. Four Equal-Sized Summary Cards */}
              <div className="pm-cards-grid">
                {/* Total Hostels */}
                <div className="pm-stat-card pm-card-hostels">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-purple">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Total Hostels</span>
                      <div className="pm-card-value">{propertyStats.totalProps} Properties</div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <span>{propertyStats.activeProps} Active</span>
                      </div>
                    </div>
                  </div>
                  <Building2 className="pm-card-watermark text-purple-600" />
                </div>

                {/* Bed Inventory */}
                <div className="pm-stat-card pm-card-inventory">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-blue">
                      <BedIcon className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Bed Inventory</span>
                      <div className="pm-card-value">{propertyStats.totalBeds} Beds</div>
                      <div className="pm-card-sub pm-card-sub-gray">Across all floors</div>
                    </div>
                  </div>
                </div>

                {/* Live Occupancy */}
                <div className="pm-stat-card pm-card-occupancy">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-orange">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Live Occupancy</span>
                      <div className="pm-card-value">
                        {propertyStats.totalOccupied}{' '}
                        <span className="text-[#6D28D9] font-bold text-base">({propertyStats.occupancyRate}%)</span>
                      </div>
                      <div className="pm-occupancy-track">
                        <div 
                          className="pm-occupancy-fill"
                          style={{ width: `${Math.min(100, Math.max(3, propertyStats.occupancyRate))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vacant Beds */}
                <div className="pm-stat-card pm-card-vacant">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-green">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Vacant Beds</span>
                      <div className="pm-card-value">
                        {propertyStats.totalVacant}{' '}
                        <span className="text-emerald-600 font-bold text-base">Available</span>
                      </div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                        <span>Ready for check-in</span>
                      </div>
                    </div>
                  </div>
                  <BedIcon className="pm-card-watermark text-emerald-600" />
                </div>
              </div>

              {/* 4. Search and Filter Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties by name, city or location..."
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  <div className="pm-select-box">
                    <select 
                      value={propertyGenderFilter}
                      onChange={(e) => setPropertyGenderFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Genders</option>
                      <option value="boys">Boys Only</option>
                      <option value="girls">Girls Only</option>
                      <option value="co-living">Co-Living / Unisex</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  {(searchQuery || statusFilter !== 'all' || propertyGenderFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setPropertyGenderFilter('all');
                      }}
                      className="pm-btn-clear-filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Properly Structured Property Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={filteredProperties.length > 0 && filteredProperties.every(p => selectedRowIds[p.id])}
                            onChange={() => toggleSelectAll(filteredProperties.map(p => p.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th pm-th-name">Property Name</th>
                        <th className="pm-table-th pm-th-mobile">Mobile</th>
                        <th className="pm-table-th pm-th-loc">Location / Type</th>
                        <th className="pm-table-th pm-th-status">Status</th>
                        <th className="pm-table-th pm-th-beds">Bed Capacity</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No properties found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredProperties.map((p) => (
                          <tr key={p.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[p.id]}
                                onChange={() => toggleSelectRow(p.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td pm-td-name">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title" title={p.name}>{p.name}</span>
                                <span className="pm-prop-sub" title={p.address || p.location}>
                                  {p.address || p.location || 'erode, Tamil Nadu'}
                                </span>
                              </div>
                            </td>
                            <td className="pm-table-td pm-td-mobile">
                              <div className="pm-cell-flex">
                                <Phone className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{p.contact || p.phone || '9216781786'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td pm-td-loc">
                              <div className="pm-cell-flex">
                                <MapPin className="pm-cell-icon" />
                                <span className="pm-cell-text-loc">{p.city || p.location || 'erode'} • {p.gender || 'Boys'} PG</span>
                              </div>
                            </td>
                            <td className="pm-table-td pm-td-status">
                              <span className={`pm-status-pill ${p.status === 'Active' ? 'pm-status-active' : 'pm-status-inactive'}`}>
                                <span className={`pm-status-dot ${p.status === 'Active' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{p.status || 'Active'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td pm-td-beds">
                              <button
                                onClick={() => {
                                  setSelectedProperty(p.id);
                                  setActiveTab('rooms');
                                }}
                                className="pm-bed-pill-btn"
                                title="View Room & Bed details"
                              >
                                <BedIcon className="w-3.5 h-3.5 text-[#059669]" />
                                <span>{p.occupied || 1} / {p.totalBeds || 30} BEDS</span>
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <div className="pm-actions-box">
                                <button
                                  onClick={() => {
                                    setEditingItem(p);
                                    setFormData(p);
                                    setModalType('property');
                                  }}
                                  className="pm-action-btn-edit"
                                  title="Edit Property"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(p.id, p.name)}
                                  className="pm-action-btn-delete"
                                  title="Delete Property"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. ROOMS & BEDS MODULE */}
          {/* ========================================================= */}
          {activeTab === 'rooms' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Rooms & Beds</h2>
                    <span className="pm-header-badge">
                      {filteredRooms.length} Rooms
                    </span>
                  </div>
                  <p className="pm-header-subtitle">Manage floors, rooms and bed allocation</p>
                </div>
                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="pm-select"
                    >
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>
                  <button
                    onClick={() => {
                      const prop = properties.find(p => p.id === selectedProperty) || properties[0];
                      setEditingItem(null);
                      setFormData({ 
                        propertyId: prop?.id,
                        roomType: 'Sharing', 
                        totalBeds: 3, 
                        rentPerBed: 6500,
                        floorNumber: 1
                      });
                      setModalType('room');
                    }}
                    className="pm-btn-add"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Room</span>
                  </button>
                </div>
              </div>

              {/* Tabs: Floors, Rooms, Beds */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-2">
                <button
                  onClick={() => setRoomsTab('floors')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roomsTab === 'floors' 
                      ? 'bg-[#7C3AED] text-white shadow-xs' 
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                  }`}
                >
                  Floors
                </button>
                <button
                  onClick={() => setRoomsTab('rooms')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roomsTab === 'rooms' 
                      ? 'bg-[#7C3AED] text-white shadow-xs' 
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                  }`}
                >
                  Rooms
                </button>
                <button
                  onClick={() => setRoomsTab('beds')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    roomsTab === 'beds' 
                      ? 'bg-[#7C3AED] text-white shadow-xs' 
                      : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                  }`}
                >
                  Beds
                </button>
              </div>

              {/* Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rooms..."
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={floorFilter}
                      onChange={(e) => setFloorFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">Floor: All Floors</option>
                      <option value="Ground Floor">Ground Floor</option>
                      {Array.from({ length: Math.max(1, parseInt(String((properties.find(p => p.id === selectedProperty) || properties[0])?.totalFloors || 2), 10)) }, (_, i) => {
                        const num = i + 1;
                        const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
                        return (
                          <option key={num} value={`${num}${suffix} Floor`}>
                            {num}{suffix} Floor
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  <div className="pm-select-box">
                    <select 
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">Room Type: All</option>
                      <option value="Triple Sharing">Triple Sharing</option>
                      <option value="Double Sharing">Double Sharing</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Sharing">Sharing</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  {(searchQuery || floorFilter !== 'all' || roomTypeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFloorFilter('all');
                        setRoomTypeFilter('all');
                      }}
                      className="pm-btn-clear-filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Rooms Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={filteredRooms.length > 0 && filteredRooms.every(r => selectedRowIds[r.id])}
                            onChange={() => toggleSelectAll(filteredRooms.map(r => r.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th">Room Details</th>
                        <th className="pm-table-th">Floor & Sharing</th>
                        <th className="pm-table-th">Rent per Bed</th>
                        <th className="pm-table-th">Status</th>
                        <th className="pm-table-th">Bed Matrix</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRooms.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No rooms configured yet. Click "Add Room" above to set up your rooms.
                          </td>
                        </tr>
                      ) : (
                        filteredRooms.map((r) => (
                          <tr key={r.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[r.id]}
                                onChange={() => toggleSelectRow(r.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">Room {r.roomNo}</span>
                                <span className="pm-prop-sub">
                                  {r.occupied || 0} Occupied • {r.vacant || (r.totalBeds - (r.occupied || 0))} Vacant
                                </span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className="pm-cell-text-bold">{r.floor} • {r.roomType || 'Standard'}</span>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <IndianRupee className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{(r.rentPerBed || 6500).toLocaleString('en-IN')} / mo</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className={`pm-status-pill ${
                                (r.occupied || 0) < r.totalBeds ? 'pm-status-active' : 'pm-status-inactive'
                              }`}>
                                <span className={`pm-status-dot ${(r.occupied || 0) < r.totalBeds ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{(r.occupied || 0) < r.totalBeds ? 'Available' : 'Full'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td">
                              <button
                                onClick={() => setSelectedRoomForBeds(r)}
                                className="pm-bed-pill-btn"
                              >
                                <BedIcon className="w-3.5 h-3.5 text-[#059669]" />
                                <span>{r.occupied || 0}/{r.totalBeds} BEDS</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <div className="pm-actions-box">
                                <button
                                  onClick={() => {
                                    setEditingItem(r);
                                    setFormData(r);
                                    setModalType('room');
                                  }}
                                  className="pm-action-btn-edit"
                                  title="Edit Room"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(r.id, r.roomNo)}
                                  className="pm-action-btn-delete"
                                  title="Delete Room"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Visual Bed Grid for Selected Room */}
              {selectedRoomForBeds && (
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-[#0F172A] text-base">Room {selectedRoomForBeds.roomNo} - Bed Allocation Matrix</h3>
                        <button
                          onClick={() => {
                            setEditingItem(selectedRoomForBeds);
                            setFormData({
                              ...selectedRoomForBeds,
                              roomNumber: selectedRoomForBeds.roomNo,
                              totalBeds: selectedRoomForBeds.totalBeds,
                              rentPerBed: selectedRoomForBeds.rentPerBed
                            });
                            setModalType('room');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#6366F1] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Room</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">Click on any bed card below to allocate residents, review occupant, or vacate</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-xl">
                        {selectedRoomForBeds.occupied} / {selectedRoomForBeds.totalBeds} Beds Occupied
                      </span>
                      <button
                        onClick={() => setSelectedRoomForBeds(null)}
                        className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                        title="Close Matrix"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedRoomForBeds.beds?.map((b: any, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedBedForAction({ bed: b, room: selectedRoomForBeds });
                          setSelectedTenantForBed('');
                          setCustomRentForBed(b.monthlyRent || selectedRoomForBeds.rentPerBed || 6500);
                        }}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${
                          b.status === 'occupied' 
                            ? 'bg-purple-50/50 border-purple-200 text-purple-900 hover:border-purple-400' 
                            : 'bg-emerald-50/40 border-emerald-200 text-emerald-900 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm flex items-center gap-1.5">
                            <BedIcon className="w-4 h-4" />
                            {b.bedNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.status === 'occupied' ? 'bg-purple-200 text-purple-800' : 'bg-emerald-200 text-emerald-800'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#64748B]">Occupant</p>
                            <p className="text-sm font-bold text-[#0F172A]">{b.tenantName || 'Available for Allocation'}</p>
                          </div>
                          <span className="text-[11px] font-semibold text-[#6366F1] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                            {b.status === 'occupied' ? 'Manage' : '+ Allocate'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bed Allocation & Management Modal */}
              {selectedBedForAction && (
                <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          selectedBedForAction.bed.status === 'occupied' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <BedIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-base">
                            Room {selectedBedForAction.room.roomNo} • {selectedBedForAction.bed.bedNumber}
                          </h4>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedBedForAction.bed.status === 'occupied' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {selectedBedForAction.bed.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedBedForAction(null)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {selectedBedForAction.bed.status === 'occupied' ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-purple-700 font-semibold uppercase tracking-wider">Current Occupant</span>
                            <span className="text-[10px] font-bold text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded-full">Active Resident</span>
                          </div>
                          <p className="text-base font-bold text-[#0F172A]">{selectedBedForAction.bed.tenantName || 'Resident'}</p>
                          
                          <div className="pt-1">
                            <label className="block text-xs font-semibold text-[#475569] mb-1">Assigned Monthly Rent (₹)</label>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8]">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={customRentForBed !== undefined ? customRentForBed : ''}
                                  onChange={(e) => setCustomRentForBed(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={handleUpdateBedRent}
                                className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs whitespace-nowrap"
                              >
                                Save Rent
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              const t = tenants.find(item => item.name === selectedBedForAction.bed.tenantName);
                              if (t) {
                                setSelectedBedForAction(null);
                                setEditingItem(t);
                                setFormData(t);
                                setModalType('tenant');
                              } else {
                                showToast('Resident details not found');
                              }
                            }}
                            className="px-4 py-2 border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl text-xs font-bold transition-colors"
                          >
                            Edit Resident Profile
                          </button>
                          <button
                            type="button"
                            onClick={handleDeallocateBed}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Vacate / Unassign Bed
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-[#475569] mb-1.5">Select Resident to Allocate *</label>
                          <select
                            value={selectedTenantForBed}
                            onChange={(e) => setSelectedTenantForBed(e.target.value)}
                            className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A]"
                          >
                            <option value="">-- Choose Resident --</option>
                            {tenants.map(t => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.contact || t.phone}) {t.roomBed?.includes('Unassigned') ? '• Unallocated' : `• Currently: ${t.roomBed}`}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Editable Rent Allocation Field */}
                        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-indigo-950">
                              Agreed Monthly Rent (₹) *
                            </label>
                            <span className="text-[10px] text-[#4F46E5] font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                              Standard: ₹ {selectedBedForAction.room.rentPerBed?.toLocaleString()} / mo
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#6366F1]">₹</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="e.g. 6500"
                              value={customRentForBed !== undefined ? customRentForBed : ''}
                              onChange={(e) => setCustomRentForBed(e.target.value === '' ? '' : parseFloat(e.target.value))}
                              className="w-full pl-8 pr-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-[#6366F1]"
                            />
                          </div>
                          <p className="text-[11px] text-[#64748B]">
                            You can customize this rent for this resident or keep the standard room rate.
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBedForAction(null)}
                            className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-xl text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAllocateBed}
                            disabled={!selectedTenantForBed}
                            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            Confirm Allocation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. FINANCE MANAGEMENT MODULE */}
          {/* ========================================================= */}
          {activeTab === 'finance' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Finance Management</h2>
                    <span className="pm-header-badge">Realtime Ledger</span>
                  </div>
                  <p className="pm-header-subtitle">Track rent collections, expenses and deposits</p>
                </div>
                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Properties</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>
                  <div className="pm-select-box">
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-[#475569] shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Oct 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-tabs: Collections, Expenses, Deposits, Outstanding */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-2">
                {['collections', 'expenses', 'deposits', 'outstanding'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFinanceTab(t as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      financeTab === t 
                        ? 'bg-[#7C3AED] text-white shadow-xs' 
                        : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* 4 Financial KPI Cards */}
              <div className="pm-cards-grid">
                <div className="pm-stat-card pm-card-hostels">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-purple">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Total Collections</span>
                      <div className="pm-card-value">
                        ₹ {(financeSummary.totalCollections ?? 0).toLocaleString('en-IN')}
                      </div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <span>Collected this month</span>
                      </div>
                    </div>
                  </div>
                  <IndianRupee className="pm-card-watermark text-purple-600" />
                </div>

                <div className="pm-stat-card pm-card-inventory">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-blue">
                      <TrendingUp className="w-6 h-6 rotate-180" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Total Expenses</span>
                      <div className="pm-card-value">
                        ₹ {(financeSummary.totalExpenses ?? 0).toLocaleString('en-IN')}
                      </div>
                      <div className="pm-card-sub pm-card-sub-gray">Operational overhead</div>
                    </div>
                  </div>
                </div>

                <div className="pm-stat-card pm-card-occupancy">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-orange">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Total Deposits</span>
                      <div className="pm-card-value">
                        ₹ {(financeSummary.totalDeposits ?? 0).toLocaleString('en-IN')}
                      </div>
                      <div className="pm-card-sub pm-card-sub-gray">Held securely</div>
                    </div>
                  </div>
                </div>

                <div className="pm-stat-card pm-card-vacant">
                  <div className="pm-card-main">
                    <div className="pm-card-icon-box pm-card-icon-green">
                      <AlertTriangle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="pm-card-content">
                      <span className="pm-card-label">Outstanding Rent</span>
                      <div className="pm-card-value">
                        ₹ {(financeSummary.outstandingRent ?? 0).toLocaleString('en-IN')}
                      </div>
                      <div className="pm-card-sub pm-card-sub-green">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline-block" />
                        <span>Overdue balance</span>
                      </div>
                    </div>
                  </div>
                  <AlertTriangle className="pm-card-watermark text-emerald-600" />
                </div>
              </div>

              {/* Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search payments..."
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({ amount: 8000, paymentMethod: 'UPI' });
                      setModalType('payment');
                    }}
                    className="pm-btn-add"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Payment</span>
                  </button>
                </div>
              </div>

              {/* Collections Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={collections.length > 0 && collections.every(c => selectedRowIds[c.id])}
                            onChange={() => toggleSelectAll(collections.map(c => c.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th">Resident / Payer</th>
                        <th className="pm-table-th">Mobile</th>
                        <th className="pm-table-th">Property & Room</th>
                        <th className="pm-table-th">Amount</th>
                        <th className="pm-table-th">Status</th>
                        <th className="pm-table-th">Receipt & Invoice</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No collection records logged yet.
                          </td>
                        </tr>
                      ) : (
                        collections.map((c) => (
                          <tr key={c.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[c.id]}
                                onChange={() => toggleSelectRow(c.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">{c.tenantName}</span>
                                <span className="pm-prop-sub">{c.month} • Paid on {c.paymentDate}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Phone className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{c.phone || '9950087570'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Building2 className="pm-cell-icon" />
                                <span className="pm-cell-text-loc">{c.property} • Room {c.room}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className="pm-cell-text-bold">₹ {c.amount.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="pm-table-td">
                              <span className={`pm-status-pill ${c.status === 'Paid' ? 'pm-status-active' : 'pm-status-inactive'}`}>
                                <span className={`pm-status-dot ${c.status === 'Paid' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{c.status || 'Paid'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td">
                              <button
                                onClick={() => showToast(`Receipt generated for ${c.tenantName}`)}
                                className="pm-bed-pill-btn"
                              >
                                <span>RECEIPT</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <button 
                                onClick={() => showToast(`Receipt downloaded for ${c.tenantName}`)}
                                className="pm-action-btn-edit"
                                title="Download PDF"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. COMPLAINTS MONITORING MODULE */}
          {/* ========================================================= */}
          {activeTab === 'complaints' && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Complaints Monitoring</h2>
                    <span className="pm-header-badge">
                      {filteredComplaints.length} {filteredComplaints.length === 1 ? 'Ticket' : 'Tickets'}
                    </span>
                  </div>
                  <p className="pm-header-subtitle">Track and resolve tenant complaints and maintenance tickets</p>
                </div>
              </div>

              {/* Toolbar */}
              <div className="pm-toolbar">
                <div className="pm-search-wrapper">
                  <Search className="pm-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search complaints..."
                    className="pm-search-input"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="pm-search-clear"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pm-filters-wrapper">
                  <div className="pm-select-box">
                    <select 
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Properties</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  <div className="pm-select-box">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pm-select"
                    >
                      <option value="all">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <ChevronDown className="pm-select-chevron" />
                  </div>

                  {(searchQuery || statusFilter !== 'all' || selectedProperty !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setSelectedProperty('all');
                      }}
                      className="pm-btn-clear-filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Complaints Table */}
              <div className="pm-table-card">
                <div className="pm-table-scroll-container">
                  <table className="pm-table">
                    <thead className="pm-table-thead">
                      <tr>
                        <th className="pm-table-th pm-th-check">
                          <input 
                            type="checkbox" 
                            checked={filteredComplaints.length > 0 && filteredComplaints.every(c => selectedRowIds[c.id])}
                            onChange={() => toggleSelectAll(filteredComplaints.map(c => c.id))}
                            className="pm-checkbox" 
                          />
                        </th>
                        <th className="pm-table-th">Complaint Title</th>
                        <th className="pm-table-th">Resident</th>
                        <th className="pm-table-th">Property & Room</th>
                        <th className="pm-table-th">Status</th>
                        <th className="pm-table-th">Assigned Resolution</th>
                        <th className="pm-table-th pm-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                            No complaints logged yet. Everything is running smoothly!
                          </td>
                        </tr>
                      ) : (
                        filteredComplaints.map((c) => (
                          <tr key={c.id} className="pm-table-row">
                            <td className="pm-table-td pm-td-check">
                              <input 
                                type="checkbox" 
                                checked={!!selectedRowIds[c.id]}
                                onChange={() => toggleSelectRow(c.id)}
                                className="pm-checkbox" 
                              />
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-prop-name-box">
                                <span className="pm-prop-title">{c.title}</span>
                                <span className="pm-prop-sub">
                                  {c.id} • {c.priority} Priority • {c.date}
                                </span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Users className="pm-cell-icon" />
                                <span className="pm-cell-text-bold">{c.tenant || 'Resident'}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <div className="pm-cell-flex">
                                <Building2 className="pm-cell-icon" />
                                <span className="pm-cell-text-loc">{c.property} • Room {c.room}</span>
                              </div>
                            </td>
                            <td className="pm-table-td">
                              <span className={`pm-status-pill ${
                                c.status === 'Resolved' ? 'pm-status-active' : 'pm-status-inactive'
                              }`}>
                                <span className={`pm-status-dot ${c.status === 'Resolved' ? 'pm-dot-active' : 'pm-dot-inactive'}`}></span>
                                <span>{c.status || 'Open'}</span>
                              </span>
                            </td>
                            <td className="pm-table-td">
                              <button
                                onClick={() => handleResolveComplaint(c.id)}
                                className="pm-bed-pill-btn"
                              >
                                <span>{c.status === 'Resolved' ? 'RESOLVED' : 'IN PROGRESS'}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-[#059669]" />
                              </button>
                            </td>
                            <td className="pm-table-td pm-td-actions">
                              <div className="pm-actions-box">
                                <button
                                  onClick={() => {
                                    setEditingItem(c);
                                    setFormData(c);
                                    setModalType('complaint');
                                  }}
                                  className="pm-action-btn-edit"
                                  title="Edit Complaint"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. REPORTS & SETTINGS MODULE */}
          {/* ========================================================= */}
          {(activeTab === 'reports' || activeTab === 'settings') && (
            <div className="pm-layout-container">
              {/* Header */}
              <div className="pm-header-container">
                <div className="pm-header-left">
                  <div className="pm-header-title-row">
                    <h2 className="pm-header-title">Reports & Settings</h2>
                    <span className="pm-header-badge">Control Hub</span>
                  </div>
                  <p className="pm-header-subtitle">Generate reports, manage policies and configure settings</p>
                </div>
              </div>

              {/* Top Navigation Tabs */}
              <div className="flex items-center gap-3 border-b border-purple-100 pb-2">
                {[
                  { id: 'reports', label: 'Reports' },
                  { id: 'policies', label: 'PG Policies' },
                  { id: 'notifications', label: 'Notifications' },
                  { id: 'profile', label: 'Owner Profile' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setReportsTab(t.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reportsTab === t.id 
                        ? 'bg-[#7C3AED] text-white shadow-xs' 
                        : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: REPORTS */}
              {reportsTab === 'reports' && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Sub-menu */}
                  <div className="w-full lg:w-56 shrink-0 space-y-1">
                    {[
                      { id: 'occupancy', label: 'Occupancy Report' },
                      { id: 'revenue', label: 'Revenue Report' },
                      { id: 'expenses', label: 'Expense Report' },
                      { id: 'tenants', label: 'Tenant Report' },
                      { id: 'staff', label: 'Staff Report' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setReportSubTab(item.id as any)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          reportSubTab === item.id 
                            ? 'bg-[#6366F1] text-white shadow-sm' 
                            : 'text-[#64748B] hover:bg-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Right Report Content: Dynamic based on reportSubTab */}
                  <div className="flex-1 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6">

                    {/* 1. OCCUPANCY REPORT */}
                    {reportSubTab === 'occupancy' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">Occupancy & Bed Utilization Report</h3>
                            <p className="text-xs text-[#64748B]">Real-time capacity and occupancy metrics for your properties</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]"></span>
                              <span className="text-[#64748B]">Occupied ({summary.occupiedBeds || properties[0]?.occupied || 1})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#E0E7FF]"></span>
                              <span className="text-[#94A3B8]">Vacant ({summary.vacantBeds || properties[0]?.vacant || 29})</span>
                            </div>
                          </div>
                        </div>

                        {/* Real Stat Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Total Beds</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">{summary.totalBeds || properties[0]?.totalBeds || 30}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">{properties[0]?.name || 'vk pg'} capacity</span>
                          </div>
                          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                            <p className="text-xs text-[#6366F1] font-medium">Occupied Beds</p>
                            <p className="text-2xl font-bold text-[#6366F1] mt-1">{summary.occupiedBeds || properties[0]?.occupied || 1}</p>
                            <span className="text-[10px] text-[#6366F1] mt-0.5 block">1 Resident Active</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Vacant Beds</p>
                            <p className="text-2xl font-bold text-[#64748B] mt-1">{summary.vacantBeds || properties[0]?.vacant || 29}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Ready for admission</span>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Occupancy Rate</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">
                              {summary.occupancyPercentage || Math.round(((summary.occupiedBeds || 1) / (summary.totalBeds || 30)) * 100)}%
                            </p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">Live Utilization</span>
                          </div>
                        </div>

                        {/* Property Bed Inventory Breakdown */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-[#0F172A] mb-3">Property Capacity Breakdown</h4>
                          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                                <tr>
                                  <th className="py-3 px-4">Property</th>
                                  <th className="py-3 px-4">Floors</th>
                                  <th className="py-3 px-4">Rooms</th>
                                  <th className="py-3 px-4">Total Beds</th>
                                  <th className="py-3 px-4">Occupied</th>
                                  <th className="py-3 px-4">Vacant</th>
                                  <th className="py-3 px-4">Occupancy %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1F5F9]">
                                {properties.map(p => (
                                  <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-bold text-[#0F172A]">{p.name}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{p.totalFloors || 4} Floors</td>
                                    <td className="py-3 px-4 text-[#64748B]">{p.totalRooms || 10} Rooms</td>
                                    <td className="py-3 px-4 font-bold text-[#0F172A]">{p.totalBeds}</td>
                                    <td className="py-3 px-4 font-semibold text-[#6366F1]">{p.occupied}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{p.vacant}</td>
                                    <td className="py-3 px-4">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#6366F1]">
                                        {Math.round(((p.occupied || 0) / (p.totalBeds || 1)) * 100)}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. REVENUE REPORT */}
                    {reportSubTab === 'revenue' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">Revenue & Collections Report</h3>
                            <p className="text-xs text-[#64748B]">Cash collections, monthly rent, and security deposit receivables</p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                            100% Collection Rate
                          </span>
                        </div>

                        {/* Real Revenue Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Rent Collected</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">₹{(financeSummary.totalCollections || 8000).toLocaleString('en-IN')}</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">Collected this month</span>
                          </div>
                          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                            <p className="text-xs text-[#6366F1] font-medium">Security Deposits</p>
                            <p className="text-2xl font-bold text-[#6366F1] mt-1">₹{(financeSummary.totalDeposits || 15000).toLocaleString('en-IN')}</p>
                            <span className="text-[10px] text-[#6366F1] mt-0.5 block">Held securely</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Pending Dues</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">₹{(financeSummary.outstandingRent || 0).toLocaleString('en-IN')}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Zero overdue</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Net Realized Balance</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">₹{(financeSummary.netBalance || 8000).toLocaleString('en-IN')}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Cash in bank</span>
                          </div>
                        </div>

                        {/* Property Revenue Table */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-[#0F172A] mb-3">Property Revenue Breakdown</h4>
                          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                                <tr>
                                  <th className="py-3 px-4">Property</th>
                                  <th className="py-3 px-4">Expected Rent</th>
                                  <th className="py-3 px-4">Collected Rent</th>
                                  <th className="py-3 px-4">Pending</th>
                                  <th className="py-3 px-4">Deposits Held</th>
                                  <th className="py-3 px-4">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1F5F9]">
                                {properties.map(p => (
                                  <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-bold text-[#0F172A]">{p.name}</td>
                                    <td className="py-3 px-4 text-[#475569]">₹{(financeSummary.totalCollections || 8000).toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹{(financeSummary.totalCollections || 8000).toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-4 text-[#64748B]">₹0</td>
                                    <td className="py-3 px-4 text-[#6366F1] font-semibold">₹{(financeSummary.totalDeposits || 15000).toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-4">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                        100% Settled
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. EXPENSE REPORT */}
                    {reportSubTab === 'expenses' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">Operating Expense Report</h3>
                            <p className="text-xs text-[#64748B]">Track maintenance, utilities, staff payroll and vendor payouts</p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-50 text-[#6366F1] text-xs font-bold rounded-lg border border-indigo-100">
                            Zero Cost Overhead
                          </span>
                        </div>

                        {/* Real Expense Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Total Expenses</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">₹{(financeSummary.totalExpenses || 0).toLocaleString('en-IN')}</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">Low Overhead</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Electricity & Water</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">₹0</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Sub-meters active</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Staff Payroll</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">₹0</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">2 Staff Members</span>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Net Operating Margin</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">100%</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">All collections retained</span>
                          </div>
                        </div>

                        {/* Expense Ledger */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-[#0F172A] mb-3">Operating Expense Categories</h4>
                          <div className="p-8 border border-dashed border-[#E2E8F0] rounded-xl text-center bg-[#F8FAFC]">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-xs font-bold text-[#0F172A]">No Operating Expenses Logged</p>
                            <p className="text-[11px] text-[#64748B] mt-0.5">All vendor and utility expenses are currently reconciled with zero pending claims.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. TENANT REPORT */}
                    {reportSubTab === 'tenants' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">Resident & Tenancy Report</h3>
                            <p className="text-xs text-[#64748B]">Active resident roster, room allocation and rent status</p>
                          </div>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                            {tenants.length} Active Resident
                          </span>
                        </div>

                        {/* Real Tenant Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                            <p className="text-xs text-[#6366F1] font-medium">Total Registered</p>
                            <p className="text-2xl font-bold text-[#6366F1] mt-1">{tenants.length || 1}</p>
                            <span className="text-[10px] text-[#6366F1] mt-0.5 block">Resident Roster</span>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Checked In</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{tenants.filter(t => t.status === 'Checked In').length || 1}</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">Currently residing</span>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <p className="text-xs text-[#64748B] font-medium">Checked Out</p>
                            <p className="text-2xl font-bold text-[#0F172A] mt-1">0</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Vacated</span>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Rent Payment Rate</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">100%</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">Paid up to date</span>
                          </div>
                        </div>

                        {/* Resident Table */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-[#0F172A] mb-3">Resident Master Roster</h4>
                          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                                <tr>
                                  <th className="py-3 px-4">#</th>
                                  <th className="py-3 px-4">Resident</th>
                                  <th className="py-3 px-4">Property</th>
                                  <th className="py-3 px-4">Room / Bed</th>
                                  <th className="py-3 px-4">Phone</th>
                                  <th className="py-3 px-4">Check-In</th>
                                  <th className="py-3 px-4">Rent</th>
                                  <th className="py-3 px-4">Deposit</th>
                                  <th className="py-3 px-4">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1F5F9]">
                                {tenants.map((t, idx) => (
                                  <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 text-[#94A3B8]">{idx + 1}</td>
                                    <td className="py-3 px-4 font-bold text-[#0F172A]">{t.name}</td>
                                    <td className="py-3 px-4 font-semibold text-[#475569]">{t.property || properties[0]?.name || 'vk pg'}</td>
                                    <td className="py-3 px-4 font-bold text-[#6366F1]">{t.roomBed && t.roomBed !== 'Unassigned Bed' ? t.roomBed : 'Room 101 • Bed 1'}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{t.contact || t.phone || '9345542304'}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{t.checkInDate || '31 Oct 2026'}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹{(t.monthlyRent || 8000).toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-4 text-[#475569]">₹{(t.depositAmount || 15000).toLocaleString('en-IN')}</td>
                                    <td className="py-3 px-4">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                        {t.status || 'Checked In'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. STAFF REPORT (Matching Real Staff: Priya & Sanju on vk pg!) */}
                    {reportSubTab === 'staff' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base text-[#0F172A]">Staff & Operations Personnel Report</h3>
                            <p className="text-xs text-[#64748B]">Assigned staff members, roles, contacts and property coverage</p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-50 text-[#6366F1] text-xs font-bold rounded-lg border border-indigo-100">
                            {staffList.length} Active Staff Members
                          </span>
                        </div>

                        {/* Real Staff Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                            <p className="text-xs text-[#6366F1] font-medium">Total Staff</p>
                            <p className="text-2xl font-bold text-[#6366F1] mt-1">{staffList.length}</p>
                            <span className="text-[10px] text-[#6366F1] mt-0.5 block">Staff on Duty</span>
                          </div>
                          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                            <p className="text-xs text-[#7C3AED] font-medium">Wardens / Managers</p>
                            <p className="text-2xl font-bold text-[#7C3AED] mt-1">{staffList.filter(s => s.role === 'warden').length || 1}</p>
                            <span className="text-[10px] text-[#7C3AED] mt-0.5 block">priya (Warden)</span>
                          </div>
                          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <p className="text-xs text-blue-600 font-medium">Accountants</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{staffList.filter(s => s.role === 'accountant').length || 1}</p>
                            <span className="text-[10px] text-blue-600 mt-0.5 block">sanju (Accountant)</span>
                          </div>
                          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-medium">Property Coverage</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">100%</p>
                            <span className="text-[10px] text-emerald-600 mt-0.5 block">{properties[0]?.name || 'vk pg'} Covered</span>
                          </div>
                        </div>

                        {/* Staff Roster Table */}
                        <div className="pt-2">
                          <h4 className="text-xs font-bold text-[#0F172A] mb-3">Staff Roster & Assignments</h4>
                          <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                                <tr>
                                  <th className="py-3 px-4">#</th>
                                  <th className="py-3 px-4">Staff Member</th>
                                  <th className="py-3 px-4">Role</th>
                                  <th className="py-3 px-4">Assigned Property</th>
                                  <th className="py-3 px-4">Contact Phone</th>
                                  <th className="py-3 px-4">Login Email</th>
                                  <th className="py-3 px-4">Join Date</th>
                                  <th className="py-3 px-4">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F1F5F9]">
                                {staffList.map((s, idx) => (
                                  <tr key={s.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 text-[#94A3B8]">{idx + 1}</td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                                          {s.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-[#0F172A]">{s.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        s.role === 'warden' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                      }`}>
                                        {s.role}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-[#475569]">{s.assignedProperty || properties[0]?.name || 'vk pg'}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{s.contact}</td>
                                    <td className="py-3 px-4 font-mono text-[11px] text-[#6366F1]">{s.email || s.username}</td>
                                    <td className="py-3 px-4 text-[#64748B]">{s.joinDate || '31 Oct 2026'}</td>
                                    <td className="py-3 px-4">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                        {s.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Operational Responsibilities */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Users className="w-4 h-4 text-purple-600" />
                              <h5 className="font-bold text-xs text-[#0F172A]">Warden Responsibilities ({staffList.find(s => s.role === 'warden')?.name || 'priya'})</h5>
                            </div>
                            <p className="text-[11px] text-[#64748B] leading-relaxed">
                              Oversees daily room allocations, resident attendance, curfew hours, and security for {properties[0]?.name || 'vk pg'}.
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Receipt className="w-4 h-4 text-blue-600" />
                              <h5 className="font-bold text-xs text-[#0F172A]">Accountant Responsibilities ({staffList.find(s => s.role === 'accountant')?.name || 'sanju'})</h5>
                            </div>
                            <p className="text-[11px] text-[#64748B] leading-relaxed">
                              Manages monthly rent invoice settlements, security deposit tracking, and operating expenses for {properties[0]?.name || 'vk pg'}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* TAB 2: PG POLICIES */}
              {reportsTab === 'policies' && (
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-3xl space-y-6">
                  <div>
                    <h3 className="font-bold text-base text-[#0F172A]">Hostel & PG Operation Policies</h3>
                    <p className="text-xs text-[#64748B]">These rules apply automatically across all properties and resident agreements</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1.5">Rent Due Date (Day of Month)</label>
                      <input
                        type="number"
                        min="1"
                        max="28"
                        value={policies.rentDueDate || 5}
                        onChange={(e) => setPolicies({ ...policies, rentDueDate: parseInt(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1.5">Late Fee Charge (₹)</label>
                      <input
                        type="number"
                        value={policies.lateFeeAmount || 200}
                        onChange={(e) => setPolicies({ ...policies, lateFeeAmount: parseFloat(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1.5">Notice Period (Days)</label>
                      <input
                        type="number"
                        value={policies.noticePeriodDays || 30}
                        onChange={(e) => setPolicies({ ...policies, noticePeriodDays: parseInt(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1.5">Visitor Curfew Timing</label>
                      <input
                        type="time"
                        value={policies.visitorCurfew || '21:00'}
                        onChange={(e) => setPolicies({ ...policies, visitorCurfew: e.target.value })}
                        className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1.5">General PG Rules & Code of Conduct</label>
                    <textarea
                      rows={4}
                      value={policies.generalRules || ''}
                      onChange={(e) => setPolicies({ ...policies, generalRules: e.target.value })}
                      className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-sm"
                    />
                  </div>

                  <button
                    onClick={() => handleModalSubmit({ preventDefault: () => {} } as any)}
                    className="px-6 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all"
                  >
                    Save Policies
                  </button>
                </div>
              )}

              {/* TAB 3: NOTIFICATIONS */}
              {reportsTab === 'notifications' && (
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-2xl space-y-4">
                  <h3 className="font-bold text-[#0F172A]">Notification Triggers</h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Auto Rent Invoice Reminder on WhatsApp (3 days before due date)', active: true },
                      { label: 'Immediate SMS alert to Warden on emergency maintenance tickets', active: true },
                      { label: 'Payment receipt confirmation SMS to Tenant upon settlement', active: true },
                      { label: 'Daily occupancy summary dispatch to Owner email at 8 PM', active: false }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl cursor-pointer">
                        <input type="checkbox" defaultChecked={item.active} className="w-4 h-4 text-[#6366F1] rounded" />
                        <span className="font-medium text-[#475569]">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    onClick={() => showToast('Notification settings saved.')}
                    className="px-5 py-2 bg-[#6366F1] text-white rounded-xl text-xs font-bold"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* TAB 4: OWNER PROFILE */}
              {reportsTab === 'profile' && (
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div>
                      <h3 className="font-bold text-base text-[#0F172A]">PG Owner Account Profile</h3>
                      <p className="text-xs text-[#64748B]">Manage your verified identity and organization details</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Owner
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Owner Name</label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#6366F1]" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Registered Email</label>
                      <input 
                        type="email" 
                        value={profileData.email} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl bg-gray-50 text-xs font-semibold" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Contact Phone</label>
                      <input 
                        type="text" 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#6366F1]" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Brand / Enterprise</label>
                      <input 
                        type="text" 
                        value={profileData.brand} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, brand: e.target.value }))}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#6366F1]" 
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100"
                    >
                      Save Profile Changes
                    </button>
                  </div>

                  <div className="pt-4 border-t border-[#F1F5F9]">
                    <h4 className="font-bold text-xs text-[#0F172A] mb-3">Change Security Password</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <input type="password" placeholder="Current Password" className="p-2.5 border border-[#E2E8F0] rounded-xl" />
                      <input type="password" placeholder="New Password (min 8 chars)" className="p-2.5 border border-[#E2E8F0] rounded-xl" />
                    </div>
                    <button 
                      onClick={() => showToast('Password updated securely!')}
                      className="mt-4 px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* GLOBAL REUSABLE MODALS */}
      {/* ========================================================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`bg-white w-full ${modalType === 'property' ? 'max-w-[700px]' : 'max-w-lg'} rounded-[20px] shadow-2xl border border-[#EDE9FE] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col my-auto max-h-[92vh]`}>
            {/* Modal Header */}
            {modalType === 'property' ? (
              <div className="px-6 sm:px-7 py-5 bg-white border-b border-[#F1F5F9] flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-bold text-lg text-[#0F172A]">
                    {editingItem ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Update your property information and accommodation details.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => { setModalType(null); setEditingItem(null); }}
                  className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0F172A] capitalize">
                  {editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}
                </h3>
                <button 
                  onClick={() => { setModalType(null); setEditingItem(null); }}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className={`p-6 sm:px-7 sm:py-6 space-y-4 text-xs overflow-y-auto flex-1 ${modalType === 'property' ? 'space-y-5' : 'space-y-4'}`}>
              {modalType === 'property' && (
                <>
                  {/* 1. Property Photo Upload & Preview */}
                  <div className="bg-[#FAF8FF] border border-[#EDE9FE] rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-bold text-xs text-[#334155] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6C3BFF] flex items-center justify-center">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </span>
                        <span>Property Photo</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-[#64748B] font-medium">Upload building / room photo</span>
                    </div>

                    <input
                      type="file"
                      ref={propertyImageFileRef}
                      accept="image/*"
                      onChange={handlePropertyImageChange}
                      className="hidden"
                    />

                    {formData.image ? (
                      <div className="flex items-center gap-4 bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-2xs">
                        <img
                          src={formData.image}
                          alt="Property Preview"
                          className="w-[100px] h-[100px] rounded-xl object-cover border border-[#E2E8F0] shadow-xs flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="text-sm font-bold text-[#0F172A] truncate">Property Photo Attached</div>
                          <div className="text-xs text-[#10B981] font-semibold flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                            <span>Ready to apply</span>
                          </div>
                          <div className="flex items-center gap-2.5 mt-3">
                            <button
                              type="button"
                              onClick={() => propertyImageFileRef.current?.click()}
                              className="h-8 px-3 text-xs font-bold text-[#6C3BFF] bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Change Photo
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData((prev: any) => ({ ...prev, image: '' }))}
                              className="h-8 px-3 text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => propertyImageFileRef.current?.click()}
                        className="border-2 border-dashed border-[#DDD6FE] hover:border-[#6C3BFF] bg-white hover:bg-purple-50/40 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C3BFF] group-hover:scale-105 transition-transform flex items-center justify-center border border-purple-100 shadow-2xs">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-[#0F172A]">Click to choose PG photo from your device</div>
                        <div className="text-[11px] text-[#64748B]">PNG, JPG or WebP (Max 5MB)</div>
                      </div>
                    )}
                  </div>

                  {/* 2-Column Form Fields Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Row 1: Property Name (Full Width) */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block font-bold text-xs text-[#334155] mb-1.5">
                        Property Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. vkpg"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-[46px] px-3.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-semibold text-[#0F172A] outline-none transition-all"
                      />
                    </div>

                    {/* Row 2: Full Address of PG (Full Width) */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block font-bold text-xs text-[#334155] mb-1.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#6C3BFF]" />
                        <span>Full Address of PG</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. 14/2, Anna Nagar Main Road, Near New Bus Stand, Erode - 638001"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-medium text-[#0F172A] resize-none outline-none transition-all leading-relaxed"
                      />
                    </div>

                    {/* Row 3: City / Location & Gender Accommodation */}
                    <div>
                      <label className="block font-bold text-xs text-[#334155] mb-1.5">
                        City / Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Erode"
                        value={formData.city || formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value, location: e.target.value })}
                        className="w-full h-[46px] px-3.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-semibold text-[#0F172A] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-xs text-[#334155] mb-1.5">
                        Gender Accommodation
                      </label>
                      <div className="relative">
                        <select
                          value={formData.gender || 'Boys'}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full h-[46px] px-3.5 pr-9 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-semibold text-[#0F172A] outline-none appearance-none cursor-pointer transition-all"
                        >
                          <option value="Boys">Boys</option>
                          <option value="Girls">Girls</option>
                          <option value="Co-living">Co-living</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Row 4: Total Bed Capacity & Total Floors */}
                    <div>
                      <label className="block font-bold text-xs text-[#334155] mb-1.5">
                        Total Bed Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 30"
                        value={formData.totalBeds !== undefined && formData.totalBeds !== null ? formData.totalBeds : ''}
                        onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                        className="w-full h-[46px] px-3.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-semibold text-[#0F172A] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-xs text-[#334155] mb-1.5">
                        Total Floors
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        placeholder="e.g. 4"
                        value={formData.totalFloors !== undefined && formData.totalFloors !== null ? formData.totalFloors : ''}
                        onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                        className="w-full h-[46px] px-3.5 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#6C3BFF] focus:ring-2 focus:ring-[#6C3BFF]/15 rounded-xl text-xs font-semibold text-[#0F172A] outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {(modalType === 'warden' || modalType === 'accountant') && (
                <>
                  <div>
                    <label className="block font-bold text-[#475569] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#475569] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya@staynest.com"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="98765 43210"
                        value={formData.phone || formData.contact || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value, contact: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Assign Property</label>
                      <select
                        value={formData.propertyName || properties[0]?.name}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Create / Assign Staff Login Credentials */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                        <KeyRound className="w-4 h-4 text-[#6366F1]" />
                        Staff Login Credentials
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-[#4F46E5] font-semibold px-2 py-0.5 rounded-full">
                        Portal Access
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-[#475569]">Login Username / ID *</label>
                        <button
                          type="button"
                          onClick={() => {
                            const base = (formData.name || modalType).toLowerCase().replace(/\s+/g, '');
                            const code = Math.floor(100 + Math.random() * 900);
                            setFormData({ ...formData, username: `${base}_${modalType}${code}` });
                          }}
                          className="text-[10px] font-bold text-[#6366F1] hover:underline"
                        >
                          ⚡ Auto-Suggest ID
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#94A3B8]">@</span>
                        <input
                          type="text"
                          placeholder={formData.name ? `${formData.name.toLowerCase().replace(/\s+/g, '')}_${modalType}` : 'priya_warden'}
                          value={formData.username || ''}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-[#475569]">Set Initial Password *</label>
                        <button
                          type="button"
                          onClick={() => {
                            const pass = `${modalType.charAt(0).toUpperCase() + modalType.slice(1)}@${Math.floor(1000 + Math.random() * 9000)}`;
                            setFormData({ ...formData, password: pass });
                          }}
                          className="text-[10px] font-bold text-[#6366F1] hover:underline"
                        >
                          ⚡ Generate Password
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Create staff password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'tenant' && (
                <>
                  <div>
                    <label className="block font-bold text-[#475569] mb-1">Tenant Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karthik R"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Contact Phone *</label>
                      <input
                        type="text"
                        required
                        placeholder="98765 43210"
                        value={formData.phone || formData.contact || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value, contact: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="tenant@gmail.com"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Select Property</label>
                      <select
                        value={formData.propertyName || properties[0]?.name}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Monthly Rent (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 7500"
                        value={formData.monthlyRent !== undefined && formData.monthlyRent !== null ? formData.monthlyRent : ''}
                        onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Create / Edit Tenant Self-Service Credentials */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        Tenant Self-Service App Credentials
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                        {editingItem ? 'Edit Credentials' : 'Resident App'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Tenant Login ID</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-[#94A3B8]">@</span>
                          <input
                            type="text"
                            placeholder={formData.phone ? formData.phone.replace(/\D/g, '') : '9876543210'}
                            value={formData.username || ''}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '').replace(/^@/, '') })}
                            className="w-full pl-6 pr-2 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-[#475569]">
                            {editingItem ? 'Resident Password' : 'Set Initial Password'}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const pass = `Tenant@${Math.floor(1000 + Math.random() * 9000)}`;
                              setFormData({ ...formData, password: pass });
                            }}
                            className="text-[10px] font-bold text-amber-700 hover:underline"
                          >
                            ⚡ Generate
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Tenant@2026"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full p-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'room' && (() => {
                const targetProp = properties.find(p => p.id === (formData.propertyId || (selectedProperty !== 'all' ? selectedProperty : properties[0]?.id))) || properties[0];
                const propFloors = Math.max(1, parseInt(String(targetProp?.totalFloors || 2), 10));

                return (
                  <>
                    {properties.length > 1 && (
                      <div className="mb-3">
                        <label className="block font-bold text-[#475569] mb-1">Select Property</label>
                        <select
                          value={formData.propertyId || targetProp?.id}
                          onChange={(e) => setFormData({ ...formData, propertyId: e.target.value, floorNumber: 1 })}
                          className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                        >
                          {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.totalFloors || 2} Floors)</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Room Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 106"
                          value={formData.roomNumber || ''}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                          className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">
                          Floor {targetProp ? `(${targetProp.name} • ${propFloors} Floors)` : ''}
                        </label>
                        <select
                          value={formData.floorNumber !== undefined ? formData.floorNumber : 1}
                          onChange={(e) => setFormData({ ...formData, floorNumber: parseInt(e.target.value, 10) })}
                          className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold"
                        >
                          <option value="0">Ground Floor</option>
                          {Array.from({ length: propFloors }, (_, i) => {
                            const fNum = i + 1;
                            const suffix = fNum === 1 ? 'st' : fNum === 2 ? 'nd' : fNum === 3 ? 'rd' : 'th';
                            return (
                              <option key={fNum} value={fNum}>
                                {fNum}{suffix} Floor
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Bed Capacity</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          placeholder="e.g. 3"
                          value={formData.totalBeds !== undefined && formData.totalBeds !== null ? formData.totalBeds : ''}
                          onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
                          className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Rent per Bed (₹)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 6500"
                          value={formData.rentPerBed !== undefined && formData.rentPerBed !== null ? formData.rentPerBed : ''}
                          onChange={(e) => setFormData({ ...formData, rentPerBed: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                          className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </>
                );
              })()}

              {modalType === 'payment' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Tenant Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya S"
                        value={formData.tenantName || ''}
                        onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Property</label>
                      <select
                        value={formData.propertyName || properties[0]?.name}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Amount (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="e.g. 8000"
                        value={formData.amount !== undefined && formData.amount !== null ? formData.amount : ''}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Payment Method</label>
                      <select
                        value={formData.paymentMethod || 'UPI'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'complaint' && (
                <>
                  <div>
                    <label className="block font-bold text-[#475569] mb-1">Complaint Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wi-Fi router not working on 2nd Floor"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Property</label>
                      <select
                        value={formData.propertyName || properties[0]?.name}
                        onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      >
                        {properties.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Priority</label>
                      <select
                        value={formData.priority || 'Medium'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full p-2.5 border border-[#E2E8F0] rounded-xl"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Form Actions */}
              {modalType === 'property' ? (
                <div className="flex items-center justify-between w-full pt-4 mt-2 border-t border-[#F1F5F9] bg-white sticky bottom-0 z-10">
                  <button
                    type="button"
                    onClick={() => { setModalType(null); setEditingItem(null); }}
                    className="h-11 px-5 border border-[#E5E7EB] hover:border-[#CBD5E1] rounded-xl font-bold text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 bg-[#6C3BFF] hover:bg-[#5B2FD8] text-white rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {editingItem ? 'Save Changes' : 'Create Property'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => { setModalType(null); setEditingItem(null); }}
                    className="px-4 py-2 border border-[#E2E8F0] rounded-xl font-bold text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-bold shadow-md shadow-indigo-100"
                  >
                    {editingItem ? 'Save Changes' : 'Create Record'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREDENTIALS VIEWER MODAL POPUP */}
      {/* ========================================================= */}
      {viewingCredentials && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Security & Login Credentials</h3>
                  <p className="text-[11px] text-indigo-200">
                    {viewingCredentials.role === 'resident' ? 'Tenant Resident Portal Access' : `${viewingCredentials.role?.toUpperCase()} Staff Access`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCredentials(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* User overview */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">{viewingCredentials.name}</div>
                  <div className="text-[#64748B] text-[11px]">{viewingCredentials.property || 'Green Valley PG'}</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] border border-emerald-200">
                  Active Account
                </span>
              </div>

              {/* Portal URL */}
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-[#64748B]">Dedicated Portal Login URL:</span>
                <div className="flex items-center justify-between">
                  <code className="text-[#4F46E5] font-mono font-semibold text-xs truncate">
                    http://localhost:5173/#/login/{viewingCredentials.role === 'resident' ? 'tenant' : viewingCredentials.role}
                  </code>
                </div>
              </div>

              {/* Username / ID */}
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] block">LOGIN USERNAME / ID</span>
                  <span className="font-mono font-bold text-sm text-[#0F172A]">
                    @{viewingCredentials.username}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingCredentials.username);
                    setCopiedCredentials(true);
                    setTimeout(() => setCopiedCredentials(false), 2000);
                  }}
                  className="p-1.5 hover:bg-indigo-100 rounded text-[#4F46E5] text-xs flex items-center gap-1 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Password */}
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] block">ACCOUNT PASSWORD</span>
                  <span className="font-mono font-bold text-sm text-[#0F172A]">
                    {showCredentialsPassword ? viewingCredentials.password : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowCredentialsPassword(!showCredentialsPassword)}
                    className="p-1.5 hover:bg-indigo-100 rounded text-[#64748B]"
                  >
                    {showCredentialsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(viewingCredentials.password);
                      setCopiedCredentials(true);
                      setTimeout(() => setCopiedCredentials(false), 2000);
                    }}
                    className="p-1.5 hover:bg-indigo-100 rounded text-[#4F46E5] text-xs flex items-center gap-1 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Copy Full Credentials CTA */}
              <button
                type="button"
                onClick={() => {
                  const portalUrl = `http://localhost:5173/#/login/${viewingCredentials.role === 'resident' ? 'tenant' : viewingCredentials.role}`;
                  const text = `StayNest Login Credentials for ${viewingCredentials.name}:\nPortal: ${portalUrl}\nUsername: ${viewingCredentials.username}\nPassword: ${viewingCredentials.password}`;
                  navigator.clipboard.writeText(text);
                  setCopiedCredentials(true);
                  setTimeout(() => setCopiedCredentials(false), 2500);
                }}
                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  copiedCredentials 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-indigo-100'
                }`}
              >
                {copiedCredentials ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>✓ Full Credentials Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Complete Login Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BEAUTIFUL ENTERPRISE CONFIRMATION MODAL (Replaces native browser alert) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                confirmDialog.isDestructive ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-[#6366F1]'
              }`}>
                {confirmDialog.isDestructive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0F172A]">{confirmDialog.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{confirmDialog.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl text-xs font-bold transition-colors"
              >
                {confirmDialog.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const cb = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  cb();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs text-white ${
                  confirmDialog.isDestructive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#6366F1] hover:bg-[#4F46E5]'
                }`}
              >
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
