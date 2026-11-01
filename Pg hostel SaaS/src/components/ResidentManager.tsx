import React, { useState } from 'react';
import { Resident, Bed, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  UserPlus, 
  Search, 
  MessageSquare, 
  FileCheck, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  LogOut,
  Copy,
  Check,
  ExternalLink,
  X
} from 'lucide-react';

interface ResidentManagerProps {
  residents: Resident[];
  availableBeds: Bed[];
  language: Language;
  onAddResident: (residentData: any) => void;
  onMoveOut: (resident: Resident) => void;
}

export const ResidentManager: React.FC<ResidentManagerProps> = ({
  residents,
  availableBeds,
  language,
  onAddResident,
  onMoveOut
}) => {
  const t = getTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [onboardingLinkModal, setOnboardingLinkModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // New resident form state - clean and blank
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [selectedBedId, setSelectedBedId] = useState(availableBeds[0]?.id || '');
  const [rentAmount, setRentAmount] = useState<number | string>('');
  const [depositAmount, setDepositAmount] = useState<number | string>('');
  const [foodPreference, setFoodPreference] = useState<'veg' | 'non_veg' | 'none'>('veg');

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.roomNumber.includes(searchQuery) ||
    r.phone.includes(searchQuery)
  );

  const handleCreateResident = (e: React.FormEvent) => {
    e.preventDefault();
    const bed = availableBeds.find(b => b.id === selectedBedId) || availableBeds[0];
    if (!bed) return;

    onAddResident({
      name,
      phone,
      email,
      emergencyContact,
      aadhaarLast4,
      kycStatus: 'verified',
      roomId: bed.roomId,
      roomNumber: bed.roomNumber,
      bedId: bed.id,
      bedNumber: bed.bedNumber,
      joinDate: new Date().toISOString().split('T')[0],
      rentAmount,
      depositAmount,
      depositStatus: 'paid',
      foodPreference
    });

    setIsAddModalOpen(false);
    setName('');
    setPhone('+91 ');
  };

  const handleCopyLink = (tokenUrl: string) => {
    navigator.clipboard.writeText(tokenUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, room, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setOnboardingLinkModal('https://uyar.in/onboard/token_8492048')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <MessageSquare size={16} color="#10b981" />
            <span>{language === 'en' ? 'WhatsApp Self-Onboarding Link' : 'வாட்ஸ்அப் சேர்க்கை இணைப்பு'}</span>
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <UserPlus size={16} />
            <span>{language === 'en' ? 'Add Resident' : 'புதிய தங்குவோர் சேர்க்க'}</span>
          </button>
        </div>
      </div>

      {/* Residents Directory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Resident Name</th>
              <th>Room & Bed</th>
              <th>Contact Details</th>
              <th>Emergency Contact</th>
              <th>Aadhaar KYC</th>
              <th>Monthly Rent</th>
              <th>Deposit Held</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map(resident => (
              <tr key={resident.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{resident.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Joined: {resident.joinDate}
                  </div>
                </td>

                <td>
                  <span style={{ fontWeight: 800, color: 'var(--primary-700)', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    Room {resident.roomNumber} ({resident.bedNumber})
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                    <Phone size={13} color="var(--text-muted)" /> {resident.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Mail size={12} /> {resident.email}
                  </div>
                </td>

                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {resident.emergencyContact}
                </td>

                <td>
                  {resident.kycStatus === 'verified' ? (
                    <span className="badge badge-available">
                      <ShieldCheck size={12} /> Verified (..{resident.aadhaarLast4})
                    </span>
                  ) : (
                    <span className="badge badge-pending">
                      Pending Upload
                    </span>
                  )}
                </td>

                <td style={{ fontWeight: 700, color: 'var(--primary-800)' }}>
                  ₹{resident.rentAmount.toLocaleString()}
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ₹{resident.depositAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {resident.depositStatus}
                  </div>
                </td>

                <td>
                  <button
                    onClick={() => onMoveOut(resident)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--accent-rose)', borderColor: '#fecdd3', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    title="Initiate move-out and deposit settlement"
                  >
                    <LogOut size={13} /> Settle Move-Out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: WhatsApp Self-Onboarding Link Preview */}
      {onboardingLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>WhatsApp Self-Onboarding Link</h3>
              </div>
              <button onClick={() => setOnboardingLinkModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Copy and send this link to new residents via WhatsApp. They will fill in their personal details, upload an Aadhaar photo, and e-sign hostel terms on their mobile browser without downloading any mobile app.
            </p>

            <div style={{ background: 'var(--surface-bg)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600, wordBreak: 'break-all' }}>
                {onboardingLinkModal}
              </span>
              <button 
                onClick={() => handleCopyLink(onboardingLinkModal)} 
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: '0.5rem', whiteSpace: 'nowrap' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd6fe', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.85rem', marginBottom: '0.35rem' }}>What the tenant sees:</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                1. Mobile OTP confirmation<br/>
                2. Emergency contact & home address<br/>
                3. Aadhaar front/back camera photo upload<br/>
                4. House rules agreement (Smoking, Curfew, Noise policy)
              </div>
            </div>

            <button onClick={() => setOnboardingLinkModal(null)} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
          </div>
        </div>
      )}

      {/* MODAL: Add Resident Form */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)' }}>Add New Resident</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateResident}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vignesh R" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input required className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input required type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tenant@company.com" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Contact (Parent / Relative)</label>
                  <input required className="form-input" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="+91 94440 00000 (Father)" />
                </div>

                <div className="form-group">
                  <label className="form-label">Aadhaar (Last 4 Digits)</label>
                  <input required className="form-input" maxLength={4} value={aadhaarLast4} onChange={(e) => setAadhaarLast4(e.target.value)} placeholder="e.g. 8492" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Assign Available Bed</label>
                  <select className="form-select" value={selectedBedId} onChange={(e) => setSelectedBedId(e.target.value)}>
                    {availableBeds.map(b => (
                      <option key={b.id} value={b.id}>
                        Room {b.roomNumber} — Bed {b.bedNumber} (₹{b.rentAmount}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Monthly Rent Amount (₹)</label>
                  <input type="number" className="form-input" value={rentAmount} onChange={(e) => setRentAmount(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Security Deposit Collected (₹)</label>
                  <input type="number" className="form-input" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Mess / Food Preference</label>
                  <select className="form-select" value={foodPreference} onChange={(e) => setFoodPreference(e.target.value as any)}>
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="none">No Food (Room Only)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Save & Allocate Bed</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
