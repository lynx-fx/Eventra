"use client"

import React from "react";
import { Search, Plus, Calendar, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";

const events = [
    {
        id: 1,
        name: "ICP X-mas Fest",
        date: "Dec 25, 2025",
        location: "Pokhara, Nepal",
        sold: 245,
        total: 500,
        revenue: "$12,250",
        status: "Active",
        statusColor: "bg-green-500/20 text-green-500"
    },
    {
        id: 2,
        name: "Summer Music Festival",
        date: "Jan 20, 2026",
        location: "Kathmandu, Nepal",
        sold: 180,
        total: 300,
        revenue: "$9,000",
        status: "Active",
        statusColor: "bg-green-500/20 text-green-500"
    },
    {
        id: 3,
        name: "Tech Conference 2026",
        date: "Feb 15, 2026",
        location: "Lalitpur, Nepal",
        sold: 89,
        total: 200,
        revenue: "$8,900",
        status: "Upcoming",
        statusColor: "bg-blue-500/20 text-blue-500"
    },
    {
        id: 4,
        name: "Food Festival",
        date: "Nov 10, 2025",
        location: "Pokhara, Nepal",
        sold: 500,
        total: 500,
        revenue: "$25,000",
        status: "Completed",
        statusColor: "bg-gray-500/20 text-gray-400"
    }
];

export default function SellerEvents() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-white">Manage Events</h2>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20">
                    <Plus size={18} />
                    <span>New Event</span>
                </button>
            </div>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search your events..."
                            className="w-full bg-[#111113] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                                <th className="px-6 py-4 font-medium">Event Details</th>
                                <th className="px-6 py-4 font-medium">Capacity</th>
                                <th className="px-6 py-4 font-medium">Sales</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-gray-200 font-medium">{event.name}</span>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                <Calendar size={12} />
                                                <span>{event.date}</span>
                                                <span>•</span>
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="w-32">
                                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                <span>{event.sold} Sold</span>
                                                <span>{event.total}</span>
                                            </div>
                                            <div className="h-1.5 bg-[#111113] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{ width: `${(event.sold / event.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-gray-300 font-medium">{event.revenue}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.statusColor}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <button className="group-hover:hidden p-2 text-gray-500">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
