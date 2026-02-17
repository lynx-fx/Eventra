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
                    className="w-full h-full object-cover dark:opacity-60 opacity-100 transition-opacity duration-500"
                />

                {/* Gradient overlay for text readability and general dimming */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/90 backdrop-blur-[2px]"></div>

                {/* Hard fade at the bottom to merge with next section */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background via-background to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center mt-20">
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter text-foreground mb-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 drop-shadow-2xl">
                    EVENTRA
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light tracking-wide drop-shadow-md">
                    Unforgettable experiences await. Book tickets for the biggest concerts, sports, and theater events.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Link href="/events" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all w-full md:w-auto text-center shadow-lg shadow-primary/25">
                        Find Events
                    </Link>
                    <Link href="/dashboard" className="border border-input bg-background/50 backdrop-blur-md text-foreground px-8 py-3 rounded-full font-bold hover:bg-accent hover:text-accent-foreground transition-all w-full md:w-auto text-center">
                        Sell Tickets
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Hero;
