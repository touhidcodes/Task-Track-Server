import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/profile", auth(), userControllers.getUserProfile);

router.get("/all-users", auth(UserRole.ADMIN), userControllers.getAllUser);

router.get(
  "/user",
  auth(UserRole.ADMIN, UserRole.USER),
  userControllers.getUser
);

router.get(
  "/user-profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userControllers.getUserWithProfile
);

router.put(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUser
);

router.put(
  "/status/:userId",
  auth(UserRole.ADMIN),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUserStatus
);

export const userRoutes = router;
