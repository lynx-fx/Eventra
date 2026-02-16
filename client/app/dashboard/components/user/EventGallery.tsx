"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, Loader2, Image as ImageIcon, Upload, Flag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    userId?: {
        name: string;
    };
}

export default function EventGallery() {
    const [eventRooms, setEventRooms] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [reportingImageId, setReportingImageId] = useState<string | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
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
                    const response = await axiosInstance.get(`/api/images/gallery?eventId=${selectedEvent._id}`);
                    if (response.data.success) {
                        setGalleryImages(response.data.images);
                    } else {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedEvent) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("eventRoomId", selectedEvent._id);

        try {
            const response = await axiosInstance.post("/api/images/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    auth: AUTH_TOKEN
                }
            });

            if (response.data.success) {
                toast.success("Moment uploaded to archives");
                setGalleryImages(prev => [response.data.image, ...prev]);
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleReportImage = (imageId: string) => {
        setReportingImageId(imageId);
        setReportReason("");
    };

    const submitReport = async () => {
        if (!reportingImageId || !reportReason.trim()) {
            toast.error("Please provide a reason for reporting");
            return;
        }

        setIsReporting(true);
        try {
            const response = await axiosInstance.post("/api/images/report", {
                imageId: reportingImageId,
                reportReason: reportReason
            }, {
                headers: {
                    auth: AUTH_TOKEN
                }
            });
 
            if (response.data.success) {
                toast.success(response.data.message || "Image reported for review");
                setReportingImageId(null);
                setReportReason("");
            } else {
                toast.info("Error reporting content")
                setReportingImageId(null);
                setReportReason("");
            }
        } catch (error) {
            toast.error("Failed to report image");
        } finally {
            setIsReporting(false);
        }
    };

    const nextImage = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    };

    const prevImage = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === "Escape") setSelectedImageIndex(null);
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImageIndex, galleryImages.length]);

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

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all disabled:opacity-50 shadow-2xl"
                    >
                        {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                        {isUploading ? "Uploading..." : "Upload Moment"}
                    </button>
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
                    {galleryImages.map((img: any, index) => {
                        const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
                            ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                            : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
                        const imageUrl = img.imageUrl.startsWith("/images") ? `${BACKEND}${img.imageUrl}` : img.imageUrl;

                        return (
                            <div
                                key={img._id}
                                onClick={() => setSelectedImageIndex(index)}
                                className="break-inside-avoid relative group rounded-3xl overflow-hidden border border-white/5 transition-all hover:border-purple-500/30 shadow-2xl cursor-pointer"
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Gallery ${index}`}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                    <div className="flex justify-between items-end text-white">
                                        <div className="space-y-1">
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Captured By</p>
                                            <p className="text-xs font-bold italic font-serif">"{img.userId?.name || "Anonymous"}"</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReportImage(img._id);
                                            }}
                                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 backdrop-blur-sm transition-all active:scale-90"
                                            title="Report content"
                                        >
                                            <Flag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
                    >
                        <button
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute top-6 right-6 p-4 text-white/50 hover:text-white transition-colors z-50 bg-white/5 rounded-full backdrop-blur-md border border-white/10"
                        >
                            <X size={24} />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-6 p-4 text-white/50 hover:text-white transition-colors z-50 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hidden md:block"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-6 p-4 text-white/50 hover:text-white transition-colors z-50 bg-white/5 rounded-full backdrop-blur-md border border-white/10 hidden md:block"
                        >
                            <ChevronRight size={32} />
                        </button>

                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                const img = galleryImages[selectedImageIndex];
                                const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
                                    ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                                    : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
                                const imageUrl = img.imageUrl.startsWith("/images") ? `${BACKEND}${img.imageUrl}` : img.imageUrl;
                                return (
                                    <>
                                        <div className="relative w-full h-[80vh] group">
                                            <img
                                                src={imageUrl}
                                                alt="Enlarged"
                                                className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]"
                                            />
                                        </div>
                                        <div className="mt-8 text-center space-y-2">
                                            <p className="text-white font-serif italic text-xl">"{img.userId?.name || "Anonymous"}"</p>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Official Archive Entry</p>

                                            <button
                                                onClick={() => handleReportImage(img._id)}
                                                className="mt-4 flex items-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 transition-all text-[10px] font-bold uppercase tracking-widest mx-auto"
                                            >
                                                <Flag size={12} />
                                                Report Vision
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 md:hidden">
                            <button onClick={prevImage} className="p-4 bg-white/10 rounded-full border border-white/10 text-white"><ChevronLeft size={24} /></button>
                            <button onClick={nextImage} className="p-4 bg-white/10 rounded-full border border-white/10 text-white"><ChevronRight size={24} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {reportingImageId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setReportingImageId(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#111113] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(239,68,68,0.1)] p-8 space-y-8"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-serif text-white tracking-tight">Report <span className="text-red-500">Content</span></h2>
                                    <button
                                        onClick={() => setReportingImageId(null)}
                                        className="p-2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm font-light">Help us keep our archives safe and respectful.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <textarea
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        placeholder="Type the reason for reporting..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-hidden focus:border-red-500/50 transition-all min-h-[120px] resize-none"
                                    />
                                    <div className="absolute top-4 right-4 text-[10px] text-gray-700 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Required
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={submitReport}
                                    disabled={isReporting || !reportReason.trim()}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    {isReporting ? <Loader2 className="animate-spin" size={14} /> : (
                                        <>
                                            <Flag size={14} />
                                            Submit Report
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setReportingImageId(null)}
                                    className="w-full py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    Cancel & Return
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
