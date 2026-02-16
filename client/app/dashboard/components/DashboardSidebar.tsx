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
        <aside className="w-64 bg-card min-h-screen p-6 flex flex-col border-r border-border">
            <div className="mb-10 pl-2">
                <h1 className="text-foreground text-2xl font-serif">Eventra</h1>
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
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-border mt-auto">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
