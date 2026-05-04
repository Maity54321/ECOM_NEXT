"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiGrid, FiPlusSquare, FiList, FiLogOut, FiMenu, FiX, FiUser, FiShoppingCart, FiUsers } from "react-icons/fi";

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
    <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 mt-9 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between lg:block">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                <FiGrid size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">AdminPanel</span>
            </Link>
            <button
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group ${isActive(link.path)
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                  : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                  }`}
              >
                <link.icon size={20} className={isActive(link.path) ? "text-white" : "text-gray-400 group-hover:text-purple-600"} />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Navbars;
