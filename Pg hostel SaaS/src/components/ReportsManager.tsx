import React, { useState } from 'react';
import { Property, Room, Bed, Resident, Invoice, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface ReportsManagerProps {
  property: Property;
  rooms: Room[];
  beds: Bed[];
  residents: Resident[];
  invoices: Invoice[];
  language: Language;
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  property,
  rooms,
  beds,
  residents,
  invoices,
  language
}) => {
  const t = getTranslation(language);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const vacancyRate = totalBeds > 0 ? Math.round(((totalBeds - occupiedBeds) / totalBeds) * 100) : 0;

  // Due Aging brackets
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.balanceAmount, 0);

  const handleExport = (reportType: string) => {
    setExportNotice(`Exported "${reportType} Report" for ${property.name} to CSV successfully.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div>
      {/* Export Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-900)', margin: 0 }}>
            Operational Analytics & Tax Reports
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consolidated reports for {property.name} • October 2026
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => handleExport('Monthly Rent Ledger')} className="btn btn-secondary">
            <FileSpreadsheet size={16} color="#10b981" />
            <span>Export Rent Ledger (Excel)</span>
          </button>
          <button onClick={() => handleExport('Electricity Sub-Meter Audit')} className="btn btn-secondary">
            <Download size={16} />
            <span>Export EB Audit</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <CheckCircle2 size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Analytics Visual Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Occupancy Rate by Room Type */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PieChart size={18} color="var(--primary-600)" />
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', margin: 0 }}>
              Occupancy Breakdown by Sharing Type
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>Single Executive Rooms (100% Full)</span>
                <strong>1 / 1 Occupied</strong>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary-600)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>2-Sharing Rooms (75% Full)</span>
                <strong>3 / 4 Occupied</strong>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--accent-emerald)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <span>3-Sharing Rooms (83% Full)</span>
                <strong>5 / 6 Occupied</strong>
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '83%', height: '100%', background: 'var(--accent-purple)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Due Aging Analysis */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={18} color="var(--accent-rose)" />
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', margin: 0 }}>
              Due Collection Aging Breakdown
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: '#ecfdf5', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46' }}>0 – 5 Days (On-Time)</div>
                <div style={{ fontSize: '0.72rem', color: '#047857' }}>4 Invoices cleared within grace period</div>
              </div>
              <div style={{ fontWeight: 800, color: '#065f46' }}>₹34,894</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: '#fffbeb', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400e' }}>6 – 15 Days (Partial Paid)</div>
                <div style={{ fontSize: '0.72rem', color: '#b45309' }}>1 Invoice balance pending</div>
              </div>
              <div style={{ fontWeight: 800, color: '#92400e' }}>₹4,808</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', background: '#fff1f2', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#991b1b' }}>15+ Days Overdue (Urgent)</div>
                <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>1 Invoice: Vignesh Ramanathan (Room 101)</div>
              </div>
              <div style={{ fontWeight: 800, color: '#991b1b' }}>₹8,323</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
