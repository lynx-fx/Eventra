"use client";

import { useState, FormEvent } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../../service/axiosInstance";

interface Props {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email");
      setIsLoading(false);
    } else if (!email.includes("@")) {
      setError("Please enter a valid email");
      setIsLoading(false);
    } else {
      try {
        const response = await axiosInstance.get(
          `/api/auth/forgot-password?email=${email}`
        );

        if (response.data.success) {
          setSubmitted(true);
          toast.success(
            response.data.message || "Reset mail sent successfully."
          );
        } else {
          toast.info(
            response.data.message || "Error while sending reset mail."
          );
        }
      } catch (err) {
        const Err = err as Error;
        console.log(Err.message);
        toast.info("Failed to send reset link. Please try again.");
      } finally{
        setIsLoading(false);
        setEmail("");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 min-h-screen min-w-screen">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full h-full max-w-lg max-h-[70vh]">
        <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 to-blue-900/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-xl transition-all duration-200 z-50"
          >
            <X className="w-6 h-6 text-white/80 hover:text-white" />
          </button>

          <div className="h-full w-full p-8 flex flex-col justify-center">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Reset Password
                </h2>
                <p className="text-white/70 text-base mb-8">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-semibold text-white/90"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                      <input
                        id="reset-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 transition-all duration-200"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 px-4 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-4 px-4 border border-white/20 text-white/80 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-8">
                <div className="w-20 h-20 bg-linear-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10 text-purple-300" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white">Check Your Email</h2>
                  <p className="text-white/70 text-lg">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold text-white">{email}</span>
                  </p>
                  <p className="text-sm text-white/50">
                    Didn't receive it? Check your spam folder or try another email.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-4 px-4 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-500/25"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}