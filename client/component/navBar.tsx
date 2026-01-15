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
    <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-fit max-w-[95vw]`}>
      <div className={`
        backdrop-blur-md rounded-full border border-white/10 shadow-2xl flex items-center transition-all duration-300
        ${isScrolled ? 'bg-[#1c1c1e]/95 py-2 px-6 gap-4 sm:gap-8' : 'bg-[#1c1c1e]/80 py-3 px-10 gap-8 sm:gap-24'}
      `}>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold tracking-tight text-white text-xl">Eventra</span>
        </div>

        <nav className={`hidden md:flex items-center transition-all duration-300 ${isScrolled ? 'gap-4' : 'gap-8'}`}>
          <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/auth/signup">
            <button className="rounded-full bg-white text-black hover:bg-gray-200 border-none px-5 py-2 text-sm font-bold transition-all cursor-pointer">
              Join Us
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
