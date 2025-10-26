import { PrismaClient, Role, ShiftType, LocationType, LocationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  await prisma.user.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.division.deleteMany();

  const divisionsData = [
    {
      name: "Lintasarta",
      location: "Jakarta",
      type: LocationType.WFO,
      status: LocationStatus.ACTIVE,
      longitude: 106.8272,
      latitude: -6.1754,
      radius: 100,
      startTime: 8 * 60,
      endTime: 17 * 60,
    },
    {
      name: "Warung Mursidi",
      location: "Kp. Siluman, Mangunjaya",
      type: LocationType.WFA,
      status: LocationStatus.INACTIVE,
      longitude: 107.6191,
      latitude: -6.9175,
      radius: 100,
      startTime: 8 * 60,
      endTime: 17 * 60,
    },
    {
      name: "Rumah",
      location: "Rumah",
      type: LocationType.WFA,
      status: LocationStatus.INACTIVE,
      longitude: 112.7508,
      latitude: -7.2575,
      radius: 100,
      startTime: 8 * 60,
      endTime: 17 * 60,
    },
  ];

  const divisions = [];
  for (const data of divisionsData) {
    const division = await prisma.division.create({ data });
    divisions.push(division);
  }

  const shiftTemplates = [
    { type: ShiftType.MORNING, baseName: "Pagi", startTime: 8 * 60, endTime: 16 * 60 },
    { type: ShiftType.AFTERNOON, baseName: "Sore", startTime: 16 * 60, endTime: 24 * 60 },
    { type: ShiftType.EVENING, baseName: "Malem", startTime: 0, endTime: 8 * 60 },
  ]

  const allShifts = []

  for (const division of divisions) {
    for (const template of shiftTemplates) {
      const shift = await prisma.shift.create({
        data: {
          type: template.type,
          name: `${template.baseName} - (${division.name})`,
          startTime: template.startTime,
          endTime: template.endTime,
          divisionId: division.id,
          isActive: true,
        },
      })
      allShifts.push(shift)
    }
  }

  const usersData = [
    { name: "Mikasa", email: "mikasa@g.com", password: "mikasa123", role: Role.ADMIN },
    { name: "Dirman", email: "dirman@g.com", password: "dirman123", role: Role.EMPLOYEE },
    { name: "Buyung", email: "buyung@g.com", password: "buyung123", role: Role.EMPLOYEE },
    { name: "Mursidi", email: "mursidi@g.com", password: "mursidi123", role: Role.EMPLOYEE },
    { name: "Surya", email: "surya@g.com", password: "surya123", role: Role.EMPLOYEE },
    { name: "Agus", email: "agus@g.com", password: "agus123", role: Role.EMPLOYEE },
  ];

  for (const [i, u] of usersData.entries()) {
    const hashed = await bcrypt.hash(u.password, 10);

    const assignedDivision = divisions[i % divisions.length];
    const assignedShift = allShifts[i % allShifts.length];

    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
        divisionId: assignedDivision.id,
        shiftId: assignedShift.id,
      },
    });
  }

  console.log("✅ Seeding Done!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
