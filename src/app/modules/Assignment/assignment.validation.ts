import { z } from "zod";

const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Deadline must be a valid date string",
    }),
  }),
});

const updateAssignmentSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    deadline: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Deadline must be a valid date string",
      }),
    isAvailable: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const assignmentValidationSchema = {
  createAssignmentSchema,
  updateAssignmentSchema,
};
