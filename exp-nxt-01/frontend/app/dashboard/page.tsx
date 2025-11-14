import { requireSession } from "@/lib/helpers/require-session";
import { Dashboard } from "@/modules/dashboard/dashboard";
import { redirect } from "next/navigation";

export default async function Page() {
  console.log("calling the require session func now: ");
  const result = await requireSession();
  console.log("success,session", result.success, result.session);
  if (!result.success) redirect("/");
  console.log("success,session", result.success, result.session);

  return <Dashboard session={result.session} />;
}
