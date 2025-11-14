"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export async function requireSession() {
  console.log(`api url: ${API_URL}/api/get-user-session`);
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ?? "";
  console.log("session token value: ", sessionToken);
  const res = await fetch(`${API_URL}/api/get-user-session`, {
    method: "GET",
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });
  // console.log("response: ", res);
  if (!res.ok) return { success: false, session: null };
  const data = await res.json();
  console.log("data: ", data);
  return { success: data.result.success, session: data.result.session };
}
