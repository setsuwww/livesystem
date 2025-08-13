// prisma/seed.ts
import { PrismaClient, Role, ShiftType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const operatorPassword = await bcrypt.hash("operator123", 10);

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

  // Operator
  await prisma.user.upsert({
    where: { email: "operator@example.com" },
    update: {},
    create: {
      name: "Operator",
      email: "operator@example.com",
      password: operatorPassword,
      role: Role.MANAGER,
    },
  });

  // Seed shifts
  await prisma.shift.deleteMany(); // biar nggak dobel data

  await prisma.shift.createMany({
    data: [
      {
        type: ShiftType.MORNING,
        startTime: new Date("1970-01-01T08:00:00.000Z"),
        endTime: new Date("1970-01-01T16:00:00.000Z"),
      },
      {
        type: ShiftType.AFTERNOON,
        startTime: new Date("1970-01-01T16:00:00.000Z"),
        endTime: new Date("1970-01-01T00:00:00.000Z"),
      },
      {
        type: ShiftType.NIGHT,
        startTime: new Date("1970-01-01T00:00:00.000Z"),
        endTime: new Date("1970-01-01T08:00:00.000Z"),
      },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
