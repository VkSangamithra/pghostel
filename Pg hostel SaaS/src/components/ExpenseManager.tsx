import React, { useState } from 'react';
import { Expense, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Wrench, 
  Users, 
  Zap, 
  Wifi, 
  X 
} from 'lucide-react';

interface ExpenseManagerProps {
  expenses: Expense[];
  totalCollectedRevenue: number;
  language: Language;
  onAddExpense: (expenseData: any) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  totalCollectedRevenue,
  language,
  onAddExpense
}) => {
  const t = getTranslation(language);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('maintenance');
  const [amount, setAmount] = useState<number>(1500);
  const [paidTo, setPaidTo] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank'>('UPI');

  const totalExpenseAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalCollectedRevenue - totalExpenseAmount;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      title,
      category,
      amount,
      paidTo,
      paymentMode,
      date: new Date().toISOString().split('T')[0]
    });

    setIsAddExpenseOpen(false);
    setTitle('');
    setPaidTo('');
  };

  const getCategoryIcon = (cat: Expense['category']) => {
    switch (cat) {
      case 'salary': return <Users size={14} color="#2563eb" />;
      case 'mess': return <ShoppingBag size={14} color="#10b981" />;
      case 'electricity': return <Zap size={14} color="#8b5cf6" />;
      case 'wifi': return <Wifi size={14} color="#06b6d4" />;
      default: return <Wrench size={14} color="#f59e0b" />;
    }
  };

  return (
    <div>
      {/* P&L Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Collected Revenue</span>
            <TrendingUp size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{totalCollectedRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From room rent & EB recovery</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Operating Expenses</span>
            <TrendingDown size={16} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)' }}>₹{totalExpenseAmount.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staff, provisions, EB, repairs</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Operating Profit</span>
            <DollarSign size={16} color="var(--primary-600)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: netProfit >= 0 ? 'var(--primary-900)' : 'var(--accent-rose)' }}>
            ₹{netProfit.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
            {totalCollectedRevenue > 0 ? Math.round((netProfit / totalCollectedRevenue) * 100) : 0}% Profit Margin
          </div>
        </div>
      </div>

      {/* Header and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>
          Operational Expenses Ledger (October 2026)
        </h3>

        <button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Add Expense Entry
        </button>
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Title / Description</th>
              <th>Paid To</th>
              <th>Payment Mode</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exp.date}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                    {getCategoryIcon(exp.category)} {exp.category}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary-900)' }}>{exp.title}</td>
                <td style={{ fontSize: '0.85rem' }}>{exp.paidTo}</td>
                <td style={{ fontSize: '0.85rem' }}>{exp.paymentMode}</td>
                <td style={{ fontWeight: 800, color: 'var(--accent-rose)' }}>-₹{exp.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Add Expense */}
      {isAddExpenseOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)' }}>Record Operational Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateExpense}>
              <div className="form-group">
                <label className="form-label">Expense Title</label>
                <input required className="form-input" placeholder="e.g. Geyser coil replacement" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                    <option value="maintenance">Maintenance / Plumbing</option>
                    <option value="salary">Staff Salary</option>
                    <option value="mess">Groceries / Provisions</option>
                    <option value="electricity">TNEB Electricity Bill</option>
                    <option value="wifi">Commercial Internet</option>
                    <option value="other">Other Supplies</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input required type="number" className="form-input" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Paid To (Vendor/Staff)</label>
                  <input required className="form-input" placeholder="e.g. Sri Murugan Store" value={paidTo} onChange={(e) => setPaidTo(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select className="form-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)}>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddExpenseOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
