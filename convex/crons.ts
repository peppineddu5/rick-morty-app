import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "patch max character number",
  "0 8 * * *",
  internal.character.action.patchMaxNumber,
);

export default crons;
