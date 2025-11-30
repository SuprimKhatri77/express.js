import type { Request, Response } from "express";
import z from "zod";
import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";

export async function verifyEmailController(
  request: Request<{}, {}, {}, { token?: string }>,
  response: Response<{ result: { success: boolean; message: string } }>
) {
  console.log("incoming request");

  const { token } = request.query;
  console.log("token: ", token);
  if (!token) {
    return response.status(400).json({
      result: {
        success: false,
        message: "Missing token",
      },
    });
  }
  const querySchema = z.object({
    token: z.string().trim().min(1, "token is required"),
  });
  const validateToken = querySchema.safeParse({ token });
  if (!validateToken.success) {
    return response.status(400).json({
      result: {
        success: false,
        message:
          z.treeifyError(validateToken.error).properties?.token?.errors[0] ||
          "Missing token.",
      },
    });
  }
  const { token: validatedToken } = validateToken.data;

  try {
    await auth.api.verifyEmail({
      query: {
        token: validatedToken,
      },
    });
    return response.status(200).json({
      result: { success: true, message: "Email verified successfully." },
    });
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof APIError) {
      console.log("errror message: ", error.message);
      return response
        .status(error.statusCode)
        .json({ result: { success: false, message: error.message } });
    }
    return response
      .status(500)
      .json({ result: { success: false, message: "Something went wrong." } });
  }
}
