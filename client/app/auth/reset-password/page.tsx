import { Suspense } from "react";
import ResetPassword from "./resetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset page...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
