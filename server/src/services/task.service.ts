import { checkError } from "../utils/checkError";
import type {
  TaskUncheckedCreateInput,
  TaskUncheckedUpdateInput,
} from "../generated/prisma/models";
import { prisma } from "../lib/prisma";
import { HTTPException } from "hono/http-exception";

export abstract class TaskService {
  static async createTask(
    data: Omit<TaskUncheckedCreateInput, "studentId">,
    userId: number,
  ) {
    try {
      const student = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          Student: true,
        },
      });

      if (!student?.Student) {
        throw new HTTPException(404, { message: "Студент не найден" });
      }

      const task = await prisma.task.create({
        data: {
          ...data,
          studentId: student.Student.id,
        },
      });

      return task;
    } catch (e) {
      checkError(e, {
        P2003: { status: 409, message: "Студент не существует" },
      });
    }
  }

  static async updateTask(
    data: Omit<TaskUncheckedUpdateInput, "studentId">,
    userId: number,
    id: number,
  ) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          Student: true,
        },
      });

      if (!user) {
        throw new HTTPException(404, { message: "Пользователь не найден" });
      }

      const task = await prisma.task.findFirst({
        where: {
          studentId: user.Student?.id,
          id: id,
        },
      });

      if (!task) {
        throw new HTTPException(404, { message: "Задача не найдена" });
      }

      const updated = await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });

      return updated;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Задача не найдена" },
      });
    }
  }

  static async deleteTask(id: number, userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          Student: true,
        },
      });

      if (!user) {
        throw new HTTPException(404, { message: "Пользователь не найден" });
      }

      const task = await prisma.task.findFirst({
        where: {
          id: id,
          studentId: user.Student?.id,
        },
      });

      if (!task) {
        throw new HTTPException(404, { message: "Задача не найдена" });
      }

      const deleted = await prisma.task.delete({
        where: {
          id,
        },
      });

      return deleted;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Задача не найдена" },
      });
    }
  }

  static async getTasks(userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          Student: true,
        },
      });

      if (!user) {
        throw new HTTPException(404, { message: "Пользователь не существует" });
      }

      const tasks = await prisma.task.findMany({
        where: {
          studentId: user.Student?.id,
        },
      });

      return tasks;
    } catch (e) {
      checkError(e, {
        P2003: { status: 409, message: "Студент не найден" },
      });
    }
  }
}
