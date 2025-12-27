import { Doc } from "../_generated/dataModel";
import { zodToConvex } from "convex-helpers/server/zod4"; // Use the value, not the type
import z from "zod";
import { WithoutSystemFields } from "convex/server";
import { zStorageId } from "./utils";

export const BaseCharacterRawValidator = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  species: z.string(),
  type: z.string(),
  gender: z.enum(["Male", "Female", "Genderless", "unknown"]),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  imageId: z.string(),
  episode: z.array(z.string()),
  url: z.string(),
  created: z.string(),
});
export const CharacterRawValidator = BaseCharacterRawValidator.extend({
  imageId: zStorageId,
});

export const CharacterConvexValidator = zodToConvex(BaseCharacterRawValidator);

export type Character = Doc<"character">;
export type CharacterCreate = WithoutSystemFields<Character>;
