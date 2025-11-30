import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { signoutService } from "../../services/auth/signout.service";

export async function signoutController(request: Request, response: Response) {
  // console.log("cookies: ", request.headers.cookie);
  const headers = fromNodeHeaders(request.headers);
  try {
    const result = await signoutService(headers);
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
