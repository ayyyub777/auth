"use client";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { StatusResponseDataType, StatusResponseType } from "@/types";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import EmailSent from "./email-sent";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { RegisterSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import { postSigninRedirect } from "@/routes";
import { register } from "@/actions/register";
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Register({ className, ...props }: RegisterFormProps) {
  const [success, setSuccess] = useState<StatusResponseDataType>();
  const [error, setError] = useState<StatusResponseDataType>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data?: StatusResponseType) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });

    if (error) {
      toast(error);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl: postSigninRedirect });
  };

  return success ? (
    <EmailSent />
  ) : (
    <>
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Create an account
        </h1>
        <div className="text-md">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link href="/signin" className="underline">
            Sign In
          </Link>
        </div>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="example@domain.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isPending}>
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create account
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isPending}
          onClick={() => handleOAuth("google")}
        >
          <Icons.google className="mr-2 h-4 w-4" /> Google
        </Button>
      </div>
    </>
  );
}
