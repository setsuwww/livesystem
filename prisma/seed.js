// prisma/seed.js
import { PrismaClient, Role, ShiftType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Bersihin data lama
  await prisma.user.deleteMany();
  await prisma.shift.deleteMany();

  // Seed Shifts
  const shifts = [
    {
      type: ShiftType.MORNING,
      name: "Morning",
      startTime: 8 * 60,
      endTime: 16 * 60,
    },
    {
      type: ShiftType.AFTERNOON,
      name: "Afternoon",
      startTime: 16 * 60,
      endTime: 24 * 60,
    },
    {
      type: ShiftType.EVENING,
      name: "Evening",
      startTime: 0,
      endTime: 8 * 60,
    },
    {
      type: ShiftType.OFF,
      name: "Off",
      startTime: 0,
      endTime: 0,
    },
  ];

  const seededShifts = {};
  for (const shift of shifts) {
    let s = await prisma.shift.findFirst({
      where: { type: shift.type, name: shift.name },
    });

    if (s) {
      s = await prisma.shift.update({
        where: { id: s.id },
        data: shift,
      });
    } else {
      s = await prisma.shift.create({ data: shift });
    }

    seededShifts[shift.type] = s;
  }

  // Seed Users
  const users = [
    { name: "Admin", email: "admin@example.com", password: "admin123", role: Role.ADMIN },
    { name: "Coordinator", email: "coordinator@example.com", password: "coordinator123", role: Role.COORDINATOR },
    { name: "Dirman", email: "dirman@example.com", password: "dirman123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.MORNING] },
    { name: "Herman", email: "herman@example.com", password: "herman123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.AFTERNOON] },
    { name: "Buyung", email: "buyung@example.com", password: "buyung123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.EVENING] },
    { name: "Mursidi", email: "mursidi@example.com", password: "mursidi123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.MORNING] },
    { name: "Surya", email: "surya@example.com", password: "surya123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.AFTERNOON] },
    { name: "Agus", email: "agus@example.com", password: "agus123", role: Role.EMPLOYEE, defaultShift: seededShifts[ShiftType.EVENING] },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);

    let user = await prisma.user.findUnique({ where: { email: u.email } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { shiftId: u.shift?.id ?? null },
      });
    } else {
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: hashed,
          role: u.role,
          shiftId: u.shift?.id ?? null,
        },
      });
    }
  }

  console.log("✅ Seeding Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
