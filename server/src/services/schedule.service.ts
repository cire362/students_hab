import { prisma } from "../lib/prisma";
import type {
  ScheduleUncheckedCreateInput,
  ScheduleUncheckedUpdateInput,
} from "../generated/prisma/models";
import { checkError } from "../utils/checkError";

export abstract class ScheduleService {
  static async getScheduleBySubjectId(subjectId: number) {
    try {
      const schedule = await prisma.schedule.findMany({
        where: {
          subjectId,
        },
      });

      return schedule;
    } catch (e) {
      checkError(e, {
        P2003: { status: 409, message: "Предмет не найден" },
      });
    }
  }

  static async getScheduleByTeacherId(teacherId: number) {
    try {
      const schedule = await prisma.schedule.findMany({
        where: {
          teacherId,
        },
      });

      return schedule;
    } catch (e) {
      checkError(e, {
        P2003: { status: 409, message: "Преподаватель не найден" },
      });
    }
  }

  static async getScheduleByGroupId(groupId: number) {
    try {
      const schedule = await prisma.schedule.findMany({
        where: {
          groupId,
        },
      });

      return schedule;
    } catch (e) {
      checkError(e, {
        P2003: { status: 409, message: "Группа не найдена" },
      });
    }
  }

  static async createSchedule(data: ScheduleUncheckedCreateInput) {
    try {
      const schedule = await prisma.schedule.create({
        data,
      });

      return schedule;
    } catch (e) {
      checkError(e, {
        P2003: {
          status: 409,
          message:
            "Указаны неверные данные для связи (предмет, группа или преподаватель)",
        },
      });
    }
  }

  static async updateSchedule(
    data: ScheduleUncheckedUpdateInput,
    scheduleId: number,
  ) {
    try {
      const updated = await prisma.schedule.update({
        where: {
          id: scheduleId,
        },
        data,
      });

      return updated;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Расписание не найдено" },
      });
    }
  }

  static async deleteScheduleById(scheduleId: number) {
    try {
      const schedule = await prisma.schedule.delete({
        where: {
          id: scheduleId,
        },
      });

      return schedule;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Расписание не найдено" },
      });
    }
  }
}
