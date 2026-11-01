import React, { useState } from 'react';
import { Resident, Invoice, NotificationLog, Language } from '../types';
import { getTranslation } from '../translations';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Clock, 
  Languages, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface NotificationCenterProps {
  residents: Resident[];
  invoices: Invoice[];
  notificationLogs: NotificationLog[];
  language: Language;
  onSendNotification: (log: NotificationLog) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  residents,
  invoices,
  notificationLogs,
  language,
  onSendNotification
}) => {
  const t = getTranslation(language);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<'reminderBefore' | 'reminderOverdue' | 'receipt' | 'onboarding'>('reminderOverdue');
  const [templateLang, setTemplateLang] = useState<Language>('ta'); // Default to Tamil to show regional power!
  const [targetResidentId, setTargetResidentId] = useState<string>(residents[2]?.id || residents[0]?.id || '');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const resident = residents.find(r => r.id === targetResidentId) || residents[0];
  const invoice = invoices.find(i => i.residentId === resident?.id) || invoices[0];

  // Dynamic template rendering
  const getRenderedMessage = (key: string, lang: Language) => {
    const rawTemplate = t.whatsappTemplates[key as keyof typeof t.whatsappTemplates];
    const upiLink = `https://uyar.in/pay/${resident?.bedNumber.toLowerCase()}`;
    const onboardLink = `https://uyar.in/onboard/t_${resident?.aadhaarLast4}`;

    return rawTemplate
      .replace('{name}', resident?.name || 'Resident')
      .replace('{room}', resident?.roomNumber || '101')
      .replace('{amount}', invoice?.balanceAmount ? invoice.balanceAmount.toString() : '7500')
      .replace('{due_date}', invoice?.dueDate || '2026-10-05')
      .replace('{days}', '19')
      .replace('{upi_link}', upiLink)
      .replace('{month}', invoice?.billingMonth || 'October 2026')
      .replace('{invoice_no}', invoice?.invoiceNumber || 'UYAR-INV-2026-1001')
      .replace('{onboard_link}', onboardLink);
  };

  const renderedText = getRenderedMessage(selectedTemplateKey, templateLang);

  const handleDispatch = () => {
    const newLog: NotificationLog = {
      id: `log-${Date.now()}`,
      residentName: resident.name,
      phone: resident.phone,
      type: selectedTemplateKey === 'reminderOverdue' || selectedTemplateKey === 'reminderBefore' ? 'rent_reminder' : 'payment_receipt',
      language: templateLang,
      messageText: renderedText,
      sentAt: 'Just Now',
      status: 'delivered'
    };

    onSendNotification(newLog);
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#065f46', margin: 0 }}>
              {language === 'en' ? 'Smart WhatsApp & Multi-Channel Reminder Engine' : 'வாட்ஸ்அப் தானியங்கி நினைவூட்டல் மையம்'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#047857', margin: '0.15rem 0 0 0' }}>
              Official pre-approved Meta WhatsApp templates with auto-suppression upon payment clearance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontWeight: 700, color: '#065f46' }}>Automated Spam Shield Active</span>
        </div>
      </div>

      {/* Simulator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Column: Template Configurator */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--primary-900)' }}>
            Compose WhatsApp Dispatch
          </h4>

          <div className="form-group">
            <label className="form-label">Recipient Resident</label>
            <select 
              className="form-select" 
              value={targetResidentId} 
              onChange={(e) => setTargetResidentId(e.target.value)}
            >
              {residents.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} — Room {r.roomNumber} ({r.phone})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Reminder Cadence</label>
              <select 
                className="form-select" 
                value={selectedTemplateKey} 
                onChange={(e) => setSelectedTemplateKey(e.target.value as any)}
              >
                <option value="reminderBefore">5 Days Before Due (Friendly)</option>
                <option value="reminderOverdue">Overdue Notice (Escalation)</option>
                <option value="receipt">Payment Receipt Confirmation</option>
                <option value="onboarding">Self-Onboarding Invitation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message Language</label>
              <select 
                className="form-select" 
                value={templateLang} 
                onChange={(e) => setTemplateLang(e.target.value as Language)}
              >
                <option value="ta">Tamil (தமிழ் - பரிந்துரைக்கப்படுகிறது)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Smart Auto-suppression alert */}
          {invoice?.status === 'paid' && (
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <AlertTriangle size={16} />
              <span>
                <strong>Auto-Suppression Notice:</strong> {resident.name} has already cleared their bill. Automated payment reminder is suppressed to prevent tenant annoyance.
              </span>
            </div>
          )}

          <button
            onClick={handleDispatch}
            className="btn btn-emerald"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <Send size={16} />
            <span>Simulate WhatsApp Dispatch</span>
          </button>

          {dispatchSuccess && (
            <div style={{ marginTop: '0.75rem', background: '#d1fae5', color: '#065f46', padding: '0.6rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', textAlign: 'center', fontWeight: 600 }}>
              ✓ WhatsApp Message successfully delivered with Meta Transaction Token!
            </div>
          )}
        </div>

        {/* Right Column: Visual WhatsApp Phone Screen Preview */}
        <div style={{ background: '#e5ddd5', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow-md)', border: '4px solid #1f2937' }}>
          {/* Simulated WhatsApp Header */}
          <div style={{ background: '#075e54', color: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075e54', fontWeight: 800, fontSize: '0.85rem' }}>
              UP
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Uyar PG Operations</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Official WhatsApp Business Account</div>
            </div>
          </div>

          {/* Chat Bubble */}
          <div style={{ background: '#ffffff', borderRadius: '8px 8px 8px 0', padding: '0.85rem 1rem', maxWidth: '90%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', position: 'relative' }}>
            <p style={{ fontSize: '0.88rem', color: '#111827', lineHeight: 1.5, margin: 0 }}>
              {renderedText}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem', fontSize: '0.68rem', color: '#6b7280' }}>
              <span>10:45 AM</span>
              <CheckCheck size={13} color="#2563eb" />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.72rem', color: '#4b5563' }}>
            Interactive Preview of Tenant's Mobile Screen
          </div>
        </div>
      </div>

      {/* Dispatch History Audit Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-900)' }}>
          Recent Notification Delivery Logs
        </h4>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Phone Number</th>
                <th>Channel</th>
                <th>Language</th>
                <th>Message Snippet</th>
                <th>Sent Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {notificationLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 700 }}>{log.residentName}</td>
                  <td style={{ fontSize: '0.8rem' }}>{log.phone}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#059669', fontWeight: 600 }}>
                      <Smartphone size={13} /> WhatsApp
                    </span>
                  </td>
                  <td style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.75rem', color: '#6d28d9' }}>
                    {log.language}
                  </td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {log.messageText}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.sentAt}</td>
                  <td>
                    <span className="badge badge-available">
                      <CheckCheck size={12} /> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
