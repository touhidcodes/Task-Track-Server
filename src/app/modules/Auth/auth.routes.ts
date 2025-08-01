import express from "express";
import { authControllers } from "./auth.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { authValidationSchema } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authControllers.loginUser);

router.post(
  "/register",
  validateRequest(authValidationSchema.createUserSchema),
  authControllers.createUser
);

router.post("/refresh-token", authControllers.refreshToken);

router.post(
  "/change-password",
  validateRequest(authValidationSchema.changePasswordSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  authControllers.changePassword
);

export const authRoutes = router;
