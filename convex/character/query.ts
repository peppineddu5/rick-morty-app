import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";

export const get = internalQuery({
  args: {
    id: v.number(),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db
      .query("character")
      .withIndex("by_charachter_id", (q) => q.eq("id", id))
      .first();
  },
});

export const gets = internalQuery({
  args: {
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, { from, to }) => {
    return await ctx.db
      .query("character")
      .withIndex("by_charachter_id", (q) => q.gte("id", from).lte("id", to))
      .collect();
  },
});

export const getMax = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("characterNumber").first())?.number;
  },
});

export const search = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    return await ctx.db
      .query("character")
      .withSearchIndex("search_name", (q) => q.search("name", name))
      .take(10);
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
