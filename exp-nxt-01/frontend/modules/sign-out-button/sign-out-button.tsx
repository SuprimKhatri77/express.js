"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SignoutResponse } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export function SignoutButton() {
  const router = useRouter();
  const { mutate, isPending, reset } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error logging out.");
      const data = await res.json();
      return data.result;
    },
    onSuccess: (res: SignoutResponse) => {
      if (!res.success) {
        toast.error(res.message);
        reset();
        return;
      }

      toast.success(res.message);
      router.push(res.redirectTo as string);
      reset();
    },
    onError: () => {
      toast.error("Something went wrong.");
      reset();
    },
  });
  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? <Spinner /> : "Logout"}
    </Button>
  );
}
