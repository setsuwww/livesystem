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

  await prisma.shift.deleteMany();

  function time(hours, minutes = 0) {
    return new Date(1970, 0, 1, hours, minutes, 0);
  }

  await prisma.shift.createMany({
    data: [{
      // dari jam 08:00 sampai 16:00
      type: ShiftType.MORNING,
      startTime: time(8, 0),
      endTime: time(16, 0),
    }, {
      // dari jam 16:00 sampai 00:00
      type: ShiftType.AFTERNOON,
      startTime: time(16, 0),
      endTime: time(0, 0),
    }, {
      // dari jam 00:00 sampai 08:00
      type: ShiftType.NIGHT,
      startTime: time(0, 0),
      endTime: time(8, 0),
    }],
  });

  console.log("✅ Seeding selesai!");
}

main().catch((e) => {
  console.error(e); process.exit(1);
}).finally(async () => { await prisma.$disconnect() });
