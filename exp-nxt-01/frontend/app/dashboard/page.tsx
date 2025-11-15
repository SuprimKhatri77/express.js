import { requireSession } from "@/lib/helpers/require-session";
import { Dashboard } from "@/modules/dashboard/dashboard";
import { redirect } from "next/navigation";

export default async function Page() {
  const result = await requireSession();
  if (!result.success) redirect("/");

  if (!result.session.user.emailVerified) redirect("/verify-email");

  return <Dashboard session={result.session} />;
}
