import { z } from "zod";
import type { Id } from "../_generated/dataModel";

export const zStorageId = z.custom<Id<"_storage">>(
  (val) => typeof val === "string" && val.startsWith("kg"),
  { message: "Invalid storage ID format" },
);
