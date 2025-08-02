import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import config from "../../config/config";

const getUser = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      username: true,
    },
  });

  return result;
};

const getAllUser = async (currentUserEmail: string) => {
  const result = await prisma.user.findMany({
    where: {
      email: {
        notIn: [config.superAdmin.super_admin_email, currentUserEmail],
      },
    },
  });

  return result;
};

export const userServices = {
  getUser,
  getAllUser,
};
