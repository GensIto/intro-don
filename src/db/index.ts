import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";
import * as authSchema from "./schema";
import * as introsSchema from "./intros";

export const db = drizzle(env.DB, {
  schema: { ...authSchema, ...introsSchema },
});
