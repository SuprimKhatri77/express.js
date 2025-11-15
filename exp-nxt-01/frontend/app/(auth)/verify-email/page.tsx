import { requireSession } from "@/lib/helpers/require-session";
import VerifyEmail from "@/modules/auth/verify-email";
import { SessionType } from "@/types/auth.types";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  if (token === "") {
    return (
      <div>
        <h1>Missing the verification token.</h1>
      </div>
    );
  }

  const result = await requireSession();
  if (!result.success) redirect("/");

  const { session }: { session: SessionType } = result;
  if (session.user.emailVerified) redirect("/dashboard");

  return <VerifyEmail email={session.user.email} token={token} />;
}
