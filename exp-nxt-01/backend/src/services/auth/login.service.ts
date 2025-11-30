import type { fromNodeHeaders } from "better-auth/node";
import type { LoginResponse } from "../../types/auth.types";
import z from "zod";
import { db } from "../../db";
import { user } from "../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";

export async function loginService(
  email: string,
  password: string,
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<LoginResponse> {
  const loginSchema = z.object({
    email: z.email().nonempty("Email is required"),
    password: z.string().nonempty(),
  });
  const validateFields = loginSchema.safeParse({
    email: email,
    password: password,
  });
  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error);
    return {
      success: false,
      message: "Validation failed.",
      inputs: { email: email, password: password },
      errors: {
        properties: {
          email: tree.properties?.email?.errors,
          password: tree.properties?.password?.errors,
        },
      },
    };
  }

  const { email: validatedEmail, password: validatedPassword } =
    validateFields.data;

  try {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (!userRecord) return { success: false, message: "User not found." };

    const { headers: responseHeaders } = await auth.api.signInEmail({
      returnHeaders: true,
      body: {
        email: validatedEmail,
        password: validatedPassword,
        rememberMe: true,
      },
      headers,
    });

    const setCookieHeader = responseHeaders.get("set-cookie");

    return {
      success: true,
      message: "Logged in successfully.",
      redirectTo: "/dashboard",
      cookies: setCookieHeader,
    };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
        inputs: {
          email: email,
          password: password,
        },
      };
    }

    return {
      success: false,
      message: "Something went wrong.",
      inputs: {
        email: email,
        password: password,
      },
    };
  }
}
