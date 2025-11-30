import type { fromNodeHeaders } from "better-auth/node";
import type { LoginResponse, SignupResponse } from "../../types/auth.types";
import z from "zod";

import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";

export async function signupService(
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
    const { headers: responseHeaders } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        name: validatedName,
        email: validatedEmail,
        password: validatedPassword,
        rememberMe: true,
      },
      headers,
    });

    const setCookieHeader = responseHeaders.get("set-cookie");
    await auth.api.sendVerificationEmail({
      body: {
        email: validatedEmail,
      },
    });
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
