"use client";

import React, { useEffect, useState } from "react";
import { getCategories, getProducts } from "@/services/productService";
import { useParams } from "next/navigation";
import Records from "@/components/Home/Records";
import InfiniteScroll from "react-infinite-scroll-component";
import Slider from "@mui/material/Slider";
import Loading from "@/components/Loading/Loading";
import { FiFilter, FiTag } from "react-icons/fi";

// const categories = ["All", "Mobiles", "Monitors", "Laptops"];

const AllProducts = () => {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [price, setPrice] = useState([0, 99999]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // const indexOfLastRecord = currentPage * recordsPerPage;
  // const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // const currentRecords = allProducts.slice(
  //   indexOfFirstRecord,
  //   indexOfLastRecord
  // );

  const params = useParams();
  const keyword = params?.keyword;

  const fetchProducts = async (page, append = false) => {
    try {
      const result = await getProducts(keyword, price, category, page, recordsPerPage);
      const newProducts = result.data.showProducts || [];

      if (append) {
        setProductsList((prev) => [...prev, ...newProducts]);
      } else {
        setProductsList(newProducts);
      }

      setHasMore(newProducts.length === recordsPerPage);
      setLoading(false);
    } catch (error) {
      // console.log(error.response.data);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(["All", ...result.data.categories]);
    } catch (error) {
      // console.log(error.response.data);
    }
  };

  const fetchMoreData = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 1366) {
      setRecordsPerPage(12);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    fetchProducts(1, false);
    fetchCategories();
  }, [keyword, price, category, recordsPerPage]);

  const handleCategory = (cat) => {
    cat === category || category === "" ? setLoading(false) : setLoading(true);
    setCurrentPage(1);
    if (cat === "All") return setCategory("");
    setCategory(cat);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex md:flex-row flex-col mb-20 gap-8 px-4 md:px-8">
          {/* Modern Sidebar */}
          <div className="md:w-72 w-full mt-24 md:block hidden">
            <div className="sticky top-28 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8">
              {/* Price Filter Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <FiFilter className="text-purple-600" />
                  <h3 className="font-semibold text-lg">Price Range</h3>
                </div>
                <div className="px-2">
                  <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={99999}
                    sx={{
                      color: '#9333ea', // purple-600
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#fff',
                        border: '2px solid currentColor',
                      },
                    }}
                  />
                  <div className="flex justify-between text-xs font-medium text-slate-500 mt-1">
                    <span>₹{price[0].toLocaleString()}</span>
                    <span>₹{price[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Categories Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <FiTag className="text-purple-600" />
                  <h3 className="font-semibold text-lg">Categories</h3>
                </div>
                <ul className="space-y-1">
                  {categories.map((item, index) => {
                    const isActive = (item === "All" && category === "") || (item === category);
                    return (
                      <li
                        key={index}
                        onClick={() => handleCategory(item)}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${isActive
                          ? "bg-purple-50 text-purple-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full">
            <InfiniteScroll
              dataLength={productsList.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="w-full flex justify-center py-12">
                  <div className="loading !h-12 !w-12 !border-b-2"></div>
                </div>
              }
              endMessage={
                <div className="w-full flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="h-px w-24 bg-slate-200" />
                  <p className="text-slate-400 font-medium text-sm tracking-wide">
                    YOU'VE REACHED THE END
                  </p>
                  <div className="h-px w-24 bg-slate-200" />
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-16 px-4">
                <Records data={productsList} />
              </div>
            </InfiniteScroll>
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
