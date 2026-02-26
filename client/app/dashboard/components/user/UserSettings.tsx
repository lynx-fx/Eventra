"use client"

import React from "react";
import { User, Mail, Lock, Save, Camera, Shield, Bell, Layout, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User as UserType } from "../../[[...slug]]/page";
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
    const [activeTab, setActiveTab] = React.useState<"profile" | "security">("profile");

    // Security states
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);

    // Profile Picture state
    const [profileFile, setProfileFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            if (profileFile) {
                formData.append("profilePicture", profileFile);
            }

            const token = Cookies.get("auth");
            const { data } = await axiosInstance.put("/api/auth/update-profile",
                formData,
                {
                    headers: {
                        auth: token,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (data.success) {
                toast.success("Profile updated successfully");
                setUser(data.user);
                setProfileFile(null);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsChangingPassword(true);
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.put("/api/auth/change-password",
                { currentPassword, newPassword },
                { headers: { auth: token } }
            );

            if (data.success) {
                toast.success("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const BACKEND = process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
        : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    const displayProfileUrl = previewUrl || (user.profileUrl?.startsWith("/images") ? `${BACKEND}${user.profileUrl}` : user.profileUrl) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-10 pb-20"
        >
            <div>
                <h2 className="text-4xl font-serif text-foreground tracking-tight">User <span className="text-primary">Settings</span></h2>
                <p className="text-muted-foreground mt-2 font-light">Customize your presence and security in the Eventra ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    {[
                        { icon: User, label: "Profile", id: "profile" as const },
                        { icon: Shield, label: "Security", id: "security" as const },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border ${activeTab === item.id
                                ? "bg-primary/10 border-primary/30 text-primary font-bold"
                                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-border"
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? "text-primary" : ""} />
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                    <div className="p-6 bg-linear-to-br from-primary/5 to-transparent rounded-3xl border border-border mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Pro Tip</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">Keep your identity updated to build trust in the community.</p>
                    </div>
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-2 bg-card rounded-4xl p-10 border border-border shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32" />

                    {activeTab === "profile" ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Profile Section */}
                            <div className="space-y-8">
                                <h3 className="text-lg font-serif text-foreground">Public Profile</h3>

                                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                                    {/* Profile Picture */}
                                    <div className="group relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-32 h-32 rounded-3xl overflow-hidden border border-border p-1 group-hover:border-primary/50 transition-all duration-500 cursor-pointer"
                                        >
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                                                <Image
                                                    src={displayProfileUrl}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Camera size={24} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-xl cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                            <Camera size={14} />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Identity</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full bg-background border border-border text-foreground pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-muted-foreground/50 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        disabled
                                                        className="w-full bg-background border border-border text-muted-foreground pl-12 pr-4 py-3.5 rounded-2xl outline-none transition-all cursor-not-allowed text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Bio</label>
                                            <textarea
                                                rows={3}
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell the community who you are..."
                                                className="w-full bg-background border border-border text-foreground p-4 rounded-2xl focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder-muted-foreground/50 text-sm resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex flex-col">
                                    <p className="text-foreground text-sm font-bold">Cloud Sync Active</p>
                                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mt-1">Changes are synced across all devices.</p>
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    <span>{isSaving ? "Syncing..." : "Save Identity"}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-8">
                                <h3 className="text-lg font-serif text-foreground">Security Credentials</h3>

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Current Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                                            <input
                                                type="password"
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Current password"
                                                className="w-full bg-background border border-border text-foreground pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">New Password</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                                    <Lock size={16} />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    placeholder="New password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-background border border-border text-foreground pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                                    <Lock size={16} />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    placeholder="Confirm password"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-background border border-border text-foreground pl-12 pr-4 py-3.5 rounded-2xl focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-border flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isChangingPassword}
                                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                        >
                                            {isChangingPassword ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                            <span>Update Password</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
