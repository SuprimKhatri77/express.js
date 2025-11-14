import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../db/schema.ts";
import { db } from "../../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
