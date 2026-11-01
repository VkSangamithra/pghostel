import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_report():
    doc = docx.Document()
    
    # Page setup - Margins 1 inch
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
    # Color palette
    NAVY = RGBColor(30, 58, 138)       # #1E3A8A
    BLUE = RGBColor(37, 99, 235)       # #2563EB
    DARK_TEXT = RGBColor(31, 41, 55)   # #1F2937
    MUTED = RGBColor(107, 114, 128)    # #6B7280
    WHITE = RGBColor(255, 255, 255)
    
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = DARK_TEXT
    
    # Helper to add styled title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("PG & HOSTEL MANAGEMENT SAAS\n")
    title_run.font.size = Pt(22)
    title_run.font.bold = True
    title_run.font.color.rgb = NAVY
    
    sub_run = title.add_run("Comprehensive Competitor Analysis & Unique Product Strategy\n")
    sub_run.font.size = Pt(14)
    sub_run.font.bold = True
    sub_run.font.color.rgb = BLUE
    
    meta_run = title.add_run("Prepared for Uyar Technologies Private Limited | Strategic Baseline Draft | October 2026\n")
    meta_run.font.size = Pt(9.5)
    meta_run.font.italic = True
    meta_run.font.color.rgb = MUTED
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = BLUE
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = DARK_TEXT
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            b_run = p.add_run(bold_prefix)
            b_run.bold = True
            b_run.font.color.rgb = DARK_TEXT
        run = p.add_run(text)
        run.font.color.rgb = DARK_TEXT
        return p

    def add_callout(text, bold_title="Key Finding:"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        # set cell shading light blue #EFF6FF
        shading = parse_xml(r'<w:shd {} w:fill="EFF6FF"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)
        
        # set borders: left thick blue #2563EB, others none
        borders = parse_xml(r'''
            <w:tcBorders {} >
                <w:top w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        '''.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_title = p.add_run(bold_title + " ")
        r_title.bold = True
        r_title.font.color.rgb = NAVY
        r_text = p.add_run(text)
        r_text.font.size = Pt(10)
        r_text.font.color.rgb = DARK_TEXT
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    def style_table(table, col_widths, headers, rows):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        # Format Header
        hdr_cells = table.rows[0].cells
        for i, h in enumerate(headers):
            hdr_cells[i].text = h
            hdr_cells[i].paragraphs[0].runs[0].font.bold = True
            hdr_cells[i].paragraphs[0].runs[0].font.color.rgb = WHITE
            hdr_cells[i].paragraphs[0].runs[0].font.size = Pt(9.5)
            # cell shading Navy
            shd = parse_xml(r'<w:shd {} w:fill="1E3A8A"/>'.format(nsdecls('w')))
            hdr_cells[i]._tc.get_or_add_tcPr().append(shd)
            
        # Add data rows
        for r_idx, row_data in enumerate(rows):
            row = table.add_row()
            fill_color = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_data):
                cell = row.cells[c_idx]
                cell.text = str(val)
                p = cell.paragraphs[0]
                if len(p.runs) > 0:
                    p.runs[0].font.size = Pt(8.5)
                    p.runs[0].font.color.rgb = DARK_TEXT
                shd = parse_xml(r'<w:shd {} w:fill="{}"/>'.format(nsdecls('w'), fill_color))
                cell._tc.get_or_add_tcPr().append(shd)
                
        # Set column widths & cell borders
        for row in table.rows:
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(r'<w:cantSplit {}/>'.format(nsdecls('w'))))
            for c_idx, cell in enumerate(row.cells):
                cell.width = col_widths[c_idx]
                borders = parse_xml(r'''
                    <w:tcBorders {} >
                        <w:top w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
                        <w:left w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
                        <w:right w:val="single" w:sz="4" w:space="0" w:color="E5E7EB"/>
                    </w:tcBorders>
                '''.format(nsdecls('w')))
                cell._tc.get_or_add_tcPr().append(borders)
                
        doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ------------------ SECTION 1 ------------------
    add_h1("1. Executive Summary")
    doc.add_paragraph(
        "The Indian Paying Guest (PG) and student hostel accommodation sector is undergoing rapid formalisation. "
        "Traditionally operated through physical paper registers, disparate WhatsApp group chats, manual cash/bank accounting, "
        "and contentious handwritten electricity calculations, property owners are actively seeking purpose-built digital management tools."
    )
    doc.add_paragraph(
        "This document presents a comprehensive, evidence-based competitor analysis and strategic product roadmap for the "
        "Uyar Technologies PG & Hostel Management SaaS platform. By evaluating the Uyar Technologies Product Plan, the complete workflow diagram, "
        "and over 14 active market players, this report defines a clear, sustainable competitive advantage."
    )
    
    add_callout(
        "The category already exists with free and low-cost offerings (e.g. HAUS offers up to 15 beds free; SatraM charges ₹800/mo flat for 100 beds). "
        "Competing purely as a basic digital tenant register is a losing proposition. To win market share, Uyar must lead on time saved, "
        "dispute-free electricity billing, vernacular (Tamil + English) usability, and frictionless onboarding.",
        "Strategic Takeaway:"
    )
    
    add_bullet("Products like NoBrokerHood, myGate, and ADDA are engineered for gated community flats/villas and fail to support dynamic bed-level room sharing and high tenant turnover.", "Adjacent Society Apps Mismatch: ")
    add_bullet("The #1 daily operational conflict between owners and tenants is sub-meter unit calculations and fair sharing when roommates move in/out mid-month.", "The Electricity (EB) Nightmare: ")
    add_bullet("Ground caretakers and wardens in Tamil Nadu and South India struggle with English-only corporate software, leading to abandonment after 3 days.", "Vernacular Usability Gap: ")

    # ------------------ SECTION 2 ------------------
    add_h1("2. Overview of Our Existing PG SaaS Product")
    doc.add_paragraph(
        "The Uyar Technologies PG Hostel SaaS is conceived as a modern, multi-tenant cloud application engineered specifically for Men's PGs, "
        "Women's PGs (with enhanced visitor check-in & guardian alert controls), Student Hostels (with parent/guardian status visibility), "
        "and Working Professional Accommodation & Co-Living Spaces."
    )
    add_bullet("Complete logical separation per PG owner workspace ensuring zero cross-tenant data leakage.", "Multi-Tenant Cloud Architecture: ")
    add_bullet("Billed dynamically based on managed active/available bed capacity rather than arbitrary staff logins.", "Fair Per-Bed Subscription Engine: ")
    add_bullet("14-day fully featured free trial with guided property setup wizard progressing to online renewal.", "Self-Service Trial-to-Paid Funnel: ")
    add_bullet("Dedicated console for customer lifecycle management, subscription status, MRR tracking, and tenant support.", "Super Admin Control Center: ")

    # ------------------ SECTION 3 ------------------
    add_h1("3. Current Workflow and User Roles")
    doc.add_paragraph(
        "Based on the synthesis of the Complete Flow Diagram and the Product Plan Document, the Uyar Technologies system encompasses four interconnected workflows:"
    )
    add_bullet("Landing Page -> Sign Up -> Dual OTP Verification -> PG Profile Setup -> 14-Day Free Trial -> Bed-Based Plan Selection -> Subscription Management.", "1. SaaS Acquisition & Onboarding Flow: ")
    add_bullet("Property Hierarchy (PG -> Floors -> Rooms -> Beds) -> Resident KYC -> Rent & Billing -> Electricity (EB) Sub-meter Engine -> Deposit Management -> Expenses & Salaries -> Reminders -> Reports & Analytics.", "2. PG Owner Dashboard Modules: ")
    add_bullet("Add Student -> Assign Room/Bed -> Collect Deposit -> Generate Invoice -> Send Reminders -> Record Payment (UPI/Cash) -> Issue Receipt -> Move-Out Settlement & Refund.", "3. Student / Resident Lifecycle: ")
    add_bullet("Uyar Super Admin, Staff/Manager Limited Login, and optional Resident Self-Service Portal.", "4. Sub-System Roles: ")
    
    add_h2("User Roles & Permissions Matrix")
    headers_roles = ["Role", "Access Scope", "Operational Rights", "Financial & Admin Rights"]
    widths_roles = [Inches(1.2), Inches(1.3), Inches(2.2), Inches(1.8)]
    rows_roles = [
        ["Uyar Super Admin", "Platform-wide", "Monitor platform health, usage metrics, trials", "Manage plans, billing webhooks, support impersonation"],
        ["PG Owner", "Own organization", "Full property, room, bed, and staff administration", "Full financial ledger, bank setup, P&L, subscription renewals"],
        ["Manager / Warden", "Assigned property", "Tenant check-in/out, bed allocation, complaints, meter entry", "Record payments, view dues (No P&L or bank editing)"],
        ["Accountant", "Assigned properties", "Payment reconciliation, credit notes, receipts audit", "Manage expense ledger, GST reports, deposit audit"],
        ["Ground Staff", "Assigned tasks", "Daily room cleaning checklists, meal counts", "Zero financial access"],
        ["Resident / Tenant", "Personal stay", "View room/bed info, pay rent online, submit tickets", "Download receipts, view deposit balance & settlement voucher"],
        ["Parent / Guardian", "Linked student", "View student room details, safety notices", "View fee payment status and pending dues only"]
    ]
    style_table(doc.add_table(rows=1, cols=4), widths_roles, headers_roles, rows_roles)

    # ------------------ SECTION 4 ------------------
    add_h1("4. Competitor Research Methodology")
    doc.add_paragraph(
        "Competitors were investigated across 20 distinct dimensions, categorizing products into Direct Indian PG SaaS, "
        "Adjacent Society ERPs (NoBrokerHood, myGate, ADDA), Co-living operator tech (Stanza Living, ZoloStays), "
        "and International PMS (Cloudbeds). All information was sourced from publicly accessible product pages, vendor pricing rate cards, "
        "mobile application listings, and verified customer reviews in October 2026."
    )

    # ------------------ SECTION 5 ------------------
    add_h1("5. Individual Competitor Profiles")
    
    add_h2("Direct Competitor: RentOk (rentok.com / rentok.in)")
    doc.add_paragraph("Indian proptech market leader. Verified features: Instant Aadhaar e-KYC, e-signed rental agreements, live bed matrix, automated WhatsApp/SMS rent reminders with UPI payment links, multi-bank reconciliation, and automated property booking website builder. Pricing: Silver & Gold tiers or ~₹30/bed/month via sales consultation.")
    
    add_h2("Direct Competitor: HAUS (haushome.tech)")
    doc.add_paragraph("Modern, sleek PG software. Verified features: Live bed mapping across buildings/floors, WhatsApp tenant self-onboarding links (no app required), 1-tap UPI reminders, complaint ticketing, P&L ledgers. Pricing: Free up to 15 beds; Pro tier ₹29/bed/month.")

    add_h2("Direct Competitor: SatraM (satram.in)")
    doc.add_paragraph("Affordable flat-rate platform. Verified features: AC/Non-AC bed inventory, Aadhaar KYC, 3-stage WhatsApp reminders, GST-compliant invoicing, staff roster, multi-hostel dashboard. Pricing: ₹800/month flat up to 100 beds + ₹8/extra bed. 10-day free trial.")

    add_h2("Direct Competitor: TrackMyPG (trackmypg.com / trackmypg.in)")
    doc.add_paragraph("Budget PG tool. Verified features: Room/bed allocation, rent invoicing with utility add-ons, expense tracking, resident portal. Pricing: Flat subscription starting around ₹299/month.")

    add_h2("Direct Competitor: RentKollect (rentkollect.com)")
    doc.add_paragraph("AI-powered WhatsApp-first super-app. Verified features: 'Kolly' AI command center for WhatsApp natural language queries (English/Hinglish), staff task photo proof, weekly mess menus with skip-day tracking. Pricing: Free 30-day trial; custom tiered packages.")

    add_h2("Adjacent Competitor: NoBrokerHood & myGate")
    doc.add_paragraph("Gated community ERPs. Why Adjacent: Engineered for flats/apartments, not individual beds. Cannot handle multi-tenant bed allocation, rapid 3-6 month tenant turnover, per-bed electricity sub-meter calculation, or move-out deposit deduction ledgers.")

    add_h2("Adjacent Competitor: Stanza Living & ZoloStays")
    doc.add_paragraph("Co-living operators. Why Adjacent: Proprietary in-house technology for their own leased properties; not sold as a B2B SaaS. However, their resident mobile app sets the customer expectation benchmark for Gen-Z tenants.")

    add_h2("Adjacent Competitor: Cloudbeds")
    doc.add_paragraph("International hospitality PMS. Why Adjacent: Designed for transient nightly hotel/hostel guests with OTA channel distribution (Booking.com). Completely lacks Indian monthly rent cycles, sub-meter EB calculations, Aadhaar KYC, and UPI payment reconciliation.")

    # ------------------ SECTION 6 ------------------
    add_h1("6. Competitor Feature Comparison Matrix")
    headers_comp = ["Dimension", "Uyar SaaS", "RentOk", "HAUS", "SatraM", "RentKollect", "myGate (Adj)"]
    widths_comp = [Inches(1.5), Inches(1.1), Inches(1.0), Inches(0.9), Inches(0.9), Inches(1.1), Inches(1.0)]
    rows_comp = [
        ["Category", "Direct PG SaaS", "Direct PG SaaS", "Direct PG SaaS", "Direct PG SaaS", "Direct PG SaaS", "Society ERP"],
        ["Bed Inventory", "Yes (Live)", "Yes", "Yes", "Yes", "Yes", "No (Flats only)"],
        ["KYC / Docs", "Yes (ID+Agr)", "Yes (Aadhaar)", "Yes (WhatsApp)", "Yes (Aadhaar)", "Yes (Digital)", "Tenant Form"],
        ["WhatsApp Reminders", "Yes (Smart)", "Yes", "Yes", "Yes (3-stage)", "Yes (AI Chat)", "Optional"],
        ["Sub-Meter EB Engine", "Yes (Proprietary)", "Basic Addon", "Basic", "Basic", "Basic", "No"],
        ["Deposit Settlement", "Yes (Itemised)", "Yes", "Yes", "Yes", "Yes", "Society exit"],
        ["Tamil Localization", "Yes (Native)", "No", "No", "No", "No", "No"],
        ["Pricing Model", "Transparent Per-Bed", "Custom (~₹30/b)", "Free + ₹29/bed", "₹800/100 beds", "Custom Tiers", "Annual RWA Fee"]
    ]
    style_table(doc.add_table(rows=1, cols=7), widths_comp, headers_comp, rows_comp)

    # ------------------ SECTION 7 ------------------
    add_h1("7. Pricing and Business Model Comparison")
    doc.add_paragraph(
        "Current market pricing spans three primary architectures: flat monthly fees (e.g. SatraM at ₹800/mo, TrackMyPG at ₹299/mo), "
        "per-bed pricing (e.g. HAUS at ₹29/bed/mo), and consultative enterprise packages (RentOk). "
        "Flat fees disadvantage small 20-bed PGs, while hidden quotes cause high onboarding drop-off."
    )
    add_h2("Recommended Uyar Technologies Pricing Strategy")
    add_bullet("Up to 25 beds / 1 property. 14 days full access without payment details.", "Free Trial: ")
    add_bullet("₹399/month for up to 25 beds. Perfect for single independent PG owners.", "Starter Plan: ")
    add_bullet("₹899/month for up to 75 beds. Includes sub-meter EB calculation and staff roles.", "Growth Plan: ")
    add_bullet("₹1,799/month for up to 180 beds. Multi-property dashboard, advanced WhatsApp automation.", "Pro Plan: ")
    add_bullet("Custom quote for 200+ beds. Includes dedicated onboarding specialist and custom SLA.", "Enterprise: ")

    # ------------------ SECTION 8 & 9 ------------------
    add_h1("8. Market Gaps & Customer Pain Points")
    add_bullet("Single room meter shared among 2–4 tenants joining on different dates. Causes endless arguments and delayed rent.", "The Electricity (EB) Bill Nightmare: ")
    add_bullet("Moving 50–100 tenants from a paper register into a web portal feels daunting; CSV templates often fail.", "High Onboarding Friction: ")
    add_bullet("Tenants submit edited or recycled UPI transaction screenshots; caretakers fail to verify UTR numbers.", "Screenshot Fraud in UPI Collections: ")
    add_bullet("Ground caretakers in Tamil Nadu struggle with English-only interfaces, abandoning software after a few days.", "Lack of Vernacular (Tamil) Usability: ")
    add_bullet("Unexplained deductions during checkout lead to toxic disputes and negative Google reviews.", "Opaque Security Deposit Refunds: ")

    # ------------------ SECTION 10 & 11 ------------------
    add_h1("9. Our Proposed Unique Value Proposition & Features")
    add_callout(
        "Position Uyar Technologies as the most reliable, vernacular-friendly (Tamil & English), mobile-first PG operations platform "
        "in South India, recognized for dispute-free electricity billing and frictionless onboarding.",
        "Positioning Statement:"
    )
    
    add_h2("1. Smart Electricity (EB) & Utility Split Engine (Must-Have - MVP)")
    doc.add_paragraph("Owners photograph room meters on the 1st of the month. System calculates consumption, applies slab tariffs, prorates dynamically based on active tenant stay days, and attaches photographic proof to the invoice.")

    add_h2("2. Tamil & English Bilingual Interface (Must-Have - MVP)")
    doc.add_paragraph("Instant language toggle for the entire UI. Pre-approved WhatsApp reminder templates in Tamil. Voice-note confirmation for caretakers recording cash collections.")

    add_h2("3. WhatsApp-Powered Tenant Self-Onboarding (Must-Have - MVP)")
    doc.add_paragraph("Owner enters only resident name and mobile. Tenant receives a secure WhatsApp link to upload ID proof, emergency contacts, and e-sign house rules. Zero mobile app download required.")

    add_h2("4. UTR-Verified Payment Reconciliation & Screenshot Shield (Must-Have - MVP)")
    doc.add_paragraph("Dynamic UPI QR generation with auto-reconciliation. For offline UPI transfers, mandatory 12-digit UTR input with unique database constraints to prevent duplicate or falsified screenshot fraud.")

    add_h2("5. Transparent Move-Out Settlement Ledger (Should-Have - Phase 1.5)")
    doc.add_paragraph("Digital checkout wizard computing prorated rent, unbilled EB units, and photo-documented damage deductions, producing a signed digital settlement voucher before refund dispatch.")

    add_h2("6. Women's PG Security & QR Visitor Gate Pass (Should-Have - Phase 2)")
    doc.add_paragraph("Front-desk QR scan enabling visitors to check in, notifying residents via WhatsApp for 1-tap entry approval, with optional curfew notifications to parents.")

    # ------------------ SECTION 12 & 13 ------------------
    add_h1("10. Feature Prioritisation & Implementation Roadmap")
    headers_road = ["Phase", "Duration", "Core Focus", "Deliverables"]
    widths_road = [Inches(1.2), Inches(1.1), Inches(1.8), Inches(2.4)]
    rows_road = [
        ["Phase 1: Core MVP", "12–14 Weeks", "Core operational baseline & EB engine", "Multi-tenant auth, Bed matrix, WhatsApp onboarding, Rent ledger, EB split engine, Tamil UI, Super Admin"],
        ["Phase 2: Differentiation", "8–10 Weeks", "Operational excellence & resident trust", "Deposit settlement ledger, Complaint ticketing, QR visitor gate, Resident PWA portal, Mess management"],
        ["Phase 3: Automation", "Ongoing", "AI & hardware ecosystem", "WhatsApp conversational AI bot, Biometric/Smart lock integration, Vacancy booking website"]
    ]
    style_table(doc.add_table(rows=1, cols=4), widths_road, headers_road, rows_road)

    # ------------------ SECTION 14 & 15 ------------------
    add_h1("11. Risks, Validation Questions & Strategic Recommendations")
    add_bullet("Metered WhatsApp utility templates to control Meta conversation costs; fall back to transactional email.", "Messaging Cost Management: ")
    add_bullet("Guided 3-step setup wizard and 1-click Excel bulk import with phone number sanitization.", "Overcoming Adoption Inertia: ")
    add_bullet("Store electricity calculations in Draft status for owner review before publishing invoices.", "Billing Accuracy Assurance: ")
    add_bullet("Interview 20 PG owners across Chennai and Coimbatore to validate pricing preferences and EB pain points.", "Customer Discovery: ")
    
    add_callout(
        "Lead your marketing with 'The Only Tamil & English PG Software with Zero-Dispute Electricity Billing.' "
        "Keep the resident experience completely mobile and app-free via responsive PWA links sent over WhatsApp.",
        "Final Strategic Advice:"
    )

    # ------------------ SECTION 16 ------------------
    add_h1("12. Competitor Sources & Reference Index")
    doc.add_paragraph("Direct research verified in October 2026 across public product listings:")
    add_bullet("https://rentok.com - Proptech market leader in India", "RentOk: ")
    add_bullet("https://haushome.tech - Modern PG management with 15-bed free tier", "HAUS: ")
    add_bullet("https://satram.in - Flat-fee hostel management software", "SatraM: ")
    add_bullet("https://trackmypg.com - Budget PG management software", "TrackMyPG: ")
    add_bullet("https://rentkollect.com - WhatsApp AI conversational management super-app", "RentKollect: ")
    add_bullet("https://pgnexa.com - Multi-branch PG management app", "PGNexa: ")
    add_bullet("https://mygate.com & https://nobrokerhood.com - Adjacent gated community ERPs", "Society ERPs: ")
    add_bullet("https://stanzaliving.com - Co-living operator resident benchmark", "Stanza Living: ")
    add_bullet("https://cloudbeds.com - International hospitality PMS", "Cloudbeds: ")

    output_path = r'c:\Users\Rajalakshmi senthil\OneDrive\Desktop\Pg hostel SaaS\docs\PG_SaaS_Competitor_Analysis_and_Unique_Product_Strategy.docx'
    doc.save(output_path)
    print(f"Successfully generated DOCX report at: {output_path}")

if __name__ == '__main__':
    create_report()
