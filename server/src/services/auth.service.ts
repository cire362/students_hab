import { checkError } from "../utils/checkError";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcrypt";
import { sign } from "hono/jwt";
import type { UserCreateInput } from "../generated/prisma/models";
import { prisma } from "../lib/prisma";
import { checkSecret } from "../utils/checkSecret";

export abstract class AuthService {
  static async register(data: UserCreateInput) {
    try {
      const passwordHash = await bcrypt.hash(data.password, 10);

      switch (data.role) {
        case "ADMIN":
          data = {
            ...data,
            Admin: {
              create: {
                name: "",
                middleName: "",
                surname: "",
              },
            },
          };
          break;
        case "TEACHER":
          data = {
            ...data,
            Teacher: {
              create: {
                name: "",
                middleName: "",
                surname: "",
              },
            },
          };
          break;
        default:
          data = {
            ...data,
            Student: {
              create: {
                name: "",
                middleName: "",
                surname: "",
              },
            },
          };
      }

      const user = await prisma.user.create({
        data: { ...data, password: passwordHash },
      });

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (e) {
      checkError(e, {
        P2002: { status: 409, message: "Пользователь уже существует" },
      });
    }
  }

  static async login(login: string, password: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          login,
        },
      });

      if (!user) {
        throw new HTTPException(404, { message: "Пользователь не найден" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        throw new HTTPException(401, {
          message: "Неверное имя пользователя или пароль",
        });
      }

      const secret = checkSecret();

      const payload = {
        userId: user.id,
        userRole: user.role,
      };

      const token = await sign(payload, secret);
      return token;
    } catch (e) {
      checkError(e, {});
    }
  }
}
