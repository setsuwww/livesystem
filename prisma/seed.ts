// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
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
