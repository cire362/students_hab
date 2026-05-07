import * as z from "zod";

export const userUpdateSchema = z.object({
  password: z.string().min(5),
});
