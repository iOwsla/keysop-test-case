import { Genre } from "@prisma/client";
import { Handler } from "hono";
import { z } from "zod";
import { prisma } from "../../../database";
import { BookVariables } from "../../../middlewares/book";

const scheme = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
  released_at: z.date().optional(),
  genre: z.nativeEnum(Genre).optional()
});

export const patch: Handler<{ Variables: BookVariables }> = async (ctx) => {

  const bookId = ctx.get("book").id;

  const body = await scheme.parseAsync(await ctx.req.json().catch(() => null)).catch((error) => ({ error }));

  if ("error" in body) {
    return ctx.json({
      ok: false,
      error: body.error
    }, 400);
  }

  const book = await prisma.book.update({
    where: {
      id: bookId
    },
    data: {
      ...body
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

};
