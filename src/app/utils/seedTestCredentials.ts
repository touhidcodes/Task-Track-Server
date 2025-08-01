import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "./prisma";
import config from "../config/config";

export const seedTestCredentials = async () => {
  try {
    const isExistInstructor = await prisma.user.findFirst({
      where: {
        email: config.test.instructor_email,
        role: UserRole.INSTRUCTOR,
      },
    });

    const isExistStudent = await prisma.user.findFirst({
      where: {
        email: config.test.student_email,
        role: UserRole.STUDENT,
      },
    });

    if (isExistInstructor && isExistStudent) {
      return;
    }

    const instructorHashedPassword = await bcrypt.hash(
      config.test.instructor_password as string,
      12
    );

    const studentHashedPassword = await bcrypt.hash(
      config.test.student_password as string,
      12
    );

    const instructorData = {
      email: config.test.instructor_email as string,
      password: instructorHashedPassword,
      role: UserRole.INSTRUCTOR,
      username: config.test.instructor_username as string,
    };

    const studentData = {
      email: config.test.student_email as string,
      password: studentHashedPassword,
      role: UserRole.STUDENT,
      username: config.test.student_username as string,
    };

    if (!isExistInstructor) {
      await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
          data: instructorData,
        });

        await transactionClient.user.create({
          data: studentData,
        });
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};
