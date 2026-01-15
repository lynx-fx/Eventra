import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero_bg.png"
                    alt="Concert Crowd"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0f0f11]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center mt-20">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    EVENTRA
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light tracking-wide shadow-black drop-shadow-lg">
                    Unforgettable experiences await. Book tickets for the biggest concerts, sports, and theater events.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Link href="/events" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors w-full md:w-auto text-center">
                        Find Events
                    </Link>
                    <Link href="/sell" className="border border-white/30 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors w-full md:w-auto text-center">
                        Sell Tickets
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Hero;
