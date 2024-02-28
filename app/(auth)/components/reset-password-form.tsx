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
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetPasswordSchema } from "@/schemas";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/actions/reset-password";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string;
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<StatusResponseDataType>();
  const [error, setError] = useState<StatusResponseDataType>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(() => {
      resetPassword(values, token).then((data?: StatusResponseType) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });

    if (error) {
      toast(error);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-4">
          <div>
            <Label htmlFor="password">New password</Label>
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
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <FormField
              control={form.control}
              name="confirmPassword"
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
            Confirm
          </Button>
        </form>
      </Form>
    </div>
  );
}
