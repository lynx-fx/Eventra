"use client";

import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../service/axiosInstance";

export default function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter your email");
    } else if (!email.includes("@")) {
      setError("Please enter a valid email");
    } else {
      try {
        const response = await axiosInstance.get(
          `/api/auth/forgot-password?email=${email}`
        );
        setIsLoading(false);

        if (response.data.success) {
          setSubmitted(true);
          toast.success(
            response.data.message || "Reset mail sent successfully."
          );
        } else {
          toast.error(
            response.data.message || "Error while sending reset mail."
          );
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">
              Reset password
            </h2>
            <p className="text-slate-300 text-sm mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 border border-slate-600 text-slate-200 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-200"
              >
                Back to login
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Check your email</h2>
            <p className="text-slate-300">
              We've sent a password reset link to{" "}
              <span className="font-semibold text-slate-200">{email}</span>
            </p>
            <p className="text-sm text-slate-400">
              Didn't receive it? Check your spam folder or try another email.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
