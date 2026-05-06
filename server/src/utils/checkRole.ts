import { HTTPException } from "hono/http-exception";
import { UserRole } from "../generated/prisma/enums";

export function checkRole(allowedRoles: UserRole[], userRole: UserRole) {
  if (!allowedRoles.includes(userRole)) {
    throw new HTTPException(403, { message: "Отказано в доступе" });
  }
  return true;
}
