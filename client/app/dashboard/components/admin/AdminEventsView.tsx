"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Calendar,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    Download,
    Loader2,
    MapPin,
    Users
} from "lucide-react"
import axiosInstance from "../../../../service/axiosInstance"
import { toast } from "sonner"
import Cookies from "js-cookie"

export default function AdminEventsView() {
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState("All")

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get("auth")
            const { data } = await axiosInstance.get("/api/events", {
                headers: { auth: token }
            })
            if (data.success) {
                setEvents(data.events)
            }
        } catch (error) {
            toast.error("Failed to fetch events")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = Cookies.get("auth")
            const { data } = await axiosInstance.patch(`/api/events/${id}/status`,
                { status: newStatus },
                { headers: { auth: token } }
            )
            if (data.success) {
                toast.success(`Event ${newStatus} successfully`)
                fetchEvents()
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }


    const filteredEvents = events.filter(event =>
        filterStatus === "All" || event.status === filterStatus.toLowerCase()
    )

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
                <div className="relative group md:col-span-2 text-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 w-4 h-4 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-purple-500/50 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-400 appearance-none focus:ring-1 focus:ring-purple-500/50 outline-none cursor-pointer"
                    >
                        <option>All</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#111113] rounded-3xl border border-white/5 overflow-hidden">
                {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-purple-500" size={32} />
                        <p className="text-gray-500 font-serif italic text-sm">Synchronizing event database...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-gray-500 font-serif italic">No events found matching your criteria.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5 font-bold">
                                <th className="py-4 px-8">Event Details</th>
                                <th className="py-4 px-8">Category</th>
                                <th className="py-4 px-8 text-center">Status</th>
                                <th className="py-4 px-8 text-right">Moderation Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredEvents.map((event) => (
                                <tr key={event._id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-200 group-hover:text-white">{event.title}</span>
                                            <span className="text-[11px] text-gray-600 flex items-center gap-1 mt-1">
                                                <Calendar size={10} />
                                                {new Date(event.eventDate || event.startDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-400">{event.category || "General"}</span>
                                            <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                                <MapPin size={10} />
                                                {event.location || "Global"}
                                            </span>
                                            <span className="text-[10px] text-purple-500/50 flex items-center gap-1 mt-0.5">
                                                <Users size={10} />
                                                {(event.capacity?.premium || 0) + (event.capacity?.standard || 0) + (event.capacity?.economy || 0)} Cap
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-center">
                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${event.status === "approved" ? "bg-green-500/10 text-green-500" :
                                            event.status === "pending" ? "bg-orange-500/10 text-orange-500" :
                                                "bg-red-500/10 text-red-500"
                                            }`}>
                                            {event.status || "pending"}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(event._id, "approved")}
                                                disabled={event.status === "approved"}
                                                title="Approve Event"
                                                className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(event._id, "rejected")}
                                                disabled={event.status === "rejected"}
                                                title="Reject Event"
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-xs text-gray-500">Showing {filteredEvents.length} events</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white">Next</button>
                </div>
            </div>
        </motion.div>
    )
}
