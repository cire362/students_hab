import { type Context } from "hono";

export const validationHook = (result: any, c: Context) => {
  if (!result.success) {
    return c.json(
      {
        status: false,
        message: "Ошибка валидации",
        errors: result.error.flatten().fieldErrors,
      },
      400,
    );
  }
};
