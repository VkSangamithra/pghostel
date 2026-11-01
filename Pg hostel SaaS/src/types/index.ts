export type Language = 'en' | 'ta';

export type UserRole = 'owner' | 'warden' | 'resident' | 'superadmin' | 'accountant' | 'public';

export type PGType = 'mens' | 'womens' | 'student' | 'coliving';

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'notice' | 'maintenance';

export type InvoiceStatus = 'paid' | 'pending' | 'partial' | 'overdue';

export interface Property {
  id: string;
  name: string;
  type: PGType;
  address: string;
  city: string;
  totalBeds: number;
  occupiedBeds: number;
  upiId: string;
  phone: string;
  tariffPerUnit: number; // e.g. ₹9/unit for TANGEDCO commercial
  subMeterType: 'per_room' | 'per_floor';
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  type: 'single' | 'double' | 'triple' | 'four';
  bedIds: string[];
  subMeterId: string;
  lastReadingDate: string;
  previousReading: number;
  currentReading: number;
  meterPhotoUrl?: string;
}

export interface Bed {
  id: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  status: BedStatus;
  residentId?: string;
  rentAmount: number;
}

export interface Resident {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  email: string;
  guardianName?: string;
  guardianPhone?: string;
  emergencyContact: string;
  aadhaarLast4: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  roomId: string;
  roomNumber: string;
  bedId: string;
  bedNumber: string;
  joinDate: string;
  rentAmount: number;
  depositAmount: number;
  depositStatus: 'paid' | 'partial' | 'refunded';
  foodPreference: 'veg' | 'non_veg' | 'none';
  onboardingLinkToken?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  bedNumber: string;
  billingMonth: string; // e.g. "October 2026"
  baseRent: number;
  ebUnits: number;
  ebRate: number;
  ebAmount: number;
  otherCharges: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  paymentMode?: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
  utrNumber?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: 'maintenance' | 'salary' | 'mess' | 'electricity' | 'wifi' | 'water' | 'other';
  title: string;
  amount: number;
  date: string;
  paidTo: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank';
}

export interface Complaint {
  id: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  category: 'plumbing' | 'electrical' | 'wifi' | 'cleaning' | 'food' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  assignedStaff?: string;
}

export interface VisitorPass {
  id: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  visitorName: string;
  phone: string;
  relation: string;
  purpose: string;
  expectedInTime: string;
  status: 'pending' | 'approved' | 'rejected';
  nightAlertSent?: boolean;
}

export interface NotificationLog {
  id: string;
  residentName: string;
  phone: string;
  type: 'rent_reminder' | 'payment_receipt' | 'eb_notice' | 'visitor_approval';
  language: Language;
  messageText: string;
  sentAt: string;
  status: 'delivered' | 'read' | 'suppressed';
}

// -------------------------------------------------------------
// PG OWNER REGISTRATION — VERIFICATION & SUSPICIOUS DETECTION
// -------------------------------------------------------------
export type VerificationStatus = 'verified' | 'pending_review' | 'flagged_suspicious' | 'docs_required' | 'action_required';

export type SuspiciousActivityType = 
  | 'duplicate_phone_email'
  | 'duplicate_address'
  | 'otp_failures'
  | 'missing_docs'
  | 'photo_reuse'
  | 'unverified_address'
  | 'inconsistent_details';

export interface SuspiciousFlag {
  id: string;
  type: SuspiciousActivityType;
  title: string;
  detail: string;
  systemAction: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: string;
  resolved?: boolean;
}

export interface OwnerVerificationDetails {
  id: string;
  // 1. Owner Identity Verification
  legalName: string;
  phone: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  govtIdType: 'aadhaar' | 'pan' | 'voter_id' | 'passport' | 'driving_license';
  govtIdNumber: string;
  govtIdDocName?: string;
  ownerPhotoName?: string;
  username?: string;
  loginId?: string;

  // 2. PG Existence Verification
  pgName: string;
  propertyAddress: string;
  pinCode: string;
  city: string;
  googleMapsLocation: string;
  floorsCount: number;
  roomsCount: number;
  bedsCount: number;
  genderType: 'boys' | 'girls' | 'coliving';
  buildingPhotos: string[];
  signboardPhoto?: string;

  // 3. Ownership / Authorization Check
  roleType: 'owner' | 'authorized_manager' | 'leaseholder';
  ownershipProofType: 'property_tax' | 'electricity_bill' | 'sale_deed';
  ownershipProofDoc?: string;
  leaseAgreementDoc?: string;
  managerAuthorizationDoc?: string;

  // 4. Operational Verification
  isOperational: boolean;
  operatingSinceYear: string;
  currentTenantsCount: number;
  isAcceptingNewTenants: boolean;
  enquiryContactPhone: string;
  localLicenses: string[];

  // Automated Detection Audit & Super Admin Review
  suspiciousFlags: SuspiciousFlag[];
  verificationStatus: VerificationStatus;
  submittedAt: string;
  reviewedBy?: string;
  superAdminNotes?: string;
}
