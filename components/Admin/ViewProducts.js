"use client";

import React, { useEffect, useState, useMemo } from "react";
import { deleteProduct, getFilterConfig, getProducts } from "@/services/productService";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { BiSearchAlt } from "react-icons/bi";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import swal from "sweetalert";
import Navbars from "./Navbars";

const ViewProducts = () => {
  const [productsList, setProductsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  // const [price, setPrice] = useState([]);

  const fetchFilterConfig = async () => {
    try {
      const result = await getFilterConfig();
      console.log(result);
      // setPrice([0, result.data.maxPrice]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async (page, append = false, query = "", price) => {
    try {
      if (!append) setLoading(true);
      const res = await getProducts(query, price, "", page, recordsPerPage);
      const newProducts = res.data.showProducts || [];

      if (append) {
        setProductsList((prev) => [...prev, ...newProducts]);
      } else {
        setProductsList(newProducts);
      }

      setHasMore(newProducts.length === recordsPerPage);
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage, true, searchInput);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1);
      getFilterConfig().then((res) => {
        fetchProducts(1, false, searchInput, [0, res.data.maxPrice]);
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const productDelete = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await deleteProduct(id);
          setProductsList((prev) => prev.filter((item) => item._id !== id));
          swal("Poof! Your product has been deleted!", {
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting product:", error?.response?.data || error.message);
          swal("Oops! Something went wrong while deleting.", {
            icon: "error",
          });
        }
      }
    });
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return "bg-red-100 text-red-700 border-red-200";
    if (stock < 10) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getStockLabel = (stock) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 10) return `Low Stock (${stock})`;
    return `In Stock (${stock})`;
  };

  return (
    <Navbars>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row mt-10 md:items-center text-center md:text-left justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Product Catalog
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Manage and monitor your store inventory
              </p>
            </div>

            <div className="relative group max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <BiSearchAlt size={22} />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3.5 border border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 text-sm font-medium transition-all shadow-sm"
                placeholder="Search by name or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          {/* Product List Container */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 bg-gray-50/50 border-b border-gray-100 py-5 px-8 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
              <div className="col-span-5 text-left">Product Details</div>
              <div className="col-span-3 text-center">Product ID</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100 min-h-[400px]">
              {loading && productsList.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
                </div>
              ) : productsList.length > 0 ? (
                <InfiniteScroll
                  dataLength={productsList.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className="p-10 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                  }
                  endMessage={
                    <div className="p-8 text-center bg-gray-50/50">
                      <p className="text-gray-400 text-sm font-medium">No more products to show</p>
                    </div>
                  }
                >
                  <div className="divide-y divide-gray-100">
                    {productsList.map((item) => (
                      <React.Fragment key={item._id}>
                        {/* Desktop Row */}
                        <div className="hidden md:grid grid-cols-12 py-6 px-8 items-center hover:bg-gray-50/50 transition-colors group">
                          <div className="col-span-5">
                            <div className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                              {item.name}
                            </div>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{item.category}</p>
                          </div>

                          <div className="col-span-3 text-center">
                            <code className="px-2.5 py-1 bg-gray-100 rounded-lg text-[10px] text-gray-500 font-mono font-bold">
                              #{item._id.slice(-8).toUpperCase()}
                            </code>
                          </div>

                          <div className="col-span-2 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStockBadge(item.stock)}`}>
                              {getStockLabel(item.stock)}
                            </span>
                          </div>

                          <div className="col-span-2 flex flex-row justify-end items-center gap-3">
                            <Link
                              href={`/account/updateproduct/${item._id}`}
                              className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                              title="Edit Product"
                            >
                              <FiEdit3 size={18} />
                            </Link>
                            <button
                              className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                              onClick={() => productDelete(item._id)}
                              title="Delete Product"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Mobile Card */}
                        <div className="md:hidden p-6 hover:bg-gray-50/50 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                              <p className="text-xs font-bold text-gray-400 mt-1">{item.category}</p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStockBadge(item.stock)}`}>
                              {getStockLabel(item.stock)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-400 font-mono">
                              ID: {item._id.slice(-6).toUpperCase()}
                            </code>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/account/updateproduct/${item._id}`}
                                className="p-2.5 text-blue-600 bg-blue-50 rounded-xl active:bg-blue-600 active:text-white transition-all"
                              >
                                <FiEdit3 size={18} />
                              </Link>
                              <button
                                className="p-2.5 text-red-600 bg-red-50 rounded-xl active:bg-red-600 active:text-white transition-all"
                                onClick={() => productDelete(item._id)}
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </InfiniteScroll>
              ) : (
                <div className="p-20 text-center">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiSearchAlt size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                  <p className="text-gray-500">
                    {searchInput ? "Try adjusting your search query." : "Start by adding some products to your store."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Navbars>
  );
};

export default ViewProducts;

