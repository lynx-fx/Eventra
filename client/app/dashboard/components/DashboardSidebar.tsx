import React from "react";
import {
    LayoutDashboard,
    Ticket,
    Image as ImageIcon,
    User,
    LogOut,
} from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "tickets", label: "My Tickets", icon: Ticket },
        { id: "gallery", label: "Event Room", icon: ImageIcon },
        { id: "profile", label: "Profile", icon: User },
    ];

    return (
        <aside className="w-64 bg-[#050505] min-h-screen p-6 flex flex-col border-r border-gray-900">
            <div className="mb-10 pl-2">
                <h1 className="text-white text-2xl font-serif">Eventra</h1>
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
