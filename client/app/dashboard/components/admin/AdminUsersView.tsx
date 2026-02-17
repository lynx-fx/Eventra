"use client"


import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Mail,
    Shield,
    MoreVertical,
    UserPlus,
    Trash2,
    Ban,
    Search,
    X
} from "lucide-react"
import axiosInstance from "../../../../service/axiosInstance"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useState, useEffect } from "react"

export default function AdminUsersView() {
    interface User {
        _id: string;
        name: string;
        email: string;
        role: "user" | "admin" | "seller";
        createdAt: string;
        isActive: boolean;
        profileUrl?: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin" | "seller">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Add Admin State
    const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
    const [isAddingAdmin, setIsAddingAdmin] = useState(false);
    const [newAdminName, setNewAdminName] = useState("");
    const [newAdminEmail, setNewAdminEmail] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");

    const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
        : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.get("/api/admin/users", {
                headers: { auth: token }
            });
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string, currentStatus: boolean) => {
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.patch(
                `/api/admin/users/${userId}/ban`,
                {},
                { headers: { auth: token } }
            );

            if (data.success) {
                toast.success(`User ${data.isActive ? "activated" : "banned"} successfully`);
                setUsers(prev => prev.map(u =>
                    u._id === userId ? { ...u, isActive: data.isActive } : u
                ));
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Failed to update user status");
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingAdmin(true);
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.post("/api/admin/users/admin", {
                name: newAdminName,
                email: newAdminEmail,
                password: newAdminPassword
            }, {
                headers: { auth: token }
            });

            if (data.success) {
                toast.success("New admin account created successfully");
                setIsAddAdminOpen(false);
                setNewAdminName("");
                setNewAdminEmail("");
                setNewAdminPassword("");
                fetchUsers(); // Refresh list
            }
        } catch (error: any) {
            console.error("Error adding admin:", error);
            toast.error(error.response?.data?.message || "Failed to create admin");
        } finally {
            setIsAddingAdmin(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center bg-[#111113] p-8 rounded-4xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-serif text-white">User <span className="text-purple-500">Directory</span></h2>
                    <p className="text-gray-500 mt-1 text-sm">Manage access, roles, and security for all platform participants.</p>
                </div>
                <button
                    onClick={() => setIsAddAdminOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-purple-600/20"
                >
                    <UserPlus size={18} /> Add New Admin
                </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative group flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111113] border border-white/5 text-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none placeholder-gray-600 transition-all shadow-lg"
                    />
                </div>

                <div className="flex gap-2 bg-[#111113] p-1.5 rounded-2xl border border-white/5">
                    {(["all", "user", "seller", "admin"] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setRoleFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${roleFilter === filter
                                ? "bg-white/10 text-white shadow-lg"
                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                }`}
                        >
                            {filter}s
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", val: users.length, icon: Users, col: "text-blue-400" },
                    { label: "New This Month", val: users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length, icon: UserPlus, col: "text-green-400" },
                    { label: "Active Admins", val: users.filter(u => u.role === 'admin' && u.isActive).length, icon: Shield, col: "text-purple-400" },
                    { label: "Flagged Accounts", val: users.filter(u => !u.isActive).length, icon: Ban, col: "text-red-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#111113] p-6 rounded-3xl border border-white/5">
                        <stat.icon size={20} className={`${stat.col} mb-4`} />
                        <p className="text-2xl font-bold text-white mb-1">{stat.val}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#111113] rounded-4xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Platform Participants</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Live Database Connection</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <span className="loading loading-spinner text-primary">Loading...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b border-white/5">
                                    <th className="py-5 px-8">Member</th>
                                    <th className="py-5 px-8">System Role</th>
                                    <th className="py-5 px-8">Joined Date</th>
                                    <th className="py-5 px-8">Status</th>
                                    <th className="py-5 px-8 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users
                                    .filter(u => {
                                        const matchesRole = roleFilter === "all" || u.role === roleFilter;
                                        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            u.email.toLowerCase().includes(searchQuery.toLowerCase());
                                        return matchesRole && matchesSearch;
                                    })
                                    .map((user) => (
                                        <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-white/80 font-bold text-sm overflow-hidden">
                                                        {user.profileUrl ? (
                                                            <img
                                                                src={user.profileUrl.startsWith("/images")
                                                                    ? `${backendUrl}${user.profileUrl}`
                                                                    : user.profileUrl}
                                                                alt={user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            user.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{user.name}</p>
                                                        <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                                            <Mail size={10} /> {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-2">
                                                    {user.role === "admin" && <Shield size={12} className="text-purple-500" />}
                                                    <span className={`text-xs font-medium capitalize ${user.role === "admin" ? "text-purple-400" : "text-gray-400"}`}>{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-8 text-xs text-gray-500 font-mono">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="py-5 px-8">
                                                <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${user.isActive ? "text-green-500" : "text-red-500"}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                                                    {user.isActive ? "Active" : "Banned"}
                                                </span>
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleBanUser(user._id, user.isActive)}
                                                            title={user.isActive ? "Ban User" : "Unban User"}
                                                            className={`p-2 rounded-lg transition-all ${user.isActive ? "text-gray-500 hover:text-red-500 hover:bg-red-500/10" : "text-green-500 hover:text-green-400 hover:bg-green-500/10"}`}
                                                        >
                                                            {user.isActive ? <Ban size={16} /> : <Shield size={16} />}
                                                        </button>
                                                    )}
                                                    {user.role === 'admin' && (
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2">Protected</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {isAddAdminOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111113] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsAddAdminOpen(false)}
                                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-serif text-white mb-6">Add New <span className="text-purple-500">Admin</span></h3>

                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={newAdminName}
                                        onChange={(e) => setNewAdminName(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                    <input
                                        type="email"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Password</label>
                                    <input
                                        type="password"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isAddingAdmin}
                                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                                >
                                    {isAddingAdmin ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" /> Creating...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} /> Create Admin Account
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div >
    )
}
