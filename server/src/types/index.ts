import { type UserRole } from "../generated/prisma/enums";

export type JwtPayload = {
  userId: number;
  userRole: UserRole;
};
