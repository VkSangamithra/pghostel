import React, { useState } from 'react';
import { Room, Bed, Resident, Language, BedStatus } from '../types';
import { getTranslation } from '../translations';
import { 
  Building2, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Wrench, 
  Clock, 
  Plus, 
  Zap, 
  Search,
  Filter
} from 'lucide-react';

interface BedMatrixProps {
  rooms: Room[];
  beds: Bed[];
  residents: Resident[];
  language: Language;
  onAllocateBed: (bed: Bed) => void;
  onViewResident: (resident: Resident) => void;
}

export const BedMatrix: React.FC<BedMatrixProps> = ({
  rooms,
  beds,
  residents,
  language,
  onAllocateBed,
  onViewResident
}) => {
  const t = getTranslation(language);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<BedStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Count stats
  const totalBedsCount = beds.length;
  const occupiedCount = beds.filter(b => b.status === 'occupied').length;
  const availableCount = beds.filter(b => b.status === 'available').length;
  const noticeCount = beds.filter(b => b.status === 'notice').length;
  const occupancyPercent = totalBedsCount > 0 ? Math.round((occupiedCount / totalBedsCount) * 100) : 0;

  // Filter logic
  const filteredRooms = rooms.filter(r => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    return true;
  });

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'occupied':
        return <span className="badge badge-occupied"><User size={12} /> {t.bedStatus.occupied}</span>;
      case 'available':
        return <span className="badge badge-available"><CheckCircle size={12} /> {t.bedStatus.available}</span>;
      case 'reserved':
        return <span className="badge badge-reserved"><Clock size={12} /> {t.bedStatus.reserved}</span>;
      case 'notice':
        return <span className="badge badge-notice"><AlertCircle size={12} /> {t.bedStatus.notice}</span>;
      case 'maintenance':
        return <span className="badge badge-maintenance"><Wrench size={12} /> {t.bedStatus.maintenance}</span>;
    }
  };

  return (
    <div>
      {/* Top Controls & Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary-600)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Beds</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-900)' }}>{totalBedsCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Across {rooms.length} rooms</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-rose)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Occupied</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{occupiedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{occupancyPercent}% Occupancy Rate</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Available Vacancies</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{availableCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Ready to allocate</div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Upcoming Move-Outs</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{noticeCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On 30-day notice</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Floor Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Floor:</span>
          <button
            onClick={() => setSelectedFloor('all')}
            className={`btn btn-sm ${selectedFloor === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Floors
          </button>
          <button
            onClick={() => setSelectedFloor(1)}
            className={`btn btn-sm ${selectedFloor === 1 ? 'btn-primary' : 'btn-secondary'}`}
          >
            Floor 1
          </button>
          <button
            onClick={() => setSelectedFloor(2)}
            className={`btn btn-sm ${selectedFloor === 2 ? 'btn-primary' : 'btn-secondary'}`}
          >
            Floor 2
          </button>
        </div>

        {/* Status Filter Dropdown */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="form-select"
            style={{ padding: '0.4rem 1.5rem 0.4rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="all">All Bed Statuses</option>
            <option value="available">Available Only (Vacant)</option>
            <option value="occupied">Occupied</option>
            <option value="notice">On Notice</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms and Beds Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredRooms.map(room => {
          const roomBeds = beds.filter(b => b.roomId === room.id);
          const visibleBeds = roomBeds.filter(b => {
            if (statusFilter !== 'all' && b.status !== statusFilter) return false;
            return true;
          });

          if (statusFilter !== 'all' && visibleBeds.length === 0) return null;

          return (
            <div key={room.id} className="card" style={{ padding: '1.25rem', position: 'relative' }}>
              {/* Room Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                      Room {room.roomNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {room.type} Sharing
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Floor {room.floor}
                  </div>
                </div>

                {/* Sub-Meter Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f5f3ff', color: '#7c3aed', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 700 }} title="Sub-Meter attached">
                  <Zap size={13} />
                  <span>{room.subMeterId}</span>
                </div>
              </div>

              {/* Beds Inside Room */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {roomBeds.map(bed => {
                  const resident = residents.find(r => r.id === bed.residentId);

                  return (
                    <div
                      key={bed.id}
                      className={`bed-card status-${bed.status}`}
                      onClick={() => {
                        if (bed.status === 'available') {
                          onAllocateBed(bed);
                        } else if (resident) {
                          onViewResident(resident);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-900)' }}>
                          Bed {bed.bedNumber}
                        </span>
                        {getStatusBadge(bed.status)}
                      </div>

                      {bed.status === 'occupied' && resident && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{resident.name}</span>
                          <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>₹{bed.rentAmount.toLocaleString()}/mo</span>
                        </div>
                      )}

                      {bed.status === 'notice' && resident && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600, color: '#6d28d9' }}>{resident.name} (Leaving Nov 05)</span>
                          <span style={{ fontWeight: 700 }}>₹{bed.rentAmount.toLocaleString()}</span>
                        </div>
                      )}

                      {bed.status === 'available' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                            <Plus size={14} /> Click to Allocate
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>₹{bed.rentAmount.toLocaleString()}/mo</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
