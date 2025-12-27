"use node";
import { ConvexError, v } from "convex/values";
import { api, internal } from "../_generated/api";
import { action, internalAction } from "../_generated/server";
import { Character } from "../schema/character";
import { Id } from "../_generated/dataModel";

export const get = action({
  args: {
    id: v.number(),
  },
  handler: async (ctx, { id }): Promise<Character | null> => {
    const maxId = await ctx.runQuery(api.character.query.getMax);

    if (!maxId) throw new ConvexError("No max id found");

    if (id > maxId) return null;

    const existing = await ctx.runQuery(internal.character.query.get, {
      id,
    });

    if (existing) {
      return existing;
    }

    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!res.ok) throw new ConvexError("Fetch error");
    const character = await res.json();

    const storageId: Id<"_storage"> = await ctx.runAction(
      internal.character.action.saveImageFromUrl,
      { url: character.image },
    );

    const inserted = await ctx.runMutation(internal.character.mutation.insert, {
      character: {
        ...character,
        imageId: storageId,
        image: undefined,
      },
    });

    if (!inserted) throw new ConvexError("impossible error");

    return inserted;
  },
});

export const gets = action({
  args: {
    from: v.number(),
    to: v.number(),
  },
  handler: async (ctx, { from, to }): Promise<Character[]> => {
    const maxId = await ctx.runQuery(api.character.query.getMax);

    if (!maxId) throw new ConvexError("No max id found");

    if (from > maxId) throw new ConvexError("Invalid input");

    const charachterArr = await ctx.runQuery(internal.character.query.gets, {
      from: from,
      to: Math.min(to, maxId),
    });

    const missingIds: Promise<Character | null>[] = [];
    const existingIds = new Set(charachterArr.map((char) => char.id));

    for (let id = from; id <= Math.min(to, maxId); id++) {
      if (!existingIds.has(id)) {
        missingIds.push(ctx.runAction(api.character.action.get, { id }));
      }
    }
    try {
      const charachters = await Promise.all(missingIds);
      return [...charachterArr, ...charachters.filter((c) => c !== null)];
    } catch (e) {
      if (charachterArr.length !== 0) return charachterArr;

      throw e;
    }
  },
});

export const patchMaxNumber = internalAction({
  args: {},
  handler: async (ctx) => {
    const res = await fetch(`https://rickandmortyapi.com/api/character`);
    if (!res.ok) throw new ConvexError("Fetch error");
    const data = await res.json();
    const counter = data.info?.count;
    await ctx.runMutation(internal.character.mutation.patchMaxCounter, {
      counter: counter,
    });
  },
});

export const saveImageFromUrl = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    const imageRes = await fetch(url);
    if (!imageRes.ok) throw new ConvexError("Image fetch error");

    const imageBlob = await imageRes.blob();

    return await ctx.storage.store(imageBlob);
  },
});
