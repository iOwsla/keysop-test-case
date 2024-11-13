import { Hono } from "hono";
import { del } from "./del";
import { get } from "./get";
import { patch } from "./patch";
import { put } from "./put";

export const router = new Hono()
  .get("/", get)
  .patch("/", patch)
  .delete("/", del)
  .put("/", put);