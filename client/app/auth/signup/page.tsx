"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axiosInstance from "@/service/axiosInstance"
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import Cookies from "js-cookie"
import NavBar from "@/app/component/navBar"

export default function SignupPage() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validateForm = () => {
    if (!userDetails.name.trim()) return "Please enter your name"
    if (!userDetails.email.includes("@")) return "Please enter a valid email"
    if (userDetails.password !== userDetails.confirmPassword) return "Confirm password doesn't match"
    if (userDetails.password.length < 8) return "Password must be at least 8 characters"
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.post("/api/auth/signup", {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        userRole: "user",
      })

      if (data.success) {
        router.push(data.redirect)
        toast.success(data.message || "User created")
      } else {
        toast.error(data.message || "Signup failed")
      }
    } catch (err) {
      toast.error("Something went wrong while signing up.")
      console.log(err)
    } finally {
      setIsLoading(false)
      setUserDetails({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    }
  }

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


  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-purple-500/30">
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden mt-20 py-12">
        {/* Background Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-t from-purple-900/50 from-30% via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-md bg-[#111113] rounded-4xl p-10 border border-white/5 shadow-2xl relative z-10">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-serif tracking-tight text-balance">Create Account</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join Eventra to start buying and selling tickets for your favorite events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={userDetails.name}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1e] border-none py-4 pl-12 pr-5 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={userDetails.email}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1e] border-none py-4 pl-12 pr-5 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1e] border-none py-4 pl-12 pr-12 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={userDetails.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1e] border-none py-4 pl-12 pr-12 rounded-xl text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs px-1">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#6d5dfc] hover:bg-[#5b4dec] text-white text-xl font-serif shadow-[0_0_20px_rgba(109,93,252,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-xl bg-[#1c1c1e] border border-transparent hover:bg-[#2c2c2e] transition-all flex items-center justify-center gap-3 group"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.84c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
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
              <span className="font-medium text-gray-200 group-hover:text-white">Sign up with Google</span>
            </button>

            <div className="border-t border-white/10 pt-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">Already have an account?</span>
              <Link href="/auth/login" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
