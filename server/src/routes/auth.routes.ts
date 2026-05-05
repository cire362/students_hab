import { Hono } from "hono";
import { AuthService } from "../services/auth.service";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../validation/auth.validator";
import { validationHook } from "../utils/validator-handler";

const authRouter = new Hono();

authRouter.post(
  "/register",
  zValidator("json", registerSchema, validationHook),
  async (c) => {
    const req = c.req.valid("json");
    const user = await AuthService.register(req);
    return c.json({ message: "Пользователь зарегистрирован", user }, 201);
  },
);

authRouter.post(
  "/login",
  zValidator("json", loginSchema, validationHook),
  async (c) => {
    const req = c.req.valid("json");
    const token = await AuthService.login(req.login, req.password);
    return c.json({ message: "Успешная аутентификация", token }, 200);
  },
);

export default authRouter;
