import type { NextFunction, Request, Response } from "express";
import { auth } from "../utils/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db";

type ResponseType =
  | { success: true; userId: string }
  | { success: false; message: string };
export async function getCurrentUser(
  request: Request & { user?: { id: string } },
  response: Response<ResponseType>,
  next: NextFunction
) {
  console.log("headers in middleware: ", request.headers);
  const headers = fromNodeHeaders(request.headers);

  const session = await auth.api.getSession({
    headers,
  });
  try {
    if (!session)
      return response
        .status(400)
        .json({ success: false, message: "Not authenticated." });

    const userRecord = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, session.user.id),
    });

    if (!userRecord) {
      await auth.api.signOut({ headers });
      return response
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    request.user = { id: userRecord.id };

    next();
  } catch (error) {
    console.log("something went wrong.");
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
}
