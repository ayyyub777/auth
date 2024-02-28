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
import { EmailSchema } from "@/schemas";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sendResetToken } from "@/actions/send-reset-token";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ResetFormProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultEmail?: string | null;
}

export function ResetForm({
  defaultEmail,
  className,
  ...props
}: ResetFormProps) {
  const [success, setSuccess] = useState<StatusResponseDataType>();
  const [error, setError] = useState<StatusResponseDataType>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: defaultEmail ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof EmailSchema>) => {
    startTransition(() => {
      sendResetToken(values).then((data?: StatusResponseType) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });

    if (error) {
      toast(error);
    } else if (success) {
      toast(success);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input disabled={isPending} placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset instructions
          </Button>
        </form>
      </Form>
    </div>
  );
}
