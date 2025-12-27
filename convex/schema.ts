import { defineSchema, defineTable } from "convex/server";
import { CharacterRawValidator } from "./schema/character";
import { v } from "convex/values";

export default defineSchema({
  character: defineTable(CharacterRawValidator)
    .index("by_charachter_id", ["id"])
    .searchIndex("search_name", {
      searchField: "name",
    }),
  characterNumber: defineTable(
    v.object({
      number: v.number(),
    }),
  ),
});
