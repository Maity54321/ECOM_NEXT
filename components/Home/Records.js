"use client";

import React from "react";
import Link from "next/link";
import { Rating } from "@mui/material";

const Records = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div
          className="w-full max-w-[280px] h-full min-h-[420px] flex flex-col justify-between shadow-lg shadow-slate-300 rounded-lg mt-10 product-card-transition p-5 mx-auto bg-white border border-gray-100"
          key={item._id}
        >
          <Link
            href={`/products/${item._id}`}
            className="flex flex-col flex-grow items-center no-underline text-black"
          >
            <div className="h-48 w-full flex items-center justify-center mb-4">
              <img
                className="max-h-full max-w-full object-contain"
                src={item.images.imgUrl}
                alt={item.images.host}
              />
            </div>
            <div className="text-base font-semibold text-center mt-2 line-clamp-2 w-full min-h-[3rem]">
              {item.name}
            </div>
            <div className="flex flex-wrap items-center justify-center my-2 gap-2">
              <Rating
                value={item.ratings || 0}
                precision={0.5}
                readOnly
                size="small"
                sx={{ color: "#6E35AE" }}
              />
              <span className="text-xs text-gray-400 font-bold">
                ({item.numOfReviews || 0})
              </span>
            </div>
            <div className="text-xl font-bold text-gray-800 mt-auto">₹ {item.price}</div>
          </Link>

          <div className="mt-4 w-full">
            <Link
              href={`/products/${item._id}`}
              className="block w-full py-2 text-center font-bold text-base rounded-full transition-colors duration-300 bg-purple-800 text-white hover:bg-purple-900 no-underline"
            >
              View details
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default Records;
