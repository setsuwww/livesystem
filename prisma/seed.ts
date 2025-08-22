// prisma/seed.ts
import { PrismaClient, Role, ShiftType } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const [morning, afternoon, night, off] = await Promise.all([
    prisma.shift.upsert({
      where: { name_type: { name: "Morning", type: ShiftType.MORNING } },
      update: {},
      create: {
        name: "Morning",
        type: "MORNING",
        startTime: new Date("1970-01-01T08:00:00Z"),
        endTime: new Date("1970-01-01T16:00:00Z"),
      },
    }),
    prisma.shift.upsert({
      where: { name_type: { name: "Afternoon", type: ShiftType.AFTERNOON } },
      update: {},
      create: {
        name: "Afternoon",
        type: "AFTERNOON",
        startTime: new Date("1970-01-01T16:00:00Z"),
        endTime: new Date("1970-01-01T00:00:00Z"),
      },
    }),
    prisma.shift.upsert({
      where: { name_type: { name: "Night", type: ShiftType.NIGHT } },
      update: {},
      create: {
        name: "Night",
        type: "NIGHT",
        startTime: new Date("1970-01-01T00:00:00Z"),
        endTime: new Date("1970-01-01T08:00:00Z"),
      },
    }),
    prisma.shift.upsert({
      where: { name_type: { name: "Off", type: ShiftType.OFF } },
      update: {},
      create: {
        name: "Off",
        type: "OFF",
        startTime: new Date("1970-01-01T00:00:00Z"),
        endTime: new Date("1970-01-02T00:00:00Z"),
      },
    }),
  ]);

  const hash = (pwd: string) => bcrypt.hash(pwd, 10);

  await prisma.user.upsert({
    where: { email: "admin@next.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@next.com",
      password: await hash("admin123"),
      role: Role.ADMIN,
      shiftId: morning.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "coordinator@next.com" },
    update: {},
    create: {
      name: "Coordinator",
      email: "coordinator@next.com",
      password: await hash("coord123"),
      role: Role.COORDINATOR,
      shiftId: afternoon.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "employee@next.com" },
    update: {},
    create: {
      name: "Employee",
      email: "employee@next.com",
      password: await hash("emp123"),
      role: Role.EMPLOYEE,
      shiftId: night.id,
    },
  });

  console.log("Seed done.");
}

main().finally(() => prisma.$disconnect());
