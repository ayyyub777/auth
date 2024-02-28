"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/verify-email";

export default function EmailConfirmationPage() {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) return;
    if (!token) return;

    startTransition(() => {
      verifyEmail(token)
        .then((data) => {
          setError(data?.error);
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  return (
    <>
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Account confirmation
        </h1>
        <div className="text-md text-muted-foreground">
          To confirm your account, please click the button below.
        </div>
      </div>
      <form onSubmit={onSubmit} className=" grid gap-2">
        <Button disabled={isPending}>
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Confirm account
        </Button>
      </form>
    </>
  );
}
