import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "alice@prisma.io",
    password: "$2b$10$I3aQWLbZQlQhQ1jqg.2CXe.WQVFQ.X.Q.QZ.Q.QZ.QZ.QZ.QZ.",
    profile: {
      create: {
        firstName: "Alice",
        lastName: "Wonder",
      },
    },
  },
  {
    email: "nilu@prisma.io",
    password: "$2b$10$I3aQWLbZQlQhQ1jqg.2CXe.WQVFQ.X.Q.QZ.Q.QZ.QZ.QZ.",
    profile: {
      create: {
        firstName: "Nilu",
        lastName: "Wonder",
      },
    },
  },
  {
    email: "test@prisma.io",
    password: "$2b$10$I3aQWLbZQlQhQ1jqg.2CXe.WQVFQ.X.Q.QZ.Q.QZ.QZ.QZ.",
    profile: {
      create: {
        firstName: "Test",
        lastName: "User",
      },
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
