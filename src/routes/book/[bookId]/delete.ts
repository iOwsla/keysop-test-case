import { Handler } from "hono";
import { BookVariables } from "../../../middlewares/book";
import { prisma } from "../../../database";

export const del: Handler<{ Variables: BookVariables }> = async (ctx) => {
  const book = ctx.get("book");

  const deletedBook = await prisma.book.delete({
    where: {
      id: book.id
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
    data: deletedBook
  });
};