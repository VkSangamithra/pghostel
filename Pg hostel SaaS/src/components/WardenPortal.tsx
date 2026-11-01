import React, { useState } from 'react';
import { Property, Room, Resident, Complaint, VisitorPass, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Utensils, 
  Wrench, 
  UserCheck, 
  Camera,
  Search,
  Plus
} from 'lucide-react';

interface WardenPortalProps {
  property: Property;
  rooms: Room[];
  residents: Resident[];
  complaints: Complaint[];
  visitorPasses: VisitorPass[];
  language: Language;
  onResolveComplaint: (id: string) => void;
  onApproveVisitor: (id: string) => void;
}

export const WardenPortal: React.FC<WardenPortalProps> = ({
  property,
  rooms,
  residents,
  complaints,
  visitorPasses,
  language,
  onResolveComplaint,
  onApproveVisitor
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'tasks' | 'complaints' | 'visitors' | 'meals'>('tasks');
  const [cashRecordSuccess, setCashRecordSuccess] = useState<string | null>(null);

  const handleQuickCash = (name: string, room: string, amount: number) => {
    setCashRecordSuccess(`₹${amount} Cash recorded from ${name} (Room ${room}). Receipt issued.`);
    setTimeout(() => setCashRecordSuccess(null), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Mobile-styled Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.15)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Smartphone size={12} /> {language === 'en' ? 'Warden Mobile Console' : 'வார்டன் மொபைல் பலகை'}
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '1.3rem', margin: 0 }}>{property.name}</h2>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Caretaker On Duty: Selvam M. • Today: Oct 24</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-available" style={{ background: '#059669', color: '#ffffff' }}>
              ● Live Shift
            </span>
          </div>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`btn btn-sm ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
          >
            Daily Tasks
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
          >
            Complaints ({complaints.filter(c => c.status !== 'resolved').length})
          </button>
          <button 
            onClick={() => setActiveTab('visitors')}
            className={`btn btn-sm ${activeTab === 'visitors' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
          >
            Visitors ({visitorPasses.filter(v => v.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('meals')}
            className={`btn btn-sm ${activeTab === 'meals' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
          >
            Mess Counts
          </button>
        </div>
      </div>

      {cashRecordSuccess && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
          ✓ {cashRecordSuccess}
        </div>
      )}

      {/* TAB 1: DAILY OPERATIONAL TASKS */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Cash Record Box */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', marginBottom: '0.5rem' }}>
              {language === 'en' ? 'Quick Cash Rent Collection' : 'நேரடி ரொக்க வாடகை வசூல் பதிவு'}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              If a tenant hands you physical cash, tap below to instantly issue a receipt and update the owner dashboard.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Vignesh Ramanathan (Room 101)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>Dues: ₹8,323 Overdue</div>
                </div>
                <button 
                  onClick={() => handleQuickCash('Vignesh Ramanathan', '101', 8323)} 
                  className="btn btn-emerald btn-sm"
                >
                  Collect ₹8,323 Cash
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--surface-bg)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Praveen Raj (Room 201)</div>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>Balance Dues: ₹4,808</div>
                </div>
                <button 
                  onClick={() => handleQuickCash('Praveen Raj', '201', 4808)} 
                  className="btn btn-emerald btn-sm"
                >
                  Collect ₹4,808 Cash
                </button>
              </div>
            </div>
          </div>

          {/* Meter Reading checklist */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', margin: 0 }}>
                {language === 'en' ? 'Sub-Meter Photo Audit' : 'மின்சார மீட்டர் புகைப்பட ஆய்வு'}
              </h4>
              <span className="badge badge-available">4 / 5 Rooms Checked</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Room 202 sub-meter photo is pending. Tap to capture via phone camera.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#92400e' }}>Room 202 (EB-M202)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Previous: 1110 | Current: 1350</div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ borderColor: '#f59e0b', color: '#b45309' }}>
                <Camera size={14} /> Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLAINT TICKETS */}
      {activeTab === 'complaints' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            Maintenance & Service Tickets
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {complaints.map(cmp => (
              <div key={cmp.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', background: cmp.status === 'resolved' ? '#fafdfb' : '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Room {cmp.roomNumber} — {cmp.residentName}</span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', background: '#eff6ff', color: '#1e40af', padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'capitalize', fontWeight: 600 }}>
                      {cmp.category}
                    </span>
                  </div>
                  <div>
                    {cmp.status === 'resolved' ? (
                      <span className="badge badge-available">Resolved</span>
                    ) : (
                      <span className="badge badge-partial">In Progress</span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  "{cmp.description}"
                </p>

                {cmp.status !== 'resolved' && (
                  <button 
                    onClick={() => onResolveComplaint(cmp.id)}
                    className="btn btn-emerald btn-sm"
                  >
                    <CheckCircle2 size={13} /> Mark Resolved & Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VISITOR GATE PASSES */}
      {activeTab === 'visitors' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
            Gate Visitor Approvals
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visitorPasses.map(vis => (
              <div key={vis.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{vis.visitorName} ({vis.relation})</div>
                  {vis.status === 'approved' ? (
                    <span className="badge badge-available">Approved</span>
                  ) : (
                    <span className="badge badge-pending">Pending Approval</span>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Visiting: <strong>{vis.residentName}</strong> in Room {vis.roomNumber} • Phone: {vis.phone}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                  Purpose: "{vis.purpose}"
                </div>

                {vis.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => onApproveVisitor(vis.id)} className="btn btn-emerald btn-sm">
                      <UserCheck size={14} /> Allow Entry
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-rose)' }}>
                      Deny Entry
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MESS / MEAL COUNTS */}
      {activeTab === 'meals' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Utensils size={18} color="#10b981" />
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-900)', margin: 0 }}>
              Today's Mess Meal Forecast
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Breakfast (Idli / Vada)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>34</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>2 Skipped via App</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lunch (Meals)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>28</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>8 In Office</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dinner (Chapati / Rice)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>36</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Full Attendance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
