import React from "react";
import { User } from "./page";

interface Props {
  user: User;
}

export default function SellerDashboard({ user }: Props) {
  return (
    <div>
      <h1>Seller</h1>
    </div>
  );
}
