"use client"

import React, { useState } from "react";
import { User } from "./page";
import AdminSidebar from "./components/admin/AdminSidebar";
import AdminOverview from "./components/admin/AdminOverview";
import AdminEventsView from "./components/admin/AdminEventsView";
import AdminUsersView from "./components/admin/AdminUsersView";
import AdminReportsView from "./components/admin/AdminReportsView";
import UserSettings from "./components/user/UserSettings";
import { Search, Bell, LogOut, ChevronDown, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Props {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function AdminDashboard({ user, setUser }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("auth");
    toast.success("Successfully logged out");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30 overflow-hidden text-sm">
      {/* Sidebar Navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto p-4 lg:p-12 relative z-10">

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-white/5 pb-8">
            <div className="relative w-full md:max-w-xl group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 w-5 h-5 pointer-events-none transition-colors" />
              <input
                type="text"
                placeholder="Secure system search (UUID, Email, Transaction ID)..."
                className="w-full bg-[#111113] border border-white/5 text-gray-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none placeholder-gray-600 transition-all font-light shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2">
                <button className="p-3 bg-[#111113] border border-white/5 rounded-2xl text-gray-500 hover:text-white hover:border-white/10 transition-all relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#111113]" />
                </button>
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mt-1">Super Admin</p>
                </div>

                <div className="group relative">
                  <button className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#111113] border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/20 overflow-hidden">
                      {user.profileUrl ? (
                        <img
                          src={user.profileUrl.startsWith("/images")
                            ? `${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${user.profileUrl}`
                            : user.profileUrl
                          }
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <ChevronDown size={14} className="text-gray-500 mr-2" />
                  </button>

                  <div className="absolute right-0 mt-3 w-56 bg-[#161618] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 overflow-hidden">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      Profiles Settings
                    </button>
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl transition-all flex items-center gap-3"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Rendering */}
          <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === "overview" && <AdminOverview />}
            {activeTab === "events" && <AdminEventsView />}
            {activeTab === "users" && <AdminUsersView />}
            {activeTab === "reports" && <AdminReportsView />}
            {(activeTab === "profile" || activeTab === "settings") && <UserSettings user={user} setUser={setUser} />}

            {activeTab === "sellers" && (
              <div className="flex flex-col items-center justify-center py-24 bg-[#111113] rounded-4xl border border-dashed border-white/10">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                  <Users size={32} />
                </div>
                <p className="text-gray-400 font-serif text-2xl">Sellers Verification</p>
                <p className="text-gray-600 text-sm mt-3 max-w-sm text-center px-4">This module is being optimized for high-volume seller verification. Full access will be restored shortly.</p>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="flex flex-col items-center justify-center py-24 bg-[#111113] rounded-4xl border border-dashed border-white/10">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                  <Bell size={32} />
                </div>
                <p className="text-gray-400 font-serif text-2xl text-center">Global Ledger Interface</p>
                <p className="text-gray-600 text-sm mt-3 max-w-sm text-center px-4">Financial auditing tools are undergoing a security audit. Check back in a few minutes.</p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="flex flex-col items-center justify-center py-24 bg-[#111113] rounded-4xl border border-dashed border-white/10">
                <p className="text-gray-500 font-serif text-xl italic font-bold">Core System Settings...</p>
                <p className="text-gray-600 text-sm mt-2 text-center">Configure global variables, security protocols, and API integrations.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
