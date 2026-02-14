"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Calendar,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    Download,
    AlertCircle
} from "lucide-react"

export default function AdminEventsView() {
    const events = [
        { id: "EVT-001", title: "Global Tech Summit", seller: "TechCorp", date: "2026-05-12", status: "Pending", category: "Conference" },
        { id: "EVT-002", title: "Summer Beats Fest", seller: "MusicHub", date: "2026-06-20", status: "Approved", category: "Music" },
        { id: "EVT-003", title: "AI Workshops", seller: "Future Labs", date: "2026-04-15", status: "Rejected", category: "Education" },
        { id: "EVT-004", title: "Modern Art Gala", seller: "Art Collective", date: "2026-07-05", status: "Pending", category: "Art" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-white">Event <span className="text-purple-500">Moderation</span></h2>
                    <p className="text-gray-500 mt-1 text-sm">Review, approve, or manage all system-wide events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#111113] border border-white/5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 w-4 h-4 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title or ID..."
                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-purple-500/50 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-400 appearance-none focus:ring-1 focus:ring-purple-500/50 outline-none cursor-pointer">
                        <option>All Statuses</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-600/20">
                        Apply Filters
                    </button>
                </div>
            </div>

            <div className="bg-[#111113] rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5 font-bold">
                            <th className="py-4 px-6 font-bold">Event ID</th>
                            <th className="py-4 px-6 font-bold">Title</th>
                            <th className="py-4 px-6 font-bold">Seller</th>
                            <th className="py-4 px-6 font-bold">Status</th>
                            <th className="py-4 px-6 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {events.map((event) => (
                            <tr key={event.id} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="py-5 px-6 text-sm font-mono text-gray-500">{event.id}</td>
                                <td className="py-5 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">{event.title}</span>
                                        <span className="text-[11px] text-gray-600">{event.category} • {event.date}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6 text-sm text-gray-400">{event.seller}</td>
                                <td className="py-5 px-6">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${event.status === "Approved" ? "bg-green-500/10 text-green-500" :
                                            event.status === "Pending" ? "bg-orange-500/10 text-orange-500" :
                                                "bg-red-500/10 text-red-500"
                                        }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button title="View" className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                            <Eye size={16} />
                                        </button>
                                        <button title="Approve" className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all">
                                            <CheckCircle size={16} />
                                        </button>
                                        <button title="Reject" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-xs text-gray-500">Showing 4 of 1,204 events</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white">Next</button>
                </div>
            </div>
        </motion.div>
    )
}
