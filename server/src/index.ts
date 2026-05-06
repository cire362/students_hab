import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import authRouter from "./routes/auth.routes";
import taskRouter from "./routes/task.routes";
import scheduleRouter from "./routes/schedule.routes";

const app = new Hono();

app.onError((err: any, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  } else {
    return c.json({ message: err.message }, 500);
  }
});

app.get("/", (c) => {
  return c.json({
    message: "hello from create-prisma + hono",
  });
});

app.route("/api/v1/auth", authRouter);
app.route("/api/v1/task", taskRouter);
app.route("/api/v1/schedule", scheduleRouter);

const rawPort = (process.env.PORT ?? "").trim();
const parsedPort = rawPort.length > 0 ? Number(rawPort) : Number.NaN;
const port =
  Number.isInteger(parsedPort) && parsedPort >= 0 && parsedPort <= 65535
    ? parsedPort
    : 3000;
serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
