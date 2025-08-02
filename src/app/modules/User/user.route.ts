import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/all-users", auth(UserRole.SUPERADMIN), userControllers.getAllUser);

router.get(
  "/user",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  userControllers.getUser
);

export const userRoutes = router;
