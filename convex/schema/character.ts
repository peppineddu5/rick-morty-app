import { Infer, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { ConvexValidatorFromZod } from "convex-helpers/server/zod3";

export const CharacterRawValidator = v.object({
  id: v.number(),
  name: v.string(),
  status: v.union(v.literal("Alive"), v.literal("Dead"), v.literal("unknown")),
  species: v.string(),
  type: v.string(),
  gender: v.union(
    v.literal("Male"),
    v.literal("Female"),
    v.literal("Genderless"),
    v.literal("unknown"),
  ),
  origin: v.object({
    name: v.string(),
    url: v.string(),
  }),
  location: v.object({
    name: v.string(),
    url: v.string(),
  }),
  imageId: v.id("_storage"),
  episode: v.array(v.string()),
  url: v.string(),
  created: v.string(),
});
export const CharacterValidator = CharacterRawValidator.extend({
  _id: v.id("character"),
  _creationTime: v.number(),
});
//ConvexValidatorFromZod(CharacterRawValidator)
export type CharacterRaw = Infer<typeof CharacterRawValidator>;
export type Character = Doc<"character">;
