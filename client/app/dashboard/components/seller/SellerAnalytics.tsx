"use client"

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MapPin, Globe, Loader2 } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import Cookies from "js-cookie";

export default function SellerAnalytics() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await axiosInstance.get("/api/tickets/seller/sales", {
                    headers: { auth: Cookies.get("auth") }
                });
                if (data.success) {
                    setTransactions(data.tickets);
                }
            } catch (error) {
                console.error("Failed to fetch analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []);

    // Calculate Monthly Revenue
    const monthlyRevenue = Array(12).fill(0);
    transactions.forEach(tx => {
        if (tx.status !== 'cancelled') {
            const date = new Date(tx.createdAt);
            const month = date.getMonth(); // 0-11
            monthlyRevenue[month] += tx.price;
        }
    });

    const maxRevenue = Math.max(...monthlyRevenue, 1); // Avoid division by zero

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif text-white">Advanced Analytics</h2>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sales Chart */}
                    <div className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 h-[400px] flex flex-col hover:border-purple-500/20 transition-all">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-medium text-white font-serif">Revenue Overview</h3>
                                <p className="text-xs text-gray-500">Monthly sales performance (Current Year)</p>
                            </div>
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                        <div className="flex-1 flex items-end gap-3 justify-between pb-2 border-b border-white/5 relative">
                            {/* Grid lines could go here */}
                            {monthlyRevenue.map((rev, i) => {
                                const heightPct = (rev / maxRevenue) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                                        <div className="w-full relative flex flex-col justify-end h-full">
                                            <div
                                                className="w-full bg-purple-600/20 group-hover:bg-purple-600/40 transition-all rounded-t-lg relative"
                                                style={{ height: `${heightPct}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                    ${rev.toLocaleString()}
                                                </div>
                                            </div>
                                            <div
                                                className="absolute bottom-0 w-full bg-linear-to-t from-purple-600 to-purple-400 group-hover:from-purple-500 group-hover:to-purple-300 transition-all rounded-t-lg"
                                                style={{ height: `${Math.min(heightPct, 5)}%` }} // Base highlight
                                            />
                                        </div>
                                        <span className="text-[10px] text-gray-600 group-hover:text-gray-400 font-mono">
                                            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:border-blue-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{transactions.length}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Total Transactions</p>
                                </div>
                            </div>
                            <BarChart3 className="text-gray-700" />
                        </div>

                        <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 flex items-center justify-between hover:border-red-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Global</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Top Audience Region</p>
                                </div>
                            </div>
                            <Globe className="text-gray-700" />
                        </div>

                        <div className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 flex-1 hover:border-green-500/20 transition-all">
                            <h3 className="text-sm font-medium text-white mb-6 uppercase tracking-widest text-gray-400">Transaction Status</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Completed", count: transactions.filter(t => t.status === 'active' || t.status === 'used').length, color: "bg-green-500" },
                                    { label: "Cancelled", count: transactions.filter(t => t.status === 'cancelled').length, color: "bg-red-500" },
                                ].map((d, i) => {
                                    const pct = transactions.length > 0 ? (d.count / transactions.length) * 100 : 0;
                                    return (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-300">{d.label}</span>
                                                <span className="text-white font-medium">{d.count} ({pct.toFixed(1)}%)</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#111113] rounded-full overflow-hidden">
                                                <div className={`h-full ${d.color}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
