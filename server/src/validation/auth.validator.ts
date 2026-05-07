import * as z from "zod";
import { UserRole } from "../generated/prisma/enums";

export const registerSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(5),
  role: z.enum(UserRole).default("STUDENT"),
});

export const loginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(5),
});
