"use client";

import { motion } from "framer-motion";
import { XCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background text-foreground relative overflow-hidden font-sans">
            {/* App Theme Ambient Background from page.tsx */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/5 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: '1000ms' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-8 md:p-10 text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                        className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-destructive/10 ring-1 ring-destructive/20"
                    >
                        <XCircle className="h-10 w-10 text-destructive" />
                    </motion.div>

                    <div className="space-y-2">
                        <motion.h1
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold tracking-tight"
                        >
                            Payment Failed
                        </motion.h1>

                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-muted-foreground"
                        >
                            We couldn't process your payment. Please check your payment details and try again.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-3 pt-4"
                    >
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors w-full shadow-sm"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors w-full border border-border/50"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
