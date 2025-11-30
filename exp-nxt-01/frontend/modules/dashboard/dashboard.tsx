"use client";

import { SessionType } from "@/types/auth.types";
import { SignoutButton } from "../sign-out-button/sign-out-button";
import { CreateBlogDialog } from "../blogs/create-blog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  session: SessionType;
  sessionToken: string | null;
};
export function Dashboard({ session, sessionToken }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-5 min-h-screen justify-center items-center">
      <h1>Hello, {session.user.name}!</h1>
      <SignoutButton />
      <Link
        href="/blogs"
        className="bg-violet-400 py-2 px-5 rounded-lg hover:bg-violet-500 transition-all duration-300"
      >
        Blogs
      </Link>
      <Button onClick={() => setShowCreateDialog(true)} variant="outline">
        Create Blog
      </Button>
      <div className={cn(showCreateDialog ? "block" : "hidden")}>
        <CreateBlogDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          sessionToken={sessionToken}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
