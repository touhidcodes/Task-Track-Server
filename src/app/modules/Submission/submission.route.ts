import express from "express";
import { submissionControllers } from "./submission.controller";
import validateRequest from "../../middlewares/validateRequest";
import { submissionValidationSchema } from "./submission.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// Create submission (Student)
router.post(
  "/",
  auth(UserRole.STUDENT),
  validateRequest(submissionValidationSchema.createSubmissionValidation),
  submissionControllers.createSubmission
);

// Get all submissions (Instructor/Admin/Student filtered)
router.get("/", submissionControllers.getAllSubmissions);

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
