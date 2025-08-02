import express from "express";
import { assignmentControllers } from "./assignment.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { assignmentValidationSchema } from "./assignment.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create assignment (Instructors only)
router.post(
  "/",
  auth(UserRole.INSTRUCTOR),
  validateRequest(assignmentValidationSchema.createAssignmentSchema),
  assignmentControllers.createAssignment
);

// Get all assignments (Instructor & Student)
router.get(
  "/",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  assignmentControllers.getAllAssignments
);

// Get single assignment by id (Instructor & Student)
router.get(
  "/:id",
  auth(UserRole.INSTRUCTOR, UserRole.STUDENT),
  assignmentControllers.getAssignmentById
);

// Update assignment by id (Instructor only)
router.put(
  "/:id",
  auth(UserRole.INSTRUCTOR),
  validateRequest(assignmentValidationSchema.updateAssignmentSchema),
  assignmentControllers.updateAssignment
);

// Soft delete assignment by id (Instructor only)
router.delete(
  "/:id",
  auth(UserRole.INSTRUCTOR),
  assignmentControllers.deleteAssignment
);

export const assignmentRoutes = router;
