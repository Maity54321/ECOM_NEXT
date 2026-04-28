"use client";

import { ToastContainer } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserOptions from "@/components/UserOptions";
import { useAuth } from "@/components/AuthProvider";

export default function ClientLayout({ children }) {
  const { user, isAuthenticated, logout, login } = useAuth();

  return (
    <>
      <ToastContainer />
      <Header />
      {isAuthenticated && (
        <UserOptions user={user} handleLogout={logout} login={login} />
      )}
      <main className="pt-[40px] min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
