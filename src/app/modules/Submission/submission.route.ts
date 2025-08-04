import express from "express";
import { submissionControllers } from "./submission.controller";
import validateRequest from "../../middlewares/validateRequest";
import { submissionValidationSchema } from "./submission.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create submission (Student)
router.post(
  "/create",
  auth(UserRole.STUDENT),
  //   validateRequest(submissionValidationSchema.createSubmissionValidation),
  submissionControllers.createSubmission
);

// Get submission count by instructor
router.get(
  "/status",
  auth(UserRole.INSTRUCTOR),
  submissionControllers.getSubmissionStatusCounts
);

// Get submission count by student
router.get(
  "/status-student",
  auth(UserRole.STUDENT),
  submissionControllers.getStudentSubmissionStatusCounts
);

// Get single submission
router.get(
  "/student",
  auth(UserRole.STUDENT),
  submissionControllers.getStudentSubmission
);

// Get all submissions (Instructor/Admin/Student filtered)
router.get(
  "/",
  auth(UserRole.INSTRUCTOR),
  submissionControllers.getAllSubmissions
);

// Get single submission
router.get("/:id", submissionControllers.getSubmissionById);

// Update submission (Student resubmit / Instructor feedback)
router.patch(
  "/:id",
  validateRequest(submissionValidationSchema.updateSubmissionValidation),
  submissionControllers.updateSubmission
);

// Delete submission
router.delete("/:id", submissionControllers.deleteSubmission);

export const submissionRoutes = router;
