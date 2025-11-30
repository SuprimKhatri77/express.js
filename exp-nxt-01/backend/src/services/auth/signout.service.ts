import type { fromNodeHeaders } from "better-auth/node";
import type { SignoutResponse } from "../../types/auth.types";
import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";

export async function signoutService(
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
