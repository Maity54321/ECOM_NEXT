"use client";

import React, { useEffect, useState, useMemo } from "react";
import { deleteProduct, getProducts } from "@/services/productService";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { BiSearchAlt } from "react-icons/bi";
import Link from "next/link";
import swal from "sweetalert";
import Navbars from "./Navbars";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchInput) return products;
    return products.filter((item) =>
      item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      item._id.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [products, searchInput]);

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
          setProducts((prev) => prev.filter((item) => item._id !== id));
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Product Catalog
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and monitor your store inventory
              </p>
            </div>

            <div className="relative group max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <BiSearchAlt size={20} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 sm:text-sm transition-all shadow-sm"
                placeholder="Search by name or ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-100 py-4 px-6 text-sm font-semibold text-gray-600 tracking-wider uppercase">
              <div className="col-span-4 lg:col-span-5 text-left">Product Details</div>
              <div className="col-span-4 lg:col-span-3 text-center hidden md:block">Product ID</div>
              <div className="col-span-4 lg:col-span-2 text-center">Status</div>
              <div className="col-span-4 lg:col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-500 font-medium">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-12 py-5 px-6 items-center hover:bg-gray-50/80 transition-colors group"
                  >
                    <div className="col-span-4 lg:col-span-5">
                      <div className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                        {item.name}
                      </div>
                    </div>
                    
                    <div className="col-span-4 lg:col-span-3 text-center hidden md:block">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">
                        {item._id.slice(-8)}...
                      </code>
                    </div>

                    <div className="col-span-4 lg:col-span-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStockBadge(item.stock)}`}>
                        {getStockLabel(item.stock)}
                      </span>
                    </div>

                    <div className="col-span-4 lg:col-span-2 flex flex-row justify-end items-center gap-4">
                      <Link
                        href={`/account/updateproduct/${item._id}`}
                        className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="Edit Product"
                      >
                        <FiEdit3 size={18} />
                      </Link>
                      <button
                        className="p-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        onClick={() => productDelete(item._id)}
                        title="Delete Product"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
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

