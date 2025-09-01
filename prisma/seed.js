// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
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

  await prisma.shift.createMany({
    data: [
      {
        type: "MORNING",
        startTime: new Date("1970-01-01T08:00:00"),
        endTime: new Date("1970-01-01T16:00:00"),
      },
      {
        type: "AFTERNOON",
        startTime: new Date("1970-01-01T16:00:00"),
        endTime: new Date("1970-01-02T00:00:00"),
      },
      {
        type: "EVENING",
        startTime: new Date("1970-01-01T00:00:00"),
        endTime: new Date("1970-01-02T08:00:00"),
      },
    ],
  });
  console.log("✅ Seeding selesai!");
}

main().catch((e) => { 
  console.error(e); process.exit(1);
}).finally(async () => { await prisma.$disconnect() });
