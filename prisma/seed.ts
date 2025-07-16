import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Find admin user and driver user by email (adjust emails as needed)
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@fleetfusion.test' },
  });
  if (!adminUser) {
    throw new Error(
      'Admin user with email admin@fleetfusion.test not found. Please create it first.'
    );
  }

  const driverUser = await prisma.user.findFirst({
    where: { email: 'driver@fleetfusion.test' },
  });
  if (!driverUser) {
    throw new Error(
      'Driver user with email driver@fleetfusion.test not found. Please create it first.'
    );
  }

  // 1. Find existing test org by orgId (UUID)
  const org = await prisma.organization.findUnique({
    where: { id: 'org_2xvBliaRVTLXpaA6Uc5n66Jsw0u' },
  });
  if (!org) {
    throw new Error(
      'Test org with orgId org_2xvBliaRVTLXpaA6Uc5n66Jsw0u not found. Please create it first.'
    );
  }

  // 2. Generate lots of realistic data for this org (no test users)
  // 3. Create Vehicles (tractor, trailer)
  const tractor = await prisma.vehicle.create({
    data: {
      organizationId: org.id,
      type: 'tractor',
      status: 'active',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2022,
      vin: '1FUJGLDR5CSBM1234',
      licensePlate: 'ABC123',
      licensePlateState: 'CO',
      unitNumber: 'T-001',
      currentOdometer: 120000,
      lastOdometerUpdate: new Date(),
      fuelType: 'diesel',
      lastInspectionDate: new Date('2024-01-15'),
      nextInspectionDue: new Date('2025-01-15'),
      registrationExpiration: new Date('2025-03-01'),
      insuranceExpiration: new Date('2025-04-01'),
      notes: 'Main fleet tractor',
      customFields: {},
    },
  });

  const trailer = await prisma.vehicle.create({
    data: {
      organizationId: org.id,
      type: 'trailer',
      status: 'active',
      make: 'Wabash',
      model: 'Dry Van',
      year: 2021,
      vin: '1JJV532D4KL123456',
      licensePlate: 'TR1234',
      licensePlateState: 'CO',
      unitNumber: 'TR-001',
      currentOdometer: 50000,
      lastOdometerUpdate: new Date(),
      fuelType: null,
      lastInspectionDate: new Date('2024-02-10'),
      nextInspectionDue: new Date('2025-02-10'),
      registrationExpiration: new Date('2025-05-01'),
      insuranceExpiration: new Date('2025-06-01'),
      notes: 'Main trailer',
      customFields: {},
    },
  });

  // 4. Create Driver (linked to driverUser)
  const driver = await prisma.driver.create({
    data: {
      organizationId: org.id,
      userId: driverUser.id,
      employeeId: 'EMP001',
      firstName: 'Charlie',
      lastName: 'Driver',
      email: 'driver@fleetfusion.test',
      phone: '555-555-5678',
      address: '456 Elm St',
      city: 'Denver',
      state: 'CO',
      zip: '80203',
      licenseNumber: 'D1234567',
      licenseState: 'CO',
      licenseClass: 'A',
      licenseExpiration: new Date('2026-05-01'),
      medicalCardExpiration: new Date('2025-12-01'),
      drugTestDate: new Date('2025-01-10'),
      backgroundCheckDate: new Date('2024-12-15'),
      hireDate: new Date('2023-06-01'),
      status: 'active',
      emergencyContact1: 'Jane Doe, 555-555-9999',
      notes: 'No incidents',
      customFields: {},
    },
  });

  // 5. Create Load (assigned to driver, tractor, trailer)
  const load = await prisma.load.create({
    data: {
      organizationId: org.id,
      driver_id: driver.id, // Using driver_id to link to driver
      vehicleId: tractor.id,
      trailerId: trailer.id,
      loadNumber: 'LD-1001',
      referenceNumber: 'REF-202405',
      status: 'in_transit',
      customerName: 'Acme Corp',
      customerContact: 'John Smith',
      customerPhone: '555-555-8888',
      customerEmail: 'john.smith@acme.com',
      originAddress: '789 Warehouse Rd',
      originCity: 'Aurora',
      originState: 'CO',
      originZip: '80012',
      originLat: 39.7294,
      originLng: -104.8319,
      destinationAddress: '321 Distribution Ave',
      destinationCity: 'Boulder',
      destinationState: 'CO',
      destinationZip: '80301',
      destinationLat: 40.015,
      destinationLng: -105.2705,
      rate: 2500.0,
      currency: 'USD',
      scheduledPickupDate: new Date('2025-05-28T08:00:00Z'),
      actualPickupDate: new Date('2025-05-28T08:30:00Z'),
      scheduledDeliveryDate: new Date('2025-05-29T15:00:00Z'),
      actualDeliveryDate: null,
      weight: 40000,
      pieces: 20,
      commodity: 'Electronics',
      hazmat: false,
      estimatedMiles: 50,
      actualMiles: null,
      notes: 'Handle with care',
      instructions: 'Call on arrival',
      customFields: {},
    },
  });

  // 6. Compliance Documents (for driver, vehicle)
  await prisma.complianceDocument.createMany({
    data: [
      {
        organizationId: org.id,
        driver_id: driver.id, // Using driver_id to link to driver
        vehicleId: null,
        type: 'license',
        title: 'CDL License',
        documentNumber: 'D1234567',
        issuingAuthority: 'CO DMV',
        fileUrl: 'https://placehold.co/200x200',
        fileName: 'cdl_license.pdf',
        fileSize: 123456,
        mimeType: 'application/pdf',
        issueDate: new Date('2022-05-01'),
        expirationDate: new Date('2026-05-01'),
        status: 'active',
        isVerified: true,
        verifiedBy: adminUser.id,
        verifiedAt: new Date(),
        notes: 'Verified by admin',
        tags: ['driver', 'license'],
      },
      {
        organizationId: org.id,
        driver_id: null, // No driver for vehicle document
        vehicleId: tractor.id,
        type: 'registration',
        title: 'Tractor Registration',
        documentNumber: 'REG-2024-001',
        issuingAuthority: 'CO DMV',
        fileUrl: 'https://placehold.co/200x200',
        fileName: 'tractor_registration.pdf',
        fileSize: 234567,
        mimeType: 'application/pdf',
        issueDate: new Date('2024-03-01'),
        expirationDate: new Date('2025-03-01'),
        status: 'active',
        isVerified: true,
        verifiedBy: adminUser.id,
        verifiedAt: new Date(),
        notes: 'Verified by admin',
        tags: ['vehicle', 'registration'],
      },
    ],
  });

  // 7. IFTA Report
  await prisma.iftaReport.create({
    data: {
      organizationId: org.id,
      quarter: 1,
      year: 2025,
      status: 'filed',
      totalMiles: 5000,
      totalGallons: 800.123,
      totalTaxOwed: 1200.5,
      totalTaxPaid: 1200.5,
      submittedAt: new Date('2025-04-15'),
      submittedBy: adminUser.id,
      dueDate: new Date('2025-04-30'),
      filedDate: new Date('2025-04-16'),
      reportFileUrl: 'https://placehold.co/200x200',
      supportingDocs: 'https://placehold.co/200x200',
      notes: 'Filed on time',
      calculationData: {},
    },
  });

  // 8. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org.id,
        userId: adminUser.id,
        entityType: 'user',
        entityId: adminUser.id,
        action: 'created',
        changes: { after: { ...adminUser } },
        metadata: { ip: '127.0.0.1', userAgent: 'seed-script' },
        timestamp: new Date(),
      },
      {
        organizationId: org.id,
        userId: adminUser.id,
        entityType: 'vehicle',
        entityId: tractor.id,
        action: 'created',
        changes: { after: { ...tractor } },
        metadata: { ip: '127.0.0.1', userAgent: 'seed-script' },
        timestamp: new Date(),
      },
      {
        organizationId: org.id,
        userId: adminUser.id,
        entityType: 'driver',
        entityId: driver.id,
        action: 'created',
        changes: { after: { ...driver } },
        metadata: { ip: '127.0.0.1', userAgent: 'seed-script' },
        timestamp: new Date(),
      },
    ],
  });

  // 9. Webhook Event
  await prisma.webhookEvent.create({
    data: {
      eventType: 'user.created',
      eventId: 'evt_test_001',
      organizationId: org.id,
      userId: adminUser.id,
      payload: { example: 'payload', user: adminUser.email },
      status: 'processed',
      processingError: null,
      processedAt: new Date(),
      retryCount: 0,
    },
  });

  console.log('Seed complete. Admin user: admin@fleetfusion.test');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
