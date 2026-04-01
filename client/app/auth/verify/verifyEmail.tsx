"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../../service/axiosInstance";
import { useSearchParams, useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-linear-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-linear-to-br from-orange-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <a href="/">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Eventra
            </h1>
          </a>
          <p className="text-slate-400 text-lg">Email Verification</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              <p className="text-slate-300">Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-slate-300">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <button
                onClick={handleGoToLogin}
                className="w-full bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
              <p className="text-slate-300">{error}</p>
              <button
                onClick={handleGoToLogin}
                className="w-full bg-linear-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}