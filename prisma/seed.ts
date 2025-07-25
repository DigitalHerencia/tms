import { PrismaClient } from '@prisma/client';
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
      subscriptionTier: "enterprise",
      subscriptionStatus: "active",
      maxUsers: 20,
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
