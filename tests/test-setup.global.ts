import { test as setup } from "@playwright/test"
import { PrismaClient, UserRole } from "@prisma/client" // fixed import

const prisma = new PrismaClient()

/**
 * Global test setup for Playwright E2E tests
 * This runs before all tests and sets up:
 * 1. Test database with seed data
 */
setup("Global test setup", async () => {
    console.log("🚀 Starting global test setup...")

    // Set up test database with seed data
    await setupTestDatabase()

    console.log("✅ Global test setup completed")
})

/**
 * Set up test database with seed data
 */
async function setupTestDatabase() {
    try {
        console.log("📦 Setting up test database...")

        // Clean existing test data
        await prisma.auditLog.deleteMany()
        await prisma.iftaTrip.deleteMany()
        await prisma.load.deleteMany()
        await prisma.vehicle.deleteMany()
        await prisma.driver.deleteMany()
        // await prisma.invitation.deleteMany(); // Fix: Use correct model name for invitation table (likely 'invitation' or 'invitations' is wrong)
        await prisma.user.deleteMany()
        await prisma.organization.deleteMany()

        // Create test organization (orgId only)
        const organization = await prisma.organization.create({
            data: {
                id: "org-1",
                name: "Test Org",
                subscriptionTier: "starter",
                subscriptionStatus: "active",
                maxUsers: 10,
                createdAt: new Date(),
                settings: {
                    timezone: "UTC",
                    dateFormat: "YYYY-MM-DD",
                    distanceUnit: "miles",
                    fuelUnit: "gallons",
                },
                slug: "test-org", // required
            },
        })

        // Create test users with different roles (use id as Clerk userId)
        const users = [
            {
                id: "user_admin123",
                email: "admin@test.com",
                firstName: "Admin",
                lastName: "User",
                role: UserRole.admin,
                organizationId: organization.id,
            },
            {
                id: "user_driver123",
                email: "driver@test.com",
                firstName: "Test",
                lastName: "Driver",
                role: UserRole.driver,
                organizationId: organization.id,
            },
            {
                id: "user_dispatcher123",
                email: "dispatcher@test.com",
                firstName: "Test",
                lastName: "Dispatcher",
                role: UserRole.dispatcher,
                organizationId: organization.id,
            },
        ]

        for (const userData of users) {
            await prisma.user.create({
                data: {
                    ...userData,
                    isActive: true, // FIXED: use camelCase for Prisma
                    createdAt: new Date(), // FIXED: use camelCase for Prisma
                },
            })
        }

        // Create test drivers
        await prisma.driver.create({
            data: {
                createdAt: new Date(),
                id: "driver-1",
                userId: "user_driver123", // Required field linking to User
                email: "driver@example.com",
                firstName: "Driver",
                lastName: "Test",
                organizationId: organization.id,
                licenseNumber: "DL123456789",
                licenseState: "TX",
            },
        })

        // Create test vehicles
        await prisma.vehicle.create({
            data: {
                createdAt: new Date(),
                id: "vehicle-1",
                organizationId: organization.id,
                make: "Freightliner",
                model: "Cascadia",
                year: 2022,
                vin: "1FUJBBCK3NLBR1234",
                type: "TRUCK", // required
                unitNumber: "UNIT001", // required
            },
        })

        

        console.log("✅ Test database setup completed")
    } catch (error) {
        console.error("❌ Failed to setup test database:", error)
        throw error
    }
}

// Global teardown - disconnect Prisma after all tests
setup.afterAll(async () => {
    console.log("🧹 Cleaning up test setup...")
    await prisma.$disconnect()
    console.log("✅ Test cleanup completed")
})
