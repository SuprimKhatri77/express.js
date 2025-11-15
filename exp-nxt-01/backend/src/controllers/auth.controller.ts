import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../utils/auth/auth";
import { APIError } from "better-auth/api";
import z from "zod";
import { db } from "../db";

export async function login(request: Request, response: Response) {
  console.log("incoming login request: ", request.body);
  const { email, password } = request.body;
  const headers = fromNodeHeaders(request.headers);

  try {
    const result = await authService.login(email, password, headers);
    console.log("cookie after login: ", result.cookies);
    if (result.success && result.cookies) {
      console.log("cookie from login: ", result.cookies);
      response.setHeader("Set-Cookie", result.cookies);
    }
    return response.status(200).json({ result });
  } catch (error) {
    console.log("error");
    return response.status(401).json({
      result: {
        success: false,
        message: "Something went wrong.",
      },
    });
  }
}

export async function singup(request: Request, response: Response) {
  console.log("incoming signup request: ", request.body);
  const { name, email, password } = request.body;
  const headers = fromNodeHeaders(request.headers);

  try {
    const result = await authService.signup(name, email, password, headers);
    if (result.success && result.cookies) {
      console.log("cookie from signup: ", result.cookies);
      response.setHeader("Set-Cookie", result.cookies);
    }
    return response.status(200).json({ result });
  } catch (error) {
    console.log("error: ", error);
    return response
      .status(401)
      .json({ result: { success: false, message: "Something went wrong." } });
  }
}

export async function signout(request: Request, response: Response) {
  // console.log("cookies: ", request.headers.cookie);
  const headers = fromNodeHeaders(request.headers);
  try {
    const result = await authService.signout(headers);
    if (result.success) {
      // response.setHeader("better-auth.session_token", "");
      response.clearCookie("better-auth.session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        path: "/",
      });
    }
    return response.status(200).json({ result });
  } catch (error) {
    console.log("error: ", error);
    return response.status(401).send({
      result: {
        success: false,
        message: "Something went wrong.",
      },
    });
  }
}

export async function getUserSessionController(
  request: Request,
  response: Response
) {
  // console.log("incoming request for session: ", request.headers);
  const headers = fromNodeHeaders(request.headers);
  try {
    const result = await authService.getUserSession(headers);
    return response.status(200).json({ result });
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
    };
  }
}

export async function verifyEmail(
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
    // const tokenRecord = await db.query.verification.findFirst({
    //   where: (fields, { eq }) => eq(fields.value, token),
    // });
    // console.log("token record: ", tokenRecord);
    // if (!tokenRecord)
    //   return response
    //     .status(400)
    //     .json({ result: { success: false, message: "Invalid token!" } });
    // if (tokenRecord.expiresAt <= new Date())
    //   return response
    //     .status(400)
    //     .json({ result: { success: false, message: "Token expired!" } });
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

export async function resendVerificationEmail(
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

export async function forgotPassword(
  request: Request<{}, {}, { email: string }>,
  response: Response<{ result: { success: boolean; message: string } }>
) {
  const { email } = request.body;
  const emailSchema = z.object({
    email: z.email().trim().nonempty("Email is required"),
  });
  const validateEmail = emailSchema.safeParse({ email });
  if (!validateEmail.success) {
    return response.status(400).json({
      result: {
        success: false,
        message:
          z.treeifyError(validateEmail.error).properties?.email?.errors[0] ||
          "Email is required",
      },
    });
  }

  const { email: validatedEmail } = validateEmail.data;
  try {
    await auth.api.requestPasswordReset({
      body: {
        email: validatedEmail,
      },
    });
    return response.status(200).json({
      result: { success: true, message: "Reset password link sent." },
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

export async function resetPassword(
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
