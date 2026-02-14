"use client"

import React from "react";
import { Search, User, Mail, Phone, Ticket } from "lucide-react";

const attendees = [
    { name: "Arjun Thapa", email: "arjun@example.com", phone: "+977 9801234567", event: "ICP X-mas Fest", ticket: "VIP Pass" },
    { name: "Sita Rai", email: "sita@example.com", phone: "+977 9841234568", event: "Summer Music Festival", ticket: "General Admission" },
    { name: "Rahul Sharma", email: "rahul@example.com", phone: "+977 9811234569", event: "ICP X-mas Fest", ticket: "Early Bird" },
    { name: "Maya Gurung", email: "maya@example.com", phone: "+977 9851234570", event: "Food Festival", ticket: "All Access" },
    { name: "Bikash Rana", email: "bikash@example.com", phone: "+977 9861234571", event: "Tech Conference", ticket: "Speaker" },
];

export default function SellerAttendees() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-white">Attendees</h2>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search attendees by name, email or event..."
                            className="w-full bg-[#111113] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                    {attendees.map((person, i) => (
                        <div key={i} className="bg-[#111113] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">{person.name}</h3>
                                    <p className="text-xs text-gray-500">Member since 2024</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Mail size={14} className="text-gray-600" />
                                    <span>{person.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Phone size={14} className="text-gray-600" />
                                    <span>{person.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Ticket size={14} className="text-purple-500" />
                                    <span>{person.event}</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md text-gray-400">
                                        {person.ticket}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
