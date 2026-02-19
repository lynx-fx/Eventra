import React from "react";
import {
    LayoutDashboard,
    Calendar,
    DollarSign,
    User,
    LogOut,
    BarChart3,
    Flag
} from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export default function SellerSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "events", label: "My Events", icon: Calendar },
        { id: "sales", label: "Sales", icon: DollarSign },
        { id: "attendees", label: "Attendees", icon: User },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "reports", label: "Reports", icon: Flag },
    ];

    return (
        <aside className="w-64 bg-[#050505] min-h-screen p-6 flex flex-col border-r border-gray-900">
            <div className="mb-10 pl-2">
                <h1 className="text-white text-2xl font-serif">Eventra <span className="text-xs font-sans text-purple-500 block">Seller Hub</span></h1>
            </div>

            <nav className="space-y-2 flex-col flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive
                                ? "bg-[#8B5CF6] text-white font-medium"
                                : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-gray-800 mt-auto">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
