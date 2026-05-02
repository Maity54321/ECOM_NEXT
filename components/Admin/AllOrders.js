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
  FiArrowRight
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await allOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      // swal("Updated!", `Order status changed to ${newStatus}`, "success");
      toast.success(`Order status changed to ${newStatus}`, { theme: "colored" });
      fetchOrders();
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
          fetchOrders();
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

  return (
    <Navbars>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl mt-3 font-extrabold text-gray-900 tracking-tight">Order Management</h1>
              <p className="text-gray-500 mt-2 text-lg">Manage, track and update all customer orders.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
                <span className="text-xl font-black text-purple-600">{orders.length}</span>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-500 text-xs font-black uppercase tracking-[0.2em]">
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
                            <span className="text-xs font-medium text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{order.user?.name || "Guest"}</span>
                            <span className="text-xs text-gray-500">{order.user?.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-lg font-black text-gray-900">₹ {order.totalPrice.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="relative flex items-center justify-center status-dropdown">
                            <button
                              onClick={() => setOpenStatusId(openStatusId === order._id ? null : order._id)}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${getStatusStyle(order.orderStatus)}`}
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
                        <td className="px-8 py-6">
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
            )}
          </div>
        </div>
      </div>
    </Navbars>
  );
}

export default AllOrders;
