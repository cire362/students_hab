import * as z from "zod";
import { WeekType } from "../generated/prisma/enums";

export const createScheduleSchema = z.object({
  subjectId: z.number(),
  groupId: z.number(),
  teacherId: z.number(),
  dayOfWeek: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
  cabinet: z.string(),
  weekType: z.enum(WeekType),
});

export const updateScheduleSchema = z.object({
  subjectId: z.number().optional(),
  groupId: z.number().optional(),
  teacherId: z.number().optional(),
  dayOfWeek: z.number().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  cabinet: z.string().optional(),
  weekType: z.enum(WeekType).optional(),
});
