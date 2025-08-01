import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    username: z.string({ required_error: "Username is required!" }),
    email: z.string({ required_error: "Email is required!" }),
    role: z.string({ required_error: "Password is required!" }),
    password: z
      .string({ required_error: "Password is required!" })
      .min(8, { message: "Password must be at least 8 characters long!" }),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password  is required",
    }),
    newPassword: z.string({
      required_error: "New password  is required",
    }),
  }),
});

export const authValidationSchema = {
  createUserSchema,
  loginUserSchema,
  refreshTokenSchema,
  changePasswordSchema,
};
