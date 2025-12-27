import { v } from "convex/values";
import { CharacterRawValidator } from "../schema/character";
//import { zCustomMutation } from "convex-helpers/server/zod3";
//import { NoOp } from "convex-helpers/server/customFunctions";
import { internalMutation } from "../_generated/server";

//const zInternalMutation = zCustomMutation(internalMutation, NoOp);

export const insert = internalMutation({
  args: {
    character: CharacterRawValidator,
  },
  handler: async (ctx, { character }) => {
    const id = await ctx.db.insert("character", character);
    const doc = await ctx.db.get(id);
    return doc;
  },
});

export const patchMaxCounter = internalMutation({
  args: {
    counter: v.number(),
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
