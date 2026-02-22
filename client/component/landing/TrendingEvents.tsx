"use client";
import React, { useEffect, useState } from 'react';
import SectionHeading from './SectionHeading';
import { Calendar, MapPin, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '../../service/axiosInstance';

const TrendingEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingEvents = async () => {
            try {
                const { data } = await axiosInstance.get('/api/events/upcoming');
                if (data.success) {
                    // Just take the first 4 for the trending section
                    setEvents(data.events.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch trending events:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrendingEvents();
    }, []);

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop";
        if (imagePath.startsWith("/images")) {
            const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "production"
                ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
            return `${backendUrl}${imagePath}`;
        }
        return imagePath;
    };

    const formatPrice = (price: any) => {
        if (typeof price === 'object') {
            return `NPR ${price.general || price.standard || 0}`;
        }
        return `NPR ${price || 0}`;
    };

    return (
        <section className="py-20 relative z-10" id="events">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <SectionHeading
                        title="Trending in Nepal"
                        subtitle="Don't miss out on the most talked-about events happening across the country."
                    />
                    <div className="hidden md:flex gap-2 mb-12">
                        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer text-foreground">
                            ←
                        </button>
                        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors cursor-pointer text-foreground">
                            →
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No trending events at the moment.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event) => (
                            <Link
                                href="/auth/login"
                                key={event._id}
                                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                            >
                                <img
                                    src={getImageUrl(event.bannerImage)}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white w-fit mb-2 border border-white/10">
                                        Starts at {formatPrice(event.price)}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors drop-shadow-md line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <div className="text-gray-200 text-sm flex items-center gap-2 mb-1 drop-shadow-sm">
                                        <MapPin className="w-3 h-3" /> {event.venue}, {event.city}
                                    </div>
                                    <div className="text-gray-300 text-sm flex items-center gap-2 justify-between mt-2 pt-2 border-t border-white/20">
                                        <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                                            <Star className="w-3 h-3 fill-yellow-400" /> {event.rating || "4.5"}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <Calendar className="w-3 h-3" /> {new Date(event.startDate || event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/events" className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-md hover:shadow-lg">
                        View All Nepal Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingEvents;
