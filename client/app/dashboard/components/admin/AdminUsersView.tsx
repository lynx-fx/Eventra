"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Users,
    Mail,
    Shield,
    MoreVertical,
    UserPlus,
    Trash2,
    Ban
} from "lucide-react"

export default function AdminUsersView() {
    const users = [
        { id: 1, name: "Anup Thapa", email: "anup@example.com", role: "Seller", joined: "2024-01-12", status: "Active" },
        { id: 2, name: "Sarah Jenkins", email: "sarah@events.com", role: "Admin", joined: "2023-11-05", status: "Active" },
        { id: 3, name: "Mark Wilson", email: "mark@user.com", role: "User", joined: "2024-02-28", status: "Inactive" },
        { id: 4, name: "Elena Rodriguez", email: "elena@music.net", role: "Seller", joined: "2024-03-10", status: "Active" },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center bg-[#111113] p-8 rounded-4xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-serif text-white">User <span className="text-purple-500">Directory</span></h2>
                    <p className="text-gray-500 mt-1 text-sm">Manage access, roles, and security for all platform participants.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-purple-600/20">
                    <UserPlus size={18} /> Add New Admin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", val: "2,540", icon: Users, col: "text-blue-400" },
                    { label: "New This Month", val: "+124", icon: UserPlus, col: "text-green-400" },
                    { label: "Active Admins", val: "8", icon: Shield, col: "text-purple-400" },
                    { label: "Flagged Accounts", val: "3", icon: Ban, col: "text-red-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111113] p-6 rounded-3xl border border-white/5">
                        <stat.icon size={20} className={`${stat.col} mb-4`} />
                        <p className="text-2xl font-bold text-white mb-1">{stat.val}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#111113] rounded-4xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Platform Participants</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Database Connection</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-white/5">
                                <th className="py-5 px-8">Member</th>
                                <th className="py-5 px-8">System Role</th>
                                <th className="py-5 px-8">Joined Date</th>
                                <th className="py-5 px-8">Status</th>
                                <th className="py-5 px-8 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-white/80 font-bold text-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{user.name}</p>
                                                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                                    <Mail size={10} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-2">
                                            {user.role === "Admin" && <Shield size={12} className="text-purple-500" />}
                                            <span className={`text-xs font-medium ${user.role === "Admin" ? "text-purple-400" : "text-gray-400"}`}>{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-xs text-gray-500 font-mono">{user.joined}</td>
                                    <td className="py-5 px-8">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${user.status === "Active" ? "text-green-500" : "text-gray-500"}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-600"}`} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button title="Edit User" className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                            <button title="Delete" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}
