import type { Request, Response } from "express";
import z from "zod";
import { auth } from "../../utils/auth/auth";
import { APIError } from "better-auth/api";

export async function resendVerificationEmailController(
  request: Request<{}, {}, { email: string }>,
  response: Response<{ result: { success: boolean; message: string } }>
) {
  const { email } = request.body;
  console.log("email: ", email);
  const emailSchema = z.object({ email: z.email().nonempty("Missing email.") });
  const validateEmail = emailSchema.safeParse({ email });
  if (!validateEmail.success) {
    return response.status(400).json({
      result: {
        success: false,
        message:
          z.treeifyError(validateEmail.error).properties?.email?.errors[0] ||
          "Missing email.",
      },
    });
  }
  console.log("validation completed");
  const { email: validatedEmail } = validateEmail.data;
  console.log("validated email: ", validateEmail);
  try {
    await auth.api.sendVerificationEmail({
      body: {
        email: validatedEmail,
      },
    });
    return response
      .status(200)
      .json({ result: { success: true, message: "Verification email sent." } });
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
