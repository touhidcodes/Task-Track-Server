import { z } from "zod";

const updateUserSchema = z.object({
  body: z.object({
    image: z.string().optional(),
    name: z.string().optional(),
    bio: z.string().optional(),
    profession: z.string().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
    role: z.string().optional(),
  }),
});

export const userValidationSchema = {
  updateUserSchema,
};
