"use client"

import React from "react";
import { User, Mail, Lock, Save, Camera, Shield, Bell, Layout, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User as UserType } from "../../page";
import axiosInstance from "../../../../service/axiosInstance";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface Props {
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export default function UserSettings({ user, setUser }: Props) {
    const [name, setName] = React.useState(user.name);
    const [email, setEmail] = React.useState(user.email);
    const [bio, setBio] = React.useState(user.bio || "");
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.put("/api/auth/update-profile",
                { name, bio },
                { headers: { auth: token } }
            );

            if (data.success) {
                toast.success("Profile updated successfully");
                setUser(data.user);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-10 pb-20"
        >
            <div>
                <h2 className="text-4xl font-serif text-white tracking-tight">User <span className="text-purple-500">Settings</span></h2>
                <p className="text-gray-500 mt-2 font-light">Customize your presence and security in the Eventra ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { icon: User, label: "Profile", active: true },
                        { icon: Shield, label: "Security", active: false },
                        { icon: Bell, label: "Notifications", active: false },
                        { icon: Layout, label: "Appearance", active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${item.active
                                ? "bg-purple-600/10 border-purple-500/30 text-white font-bold"
                                : "bg-[#111113] border-white/5 text-gray-500 hover:text-white hover:border-white/10"
                                }`}
                        >
                            <item.icon size={20} className={item.active ? "text-purple-500" : ""} />
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-2 bg-[#111113] rounded-4xl p-10 border border-white/5 shadow-2xl space-y-12">
                    {/* Profile Section */}
                    <div className="space-y-8">
                        <h3 className="text-lg font-serif text-white">Public Profile</h3>

                        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                            {/* Profile Picture */}
                            <div className="group relative">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden border border-white/10 p-1 group-hover:border-purple-500/50 transition-all duration-500">
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop"
                                            alt="Profile"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                                    <Camera size={14} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Identity</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors w-4 h-4" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-[#0a0a0c] border border-white/5 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-700 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nexus Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors w-4 h-4" />
                                            <input
                                                type="email"
                                                value={email}
                                                disabled
                                                className="w-full bg-[#0a0a0c] border border-white/5 text-gray-500 pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-700 text-sm cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell the community who you are..."
                                        className="w-full bg-[#0a0a0c] border border-white/5 text-white p-4 rounded-2xl focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder-gray-700 text-sm resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col">
                            <p className="text-white text-sm font-bold">Secure Environment</p>
                            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold mt-1">Last sync: 2 hours ago</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            <span>{isSaving ? "Syncing..." : "Save Identity"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
