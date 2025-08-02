import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/profile", auth(), userControllers.getUserProfile);

router.get("/all-users", auth(UserRole.SUPERADMIN), userControllers.getAllUser);

router.get(
  "/user",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  userControllers.getUser
);

router.get(
  "/user-profile",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  userControllers.getUserWithProfile
);

router.put(
  "/profile",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUser
);

router.put(
  "/status/:userId",
  auth(UserRole.SUPERADMIN),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserStatus
);

export const userRoutes = router;
