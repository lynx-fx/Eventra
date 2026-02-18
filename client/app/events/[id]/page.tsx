"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "../../../service/axiosInstance";
import BookingModal from "../../dashboard/components/user/BookingModal";
import { Calendar, MapPin, Share2, ArrowLeft, Clock, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface EventData {
    _id: string;
    title: string;
    description: string;
    eventDate: string;
    endDate: string;
    location: string;
    category: string;
    bannerImage: string;
    price: {
        premium: number;
        standard: number;
        economy: number;
    };
    capacity: {
        premium: number;
        standard: number;
        economy: number;
    };
    soldTickets: {
        premium: number;
        standard: number;
        economy: number;
    };
}

export default function EventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Cookies.get("auth");
        setIsAuthenticated(!!token);

        const fetchEvent = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/events/${id}`);
                if (data.success) {
                    setEvent(data.event);
                } else {
                    toast.error("Event not found");
                    router.push("/dashboard");
                }
            } catch (error) {
                toast.error("Error fetching event details");
                console.error(error);
                router.push("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id, router]);

    const handleBookClick = () => {
        if (!isAuthenticated) {
            toast.error("Please login to book tickets");
            router.push("/auth/login?redirect=/events/" + id);
            return;
        }
        setIsBookingModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!event) return null;

    const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
        : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    const isRelative = event.bannerImage?.startsWith("/images") || event.bannerImage?.startsWith("images");
    const imageUrl = isRelative
        ? `${BACKEND}${event.bannerImage?.startsWith("/") ? event.bannerImage : `/${event.bannerImage}`}`
        : (event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop");

    const isSalesEnded = event.endDate ? new Date(event.endDate) < new Date() : false;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
            <main className="container mx-auto px-4 py-8 mt-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Image and Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden shadow-2xl border border-border">
                            <Image
                                src={imageUrl}
                                alt={event.title}
                                fill
                                unoptimized
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                                    {event.category || "Event"}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                                    {event.title}
                                </h1>
                            </div>
                        </div>

                        <div className="bg-card rounded-3xl p-8 border border-border shadow-lg space-y-4">
                            <h2 className="text-2xl font-bold font-serif">About User Event</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-xl sticky top-24 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Event Details</h3>
                                    <p className="text-sm text-muted-foreground">Secure your spot now</p>
                                </div>
                                <button className="p-2 bg-secondary rounded-full hover:bg-secondary/80 transition-colors">
                                    <Share2 size={20} className="text-foreground" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Date</p>
                                        <p className="font-semibold">{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Time</p>
                                        <p className="font-semibold">{new Date(event.eventDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                                        <p className="font-semibold">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Starting from</p>
                                        <p className="text-3xl font-bold font-mono text-primary">
                                            ${Math.min(event.price.economy, event.price.standard, event.price.premium).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={isSalesEnded ? undefined : handleBookClick}
                                    disabled={isSalesEnded}
                                    className={`w-full py-4 ${isSalesEnded ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 active:scale-[0.98]'} rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2`}
                                >
                                    <Ticket size={20} />
                                    {isSalesEnded ? "Sales Ended" : "Get Tickets"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                event={event}
                onSuccess={() => {
                    toast.success("See you there!");
                    router.push("/dashboard");
                }}
            />
        </div>
    );
}
