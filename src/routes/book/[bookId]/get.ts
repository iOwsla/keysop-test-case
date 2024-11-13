import { Handler } from "hono";
import { type BookVariables } from "../../../middlewares/book";
import { deleteKeys } from "../../../utils/deleteKeys";

export const get: Handler<{ Variables: BookVariables }> = async (ctx) => {

  const book = ctx.get("book");

  return ctx.json({
    ok: true,
    data: {
        ...deleteKeys(book, ["author", "rates", "created_at", "updated_at"]),
        author: {
            id: book.author.id,
            email: book.author.email,
        }
    }
  }, 200);

};
