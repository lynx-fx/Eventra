"use client";

import React, { useEffect, useState } from "react";
import UserDashboard from "./userDashboard";
import SellerDashboard from "./sellerDashboard";
import AdminDashboard from "./adminDashboard";

type UserRole = "user" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {

      const fetchedUser: User = {
        id: "1",
        name: "Anup",
        email: "mail@example.com",
        role: "user",
      };
      setUser(fetchedUser);
    };

    getUserDetails();
  }, []);

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case "user":
      return <UserDashboard user={user} />;
    case "seller":
      return <SellerDashboard user={user} />;
    case "admin":
      return <AdminDashboard user={user} />;
    default:
      return <div>Invalid role</div>;
  }
}
