import { jwt } from "hono/jwt";
import { TaskService } from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.validator";
import { Hono } from "hono";
import type { JwtPayload } from "../types";
import { zValidator } from "@hono/zod-validator";
import { validationHook } from "../utils/validator-handler";
import { checkSecret } from "../utils/checkSecret";
import { checkRole } from "../utils/checkRole";

const taskRouter = new Hono();

const secret = checkSecret();

taskRouter.use("/*", jwt({ secret: secret, alg: "HS256" }));

taskRouter.post(
  "/",
  zValidator("json", createTaskSchema, validationHook),
  async (c) => {
    const payload = c.get("jwtPayload") as JwtPayload;
    checkRole(["STUDENT"], payload.userRole);

    const req = c.req.valid("json");

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
