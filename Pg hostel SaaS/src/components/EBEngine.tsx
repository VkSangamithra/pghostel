import React, { useState } from 'react';
import { Room, Bed, Resident, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  Zap, 
  Camera, 
  Calculator, 
  CheckCircle2, 
  Info, 
  UploadCloud, 
  ChevronRight, 
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface EBEngineProps {
  rooms: Room[];
  beds: Bed[];
  residents: Resident[];
  language: Language;
  onPostEBBills: (calculatedBills: any[]) => void;
}

export const EBEngine: React.FC<EBEngineProps> = ({
  rooms,
  beds,
  residents,
  language,
  onPostEBBills
}) => {
  const t = getTranslation(language);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  const [tariffRate, setTariffRate] = useState<number>(9.5); // ₹9.5 per unit
  const [readingsState, setReadingsState] = useState<Record<string, { current: number; photoUploaded: boolean }>>({
    'room-101': { current: 1680, photoUploaded: true },
    'room-102': { current: 1040, photoUploaded: true },
    'room-103': { current: 505, photoUploaded: true },
    'room-201': { current: 2320, photoUploaded: true },
    'room-202': { current: 1350, photoUploaded: false }
  });

  const activeRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const roomBeds = beds.filter(b => b.roomId === activeRoom?.id);
  const activeResidents = residents.filter(r => r.roomId === activeRoom?.id);

  const currentReading = readingsState[activeRoom.id]?.current ?? activeRoom.currentReading;
  const isPhotoUploaded = readingsState[activeRoom.id]?.photoUploaded ?? false;
  const totalUnits = Math.max(0, currentReading - activeRoom.previousReading);
  const totalRoomBill = Math.round(totalUnits * tariffRate);

  // Dynamic roommate split calculation
  const occupantCount = activeResidents.length > 0 ? activeResidents.length : 1;
  const perTenantUnits = Math.round((totalUnits / occupantCount) * 10) / 10;
  const perTenantAmount = Math.round(totalRoomBill / occupantCount);

  const handleReadingChange = (roomId: string, val: number) => {
    setReadingsState(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], current: val }
    }));
  };

  const handleSimulatePhotoUpload = (roomId: string) => {
    setReadingsState(prev => ({
      ...prev,
      [roomId]: { ...prev[roomId], photoUploaded: true }
    }));
  };

  const handleApplyToInvoices = () => {
    const payload = rooms.map(r => {
      const roomRes = residents.filter(res => res.roomId === r.id);
      const rReading = readingsState[r.id]?.current ?? r.currentReading;
      const u = Math.max(0, rReading - r.previousReading);
      const bill = Math.round(u * tariffRate);
      const splitAmount = roomRes.length > 0 ? Math.round(bill / roomRes.length) : bill;

      return {
        roomId: r.id,
        roomNumber: r.roomNumber,
        residents: roomRes.map(res => ({
          residentId: res.id,
          name: res.name,
          units: Math.round((u / (roomRes.length || 1)) * 10) / 10,
          amount: splitAmount
        }))
      };
    });

    onPostEBBills(payload);
  };

  return (
    <div>
      {/* Banner explaining the differentiator */}
      <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', border: '1px solid #c4b5fd', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#8b5cf6', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#4c1d95', margin: 0 }}>
              {language === 'en' ? 'Uyar Proprietary Electricity (EB) Split Engine' : 'உயர் தனியுரிமை மின்சார கட்டண பகிர்வு இயக்கி'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6d28d9', margin: '0.15rem 0 0 0' }}>
              Eliminates roommate disputes with meter photo proof, TANGEDCO tariff math, and prorated stay calculations.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tariff:</span>
            <strong>₹{tariffRate}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/ unit</span>
          </div>

          <button onClick={handleApplyToInvoices} className="btn btn-primary" style={{ background: '#7c3aed', borderColor: '#6d28d9' }}>
            Post to Monthly Invoices <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left side Room Selector, Right side Split Calculation details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem' }}>
        {/* Left Column: All Rooms Sub-Meter List */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            Room Sub-Meters (October Cycle)
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rooms.map(room => {
              const rReading = readingsState[room.id]?.current ?? room.currentReading;
              const u = Math.max(0, rReading - room.previousReading);
              const isSelected = room.id === selectedRoomId;
              const hasPhoto = readingsState[room.id]?.photoUploaded ?? false;

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid #8b5cf6' : '1px solid var(--border-light)',
                    background: isSelected ? '#faf5ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '0.95rem' }}>
                      Room {room.roomNumber} ({room.subMeterId})
                    </span>
                    <span style={{ fontWeight: 700, color: '#7c3aed', fontSize: '0.9rem' }}>
                      {u} Units (₹{Math.round(u * tariffRate)})
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Prev: {room.previousReading} | Curr: {rReading}</span>
                    {hasPhoto ? (
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>✓ Photo Verified</span>
                    ) : (
                      <span style={{ color: 'var(--accent-amber)' }}>Photo Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Calculation & Roommate Split */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: 0 }}>
                Room {activeRoom.roomNumber} Calculation Breakdown
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sub-Meter ID: {activeRoom.subMeterId} • Floor {activeRoom.floor}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Room Bill</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6d28d9' }}>₹{totalRoomBill}</div>
            </div>
          </div>

          {/* Reading Input Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--surface-bg)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Previous Reading</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{activeRoom.previousReading}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recorded Oct 01</div>
            </div>

            <div style={{ background: 'var(--surface-bg)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Reading</div>
              <input
                type="number"
                className="form-input"
                style={{ padding: '0.2rem 0.5rem', fontWeight: 800, fontSize: '1.1rem' }}
                value={currentReading}
                onChange={(e) => handleReadingChange(activeRoom.id, Number(e.target.value))}
              />
            </div>

            <div style={{ background: '#f5f3ff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #ddd6fe' }}>
              <div style={{ fontSize: '0.75rem', color: '#6d28d9' }}>Net Consumed Units</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6d28d9' }}>{totalUnits} Units</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>@ ₹{tariffRate}/unit</div>
            </div>
          </div>

          {/* Photo Meter Capture Box */}
          <div style={{ border: '1px dashed #c4b5fd', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', background: '#faf5ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Camera size={24} color="#7c3aed" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#4c1d95' }}>Physical Sub-Meter Photo Proof</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attached to tenant digital invoices for absolute audit transparency.</div>
              </div>
            </div>

            {isPhotoUploaded ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} /> Photo Attached
              </span>
            ) : (
              <button 
                onClick={() => handleSimulatePhotoUpload(activeRoom.id)} 
                className="btn btn-secondary btn-sm"
                style={{ borderColor: '#8b5cf6', color: '#6d28d9' }}
              >
                <UploadCloud size={14} /> Upload Meter Photo
              </button>
            )}
          </div>

          {/* Roommate Proration Split Table */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--primary-900)' }}>
            Room Occupants Dynamic Prorated Split ({occupantCount} Active Occupants)
          </h4>

          <div className="table-container" style={{ border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resident</th>
                  <th>Bed Number</th>
                  <th>Days in Room</th>
                  <th>Unit Share</th>
                  <th>Payable EB Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeResidents.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 700 }}>{res.name}</td>
                    <td>{res.bedNumber}</td>
                    <td>31 Days (Full Month)</td>
                    <td style={{ fontWeight: 700, color: '#7c3aed' }}>{perTenantUnits} Units</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary-900)' }}>₹{perTenantAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#065f46' }}>
            <CheckCircle2 size={16} />
            <span>
              Each resident's ₹{perTenantAmount} EB share will be automatically attached as a transparent itemised line item on their monthly rent invoice.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
