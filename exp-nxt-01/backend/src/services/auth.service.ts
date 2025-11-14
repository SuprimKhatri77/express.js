import type { Response, Request } from "express";
import z, { success } from "zod";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../utils/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import { APIError, sessionMiddleware } from "better-auth/api";
import type {
  LoginResponse,
  SessionType,
  SignoutResponse,
  SignupResponse,
} from "../types/auth.types";

export async function login(
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

    const { response, headers: responseHeaders } = await auth.api.signInEmail({
      body: {
        email: validatedEmail,
        password: validatedPassword,
        rememberMe: true,
      },
      headers,
      asResponse: true,
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

export async function signup(
  name: string,
  email: string,
  password: string,
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<SignupResponse> {
  const singupSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must contain atleast 5 characters")
      .nonempty("Name is required"),
    email: z.email().nonempty("Email is required"),
    password: z
      .string()
      .trim()
      .min(7, "Password must atleast contain 7 characters.")
      .max(15, "Password mustn't exceed more than 15 characters.")
      .nonempty("Password is required"),
  });
  const validateFields = singupSchema.safeParse({
    name,
    email,
    password,
  });
  if (!validateFields.success) {
    console.log("validation error: ", validateFields.error);
    const tree = z.treeifyError(validateFields.error);

    return {
      success: false,
      message: "Validation failed.",
      inputs: {
        name,
        email,
        password,
      },
      errors: {
        properties: {
          name: tree.properties?.name?.errors,
          password: tree.properties?.password?.errors,
          email: tree.properties?.email?.errors,
        },
      },
    };
  }

  const {
    name: validatedName,
    email: validatedEmail,
    password: validatedPassword,
  } = validateFields.data;
  try {
    const { response, headers: responseHeaders } = await auth.api.signUpEmail({
      body: {
        name: validatedName,
        email: validatedEmail,
        password: validatedPassword,
        rememberMe: true,
      },
      headers,
      asResponse: true,
    });

    const setCookieHeader = responseHeaders.get("set-cookie");
    return {
      success: true,
      message: "Signed up successfully.",
      redirectTo: "/dashboard",
      cookies: setCookieHeader,
    };
  } catch (error) {
    if (error instanceof APIError) {
      console.log("api error: ", error.message);
      return {
        success: false,
        message: error.message,
        inputs: { name, email, password },
      };
    }
    console.log("error: ", error);
    return {
      success: false,
      message: "Something went wrong.",
      inputs: { name, email, password },
    };
  }
}

export async function signout(
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<SignoutResponse> {
  try {
    await auth.api.signOut({
      headers,
    });

    return {
      success: true,
      message: "Signed out successfully.",
      redirectTo: "/",
    };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}

export async function getUserSession(
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<{ success: boolean; session: SessionType | null }> {
  console.log("1. Starting getUserSession in service layer.");
  console.log("cookie from header in service: ", headers);
  const session = await auth.api.getSession({
    headers,
  });
  console.log("2. Result from getSession:", session ? "Found" : "Not Found");
  if (!session) {
    return {
      success: false,
      session: null,
    };
  }
  console.log("3. Starting DB query for user record.");
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });
  console.log("4. Result from DB query:", userRecord ? "Found" : "Not Found");
  if (!userRecord) {
    return {
      success: false,
      session: null,
    };
  }

  return { success: true, session };
}
