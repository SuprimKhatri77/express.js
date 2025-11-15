import ResetPassword from "@/modules/auth/reset-password";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token || token === "") {
    return (
      <div>
        <h1>Missing token</h1>
      </div>
    );
  }

  return <ResetPassword token={token} />;
}
