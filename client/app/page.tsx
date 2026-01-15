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
    <div className="min-h-screen bg-[#0f0f11] font-sans text-gray-100 overflow-x-hidden">
      <NavBar />

      <main>
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