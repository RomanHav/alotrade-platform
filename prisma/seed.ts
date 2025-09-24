// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const pwd = process.env.SEED_ADMIN_PASSWORD;

  if (!email) {
    throw new Error("Missing SEED_ADMIN_EMAIL in environment");
  }
  if (!pwd) {
    throw new Error("Missing SEED_ADMIN_PASSWORD in environment");
  }

  const passwordHash = await bcrypt.hash(pwd, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "CMS Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  console.log("Seeded admin:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
