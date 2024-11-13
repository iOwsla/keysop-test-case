import { Handler } from "hono";
import { BookVariables } from "../../../../middlewares/book";
import { AuthVariables } from "../../../../middlewares/auth";
import { prisma } from "../../../../database";

export const get: Handler<{ Variables: BookVariables & AuthVariables }> = async (ctx) => {

  const book = ctx.get("book");

  const author = ctx.get("user");

  const rate = await prisma.rate.findUnique({
    where: {
      book_id_author_id: {
        author_id: author.id,
        book_id: book.id
      }
    },
    select: {
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
  });

  return ctx.json({
    ok: true,
    data: rate
  }, 200);

};