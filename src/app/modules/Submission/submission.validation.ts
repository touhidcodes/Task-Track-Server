import { z } from "zod";

const createSubmissionValidation = z.object({
  body: z.object({
    submissionUrl: z.string(),
    note: z.string().optional(),
    assignmentId: z.string(),
  }),
});

const updateSubmissionValidation = z.object({
  body: z.object({
    submissionUrl: z.string().optional(),
    note: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    feedback: z.string().optional(),
  }),
});

export const submissionValidationSchema = {
  createSubmissionValidation,
  updateSubmissionValidation,
};
