import { CharacterRawValidator } from "../schema/character";
import { zCustomMutation } from "convex-helpers/server/zod4";
import { NoOp } from "convex-helpers/server/customFunctions";
import { internalMutation } from "../_generated/server";
import z from "zod";

const zInternalMutation = zCustomMutation(internalMutation, NoOp);

export const insert = zInternalMutation({
  args: {
    character: CharacterRawValidator,
  },
  handler: async (ctx, { character }) => {
    const id = await ctx.db.insert("character", character);
    const doc = await ctx.db.get(id);
    return doc;
  },
});

export const patchMaxCounter = zInternalMutation({
  args: {
    counter: z.number(),
  },
  handler: async (ctx, { counter }) => {
    const existing = await ctx.db.query("characterNumber").first();

    if (existing) {
      if (existing.number !== counter)
        await ctx.db.patch(existing._id, { number: counter });
    } else {
      await ctx.db.insert("characterNumber", { number: counter });
    }
  },
});
