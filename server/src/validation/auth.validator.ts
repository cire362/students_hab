import * as z from "zod";
import { UserRole } from "../generated/prisma/enums";

export const registerSchema = z.object({
  login: z.string(),
  password: z.string(),
  role: z.enum(UserRole).default("STUDENT"),
});

export const loginSchema = z.object({
  login: z.string(),
  password: z.string(),
});
