// prisma/seed.ts
import { PrismaClient, Role, ShiftType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const coordinatorPassword = await bcrypt.hash("coordinator123", 10);
  const employeePassword = await bcrypt.hash("employee123", 10);

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "coordinator@example.com" },
    update: {},
    create: {
      name: "Coordinator",
      email: "coordinator@example.com",
      password: coordinatorPassword,
      role: Role.COORDINATOR,
    },
  });

  await prisma.user.upsert({
    where: { email: "employee@example.com" },
    update: {},
    create: {
      name: "Employee",
      email: "employee@example.com",
      password: employeePassword,
      role: Role.EMPLOYEE,
    },
  });

  // Hapus shift lama
  await prisma.shift.deleteMany();

  const time = (hours: number, minutes: number = 0) =>
    new Date(Date.UTC(1970, 0, 1, hours, minutes));

  await prisma.shift.createMany({
    data: [{
        type: ShiftType.MORNING,
        startTime: time(8, 0),
        endTime: time(16, 0),
      }, {
        type: ShiftType.AFTERNOON,
        startTime: time(16, 0),
        endTime: time(0, 0),
      }, {
        type: ShiftType.NIGHT,
        startTime: time(0, 0),
        endTime: time(8, 0),
      },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main().catch((e) => {console.error(e); process.exit(1);
  }).finally(async () => { await prisma.$disconnect() });
