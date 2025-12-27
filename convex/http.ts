import { Hono } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { zStorageId } from "./schema/utils";

const app: HonoWithConvex<ActionCtx> = new Hono();

app.get(
  "/character/image/:storageId",
  zValidator(
    "param",
    z.object({
      storageId: zStorageId,
    }),
  ),
  async (c) => {
    const { storageId } = c.req.valid("param");

    const url = await c.env.storage.getUrl(storageId);

    if (!url) return c.notFound();

    return c.redirect(url, 302);
  },
);

export default new HttpRouterWithHono(app);
