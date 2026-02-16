"use client"

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Calendar, MapPin, QrCode, Loader2, Sparkles } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface TicketData {
    _id: string;
    eventId: {
        _id: string;
        title: string;
        eventDate: string;
        location: string;
        bannerImage?: string;
    };
    ticketType: string;
    price: number;
    status: string;
    purchaseDate: string;
}

export default function TicketList() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const AUTH_TOKEN = Cookies.get("auth");

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/tickets", {
                headers: {
                    auth: AUTH_TOKEN,
                }
            });
            if (response.data.success) {
                setTickets(response.data.tickets);
            } else {
                setTickets([]);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleCancelTicket = async (ticketId: string) => {
        if (!confirm("Are you sure you want to cancel this ticket? This action might be irreversible.")) return;

        setIsCancelling(true);
        try {
            const { data } = await axiosInstance.post("/api/tickets/cancel", { ticketId });
            if (data.success) {
                toast.success("Ticket cancelled successfully");
                fetchTickets();
                setSelectedTicket(null);
            } else {
                toast.error(data.message || "Failed to cancel ticket");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-purple-500" size={32} />
                <p className="text-gray-500 font-serif italic text-sm">Validating ownership...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-4xl font-serif text-white tracking-tight">Your <span className="text-purple-500">Tickets</span></h2>
                <p className="text-gray-500 mt-2 font-light">Digital entry passes for your upcoming experiences.</p>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-[#111113] rounded-4xl p-12 text-center border border-white/5 border-dashed">
                    <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-gray-400 font-medium">No tickets found</h3>
                    <p className="text-gray-600 text-sm mt-2">Any tickets you purchase will appear here in high fidelity.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {tickets.map((ticket) => {
                        const isPast = ticket.eventId?.eventDate && new Date(ticket.eventId.eventDate) < new Date();
                        const isActive = ticket.status === 'active' && !isPast;

                        return (
                            <div
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="bg-[#111113] rounded-[32px] border border-white/5 flex flex-col md:flex-row hover:border-purple-500/40 transition-all group cursor-pointer overflow-hidden shadow-2xl relative"
                            >
                                {/* Left Side - Mini Banner & Type */}
                                <div className="md:w-32 bg-linear-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-center py-6 md:py-0 relative">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                                        <Sparkles className="w-full h-full p-6 text-white" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] vertical-text md:-rotate-90 text-white/80">
                                        {ticket.ticketType} Pass
                                    </span>
                                </div>

                                <div className="flex-1 p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{ticket.eventId?.title || "Unknown Experience"}</h3>
                                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase font-bold">Token ID: #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            ticket.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                'bg-gray-500/10 text-gray-500 border border-white/5'
                                            }`}>
                                            {isPast && ticket.status === 'active' ? "Expired" : ticket.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Calendar size={14} className="text-purple-500" />
                                            <span className="text-xs font-medium">{ticket.eventId?.eventDate ? new Date(ticket.eventId.eventDate).toLocaleDateString() : "TBA"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <MapPin size={14} className="text-purple-500" />
                                            <span className="text-xs font-medium text-nowrap overflow-hidden text-ellipsis">{ticket.eventId?.location || "TBA"}</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                        <div className="flex gap-2">
                                            {isActive && (
                                                <button className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors">
                                                    View Pass &rarr;
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-lg font-black font-mono text-white/90">${ticket.price?.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* QR Preview */}
                                <div className="md:border-l border-dashed border-white/10 md:pl-8 flex flex-col items-center justify-center bg-white/5 md:bg-transparent p-6 md:pr-10">
                                    <div className="bg-white p-2 rounded-xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        <QrCode size={48} color="black" />
                                    </div>
                                </div>

                                {/* Perforated Line Effect */}
                                <div className="absolute left-[32px] md:left-[128px] top-0 bottom-0 border-l border-dashed border-white/10 hidden md:block" />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full Ticket Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-[#111113] rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.15)]"
                        >
                            {/* Ticket Header Image */}
                            <div className="h-48 w-full relative">
                                {(() => {
                                    const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
                                        ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                                        : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
                                    const imageUrl = selectedTicket.eventId?.bannerImage?.startsWith("/images")
                                        ? `${BACKEND}${selectedTicket.eventId.bannerImage}`
                                        : (selectedTicket.eventId?.bannerImage || "https://images.unsplash.com/photo-1540575861501-7ad0582371f4?q=80&w=2070&auto=format&fit=crop");
                                    return (
                                        <img
                                            src={imageUrl}
                                            className="w-full h-full object-cover"
                                            alt="Event"
                                        />
                                    );
                                })()}
                                <div className="absolute inset-0 bg-linear-to-t from-[#111113] via-[#111113]/40 to-transparent" />
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
                                >
                                    <Sparkles size={20} className="animate-pulse" />
                                </button>
                            </div>

                            <div className="px-10 pb-10 -mt-10 relative space-y-8">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-2">
                                        <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                            {selectedTicket.ticketType} Pass
                                        </span>
                                        <h2 className="text-3xl font-bold text-white leading-tight">{selectedTicket.eventId?.title}</h2>
                                    </div>
                                    <div className="bg-white p-4 rounded-[24px] shadow-2xl">
                                        <QrCode size={80} color="black" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Event Date</p>
                                        <p className="text-sm font-bold text-gray-200">
                                            {new Date(selectedTicket.eventId?.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Location</p>
                                        <p className="text-sm font-bold text-gray-200">{selectedTicket.eventId?.location}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Purchased On</p>
                                        <p className="text-sm font-bold text-gray-200">{new Date(selectedTicket.purchaseDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Access Code</p>
                                        <p className="text-sm font-bold text-purple-400 font-mono italic">#{selectedTicket._id.toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {selectedTicket.status === 'active' && new Date(selectedTicket.eventId?.eventDate) > new Date() && (
                                        <button
                                            onClick={() => handleCancelTicket(selectedTicket._id)}
                                            disabled={isCancelling}
                                            className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-red-500/70 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isCancelling ? <Loader2 className="animate-spin" size={14} /> : "Cancel Booking & Refund"}
                                        </button>
                                    )}
                                    <p className="text-center text-[9px] text-gray-600 uppercase tracking-widest font-medium">Please present this digital pass at the entrance for entry validation.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
