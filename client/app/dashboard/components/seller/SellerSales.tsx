"use client"

import React from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Search } from "lucide-react";

const transactions = [
    { id: "TX101", customer: "Arjun Thapa", event: "ICP X-mas Fest", date: "Oct 12, 2025", amount: "$150", status: "Completed" },
    { id: "TX102", customer: "Sita Rai", event: "Summer Music Festival", date: "Oct 11, 2025", amount: "$85", status: "Completed" },
    { id: "TX103", customer: "Rahul Sharma", event: "ICP X-mas Fest", date: "Oct 10, 2025", amount: "$150", status: "Pending" },
    { id: "TX104", customer: "Maya Gurung", event: "Food Festival", date: "Oct 09, 2025", amount: "$45", status: "Completed" },
    { id: "TX105", customer: "Bikash Rana", event: "Tech Conference", date: "Oct 08, 2025", amount: "$299", status: "Refunded" },
];

export default function SellerSales() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-white">Sales & Revenue</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2 bg-[#1c1c1e] px-4 py-2 rounded-xl border border-white/5 transition-colors">
                    <Download size={16} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Net Revenue", value: "$42,850", grow: "+12.5%", icon: DollarSign, color: "text-green-400" },
                    { label: "Pending Payouts", value: "$2,400", grow: "", icon: DollarSign, color: "text-yellow-400" },
                    { label: "Avg. Ticket Price", value: "$120", grow: "-2.1%", icon: DollarSign, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-[#111113] ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            {stat.grow && (
                                <span className={`flex items-center text-xs font-bold ${stat.grow.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                                    {stat.grow}
                                    {stat.grow.startsWith("+") ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-white uppercase">{stat.value}</h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-[#111113] border-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Transaction ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Event</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-mono">{tx.id}</td>
                                    <td className="px-6 py-4 text-gray-200">{tx.customer}</td>
                                    <td className="px-6 py-4 text-gray-400">{tx.event}</td>
                                    <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                                    <td className="px-6 py-4 text-white font-medium">{tx.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${tx.status === "Completed" ? "bg-green-500/10 text-green-400" :
                                                tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                                                    "bg-red-500/10 text-red-400"
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
