"use client"

import React from "react";
import { BarChart3, TrendingUp, Users, MapPin, Globe } from "lucide-react";

export default function SellerAnalytics() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-white">Advanced Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart Placeholder */}
                <div className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-medium text-white font-serif">Revenue Overview</h3>
                            <p className="text-xs text-gray-500">Monthly sales performance</p>
                        </div>
                        <TrendingUp className="text-green-500" size={24} />
                    </div>
                    <div className="flex-1 flex items-end gap-3 justify-between pb-2">
                        {[40, 70, 45, 90, 65, 80, 50, 95, 100, 85, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-purple-600/20 group-hover:bg-purple-600/40 transition-all rounded-t-lg"
                                        style={{ height: `${h * 2}px` }}
                                    />
                                    <div
                                        className="absolute bottom-0 w-full bg-purple-500 group-hover:bg-purple-400 transition-all rounded-t-lg"
                                        style={{ height: `${h}px` }}
                                    />
                                </div>
                                <span className="text-[10px] text-gray-600 group-hover:text-gray-400 font-mono">
                                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">12.4K</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Profile Views</p>
                            </div>
                        </div>
                        <BarChart3 className="text-gray-700" />
                    </div>

                    <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Pokhara</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Top Location</p>
                            </div>
                        </div>
                        <Globe className="text-gray-700" />
                    </div>

                    <div className="bg-[#1c1c1e] p-8 rounded-3xl border border-white/5 flex-1">
                        <h3 className="text-sm font-medium text-white mb-6 uppercase tracking-widest text-gray-400">Demographics</h3>
                        <div className="space-y-4">
                            {[
                                { label: "18-24 years", pct: 45, color: "bg-purple-500" },
                                { label: "25-34 years", pct: 30, color: "bg-blue-500" },
                                { label: "35-44 years", pct: 15, color: "bg-green-500" },
                                { label: "Others", pct: 10, color: "bg-gray-500" },
                            ].map((d, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-300">{d.label}</span>
                                        <span className="text-white font-medium">{d.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#111113] rounded-full overflow-hidden">
                                        <div className={`h-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
