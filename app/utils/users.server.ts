import bcrypt from "bcryptjs";
import type { RegisterForm } from "~/utils/types.server";
import { prisma } from "~/utils/prisma.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        create: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
    },
  });
  return { id: newUser.id, email: user.email };
};

export const getOtherUsers = async (userId: number) => {
  return prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
    },
    include: {
      profile: true,
    },
    orderBy: {
      profile: {
        firstName: "asc",
      },
    },
  });
};
