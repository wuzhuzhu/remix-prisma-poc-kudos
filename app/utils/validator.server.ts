import { z } from "zod";

export const LoginValidator = z.object({
  action: z.enum(["login"]),
  email: z.string().email({ message: "Email must be valid" }),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const RegisterValidator = LoginValidator.extend({
  action: z.enum(["register"]),
  lastName: z
    .string()
    .min(1, { message: "Last name must be at least 1 character" }),
  firstName: z
    .string()
    .min(1, { message: "First name must be at least 1 character" }),
});
