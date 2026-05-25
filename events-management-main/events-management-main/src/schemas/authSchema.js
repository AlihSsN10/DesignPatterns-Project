import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your password" }),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, {
      message: "Invalid Egyptian phone number (e.g. 01xxxxxxxxx)",
    }),
  role: z.enum(["CUSTOMER", "EVENT_CREATOR"], {
    required_error: "Please select a role",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});