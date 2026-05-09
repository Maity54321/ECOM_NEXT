"use client";

import React, { useEffect, useState } from "react";
import { allOrders, updateOrderStatus, adminDeleteOrder } from "@/services/orderService";
import Navbars from "./Navbars";
import {
  FiShoppingBag,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiMoreVertical,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import swal from "sweetalert";
import Link from "next/link";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openStatusId, setOpenStatusId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const LIMIT = 20;

  const fetchOrders = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await allOrders(page, LIMIT);
      setOrders(res.data.orders);
      // Extract pagination metadata from response
      setTotalPages(Math.ceil(res.data.totalCount / LIMIT) || res.data.pages || 1);
      setTotalOrders(res.data.totalCount || res.data.totalOrders || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  // Fetch orders when page changes
  useEffect(() => {
    if (currentPage > 0) {
      fetchOrders(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setOpenStatusId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success(`Order status changed to ${newStatus}`, { theme: "colored" });
      fetchOrders(currentPage);
    } catch (error) {
      swal("Error!", error.response?.data || "Something went wrong", "error");
    }
  };

  const handleDeleteOrder = (id) => {
    swal({
      title: "Delete Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Yes, Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await adminDeleteOrder(id);
          swal("Deleted!", "Order has been removed.", "success");
          fetchOrders(1);
        } catch (error) {
          swal("Error!", "Failed to delete order", "error");
        }
      }
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || order.orderStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Navbars>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row mt-8 items-center md:text-left text-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl mt-3 font-extrabold text-gray-900 tracking-tight">Order Management</h1>
              <p className="text-gray-500 mt-2 text-lg">Manage, track and update all customer orders.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
                <span className="text-xl font-black text-purple-600">{totalOrders || orders.length}</span>
              </div>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="relative w-full lg:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <FiFilter className="text-gray-400" size={20} />
              <select
                className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500/20 transition-all flex-1 lg:flex-none min-w-[150px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loading />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <FiShoppingBag size={40} />
                </div>
                <p className="text-gray-500 font-bold text-lg">No orders found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Order Info</th>
                        <th className="px-8 py-6">Customer</th>
                        <th className="px-8 py-6">Total Amount</th>
                        <th className="px-8 py-6 text-center">Status</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-gray-400 mb-1">#{order._id.slice(-8).toUpperCase()}</span>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900">{order.user?.name || "Guest"}</span>
                              <span className="text-xs text-gray-500 font-medium">{order.user?.email}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-lg font-black text-gray-900">₹ {order.totalPrice.toLocaleString()}</span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="relative flex items-center justify-center status-dropdown">
                              <button
                                onClick={() => setOpenStatusId(openStatusId === order._id ? null : order._id)}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${getStatusStyle(order.orderStatus)}`}
                              >
                                {order.orderStatus}
                                <FiMoreVertical className="text-[10px]" />
                              </button>

                              {openStatusId === order._id && (
                                <div className="absolute top-full mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-4 mb-2">Update Status</p>
                                  {["Processing", "Shipped", "Delivered"].map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => {
                                        handleUpdateStatus(order._id, status);
                                        setOpenStatusId(null);
                                      }}
                                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 group/item`}
                                    >
                                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(status)} group-hover/item:scale-105 transition-transform w-full text-center`}>
                                        {status}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/orderdetais/${order._id}`}
                                className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="View Details"
                              >
                                <FiEye size={18} />
                              </Link>
                              <button
                                onClick={() => handleDeleteOrder(order._id)}
                                className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Delete Order"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-gray-400">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <div className="relative status-dropdown">
                          <button
                            onClick={() => setOpenStatusId(openStatusId === order._id ? null : order._id)}
                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getStatusStyle(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                            <FiMoreVertical size={10} />
                          </button>
                          {openStatusId === order._id && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                              {["Processing", "Shipped", "Delivered"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => {
                                    handleUpdateStatus(order._id, status);
                                    setOpenStatusId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50"
                                >
                                  <span className={`block w-full text-center py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(status)}`}>
                                    {status}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-bold text-gray-900">{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-gray-500 font-medium">{order.user?.email}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-black text-gray-900">₹ {order.totalPrice.toLocaleString()}</p>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/orderdetais/${order._id}`}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl active:bg-blue-600 active:text-white"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl active:bg-red-600 active:text-white"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="bg-gray-50/50 border-t border-gray-100 px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95"
                  >
                    <FiChevronLeft size={18} />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                      Page <span className="text-purple-600 font-black">{currentPage}</span> of <span className="text-purple-600 font-black">{totalPages}</span>
                    </span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-bold text-sm transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95"
                  >
                    <span>Next</span>
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Navbars>
  );
}

export default AllOrders;
