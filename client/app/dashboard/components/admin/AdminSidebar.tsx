"use client"

import React from "react"
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "events", label: "Events", icon: Calendar },
        { id: "users", label: "Users", icon: Users },
        { id: "reports", label: "Reports", icon: ShieldCheck },
        { id: "transactions", label: "Transactions", icon: TrendingUp },
    ]

    const bottomItems = [
        { id: "settings", label: "Settings", icon: Settings },
    ]

    return (
        <aside className="w-72 border-r border-white/5 bg-[#0a0a0c] flex flex-col h-screen sticky top-0 hidden lg:flex">
            {/* Brand */}
            <div className="p-8 pb-12">
                <div className="flex items-center gap-3 group px-4">
                    <div className="w-10 h-10 relative">
                        <Image src="/logo.png" alt="Eventra Logo" fill className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white tracking-tight">Eventra</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-500">Admin Portal</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="px-6 text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 mt-2">Main Menu</p>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full group flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id
                            ? "bg-white/5 text-white shadow-xl shadow-black/20 border border-white/10"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <item.icon size={20} className={`${activeTab === item.id ? "text-purple-500" : "group-hover:text-gray-300"}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {activeTab === item.id && (
                            <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        )}
                    </button>
                ))}

                <p className="px-6 text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 mt-12">System</p>
                {bottomItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full group flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id
                            ? "bg-white/5 text-white border border-white/10"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                            }`}
                    >
                        <item.icon size={20} className={`${activeTab === item.id ? "text-purple-500" : "group-hover:text-gray-300"}`} />
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Admin Profile Footer */}
            <div className="p-4 mt-auto">
                <div className="bg-[#111113] border border-white/5 rounded-3xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#111113] rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">Admin</p>
                            <p className="text-[10px] text-gray-500 truncate">System Manager</p>
                        </div>
                        <button title="Help" className="p-2 text-gray-500 hover:text-white transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
