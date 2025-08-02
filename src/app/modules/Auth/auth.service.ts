import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../utils/jwtHelpers";
import prisma from "../../utils/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TUserData } from "../User/user.interface";

const createUser = async (data: TUserData) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    throw new APIError(httpStatus.CONFLICT, "Username is already taken!");
  }

  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    ...data,
    password: hashedPassword,
  };

  const createdUserData = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: createdUserData.email,
      username: createdUserData.username,
      userId: createdUserData.id,
      role: createdUserData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: createdUserData.email,
      username: createdUserData.username,
      userId: createdUserData.id,
      role: createdUserData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    createdUserData,
  };
};

const loginUser = async (payload: { identifier: string; password: string }) => {
  const { identifier } = payload;

  if (!identifier) {
    throw new APIError(httpStatus.NOT_FOUND, "Email or Username is required!");
  }

  let userData = await prisma.user.findUnique({
    where: {
      email: identifier,
    },
  });

  if (!userData) {
    userData = await prisma.user.findUnique({
      where: {
        username: identifier,
      },
    });
  }

  if (!userData) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      username: userData.username,
      userId: userData.id,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    // Verify the token
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    // Type narrowing to check if 'err' is an instance of Error
    if (err instanceof Error) {
      // Handle specific JWT errors based on their name
      if (err.name === "TokenExpiredError") {
        throw new Error("Refresh token expired, please log in again.");
      } else if (err.name === "JsonWebTokenError") {
        throw new Error("Invalid token, please log in again.");
      } else {
        throw new Error("You are not authorized!");
      }
    } else {
      // In case 'err' is not of type 'Error'
      throw new Error("An unknown error occurred!");
    }
  }

  // Check if the user exists
  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData?.email,
    },
  });

  if (!userData) {
    throw new Error("User not found!");
  }

  // Generate a new access token
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expires_in as string
  );

  return {
    accessToken,
  };
};

export const authServices = {
  createUser,
  loginUser,
  refreshToken,
};
