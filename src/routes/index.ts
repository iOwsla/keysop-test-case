import { router as authRouter } from "./auth";
import { router as bookRouter } from "./book";
import { Hono } from "hono";

export const router = new Hono()
    .route("/auth", authRouter)
    .route("/book", bookRouter)