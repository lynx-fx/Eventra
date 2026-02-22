"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Users, Ticket, Check, ChevronRight, Loader2, CreditCard } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface EventData {
    _id: string;
    title: string;
    description: string;
    eventDate: string;
    city: string;
    venue: string;
    category: string;
    price: {
        premium: number;
        standard: number;
        economy: number;
    };
    capacity: {
        premium: number;
        standard: number;
        economy: number;
    };
    soldTickets: {
        premium: number;
        standard: number;
        economy: number;
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: EventData | null;
    onSuccess: () => void;
}

export default function BookingModal({ isOpen, onClose, event, onSuccess }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<"premium" | "standard" | "economy">("standard");
    const [step, setStep] = useState(1);
    const AUTH_TOKEN = Cookies.get("auth");

    if (!event) return null;

    const ticketTypes = [
        {
            id: "premium",
            name: "Premium Experience",
            price: event.price?.premium || 0,
            available: (event.capacity?.premium || 0) - (event.soldTickets?.premium || 0),
            features: ["Front row access", "Meet & Greet", "Complimentary drink"],
            color: "from-purple-600 to-indigo-600"
        },
        {
            id: "standard",
            name: "Standard Pass",
            price: event.price?.standard || 0,
            available: (event.capacity?.standard || 0) - (event.soldTickets?.standard || 0),
            features: ["Main hall access", "Basic refreshments", "Event merchandise"],
            color: "from-blue-600 to-cyan-600"
        },
        {
            id: "economy",
            name: "Economy Entry",
            price: event.price?.economy || 0,
            available: (event.capacity?.economy || 0) - (event.soldTickets?.economy || 0),
            features: ["General admission", "Standard seating", "Great view"],
            color: "from-gray-600 to-slate-700"
        }
    ];

    // TODO: add payment integration here
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post("/api/tickets/buy", {
                eventId: event._id,
                ticketType: selectedType
            }, {
                headers: {
                    auth: AUTH_TOKEN
                }
            });

            if (data.success) {
                toast.success("Ticket booked successfully!");
                onSuccess();
                onClose();
                setStep(1);
            } else {
                toast.error(data.message || "Failed to book ticket");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred during booking");
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
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative w-full max-w-4xl bg-[#0f0f11] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                    >
                        {/* Left Side: Event Details */}
                        <div className="w-full md:w-2/5 p-10 bg-linear-to-br from-purple-600/10 to-transparent flex flex-col justify-between">
                            <div>
                                <span className="px-4 py-1.5 bg-purple-600/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-purple-500/20">
                                    Secure Checkout
                                </span>
                                <h3 className="text-3xl font-serif text-white mt-6 leading-tight">{event.title}</h3>

                                <div className="space-y-6 mt-10">
                                    <div className="flex items-center gap-4 text-gray-400 group">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-purple-400 transition-colors">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Event Date</p>
                                            <p className="text-sm font-medium">{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-400 group">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:text-purple-400 transition-colors">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Location</p>
                                            <p className="text-sm font-medium">{event.venue}, {event.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Summary</p>
                                <div className="flex flex-col xl:flex-row xl:justify-between items-start xl:items-end gap-2">
                                    <div>
                                        <p className="text-white font-medium">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Pass</p>
                                        <p className="text-[10px] text-gray-500">1x Ticket</p>
                                    </div>
                                    <p className="text-2xl font-bold font-mono text-purple-400">
                                        NPR {ticketTypes.find(t => t.id === selectedType)?.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Step through Selection */}
                        <div className="flex-1 p-10 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex gap-2">
                                    <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-purple-500' : 'bg-gray-700'}`} />
                                    <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-purple-500' : 'bg-gray-700'}`} />
                                </div>
                                <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {step === 1 ? (
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                    <h4 className="text-xl font-serif text-white mb-6">Choose your experience</h4>
                                    <div className="space-y-4">
                                        {ticketTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                disabled={type.available <= 0}
                                                onClick={() => setSelectedType(type.id as any)}
                                                className={`w-full text-left p-6 rounded-[24px] border transition-all relative overflow-hidden group ${selectedType === type.id
                                                    ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500/50'
                                                    : 'border-white/5 bg-[#161618] hover:border-white/10'
                                                    } ${type.available <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <div className="flex justify-between items-start mb-4 relative z-10 pr-6">
                                                    <div>
                                                        <h5 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{type.name}</h5>
                                                        <p className="text-xs text-gray-500">{type.available} seats remaining</p>
                                                    </div>
                                                    <p className="text-xl font-bold font-mono text-white text-right">NPR {type.price.toFixed(2)}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-2 relative z-10">
                                                    {type.features.map((f, i) => (
                                                        <span key={i} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium italic">
                                                            <Check size={10} className="text-purple-500" /> {f}
                                                        </span>
                                                    ))}
                                                </div>

                                                {selectedType === type.id && (
                                                    <div className="absolute top-4 right-4 text-purple-500">
                                                        <Check size={20} />
                                                    </div>
                                                )}

                                                {/* Decorative Gradient Line */}
                                                <div className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${type.color} opacity-0 group-hover:opacity-100 transition-opacity w-full`} />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 active:scale-95"
                                    >
                                        Proceed to Checkout
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h4 className="text-xl font-serif text-white mb-6">Payment Method</h4>

                                    <div className="space-y-4 mb-10">
                                        <div className="p-6 bg-green-600/10 border border-green-500/30 rounded-3xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                                                    <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">eSewa Mobile Wallet</p>
                                                    <p className="text-xs text-gray-500">Pay securely via eSewa</p>
                                                </div>
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Ticket Subtotal</span>
                                            <span className="text-white">NPR {ticketTypes.find(t => t.id === selectedType)?.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Service Fee</span>
                                            <span className="text-white">NPR 0.00</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                            <span className="text-gray-300 font-medium">Total Amount</span>
                                            <span className="text-3xl font-bold font-mono text-white">NPR {ticketTypes.find(t => t.id === selectedType)?.price.toFixed(2)}</span>
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <button
                                                onClick={() => setStep(1)}
                                                disabled={isLoading}
                                                className="flex-1 py-4 border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl font-bold transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                                className="flex-[2] py-4 bg-[#60BB46] hover:bg-[#4d9738] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#60BB46]/20"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={20} />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Pay with eSewa</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
