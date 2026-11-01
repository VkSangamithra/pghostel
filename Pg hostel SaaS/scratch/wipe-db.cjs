const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function wipeDatabase() {
  console.log('🧹 Wiping all default and demo records from the database...');

  try {
    await prisma.auditLog.deleteMany();
    console.log('✓ Cleared AuditLogs');

    await prisma.complaint.deleteMany();
    console.log('✓ Cleared Complaints');

    await prisma.payment.deleteMany();
    console.log('✓ Cleared Payments');

    await prisma.securityDeposit.deleteMany();
    console.log('✓ Cleared SecurityDeposits');

    await prisma.expense.deleteMany();
    console.log('✓ Cleared Expenses');

    await prisma.tenantProfile.deleteMany();
    console.log('✓ Cleared TenantProfiles');

    await prisma.bed.deleteMany();
    console.log('✓ Cleared Beds');

    await prisma.room.deleteMany();
    console.log('✓ Cleared Rooms');

    await prisma.floor.deleteMany();
    console.log('✓ Cleared Floors');

    await prisma.staffAssignment.deleteMany();
    console.log('✓ Cleared StaffAssignments');

    await prisma.property.deleteMany();
    console.log('✓ Cleared Properties');

    await prisma.pGPolicy.deleteMany();
    console.log('✓ Cleared PGPolicies');

    await prisma.user.deleteMany();
    console.log('✓ Cleared Users');

    console.log('✨ All default records have been completely removed! Database is now a clean slate for original data.');
  } catch (error) {
    console.error('Error wiping database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

wipeDatabase();
