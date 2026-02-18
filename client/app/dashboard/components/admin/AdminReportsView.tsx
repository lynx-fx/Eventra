"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldAlert,
    Calendar,
    User,
    Image as ImageIcon,
    CheckCircle,
    Ban,
    History,
    X,
    Loader2,
    ExternalLink,
    MapPin
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import axiosInstance from "@/service/axiosInstance";

interface Report {
    _id: string;
    reportType: string;
    reportReason: string;
    reportedDate: string;
    reportStatus: "pending" | "banned" | "reviewed" | "removed";
    reporterId: {
        _id: string;
        name: string;
        email: string;
        profileUrl?: string;
    };
    imageId: {
        _id: string;
        imageUrl: string;
        userId: {
            _id: string;
            name: string;
            email: string;
            profileUrl?: string;
            isActive: boolean;
        };
        eventId: {
            title: string;
            location: string;
            eventDate: string;
        };
    };
}

interface UserHistory {
    reportsMade: Report[];
    reportsAgainst: Report[];
}

interface User {
    role: string;
}

interface AdminReportsViewProps {
    currentUser: User;
}

export default function AdminReportsView({ currentUser }: AdminReportsViewProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserHistory, setSelectedUserHistory] = useState<{
        user: any;
        history: UserHistory | null;
        loading: boolean;
    } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
        : process.env.NEXT_PUBLIC_BACKEND_LOCAL;

    const fetchReports = async () => {
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.get(
                `/api/admin/reports`,
                {
                    headers: {
                        auth: token,
                    },
                }
            );
            if (data.success) {
                setReports(data.reports);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (reportId: string, status: "reviewed" | "banned") => {
        try {
            const token = Cookies.get("auth");
            await axiosInstance.patch(
                `/api/admin/reports/${reportId}`,
                { status },
                {
                    headers: {
                        auth: token,
                    },
                }
            );

            // Update local state instead of removing
            setReports((prev) => prev.map(r =>
                r._id === reportId ? { ...r, reportStatus: status } : r
            ));

            toast.success(`Report marked as ${status}`);
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Failed to update report status");
        }
    };

    const handleBanUser = async (userId: string, currentStatus: boolean) => {
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.patch(
                `/api/admin/users/${userId}/ban`,
                {},
                {
                    headers: {
                        auth: token,
                    },
                }
            );

            if (data.success) {
                toast.success(
                    `User ${data.isActive ? "activated" : "banned"} successfully`
                );
                // Update local state
                setReports((prev) =>
                    prev.map((r) => {
                        if (r.imageId?.userId?._id === userId) {
                            return {
                                ...r,
                                imageId: {
                                    ...r.imageId,
                                    userId: {
                                        ...r.imageId.userId,
                                        isActive: data.isActive,
                                    },
                                },
                            };
                        }
                        return r;
                    })
                );
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            toast.error("Failed to update user status");
        }
    };

    const handleRemoveImage = async (imageId: string, isActive: boolean) => {
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.patch(
                `/api/admin/images/${imageId}/status`,
                { isActive: !isActive },
                {
                    headers: {
                        auth: token,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                // Update local state
                setReports((prev) =>
                    prev.map((r) => {
                        if (r.imageId?._id === imageId) {
                            // Determine new report status based on image active status
                            let newReportStatus = r.reportStatus;
                            if (!data.isActive && (r.reportStatus === 'pending' || r.reportStatus === 'reviewed')) {
                                newReportStatus = 'removed';
                            } else if (data.isActive && r.reportStatus === 'removed') {
                                newReportStatus = 'reviewed';
                            }

                            return {
                                ...r,
                                reportStatus: newReportStatus,
                                imageId: {
                                    ...r.imageId,
                                    isActive: data.isActive
                                } as any
                            };
                        }
                        return r;
                    })
                );
            }
        } catch (error) {
            console.error("Error updating image status:", error);
            toast.error("Failed to update image status");
        }
    };

    const handleViewHistory = async (user: any) => {
        setSelectedUserHistory({ user, history: null, loading: true });
        try {
            const token = Cookies.get("auth");
            const { data } = await axiosInstance.get(
                `/api/admin/users/${user._id}/history`,
                {
                    headers: {
                        auth: token,
                    },
                }
            );
            if (data.success) {
                setSelectedUserHistory({
                    user,
                    history: data.history,
                    loading: false
                });
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to fetch user history");
            setSelectedUserHistory(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 relative"
        >
            <div className="flex justify-between items-center bg-[#111113] p-8 rounded-4xl border border-white/5">
                <div>
                    <h2 className="text-3xl font-serif text-white">
                        Report <span className="text-purple-500">Center</span>
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm">
                        Monitor and manage user reports and content violations.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {reports.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-[#111113] rounded-3xl border border-white/5">
                            <ShieldAlert size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No reports found</p>
                        </div>
                    ) : (
                        reports
                            .sort((a, b) => {
                                if (a.reportStatus === 'pending' && b.reportStatus !== 'pending') return -1;
                                if (a.reportStatus !== 'pending' && b.reportStatus === 'pending') return 1;
                                return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
                            })
                            .map((report) => (
                                <div
                                    key={report._id}
                                    className="bg-[#111113] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Image Section */}
                                        <div
                                            className="w-full lg:w-48 h-48 rounded-2xl overflow-hidden bg-black/50 relative shrink-0 group-hover:scale-[1.02] transition-transform cursor-pointer"
                                            onClick={() => report.imageId && setSelectedImage(report.imageId.imageUrl)}
                                        >
                                            {report.imageId ? (
                                                <>
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_NODE_ENV === "production"
                                                            ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                                                            : process.env.NEXT_PUBLIC_BACKEND_LOCAL
                                                            }${report.imageId.imageUrl}`}
                                                        alt="Reported Content"
                                                        className={`w-full h-full object-cover transition-all duration-500 ${!report.imageId.userId.isActive ? "grayscale blur-sm" : ""
                                                            }`}
                                                    />
                                                    {!report.imageId.userId.isActive && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                            <Ban className="text-red-500 w-12 h-12" />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-gray-600">
                                                    <ImageIcon size={24} />
                                                    <span className="ml-2 text-xs">Image Deleted</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details Section */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold text-white leading-tight">
                                                            {report.reportReason}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${report.reportStatus === 'reviewed'
                                                                ? 'bg-green-500/10 text-green-400'
                                                                : report.reportStatus === 'banned'
                                                                    ? 'bg-red-500/10 text-red-400'
                                                                    : report.reportStatus === 'removed'
                                                                        ? 'bg-gray-500/10 text-gray-400'
                                                                        : 'bg-yellow-500/10 text-yellow-400'
                                                                }`}>
                                                                {report.reportStatus === 'reviewed' && <CheckCircle size={12} />}
                                                                {report.reportStatus === 'banned' && <Ban size={12} />}
                                                                {report.reportStatus === 'removed' && <X size={12} />}
                                                                {report.reportStatus === 'pending' && <ShieldAlert size={12} />}
                                                                {report.reportStatus}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-400 text-sm font-medium mb-1">
                                                        Event: <span className="text-purple-400">{report.imageId?.eventId?.title || "Unknown Event"}</span>
                                                    </p>
                                                    <p className="text-gray-500 text-xs flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(report.reportedDate).toLocaleDateString()} at {new Date(report.reportedDate).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                {report.reportStatus === 'pending' && (currentUser.role === 'admin' || currentUser.role === 'seller') && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleResolve(report._id, 'reviewed')}
                                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={14} />
                                                            Mark Reviewed
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                                {/* Reporter */}
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Reported By</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                                                            {report.reporterId?.name?.charAt(0) || "?"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{report.reporterId?.name || "Unknown"}</p>
                                                            <p className="text-xs text-gray-500">{report.reporterId?.email}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewHistory(report.reporterId)}
                                                            className="ml-auto p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                            title="View Reporting History"
                                                        >
                                                            <History size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Posted By */}
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Posted By</p>
                                                    {report.imageId?.userId ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${report.imageId.userId.isActive ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`}>
                                                                {report.imageId.userId.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white flex items-center gap-2">
                                                                    {report.imageId.userId.name}
                                                                    {!report.imageId.userId.isActive && (
                                                                        <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">BANNED</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{report.imageId.userId.email}</p>
                                                            </div>
                                                            <div className="ml-auto flex gap-1">
                                                                <button
                                                                    onClick={() => handleViewHistory(report.imageId.userId)}
                                                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                                    title="View History"
                                                                >
                                                                    <History size={14} />
                                                                </button>

                                                                {/* Only Admin can ban users */}
                                                                {currentUser.role === 'admin' && (
                                                                    <button
                                                                        onClick={() => handleBanUser(report.imageId.userId._id, report.imageId.userId.isActive)}
                                                                        className={`p-1.5 rounded-lg transition-all ${report.imageId.userId.isActive
                                                                            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                                                            : "text-green-400 hover:bg-green-500/10 hover:text-green-300"
                                                                            }`}
                                                                        title={report.imageId.userId.isActive ? "Ban User" : "Unban User"}
                                                                    >
                                                                        {report.imageId.userId.isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                                                                    </button>
                                                                )}

                                                                {/* Both Admin and Seller can remove images */}
                                                                <button
                                                                    onClick={() => handleRemoveImage(report.imageId._id, (report.imageId as any).isActive ?? true)}
                                                                    // Default to true if undefined since images are active by default
                                                                    className={`p-1.5 rounded-lg transition-all ${(report.imageId as any).isActive === false
                                                                        ? "text-green-400 hover:bg-green-500/10 hover:text-green-300"
                                                                        : "text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
                                                                        }`}
                                                                    title={(report.imageId as any).isActive === false ? "Restore Image" : "Remove Image"}
                                                                >
                                                                    {(report.imageId as any).isActive === false ? <ImageIcon size={14} /> : <ImageIcon size={14} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">User not found</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            )}

            {/* Image Preview Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full"
                            >
                                <X size={24} />
                            </button>
                            <img
                                src={`${process.env.NEXT_PUBLIC_NODE_ENV === "production"
                                    ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
                                    : process.env.NEXT_PUBLIC_BACKEND_LOCAL
                                    }${selectedImage}`}
                                alt="Reported Content Full"
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedUserHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedUserHistory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#161618] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111113]">
                                <div>
                                    <h3 className="text-xl font-bold text-white">User History</h3>
                                    <p className="text-sm text-gray-500">{selectedUserHistory.user.name} ({selectedUserHistory.user.email})</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUserHistory(null)}
                                    className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                {selectedUserHistory.loading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="animate-spin text-purple-500" size={24} />
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {/* Reports AGAINST the user */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
                                                <ShieldAlert size={14} /> Reports Against User ({selectedUserHistory.history?.reportsAgainst.length || 0})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedUserHistory.history?.reportsAgainst.length === 0 ? (
                                                    <p className="text-sm text-gray-600 italic">No reports against this user.</p>
                                                ) : (
                                                    selectedUserHistory.history?.reportsAgainst.map((r, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-4">
                                                            <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden shrink-0">
                                                                {r.imageId?.imageUrl && (
                                                                    <img
                                                                        src={`${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${r.imageId.imageUrl}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-medium text-white">{r.reportReason}</p>
                                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${r.reportStatus === 'reviewed' ? 'bg-green-500/20 text-green-400' :
                                                                        r.reportStatus === 'banned' ? 'bg-red-500/20 text-red-400' :
                                                                            r.reportStatus === 'removed' ? 'bg-gray-500/20 text-gray-400' :
                                                                                'bg-yellow-500/20 text-yellow-400'
                                                                        }`}>{r.reportStatus}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(r.reportedDate).toLocaleDateString()}</p>
                                                                <p className="text-xs text-gray-500 mt-1">Reported by: {typeof r.reporterId === 'object' ? r.reporterId.name : 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Reports MADE BY the user */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                                                <Flag2 size={14} /> Reports Made ({selectedUserHistory.history?.reportsMade.length || 0})
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedUserHistory.history?.reportsMade.length === 0 ? (
                                                    <p className="text-sm text-gray-600 italic">This user hasn't reported anything.</p>
                                                ) : (
                                                    selectedUserHistory.history?.reportsMade.map((r, i) => (
                                                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-4">
                                                            <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden shrink-0">
                                                                {r.imageId?.imageUrl && (
                                                                    <img
                                                                        src={`${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${r.imageId.imageUrl}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-medium text-white">{r.reportReason}</p>
                                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${r.reportStatus === 'reviewed' ? 'bg-green-500/20 text-green-400' :
                                                                        r.reportStatus === 'banned' ? 'bg-red-500/20 text-red-400' :
                                                                            r.reportStatus === 'removed' ? 'bg-gray-500/20 text-gray-400' :
                                                                                'bg-yellow-500/20 text-yellow-400'
                                                                        }`}>{r.reportStatus}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(r.reportedDate).toLocaleDateString()}</p>
                                                                <p className="text-xs text-gray-500 mt-1">Posted by: {r.imageId?.userId?.name || 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Helper component for icon
function Flag2({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
        </svg>
    )
}
