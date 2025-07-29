import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // 1. Organization
  const organization = await prisma.organization.upsert({
    where: { id: "org_fb3de43942a58cace7958646851f" },
    update: {},
    create: {
      id: "org_fb3de43942a58cace7958646851f",
      name: "Digital Herencia Logistics",
      slug: "digital-herencia",
      mcNumber: "888999",
      address: "1500 Logistics Ave",
      city: "El Paso",
      state: "TX",
      zip: "79901",
      phone: "915-555-0100",
      email: "info@digitalherencia.com",
      logoUrl: "https://img.clerk.com/logo-dhl.png",
      subscriptionTier: "growth",
      subscriptionStatus: "active",
      maxUsers: 25,
      billingEmail: "billing@digitalherencia.com",
      settings: {
        fuelUnit: "gallons",
        timezone: "America/Denver",
        dateFormat: "MM/dd/yyyy",
        distanceUnit: "miles"
      },
      isActive: true,
      dotNumber: "4567890",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 2. User (admin)
  const user = await prisma.user.upsert({
    where: { id: "user_2zXX3j7yxxDc2loT3oI7PlpjLMM" },
    update: {},
    create: {
      id: "user_2zXX3j7yxxDc2loT3oI7PlpjLMM",
      organizationId: organization.id,
      email: "digitalherencia@outlook.com",
      firstName: "Ivan",
      lastName: "Roman",
      profileImage: "https://www.gravatar.com/avatar?d=mp",
      role: "admin",
      permissions: [
        "org:sys_domains:read",
        "org:sys_domains:manage",
        "org:sys_profile:manage",
        "org:sys_profile:delete",
        "org:sys_memberships:read",
        "org:sys_memberships:manage",
        "org:admin:access_all_reports",
        "org:admin:configure_company_settings",
        "org:admin:view_audit_logs",
        "org:admin:manage_users_and_roles",
        "org:admin:view_edit_all_loads",
        "org:sys_billing:manage",
        "org:sys_billing:read"
      ],
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingSteps: {},
      onboardingComplete: true,
      preferences: {},
    }
  });

  // 3. OrganizationMembership
  await prisma.organizationMembership.upsert({
    where: { id: "mship_ivan" },
    update: {},
    create: {
      id: "mship_ivan",
      organizationId: organization.id,
      userId: user.id,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 4. Drivers
  const [driverIvan, driverJane] = await Promise.all([
    prisma.driver.upsert({
      where: { id: "drv_ivan" },
      update: {},
      create: {
        id: "drv_ivan",
        organizationId: organization.id,
        userId: user.id,
        employeeId: "E1001",
        firstName: "Ivan",
        lastName: "Roman",
        email: "ivan.roman@digitalherencia.com",
        phone: "915-555-0101",
        status: "active",
        licenseNumber: "TX987654321",
        licenseState: "TX",
        licenseClass: "A",
        hireDate: new Date("2022-01-10"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }),
    prisma.driver.upsert({
      where: { id: "drv_jane" },
      update: {},
      create: {
        id: "drv_jane",
        organizationId: organization.id,
        employeeId: "E1002",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@digitalherencia.com",
        phone: "915-555-0102",
        status: "active",
        licenseNumber: "TX123456789",
        licenseState: "TX",
        licenseClass: "A",
        hireDate: new Date("2022-03-20"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  ]);

  // 5. Vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { id: "veh_freight_1" },
    update: {},
    create: {
      id: "veh_freight_1",
      organizationId: organization.id,
      type: "tractor",
      status: "active",
      make: "Freightliner",
      model: "Cascadia",
      year: 2020,
      vin: "1FUJGLDR2LLL88888",
      licensePlate: "TX1234",
      unitNumber: "TRK-01",
      currentOdometer: 154000,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 6. Trailer
  const trailer = await prisma.trailer.upsert({
    where: { id: "trl_reefer_1" },
    update: {},
    create: {
      id: "trl_reefer_1",
      organizationId: organization.id,
      unitNumber: "TRL-01",
      type: "reefer",
      length: 53,
      make: "Great Dane",
      model: "Everest",
      year: 2021,
      vin: "1GRAA0622BJ888888",
      licensePlate: "TX-TRL1",
      status: "active",
    }
  });

  // 7. Customer
  const customer = await prisma.customer.upsert({
    where: { id: "cust_abc" },
    update: {},
    create: {
      id: "cust_abc",
      organizationId: organization.id,
      name: "ABC Supply",
      contactName: "Alice Buyer",
      email: "abuyer@abcsupply.com",
      phone: "915-555-0111",
      address: "400 Commerce Rd",
      city: "El Paso",
      state: "TX",
      zipCode: "79901",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 8. Load (with all relationships)
  await prisma.load.upsert({
    where: { id: "load1" },
    update: {},
    create: {
      id: "load1",
      organizationId: organization.id,
      driver_id: driverIvan.id,
      vehicleId: vehicle.id,
      trailerId: trailer.id,
      loadNumber: "L-0001",
      referenceNumber: "REF-0001",
      status: "in_transit",
      customerId: customer.id,
      customerName: "ABC Supply",
      customerContact: "Alice Buyer",
      customerPhone: "915-555-0111",
      customerEmail: "abuyer@abcsupply.com",
      originAddress: "400 Commerce Rd",
      originCity: "El Paso",
      originState: "TX",
      originZip: "79901",
      originLat: 31.7619,
      originLng: -106.485,
      destinationAddress: "901 Industrial Park",
      destinationCity: "Phoenix",
      destinationState: "AZ",
      destinationZip: "85001",
      destinationLat: 33.4484,
      destinationLng: -112.074,
      rate: 5400.00,
      currency: "USD",
      scheduledPickupDate: new Date("2024-07-23T09:00:00Z"),
      actualPickupDate: new Date("2024-07-23T09:15:00Z"),
      scheduledDeliveryDate: new Date("2024-07-25T15:00:00Z"),
      weight: 12000,
      pieces: 20,
      commodity: "Fresh Produce",
      hazmat: false,
      estimatedMiles: 430,
      actualMiles: 431,
      notes: "Temp control required, do not delay.",
      instructions: "Dock 3, use side entrance.",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      lastModifiedBy: user.id,
      priority: "high",
      tags: ["perishable", "expedite"]
    }
  });

  // 9. (Optional) Add a LoadStatusEvent for this load
  await prisma.loadStatusEvent.create({
    data: {
      loadId: "load1",
      status: "in_transit",
      timestamp: new Date(),
      source: "dispatcher",
      createdBy: user.id
    }
  });

  // 10. (Optional) Add DispatchActivity log
  await prisma.dispatchActivity.create({
    data: {
      organizationId: organization.id,
      entityType: "Load",
      action: "CREATED",
      entityId: "L-0001",
      userName: "Ivan Roman",
      timestamp: new Date()
    }
  });

  // ──────────────────────────────────────────────────────────
  // Additional seed data to simulate maxed out Growth plan
  // ──────────────────────────────────────────────────────────

  const additionalDrivers: string[] = [];

  for (let i = 3; i <= 25; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const driverUser = await prisma.user.create({
      data: {
        id: faker.string.uuid(),
        organizationId: organization.id,
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        profileImage: "https://www.gravatar.com/avatar?d=mp",
        role: "driver",
        permissions: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    const existingDriver = await prisma.driver.findUnique({ where: { id: 'the-id-you-are-trying-to-insert' } });
      if (existingDriver) {
      console.log(`Driver with id ${existingDriver.id} already exists.`);
      } else {
    
    const driver = await prisma.driver.create({
      data: {
        id: `drv_${i}`,
        organizationId: organization.id,
        userId: driverUser.id,
        employeeId: `E1${String(i).padStart(3, "0")}`,
        firstName,
        lastName,
        email: driverUser.email,
        phone: faker.phone.number("915-555-####"),
        status: "active",
        licenseNumber: `TX${faker.string.numeric(9)}`,
        licenseState: "TX",
        licenseClass: "A",
        hireDate: faker.date.past({ years: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    await prisma.organizationMembership.create({
      data: {
        id: faker.string.uuid(),
        organizationId: organization.id,
        userId: driverUser.id,
        role: 'driver',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    additionalDrivers.push(driver.id);
  }

  const additionalVehicles: string[] = [];
  for (let i = 2; i <= 25; i++) {
    const veh = await prisma.vehicle.create({
      data: {
        id: `veh_freight_${i}`,
        organizationId: organization.id,
        type: "tractor",
        status: "active",
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2018, max: 2024 }),
        vin: faker.vehicle.vin(),
        licensePlate: `TX${faker.string.alphanumeric(5).toUpperCase()}`,
        unitNumber: `TRK-${String(i).padStart(2, "0")}`,
        currentOdometer: faker.number.int({ min: 5000, max: 250000 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    additionalVehicles.push(veh.id);
  }

  const additionalTrailers: string[] = [];
  for (let i = 2; i <= 25; i++) {
    const trl = await prisma.trailer.create({
      data: {
        id: `trl_reefer_${i}`,
        organizationId: organization.id,
        unitNumber: `TRL-${String(i).padStart(2, "0")}`,
        type: "reefer",
        length: 53,
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.number.int({ min: 2018, max: 2024 }),
        vin: faker.vehicle.vin(),
        licensePlate: `TX-T${i}`,
        status: "active",
      }
    });
    additionalTrailers.push(trl.id);
  }

  const customers: string[] = [customer.id];
  for (let i = 2; i <= 10; i++) {
    const cust = await prisma.customer.create({
      data: {
        id: `cust_${i}`,
        organizationId: organization.id,
        name: faker.company.name(),
        contactName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("915-555-####"),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: "TX",
        zipCode: `7990${faker.number.int({ min: 1, max: 9 })}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    customers.push(cust.id);
  }

  for (let i = 2; i <= 50; i++) {
    const driverId = faker.helpers.arrayElement([driverIvan.id, driverJane.id, ...additionalDrivers]);
    const vehicleId = faker.helpers.arrayElement([vehicle.id, ...additionalVehicles]);
    const trailerId = faker.helpers.arrayElement([trailer.id, ...additionalTrailers]);
    const customerId = faker.helpers.arrayElement(customers);
    const cust = await prisma.customer.findUnique({ where: { id: customerId } });

    const load = await prisma.load.create({
      data: {
        id: `load${i}`,
        organizationId: organization.id,
        driver_id: driverId,
        vehicleId,
        trailerId,
        loadNumber: `L-${String(i).padStart(4, "0")}`,
        referenceNumber: `REF-${String(i).padStart(4, "0")}`,
        status: "in_transit",
        customerId,
        customerName: cust?.name ?? "Customer",
        customerContact: cust?.contactName ?? "", 
        customerPhone: cust?.phone ?? "", 
        customerEmail: cust?.email ?? "", 
        originAddress: faker.location.streetAddress(),
        originCity: faker.location.city(),
        originState: "TX",
        originZip: `7990${faker.number.int({ min: 1, max: 9 })}`,
        originLat: Number(faker.location.latitude({ min: 30, max: 32, precision: 0.000001 })),
        originLng: Number(faker.location.longitude({ min: -106, max: -103, precision: 0.000001 })),
        destinationAddress: faker.location.streetAddress(),
        destinationCity: faker.location.city(),
        destinationState: "AZ",
        destinationZip: `8500${faker.number.int({ min: 1, max: 9 })}`,
        destinationLat: Number(faker.location.latitude({ min: 33, max: 35, precision: 0.000001 })),
        destinationLng: Number(faker.location.longitude({ min: -112, max: -110, precision: 0.000001 })),
        rate: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
        currency: "USD",
        scheduledPickupDate: faker.date.future(),
        weight: faker.number.int({ min: 5000, max: 50000 }),
        pieces: faker.number.int({ min: 1, max: 40 }),
        commodity: faker.commerce.product(),
        hazmat: false,
        estimatedMiles: faker.number.int({ min: 100, max: 1500 }),
        actualMiles: faker.number.int({ min: 100, max: 1500 }),
        notes: faker.lorem.sentence(),
        instructions: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user.id,
        lastModifiedBy: user.id,
        priority: "high",
        tags: ["generated"],
      }
    });

    await prisma.loadStatusEvent.create({
      data: {
        loadId: load.id,
        status: "in_transit",
        timestamp: new Date(),
        source: "dispatcher",
        createdBy: user.id,
      }
    });

    await prisma.dispatchActivity.create({
      data: {
        organizationId: organization.id,
        entityType: "Load",
        action: "CREATED",
        entityId: load.loadNumber,
        userName: "Ivan Roman",
        timestamp: new Date(),
      }
    });
  }

  // ------------------------------------------------------------------
  // Additional rows for remaining tables
  // ------------------------------------------------------------------

  // Compliance documents
  await prisma.complianceDocument.createMany({ data: [
    {
      id: 'doc_driver_cdl',
      organizationId: organization.id,
      driver_id: driverIvan.id,
      type: 'license',
      title: 'Commercial Driver License',
      documentNumber: 'CDL123',
      fileUrl: 'https://example.com/ivan-cdl.pdf',
      fileName: 'ivan-cdl.pdf',
      issueDate: new Date('2022-01-01'),
      expirationDate: new Date('2026-01-01'),
      status: 'active',
      isVerified: true,
      verifiedBy: user.id,
      verifiedAt: new Date(),
    },
    {
      id: 'doc_vehicle_reg',
      organizationId: organization.id,
      vehicleId: vehicle.id,
      type: 'registration',
      title: 'Vehicle Registration',
      documentNumber: 'REG789',
      fileUrl: 'https://example.com/truck-reg.pdf',
      fileName: 'truck-reg.pdf',
      issueDate: new Date('2024-01-01'),
      expirationDate: new Date('2025-01-01'),
      status: 'active',
      isVerified: true,
      verifiedBy: user.id,
      verifiedAt: new Date(),
    }
  ]});

  // IFTA Reports and calculations
  const iftaReport1 = await prisma.iftaReport.create({
    data: {
      id: 'ifta2024q1',
      organizationId: organization.id,
      quarter: 1,
      year: 2024,
      status: 'submitted',
      totalMiles: 10000,
      totalGallons: 1500,
      totalTaxOwed: 1200,
      totalTaxPaid: 1100,
      submittedAt: new Date(),
      submittedBy: user.id,
      dueDate: new Date(),
      filedDate: new Date(),
      reportFileUrl: 'https://example.com/ifta-q1.pdf',
      notes: 'Q1 IFTA report',
    }
  });

  const iftaReport2 = await prisma.iftaReport.create({
    data: {
      id: 'ifta2024q2',
      organizationId: organization.id,
      quarter: 2,
      year: 2024,
      status: 'draft',
      totalMiles: 8000,
      totalGallons: 1200,
      totalTaxOwed: 900,
      totalTaxPaid: 0,
      notes: 'Q2 draft',
    }
  });

  await prisma.iftaTaxCalculation.createMany({ data: [
    {
      id: 'calc1',
      organizationId: organization.id,
      reportId: iftaReport1.id,
      jurisdiction: 'TX',
      totalMiles: 4000,
      taxableMiles: 4000,
      fuelPurchased: 600,
      fuelConsumed: 550,
      taxRate: 0.35,
      taxDue: 140,
      taxPaid: 135,
      taxCredits: 0,
      netTaxDue: 5,
      calculatedBy: user.id,
    },
    {
      id: 'calc2',
      organizationId: organization.id,
      reportId: iftaReport1.id,
      jurisdiction: 'NM',
      totalMiles: 6000,
      taxableMiles: 6000,
      fuelPurchased: 900,
      fuelConsumed: 850,
      taxRate: 0.32,
      taxDue: 192,
      taxPaid: 180,
      taxCredits: 0,
      netTaxDue: 12,
      calculatedBy: user.id,
    }
  ]});

  await prisma.iftaPDFGenerationLog.createMany({ data: [
    {
      id: 'pdfgen1',
      organizationId: organization.id,
      userId: user.id,
      reportType: 'ifta',
      parameters: {},
      status: 'completed',
      filePath: '/tmp/ifta1.pdf',
      fileName: 'ifta1.pdf',
      fileSize: 12345,
    },
    {
      id: 'pdfgen2',
      organizationId: organization.id,
      userId: user.id,
      reportType: 'ifta',
      parameters: {},
      status: 'completed',
      filePath: '/tmp/ifta2.pdf',
      fileName: 'ifta2.pdf',
      fileSize: 22345,
    }
  ]});

  await prisma.iftaReportPDF.createMany({ data: [
    {
      id: 'reportpdf1',
      organizationId: organization.id,
      reportId: iftaReport1.id,
      reportType: 'ifta',
      quarter: '1',
      year: 2024,
      fileName: 'ifta-q1.pdf',
      filePath: '/tmp/ifta-q1.pdf',
      fileSize: 12000,
      mimeType: 'application/pdf',
      generatedBy: user.id,
    },
    {
      id: 'reportpdf2',
      organizationId: organization.id,
      reportId: iftaReport2.id,
      reportType: 'ifta',
      quarter: '2',
      year: 2024,
      fileName: 'ifta-q2.pdf',
      filePath: '/tmp/ifta-q2.pdf',
      fileSize: 15000,
      mimeType: 'application/pdf',
      generatedBy: user.id,
    }
  ]});

  // Fuel purchases
  await prisma.iftaFuelPurchase.createMany({ data: [
    {
      id: 'fuel1',
      organizationId: organization.id,
      vehicleId: vehicle.id,
      date: new Date(),
      jurisdiction: 'TX',
      gallons: 150,
      amount: 600,
      vendor: 'Pilot',
      receiptNumber: 'R001',
    },
    {
      id: 'fuel2',
      organizationId: organization.id,
      vehicleId: vehicle.id,
      date: new Date(),
      jurisdiction: 'NM',
      gallons: 175,
      amount: 700,
      vendor: 'Love',
      receiptNumber: 'R002',
    }
  ]});

  // IFTA trips
  await prisma.iftaTrip.createMany({ data: [
    {
      id: 'trip1',
      organizationId: organization.id,
      vehicleId: vehicle.id,
      driverId: driverIvan.id,
      date: new Date('2024-07-20'),
      distance: 300,
      jurisdiction: 'TX',
      startLocation: 'El Paso',
      endLocation: 'Dallas',
      fuelUsed: 30,
    },
    {
      id: 'trip2',
      organizationId: organization.id,
      vehicleId: vehicle.id,
      driverId: driverJane.id,
      date: new Date('2024-07-22'),
      distance: 450,
      jurisdiction: 'NM',
      startLocation: 'El Paso',
      endLocation: 'Albuquerque',
      fuelUsed: 45,
    }
  ]});

  // Compliance alerts
  await prisma.complianceAlert.createMany({ data: [
    {
      id: 'alert1',
      organizationId: organization.id,
      userId: user.id,
      driver_id: driverIvan.id,
      type: 'document_expiration',
      severity: 'high',
      title: 'CDL Expiring',
      message: 'Ivan Roman CDL expires soon',
      entityType: 'Driver',
      entityId: driverIvan.id,
      due_date: new Date('2025-12-31'),
    },
    {
      id: 'alert2',
      organizationId: organization.id,
      userId: user.id,
      vehicleId: vehicle.id,
      type: 'inspection_due',
      severity: 'medium',
      title: 'Annual Inspection',
      message: 'Vehicle inspection due',
      entityType: 'Vehicle',
      entityId: vehicle.id,
      due_date: new Date('2024-12-01'),
    }
  ]});

  // Load documents
  await prisma.loadDocument.createMany({ data: [
    {
      id: 'loaddoc1',
      organizationId: organization.id,
      title: 'BOL',
      fileUrl: 'https://example.com/bol1.pdf',
      fileName: 'bol1.pdf',
      fileSize: 1000,
      mimeType: 'application/pdf',
      loadId: 'load1',
    },
    {
      id: 'loaddoc2',
      organizationId: organization.id,
      title: 'POD',
      fileUrl: 'https://example.com/pod1.pdf',
      fileName: 'pod1.pdf',
      fileSize: 800,
      mimeType: 'application/pdf',
      loadId: 'load1',
    }
  ]});

  // Regulatory audits
  await prisma.regulatoryAudit.createMany({ data: [
    {
      id: 'audit1',
      organizationId: organization.id,
      type: 'DOT',
      status: 'completed',
      notes: 'Annual DOT audit',
    },
    {
      id: 'audit2',
      organizationId: organization.id,
      type: 'Safety',
      status: 'scheduled',
      notes: 'Safety compliance audit',
    }
  ]});

  // Audit logs
  await prisma.auditLog.createMany({ data: [
    {
      id: 'log1',
      organizationId: organization.id,
      userId: user.id,
      entityType: 'Load',
      entityId: 'load1',
      action: 'CREATE',
      changes: {},
    },
    {
      id: 'log2',
      organizationId: organization.id,
      userId: user.id,
      entityType: 'Vehicle',
      entityId: vehicle.id,
      action: 'UPDATE',
      changes: {},
    }
  ]});

  // Notifications
  await prisma.notification.createMany({ data: [
    {
      id: 'note1',
      organizationId: organization.id,
      userId: user.id,
      message: 'Load L-0001 created',
      url: '/loads/load1',
    },
    {
      id: 'note2',
      organizationId: organization.id,
      userId: user.id,
      message: 'Vehicle inspection due soon',
      url: '/vehicles/veh_freight_1',
    }
  ]});

  // Webhook events
  await prisma.webhookEvent.createMany({ data: [
    {
      id: 'wh1',
      eventType: 'load.created',
      eventId: 'evt_1',
      organizationId: organization.id,
      userId: user.id,
      payload: {},
      status: 'processed',
      processedAt: new Date(),
    },
    {
      id: 'wh2',
      eventType: 'vehicle.updated',
      eventId: 'evt_2',
      organizationId: organization.id,
      userId: user.id,
      payload: {},
      status: 'processed',
      processedAt: new Date(),
    }
  ]});

  // Jurisdiction tax rates
  await prisma.jurisdictionTaxRate.createMany({ data: [
    {
      id: 'tax1',
      organizationId: organization.id,
      jurisdiction: 'TX',
      taxRate: 0.35,
      effectiveDate: new Date('2024-01-01'),
      verifiedDate: new Date('2024-01-01'),
    },
    {
      id: 'tax2',
      organizationId: organization.id,
      jurisdiction: 'NM',
      taxRate: 0.32,
      effectiveDate: new Date('2024-01-01'),
      verifiedDate: new Date('2024-01-01'),
    }
  ]});

  // Analytics filter presets
  await prisma.analyticsFilterPreset.createMany({ data: [
    {
      id: 'preset1',
      organizationId: organization.id,
      userId: user.id,
      name: 'Default Loads',
      description: 'Loads created this month',
      filters: { status: 'in_transit' },
      isDefault: true,
    },
    {
      id: 'preset2',
      organizationId: organization.id,
      userId: user.id,
      name: 'Active Vehicles',
      description: 'Only active tractors',
      filters: { type: 'tractor', status: 'active' },
    }
  ]});

  // Organization invitations
  await prisma.organizationInvitation.createMany({ data: [
    {
      id: 'invite1',
      organizationId: organization.id,
      email: 'newdriver1@example.com',
      role: 'driver',
      token: 'tok1',
      status: 'pending',
    },
    {
      id: 'invite2',
      organizationId: organization.id,
      email: 'staff@example.com',
      role: 'dispatcher',
      token: 'tok2',
      status: 'pending',
    }
  ]});

  console.log('Seed data created successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
}
