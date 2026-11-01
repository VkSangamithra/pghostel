import React, { useState } from 'react';
import { Invoice, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  QrCode, 
  Printer, 
  ShieldCheck, 
  Search,
  Filter,
  X
} from 'lucide-react';

interface BillingManagerProps {
  invoices: Invoice[];
  language: Language;
  onRecordPayment: (invoiceId: string, amount: number, mode: string, utr: string) => void;
  onGenerateMonthlyInvoices: () => void;
}

export const BillingManager: React.FC<BillingManagerProps> = ({
  invoices,
  language,
  onRecordPayment,
  onGenerateMonthlyInvoices
}) => {
  const t = getTranslation(language);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'partial'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);

  // Payment modal state
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');

  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);
  const collectionPercent = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const filteredInvoices = invoices.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchQuery && !inv.residentName.toLowerCase().includes(searchQuery.toLowerCase()) && !inv.roomNumber.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoiceForPayment(inv);
    setPaymentAmount(inv.balanceAmount);
    setUtrNumber('');
    setUtrError('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    if (paymentMode === 'UPI' && utrNumber.trim().length !== 12) {
      setUtrError('Valid 12-digit UPI Transaction Reference (UTR) is required to prevent screenshot tampering.');
      return;
    }

    onRecordPayment(selectedInvoiceForPayment.id, paymentAmount, paymentMode, utrNumber);
    setSelectedInvoiceForPayment(null);
  };

  return (
    <div>
      {/* Financial Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Monthly Billed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-900)' }}>₹{totalBilled.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{invoices.length} active invoices for Oct 2026</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collected Rent</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{totalCollected.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{collectionPercent}% Collection Efficiency</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Overdue Dues</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)' }}>₹{totalPending.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)' }}>{invoices.filter(i => i.status === 'overdue').length} tenants overdue</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search resident or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button 
          onClick={onGenerateMonthlyInvoices}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Receipt size={16} />
          <span>{language === 'en' ? 'Run Auto-Billing Cycle' : 'பில் தானியங்கி இயக்கம்'}</span>
        </button>
      </div>

      {/* Invoices Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Resident & Room</th>
              <th>Base Rent</th>
              <th>EB Unit Share</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.85rem' }}>{inv.invoiceNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.billingMonth}</div>
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{inv.residentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room {inv.roomNumber} ({inv.bedNumber})</div>
                </td>

                <td style={{ fontWeight: 600 }}>₹{inv.baseRent.toLocaleString()}</td>

                <td>
                  <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.85rem' }}>₹{inv.ebAmount.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.ebUnits} Units @ ₹{inv.ebRate}</div>
                </td>

                <td style={{ fontWeight: 800, color: 'var(--primary-900)' }}>₹{inv.totalAmount.toLocaleString()}</td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>₹{inv.paidAmount.toLocaleString()}</div>
                  {inv.utrNumber && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UTR: {inv.utrNumber}</div>
                  )}
                </td>

                <td>
                  {inv.status === 'paid' && <span className="badge badge-paid"><CheckCircle2 size={12} /> Paid</span>}
                  {inv.status === 'overdue' && <span className="badge badge-pending"><AlertCircle size={12} /> Overdue</span>}
                  {inv.status === 'partial' && <span className="badge badge-partial"><Clock size={12} /> Partial</span>}
                  {inv.status === 'pending' && <span className="badge badge-pending">Pending</span>}
                </td>

                <td style={{ fontSize: '0.85rem', color: inv.status === 'overdue' ? 'var(--accent-rose)' : 'var(--text-muted)', fontWeight: inv.status === 'overdue' ? 700 : 500 }}>
                  {inv.dueDate}
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => handleOpenPayment(inv)}
                        className="btn btn-emerald btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        Record Pay
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInvoiceForView(inv)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.65rem' }}
                      title="View & Print Official PDF Invoice"
                    >
                      <Printer size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Record Payment with UTR Shield */}
      {selectedInvoiceForPayment && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>Record Payment & Reconcile</h3>
              </div>
              <button onClick={() => setSelectedInvoiceForPayment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'var(--surface-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedInvoiceForPayment.residentName}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room {selectedInvoiceForPayment.roomNumber} • Invoice {selectedInvoiceForPayment.invoiceNumber}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 800 }}>
                <span>Balance Due:</span>
                <span style={{ color: 'var(--accent-rose)' }}>₹{selectedInvoiceForPayment.balanceAmount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment}>
              <div className="form-group">
                <label className="form-label">Payment Amount (₹)</label>
                <input 
                  type="number" 
                  max={selectedInvoiceForPayment.balanceAmount}
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(Number(e.target.value))} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Channel</label>
                <select 
                  className="form-select" 
                  value={paymentMode} 
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash (Handed to Caretaker)</option>
                  <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
                </select>
              </div>

              {paymentMode === 'UPI' && (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>12-Digit UPI Reference Number (UTR)</span>
                    <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>*Required</span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    className="form-input"
                    placeholder="e.g. 428901928371"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value.replace(/\D/g, ''));
                      setUtrError('');
                    }}
                  />
                  {utrError ? (
                    <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{utrError}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                      Prevents duplicate or falsified screenshot fraud.
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setSelectedInvoiceForPayment(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-emerald" style={{ flex: 2 }}>Confirm & Issue Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Official Tax Invoice Voucher */}
      {selectedInvoiceForView && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-700)' }}>
                TAX INVOICE & RECEIPT
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
                  <Printer size={14} /> Print
                </button>
                <button onClick={() => setSelectedInvoiceForView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Official voucher paper representation */}
            <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1.75rem', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--primary-700)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '0.2rem' }}>UYAR TECHNOLOGIES PG</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Plot 42, Chandrasekar Avenue, OMR, Chennai - 600097</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI: uyarpg.omr@icici | Ph: +91 98401 23456</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>{selectedInvoiceForView.invoiceNumber}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {selectedInvoiceForView.dueDate}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Month: {selectedInvoiceForView.billingMonth}</div>
                </div>
              </div>

              {/* Billed To */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>BILLED TO:</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedInvoiceForView.residentName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Room {selectedInvoiceForView.roomNumber} — Bed {selectedInvoiceForView.bedNumber}</div>
              </div>

              {/* Line items table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ textAlign: 'left', padding: '0.6rem' }}>Particulars / Description</th>
                    <th style={{ textAlign: 'right', padding: '0.6rem' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.6rem' }}>Monthly Room Rent (Includes Wi-Fi & Maintenance)</td>
                    <td style={{ textAlign: 'right', padding: '0.6rem', fontWeight: 600 }}>₹{selectedInvoiceForView.baseRent.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.6rem' }}>
                      Room Sub-Meter Electricity Share ({selectedInvoiceForView.ebUnits} Units @ ₹{selectedInvoiceForView.ebRate}/unit)
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.6rem', fontWeight: 600 }}>₹{selectedInvoiceForView.ebAmount.toLocaleString()}</td>
                  </tr>
                  {selectedInvoiceForView.discount > 0 && (
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--accent-emerald)' }}>
                      <td style={{ padding: '0.6rem' }}>Promotional Discount Applied</td>
                      <td style={{ textAlign: 'right', padding: '0.6rem', fontWeight: 600 }}>-₹{selectedInvoiceForView.discount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={{ fontWeight: 800, fontSize: '1rem', borderTop: '2px solid var(--primary-800)' }}>
                    <td style={{ padding: '0.75rem 0.6rem' }}>Total Invoice Amount</td>
                    <td style={{ textAlign: 'right', padding: '0.75rem 0.6rem', color: 'var(--primary-700)' }}>
                      ₹{selectedInvoiceForView.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>Amount Received</td>
                    <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      ₹{selectedInvoiceForView.paidAmount.toLocaleString()}
                    </td>
                  </tr>
                  {selectedInvoiceForView.balanceAmount > 0 && (
                    <tr>
                      <td style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-rose)', fontWeight: 700 }}>Balance Due</td>
                      <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
                        ₹{selectedInvoiceForView.balanceAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {selectedInvoiceForView.utrNumber && (
                <div style={{ background: '#ecfdf5', padding: '0.6rem 0.8rem', borderRadius: '4px', fontSize: '0.78rem', color: '#065f46', marginBottom: '1rem' }}>
                  ✓ Reconciled via {selectedInvoiceForView.paymentMode} | Bank Ref (UTR): {selectedInvoiceForView.utrNumber} on {selectedInvoiceForView.paidDate}
                </div>
              )}

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem' }}>
                This is a computer-generated tax invoice and receipt issued through Uyar Technologies SaaS.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
