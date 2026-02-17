import React from 'react'
import NavBar from '../component/navBar'
import Footer from '../component/landing/footer';
import Hero from '../component/landing/Hero';
import Features from '../component/landing/Features';
import TrendingEvents from '../component/landing/TrendingEvents';
import EventCategories from '../component/landing/EventCategories';
import EventRoom from '../component/landing/EventRoom';
import BookingSteps from '../component/landing/BookingSteps';

export default function page() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-background text-foreground transition-colors duration-300">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/5 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse delay-1000"></div>
      </div>

      <NavBar />

      <main className="relative z-10">
        <Hero />
        <Features />
        <TrendingEvents />
        <EventCategories />
        <EventRoom />
        <BookingSteps />
      </main>

      <Footer />
    </div>
  )
}