"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldAlert,
    CheckCircle2,
    MoreHorizontal
} from "lucide-react"

export default function AdminOverview() {
    const stats = [
        { label: "Total Revenue", value: "$412,890", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-green-400" },
        { label: "Active Users", value: "24.5k", change: "+4.2%", trend: "up", icon: Users, color: "text-blue-400" },
        { label: "Total Events", value: "1,204", change: "+8.1%", trend: "up", icon: Calendar, color: "text-purple-400" },
        { label: "Pending Approvals", value: "18", change: "-2", trend: "down", icon: ShieldAlert, color: "text-orange-400" },
    ]

    const recentApprovals = [
        { id: 1, name: "Neon Night 2026", seller: "Neon Media", date: "2 mins ago", status: "Approved", price: "$45.00" },
        { id: 2, name: "Tech Summit", seller: "Global Events", date: "15 mins ago", status: "Pending", price: "$120.00" },
        { id: 3, name: "House of Jazz", seller: "Smooth Vibes", date: "1 hour ago", status: "Approved", price: "$30.00" },
        { id: 4, name: "Food Expo", seller: "Taste Makers", date: "4 hours ago", status: "Rejected", price: "$15.00" },
    ]

    const topSellers = [
        { id: 1, name: "John Events", sales: "$45,200", growth: "24%", avatar: "J" },
        { id: 2, name: "Sarah Media", sales: "$32,100", growth: "18%", avatar: "S" },
        { id: 3, name: "Urban Organizers", sales: "$28,500", growth: "12%", avatar: "U" },
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-12"
        >
            <header>
                <h1 className="text-4xl font-serif text-white tracking-tight">System <span className="text-purple-500">Overview</span></h1>
                <p className="text-gray-500 mt-2">Real-time monitoring and administrative controls.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={index}
                            variants={item}
                            className="bg-[#111113] p-6 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon size={64} />
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                    {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{stat.value}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Table */}
                <motion.div variants={item} className="lg:col-span-2 bg-[#111113] rounded-4xl p-8 border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <h3 className="text-xl font-serif text-white">Pending Moderation</h3>
                        </div>
                        <button className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest font-bold">
                            View Moderation Queue
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5 font-bold">
                                    <th className="pb-4 px-4 font-bold">Event Details</th>
                                    <th className="pb-4 px-4 font-bold">Seller</th>
                                    <th className="pb-4 px-4 font-bold">Status</th>
                                    <th className="pb-4 px-4 font-bold">Price</th>
                                    <th className="pb-4 text-right pr-4 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentApprovals.map((req) => (
                                    <tr key={req.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{req.name}</p>
                                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Clock size={10} /> {req.date}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4 text-sm text-gray-400">{req.seller}</td>
                                        <td className="py-5 px-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${req.status === "Approved" ? "bg-green-500/10 text-green-500" :
                                                    req.status === "Pending" ? "bg-orange-500/10 text-orange-500" :
                                                        "bg-red-500/10 text-red-500"
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-sm text-gray-300 font-mono">{req.price}</td>
                                        <td className="py-5 text-right pr-4">
                                            <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Top Sellers */}
                    <motion.div variants={item} className="bg-[#111113] rounded-4xl p-8 border border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8 font-bold">Top Performing Sellers</h3>
                        <div className="space-y-6">
                            {topSellers.map((seller) => (
                                <div key={seller.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                                            {seller.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{seller.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{seller.growth} Growth</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-white font-mono">{seller.sales}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                            All Sellers
                        </button>
                    </motion.div>

                    {/* System Health */}
                    <motion.div variants={item} className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-4xl p-8 text-white shadow-2xl shadow-purple-600/20">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 size={24} />
                            <h3 className="text-lg font-serif">System Healthy</h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Global servers are operating at 99.9% uptime. All API gateways are responsive.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1.5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            Live Monitoring
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
