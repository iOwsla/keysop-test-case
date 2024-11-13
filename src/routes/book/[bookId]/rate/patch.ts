import { Handler } from "hono";
import { BookVariables } from "../../../../middlewares/book";
import { AuthVariables } from "../../../../middlewares/auth";
import { prisma } from "../../../../database";
import { z } from 'zod';

const scheme = z.object({
  rate: z.number().int().min(1).max(5)
});

export const patch: Handler<{ Variables: BookVariables & AuthVariables }> = async (ctx) => {

  const body = await scheme.parseAsync(await ctx.req.json().catch(() => null)).catch((error) => ({ error }));

  if ("error" in body) {
    return ctx.json({
      ok: false,
      error: body.error
    }, 400);
  };

  const book = ctx.get("book");

  const author = ctx.get("user");

  const rate = await prisma.rate.update({
    where: {
      book_id_author_id: {
        author_id: author.id,
        book_id: book.id
      }
    },
    data: {
      value: body.rate
    },
    select: {
      value: true,
      author: {
        select: {
          id: true,
          email: true
        }
      },
      book: {
        select: {
          id: true,
          title: true,
          released_at: true,
          description: true,
          genre: true,
        }
      }
    }
  }).catch((error) => ({ error }));

  if ("error" in rate) {
    return ctx.json({
      ok: false,
      error: rate.error
    }, 404);
  }

  return ctx.json({
    ok: true,
    data: rate
  }, 200);

};