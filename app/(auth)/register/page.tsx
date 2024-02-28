import { Icons } from "@/components/icons";
import { Register } from "../components/register";
import { Suspense } from "react";

const RegisterPage = () => {
  return (
    <Suspense
      fallback={<Icons.spinner className="m-auto h-4 w-4 animate-spin" />}
    >
      <Register />
    </Suspense>
  );
};

export default RegisterPage;
