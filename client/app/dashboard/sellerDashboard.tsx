"use client";

import React, { useState } from "react";
import { User } from "./page";
import SellerSidebar from "./components/SellerSidebar";
import { Search, Plus, Calendar, Users, DollarSign, Eye, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  user: User;
}

export default function SellerDashboard({ user }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  const stats = [
    { label: "Total Events", value: "8", icon: Calendar, trend: "up" },
    { label: "Tickets Sold", value: "1,014", icon: Users, trend: "up" },
    { label: "Total Revenue", value: "$55,150", icon: DollarSign, trend: "up" },
    { label: "Total Views", value: "12.4k", icon: Eye, trend: "up" },
  ];

  const events = [
    {
      id: 1,
      name: "ICP X-mas Fest",
      date: "Dec 25, 2025",
      location: "Pokhara",
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
      location: "Kathmandu",
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
      location: "Lalitpur",
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
      location: "Pokhara",
      sold: 500,
      total: 500,
      revenue: "$25,000",
      status: "Completed",
      statusColor: "bg-gray-500/20 text-gray-400"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#000000] text-white font-sans">
      <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-10 gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search events, tickets or attendees..."
                className="w-full bg-[#1C1C22] border-none text-gray-300 rounded-full py-3 px-6 focus:ring-1 focus:ring-purple-500 outline-none placeholder-gray-600"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-medium transition-colors">
                <Plus size={18} />
                Create Event
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">Seller Account</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Dashboard Overview Title */}
              <h2 className="text-2xl font-normal text-white mb-6">Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-[#1C1C1F] p-5 rounded-2xl relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#2A2A35] flex items-center justify-center text-purple-400">
                          <Icon size={20} />
                        </div>
                        {/* Mock Trend Line */}
                        <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-50">
                          <path d="M0 15 Q 10 18, 20 10 T 40 5" fill="none" stroke="#22c55e" strokeWidth="2" />
                        </svg>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* My Events Table Section */}
              <div className="bg-[#1C1C1F] rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <h3 className="text-lg font-normal text-white">My Events</h3>

                  {/* Filter Tabs */}
                  <div className="flex bg-[#111113] rounded-full p-1 gap-1">
                    <button className="px-5 py-1.5 rounded-full text-xs font-medium bg-[#8B5CF6] text-white">All</button>
                    <button className="px-5 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white">Active</button>
                    <button className="px-5 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white">Upcoming</button>
                    <button className="px-5 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-white">Completed</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                        <th className="pb-4 font-medium pl-4">Event Name</th>
                        <th className="pb-4 font-medium">Date & Location</th>
                        <th className="pb-4 font-medium">Tickets Sold</th>
                        <th className="pb-4 font-medium">Revenue</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {events.map((event) => (
                        <tr key={event.id} className="border-b border-gray-800/50 last:border-none hover:bg-white/5 transition-colors">
                          <td className="py-5 pl-4 font-medium text-gray-200">{event.name}</td>
                          <td className="py-5 text-gray-400">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="text-red-500">📍</span>
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 min-w-[150px]">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-gray-300">{event.sold} / {event.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#8B5CF6] rounded-full"
                                style={{ width: `${(event.sold / event.total) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-5 text-gray-300">{event.revenue}</td>
                          <td className="py-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.statusColor}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="py-5 pr-4 text-right">
                            <button className="text-gray-500 hover:text-white">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain essentially empty or just basic placeholders as requested to focus on Overview update */}
          {activeTab !== "overview" && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
              <p>Content for {activeTab} coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
