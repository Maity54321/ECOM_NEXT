"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const searchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/product/${keyword}`);
    } else {
      router.push("/product");
    }
  };

  return (
    <>
      <div className="grid place-items-center h-screen w-full border border-solid bg-slate-200">
        <form className="w-full flex justify-center" onSubmit={searchSubmit}>
          <input
            type="text"
            className="p-4 w-1/3 text-lg font-cursive border-none outline-none"
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search item here..."
          />
          <span>
            <input
              type="submit"
              value={"Search"}
              className="p-5 text-lg bg-purple-800 text-white font-cursive hover:bg-purple-600 cursor-pointer border-none"
            />
          </span>
        </form>
      </div>
    </>
  );
};

export default Search;
