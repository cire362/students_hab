import { checkError } from "../utils/checkError";
import { type UserUpdateInput } from "../generated/prisma/models";
import { prisma } from "../lib/prisma";

export abstract class UserService {
  static async deleteUser(id: number) {
    try {
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });

      return user;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Пользователь не найден" },
      });
    }
  }

  static async updateUser(data: UserUpdateInput, id: number) {
    try {
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });

      return user;
    } catch (e) {
      checkError(e, {
        P2025: { status: 404, message: "Пользователь не найден" },
      });
    }
  }
}
