import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { loginService } from "../../services/auth/login.service";

export async function loginController(request: Request, response: Response) {
  console.log("incoming login request: ", request.body);
  const { email, password } = request.body;
  const headers = fromNodeHeaders(request.headers);

  try {
    const result = await loginService(email, password, headers);
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
