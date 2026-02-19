"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Ticket,
    Calendar,
    MapPin,
    User,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    Loader2,
    ShieldCheck,
    ShieldAlert,
    Scan
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface TicketData {
    _id: string;
    ticketType: string;
    price: number;
    status: "active" | "used" | "cancelled";
    purchaseDate: string;
    userId: {
        name: string;
        email: string;
    };
    eventId: {
        _id: string;
        title: string;
        description: string;
        eventDate: string;
        city: string;
        venue: string;
        seller: string;
        bannerImage?: string;
    };
}

interface CurrentUser {
    _id: string;
    role: string;
}

export default function TicketValidationPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTicketDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = Cookies.get("auth");
            const [ticketRes, userRes] = await Promise.all([
                axiosInstance.get(`/api/tickets/${id}`),
                token ? axiosInstance.get("/api/auth/get-me", { headers: { auth: token } }).catch(() => null) : null
            ]);

            if (ticketRes.data.success) {
                setTicket(ticketRes.data.ticket);
            } else {
                setError("Ticket not found");
            }

            if (userRes?.data?.success) {
                setCurrentUser(userRes.data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch ticket details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTicketDetails();
        }
    }, [id]);

    const handleUseTicket = async () => {
        if (!ticket) return;

        const token = Cookies.get("auth");
        if (!token) {
            toast.error("Please login to validate tickets");
            router.push("/login?redirect=/ticket/" + id);
            return;
        }

        setActionLoading(true);
        try {
            const { data } = await axiosInstance.post("/api/tickets/use",
                { ticketId: ticket._id },
                { headers: { auth: token } }
            );

            if (data.success) {
                toast.success("Ticket validated and marked as used");
                setTicket({ ...ticket, status: "used" });
            } else {
                toast.error(data.message || "Failed to validate ticket");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center gap-6 p-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-t-2 border-purple-500 border-r-2 border-purple-500/30"
                />
                <div className="text-center">
                    <h2 className="text-xl font-serif text-white mb-2">Fetching Ticket Data</h2>
                    <p className="text-gray-500 italic text-sm">Validating authenticity across the ledger...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-6 space-y-8">
                <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <AlertCircle size={48} />
                </div>
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-serif text-white">Validation <span className="text-red-500">Error</span></h1>
                    <p className="text-gray-500 max-w-md mx-auto">{error || "The ticket you're looking for doesn't exist or may have been deleted."}</p>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    Return to Homepage
                </button>
            </div>
        );
    }

    const isUsed = ticket.status === "used";
    const isCancelled = ticket.status === "cancelled";
    const isActive = ticket.status === "active";

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-foreground font-sans selection:bg-purple-500/30 p-6 md:p-12 lg:p-24 relative overflow-hidden flex flex-col items-center">
            {/* Background Orbs */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blur-[120px] pointer-events-none rounded-full transition-colors duration-1000 ${isUsed ? "bg-blue-600/10" : isCancelled ? "bg-red-600/10" : "bg-purple-600/10"
                }`} />

            <div className="w-full max-w-xl relative z-10 flex flex-col gap-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:bg-white/10"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${isActive ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-green-500/10" :
                            isUsed ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10" :
                                "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10"
                            }`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                {/* Ticket Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111113] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl"
                >
                    {/* Event Banner */}
                    <div className="h-56 relative overflow-hidden">
                        <img
                            src={ticket.eventId.bannerImage?.startsWith("/images")
                                ? `${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${ticket.eventId.bannerImage}`
                                : (ticket.eventId.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop")
                            }
                            alt={ticket.eventId.title}
                            className={`w-full h-full object-cover transition-all duration-1000 ${!isActive ? "grayscale" : ""}`}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#111113] via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-8 right-8">
                            <h1 className="text-3xl font-serif text-white leading-tight">{ticket.eventId.title}</h1>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-10">
                        {/* Status Card Overlay for USED */}
                        <AnimatePresence>
                            {isUsed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center gap-6"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-400">Successfully Checked-In</h3>
                                        <p className="text-xs text-blue-400/60 mt-1 uppercase tracking-widest font-black">Admit 1 Person</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                            <div className="space-y-1.5">
                                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-2">
                                    <User size={12} className="text-purple-500" /> Ticket Holder
                                </p>
                                <p className="text-sm font-bold text-gray-200">{ticket.userId.name}</p>
                                <p className="text-[10px] text-gray-600">{ticket.userId.email}</p>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-2">
                                    <Ticket size={12} className="text-purple-500" /> Pass Type
                                </p>
                                <p className="text-sm font-bold text-gray-200 uppercase tracking-widest">{ticket.ticketType} PASS</p>
                                <p className="text-[10px] text-gray-600 font-mono">ID: #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}</p>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-2">
                                    <Calendar size={12} className="text-purple-500" /> Event Date
                                </p>
                                <p className="text-sm font-bold text-gray-200">
                                    {new Date(ticket.eventId.eventDate).toLocaleDateString(undefined, {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-[10px] text-gray-600 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(ticket.eventId.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-2">
                                    <MapPin size={12} className="text-purple-500" /> Location
                                </p>
                                <p className="text-sm font-bold text-gray-200">{ticket.eventId.venue}</p>
                                <p className="text-[10px] text-gray-600 line-clamp-1">{ticket.eventId.city}</p>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="pt-10 border-t border-white/5">
                            {isActive ? (
                                (() => {
                                    const isSeller = currentUser?._id === ticket.eventId.seller;
                                    const hasPermission = isSeller;

                                    if (!currentUser) {
                                        return (
                                            <button
                                                onClick={() => router.push(`/dashboard`)}
                                                className="w-full bg-white/5 border border-white/10 text-gray-400 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all hover:bg-white/10 flex items-center justify-center gap-3"
                                            >
                                                <User size={18} />
                                                <span>Login to Validate</span>
                                            </button>
                                        );
                                    }

                                    if (!hasPermission) {
                                        return (
                                            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl flex items-center gap-4 text-orange-400">
                                                <ShieldAlert size={20} className="shrink-0" />
                                                <p className="text-xs font-bold uppercase tracking-tight">Access Denied: Only the event seller can validate this ticket.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <button
                                            onClick={handleUseTicket}
                                            disabled={actionLoading}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3 relative overflow-hidden group active:scale-[0.98]"
                                        >
                                            {actionLoading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    <Scan size={20} className="group-hover:scale-110 transition-transform" />
                                                    <span>Validate & Check-in</span>
                                                </>
                                            )}
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                        </button>
                                    );
                                })()
                            ) : (
                                <div className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 text-sm font-bold border ${isUsed ? "bg-white/5 border-white/5 text-gray-500" : "bg-red-500/5 border-red-500/10 text-red-400"
                                    }`}>
                                    {isUsed ? (
                                        <>
                                            <CheckCircle2 size={18} className="text-blue-500" />
                                            Already Used
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={18} />
                                            Ticket Cancelled
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Info Note */}
                <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest font-black leading-relaxed px-12">
                    Security Warning: This page is intended for event staff. Unauthorized use or reproduction of digital tickets is strictly prohibited.
                </p>
            </div>
        </div>
    );
}
