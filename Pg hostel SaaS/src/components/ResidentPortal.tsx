import React, { useState } from 'react';
import { Resident, Invoice, Complaint, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  User, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  MessageSquare, 
  Plus, 
  Building2,
  Phone,
  ShieldCheck,
  X
} from 'lucide-react';

interface ResidentPortalProps {
  resident: Resident;
  invoice: Invoice;
  complaints: Complaint[];
  language: Language;
  onPayRent: (invoiceId: string, utr: string) => void;
  onSubmitComplaint: (complaintData: any) => void;
}

export const ResidentPortal: React.FC<ResidentPortalProps> = ({
  resident,
  invoice,
  complaints,
  language,
  onPayRent,
  onSubmitComplaint
}) => {
  const t = getTranslation(language);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<'wifi' | 'plumbing' | 'electrical' | 'cleaning' | 'food'>('wifi');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [simulatedUTR, setSimulatedUTR] = useState('');

  const myComplaints = complaints.filter(c => c.residentId === resident.id);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitComplaint({
      residentId: resident.id,
      residentName: resident.name,
      roomNumber: resident.roomNumber,
      category: complaintCategory,
      description: complaintDesc,
      priority: 'medium',
      status: 'pending',
      createdAt: 'Just Now'
    });

    setIsComplaintModalOpen(false);
    setComplaintDesc('');
  };

  const handleExecutePayment = () => {
    onPayRent(invoice.id, simulatedUTR);
    setIsPayModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Resident Digital Stay Card */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(37,99,235,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
              Uyar PG Resident Pass
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '1.5rem', margin: '0.2rem 0' }}>{resident.name}</h2>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              Room {resident.roomNumber} • Bed {resident.bedNumber}
            </div>
          </div>

          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="#ffffff" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.85rem', fontSize: '0.8rem' }}>
          <div>
            <div style={{ opacity: 0.75 }}>Monthly Rent:</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{resident.rentAmount.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ opacity: 0.75 }}>Security Deposit:</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{resident.depositAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Current Month Bill Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', margin: 0 }}>
              {invoice.billingMonth} Rent & EB Bill
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date: {invoice.dueDate}</div>
          </div>

          <div>
            {invoice.status === 'paid' ? (
              <span className="badge badge-paid"><CheckCircle2 size={13} /> Paid in Full</span>
            ) : (
              <span className="badge badge-pending"><AlertCircle size={13} /> ₹{invoice.balanceAmount.toLocaleString()} Due</span>
            )}
          </div>
        </div>

        {/* Transparent Bill Line Items */}
        <div style={{ background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Base Room Rent:</span>
            <span style={{ fontWeight: 700 }}>₹{invoice.baseRent.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6d28d9', fontWeight: 600 }}>
              <Zap size={14} /> Sub-Meter Electricity Share ({invoice.ebUnits} Units):
            </span>
            <span style={{ fontWeight: 700, color: '#6d28d9' }}>+ ₹{invoice.ebAmount.toLocaleString()}</span>
          </div>

          <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.5rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
            <span>Total Payable:</span>
            <span style={{ color: 'var(--primary-900)' }}>₹{invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {invoice.status !== 'paid' ? (
          <button 
            onClick={() => setIsPayModalOpen(true)}
            className="btn btn-emerald"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <QrCode size={18} /> Pay ₹{invoice.balanceAmount.toLocaleString()} via UPI
          </button>
        ) : (
          <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
            ✓ Payment received via UPI (UTR: {invoice.utrNumber || 'Verified'}). Thank you!
          </div>
        )}
      </div>

      {/* Complaints / Service Requests Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)', margin: 0 }}>
            My Maintenance Tickets
          </h3>
          <button 
            onClick={() => setIsComplaintModalOpen(true)} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Plus size={14} /> Raise Ticket
          </button>
        </div>

        {myComplaints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No open complaints. Everything in your room is in working order!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {myComplaints.map(c => (
              <div key={c.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>{c.category} Issue</span>
                  {c.status === 'resolved' ? (
                    <span className="badge badge-available">Resolved</span>
                  ) : (
                    <span className="badge badge-partial">In Progress</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>"{c.description}"</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: UPI Dynamic QR Pay */}
      {isPayModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Pay Rent via Dynamic UPI</h3>
              <button onClick={() => setIsPayModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Scan with GPay, PhonePe, or Paytm. Exact amount of <strong>₹{invoice.balanceAmount}</strong> is pre-filled.
            </p>

            {/* Simulated QR Code */}
            <div style={{ width: '180px', height: '180px', margin: '0 auto 1.25rem auto', background: '#f8fafc', border: '2px dashed #2563eb', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={120} color="#1e3a8a" />
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-700)', fontWeight: 700, marginTop: '0.4rem' }}>
                uyarpg.omr@icici
              </span>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>12-Digit Banking UTR Number</label>
              <input 
                className="form-input" 
                value={simulatedUTR} 
                onChange={(e) => setSimulatedUTR(e.target.value)} 
                placeholder="Enter 12-digit UTR from your UPI payment" 
              />
            </div>

            <button 
              onClick={handleExecutePayment} 
              className="btn btn-emerald" 
              style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }}
            >
              Confirm & Reconcile Payment
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Raise Complaint */}
      {isComplaintModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Raise Maintenance Ticket</h3>
              <button onClick={() => setIsComplaintModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateComplaint}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={complaintCategory} onChange={(e) => setComplaintCategory(e.target.value as any)}>
                  <option value="wifi">Wi-Fi Internet Signal</option>
                  <option value="plumbing">Plumbing & Bathroom Tap</option>
                  <option value="electrical">AC / Fan / Light Switch</option>
                  <option value="cleaning">Room & Washroom Cleaning</option>
                  <option value="food">Mess Food Quality</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Describe the Issue</label>
                <textarea 
                  required 
                  rows={3} 
                  className="form-textarea" 
                  placeholder="e.g. Wi-Fi drops every 10 minutes in Room 101..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsComplaintModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Submit Ticket to Warden</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
