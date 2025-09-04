// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const coordinatorPassword = await bcrypt.hash("coordinator123", 10);
  const employeePassword = await bcrypt.hash("employee123", 10);

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

  const shifts = [
    {
      type: "MORNING",      // 08:00 - 16:00
      startTime: 8 * 60,
      endTime: 16 * 60,
    },
    {
      type: "AFTERNOON",    // 16:00 - 00:00
      startTime: 16 * 60,
      endTime: 24 * 60,     // 24:00 alias midnight
    },
    {
      type: "EVENING",      // 00:00 - 08:00
      startTime: 0,
      endTime: 8 * 60,
    },
  ]

  for (const shift of shifts) {
    await prisma.shift.upsert({
      where: { type: shift.type },
      update: shift,
      create: shift,
    })
  }

  console.log("---------------------")
  console.log("✅ Seeding Done der");
  console.log("---------------------")
}

main().catch((e) => { 
  console.error(e); process.exit(1);
}).finally(async () => { await prisma.$disconnect() });
