import { Suspense } from "react";
import VerifyEmail from "./verifyEmail";
import { Loader2 } from "lucide-react";
import NavBar from "@/component/navBar";

function VerifyLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <NavBar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading verification page...</p>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyEmail />
    </Suspense>
  );
}