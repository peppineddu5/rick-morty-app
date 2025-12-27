import { Hono } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

const app: HonoWithConvex<ActionCtx> = new Hono();

const imageParamSchema = z.object({
  storageId: z // zid do not support the "_storage"
    .string()
    .refine((val): val is Id<"_storage"> => val.startsWith("kg"), {
      message: "Invalid storage ID format",
    }),
});

app.get(
  "/character/image/:storageId",
  zValidator("param", imageParamSchema),
  async (c) => {
    const { storageId } = c.req.valid("param");

    const url = await c.env.storage.getUrl(storageId as Id<"_storage">);

    if (!url) {
      return c.notFound();
    }

    return c.redirect(url, 302);
  },
);

export default new HttpRouterWithHono(app);
