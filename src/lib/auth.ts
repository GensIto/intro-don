import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "cloudflare:workers";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    spotify: {
      clientId: env.SPOTIFY_CLIENT_ID as string,
      clientSecret: env.SPOTIFY_CLIENT_SECRET as string,
    },
  },
  plugins: [tanstackStartCookies()],
});
