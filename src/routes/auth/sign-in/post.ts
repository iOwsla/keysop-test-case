import { z } from "zod";
import { prisma } from "../../../database";
import type { Handler } from "hono";
import { sign } from "hono/jwt";
import bcrypt from 'bcrypt';
import { deleteKeys } from "../../../utils/deleteKeys";

const scheme = z.object({
  email: z.string().email(),
  password: z.string().max(64)
});

export const post: Handler = async (c) => {
  const body = await scheme.parseAsync(await c.req.json().catch(() => null)).catch((error) => ({ error }));

  if ("error" in body) {
    return c.json({
      ok: false,
      error: body.error
    }, 400);
  }

  let user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })

  if (!user) {
    return c.json({
      ok: false,
      error: {
        code: 10_002,
        message: "Invalid credentials"
      }
    }, 402);
  }

  const passwordHash = bcrypt.hashSync(body.password, user.password_salt);

  if (passwordHash !== user.password_hash) {
    return c.json({
      ok: false,
      error: {
        code: 10_002,
        message: "Invalid credentials"
      }
    }, 402);
  }

  const token = await sign({
    id: user.id
  }, process.env.AUTH_SECRET!);


  const basicUser = deleteKeys(user, ["password_hash", "password_salt", "created_at", "updated_at"]);

  return c.json({
    ok: true,
    data: {
      ...basicUser,
      token
    }
  });
}