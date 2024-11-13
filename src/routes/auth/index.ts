import { Hono } from "hono";
import { router as signUpRouter } from "./sign-up";
import { router as signInRouter } from "./sign-in";

export const router = new Hono()
    .route("/sign-up", signUpRouter)
    .route("/sign-in", signInRouter);