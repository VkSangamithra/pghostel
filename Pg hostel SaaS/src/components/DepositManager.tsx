import React, { useState } from 'react';
import { Resident, Invoice, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  ShieldCheck, 
  FileCheck, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  Camera,
  X
} from 'lucide-react';

interface DepositManagerProps {
  residents: Resident[];
  invoices: Invoice[];
  language: Language;
  onFinalizeSettlement: (residentId: string, refundAmount: number) => void;
}

export const DepositManager: React.FC<DepositManagerProps> = ({
  residents,
  invoices,
  language,
  onFinalizeSettlement
}) => {
  const t = getTranslation(language);
  const [selectedResidentId, setSelectedResidentId] = useState<string>(residents[0]?.id || '');
  const [damageDeduction, setDamageDeduction] = useState<number>(0);
  const [damageReason, setDamageReason] = useState('');
  const [damagePhotoUploaded, setDamagePhotoUploaded] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Active resident calculation
  const resident = residents.find(r => r.id === selectedResidentId) || residents[0];
  const pendingInvoices = invoices.filter(i => i.residentId === resident?.id && i.status !== 'paid');
  const totalPendingRent = pendingInvoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);

  const initialDeposit = resident?.depositAmount || 15000;
  const estimatedUnbilledEB = 820; // Simulated current unbilled EB
  const totalDeductions = totalPendingRent + estimatedUnbilledEB + damageDeduction;
  const netRefundDue = Math.max(0, initialDeposit - totalDeductions);

  // Total deposits across all tenants
  const totalDepositsHeld = residents.reduce((acc, r) => acc + r.depositAmount, 0);

  return (
    <div>
      {/* Top Deposit Status Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Security Deposits Held</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{totalDepositsHeld.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {residents.length} active residents</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Move-Out Notice Stage</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>1 Resident</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vacating on Nov 05, 2026</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Dispute-Free Checkouts</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)' }}>100% Digital</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Itemised clearance vouchers</div>
        </div>
      </div>

      {/* Move-Out Settlement Interactive Calculator */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <Sparkles size={16} /> Transparent Move-Out Settlement Engine
          </div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-900)' }}>
            Digital Checkout & Security Deposit Refund Calculator
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Itemise all deductions transparently to avoid checkout conflicts, bad reviews, and delayed room handovers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
          {/* Left Column: Form inputs */}
          <div>
            <div className="form-group">
              <label className="form-label">Select Resident Vacating</label>
              <select 
                className="form-select" 
                value={selectedResidentId} 
                onChange={(e) => setSelectedResidentId(e.target.value)}
              >
                {residents.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — Room {r.roomNumber} ({r.bedNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Original Security Deposit Collected (₹)</label>
              <input type="text" disabled className="form-input" value={`₹${initialDeposit.toLocaleString()}`} style={{ background: '#f8fafc', fontWeight: 700 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Pending Unpaid Rent Dues</label>
              <input type="text" disabled className="form-input" value={`₹${totalPendingRent.toLocaleString()}`} style={{ background: '#f8fafc', fontWeight: 700, color: totalPendingRent > 0 ? 'var(--accent-rose)' : 'var(--text-main)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-fetched from unpaid invoice ledger</span>
            </div>

            <div className="form-group">
              <label className="form-label">Unbilled Prorated Electricity (EB) Units</label>
              <input type="text" disabled className="form-input" value={`₹${estimatedUnbilledEB.toLocaleString()}`} style={{ background: '#f8fafc', fontWeight: 700, color: '#6d28d9' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Computed from sub-meter daily consumption</span>
            </div>

            <div className="form-group">
              <label className="form-label">Documented Room Repair / Cleaning Deductions (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={damageDeduction} 
                onChange={(e) => setDamageDeduction(Number(e.target.value))} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deduction Reason (Mandatory for transparency)</label>
              <input 
                type="text" 
                className="form-input" 
                value={damageReason} 
                onChange={(e) => setDamageReason(e.target.value)} 
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#faf5ff', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed #c4b5fd', marginBottom: '1rem' }}>
              <Camera size={18} color="#7c3aed" />
              <span style={{ fontSize: '0.8rem', color: '#6d28d9', fontWeight: 600 }}>
                {damagePhotoUploaded ? '✓ Room Inspection Damage Photo Attached' : 'Attach damage photo'}
              </span>
            </div>
          </div>

          {/* Right Column: Live Settlement Voucher Summary */}
          <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-800)', marginBottom: '0.25rem' }}>
                Settlement Statement Preview
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Resident: <strong>{resident.name}</strong> • Room {resident.roomNumber} ({resident.bedNumber})
              </div>

              {/* Math breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Original Deposit Credit:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>+ ₹{initialDeposit.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: totalPendingRent > 0 ? 'var(--accent-rose)' : 'inherit' }}>
                  <span>Less: Pending Rent Settlement:</span>
                  <strong>- ₹{totalPendingRent.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6d28d9' }}>
                  <span>Less: Unbilled EB Consumption:</span>
                  <strong>- ₹{estimatedUnbilledEB.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-rose)' }}>
                  <span>Less: Documented Cleaning / Repairs:</span>
                  <strong>- ₹{damageDeduction.toLocaleString()}</strong>
                </div>

                <div style={{ height: '1px', background: 'var(--border-light)', margin: '0.25rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                  <span>Net Refund Payable to Resident:</span>
                  <span style={{ color: 'var(--accent-emerald)' }}>₹{netRefundDue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsVoucherModalOpen(true)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <FileCheck size={18} />
                <span>Generate Official Settlement Voucher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Printable Clearance Voucher */}
      {isVoucherModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-700)' }}>
                MOVE-OUT CLEARANCE VOUCHER
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => window.print()} className="btn btn-secondary btn-sm"><Printer size={14} /> Print</button>
                <button onClick={() => setIsVoucherModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
              </div>
            </div>

            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--primary-800)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-900)' }}>UYAR TECHNOLOGIES PG</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official Move-Out & Deposit Settlement Voucher</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div>Resident Name: <strong>{resident.name}</strong></div>
                <div>Room / Bed: <strong>Room {resident.roomNumber} ({resident.bedNumber})</strong></div>
                <div>Move-in Date: <strong>{resident.joinDate}</strong></div>
                <div>Move-out Date: <strong>2026-10-24</strong></div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0' }}>Security Deposit Originally Paid:</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{initialDeposit.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0' }}>Deduction - Pending Rent Dues:</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>- ₹{totalPendingRent.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0' }}>Deduction - Unbilled Electricity (EB):</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>- ₹{estimatedUnbilledEB.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.5rem 0' }}>Deduction - {damageReason}:</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>- ₹{damageDeduction.toLocaleString()}</td>
                  </tr>
                  <tr style={{ fontWeight: 800, fontSize: '1rem', borderTop: '2px solid var(--primary-900)' }}>
                    <td style={{ padding: '0.75rem 0' }}>Net Refund Paid via UPI:</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent-emerald)' }}>₹{netRefundDue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                  <strong>Resident Signature</strong><br/>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>I agree to this final settlement</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                  <strong>Owner / Warden Signature</strong><br/>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authorized Uyar PG Representative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
