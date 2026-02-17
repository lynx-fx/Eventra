import React from 'react';
import SectionHeading from './SectionHeading';
import { Camera, Users, Share2 } from 'lucide-react';
import Link from 'next/link';

const feedImages = [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
];

const EventRoom = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-6">
                            <Camera className="w-4 h-4" />
                            <span>New Feature</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                            The <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">Event Room</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Capture the moment and share your experience with fellow attendees. The Event Room is a dedicated space for every event where you can upload photos, connect with fans, and relive the memories.
                        </p>

                        <div className="flex flex-col gap-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="bg-card p-3 rounded-xl border border-border shadow-sm">
                                    <Camera className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-lg">Live Photo Feed</h4>
                                    <p className="text-muted-foreground text-sm">Real-time photos from everyone at the event.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-card p-3 rounded-xl border border-border shadow-sm">
                                    <Users className="w-6 h-6 text-pink-500" />
                                </div>
                                <div>
                                    <h4 className="text-foreground font-bold text-lg">Community Connection</h4>
                                    <p className="text-muted-foreground text-sm">Find friends and meet people with similar interests.</p>
                                </div>
                            </div>
                        </div>

                        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                            Explore Event Rooms
                        </button>
                    </div>

                    <div className="relative">
                        {/* Abstract Background Blobs */}
                        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>

                        {/* Phones / Mockup Composition */}
                        <div className="grid grid-cols-2 gap-4 relative">
                            <div className="space-y-4 pt-12">
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                    <img src={feedImages[0]} alt="Event Moment" className="w-full h-48 object-cover" />
                                </div>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                    <img src={feedImages[1]} alt="Event Moment" className="w-full h-64 object-cover" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                    <img src={feedImages[2]} alt="Event Moment" className="w-full h-64 object-cover" />
                                </div>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                                    <img src={feedImages[3]} alt="Event Moment" className="w-full h-48 object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventRoom;
