import { Hono } from "hono";
import { ScheduleService } from "../services/schedule.service";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../validation/schedule.validator";
import { zValidator } from "@hono/zod-validator";
import { jwt } from "hono/jwt";
import { checkSecret } from "../utils/checkSecret";
import { validationHook } from "../utils/validator-handler";
import type { JwtPayload } from "../types";
import { checkRole } from "../utils/checkRole";

const scheduleRouter = new Hono();

const secret = checkSecret();

scheduleRouter.use("/*", jwt({ secret: secret, alg: "HS256" }));

scheduleRouter.post(
  "/",
  zValidator("json", createScheduleSchema, validationHook),
  async (c) => {
    const jwtPayload = c.get("jwtPayload") as JwtPayload;
    checkRole(["ADMIN"], jwtPayload.userRole);
    const req = c.req.valid("json");
    const schedule = await ScheduleService.createSchedule(req);
    return c.json({ message: "Расписание создано", schedule }, 201);
  },
);

scheduleRouter.put(
  "/:id",
  zValidator("json", updateScheduleSchema, validationHook),
  async (c) => {
    const jwtPayload = c.get("jwtPayload") as JwtPayload;
    checkRole(["ADMIN"], jwtPayload.userRole);
    const req = c.req.valid("json");
    const id = parseInt(c.req.param("id"));
    const schedule = await ScheduleService.updateSchedule(req, id);
    return c.json({ message: "Расписание обновлено", schedule }, 201);
  },
);

scheduleRouter.delete("/:id", async (c) => {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  checkRole(["ADMIN"], jwtPayload.userRole);
  const id = parseInt(c.req.param("id"));
  const schedule = await ScheduleService.deleteScheduleById(id);
  return c.json({ message: "Расписание удалено", schedule }, 200);
});

scheduleRouter.get("/subject/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const schedule = await ScheduleService.getScheduleBySubjectId(id);
  return c.json({ message: "Расписание получено", schedule }, 200);
});

scheduleRouter.get("/teacher/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const schedule = await ScheduleService.getScheduleByTeacherId(id);
  return c.json({ message: "Расписание получено", schedule }, 200);
});

scheduleRouter.get("/group/:id", async (c) => {
  const id = parseInt(c.req.param("id"));
  const schedule = await ScheduleService.getScheduleByGroupId(id);
  return c.json({ message: "Расписание получено", schedule }, 200);
});

export default scheduleRouter;
