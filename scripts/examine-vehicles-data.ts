import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function examineVehiclesTable() {
  try {
    console.log('🚛 VEHICLES TABLE ANALYSIS');
    console.log('=' .repeat(50));
    
    // Get table structure info
    console.log('\n📊 VEHICLES COUNT:');
    const totalVehicles = await prisma.vehicle.count();
    console.log(`Total vehicles in database: ${totalVehicles}`);
    
    // Get vehicles by status
    console.log('\n📈 VEHICLES BY STATUS:');
    const vehiclesByStatus = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    vehiclesByStatus.forEach(group => {
      console.log(`${group.status}: ${group._count.status}`);
    });
    
    // Get vehicles by type
    console.log('\n🚚 VEHICLES BY TYPE:');
    const vehiclesByType = await prisma.vehicle.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
    });
    vehiclesByType.forEach(group => {
      console.log(`${group.type}: ${group._count.type}`);
    });
    
    // Get sample vehicles with all key fields
    console.log('\n🔍 SAMPLE VEHICLES DATA:');
    const sampleVehicles = await prisma.vehicle.findMany({
      take: 3,
      select: {
        id: true,
        organizationId: true,
        type: true,
        status: true,
        make: true,
        model: true,
        year: true,
        vin: true,
        licensePlate: true,
        licensePlateState: true,
        unitNumber: true,
        currentOdometer: true,
        fuelType: true,
        lastInspectionDate: true,
        insuranceExpiration: true,
        nextInspectionDue: true,
        registrationExpiration: true,
        grossVehicleWeight: true,
        maxPayload: true,
        engineType: true,
        fuelCapacity: true,
        registrationNumber: true,
        insuranceProvider: true,
        insurancePolicyNumber: true,
        currentLocation: true,
        totalMileage: true,
        nextMaintenanceDate: true,
        nextMaintenanceMileage: true,
        purchaseDate: true,
        purchasePrice: true,
        currentValue: true,
        customFields: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    sampleVehicles.forEach((vehicle, index) => {
      console.log(`\n--- Vehicle ${index + 1} ---`);
      console.log(`ID: ${vehicle.id}`);
      console.log(`Org ID: ${vehicle.organizationId}`);
      console.log(`Type: ${vehicle.type}`);
      console.log(`Status: ${vehicle.status}`);
      console.log(`Make/Model: ${vehicle.make} ${vehicle.model}`);
      console.log(`Year: ${vehicle.year}`);
      console.log(`VIN: ${vehicle.vin}`);
      console.log(`License Plate: ${vehicle.licensePlate} (${vehicle.licensePlateState})`);
      console.log(`Unit Number: ${vehicle.unitNumber}`);
      console.log(`Current Odometer: ${vehicle.currentOdometer}`);
      console.log(`Fuel Type: ${vehicle.fuelType}`);
      console.log(`Insurance Exp: ${vehicle.insuranceExpiration}`);
      console.log(`Next Inspection: ${vehicle.nextInspectionDue}`);
      console.log(`Registration Exp: ${vehicle.registrationExpiration}`);
      console.log(`GVW: ${vehicle.grossVehicleWeight}`);
      console.log(`Max Payload: ${vehicle.maxPayload}`);
      console.log(`Engine Type: ${vehicle.engineType}`);
      console.log(`Fuel Capacity: ${vehicle.fuelCapacity}`);
      console.log(`Insurance Provider: ${vehicle.insuranceProvider}`);
      console.log(`Current Location: ${vehicle.currentLocation}`);
      console.log(`Total Mileage: ${vehicle.totalMileage}`);
      console.log(`Next Maintenance: ${vehicle.nextMaintenanceDate}`);
      console.log(`Purchase Date: ${vehicle.purchaseDate}`);
      console.log(`Purchase Price: ${vehicle.purchasePrice}`);
      console.log(`Current Value: ${vehicle.currentValue}`);
      console.log(`Custom Fields: ${JSON.stringify(vehicle.customFields, null, 2)}`);
    });
    
    // Check for organizations to understand data relationships
    console.log('\n🏢 ORGANIZATIONS WITH VEHICLES:');
    const orgsWithVehicles = await prisma.organization.findMany({
      where: {
        vehicles: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            vehicles: true
          }
        }
      },
      take: 5
    });
    
    orgsWithVehicles.forEach(org => {
      console.log(`${org.name} (${org.slug}): ${org._count.vehicles} vehicles`);
    });
    
    // Check for any compliance or maintenance issues
    console.log('\n⚠️ COMPLIANCE & MAINTENANCE ALERTS:');
    const now = new Date();
    const alertVehicles = await prisma.vehicle.findMany({
      where: {
        OR: [
          { insuranceExpiration: { lte: now } },
          { registrationExpiration: { lte: now } },
          { nextInspectionDue: { lte: now } },
          { nextMaintenanceDate: { lte: now } }
        ]
      },
      select: {
        id: true,
        unitNumber: true,
        make: true,
        model: true,
        insuranceExpiration: true,
        registrationExpiration: true,
        nextInspectionDue: true,
        nextMaintenanceDate: true,
      },
      take: 10
    });
    
    if (alertVehicles.length > 0) {
      console.log(`Found ${alertVehicles.length} vehicles with overdue items:`);
      alertVehicles.forEach(vehicle => {
        console.log(`Unit ${vehicle.unitNumber} (${vehicle.make} ${vehicle.model}):`);
        if (vehicle.insuranceExpiration && vehicle.insuranceExpiration <= now) {
          console.log(`  - Insurance expired: ${vehicle.insuranceExpiration.toDateString()}`);
        }
        if (vehicle.registrationExpiration && vehicle.registrationExpiration <= now) {
          console.log(`  - Registration expired: ${vehicle.registrationExpiration.toDateString()}`);
        }
        if (vehicle.nextInspectionDue && vehicle.nextInspectionDue <= now) {
          console.log(`  - Inspection overdue: ${vehicle.nextInspectionDue.toDateString()}`);
        }
        if (vehicle.nextMaintenanceDate && vehicle.nextMaintenanceDate <= now) {
          console.log(`  - Maintenance overdue: ${vehicle.nextMaintenanceDate.toDateString()}`);
        }
      });
    } else {
      console.log('No vehicles with overdue compliance or maintenance items.');
    }
    
  } catch (error) {
    console.error('Error examining vehicles table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

examineVehiclesTable();
