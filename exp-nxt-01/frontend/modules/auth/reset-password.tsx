"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export default function ResetPassword({ token }: { token: string }) {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/reset-password?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Failed to reset password.");
      const data = await res.json();
      return data.result;
    },
    onSuccess: (res: { success: boolean; message: string }) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      router.push("/login");
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const handleClick = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Password cannot be empty.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password don't match.");
      return;
    }

    return mutate();
  };
  return (
    <div className="flex min-h-screen h-full w-full items-center justify-center px-4">
      <Card className="max-w-2xl w-full py-10">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <div className="grid gap-4">
              <Field className="grid gap-2">
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Field>

              <Field className="grid gap-2">
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </Field>

              <Button
                onClick={handleClick}
                className="w-full"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "Reset Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
