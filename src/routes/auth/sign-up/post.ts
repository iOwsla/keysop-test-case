import { z } from "zod";
import { prisma } from "../../../database";
import type { Handler } from "hono";
import { sign } from "hono/jwt";
import bcrypt from "bcrypt";

const scheme = z.object({
    email: z.string().email(),
    password: z.string().max(64)
})

export const post: Handler = async (c) => {
    const body = await scheme.parseAsync(await c.req.json().catch(() => null)).catch((error) => ({ error }));

    if ("error" in body) {
        return c.json({
            ok: false,
            error: body.error
        }, 400);
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password, salt);

    let user = await prisma.user.create({
        data: {
            email: body.email,
            password_hash: passwordHash,
            password_salt: salt,
        },
        select: {
            id: true,
            email: true,
            books: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    genre: true,
                    released_at: true
                }
            },
        }
    }).catch((error: any) => ({ error }));

    if ("error" in user) {
        return c.json({
            ok: false,
            error: {
                code: 10_001,
                message: "Fields must be unique",
                fields: user.error.meta?.target
            }
        }, 400)
    }

    const token = await sign({
        id: user.id
    }, process.env.AUTH_SECRET!);

    return c.json({
        ok: true,
        data: {
            ...user,
            token
        }
    });
}