"use client";

import React from "react";
import Account from "@/components/users/Account";
import { decodeToken } from "react-jwt";

const AdminWelcome = ({ logout }) => {
  const user =
    typeof window !== "undefined"
      ? decodeToken(localStorage.getItem("token"))
      : null;

  if (!user) return null;
  console.log("hello2")
  return (
    <>
      <Account userProfile={user} logout={logout} />
    </>
  );
};

export default AdminWelcome;
