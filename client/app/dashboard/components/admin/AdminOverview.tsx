"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Users,
    Calendar,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldAlert,
    CheckCircle2,
    MoreHorizontal,
    Loader2
} from "lucide-react"
import axiosInstance from "../../../../service/axiosInstance"
import { toast } from "sonner"
import Cookies from "js-cookie"

export default function AdminOverview() {
    const [statsData, setStatsData] = useState<any>(null)
    const [pendingEvents, setPendingEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const token = Cookies.get("auth")

            // Parallel fetch for better performance
            const [analyticsRes, eventsRes] = await Promise.all([
                axiosInstance.get("/api/admin/analytics", { headers: { auth: token } }),
                axiosInstance.get("/api/events", { headers: { auth: token } })
            ]);

            if (analyticsRes.data.success) {
                setStatsData(analyticsRes.data.analytics);
            }

            if (eventsRes.data.success) {
                const pending = eventsRes.data.events.filter((e: any) => e.status === "pending")
                setPendingEvents(pending.slice(0, 5))
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard data")
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchData()
    }, [])

    const stats = [
        { label: "Total Revenue", value: `$${statsData?.totalRevenue?.toLocaleString() || "0"}`, change: "+12.5%", trend: "up", icon: DollarSign, color: "text-green-400" },
        { label: "Total Users", value: statsData?.totalUsers || "0", change: "+4.2%", trend: "up", icon: Users, color: "text-blue-400" },
        { label: "Total Events", value: statsData?.totalEvents || "0", change: "+8.1%", trend: "up", icon: Calendar, color: "text-purple-400" },
        { label: "Pending Approvals", value: statsData?.pendingEvents || "0", change: "-2", trend: "down", icon: ShieldAlert, color: "text-orange-400" },
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

    if (isLoading) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center gap-4 text-gray-500">
                <Loader2 className="animate-spin text-purple-500" size={40} />
                <p className="font-serif italic animate-pulse">Aggregating system metrics...</p>
            </div>
        )
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
                    </div>

                    <div className="overflow-x-auto">
                        {pendingEvents.length === 0 ? (
                            <div className="py-20 text-center text-gray-500 italic font-serif">
                                All quiet in the moderation queue.
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5 font-bold">
                                        <th className="pb-4 px-4 font-bold">Event Details</th>
                                        <th className="pb-4 px-4 font-bold text-center">Status</th>
                                        <th className="pb-4 px-4 font-bold">Estimated Rev</th>
                                        <th className="pb-4 text-right pr-4 font-bold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pendingEvents.map((req) => (
                                        <tr key={req._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-5 px-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{req.title}</p>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5 uppercase tracking-widest font-bold">
                                                        <Clock size={10} /> {new Date(req.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-sm text-gray-300 font-mono tracking-tighter">${req.price?.toFixed(2) || "0.00"}</td>
                                            <td className="py-5 text-right pr-4">
                                                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
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
