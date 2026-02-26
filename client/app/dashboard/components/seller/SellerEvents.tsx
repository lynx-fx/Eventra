"use client"

import React, { useState } from "react";
import { Search, Plus, Calendar, Edit2, Trash2, Eye, Loader2, MapPin, Users } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import CreateEventModal from "./CreateEventModal";
import DeleteEventModal from "./DeleteEventModal";
import { toast } from "sonner";

import Cookies from "js-cookie";

interface Props {
    events: any[];
    isLoading: boolean;
    fetchEvents: () => void;
}

export default function SellerEvents({ events, isLoading, fetchEvents }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const openDeleteModal = (event: any) => {
        setSelectedEvent(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedEvent) return;
        setIsDeleting(true);
        try {
            const { data } = await axiosInstance.delete(`/api/events/${selectedEvent._id}`, {
                headers: {
                    auth: Cookies.get("auth")
                }
            });
            if (data.success) {
                toast.success("Event deleted");
                fetchEvents();
            }
        } catch (error) {
            toast.error("Failed to delete event");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-foreground">Manage Events</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage and track your published events.</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedEvent(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-primary/20 active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-bold">New Event</span>
                </button>
            </div>

            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-border bg-background/50 flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search your events database..."
                            className="w-full bg-background border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
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
                            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-muted-foreground mb-4">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-xl font-serif text-foreground mb-2">No events found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto text-sm">You haven't created any events yet. Start by clicking "New Event".</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-muted-foreground uppercase tracking-widest border-b border-border font-bold">
                                    <th className="px-8 py-5">Event Details</th>
                                    <th className="px-8 py-5">Date & Time</th>
                                    <th className="px-8 py-5">Price</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {events.map((event) => (
                                    <tr key={event._id} className="hover:bg-accent/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
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
                                                    <span className="text-foreground font-bold text-base group-hover:text-primary transition-colors">{event.title}</span>
                                                    <span className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description || "No description provided"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Calendar size={12} className="text-primary" />
                                                    {new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <MapPin size={10} />
                                                    {event.venue}, {event.city}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-primary/50 mt-1">
                                                    <Users size={10} />
                                                    <span>
                                                        {(event.soldTickets?.premium || 0) + (event.soldTickets?.standard || 0) + (event.soldTickets?.economy || 0)} / {(event.capacity?.premium || 0) + (event.capacity?.standard || 0) + (event.capacity?.economy || 0)} Sold
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-primary font-bold font-mono">
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
                                                <button
                                                    onClick={() => window.open(`/events/${event._id}`, '_blank')}
                                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedEvent(event);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(event)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
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
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                }}
                onSuccess={fetchEvents}
                eventToEdit={selectedEvent}
            />

            <DeleteEventModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}

