"use client"

import React, { useEffect } from "react"
import { ThemeProvider } from "next-themes"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"

if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string") {
      const errorMsg = args[0];
      if (
        errorMsg.includes("bis_skin_checked") ||
        errorMsg.includes("A tree hydrated but some attributes of the server rendered HTML didn't match") ||
        errorMsg.includes("Hydration failed because the initial UI does not match") ||
        errorMsg.includes("Warning: Expected server HTML to contain a matching")
      ) {
        return;
      }
    }
    originalConsoleError.apply(console, args);
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <Toaster />
        {children}
      </GoogleOAuthProvider>
    </ThemeProvider>
  )
}
