"use client";

import React from "react";
import { BsFillMouseFill } from "react-icons/bs";
import Product from "./Product";

function Home() {
  return (
    <>
      <div className="banner text-white">
        <div className="text-center md:text-2xl mb-5">
          Welcome To The TechWorld
        </div>
        <div className="text-[4vmax] font-bold">Start Shopping</div>
        <a href="#products">
          <button className="flex items-center gap-2 px-6 py-3 mt-5 text-lg font-semibold rounded-2xl cursor-pointer border-2 border-white bg-white text-purple-800 hover:bg-transparent hover:text-white transition-all duration-300 outline-none">
            Scroll <BsFillMouseFill />
          </button>
        </a>
      </div>

      <div className="text-center text-3xl font-semibold">
        Featured Products
      </div>
      <hr
        className="h-1 w-96 gradient-hr rounded-full border-none mx-auto my-5"
        id="products"
      />
      <Product />
    </>
  );
}

export default Home;
