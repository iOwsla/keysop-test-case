import { Hono } from "hono";
import { post } from "./post";

export const router = new Hono()
    .post("/", post);