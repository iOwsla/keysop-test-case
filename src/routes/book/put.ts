import { Genre } from "@prisma/client";
import { Handler } from "hono";
import { z } from 'zod';
import { AuthVariables } from "../../middlewares/auth";
import { prisma } from "../../database";

const scheme = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(15).max(255),
  released_at: z.coerce.date(),
  genre: z.nativeEnum(Genre),
});

export const put: Handler<{ Variables: AuthVariables }> = async (ctx) => {

  const user = ctx.get("user")

  const body = await scheme.parseAsync(await ctx.req.json().catch(() => null)).catch((error) => ({ error }));

  if ("error" in body) {
    return ctx.json({
      ok: false,
      error: body.error
    }, 400);
  }

  const book = await prisma.book.create({
    data: {
      ...body,
      author_id: user.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      released_at: true,
      genre: true,
      author: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });


  return ctx.json({
    ok: true,
    data: book
  }, 200);

}
