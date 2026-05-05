import { jwt } from "hono/jwt";
import { TaskService } from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { JwtPayload } from "../types";
import { zValidator } from "@hono/zod-validator";
import { validationHook } from "../utils/validator-handler";

const taskRouter = new Hono();

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new HTTPException(500, { message: "Ошибка сервера" });
}

taskRouter.use("/*", jwt({ secret: secret, alg: "HS256" }));

taskRouter.post(
  "/",
  zValidator("json", createTaskSchema, validationHook),
  async (c) => {
    const payload = c.get("jwtPayload") as JwtPayload;
    const req = c.req.valid("json");

    if (payload.userRole === "ADMIN" || payload.userRole === "TEACHER") {
      throw new HTTPException(403, { message: "Отказано в доступе" });
    }

    const task = await TaskService.createTask(req, payload.userId);

    return c.json({ message: "Задача создана", task }, 201);
  },
);

taskRouter.get("/", async (c) => {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  const task = await TaskService.getTasks(jwtPayload.userId);
  return c.json({ message: "Задачи получены", task }, 200);
});

taskRouter.put(
  "/:id",
  zValidator("json", updateTaskSchema, validationHook),
  async (c) => {
    const jwtPayload = c.get("jwtPayload") as JwtPayload;
    const req = c.req.valid("json");
    const id = parseInt(c.req.param("id"));
    const task = await TaskService.updateTask(req, jwtPayload.userId, id);
    return c.json({ message: "Задача обновлена", task }, 201);
  },
);

taskRouter.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const payload = c.get("jwtPayload") as JwtPayload;
  const task = await TaskService.deleteTask(id, payload.userId);
  return c.json({ message: "Задача удалена", task }, 200);
});

export default taskRouter;
