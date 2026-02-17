"use client"

import React from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Search } from "lucide-react";
import axiosInstance from "../../../../service/axiosInstance";
import Cookies from "js-cookie";
import { toast } from "sonner";

const TransactionsSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-[#111113] rounded-lg animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/6"></div>
            </div>
        ))}
    </div>
);

export default function SellerSales() {
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await axiosInstance.get("/api/tickets/seller/sales", {
                    headers: { auth: Cookies.get("auth") }
                });
                if (data.success) {
                    setTransactions(data.tickets);
                }
            } catch (error) {
                console.error("Failed to fetch sales:", error);
                toast.error("Failed to load sales data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        tx._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.eventId?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = transactions.reduce((acc, tx) => acc + (tx.status !== 'cancelled' ? tx.price : 0), 0);
    const completedSales = transactions.filter(tx => tx.status !== 'cancelled').length;
    const avgTicketPrice = completedSales > 0 ? totalRevenue / completedSales : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-white">Sales & Revenue</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2 bg-[#1c1c1e] px-4 py-2 rounded-xl border border-white/5 transition-colors">
                    <Download size={16} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Net Revenue", value: `$${totalRevenue.toLocaleString()}`, grow: "+12.5%", icon: DollarSign, color: "text-green-400" },
                    { label: "Pending Payouts", value: "$0", grow: "", icon: DollarSign, color: "text-yellow-400" }, // Placeholder for now
                    { label: "Avg. Ticket Price", value: `$${avgTicketPrice.toFixed(0)}`, grow: "-2.1%", icon: DollarSign, color: "text-purple-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
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

            <div className="bg-[#1c1c1e] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex gap-4 bg-white/[0.02]">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search transactions by ID, customer or event..."
                            className="w-full bg-[#111113] border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-gray-600"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-6">
                            <TransactionsSkeleton />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                            <p className="text-sm font-medium">No transactions found</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="text-left text-[10px] text-gray-500 uppercase tracking-widest font-bold border-b border-white/5 bg-[#111113]/50">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs group-hover:text-purple-400 transition-colors">#{tx._id.slice(-8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-200 font-medium">{tx.userId?.name || "Unknown"}</span>
                                                <span className="text-xs text-gray-600">{tx.userId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{tx.eventId?.title}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(tx.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold font-mono">${tx.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === "active" ? "bg-green-500/10 text-green-400" :
                                                tx.status === "used" ? "bg-blue-500/10 text-blue-400" :
                                                    "bg-red-500/10 text-red-400"
                                                }`}>
                                                {tx.status === 'active' ? 'Purchased' : tx.status === 'used' ? 'Used' : 'Cancelled'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
