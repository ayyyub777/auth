import { Icons } from "@/components/icons";
import { SignIn } from "../components/signin";
import { Suspense } from "react";

const SignInPage = () => {
  return (
    <Suspense
      fallback={<Icons.spinner className="m-auto h-4 w-4 animate-spin" />}
    >
      <SignIn />
    </Suspense>
  );
};

export default SignInPage;
