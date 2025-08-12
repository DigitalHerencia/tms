import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function createOrganizationWithData() {
  const organization = await prisma.organization.create({
    data: {
      name: faker.company.name(),
      slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
      mcNumber: faker.string.numeric(6),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      logoUrl: faker.image.urlLoremFlickr({ category: 'business' }),
      subscriptionTier: 'starter',
      subscriptionStatus: 'active',
      maxUsers: faker.number.int({ min: 5, max: 25 }),
      billingEmail: faker.internet.email(),
      settings: {
        fuelUnit: 'gallons',
        timezone: 'America/Denver',
        dateFormat: 'MM/dd/yyyy',
        distanceUnit: 'miles',
      },
      isActive: true,
      dotNumber: faker.string.numeric(7),
    },
  });

  const roles = ['admin', 'dispatcher', 'driver'] as const;
  const users = await Promise.all(
    roles.map((role) =>
      prisma.user.create({
        data: {
          organizationId: organization.id,
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          profileImage: faker.image.avatar(),
          role,
        },
      }),
    ),
  );

  await prisma.organizationMembership.createMany({
    data: users.map((u) => ({
      organizationId: organization.id,
      userId: u.id,
      role: u.role,
    })),
  });

  const drivers = await Promise.all(
    Array.from({ length: 3 }).map((_, idx) =>
      prisma.driver.create({
        data: {
          organizationId: organization.id,
          userId: idx === 0 ? users[2].id : undefined,
          employeeId: faker.string.alphanumeric(6),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          status: 'active',
          licenseNumber: faker.string.alphanumeric(10).toUpperCase(),
          licenseState: faker.location.state({ abbreviated: true }),
          licenseClass: 'A',
          hireDate: faker.date.past(),
        },
      }),
    ),
  );

  const vehicles = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.vehicle.create({
        data: {
          organizationId: organization.id,
          type: 'tractor',
          status: 'active',
          make: faker.vehicle.manufacturer(),
          model: faker.vehicle.model(),
          year: faker.number.int({ min: 2000, max: 2024 }),
          vin: faker.vehicle.vin(),
          licensePlate: faker.string.alphanumeric(7).toUpperCase(),
          licensePlateState: faker.location.state({ abbreviated: true }),
          unitNumber: faker.string.alphanumeric(6),
        },
      }),
    ),
  );

  const trailers = await Promise.all(
    Array.from({ length: 2 }).map(() =>
      prisma.trailer.create({
        data: {
          organizationId: organization.id,
          type: 'flatbed',
          status: 'active',
          unitNumber: faker.string.alphanumeric(5).toUpperCase(),
        },
      }),
    ),
  );

  const customers = await Promise.all(
    Array.from({ length: 2 }).map(() =>
      prisma.customer.create({
        data: {
          organizationId: organization.id,
          name: faker.company.name(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state({ abbreviated: true }),
          zip: faker.location.zipCode(),
        },
      }),
    ),
  );

  await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.load.create({
        data: {
          organizationId: organization.id,
          driver_id: faker.helpers.arrayElement(drivers).id,
          vehicleId: faker.helpers.arrayElement(vehicles).id,
          trailerId: faker.helpers.arrayElement(trailers).id,
          customerId: faker.helpers.arrayElement(customers).id,
          loadNumber: faker.string.alphanumeric(8).toUpperCase(),
          status: 'in_transit',
          customerName: faker.company.name(),
          customerContact: faker.person.fullName(),
          customerPhone: faker.phone.number(),
          customerEmail: faker.internet.email(),
          originAddress: faker.location.streetAddress(),
          originCity: faker.location.city(),
          originState: faker.location.state({ abbreviated: true }),
          originZip: faker.location.zipCode(),
          destinationAddress: faker.location.streetAddress(),
          destinationCity: faker.location.city(),
          destinationState: faker.location.state({ abbreviated: true }),
          destinationZip: faker.location.zipCode(),
        },
      }),
    ),
  );

  await prisma.notification.createMany({
    data: Array.from({ length: 3 }).map(() => ({
      organizationId: organization.id,
      userId: faker.helpers.arrayElement(users).id,
      message: faker.lorem.sentence(),
      url: '/',
    })),
  });

  await prisma.analyticsFilterPreset.create({
    data: {
      organizationId: organization.id,
      userId: users[0].id,
      name: 'Active Loads',
      description: 'Loads currently in transit',
      filters: { status: 'in_transit' },
      isDefault: true,
    },
  });

  await prisma.jurisdictionTaxRate.create({
    data: {
      organizationId: organization.id,
      jurisdiction: faker.location.state({ abbreviated: true }),
      taxRate: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      effectiveDate: faker.date.past(),
      verifiedDate: faker.date.recent(),
    },
  });
}

async function main() {
  await prisma.$transaction([
    prisma.document.deleteMany(),
    prisma.load.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.analyticsFilterPreset.deleteMany(),
    prisma.jurisdictionTaxRate.deleteMany(),
    prisma.organizationInvitation.deleteMany(),
    prisma.trailer.deleteMany(),
    prisma.vehicle.deleteMany(),
    prisma.driver.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.organizationMembership.deleteMany(),
    prisma.user.deleteMany(),
    prisma.organization.deleteMany(),
  ]);

  await Promise.all(
    Array.from({ length: 2 }).map(() => createOrganizationWithData()),
  );

  console.log('Database seeded with sample data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
