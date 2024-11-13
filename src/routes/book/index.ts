import { Hono } from "hono";
import { auth as authMiddleware } from "../../middlewares/auth";
import { get } from "./get";
import { put } from "./put";
import { router as idRouter } from "./[bookId]"

export const router = new Hono()
    .use(authMiddleware)
    .route("/:bookId", idRouter)
    .get("/", get)
    .put("/", put)
    
    
  