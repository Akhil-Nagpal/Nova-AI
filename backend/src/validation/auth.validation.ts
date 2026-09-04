import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .email({ message: "Invalid email format" })
      .toLowerCase()
      .pipe(z.string().max(254, "Email must not exceed 254 characters")),
    password: z
      .string()
      .min(8, "Password must atleast 8 characters")
      .max(16, "password must not exceed 16 characters"),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .email({ message: "Invalid email format" })
      .toLowerCase()
      .pipe(z.string().max(254, "Email must not exceed 254 characters")),
    password: z
      .string()
      .min(8, "Password must atleast 8 characters")
      .max(16, "password must not exceed 16 characters"),
  }),
});
