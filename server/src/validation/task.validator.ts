import * as z from "zod";
import { TaskStatus } from "../generated/prisma/enums";

export const createTaskSchema = z.object({
  taskStatus: z.enum(TaskStatus),
  description: z.string(),
  endDate: z.date().optional(),
});

export const updateTaskSchema = z.object({
  taskStatus: z.enum(TaskStatus).optional(),
  description: z.string().optional(),
  endDate: z.date().optional(),
});
