import type { Request, Response } from "express";

import { fromNodeHeaders } from "better-auth/node";
import { getUserSessionService } from "../../services/auth/getUserSession.service";

export async function getUserSessionController(
  request: Request,
  response: Response
) {
  // console.log("incoming request for session: ", request.headers);
  const headers = fromNodeHeaders(request.headers);
  try {
    const result = await getUserSessionService(headers);
    return response.status(200).json({ result });
  } catch (error) {
    console.log("error: ", error);
    return {
      success: false,
    };
  }
}
