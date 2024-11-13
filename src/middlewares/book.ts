import { createMiddleware } from "hono/factory";
import { Prisma } from "@prisma/client";
import { prisma } from "../database";

export type BookVariables = {
  book: Prisma.BookGetPayload<{
    include: {
      author: true,
      rates: true
    }
  }>
}

export const book = createMiddleware<{ Variables: BookVariables }, "/book/:bookId">(async (ctx, n) => {

  const bookId = Number(ctx.req.param("bookId")) || undefined;

  if (!bookId) {
    return ctx.json({
      ok: false,
      error: {
        code: 10_003,
        message: "Invalid book id"
      }
    }, 400);
  }

  const book = await prisma.book.findUnique({
    where: {
      id: bookId
    },
    include: {
        author: true,
        rates: true
    }
  });

  if (!book) {

    return ctx.json({
      ok: false,
      error: {
        code: 10_003,
        message: "Invalid book id"
      }
    }, 404);

  }

  ctx.set("book", book);

  return await n();
});