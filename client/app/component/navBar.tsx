import React from 'react'
import Link from "next/link"

export default function NavBar() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit">
      <div className="bg-[#1c1c1e]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-10 shadow-2xl">
        <div className="pl-2">
          <span className="text-lg font-medium tracking-tight">Eventra</span>
        </div>
        <nav className="flex items-center gap-6 pl-44">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
            Services
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
          <button className="rounded-full bg-white text-black hover:bg-gray-100 border-none px-5 py-1.5 h-auto text-sm font-semibold transition-colors cursor-pointer">
            Join Us
          </button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
