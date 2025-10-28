"use client";

import { useState } from "react";
import {
  ChevronRight,
  Ticket,
  ImageIcon,
  Users,
  Zap,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Eventra
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="hover:text-cyan-400 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition">
              How it Works
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition">
              Pricing
            </a>
            <Link
              to="/login"
              className="px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-4">
            <a
              href="#features"
              className="block hover:text-cyan-400 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block hover:text-cyan-400 transition"
            >
              How it Works
            </a>
            <a href="#pricing" className="block hover:text-cyan-400 transition">
              Pricing
            </a>
            <Link
              to="/login"
              className="block px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg text-center"
            >
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Decorative gradient blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 text-sm font-semibold flex items-center gap-2">
                <Zap size={16} /> The Future of Event Management
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Connect, Share, and
              <span className="block bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Celebrate Events
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Buy and sell tickets to amazing events. Share unforgettable
              moments through dedicated event photo rooms. Build your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 border border-cyan-500/50 rounded-lg font-semibold hover:bg-slate-800/50 transition">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-800/50 backdrop-blur-sm p-1">
            <div className="bg-linear-to-br from-slate-700 to-slate-900 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <Ticket size={64} className="mx-auto mb-4 text-cyan-400/50" />
                <p className="text-slate-400">Event Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to manage events and connect with your
              community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Ticket size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Ticket Marketplace</h3>
              <p className="text-slate-300">
                Buy and sell tickets for events with ease. Secure transactions
                and instant confirmations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Event Photo Rooms</h3>
              <p className="text-slate-300">
                Share and discover photos from events. Build a visual memory of
                every moment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-slate-300">
                Connect with event organizers and attendees. Build lasting
                relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                desc: "Sign up and set up your profile in minutes",
              },
              {
                step: "2",
                title: "Browse or Create",
                desc: "Find events to attend or create your own",
              },
              {
                step: "3",
                title: "Share & Connect",
                desc: "Upload photos and connect with the community",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-center">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-cyan-500">
                    <ChevronRight size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Join Eventra?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start connecting with your community today
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Eventra
              </div>
              <p className="text-slate-400">
                Connect, share, and celebrate events together.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Eventra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
