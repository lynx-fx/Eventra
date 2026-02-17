"use client"

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteEventModal({ isOpen, onClose, onConfirm, isDeleting }: Props) {
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
                        className="relative w-full max-w-md bg-[#1c1c1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-xl font-serif text-white">Delete Event?</h3>
                            <p className="text-gray-400 text-sm">
                                Are you sure you want to delete this event? This action cannot be undone and all associated data will be removed.
                            </p>

                            <div className="flex gap-3 w-full pt-4">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 bg-[#111113] border border-white/5 rounded-xl text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 text-sm"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            <Trash2 size={18} />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
