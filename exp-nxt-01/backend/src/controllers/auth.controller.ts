import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { fromNodeHeaders } from "better-auth/node";

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
  console.log("incoming request for session: ", request.headers);
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
