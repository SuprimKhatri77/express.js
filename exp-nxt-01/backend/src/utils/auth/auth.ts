import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../db/schema.ts";
import { db } from "../../db";
import { sendEmail } from "../../lib/send-email.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    // requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendOnSignIn: false,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      const customVerificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Verify your Email",
        text: `
    Welcome to our app!
    
    To verify your account, please click the link below:
    ${customVerificationUrl}    
    If you did not sign up, please ignore this email.
  `,
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Welcome to Our App!</h2>
        <p>Thank you for signing up. Please click the button below to verify your account and get started:</p>
        
        <a href=${customVerificationUrl}
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify My Account
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #777;">
            If you did not sign up for this service, please disregard this email.
        </p>
    </div>
  `,
      });
    },
    expiresIn: 3600,
  },
  advanced: {
    defaultCookieAttributes: {
      secure: true,
      sameSite: "None",
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
