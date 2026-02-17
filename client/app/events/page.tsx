"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../service/axiosInstance';
import NavBar from '../../component/navBar';
import Footer from '../../component/landing/footer';
import { Calendar, MapPin, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await axiosInstance.get('/api/events/upcoming');
            if (data.success) {
                setEvents(data.events);
            } else {
                toast.error("Failed to load events");
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
            toast.error("Failed to load events");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventClick = (eventId: string) => {
        router.push('/auth/login');
    };

    const filteredEvents = events.filter(event =>
        (event.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (event.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-grow pt-24 pb-12 container mx-auto px-4">
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">Explore Events</h1>
                    <p className="text-muted-foreground">Discover the best events happening around you.</p>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No events found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEvents.map((event) => (
                            <div
                                key={event._id}
                                onClick={() => handleEventClick(event._id)}
                                className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImageUrl(event.bannerImage)}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-border text-foreground">
                                        {event.category || "Event"}
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.startDate || event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>

                                    <div className="pt-4 border-t border-border flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Starting from</span>
                                            <span className="font-bold text-primary">
                                                {typeof event.price === 'object'
                                                    ? `Rs. ${event.price.general || event.price.standard || 0}`
                                                    : `Rs. ${event.price || 0}`
                                                }
                                            </span>
                                        </div>
                                        <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
