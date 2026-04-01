"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../../service/axiosInstance";
import { useSearchParams, useRouter } from "next/navigation";
import NavBar from "@/component/navBar";

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email || !token) {
        setError("Invalid verification link. Missing email or token.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/api/auth/verify?email=${email}&token=${token}`
        );
        if (response.data.success) {
          setIsVerified(true);
          toast.success("Email verified successfully!");
        } else {
          setError(response.data.message || "Verification failed.");
        }
      } catch (err: any) {
        console.log(err);
        setError(err.response?.data?.message || "Error verifying email.");
        toast.error("Error verifying email.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [email, token]);

  const handleGoToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-purple-500/30">
      <NavBar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden mt-24">
        {/* Background Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-screen
  bg-linear-to-t from-purple-900/50 from-20% via-transparent to-transparent pointer-events-none"
        />

        <div className="w-full max-w-md bg-card rounded-4xl p-10 border border-border shadow-2xl relative z-10 text-center">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-serif tracking-tight">Email Verification</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Verifying your account details for Eventra.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[160px]">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-green-500/10 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Email Verified!</h2>
                <p className="text-muted-foreground text-sm">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
              <button
                onClick={handleGoToLogin}
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-serif shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="w-16 h-16 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-destructive">Verification Failed</h2>
                <p className="text-muted-foreground text-sm">{error}</p>
              </div>
              <button
                onClick={handleGoToLogin}
                className="w-full py-4 rounded-xl bg-secondary border border-border hover:bg-secondary/80 text-foreground text-lg font-serif transition-all active:scale-[0.98] cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}