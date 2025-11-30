import { db } from "../../db";
import { auth } from "../../utils/auth/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { SessionType } from "../../types/auth.types";

export async function getUserSessionService(
  headers: ReturnType<typeof fromNodeHeaders>
): Promise<{ success: boolean; session: SessionType | null }> {
  // console.log("1. Starting getUserSession in service layer.");
  // console.log("cookie from header in service: ", headers);
  const session = await auth.api.getSession({
    headers,
  });
  // console.log("2. Result from getSession:", session ? "Found" : "Not Found");
  if (!session) {
    return {
      success: false,
      session: null,
    };
  }
  // console.log("3. Starting DB query for user record.");
  const userRecord = await db.query.user.findFirst({
    where: (fields, { eq }) => eq(fields.id, session.user.id),
  });
  // console.log("4. Result from DB query:", userRecord ? "Found" : "Not Found");
  if (!userRecord) {
    return {
      success: false,
      session: null,
    };
  }

  return { success: true, session };
}
