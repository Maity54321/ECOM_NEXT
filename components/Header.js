"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-[9] shadow-md px-5 py-0">
      <div className="flex flex-row justify-between items-center w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/newLogo.png"
            alt="TechWorld Logo"
            width={70}
            height={30}
            style={{ objectFit: "contain", height: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 mr-5">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="no-underline text-[#989897] font-roboto text-sm lg:text-base font-semibold hover:text-[#6E35AE] transition-colors duration-300"
                style={{
                  color: pathname === link.url ? "#6E35AE" : "#989897",
                }}
              >
                {link.text}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-gray-300 pl-6">
            {iconLinks.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="text-[#989897] text-xl hover:text-[#6E35AE] transition-colors duration-300 no-underline"
                aria-label={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden text-[#6E35AE] text-2xl bg-transparent border-none cursor-pointer hover:text-purple-900 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white py-4 border-t border-gray-200">
          {navLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="no-underline text-[#989897] font-roboto text-lg py-3 hover:text-[#6E35AE] transition-colors duration-300"
              onClick={() => setMenuOpen(false)}
              style={{
                color: pathname === link.url ? "#6E35AE" : "#989897",
              }}
            >
              {link.text}
            </Link>
          ))}
          <div className="flex items-center gap-6 mt-3">
            {iconLinks.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="text-[#989897] text-xl hover:text-[#6E35AE] transition-colors duration-300 no-underline"
                onClick={() => setMenuOpen(false)}
                aria-label={item.label}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
