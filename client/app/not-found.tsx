"use client";

import React from "react";
import Lottie from "lottie-react";
import animationData from "../util/404.json";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import NavBar from "../component/navBar";
import Footer from "../component/landing/footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/5 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000"></div>
      </div>

      <NavBar />

      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 relative z-10 py-20">
        <div className="w-full max-w-lg mb-8 animate-in fade-in zoom-in duration-700">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        <div className="text-center space-y-6 max-w-2xl animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Oops! The page you are looking for seems to have wandered off. It might have been removed, renamed, or currently unavailable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25">
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-3 bg-secondary text-secondary-foreground border border-border rounded-full font-bold hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
