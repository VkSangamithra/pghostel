import React, { useState } from 'react';
import { Property, Room, Resident, Invoice, Expense, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  Calculator, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  X,
  ArrowUpRight,
  ArrowDownRight,
  Check
} from 'lucide-react';

interface AccountantPortalProps {
  property: Property;
  rooms: Room[];
  residents: Resident[];
  invoices: Invoice[];
  expenses: Expense[];
  language: Language;
  onRecordPayment: (invoiceId: string, amount: number, mode: string, utr: string) => void;
  onAddExpense: (expenseData: any) => void;
}

export const AccountantPortal: React.FC<AccountantPortalProps> = ({
  property,
  rooms,
  residents,
  invoices,
  expenses,
  language,
  onRecordPayment,
  onAddExpense
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'ledger' | 'eb' | 'expenses' | 'pnl'>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // Reconcile Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [utrNumber, setUtrNumber] = useState('');

  // Add Expense Voucher Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpenseCategory, setNewExpenseCategory] = useState<'maintenance' | 'salary' | 'mess' | 'electricity' | 'wifi' | 'water' | 'other'>('mess');
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePayee, setNewExpensePayee] = useState('');
  const [newExpenseMode, setNewExpenseMode] = useState<'UPI' | 'Cash' | 'Bank'>('UPI');

  // Calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netSurplus = totalCollected - totalExpenses;
  const totalEbUnits = invoices.reduce((sum, inv) => sum + inv.ebUnits, 0);
  const totalEbAmount = invoices.reduce((sum, inv) => sum + inv.ebAmount, 0);

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReconcile = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balanceAmount);
    setUtrNumber(`UTR${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || paymentAmount <= 0) return;
    onRecordPayment(selectedInvoice.id, paymentAmount, paymentMode, utrNumber);
    setSelectedInvoice(null);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseTitle || !newExpenseAmount) return;
    onAddExpense({
      title: newExpenseTitle,
      amount: parseFloat(newExpenseAmount),
      category: newExpenseCategory,
      paidTo: newExpensePayee || 'Vendor',
      paymentMode: newExpenseMode,
      date: new Date().toISOString().split('T')[0]
    });
    setIsExpenseModalOpen(false);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setNewExpensePayee('');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Top Accountant Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}>
            <Calculator size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{
                background: 'rgba(139, 92, 246, 0.3)',
                color: '#c4b5fd',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid rgba(139, 92, 246, 0.4)'
              }}>
                ACCOUNTANT PORTAL
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>• FY 2026–27 | October 2026</span>
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.45rem', fontWeight: 850, margin: 0 }}>
              Financial Controller & Accounts Ledger
            </h1>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
              {property.name} — Reconciliation, EB Billing & P&L Statement
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            style={{
              background: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)'
            }}
          >
            <Plus size={15} />
            <span>Record Expense Voucher</span>
          </button>

          <button
            onClick={() => alert('Exporting full financial ledger (CSV/Excel) for Property Auditor...')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.55rem 1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Download size={15} />
            <span>Export Books</span>
          </button>
        </div>
      </div>

      {/* 5 Financial Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {/* Total Billed */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Rent Billed</span>
            <FileText size={16} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            {invoices.length} Resident invoices generated
          </div>
        </div>

        {/* Collections Reconciled */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid #bbf7d0',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>Collections Reconciled</span>
            <ArrowUpRight size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.25rem', fontWeight: 600 }}>
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% Realization Rate
          </div>
        </div>

        {/* Pending Receivables */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid #fecdd3',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#e11d48', fontWeight: 700 }}>Pending Receivables</span>
            <Clock size={16} color="#e11d48" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#e11d48' }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {invoices.filter(i => i.balanceAmount > 0).length} Overdue / partial tenants
          </div>
        </div>

        {/* Operating Expenses */}
        <div style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1px solid #fed7aa',
          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#c2410c', fontWeight: 700 }}>Operating Expenses</span>
            <ArrowDownRight size={16} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#c2410c' }}>
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '0.25rem' }}>
            {expenses.length} Vouchers (Mess, salaries, bills)
          </div>
        </div>

        {/* Net Operating Surplus */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
          borderRadius: '14px',
          padding: '1.25rem',
          border: '1.5px solid #c7d2fe',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 750 }}>Net Cash Surplus (P&L)</span>
            <TrendingUp size={16} color="#4f46e5" />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#4f46e5' }}>
            ₹{netSurplus.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4338ca', marginTop: '0.25rem', fontWeight: 600 }}>
            After operational outlays
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => setActiveTab('ledger')}
          style={{
            background: activeTab === 'ledger' ? '#4f46e5' : '#f1f5f9',
            color: activeTab === 'ledger' ? '#ffffff' : '#475569',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontWeight: 750,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Receipt size={14} />
          <span>Rent Invoices & Reconciliation</span>
        </button>

        <button
          onClick={() => setActiveTab('eb')}
          style={{
            background: activeTab === 'eb' ? '#7c3aed' : '#f1f5f9',
            color: activeTab === 'eb' ? '#ffffff' : '#475569',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontWeight: 750,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Zap size={14} />
          <span>EB Sub-Meter Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            background: activeTab === 'expenses' ? '#0284c7' : '#f1f5f9',
            color: activeTab === 'expenses' ? '#ffffff' : '#475569',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontWeight: 750,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease'
          }}
        >
          <CreditCard size={14} />
          <span>Expense Vouchers ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pnl')}
          style={{
            background: activeTab === 'pnl' ? '#059669' : '#f1f5f9',
            color: activeTab === 'pnl' ? '#ffffff' : '#475569',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontWeight: 750,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease'
          }}
        >
          <TrendingUp size={14} />
          <span>P&L Profit & Loss Statement</span>
        </button>
      </div>

      {/* TAB 1: RENT INVOICES & RECONCILIATION */}
      {activeTab === 'ledger' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search tenant name or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', background: '#f8fafc', padding: '0.2rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              {(['all', 'paid', 'pending', 'overdue'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    border: 'none',
                    background: statusFilter === st ? '#ffffff' : 'transparent',
                    color: statusFilter === st ? '#0f172a' : '#64748b',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: statusFilter === st ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    textTransform: 'capitalize'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Invoice #</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Resident & Room</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Rent + EB</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Paid & Mode</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Balance</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#4f46e5' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 750, color: '#0f172a' }}>{inv.residentName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Room {inv.roomNumber} • Bed {inv.bedNumber}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div>₹{inv.baseRent}</div>
                      <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>+₹{inv.ebAmount} ({inv.ebUnits} u)</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#059669' }}>₹{inv.paidAmount.toLocaleString('en-IN')}</div>
                      {inv.paymentMode && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          via {inv.paymentMode} {inv.utrNumber ? `• ${inv.utrNumber}` : ''}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: inv.balanceAmount > 0 ? '#e11d48' : '#059669' }}>
                      ₹{inv.balanceAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: inv.status === 'paid' ? '#ecfdf5' : inv.status === 'partial' ? '#fffbeb' : '#ffe4e6',
                        color: inv.status === 'paid' ? '#059669' : inv.status === 'partial' ? '#b45309' : '#e11d48',
                        textTransform: 'uppercase'
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                      {inv.balanceAmount > 0 ? (
                        <button
                          onClick={() => handleOpenReconcile(inv)}
                          style={{
                            background: '#4f46e5',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          Reconcile
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Official Receipt #${inv.invoiceNumber} verified & archived.`)}
                          style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid #cbd5e1',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                          }}
                        >
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EB SUB-METER AUDIT */}
      {activeTab === 'eb' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Electricity Sub-Meter Commercial Audit</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Tariff: ₹{property.tariffPerUnit}/unit • {property.subMeterType === 'per_room' ? 'Room Sub-Meters' : 'Floor Sub-Meters'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '0.4rem 0.85rem', textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>Total Reconciled Units: </span>
                <strong style={{ fontSize: '0.9rem', color: '#5b21b6' }}>{totalEbUnits} kWh</strong>
              </div>
              <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '0.4rem 0.85rem', textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>Total EB Value: </span>
                <strong style={{ fontSize: '0.9rem', color: '#5b21b6' }}>₹{totalEbAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {rooms.map(room => {
              const units = room.currentReading - room.previousReading;
              const cost = units * (property.tariffPerUnit || 9);
              return (
                <div key={room.id} style={{ background: '#faf5ff', borderRadius: '12px', padding: '1.15rem', border: '1.5px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#581c87' }}>Room {room.roomNumber}</span>
                    <span style={{ fontSize: '0.75rem', background: '#ffffff', color: '#6b21a8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700, border: '1px solid #d8b4fe' }}>
                      Floor {room.floor}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ color: '#7e22ce' }}>Previous:</span> <strong>{room.previousReading}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7e22ce' }}>Current:</span> <strong>{room.currentReading}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7e22ce' }}>Net Units:</span> <strong style={{ color: '#6b21a8' }}>{units} units</strong>
                    </div>
                    <div>
                      <span style={{ color: '#7e22ce' }}>Calculated:</span> <strong style={{ color: '#059669' }}>₹{cost}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9333ea', borderTop: '1px dashed #d8b4fe', paddingTop: '0.5rem' }}>
                    Meter ID: {room.subMeterId || 'MTR-AUTO'} • Last read: {room.lastReadingDate || '2026-10-24'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EXPENSE VOUCHERS */}
      {activeTab === 'expenses' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Operating Expenses & Vendor Payments</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                All audited disbursements verified with bills and receipts
              </p>
            </div>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Plus size={15} /> Add Expense Voucher
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Voucher Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Paid To</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mode</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{exp.date}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.74rem',
                        fontWeight: 750,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        textTransform: 'capitalize'
                      }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 750, color: '#0f172a' }}>{exp.title}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{exp.paidTo}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{exp.paymentMode}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: '#c2410c' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: P&L PROFIT & LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.75rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#0f172a', fontWeight: 850 }}>
                Monthly Profit & Loss Statement (P&L)
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Period: October 2026 • Entity: {property.name} ({property.city})
              </p>
            </div>
            <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.82rem' }}>
              ● Audited Books
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Income Side */}
            <div>
              <h4 style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 800, borderBottom: '2px solid #10b981', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                1. Operational Revenues (Cash Inflow)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Room & Bed Rent</span>
                  <strong>₹{(totalCollected - totalEbAmount).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Electricity (EB) Sub-Meter Recovery</span>
                  <strong>₹{totalEbAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Registration & Admin Fees</span>
                  <span>₹0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '1rem', fontWeight: 850, color: '#059669' }}>
                  <span>Total Gross Revenue Collected</span>
                  <span>₹{totalCollected.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Expenses Side */}
            <div>
              <h4 style={{ color: '#c2410c', fontSize: '1.05rem', fontWeight: 800, borderBottom: '2px solid #f97316', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                2. Operating Expenses (Cash Outflow)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                {['mess', 'salary', 'maintenance', 'electricity', 'wifi', 'other'].map(cat => {
                  const subTotal = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                  return (
                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ textTransform: 'capitalize' }}>{cat === 'mess' ? 'Mess & Provisions' : cat}</span>
                      <strong>₹{subTotal.toLocaleString('en-IN')}</strong>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '1rem', fontWeight: 850, color: '#c2410c' }}>
                  <span>Total Operational Outlays</span>
                  <span>₹{totalExpenses.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Margin Box */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '14px',
            background: netSurplus >= 0 ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${netSurplus >= 0 ? '#86efac' : '#fecaca'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: netSurplus >= 0 ? '#166534' : '#991b1b', fontWeight: 700 }}>
                NET OPERATING INCOME (NOI) / SURPLUS
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                Net profit margin: {totalCollected > 0 ? Math.round((netSurplus / totalCollected) * 100) : 0}% of collections
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: netSurplus >= 0 ? '#15803d' : '#b91c1c' }}>
              ₹{netSurplus.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: RECONCILE PAYMENT MODAL */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                Reconcile Rent Payment
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Resident:</strong> {selectedInvoice.residentName} (Room {selectedInvoice.roomNumber})</div>
              <div><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</div>
              <div style={{ color: '#e11d48', marginTop: '0.25rem' }}>
                <strong>Due Balance:</strong> ₹{selectedInvoice.balanceAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <form onSubmit={handleConfirmPayment}>
              <div className="form-group">
                <label className="form-label">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-input"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash (Handed to Caretaker)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction UTR / Reference ID</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 428901928371"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontWeight: 750, marginTop: '1rem' }}
              >
                Post Payment to Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD EXPENSE VOUCHER */}
      {isExpenseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                Add Expense Voucher
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                >
                  <option value="mess">Mess & Groceries</option>
                  <option value="salary">Staff Salary & Wages</option>
                  <option value="electricity">TANGEDCO Electricity Bill</option>
                  <option value="maintenance">Plumbing / Repairs</option>
                  <option value="water">Water Tanker</option>
                  <option value="wifi">Commercial Internet</option>
                  <option value="other">Other Miscellaneous</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Voucher Description / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Rice & Oil Provisions"
                  className="form-input"
                  value={newExpenseTitle}
                  onChange={(e) => setNewExpenseTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 14500"
                  className="form-input"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paid To (Vendor / Staff Name)</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Balaji Supermarket"
                  className="form-input"
                  value={newExpensePayee}
                  onChange={(e) => setNewExpensePayee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Disbursement Mode</label>
                <select
                  className="form-input"
                  value={newExpenseMode}
                  onChange={(e) => setNewExpenseMode(e.target.value as any)}
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash Voucher</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontWeight: 750, marginTop: '1rem', background: '#0284c7' }}
              >
                Save Voucher to Ledger
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountantPortal;
