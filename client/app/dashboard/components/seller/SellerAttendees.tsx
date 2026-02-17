"use client"

import React from "react";
import { Search, User, Mail, Phone, Ticket } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import Cookies from "js-cookie";
import { toast } from "sonner";

const AttendeesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111113] p-6 rounded-2xl border border-white/5 animate-pulse h-40">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                        <div className="h-3 bg-white/10 rounded w-1/3" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

export default function SellerAttendees() {
    const [attendees, setAttendees] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
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

    const filteredAttendees = attendees.filter(ticket =>
        ticket.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.eventId?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif text-white">Attendees</h2>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex gap-4 bg-white/[0.02]">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search attendees by name, email or event..."
                            className="w-full bg-[#111113] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600 transition-all"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <AttendeesSkeleton />
                ) : filteredAttendees.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                        <User size={48} className="mb-4 text-white/5" />
                        <p className="text-sm font-medium">No attendees found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                        {filteredAttendees.map((ticket) => (
                            <div key={ticket._id} className="bg-[#111113] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-mono text-gray-600">#{ticket._id.slice(-6)}</span>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center text-purple-400 border border-white/5">
                                        {ticket.userId?.profileUrl ? (
                                            <img src={ticket.userId.profileUrl} alt={ticket.userId.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">{ticket.userId?.name || "Unknown User"}</h3>
                                        <p className="text-xs text-gray-500">Ticket Holder</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Mail size={14} className="text-gray-600" />
                                        <span className="truncate">{ticket.userId?.email || "No email"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 pt-2 border-t border-white/5 mt-2">
                                        <Ticket size={14} className="text-purple-500" />
                                        <span className="font-medium text-gray-300">{ticket.eventId?.title}</span>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md text-gray-400 group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-colors">
                                            {ticket.ticketType} Pass
                                        </span>
                                        <span className="text-xs font-mono text-gray-600">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
