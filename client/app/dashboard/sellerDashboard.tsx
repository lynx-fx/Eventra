"use client";

import React, { useState, useEffect } from "react";
import { User } from "./page";
import SellerSidebar from "./components/seller/SellerSidebar";
import SellerEvents from "./components/seller/SellerEvents";
import SellerSales from "./components/seller/SellerSales";
import SellerAttendees from "./components/seller/SellerAttendees";
import SellerAnalytics from "./components/seller/SellerAnalytics";
import UserSettings from "./components/user/UserSettings";
import { Search, Plus, Calendar, Users, DollarSign, Eye, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "../../service/axiosInstance";
import CreateEventModal from "./components/seller/CreateEventModal";
import Cookies from "js-cookie";
import { toast } from "sonner";

interface Props {
  user: User;
}

export default function SellerDashboard({ user }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("auth");
      const { data } = await axiosInstance.get("/api/events", {
        headers: {
          auth: token
        }
      });
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  const totalRevenue = events.reduce((acc, event) => acc + (event.price || 0) * (event.soldTickets || 0), 0);
  const totalTickets = events.reduce((acc, event) => acc + (event.soldTickets || 0), 0);

  const stats = [
    { label: "Total Events", value: events.length.toString(), icon: Calendar },
    { label: "Tickets Sold", value: totalTickets.toLocaleString(), icon: Users },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Total Views", value: "0", icon: Eye }, // Placeholder for views
  ];

  const recentEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30">
      <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="p-8 lg:p-12 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 gap-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search across your hub..."
                className="w-full bg-[#111113] border border-white/5 text-gray-200 rounded-2xl py-3.5 pl-12 pr-6 focus:ring-1 focus:ring-purple-500/50 outline-none placeholder-gray-600 transition-all font-light"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                </div>
                <div className="w-11 h-11 bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-serif text-lg shadow-xl shadow-purple-600/20">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <header>
                <h1 className="text-4xl font-serif text-white tracking-tight">Seller <span className="text-purple-500">Hub</span></h1>
                <p className="text-gray-500 mt-2">Welcome back! Manage your events and track your success.</p>
              </header>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-[#111113] p-6 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{stat.value}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Events List */}
                <div className="lg:col-span-2 bg-[#111113] rounded-4xl p-8 border border-white/5">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif text-white">Recent Events</h3>
                    <button
                      onClick={() => setActiveTab("events")}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest font-bold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="py-10 text-center text-gray-500 italic">Loading events...</div>
                    ) : recentEvents.length === 0 ? (
                      <div className="py-10 text-center text-gray-500 italic">No events found.</div>
                    ) : recentEvents.map((event) => (
                      <div key={event._id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-[10px] uppercase font-bold text-gray-400">
                            <span className="text-purple-500">{new Date(event.startDate).toLocaleDateString(undefined, { month: 'short' })}</span>
                            <span>{new Date(event.startDate).getDate()}</span>
                          </div>
                          <div>
                            <h4 className="text-gray-200 font-medium group-hover:text-white transition-colors">{event.title}</h4>
                            <p className="text-xs text-gray-500">{event.soldTickets || 0} / {(event.capacity?.premium || 0) + (event.capacity?.standard || 0) + (event.capacity?.economy || 0)} tickets sold</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${event.status === "approved" ? "bg-green-500/10 text-green-500" :
                          event.status === "pending" ? "bg-orange-500/10 text-orange-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                          {event.status || "pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                  <div className="bg-linear-to-br from-purple-600 to-blue-710 p-8 rounded-4xl text-white shadow-2xl shadow-purple-600/20">
                    <h3 className="text-xl font-serif mb-4 leading-tight">Host Your Next Big Event</h3>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Create Now
                    </button>
                  </div>

                  <div className="bg-[#111113] p-8 rounded-4xl border border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Quick Insights</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-8 bg-green-500 rounded-full" />
                        <div>
                          <p className="text-xs text-gray-500">Sales Velocity</p>
                          <p className="text-sm font-medium text-white">+24% vs last week</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-8 bg-purple-500 rounded-full" />
                        <div>
                          <p className="text-xs text-gray-500">Conversion Rate</p>
                          <p className="text-sm font-medium text-white">8.2% avg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && <SellerEvents events={events} isLoading={isLoading} fetchEvents={fetchEvents} />}
          {activeTab === "sales" && <SellerSales />}
          {activeTab === "attendees" && <SellerAttendees />}
          {activeTab === "analytics" && <SellerAnalytics />}
          {activeTab === "profile" && <UserSettings />}

        </div>
      </main>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}

