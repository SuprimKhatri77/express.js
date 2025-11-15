"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export default function VerifyEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const from = params.get("from");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/verify-email?token=${token}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to verify email.");
      const data = await res.json();
      return data.result;
    },
    onSuccess: (res: { success: boolean; message: string }) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  useEffect(() => {
    if (!token) return;
    mutate();
  }, [token, mutate]);

  const { mutate: resendVerificationEmail, isPending: isLoading } = useMutation(
    {
      mutationFn: async () => {
        const res = await fetch(`${API_URL}/api/resend-verification-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to resend verification email.");
        const data = await res.json();

        return data.result;
      },
      onSuccess: (res: { success: boolean; message: string }) => {
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success(res.message);
      },
      onError: (error) => {
        console.log("error: ", error);
        toast.error("Something went wrong.");
      },
    }
  );

  if (from === "signup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 via-white to-emerald-50 p-4">
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Verification email sent! 🎉
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              We&apos;ve sent a link to{" "}
              <span className="font-medium text-green-700">{email}</span>.
              Please check your inbox and click the link to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-center text-gray-700">
                Didn&apos;t receive the email?
              </p>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium">
              {isPending ? "Sending..." : "Resend Verification Email"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Wrong email address?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Logout and try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-green-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Email verification required
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Your email{" "}
            <span className="font-medium text-green-700">{email}</span> is not
            verified. Please check your inbox and click the verification link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-center text-gray-700">
              Didn&apos;t receive the email?
            </p>
          </div>
          {isPending ? (
            <div className="flex flex-col items-center gap-4">
              <Button disabled size="sm">
                <Spinner />
                Verifying...
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => resendVerificationEmail()}
              disabled={isPending || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isLoading ? <Spinner /> : "Resend Verification Email"}
            </Button>
          )}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Wrong email address?
              </span>
            </div>
          </div>

          {!isPending && (
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Logout and try again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
