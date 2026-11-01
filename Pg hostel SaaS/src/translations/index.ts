import { Language } from '../types';

export const translations = {
  en: {
    brandName: "Uyar Technologies",
    tagline: "PG & Hostel Management SaaS",
    headerRoles: {
      owner: "PG Owner Dashboard",
      warden: "Warden / Manager Mobile Portal",
      resident: "Resident Self-Service",
      superadmin: "Super Admin (Uyar Team)",
      public: "Marketing & Public Site"
    },
    nav: {
      overview: "Overview",
      bedMatrix: "Rooms & Beds",
      residents: "Residents",
      billing: "Rent & Invoices",
      ebEngine: "Electricity (EB)",
      deposits: "Deposits & Settlement",
      expenses: "Expenses & P&L",
      reminders: "WhatsApp Reminders",
      reports: "Reports & Analytics",
      settings: "Property Settings"
    },
    metrics: {
      occupancy: "Occupancy Rate",
      totalBeds: "Total Bed Capacity",
      occupiedBeds: "Occupied Beds",
      vacantBeds: "Available Beds",
      monthlyRevenue: "Billed Revenue",
      collectedAmount: "Collected Rent",
      pendingAmount: "Pending Dues",
      ebConsumption: "Total EB Units",
      depositsHeld: "Security Deposits Held"
    },
    actions: {
      addProperty: "Add Property",
      addRoom: "Add Room",
      addResident: "Add Resident",
      selfOnboardLink: "Generate WhatsApp Link",
      generateInvoices: "Run Auto-Billing",
      recordPayment: "Record Payment",
      calculateEB: "Compute EB Split",
      settleMoveOut: "Process Move-Out",
      sendReminders: "Dispatch Reminders",
      exportReport: "Export to Excel/CSV",
      switchLanguage: "தமிழ்",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      close: "Close",
      viewDetails: "View Details",
      downloadReceipt: "Download PDF Receipt",
      approveVisitor: "Approve Visitor",
      rejectVisitor: "Reject"
    },
    bedStatus: {
      available: "Available",
      occupied: "Occupied",
      reserved: "Reserved",
      notice: "On Notice",
      maintenance: "Maintenance"
    },
    invoiceStatus: {
      paid: "Paid",
      pending: "Pending",
      partial: "Partial",
      overdue: "Overdue"
    },
    whatsappTemplates: {
      reminderBefore: "Dear {name}, rent of ₹{amount} for Room {room} is due on {due_date}. Please pay via UPI: {upi_link}. Uyar PG.",
      reminderOverdue: "Urgent: Dear {name}, your rent of ₹{amount} for Room {room} is overdue by {days} days. Please clear dues immediately: {upi_link}.",
      receipt: "Payment Received: Thank you {name}, received ₹{amount} for {month}. Receipt ref: {invoice_no}. - Uyar PG.",
      onboarding: "Welcome {name}! Please complete your quick digital KYC & check-in form here: {onboard_link}"
    }
  },
  ta: {
    brandName: "உயர் டெக்னாலஜிஸ்",
    tagline: "பிஜி & விடுதி மேலாண்மை மென்பொருள்",
    headerRoles: {
      owner: "பிஜி உரிமையாளர் பலகை",
      warden: "வார்டன் / மேலாளர் மொபைல் பலகை",
      resident: "தங்குவோர் போர்டல்",
      superadmin: "சூப்பர் அட்மின் (உயர் அணி)",
      public: "இணையதள முகப்பு & கட்டணங்கள்"
    },
    nav: {
      overview: "கண்ணோட்டம்",
      bedMatrix: "அறைகள் & படுக்கைகள்",
      residents: "தங்குவோர் விபரம்",
      billing: "வாடகை & ரசீதுகள்",
      ebEngine: "மின்சார கட்டணம் (EB)",
      deposits: "முன்பணம் & கணக்கு முடித்தல்",
      expenses: "செலவுகள் & லாப விபரம்",
      reminders: "வாட்ஸ்அப் நினைவூட்டல்",
      reports: "அறிக்கைகள் & பகுப்பாய்வு",
      settings: "விடுதி அமைப்புகள்"
    },
    metrics: {
      occupancy: "நிரம்பல் விகிதம்",
      totalBeds: "மொத்த படுக்கைகள்",
      occupiedBeds: "தங்கியுள்ள படுக்கைகள்",
      vacantBeds: "காலியான படுக்கைகள்",
      monthlyRevenue: "மாதாந்திர வாடகை",
      collectedAmount: "வசூலான வாடகை",
      pendingAmount: "நிலுவைத் தொகை",
      ebConsumption: "மொத்த EB யூனிட்டுகள்",
      depositsHeld: "கையிலுள்ள முன்பணம்"
    },
    actions: {
      addProperty: "புதிய விடுதி சேர்க்க",
      addRoom: "அறை சேர்க்க",
      addResident: "தங்குபவரை சேர்க்க",
      selfOnboardLink: "வாட்ஸ்அப் இணைப்பு உருவாக்க",
      generateInvoices: "பில் தானியங்கி இயக்கம்",
      recordPayment: "பணம் செலுத்தியதை பதிய",
      calculateEB: "EB கணக்கீடு செய்க",
      settleMoveOut: "வெளியேறுதல் கணக்கு முடிக்க",
      sendReminders: "நினைவூட்டல் அனுப்புக",
      exportReport: "எக்செல் ஏற்றுமதி",
      switchLanguage: "English",
      saveChanges: "மாற்றங்களைச் சேமி",
      cancel: "ரத்து செய்",
      close: "மூடுக",
      viewDetails: "விவரம் பார்க்க",
      downloadReceipt: "PDF ரசீது பதிவிறக்க",
      approveVisitor: "பார்வையாளரை அனுமதி",
      rejectVisitor: "நிராகரி"
    },
    bedStatus: {
      available: "காலியாக உள்ளது",
      occupied: "தங்கியுள்ளார்",
      reserved: "முன்பதிவு",
      notice: "வெளியேறுகிறார்",
      maintenance: "பராமரிப்பு"
    },
    invoiceStatus: {
      paid: "செலுத்தப்பட்டது",
      pending: "நிலுவையில்",
      partial: "பகுதித் தொகை",
      overdue: "காலக்கெடு முடிந்தது"
    },
    whatsappTemplates: {
      reminderBefore: "வணக்கம் {name}, அறை எண் {room}-ன் வாடகை ₹{amount} வரும் {due_date}-க்குள் செலுத்த வேண்டும். UPI கட்டண இணைப்பு: {upi_link}. உயர் பிஜி.",
      reminderOverdue: "அவசரம்: வணக்கம் {name}, அறை எண் {room}-ன் வாடகை ₹{amount} செலுத்துவதற்கான காலக்கெடு முடிந்து {days} நாட்கள் ஆகிறது. உடனே செலுத்தவும்: {upi_link}.",
      receipt: "வாடகை பெறப்பட்டது: நன்றி {name}, {month} மாதத்திற்கான வாடகை ₹{amount} பெறப்பட்டது. ரசீது எண்: {invoice_no}. - உயர் பிஜி.",
      onboarding: "வணக்கம் {name}! உங்கள் டிஜிட்டல் ஆவணங்கள் மற்றும் சேர்க்கை படிவத்தை பூர்த்தி செய்ய இந்த இணைப்பை அழுத்தவும்: {onboard_link}"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
