import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    username: z.string({ message: "Username is required!" }),
    email: z.string({ message: "Email is required!" }),
    role: z.string({ message: "Password is required!" }),
    password: z
      .string({ message: "Password is required!" })
      .min(8, { message: "Password must be at least 8 characters long!" }),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string({
      message: "Email is required",
    }),
    password: z.string({
      message: "Password is required",
    }),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: "Refresh Token is required",
    }),
  }),
});

export const authValidationSchema = {
  createUserSchema,
  loginUserSchema,
  refreshTokenSchema,
};
