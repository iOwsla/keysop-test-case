import { Hono } from "hono";
import { get } from "./get";
import { patch } from "./patch";
import { del } from "./delete";
import { book as bookMiddleware } from "../../../middlewares/book";
import { router as rateRouter } from './rate'

export const router = new Hono()
    .use(bookMiddleware)
    .route("/rate", rateRouter)
    .get("/", get)
    .patch("/", patch)
    .delete("/", del);