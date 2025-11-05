"use client";

import { useState } from "react";
import LoginForm from "./loginForm.jsx";
import ForgotPassword from "./forgotPassword.jsx";

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-linear-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-linear-to-br from-orange-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <a href="/">
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Eventra
            </h1>
          </a>
          <p className="text-slate-400 text-lg">
            Discover and share amazing events
          </p>
        </div>

        {/* Login card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google login button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium text-slate-200 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="hover:text-slate-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:text-slate-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Forgot password modal */}
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}
