import type { Request, Response } from "express";
import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";
import z from "zod";

export async function resetPasswordController(
  request: Request<{}, {}, { password: string }, { token: string }>,
  response: Response<{ result: { success: boolean; message: string } }>
) {
  const { token } = request.query;
  if (!token) {
    return response
      .status(400)
      .json({ result: { success: false, message: "Missing token." } });
  }
  const { password } = request.body;

  const passwordSchema = z.object({
    password: z.string().trim().min(3).nonempty(),
  });

  const validatePassword = passwordSchema.safeParse({ password });
  if (!validatePassword.success) {
    return response.status(400).json({
      result: {
        success: false,
        message:
          z.treeifyError(validatePassword.error).properties?.password
            ?.errors[0] || "Password validation failed",
      },
    });
  }

  const { password: validatedPassword } = validatePassword.data;

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: validatedPassword,
        token,
      },
    });
    return response.status(200).json({
      result: {
        success: true,
        message: "Password updated successfully",
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      console.log("error message: ", error.message);
      return response
        .status(error.statusCode)
        .json({ result: { success: false, message: error.message } });
    }
    console.log("error: ", error);
    return response
      .status(500)
      .json({ result: { success: false, message: "Something went wrong." } });
  }
}
