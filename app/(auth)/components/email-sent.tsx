import { MailCheck } from "lucide-react";

const EmailSent = () => {
  return (
    <div className="m-auto max-w-48 flex flex-col space-y-2 items-center">
      <MailCheck className="h-8 w-8" />
      <div className="flex flex-col space-y-1 items-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Check your email
        </h1>
        <div className="text-md text-muted-foreground text-center">
          We sent you an email with a confirmation link.
        </div>
      </div>
    </div>
  );
};

export default EmailSent;
