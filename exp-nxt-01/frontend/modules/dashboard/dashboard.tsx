import { SessionType } from "@/types/auth.types";
import { SignoutButton } from "../sign-out-button/sign-out-button";

type Props = {
  session: SessionType | null;
};
export function Dashboard({ session }: Props) {
  return (
    <div className="flex flex-col gap-5 min-h-screen justify-center items-center">
      <h1>Hello, {session?.user.name}!</h1>
      <SignoutButton />
    </div>
  );
}
