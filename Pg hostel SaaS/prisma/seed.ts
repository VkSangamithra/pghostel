import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StayNest database seeding...');

  // Clean existing records in correct relation order
  await prisma.auditLog.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.securityDeposit.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.tenantProfile.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.staffAssignment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.pGPolicy.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Demo PG Owner
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@staynest.com',
      username: 'suresh_owner',
      password: hashedPassword,
      name: 'Suresh Kumar',
      phone: '9840123456',
      role: 'owner',
      status: 'active'
    }
  });

  console.log(`✓ Created PG Owner: ${owner.name} (${owner.email})`);

  // 2. Create Default PG Policies
  await prisma.pGPolicy.create({
    data: {
      ownerId: owner.id,
      rentDueDate: 5,
      lateFeeAmount: 200,
      noticePeriodDays: 30,
      visitorCurfew: '21:00',
      securityDepositMonths: 2,
      generalRules: 'Smoking and alcohol strictly prohibited. Quiet hours after 10 PM. Visitors allowed only in lobby area.'
    }
  });

  // 3. Create 5 Properties matching User Screenshot
  const propertiesData = [
    {
      name: 'Green Valley PG',
      code: 'GVP-01',
      description: 'Premium executive hostel with modern amenities near IT corridor',
      address: '14, College Road, Tiruchengode',
      city: 'Tiruchengode',
      state: 'Tamil Nadu',
      postalCode: '637211',
      type: 'PG',
      gender: 'Girls',
      totalFloors: 3,
      totalRooms: 40,
      totalBeds: 120,
      occupiedBeds: 102,
      status: 'active',
      contactNumber: '9876543210',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id
    },
    {
      name: 'Sunshine Residency',
      code: 'SSR-02',
      description: 'Comfortable boys PG with high-speed Wi-Fi and 3 times food',
      address: '88, Junction Road, Fairlands',
      city: 'Salem',
      state: 'Tamil Nadu',
      postalCode: '636016',
      type: 'PG',
      gender: 'Boys',
      totalFloors: 2,
      totalRooms: 28,
      totalBeds: 80,
      occupiedBeds: 64,
      status: 'active',
      contactNumber: '8765432109',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id
    },
    {
      name: 'Elite Girls PG',
      code: 'EGP-03',
      description: 'Luxury air-conditioned girls hostel with 24/7 security & biometric access',
      address: '52, Anna Nagar Main Road',
      city: 'Tiruchengode',
      state: 'Tamil Nadu',
      postalCode: '637209',
      type: 'PG',
      gender: 'Girls',
      totalFloors: 3,
      totalRooms: 34,
      totalBeds: 100,
      occupiedBeds: 78,
      status: 'active',
      contactNumber: '9988766554',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id
    },
    {
      name: 'City Comfort PG',
      code: 'CCP-04',
      description: 'Budget-friendly co-living space for working professionals',
      address: '23, Perundurai Road',
      city: 'Erode',
      state: 'Tamil Nadu',
      postalCode: '638011',
      type: 'PG',
      gender: 'Boys',
      totalFloors: 2,
      totalRooms: 22,
      totalBeds: 68,
      occupiedBeds: 48,
      status: 'active',
      contactNumber: '9123456789',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id
    },
    {
      name: 'Lakeview PG',
      code: 'LVP-05',
      description: 'Quiet residential hostel next to scenic lake',
      address: '10, Mohanur Road',
      city: 'Namakkal',
      state: 'Tamil Nadu',
      postalCode: '637001',
      type: 'PG',
      gender: 'Girls',
      totalFloors: 3,
      totalRooms: 30,
      totalBeds: 90,
      occupiedBeds: 70,
      status: 'inactive',
      contactNumber: '8877654321',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      ownerId: owner.id
    }
  ];

  const createdProperties: any[] = [];
  for (const p of propertiesData) {
    const prop = await prisma.property.create({ data: p });
    createdProperties.push(prop);
  }

  const greenValley = createdProperties[0];
  const sunshine = createdProperties[1];
  const eliteGirls = createdProperties[2];
  const cityComfort = createdProperties[3];
  const lakeview = createdProperties[4];

  console.log(`✓ Created 5 PG properties`);

  // 4. Create Staff (Wardens & Accountants)
  const wardensData = [
    { name: 'Lakshmi M', phone: '98765 43210', email: 'lakshmi@gmail.com', propertyId: greenValley.id, joinDate: '12 Jan 2026', status: 'active' },
    { name: 'Ramesh K', phone: '87654 32109', email: 'ramesh@gmail.com', propertyId: sunshine.id, joinDate: '05 Feb 2026', status: 'active' },
    { name: 'Revathi S', phone: '99887 66554', email: 'revathi@gmail.com', propertyId: eliteGirls.id, joinDate: '18 Mar 2026', status: 'active' },
    { name: 'Murugan P', phone: '91234 56789', email: 'murugan@gmail.com', propertyId: cityComfort.id, joinDate: '10 Apr 2026', status: 'inactive' },
    { name: 'Anitha R', phone: '88776 54321', email: 'anitha@gmail.com', propertyId: lakeview.id, joinDate: '22 May 2026', status: 'active' }
  ];

  for (const w of wardensData) {
    const staffUser = await prisma.user.create({
      data: {
        name: w.name,
        email: w.email,
        phone: w.phone.replace(/\s/g, ''),
        role: 'warden',
        status: w.status,
        password: hashedPassword
      }
    });

    await prisma.staffAssignment.create({
      data: {
        userId: staffUser.id,
        propertyId: w.propertyId,
        role: 'warden'
      }
    });
  }

  const accountantsData = [
    { name: 'Priya Financials', phone: '98401 23456', email: 'priya.acc@gmail.com', propertyId: greenValley.id, joinDate: '01 Jan 2026', status: 'active' },
    { name: 'Kannan Accounts', phone: '97890 12345', email: 'kannan.audit@gmail.com', propertyId: sunshine.id, joinDate: '15 Jan 2026', status: 'active' },
    { name: 'Divya Audits', phone: '98765 11223', email: 'divya.audit@gmail.com', propertyId: eliteGirls.id, joinDate: '01 Mar 2026', status: 'active' }
  ];

  for (const a of accountantsData) {
    const staffUser = await prisma.user.create({
      data: {
        name: a.name,
        email: a.email,
        phone: a.phone.replace(/\s/g, ''),
        role: 'accountant',
        status: a.status,
        password: hashedPassword
      }
    });

    await prisma.staffAssignment.create({
      data: {
        userId: staffUser.id,
        propertyId: a.propertyId,
        role: 'accountant'
      }
    });
  }

  console.log(`✓ Created 5 Wardens and 3 Accountants`);

  // 5. Create Floors, Rooms, and Beds for Green Valley PG
  const gvFloor1 = await prisma.floor.create({
    data: {
      floorNumber: 1,
      name: '1st Floor',
      propertyId: greenValley.id
    }
  });

  const gvFloor2 = await prisma.floor.create({
    data: {
      floorNumber: 2,
      name: '2nd Floor',
      propertyId: greenValley.id
    }
  });

  const roomsData = [
    { roomNumber: '101', floorId: gvFloor1.id, propertyId: greenValley.id, roomType: 'Sharing', totalBeds: 3, occupiedBeds: 3, rentPerBed: 5500, status: 'occupied' },
    { roomNumber: '102', floorId: gvFloor1.id, propertyId: greenValley.id, roomType: 'Sharing', totalBeds: 3, occupiedBeds: 2, rentPerBed: 5500, status: 'partial' },
    { roomNumber: '103', floorId: gvFloor1.id, propertyId: greenValley.id, roomType: 'Single', totalBeds: 1, occupiedBeds: 1, rentPerBed: 7000, status: 'occupied' },
    { roomNumber: '104', floorId: gvFloor1.id, propertyId: greenValley.id, roomType: 'Sharing', totalBeds: 3, occupiedBeds: 1, rentPerBed: 5500, status: 'partial' },
    { roomNumber: '105', floorId: gvFloor1.id, propertyId: greenValley.id, roomType: 'Sharing', totalBeds: 3, occupiedBeds: 0, rentPerBed: 5500, status: 'available' },
    { roomNumber: '201', floorId: gvFloor2.id, propertyId: greenValley.id, roomType: 'Sharing', totalBeds: 3, occupiedBeds: 2, rentPerBed: 5500, status: 'partial' },
    { roomNumber: '202', floorId: gvFloor2.id, propertyId: greenValley.id, roomType: 'Single', totalBeds: 1, occupiedBeds: 1, rentPerBed: 7000, status: 'occupied' }
  ];

  const createdRooms: any[] = [];
  for (const r of roomsData) {
    const room = await prisma.room.create({ data: r });
    createdRooms.push(room);

    // Create individual beds for each room
    for (let i = 1; i <= r.totalBeds; i++) {
      await prisma.bed.create({
        data: {
          bedNumber: `Bed ${i}`,
          roomId: room.id,
          propertyId: greenValley.id,
          monthlyRent: r.rentPerBed,
          status: i <= r.occupiedBeds ? 'occupied' : 'available'
        }
      });
    }
  }

  console.log(`✓ Created Floors, Rooms & Beds for Green Valley PG`);

  // Grab bed 1 from Room 101 for Priya S
  const room101Beds = await prisma.bed.findMany({ where: { roomId: createdRooms[0].id } });

  // 6. Create Tenants Matching Screenshot
  const tenants = [
    {
      name: 'Priya S',
      phone: '98765 43210',
      email: 'priya.s@gmail.com',
      propertyId: greenValley.id,
      bedId: room101Beds[0].id,
      checkInDate: '12 Oct 2026',
      status: 'checked_in',
      monthlyRent: 8000,
      depositAmount: 16000
    },
    {
      name: 'Karthik R',
      phone: '87654 32109',
      email: 'karthik.r@gmail.com',
      propertyId: sunshine.id,
      checkInDate: '10 Oct 2026',
      status: 'checked_in',
      monthlyRent: 8500,
      depositAmount: 17000
    },
    {
      name: 'Ananya M',
      phone: '99887 66554',
      email: 'ananya.m@gmail.com',
      propertyId: eliteGirls.id,
      checkInDate: '08 Oct 2026',
      checkOutDate: '28 Oct 2026',
      status: 'checked_out',
      monthlyRent: 8000,
      depositAmount: 16000
    },
    {
      name: 'Vikram S',
      phone: '91234 56789',
      email: 'vikram.s@gmail.com',
      propertyId: cityComfort.id,
      checkInDate: '05 Oct 2026',
      status: 'checked_in',
      monthlyRent: 7500,
      depositAmount: 15000
    },
    {
      name: 'Sneha K',
      phone: '88776 54321',
      email: 'sneha.k@gmail.com',
      propertyId: lakeview.id,
      checkInDate: '01 Oct 2026',
      status: 'checked_in',
      monthlyRent: 6500,
      depositAmount: 13000
    },
    {
      name: 'Arjun M',
      phone: '94433 22110',
      email: 'arjun.m@gmail.com',
      propertyId: eliteGirls.id,
      checkInDate: '01 Oct 2026',
      status: 'checked_in',
      monthlyRent: 8000,
      depositAmount: 16000
    }
  ];

  const createdTenants: any[] = [];
  for (const t of tenants) {
    const tenant = await prisma.tenantProfile.create({ data: t });
    createdTenants.push(tenant);
  }

  console.log(`✓ Created 6 Tenants matching records`);

  // 7. Create Payments matching Screenshot
  const paymentsData = [
    { tenantId: createdTenants[0].id, propertyId: greenValley.id, month: 'Oct 2026', amount: 8000, paidAmount: 8000, paymentDate: '01 Oct 2026', paymentMethod: 'UPI', status: 'paid', referenceNumber: 'UPI/987123984' },
    { tenantId: createdTenants[1].id, propertyId: sunshine.id, month: 'Oct 2026', amount: 8500, paidAmount: 8500, paymentDate: '01 Oct 2026', paymentMethod: 'Bank Transfer', status: 'paid', referenceNumber: 'NEFT/554433221' },
    { tenantId: createdTenants[4].id, propertyId: cityComfort.id, month: 'Oct 2026', amount: 6500, paidAmount: 0, paymentDate: '02 Oct 2026', paymentMethod: 'Cash', status: 'pending', referenceNumber: null },
    { tenantId: createdTenants[5].id, propertyId: eliteGirls.id, month: 'Oct 2026', amount: 8000, paidAmount: 8000, paymentDate: '01 Oct 2026', paymentMethod: 'UPI', status: 'paid', referenceNumber: 'UPI/889911223' }
  ];

  for (const pay of paymentsData) {
    await prisma.payment.create({ data: pay });
  }

  // 8. Create Expenses matching Screenshot (Total: ₹ 85,000)
  const expensesData = [
    { propertyId: greenValley.id, category: 'Electricity', description: 'TNEB Commercial Submeter bill for Oct', amount: 32500, expenseDate: '05 Oct 2026', vendor: 'TNEB Tiruchengode', paymentMethod: 'Net Banking' },
    { propertyId: greenValley.id, category: 'Food & Groceries', description: 'Monthly provisions and vegetables delivery', amount: 28000, expenseDate: '06 Oct 2026', vendor: 'Sri Krishna Traders', paymentMethod: 'UPI' },
    { propertyId: sunshine.id, category: 'Wi-Fi & Internet', description: 'Airtel Broadband 500Mbps Commercial plan', amount: 4500, expenseDate: '08 Oct 2026', vendor: 'Airtel Enterprise', paymentMethod: 'Auto-Debit' },
    { propertyId: eliteGirls.id, category: 'Maintenance', description: 'Lift servicing and RO membrane replacement', amount: 12000, expenseDate: '12 Oct 2026', vendor: 'Aqua Pure Care', paymentMethod: 'Cheque' },
    { propertyId: cityComfort.id, category: 'Cleaning', description: 'Housekeeping supplies and chemicals', amount: 8000, expenseDate: '15 Oct 2026', vendor: 'CleanPro Hygiene', paymentMethod: 'UPI' }
  ];

  for (const exp of expensesData) {
    await prisma.expense.create({ data: exp });
  }

  // 9. Create Complaints matching Screenshot
  const complaintsData = [
    { complaintNumber: 'CMP001', title: 'Water supply issue', description: 'Low pressure in 1st floor bathroom during morning hours', category: 'Plumbing', priority: 'High', status: 'Open', tenantId: createdTenants[0].id, propertyId: greenValley.id, assignedStaff: 'Lakshmi M' },
    { complaintNumber: 'CMP002', title: 'Fan not working', description: 'Ceiling fan makes loud noise and stopped rotating', category: 'Electrical', priority: 'Medium', status: 'In Progress', tenantId: createdTenants[1].id, propertyId: sunshine.id, assignedStaff: 'Ramesh K' },
    { complaintNumber: 'CMP003', title: 'Room cleaning request', description: 'Deep floor cleaning and trash removal needed', category: 'Cleaning', priority: 'Low', status: 'Resolved', tenantId: createdTenants[2].id, propertyId: eliteGirls.id, assignedStaff: 'Revathi S', resolutionNotes: 'Cleaning staff assigned and completed on 23 Oct.' },
    { complaintNumber: 'CMP004', title: 'AC not cooling', description: 'Split AC air temperature not cooling properly in room 301', category: 'Maintenance', priority: 'High', status: 'Open', tenantId: createdTenants[3].id, propertyId: cityComfort.id, assignedStaff: 'Murugan P' },
    { complaintNumber: 'CMP005', title: 'Wi-Fi issue', description: 'Weak Wi-Fi signal in 2nd floor rear corner rooms', category: 'Wi-Fi', priority: 'Medium', status: 'In Progress', tenantId: createdTenants[4].id, propertyId: lakeview.id, assignedStaff: 'Anitha R' }
  ];

  for (const cmp of complaintsData) {
    await prisma.complaint.create({ data: cmp });
  }

  // 10. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: owner.id,
      action: 'System Initialized',
      details: 'StayNest PG Management Database initialized with full demo dataset.'
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
