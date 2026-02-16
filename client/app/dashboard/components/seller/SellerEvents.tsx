"use client"

import React, { useState } from "react";
import { Search, Plus, Calendar, Edit2, Trash2, Eye, Loader2, MapPin, Users } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import CreateEventModal from "./CreateEventModal";
import { toast } from "sonner";

interface Props {
    events: any[];
    isLoading: boolean;
    fetchEvents: () => void;
}

export default function SellerEvents({ events, isLoading, fetchEvents }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const { data } = await axiosInstance.delete(`/api/events/${id}`);
            if (data.success) {
                toast.success("Event deleted");
                fetchEvents();
            }
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-white">Manage Events</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and track your published events.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-purple-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-bold">New Event</span>
                </button>
            </div>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search your events database..."
                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                            <Loader2 className="animate-spin text-purple-500" size={32} />
                            <p className="font-serif italic">Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 mb-4">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-serif text-white mb-2">No events found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto text-sm">You haven't created any events yet. Start by clicking "New Event".</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5 font-bold">
                                    <th className="px-8 py-5">Event Details</th>
                                    <th className="px-8 py-5">Date & Time</th>
                                    <th className="px-8 py-5">Price</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {events.map((event) => (
                                    <tr key={event._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#111113] border border-white/5 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={
                                                            event.bannerImage?.startsWith("/images")
                                                                ? `${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${event.bannerImage}`
                                                                : (event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop")
                                                        }
                                                        alt={event.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-200 font-bold text-base group-hover:text-white transition-colors">{event.title}</span>
                                                    <span className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description || "No description provided"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                                    <Calendar size={12} className="text-purple-500" />
                                                    {new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                                    <MapPin size={10} />
                                                    {event.location || "Global"}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-purple-500/50 mt-1">
                                                    <Users size={10} />
                                                    <span>
                                                        {(event.soldTickets?.premium || 0) + (event.soldTickets?.standard || 0) + (event.soldTickets?.economy || 0)} / {(event.capacity?.premium || 0) + (event.capacity?.standard || 0) + (event.capacity?.economy || 0)} Sold
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-purple-400 font-bold font-mono">
                                                ${event.price?.standard ? event.price.standard.toFixed(2) : "0.00"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${event.status === "approved" ? "bg-green-500/10 text-green-500" :
                                                event.status === "pending" ? "bg-orange-500/10 text-orange-500" :
                                                    "bg-red-500/10 text-red-500"
                                                }`}>
                                                {event.status || "pending"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <CreateEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEvents}
            />
        </div>
    );
}

