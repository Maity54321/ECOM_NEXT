"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";

function Navbars({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdown = useRef(null);

  const showHide = () => {
    if (dropdown.current) {
      dropdown.current.classList.toggle("hidden");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/account");
  };

  const isActive = (path) => pathname === path;

  const linkStyle = (path) => ({
    fontWeight: isActive(path) ? "bold" : "normal",
    color: isActive(path) ? "black" : "white",
    textShadow: isActive(path) ? "2px 2px 2px white" : "",
  });

  return (
    <>
      <div className="p-1 bg-purple-800 text-white md:m-0 flex flex-row md:w-full w-6/7 ms-12">
        <div className="place-self-center w-1/3 text-xl ps-3 md:block hidden">
          This is Dashboard
        </div>
        <div className="place-self-center text-center md:w-1/3 w-1/2 text-xl">
          Welcome Admin
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-3 bg-purple-700 md:w-4/5 w-4/5 me-0 ms-auto md:me-auto text-white p-2">
        <div className="place-self-end">
          <div
            className="text-white no-underline text-xl md:hidden border cursor-pointer"
            onClick={showHide}
          >
            Operations
            <span className="md:hidden text-xl">
              <IoMdArrowDropdown />
            </span>
          </div>
        </div>
        <div className="md:flex md:flex-row gap-3 hidden" ref={dropdown}>
          <div className="text-end">
            <Link
              href="/account"
              style={linkStyle("/account")}
              className="text-white no-underline text-xl"
              onClick={showHide}
            >
              Admin Home
            </Link>
          </div>
          <div className="text-end">
            <Link
              href="/account/createproduct"
              style={linkStyle("/account/createproduct")}
              className="text-white no-underline text-xl"
              onClick={showHide}
            >
              Create Product
            </Link>
          </div>
          <div className="text-end">
            <Link
              href="/account/viewproducts"
              style={linkStyle("/account/viewproducts")}
              className="text-white no-underline text-xl"
              onClick={showHide}
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}

export default Navbars;
