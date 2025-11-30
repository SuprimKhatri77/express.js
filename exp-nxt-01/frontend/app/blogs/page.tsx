import { requireSession } from "@/lib/helpers/require-session";
import { Blogs } from "@/modules/blogs/Blogs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const result = await requireSession();
  if (!result.success) redirect("/");

  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("better-auth.session_token")?.value ?? "";

  return <Blogs userId={result.session.user.id} sessionToken={sessionToken} />;
}
