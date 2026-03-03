"use client"

import React, { useState, useEffect } from "react";
import { Search, User, Mail, ChevronDown, ChevronUp, Ticket } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AttendeesSkeleton = () => (
    <div className="flex flex-col gap-4 p-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111113] p-6 rounded-2xl border border-white/5 animate-pulse h-24" />
        ))}
    </div>
);

export default function SellerAttendees() {
    const [attendees, setAttendees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const { data } = await axiosInstance.get("/api/tickets/seller/sales", {
                    headers: { auth: Cookies.get("auth") }
                });
                if (data.success) {
                    setAttendees(data.tickets.filter((t: any) => t.status !== 'cancelled'));
                }
            } catch (error) {
                console.error("Failed to fetch attendees:", error);
                toast.error("Failed to load attendees data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendees();
    }, []);

    const toggleEvent = (eventId: string) => {
        const newExpanded = new Set(expandedEvents);
        if (newExpanded.has(eventId)) {
            newExpanded.delete(eventId);
        } else {
            newExpanded.add(eventId);
        }
        setExpandedEvents(newExpanded);
    };

    const filteredAttendees = attendees.filter(ticket =>
        ticket.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.eventId?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Grouping by Event ID
    const groupedAttendees = filteredAttendees.reduce((acc, ticket) => {
        const eventId = ticket.eventId?._id;
        if (!eventId) return acc;

        if (!acc[eventId]) {
            acc[eventId] = {
                event: ticket.eventId,
                tickets: []
            };
        }
        acc[eventId].tickets.push(ticket);
        return acc;
    }, {} as Record<string, { event: any, tickets: any[] }>);

    const groupEntries = Object.values<any>(groupedAttendees);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif text-white">Attendees by Event</h2>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 shadow-2xl overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-white/5 flex gap-4 bg-white/[0.02]">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search attendees by name, email or event title..."
                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none placeholder-gray-600 transition-all font-medium"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <AttendeesSkeleton />
                ) : groupEntries.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                        <User size={48} className="mb-4 text-white/5" />
                        <p className="text-sm font-medium">No attendees found</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {groupEntries.map(({ event, tickets }: { event: any, tickets: any[] }) => {
                            const isExpanded = expandedEvents.has(event._id);

                            return (
                                <div key={event._id} className="bg-[#111113] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                                    {/* Event Header (Clickable) */}
                                    <button
                                        onClick={() => toggleEvent(event._id)}
                                        className="w-full text-left p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                                                <Ticket className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{event.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {tickets.length} {tickets.length === 1 ? 'Attendee' : 'Attendees'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-gray-500 p-2 rounded-full hover:bg-white/5 transition-colors shrink-0">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>

                                    {/* Attendees List Configuration */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-5 pt-0 border-t border-white/5 mt-2 bg-black/20">
                                                    {tickets.map((ticket) => (
                                                        <div key={ticket._id} className="bg-[#1c1c1e] p-5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all group relative mt-4">
                                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-[10px] font-mono text-gray-600 bg-black/40 px-2 py-1 rounded">#{ticket._id.slice(-6)}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center text-purple-400 border border-white/5 shrink-0">
                                                                        {ticket.userId?.profileUrl ? (
                                                                            <img src={ticket.userId.profileUrl} alt={ticket.userId.name} className="w-full h-full rounded-full object-cover" />
                                                                        ) : (
                                                                            <User size={18} />
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <h4 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors text-sm">{ticket.userId?.name || "Unknown User"}</h4>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                                            <Mail size={12} className="shrink-0" />
                                                                            <span className="truncate">{ticket.userId?.email || "No email"}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/5 rounded-md text-gray-400 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                                                                        {ticket.ticketType} Pass
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-gray-500">
                                                                        Bought: {new Date(ticket.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
