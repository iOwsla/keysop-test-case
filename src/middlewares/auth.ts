import { createMiddleware } from "hono/factory";
import { verify } from 'hono/jwt';
import { User } from "@prisma/client";
import { prisma } from "../database";

export type AuthVariables = {
  id: number,
  user: User
}

export const auth = createMiddleware<{ Variables: AuthVariables }>(async (c, n) => {

  const token = c.req.header("Authorization")?.split(" ").at(1) as string;

  const data = await verify(token, process.env.AUTH_SECRET!).catch((error) => ({ error }));

  if ("error" in data || typeof data?.id !== "number") {
    return c.json({
      ok: false,
      error: data.error || "unknown error"
    }, 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: data.id
    }
  });

  if (!user) {
    return c.json({
      ok: false,
      error: "User not found"
    }, 401);
  }

  c.set("id", data.id);
  c.set("user", user);
  c.set("jwtPayload", data);

  return await n();
});