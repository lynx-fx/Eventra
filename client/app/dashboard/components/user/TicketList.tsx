"use client"

import React, { useEffect, useState } from "react";
import { Ticket, Calendar, MapPin, QrCode, Loader2, Sparkles } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";

interface TicketData {
    ticketId: string;
    eventId: {
        title: string;
        startDate: string;
        location: string;
    };
    status: string;
    purchaseDate: string;
}

export default function TicketList() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/api/tickets");
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

        fetchTickets();
    }, []);

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
                    {tickets.map((ticket) => (
                        <div key={ticket.ticketId} className="bg-[#111113] rounded-4xl p-8 border border-white/5 flex flex-col md:flex-row gap-8 hover:border-purple-500/30 transition-all group relative overflow-hidden shadow-2xl">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all" />

                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{ticket.eventId?.title || "Unknown Experience"}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Calendar size={14} className="text-purple-500" />
                                        </div>
                                        <span>{ticket.eventId?.startDate ? new Date(ticket.eventId.startDate).toLocaleDateString() : "TBA"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <MapPin size={14} className="text-purple-500" />
                                        </div>
                                        <span>{ticket.eventId?.location || "TBA"}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Access Token</p>
                                        <p className="font-mono text-gray-400 text-sm">#{ticket.ticketId.substring(0, 12).toUpperCase()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-500/50">
                                        <Sparkles size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Premium Pass</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div className="md:border-l border-dashed border-white/10 md:pl-8 flex flex-col items-center justify-center gap-4 bg-white/5 md:bg-transparent rounded-3xl p-6 md:p-0">
                                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-white/5">
                                    <QrCode size={80} color="black" />
                                </div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Encrypted Entry</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
