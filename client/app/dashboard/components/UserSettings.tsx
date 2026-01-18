import React from "react";
import { User, Mail, Lock, Save, Camera } from "lucide-react";
import Image from "next/image";

export default function UserSettings() {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-white mb-8">Profile</h2>

            <div className="bg-[#1C1C24] rounded-2xl p-8 border border-gray-800 space-y-8">
                {/* Profile Section */}
                <div>
                    <h3 className="text-lg font-medium text-white mb-6">Profile Information</h3>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#8B5CF6]">
                                <Image
                                    src="https://placehold.co/150x150/1a1a1a/cccccc?text=User"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button className="text-xs text-[#8B5CF6] hover:text-white flex items-center gap-1 transition-colors">
                                <Camera size={14} />
                                Change Photo
                            </button>
                        </div>

                        {/* Profile Fields */}
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full bg-[#0f0f11] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type="email"
                                        defaultValue="email@gmail.com"
                                        className="w-full bg-[#0f0f11] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800" />

                {/* Security Section - Centered */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-white mb-6">Security</h3>
                    <div className="space-y-4 w-full max-w-md">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f0f11] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f0f11] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f0f11] border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#8B5CF6] transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-800" />

                <div className="flex justify-end pt-2">
                    <button className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-purple-900/20">
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
