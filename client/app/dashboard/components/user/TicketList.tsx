"use client"

import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Calendar, MapPin, QrCode, Loader2, Sparkles, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { User } from "../../page";

interface Props {
    user?: User;
}


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

export default function TicketList({ user }: Props) {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const ticketRef = useRef<HTMLDivElement>(null);
    const pdfRef = useRef<HTMLDivElement>(null);
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

    const handleDownloadPDF = async () => {
        if (!pdfRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#0a0a0c",
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");

            const imgWidth = canvas.width / 2;
            const imgHeight = canvas.height / 2;

            const pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? "l" : "p",
                unit: "px",
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Ticket-${selectedTicket?._id}.pdf`);
            toast.success("Ticket downloaded successfully");
        } catch (error) {
            console.error("PDF generation failed", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsDownloading(false);
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
                                    <div className="bg-white p-2 rounded-xl shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500 overflow-hidden w-16 h-16 flex items-center justify-center">
                                        <QRCodeSVG
                                            value={`${window.location.origin}/ticket/${ticket._id}`}
                                            size={48}
                                            level="H"
                                            includeMargin={false}
                                        />
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
                            className="relative w-full max-w-[400px] bg-[#0a0a0c] rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
                        >
                            <div ref={ticketRef} className="bg-[#0a0a0c] w-full aspect-[9/16] flex flex-col relative overflow-hidden">
                                {/* Decorative Ticket Cutouts */}
                                <div className="absolute top-[65%] -left-4 w-8 h-8 bg-black rounded-full z-20 border-r border-white/10" />
                                <div className="absolute top-[65%] -right-4 w-8 h-8 bg-black rounded-full z-20 border-l border-white/10" />

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
                                    <div className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/70 border border-white/10">
                                        <Sparkles size={20} className="animate-pulse" />
                                    </div>
                                </div>

                                <div className="px-6 md:px-10 pb-10 -mt-10 relative space-y-10">
                                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 mt-6 md:mt-0">
                                        <div className="space-y-4 text-center md:text-left w-full">
                                            <div className="space-y-2">
                                                <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block">
                                                    {selectedTicket.ticketType} Pass
                                                </span>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words">{selectedTicket.eventId?.title}</h2>
                                                <p className="text-[10px] text-gray-400 font-mono">#{selectedTicket._id.toUpperCase()}</p>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 space-y-1">
                                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">Ticket Holder</p>
                                                <p className="text-sm font-bold text-white">{user?.name || "Guest Attendee"}</p>
                                                <p className="text-[10px] text-gray-400">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-3 shrink-0">
                                            <div className="bg-white p-3 md:p-4 rounded-[28px] md:rounded-[32px] shadow-2xl w-32 h-32 md:w-36 md:h-36 flex items-center justify-center overflow-hidden border-4 border-purple-500/20">
                                                <QRCodeSVG
                                                    value={`${window.location.origin}/ticket/${selectedTicket._id}`}
                                                    size={110}
                                                    level="H"
                                                    includeMargin={false}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">Scan for Entry</span>
                                        </div>
                                    </div>

                                    <div className="relative py-4 overflow-hidden">
                                        <div className="absolute -left-14 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a0c] rounded-full hidden md:block" />
                                        <div className="absolute -right-14 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a0c] rounded-full hidden md:block" />
                                        <div className="border-t border-dashed border-white/20 w-full" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-12 py-6 relative">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Event Date</p>
                                            <p className="text-sm font-bold text-gray-200">
                                                {new Date(selectedTicket.eventId?.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="space-y-1 md:text-right">
                                            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Location</p>
                                            <p className="text-sm font-bold text-gray-200 break-words">{selectedTicket.eventId?.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 pb-8 space-y-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={isDownloading}
                                    className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    {isDownloading ? <Loader2 className="animate-spin" size={12} /> : (
                                        <>
                                            <Download size={14} />
                                            Download pass
                                        </>
                                    )}
                                </button>

                                {selectedTicket.status === 'active' && new Date(selectedTicket.eventId?.eventDate) > new Date() && (
                                    <button
                                        onClick={() => handleCancelTicket(selectedTicket._id)}
                                        disabled={isCancelling}
                                        className="w-full py-2 text-[9px] font-black uppercase tracking-[0.2em] text-red-500/40 hover:text-red-500 transition-colors"
                                    >
                                        {isCancelling ? <Loader2 className="animate-spin" size={10} /> : "Cancel Booking"}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden High-Fidelity PDF pass (State B refined version) */}
            {selectedTicket && (
                <div
                    ref={pdfRef}
                    className="fixed -left-[1000px] top-0 pointer-events-none"
                    style={{ zIndex: -1 }}
                >
                    <div className="bg-[#0a0a0c] w-[400px] aspect-[9/16] flex flex-col relative overflow-hidden border border-white/10">
                        <div className="absolute top-[62%] -left-5 w-10 h-10 bg-black rounded-full z-10 border-r border-white/5" />
                        <div className="absolute top-[62%] -right-5 w-10 h-10 bg-black rounded-full z-10 border-l border-white/5" />

                        <div className="h-[35%] w-full relative shrink-0">
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
                            <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent" />
                            <div className="absolute top-8 right-8 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/70 border border-white/10">
                                <Sparkles size={18} className="animate-pulse text-purple-400" />
                            </div>
                            <div className="absolute bottom-6 left-8">
                                <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-purple-900/40">
                                    {selectedTicket.ticketType} PASS
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 px-10 pt-4 pb-10 flex flex-col justify-between relative bg-[#0a0a0c]">
                            <div className="space-y-8">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">{selectedTicket.eventId?.title}</h2>
                                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">#{selectedTicket._id.toUpperCase()}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-y-10 border-t border-b border-white/10 py-10 relative font-sans">
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Attendee</p>
                                        <p className="text-sm font-bold text-white">{user?.name || "Guest Attendee"}</p>
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Date</p>
                                        <p className="text-sm font-bold text-white">{new Date(selectedTicket.eventId?.eventDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Location</p>
                                        <p className="text-xs font-bold text-gray-300 break-words">{selectedTicket.eventId?.location}</p>
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Price</p>
                                        <p className="text-sm font-bold text-purple-400 font-mono">${selectedTicket.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6 pb-2">
                                <div className="bg-white p-4 rounded-[32px] shadow-2xl w-36 h-36 flex items-center justify-center overflow-hidden border-4 border-purple-500/10">
                                    <QRCodeSVG
                                        value={`${window.location.origin}/ticket/${selectedTicket._id}`}
                                        size={110}
                                        level="H"
                                        includeMargin={false}
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em]">Official Digital Pass</p>
                                    <div className="flex items-center justify-center gap-4 text-[7px] text-gray-700 uppercase tracking-widest font-bold">
                                        <span>Secure Entry</span>
                                        <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                                        <span>Non-Transferable</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
