# StayNest — Complete PG & Hostel Management System (PG Owner Module)

StayNest is an enterprise-grade full-stack web application designed for PG (Paying Guest) and hostel owners to manage multiple properties, staff assignments, tenants, room and bed allocations, financial transactions, complaints, policies, and analytical reporting.

---

## 📸 Reference Screens & Modules

The application faithfully implements all **8 core screens** matching the design system and workflows:

1. **Dashboard**
   - 4 Real-time Summary Cards: Total Tenants, Occupied Beds (`X / Y` & Occupancy Rate %), Monthly Revenue, Pending Complaints & Issues.
   - Dual-bar Occupancy Rate chart by property (Occupied vs. Vacant).
   - Monthly Revenue Trend spline curve (Jun to Oct).
   - Recent Tenants table with Check-in Status pills.
   - Recent Complaints table with Priority badges and status indicators.

2. **Staff Management**
   - Separate Tabs: **Wardens** and **Accountants**.
   - Staff records with contact, email, assigned property, join date, status.
   - `+ Add Warden` and `+ Add Accountant` modal forms with validation.
   - Staff activation, deactivation, and property assignment controls.

3. **Tenant Management**
   - Complete tenant directory with room & bed allocation details (`101 - Bed 1`).
   - Check-in and Check-out transaction management.
   - `+ Add Tenant` modal with automated bed allocation and rent setup.
   - Bed release logic upon tenant check-out.

4. **Property Management**
   - Properties table with image thumbnails, location/city, accommodation type (Boys/Girls/Co-living), floor counts, total beds, occupied beds, vacant beds.
   - `+ Add Property` modal to register new PG hostels.
   - Controlled deactivation without breaking historical financial records.

5. **Rooms & Beds Management**
   - Hierarchical property structure: Property → Floor → Room → Bed.
   - Room table with floor, room type (Sharing/Single), bed capacity, occupied, vacant, rent per bed.
   - Interactive **Visual Bed Allocation Grid** showing real-time occupancy and tenant names.
   - `+ Add Room` modal with automated bed slot generation.

6. **Finance Management**
   - 4 Financial KPI Cards: Total Collections, Total Expenses, Total Deposits Held, Outstanding Rent.
   - Sub-tabs: **Collections**, **Expenses**, **Deposits**, **Outstanding**.
   - Collections table with tenant name, property, room, rent month, amount, payment date, status.
   - `+ Add Payment` modal with full payment recording.

7. **Complaints Monitoring**
   - Ticket codes `CMP001`, `CMP002`...
   - Categorization (Plumbing, Electrical, Wi-Fi, Food, Cleaning, Security, Maintenance).
   - Priority levels (Low, Medium, High, Urgent) and Status (Open, In Progress, Resolved).
   - `+ Add Complaint` modal and direct resolution toggle.

8. **Reports & Settings**
   - **Reports Tab**: 12-Month Occupancy Trend bar chart, Total Beds, Occupied, Vacant, and Occupancy Rate % pills.
   - **PG Policies Tab**: Configurable rent due date (day of month), late fee amounts, notice period, curfew timings, code of conduct rules.
   - **Notifications Tab**: WhatsApp, SMS, and email reminder toggle settings.
   - **Owner Profile Tab**: Business profile details and password management.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19 + TypeScript, Vite 8, Tailwind CSS, Lucide React icons, SVG dynamic charts, responsive layout.
- **Backend**: Node.js + Express with TypeScript, REST APIs, JWT authentication, bcrypt password hashing.
- **Database & ORM**: SQLite (`dev.db`) with Prisma ORM 5.22.0.
- **Data Integrity**: Relational foreign keys, cascade rules, transactions for financial entries and bed allocations.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Seed Development Data
```bash
# Push Prisma schema to SQLite database (dev.db)
npm run db:push

# Seed demo PG Owner, 5 properties, staff, rooms, beds, tenants, payments & complaints
npm run db:seed
```

### 3. Run Backend API Server
```bash
npm run server
```
Backend will start on: `http://localhost:3001`

### 4. Run Frontend Web App
```bash
npm run dev
```
Frontend will be available on: `http://localhost:5175` (or `http://localhost:5173`)

---

## 🔑 Demo Credentials

| Role | Username / Email | Password |
|---|---|---|
| **PG Owner** | `owner@staynest.com` or `owner` | `Password@123` or `12345678` |
| **Warden** | `lakshmi@staynest.com` | `Staff@123` |
| **Accountant** | `kavitha@staynest.com` | `Staff@123` |

### Direct Portal Navigation
- **Owner Portal**: `http://localhost:5175/#/owner-portal`
- **Owner Login**: `http://localhost:5175/#/login/owner`
- **Public Website / Landing**: `http://localhost:5175/`

---

## 📡 REST API Reference

### Auth
- `POST /api/auth/login` - Authenticate owner/staff with email & password.
- `GET /api/auth/me` - Retrieve current authenticated profile.
- `POST /api/auth/logout` - Invalidate session.
- `POST /api/auth/change-password` - Update owner password.

### Owner Dashboard
- `GET /api/owner/dashboard/summary` - Aggregate metrics (Beds, Occupancy, Revenue, Pending issues).
- `GET /api/owner/dashboard/occupancy` - Per-property occupancy data.
- `GET /api/owner/dashboard/revenue` - 6-month revenue and expense trend.
- `GET /api/owner/dashboard/recent-activity` - Recent tenants & complaints.

### Properties
- `GET /api/owner/properties` - List properties with room, bed & staff counts.
- `POST /api/owner/properties` - Create new PG hostel property.
- `PATCH /api/owner/properties/:id` - Update property details.
- `DELETE /api/owner/properties/:id` - Deactivate property safely.

### Staff
- `GET /api/owner/staff?role=warden` - List wardens or accountants.
- `POST /api/owner/staff` - Create new staff account & assign property.
- `PATCH /api/owner/staff/:id` - Edit staff details.
- `DELETE /api/owner/staff/:id` - Deactivate staff member.

### Tenants
- `GET /api/owner/tenants` - List tenants with room, bed, and payment statuses.
- `POST /api/owner/tenants` - Register tenant & allocate available bed.
- `POST /api/owner/tenants/:id/check-out` - Record check-out & release bed.

### Rooms & Beds
- `GET /api/owner/rooms?propertyId=:id` - List rooms and beds.
- `POST /api/owner/rooms` - Create room & generate bed slots.

### Finance
- `GET /api/owner/finance/summary` - Collections, expenses, deposits, dues.
- `GET /api/owner/finance/collections` - List completed & pending rent payments.
- `POST /api/owner/finance/payments` - Record new payment transaction.

### Complaints
- `GET /api/owner/complaints` - List complaints.
- `POST /api/owner/complaints` - Log new complaint ticket.
- `PATCH /api/owner/complaints/:code` - Update status (e.g. mark Resolved) or assign staff.

### Policies & Reports
- `GET /api/owner/reports/occupancy` - 12-month occupancy report breakdown.
- `GET /api/owner/policies` - Fetch PG operational policies.
- `PATCH /api/owner/policies` - Update rent due date, curfew, late fee, and rules.
