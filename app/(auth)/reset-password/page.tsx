"use client";

import { ResetForm } from "../components/reset-form";
import { ResetPasswordForm } from "../components/reset-password-form";
import { useSearchParams } from "next/navigation";

export default function VerificationPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  return token ? (
    <>
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Create new password
        </h1>
        <p className="text-md text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </>
  ) : (
    <>
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-md text-muted-foreground">
          Include the email address associated with your account and we&apos;ll
          send you an email with instructions to reset your password.
        </p>
      </div>
      <ResetForm defaultEmail={email} />
    </>
  );
}
