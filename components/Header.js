"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";

function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Scroll lock when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navLinks = [
    { text: "HOME", url: "/" },
    { text: "PRODUCTS", url: "/product" },
    { text: "CONTACT", url: "/contact" },
    { text: "ABOUT", url: "/about" },
  ];

  const iconLinks = [
    { icon: <FaSearch />, url: "/search", label: "Search" },
    { icon: <FaShoppingCart />, url: "/cart", label: "Cart" },
    { icon: <CgProfile />, url: "/account", label: "Profile" },
  ];

  const visibleIconLinks = user ? iconLinks.filter(link => link.label !== "Profile") : iconLinks;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm px-5 md:px-10 h-20 flex items-center">
      <div className="flex flex-row justify-between items-center w-full mr-9">
        {/* Logo */}
        <Link href="/" className="flex items-center transition-transform hover:scale-105">
          <Image
            src="/images/newLogo.png"
            alt="TechWorld Logo"
            width={80}
            height={35}
            style={{ objectFit: "contain", height: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`no-underline font-roboto text-sm lg:text-base font-bold transition-all duration-300 relative group ${pathname === link.url ? "text-[#6E35AE]" : "text-gray-500 hover:text-[#6E35AE]"
                  }`}
              >
                {link.text}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#6E35AE] transition-all duration-300 ${pathname === link.url ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5 border-l border-gray-200 pl-10">
            {visibleIconLinks.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="text-gray-500 text-xl hover:text-[#6E35AE] transition-all duration-300 transform hover:scale-110"
                aria-label={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden p-2 text-[#6E35AE] text-2xl transition-transform active:scale-90"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out md:hidden flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <Image
            src="/images/newLogo.png"
            alt="Logo"
            width={60}
            height={25}
            style={{ objectFit: "contain" }}
          />
          <button
            className="p-2 text-gray-400 hover:text-[#6E35AE] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
          {navLinks.map((link, idx) => (
            <Link
              key={link.url}
              href={link.url}
              className={`flex items-center justify-between p-4 rounded-2xl text-xl font-bold transition-all duration-300 ${pathname === link.url
                ? "bg-purple-50 text-[#6E35AE]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#6E35AE]"
                }`}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {link.text}
              <FaArrowRight size={14} className={pathname === link.url ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
            </Link>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/50">
          <div className="flex justify-around items-center mb-8">
            {visibleIconLinks.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#6E35AE] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="w-full py-4 bg-[#6E35AE] text-white rounded-2xl font-bold text-center block shadow-lg shadow-purple-200 active:scale-95 transition-transform"
            onClick={() => setMenuOpen(false)}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;

