import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";
import { signupService } from "../../services/auth/signup.service";

export async function signupController(request: Request, response: Response) {
  //   console.log("incoming signup request: ", request.body);
  const { name, email, password } = request.body;
  const headers = fromNodeHeaders(request.headers);

  try {
    const result = await signupService(name, email, password, headers);
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
