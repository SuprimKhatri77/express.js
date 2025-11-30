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
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export default function ForgetPassword() {
  const [email, setEmail] = useState<string | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send reset password link.");
      const data = await res.json();
      return data.result;
    },
    onSuccess: (res: { success: boolean; message: string }) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setEmail("");
      toast.success(res.message);
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <div className="grid gap-4">
              <Field className="grid gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@mail.com"
                  type="email"
                  autoComplete="email"
                />
              </Field>
              <Button
                // type="submit"
                onClick={() => mutate()}
                disabled={isPending || !email || email === ""}
                className="w-full"
              >
                {isPending ? <Spinner /> : "Send Reset Link"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
