"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, Type, AlignLeft, Tag, Loader2, MapPin, Users } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    eventToEdit?: any;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess, eventToEdit }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const AUTH_TOKEN = Cookies.get("auth");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        location: "",
        price: {
            premium: "",
            standard: "",
            economy: "",
        },
        capacity: {
            premium: "",
            standard: "",
            economy: "",
        },
        startDate: "",
        endDate: "",
        eventDate: "",
        bannerImage: null as File | null,
    });

    useEffect(() => {
        if (eventToEdit) {
            // Helper to format date for datetime-local
            const formatDate = (dateString: string) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                // Adjust for local timezone offset manually or use simple slice if string is ISO
                // Using simplistic approach:
                return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            };

            setFormData({
                title: eventToEdit.title || "",
                description: eventToEdit.description || "",
                category: eventToEdit.category || "",
                location: eventToEdit.location || "",
                price: {
                    premium: eventToEdit.price?.premium || "",
                    standard: eventToEdit.price?.standard || "",
                    economy: eventToEdit.price?.economy || "",
                },
                capacity: {
                    premium: eventToEdit.capacity?.premium || "",
                    standard: eventToEdit.capacity?.standard || "",
                    economy: eventToEdit.capacity?.economy || "",
                },
                startDate: formatDate(eventToEdit.startDate),
                endDate: formatDate(eventToEdit.endDate),
                eventDate: formatDate(eventToEdit.eventDate),
                bannerImage: null, // Keep null, only update if user selects new
            });
        } else {
            // Reset form
            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                price: { premium: "", standard: "", economy: "" },
                capacity: { premium: "", standard: "", economy: "" },
                startDate: "",
                endDate: "",
                eventDate: "",
                bannerImage: null,
            });
        }
        setStep(1);
    }, [eventToEdit, isOpen]);

    const nextStep = () => {
        if (step === 1) {
            if (!formData.title || !formData.location || !formData.category) {
                toast.error("Please fill in the required basic event details.");
                return;
            }
            setStep(2);
        }
    };

    const prevStep = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            nextStep();
            return;
        }
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("category", formData.category);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("startDate", formData.startDate);
            formDataToSend.append("endDate", formData.endDate);
            formDataToSend.append("eventDate", formData.eventDate);
            formDataToSend.append("price", JSON.stringify({
                premium: Number(formData.price.premium) || 0,
                standard: Number(formData.price.standard) || 0,
                economy: Number(formData.price.economy) || 0,
            }));
            formDataToSend.append("capacity", JSON.stringify({
                premium: Number(formData.capacity.premium) || 0,
                standard: Number(formData.capacity.standard) || 0,
                economy: Number(formData.capacity.economy) || 0,
            }));

            if (formData.bannerImage) {
                formDataToSend.append("bannerImage", formData.bannerImage);
            }

            let response;
            if (eventToEdit) {
                response = await axiosInstance.put(`/api/events/${eventToEdit._id}`, formDataToSend, {
                    headers: {
                        auth: AUTH_TOKEN,
                        "Content-Type": "multipart/form-data",
                    }
                });
            } else {
                response = await axiosInstance.post("/api/events", formDataToSend, {
                    headers: {
                        auth: AUTH_TOKEN,
                        "Content-Type": "multipart/form-data",
                    }
                });
            }


            if (response.data.success) {
                toast.success(eventToEdit ? "Event updated successfully!" : "Event created successfully!");
                onSuccess();
                onClose();
            } else {
                toast.error(response.data.message || "Failed to save event");
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
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-linear-to-r from-purple-600/5 to-transparent">
                            <div>
                                <h3 className="text-xl font-serif text-white">{eventToEdit ? "Edit Event" : "Create New Event"}</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                                    Step {step} of 2 — {step === 1 ? "Basics" : "Logistics & Pricing"}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 w-full bg-white/5">
                            <motion.div
                                initial={{ width: "50%" }}
                                animate={{ width: step === 1 ? "50%" : "100%" }}
                                className="h-full bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
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

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Banner Image</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.files ? e.target.files[0] : null })}
                                                    className="hidden"
                                                    id="banner-upload"
                                                />
                                                <label
                                                    htmlFor="banner-upload"
                                                    className="w-full bg-[#111113] border border-white/5 border-dashed rounded-xl py-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all group"
                                                >
                                                    <Tag className="text-gray-500 mb-2 group-hover:text-purple-500 transition-colors" />
                                                    <span className="text-xs text-gray-400">
                                                        {formData.bannerImage ? formData.bannerImage.name : "Click to upload banner image"}
                                                    </span>
                                                </label>
                                            </div>
                                            {/* Preview Logic */}
                                            {(formData.bannerImage || eventToEdit?.bannerImage) && (
                                                <div className="mt-4 relative h-32 w-full rounded-2xl overflow-hidden border border-white/10">
                                                    <img
                                                        src={formData.bannerImage ? URL.createObjectURL(formData.bannerImage) :
                                                            (eventToEdit?.bannerImage?.startsWith("/images")
                                                                ? `${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${eventToEdit.bannerImage}`
                                                                : eventToEdit?.bannerImage)
                                                        }
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                                <div className="relative group">
                                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-500 transition-colors z-10" />
                                                    <select
                                                        required
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select a category</option>
                                                        {["Music", "Sports", "Theatre", "Festival", "Concert", "Workshop", "Other"].map((cat) => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
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
                                                        placeholder="e.g. Kathmandu"
                                                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
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
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block mb-2">Ticket Tiers (Capacities & Prices)</label>

                                            {/* Premium Tier */}
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Premium Tier</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative group">
                                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.capacity.premium}
                                                            onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, premium: e.target.value } })}
                                                            placeholder="Capacity"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.price.premium}
                                                            onChange={(e) => setFormData({ ...formData, price: { ...formData.price, premium: e.target.value } })}
                                                            placeholder="Price ($)"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Standard Tier */}
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Standard Tier</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative group">
                                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.capacity.standard}
                                                            onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, standard: e.target.value } })}
                                                            placeholder="Capacity"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.price.standard}
                                                            onChange={(e) => setFormData({ ...formData, price: { ...formData.price, standard: e.target.value } })}
                                                            placeholder="Price ($)"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Economy Tier */}
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Economy Tier</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative group">
                                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.capacity.economy}
                                                            onChange={(e) => setFormData({ ...formData, capacity: { ...formData.capacity, economy: e.target.value } })}
                                                            placeholder="Capacity"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 group-focus-within:text-purple-500 transition-colors" />
                                                        <input
                                                            type="number"
                                                            value={formData.price.economy}
                                                            onChange={(e) => setFormData({ ...formData, price: { ...formData.price, economy: e.target.value } })}
                                                            placeholder="Price ($)"
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-xs text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">Timeline</label>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest ml-1">Event Date (When it happens)</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                                                    <input
                                                        required
                                                        type="datetime-local"
                                                        value={formData.eventDate}
                                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                                        className="w-full bg-[#111113] border border-purple-500/30 rounded-xl py-3 pl-12 pr-4 text-gray-200 focus:ring-1 focus:ring-purple-500 outline-none transition-all [color-scheme:dark]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Sales Start</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                        <input
                                                            required
                                                            type="datetime-local"
                                                            value={formData.startDate}
                                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-11 pr-3 text-xs text-gray-200 outline-none [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Sales End</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                                        <input
                                                            required
                                                            type="datetime-local"
                                                            value={formData.endDate}
                                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-11 pr-3 text-xs text-gray-200 outline-none [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-4 pt-6 border-t border-white/5">
                                {step === 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-6 py-3.5 rounded-xl border border-white/5 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-600/20 text-sm"
                                        >
                                            Next: Pricing
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 px-6 py-3.5 rounded-xl border border-white/5 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2 text-sm"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>{eventToEdit ? "Update Event" : "Publish Event"}</span>}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
