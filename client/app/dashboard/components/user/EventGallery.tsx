"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Loader2, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface EventData {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    location: string;
    status: string;
}

interface ImageData {
    _id: string;
    imageUrl: string;
}

export default function EventGallery() {
    const [eventRooms, setEventRooms] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const AUTH_TOKEN = Cookies.get("auth");

    // Fetch Events for Rooms
    useEffect(() => {
        const fetchEventRooms = async () => {
            setLoadingRooms(true);
            try {
                // 1. Fetch user tickets to see which events they've bought
                const ticketsResponse = await axiosInstance.get("/api/tickets", {
                    headers: {
                        auth: AUTH_TOKEN,
                    }
                });
                let purchasedEventIds: string[] = [];

                if (ticketsResponse.data.success) {
                    purchasedEventIds = ticketsResponse.data.tickets.map((t: any) =>
                        typeof t.eventId === 'object' ? t.eventId._id : t.eventId
                    );
                }

                // 2. Fetch all events
                const eventsResponse = await axiosInstance.get("/api/events");
                if (eventsResponse.data.success) {
                    // 3. Filter only approved events that the user has purchased
                    const filteredRooms = eventsResponse.data.events.filter((e: any) =>
                        e.status === "approved" && purchasedEventIds.includes(e._id)
                    );
                    setEventRooms(filteredRooms);
                }
            } catch (error) {
                console.error("Failed to fetch event rooms", error);
                toast.error("Failed to load event rooms");
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchEventRooms();
    }, []);

    // Fetch Gallery when event is selected
    useEffect(() => {
        if (selectedEvent) {
            const fetchGallery = async () => {
                setLoadingGallery(true);
                try {
                    // Assuming there's a gallery endpoint, otherwise fallback to placeholder images
                    const response = await axiosInstance.get(`/api/images/gallery?eventId=${selectedEvent._id}`);
                    if (response.data.success) {
                        setGalleryImages(response.data.images);
                    } else {
                        // Fallback for demo
                        setGalleryImages([]);
                    }
                } catch (error) {
                    setGalleryImages([]);
                } finally {
                    setLoadingGallery(false);
                }
            };
            fetchGallery();
        }
    }, [selectedEvent]);

    // View: List of Events (Rooms)
    if (!selectedEvent) {
        if (loadingRooms) return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-purple-500" size={32} />
                <p className="text-gray-500 font-serif italic text-sm">Opening event archives...</p>
            </div>
        );

        return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <h2 className="text-4xl font-serif text-white tracking-tight">Event <span className="text-purple-500">Rooms</span></h2>
                    <p className="text-gray-500 mt-2 font-light">Step into the past and relive the most iconic moments.</p>
                </div>

                {eventRooms.length === 0 ? (
                    <div className="bg-[#111113] rounded-4xl p-12 text-center border border-white/5 border-dashed">
                        <ImageIcon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-medium">No Event Rooms Joined</h3>
                        <p className="text-gray-600 text-sm mt-2">Exclusive event rooms and galleries appear here after you purchase a ticket.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventRooms.map((event: any) => {
                            const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
                                ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                                : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

                            const imageUrl = event.bannerImage?.startsWith("/images")
                                ? `${BACKEND}${event.bannerImage}`
                                : (event.bannerImage || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop");

                            return (
                                <div
                                    key={event._id}
                                    onClick={() => setSelectedEvent(event)}
                                    className="group bg-[#111113] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer shadow-2xl relative"
                                >
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#111113] via-transparent to-transparent opacity-60" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-white font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{event.title}</h3>
                                        <div className="flex flex-col gap-2 text-sm text-gray-500 font-light">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={14} className="text-purple-500" />
                                                <span>{new Date(event.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={14} className="text-purple-500" />
                                                <span>{event.location || "Earth"}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-purple-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                            Enter Room &rarr;
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // View: Specific Event Gallery
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-3 rounded-2xl bg-[#111113] text-gray-400 border border-white/5 hover:text-white hover:border-white/10 transition-all active:scale-95"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-4xl font-serif text-white tracking-tight">{selectedEvent.title}</h2>
                    <p className="text-purple-500 font-bold uppercase tracking-widest text-xs mt-1">Exclusive Metadata Archives</p>
                </div>
            </div>

            {loadingGallery ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                    <p className="text-gray-500 font-serif italic text-sm">Decoding visual data...</p>
                </div>
            ) : galleryImages.length === 0 ? (
                <div className="bg-[#111113] rounded-4xl p-20 text-center border border-white/5 border-dashed">
                    <p className="text-gray-500 font-serif italic mb-6">"Visual evidence for this event has been restricted or not yet processed."</p>
                    <button
                        onClick={() => setSelectedEvent(null)}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        Return to Archives
                    </button>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {galleryImages.map((img, index) => (
                        <div key={img._id} className="break-inside-avoid relative group rounded-3xl overflow-hidden border border-white/5 transition-all hover:border-purple-500/30">
                            <img
                                src={img.imageUrl}
                                alt={`Gallery ${index}`}
                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center">
                                <span className="text-white font-bold text-xs uppercase tracking-widest border border-white/20 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md">Full Vision</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
