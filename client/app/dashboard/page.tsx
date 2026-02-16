"use client";

import React, { useEffect, useState } from "react";
import UserDashboard from "./userDashboard";
import SellerDashboard from "./sellerDashboard";
import AdminDashboard from "./adminDashboard";
import axiosInstance from "../../service/axiosInstance";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type UserRole = "user" | "seller" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  profileUrl?: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserDetails = async () => {
      const token = Cookies.get("auth");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/api/auth/get-me", {
          headers: {
            auth: token
          }
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/auth/login");
      }
    };

    getUserDetails();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
        <p className="text-gray-500 font-serif italic">Authenticating your session...</p>
      </div>
    );
  }

  switch (user.role) {
    case "user":
      return <UserDashboard user={user} setUser={setUser} />;
    case "seller":
      return <SellerDashboard user={user} setUser={setUser} />;
    case "admin":
      return <AdminDashboard user={user} setUser={setUser} />;
    default:
      return <div>Invalid role</div>;
  }
}
