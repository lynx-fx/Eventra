"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed left-1/2 -translate-x-1/2 z-50 w-full px-4 transition-all duration-300  ${isScrolled ? 'top-4 max-w-3xl' : 'top-6 max-w-5xl'}`}>
      <div className={`
        backdrop-blur-md rounded-full border border-white/10 shadow-2xl flex items-center justify-between transition-all duration-300
        bg-[#1c1c1e]/80 py-2 px-8
      `}>
        <div className="flex items-cent er gap-2">
          <span className="font-bold tracking-tight text-white text-xl">
            <Link href="/" className="font-medium text-gray-300 hover:text-white transition-colors">
              Eventra
            </Link>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/#events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Events
          </Link>
          <Link href="/#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/auth/signup">
            <button className="rounded-full bg-white text-black hover:bg-gray-200 border-none px-5 py-2.5 text-sm font-bold transition-all cursor-pointer">
              Join Us
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
