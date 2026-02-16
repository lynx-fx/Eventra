"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "sonner"

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
