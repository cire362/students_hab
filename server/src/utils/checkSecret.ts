import { HTTPException } from "hono/http-exception";

export function checkSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HTTPException(500, { message: "Ошибка сервера" });
  }
  return secret;
}
