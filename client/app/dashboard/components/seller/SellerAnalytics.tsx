"use client"

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MapPin, Globe, Loader2, PieChart as PieChartIcon } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area
} from "recharts";
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({ name: month, revenue: 0, sales: 0 }));

    transactions.forEach(tx => {
        if (tx.status !== 'cancelled') {
            const date = new Date(tx.createdAt);
            const monthIndex = date.getMonth();
            monthlyData[monthIndex].revenue += tx.price;
            monthlyData[monthIndex].sales += 1;
        }
    });

    // Ticket Type Distribution
    const ticketTypes = [
        { name: 'Economy', value: transactions.filter(t => t.ticketType === 'economy').length, color: '#10b981' },
        { name: 'Standard', value: transactions.filter(t => t.ticketType === 'standard').length, color: '#3b82f6' },
        { name: 'Premium', value: transactions.filter(t => t.ticketType === 'premium').length, color: '#a855f7' },
    ].filter(t => t.value > 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-serif text-white">Advanced Analytics</h2>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Revenue Bar Chart */}
                        <div className="bg-[#111113] p-8 rounded-4xl border border-white/5 h-[400px] flex flex-col hover:border-purple-500/20 transition-all group">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-white font-serif">Revenue Performance</h3>
                                    <p className="text-xs text-gray-500">Monthly gross revenue (NPR)</p>
                                </div>
                                <TrendingUp className="text-green-500" size={24} />
                            </div>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#4b5563', fontSize: 10 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#4b5563', fontSize: 10 }}
                                            tickFormatter={(value) => `NPR ${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: '#111113',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill="#a855f7"
                                            radius={[6, 6, 0, 0]}
                                            className="transition-all"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Ticket Distribution */}
                        <div className="bg-[#111113] p-8 rounded-4xl border border-white/5 h-[400px] flex flex-col hover:border-blue-500/20 transition-all">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-medium text-white font-serif">Ticket Categories</h3>
                                    <p className="text-xs text-gray-500">Sales split by seat type</p>
                                </div>
                                <PieChartIcon className="text-blue-500" size={24} />
                            </div>
                            <div className="flex-1 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ticketTypes}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {ticketTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#111113',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-2xl font-bold text-white">{transactions.length}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sold</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                {ticketTypes.map((type, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{type.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111113] p-8 rounded-4xl border border-white/5 hover:border-blue-500/20 transition-all flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Total Sales</p>
                                <h4 className="text-2xl font-bold text-white">{transactions.length}</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
                                <Users size={24} />
                            </div>
                        </div>

                        <div className="bg-[#111113] p-8 rounded-4xl border border-white/5 hover:border-green-500/20 transition-all flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Audience Reach</p>
                                <h4 className="text-2xl font-bold text-white">Global</h4>
                            </div>
                            <div className="p-4 rounded-2xl bg-green-500/10 text-green-400">
                                <Globe size={24} />
                            </div>
                        </div>

                        <div className="bg-[#111113] p-8 rounded-4xl border border-white/5 flex-1 hover:border-orange-500/20 transition-all">
                            <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest">Transaction Status</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Completed", count: transactions.filter(t => t.status === 'active' || t.status === 'used').length, color: "bg-green-500" },
                                    { label: "Cancelled", count: transactions.filter(t => t.status === 'cancelled').length, color: "bg-red-500" },
                                ].map((d, i) => {
                                    const pct = transactions.length > 0 ? (d.count / transactions.length) * 100 : 0;
                                    return (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between text-[10px]">
                                                <span className="text-gray-400 uppercase font-bold">{d.label}</span>
                                                <span className="text-white font-bold">{d.count} ({pct.toFixed(0)}%)</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
