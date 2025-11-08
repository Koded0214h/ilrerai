import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.patient.createMany({
    data: [
      {
        name: 'John Doe',
        phone: '+2348123456789',
        state: 'anambra',
        missedAppointments: 3,
        visitFrequency: 0.5,
        distance: 15.0,
        language: 'english',
        isLiterate: true
      },
      {
        name: 'Jane Smith',
        phone: '+2348987654321',
        state: 'abia',
        missedAppointments: 1,
        visitFrequency: 2.0,
        distance: 5.0,
        language: 'pidgin',
        isLiterate: false
      }
    ]
  });

  await prisma.pHC.createMany({
    data: [
      {
        name: 'Anambra Central PHC',
        state: 'anambra',
        address: 'Central Awka',
        lat: 6.2209,
        lng: 6.9957,
        beds: 15,
        wards: 4,
        powerSource: 'Grid',
        waterSource: 'Borehole',
        buildingCondition: 'Good',
        staffCount: 12,
        services: 'General Consultation,Vaccination,Maternal Care'
      }
    ]
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());