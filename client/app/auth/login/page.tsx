"use client";

import Link from "next/link"
import NavBar from "../../component/navBar"
import { toast } from "sonner";
import { useState } from "react";
import axiosInstance from "../../../service/axiosInstance";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import ForgotPassword from "./forgotPassword"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isFallenActive, setIsFallenActive] = useState<Boolean>(false);
  const router = useRouter();


  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      if (!formData.email || !formData.password) {
        toast.info("Please fill in all fields");
        return;
      }

      // DONE: Make api calls here
      const { data } = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (data.success) {
        Cookies.set("auth", data.token, { expires: 30 });
        toast.success(data.message || "Login successful");
        router.push(data.redirect || "/dashboard");
        toast.success("Login successful");
      } else {
        toast.info(data.message || "Error while logging in");
      }

    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setFormData({
        email: "",
        password: ""
      })
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const responseGoogle = async (res: TokenResponse | { code?: string }) => {
    try {
      setIsLoading(true);
      if ("code" in res && res.code) {
        const code = res.code;
        const { data } = await axiosInstance.post(
          `/api/auth/google-login`,
          {
            code,
          }
        );
        if (data.success) {
          Cookies.set("auth", data.token, { expires: 30 });
          toast.success(data.message || "Login successful");
          router.push(data.redirect || "/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (err) {
      toast.error("Login failed, try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: unknown) => {
    console.error("Google OAuth Error:", error);
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  const toogleForgotModel = () => {
    setIsFallenActive(!isFallenActive);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-purple-500/30">
      <NavBar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden mt-24">
        {/* Background Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-screen
  bg-linear-to-t from-purple-900/50 from-20% via-transparent to-transparent pointer-events-none"
        />

        <div className="w-full max-w-md bg-[#111113] rounded-4xl p-10 border border-white/5 shadow-2xl relative z-10">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-serif tracking-tight">Login</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sign in to access your account with your google or use you Eventra account.
            </p>
          </div>

          {
            isFallenActive && <ForgotPassword onClose={toogleForgotModel} />
          }

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl bg-[#1c1c1e] border border-transparent hover:bg-[#2c2c2e] transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-medium text-gray-200 group-hover:text-white">Continue with Google</span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="grow border-t border-white/10"></div>
                <span className="shrink mx-4 text-xs text-gray-500 uppercase tracking-widest">or</span>
                <div className="grow border-t border-white/10"></div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full bg-[#1c1c1e] border-none py-4 px-5 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full bg-[#1c1c1e] border-none py-4 px-5 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4dec] disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-serif shadow-[0_0_20px_rgba(109,93,252,0.3)] transition-all active:scale-[0.98] cursor-pointer disabled:active:scale-100"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="pt-2">
                <div onClick={toogleForgotModel} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Forgot Password?
                </div>
              </div>



              <div className="border-t border-white/10 pt-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Need a new account?</span>
                <Link href="/auth/signup" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}