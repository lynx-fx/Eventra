"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "../../../service/axiosInstance";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/component/navBar";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/api/auth/validate-token?email=${email}&token=${token}`
        );
        setIsLoading(false);
        if (response.data.success) {
          setIsTokenVerified(true);
        } else {
          setIsTokenVerified(false);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
        toast.error("Error while validating token.");
      }
    };
    if (email && token) {
      checkToken();
    }
  }, [email, token]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass))
      return "Password must contain an uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain a number.";
    if (!/[!@#$%^&*]/.test(pass))
      return "Password must contain a special character (!@#$%^&*).";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/api/auth/reset-password", {
        email,
        password,
        token,
      });

      setIsLoading(false);
      if (response.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        toast.error(response.data.message || "Error while resetting password");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Error while resetting password.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-purple-500/30">
      <NavBar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden mt-24">
        {/* Background Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-screen
          bg-linear-to-t from-purple-900/50 from-20% via-transparent to-transparent pointer-events-none"
        />

        <div className="w-full max-w-md bg-card rounded-4xl p-10 border border-border shadow-2xl relative z-10">
          {!success ? (
            <>
              <div className="space-y-2 mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-serif tracking-tight">Reset Password</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enter your new password below. Make sure it's secure and contains at least 8 characters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1 relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-secondary border-none py-4 px-5 pr-12 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="space-y-1 relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-secondary border-none py-4 px-5 pr-12 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Password requirements:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className={password.length >= 8 ? "text-purple-400" : "text-muted-foreground"}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-purple-400" : "text-muted-foreground"}>
                      • One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-purple-400" : "text-muted-foreground"}>
                      • One number
                    </li>
                    <li className={/[!@#$%^&*]/.test(password) ? "text-purple-400" : "text-muted-foreground"}>
                      • One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isTokenVerified}
                  className="w-full py-4 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4dec] disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-serif shadow-[0_0_20px_rgba(109,93,252,0.3)] transition-all active:scale-[0.98] cursor-pointer disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting...
                    </>
                  ) : !isTokenVerified ? (
                    "Invalid Link"
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <div className="pt-2 text-center">
                  <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif text-foreground">
                  Success!
                </h2>
                <p className="text-muted-foreground text-sm">
                  Your password has been updated. Redirecting to login...
                </p>
              </div>
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full py-4 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4dec] text-white text-lg font-serif shadow-[0_0_20px_rgba(109,93,252,0.3)] transition-all active:scale-[0.98] cursor-pointer"
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
