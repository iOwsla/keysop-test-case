import { Handler } from "hono";
import { Genre } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../database";

const scheme = z.object({
  author_id: z.number().int().min(0).optional(),
  genre: z.nativeEnum(Genre).optional(),
  page: z.number().int().min(0).default(0),
  limit: z.number().int().default(10).refine(n => [10, 20, 50, 100].includes(n), "Limit can only be 10, 20, 50, 100."),
  sort_by_rate: z.enum(['asc', 'desc']).default('desc').optional()
});

export const get: Handler = async (ctx) => {
  const query = await scheme.parseAsync(ctx.req.query()).catch((error) => ({ error }));

  if ("error" in query) {
    return ctx.json({
      ok: false,
      error: query.error
    }, 400);
  }

  let books = await prisma.book.findMany({
    where: {
      author_id: query.author_id ?? undefined,
      genre: query.genre ?? undefined,
    },
    take: query.limit,
    skip: query.limit * query.page,
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
      },
      rates: {
        select: {
          value: true
        }
      }
    },
  });

  if (query.sort_by_rate) books.sort((a, b) => {
    const aAvgRate = (a.rates.reduce((sum, rate) => sum + rate.value, 0) / a.rates.length) || 0;
    const bAvgRate = (b.rates.reduce((sum, rate) => sum + rate.value, 0) / b.rates.length) || 0;

    return query.sort_by_rate === "asc" ? aAvgRate - bAvgRate : bAvgRate - aAvgRate;
  });

  return ctx.json({
    ok: true,
    data: {
      books
    }
  });
};
