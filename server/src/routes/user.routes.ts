import { UserService } from "../services/user.service";
import { jwt } from "hono/jwt";
import { userUpdateSchema } from "../validation/user.validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { validationHook } from "../utils/validator-handler";
import type { JwtPayload } from "../types";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new HTTPException(500, { message: "Ошибка сервера" });
}

const userRouter = new Hono();

userRouter.use("/*", jwt({ secret: secret, alg: "HS256" }));

userRouter.put(
  "/:id",
  zValidator("json", userUpdateSchema, validationHook),
  async (c) => {
    const jwtPayload = c.get("jwtPayload") as JwtPayload;
    const id = parseInt(c.req.param("id"));
    const req = c.req.valid("json");
    if (id !== jwtPayload.userId) {
      throw new HTTPException(403, { message: "Отказано в доступе" });
    }
    const user = await UserService.updateUser(req, id);
    return c.json({ message: "Данные обновлены", user }, 201);
  },
);

userRouter.delete("/:id", async (c) => {
  const jwtPayload = c.get("jwtPayload") as JwtPayload;
  const id = parseInt(c.req.param("id"));
  if (id !== jwtPayload.userId && jwtPayload.userRole !== "ADMIN") {
    throw new HTTPException(403, { message: "Отказано в доступе" });
  }
  const user = await UserService.deleteUser(id);
  return c.json({ message: "Пользователь удален", user }, 200);
});
