import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Flame,
  Search,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trendingEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2025",
      image: "/summer-music-festival-stage-lights.jpg",
      likes: 2847,
      comments: 342,
      shares: 156,
      photos: 1203,
      attendees: 5420,
      category: "Music",
    },
    {
      id: 2,
      title: "Tech Conference Asia",
      image: "/tech-conference-stage.png",
      likes: 1923,
      comments: 287,
      shares: 94,
      photos: 856,
      attendees: 3200,
      category: "Tech",
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      image: "/food-wine-tasting-event-gourmet.jpg",
      likes: 3421,
      comments: 512,
      shares: 203,
      photos: 2156,
      attendees: 4100,
      category: "Food",
    },
    {
      id: 4,
      title: "Art Gallery Opening",
      image: "/modern-art-gallery.png",
      likes: 1654,
      comments: 198,
      shares: 87,
      photos: 634,
      attendees: 1850,
      category: "Art",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Eventra
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#trending" className="hover:text-cyan-400 transition">
              Trending
            </a>
            <a href="#discover" className="hover:text-cyan-400 transition">
              Discover
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

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden bg-slate-800 border-t border-slate-700 p-4 space-y-4"
            >
              <a
                href="#trending"
                className="block hover:text-cyan-400 transition"
              >
                Trending
              </a>
              <a
                href="#discover"
                className="block hover:text-cyan-400 transition"
              >
                Discover
              </a>
              <Link
                to="/login"
                className="block px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg text-center"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-full">
              <span className="text-cyan-400 text-sm font-semibold flex items-center gap-2">
                <Flame size={16} /> Your Event Feed Awaits
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover Events,
              <span className="block bg-linear-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Share Moments
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Scroll through trending events, buy tickets, and share
              unforgettable moments with a global community of event lovers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Exploring <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 border border-cyan-500/50 rounded-lg font-semibold hover:bg-slate-800/50 transition">
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events Feed */}
      <section id="trending" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <Flame className="text-orange-400" size={32} />
            <h2 className="text-4xl sm:text-5xl font-bold">Trending Now</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-xl overflow-hidden bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
              >
                {/* Event Image */}
                <div className="relative overflow-hidden h-64 bg-slate-700">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                    <button className="w-full py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg transition">
                      Get Tickets
                    </button>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <span className="text-cyan-400 font-semibold">
                      {event.attendees.toLocaleString()}
                    </span>
                    <span>attending</span>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between text-slate-400 text-sm border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-1 hover:text-red-400 transition cursor-pointer">
                      <Heart size={16} />
                      <span>{(event.likes / 1000).toFixed(1)}k</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-400 transition cursor-pointer">
                      <MessageCircle size={16} />
                      <span>{(event.comments / 100).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-cyan-400 transition cursor-pointer">
                      <Share2 size={16} />
                      <span>{(event.shares / 100).toFixed(0)}k</span>
                    </div>
                  </div>

                  {/* Photo Count */}
                  <div className="mt-3 text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">
                      {event.photos.toLocaleString()}
                    </span>{" "}
                    photos shared
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section
        id="discover"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            Discover Your Next Event
          </h2>

          <div className="mb-12">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events, categories, or locations..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[
              "All Events",
              "Music",
              "Tech",
              "Food",
              "Art",
              "Sports",
              "Comedy",
              "Networking",
            ].map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  cat === "All Events"
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white"
                    : "bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 text-slate-300 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20">
              <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <p className="text-slate-300">Events Listed</p>
            </div>
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20">
              <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                2M+
              </div>
              <p className="text-slate-300">Community Members</p>
            </div>
            <div className="p-8 rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/20">
              <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                10M+
              </div>
              <p className="text-slate-300">Photos Shared</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Join the Event Revolution
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Start discovering, sharing, and connecting with events today
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
              <p className="text-slate-400">Your Nepal event community.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Trending Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Near You
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Help Center
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
