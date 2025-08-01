import { NextFunction } from "express";
import httpStatus from "http-status";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config/config";
import { Secret } from "jsonwebtoken";
import APIError from "../errors/APIError";
import catchAsync from "../utils/catchAsync";
import prisma from "../utils/prisma";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Handle Bearer token format

    if (!token) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    // Verify JWT
    const decodedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.access_token_secret as Secret
    );

    // Check user existence
    const user = await prisma.user.findUnique({
      where: { id: decodedUser.userId }, // id is enough since it's unique
    });

    if (!user) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
    }

    // Attach user to request
    req.user = decodedUser;

    // Role-based restriction
    if (roles.length && !roles.includes(decodedUser.role)) {
      throw new APIError(httpStatus.FORBIDDEN, "Forbidden!");
    }

    next();
  });
};

export default auth;
