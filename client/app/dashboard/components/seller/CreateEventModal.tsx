"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, Type, AlignLeft, Tag, Loader2, MapPin, Users } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const AUTH_TOKEN = Cookies.get("auth");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        price: "",
        capacity: {
            premium: "",
            standard: "",
            economy: "",
        },
        startDate: "",
        endDate: "",
        eventDate: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await axiosInstance.post("/api/events", {
                ...formData,
                price: Number(formData.price) || 0,
                capacity: {
                    premium: Number(formData.capacity.premium) || 0,
                    standard: Number(formData.capacity.standard) || 0,
                    economy: Number(formData.capacity.economy) || 0,
                }
            }, {
                headers: {
                    auth: AUTH_TOKEN
                }
            });

            if (data.success) {
                toast.success("Event created successfully!");
                onSuccess();
                onClose();
                setFormData({
                    title: "",
                    description: "",
                    category: "",
                    location: "",
                    price: "",
                    capacity: {
                        premium: "",
                        standard: "",
                        economy: "",
                    },
                    startDate: "",
                    endDate: "",
                    eventDate: "",
                });
            } else {
                toast.error(data.message || "Failed to create event");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1c1c1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-serif text-white">Create New Event</h3>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Event Title</label>
                                    <div className="relative group">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Summer Music Festival"
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                    <div className="relative group">
                                        <AlignLeft className="absolute left-4 top-4 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your event..."
                                            rows={4}
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Event Category</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="e.g. Music, Tech, Art"
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="e.g. Kathmandu, Nepal"
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Ticket Capacities (Categories)</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="number"
                                                    value={formData.capacity.premium}
                                                    onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, premium: e.target.value } })}
                                                    placeholder="Premium"
                                                    className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="number"
                                                    value={formData.capacity.standard}
                                                    onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, standard: e.target.value } })}
                                                    placeholder="Standard"
                                                    className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="number"
                                                    value={formData.capacity.economy}
                                                    onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, economy: e.target.value } })}
                                                    placeholder="Economy"
                                                    className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Ticket Price ($)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0.00"
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-purple-400">Actual Event Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                                        <input
                                            required
                                            type="datetime-local"
                                            step="60"
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            className="w-full bg-[#111113] border border-purple-500/30 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Ticket Sales Start</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            required
                                            type="datetime-local"
                                            step="60"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Ticket Sales End</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            required
                                            type="datetime-local"
                                            step="60"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-white/5 text-gray-400 font-bold hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <span>Create Event</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
