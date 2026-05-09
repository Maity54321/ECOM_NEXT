"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiPlusSquare, FiList, FiLogOut, FiMenu, FiX, FiUser, FiShoppingCart, FiUsers, FiChevronRight } from "react-icons/fi";

function Navbars({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/account");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: FiGrid },
    { name: "Create Product", path: "/account/createproduct", icon: FiPlusSquare },
    { name: "View Products", path: "/account/viewproducts", icon: FiList },
    { name: "Orders", path: "/dashboard/orders", icon: FiShoppingCart },
    { name: "Users", path: "/dashboard/users", icon: FiUsers },
  ];

  const isActive = (path) => pathname === path;

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden font-sans text-gray-900">
      {/* Mobile Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed left-0 top-1/3 -translate-y-1/2 z-40 bg-purple-600 text-white p-1.5 rounded-r-xl shadow-lg shadow-purple-200 active:scale-95 transition-all hover:bg-purple-700 animate-in slide-in-from-left-4 duration-300"
          aria-label="Open Sidebar"
        >
          <FiChevronRight size={20} />
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-8 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <FiGrid size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">AdminPanel</span>
            </Link>
            <button
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 space-y-1.5 mt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 mb-4">Main Menu</p>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 group ${isActive(link.path)
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                  : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                  }`}
              >
                <link.icon size={20} className={isActive(link.path) ? "text-white" : "text-gray-400 group-hover:text-purple-600"} />
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200 group"
            >
              <FiLogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              Logout Account
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto bg-gray-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Navbars;
