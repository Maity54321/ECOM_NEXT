"use client";

import React, { useEffect, useState } from "react";
import { getDashboardInfo, getProducts } from "@/services/productService";
import { allOrders, getTopCustomers } from "@/services/orderService";
import { ping } from "@/services/healthCheck.service";
import Navbars from "./Navbars";
import { FiBox, FiTrendingUp, FiAlertCircle, FiTag, FiShoppingBag, FiUsers, FiArrowRight, FiExternalLink, FiXCircle } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);

  const [recentOrders, setRecentOrders] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [healthStatus, setHealthStatus] = useState({
    api: "Checking...",
    database: "Checking...",
    lastBackup: "2h ago"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const res = await getDashboardInfo();
        const totalProducts = res.data.productCount;
        const totalValue = res.data.totalRevenue;
        const lowStock = res.data.lowStock;
        const outOfStock = res.data.outOfStock;
        const categories = res.data.totalCategories;
        setStats({ totalProducts, totalValue, lowStock, outOfStock, categories });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const res = await allOrders(1, 5);
        setRecentOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const res = await getTopCustomers(1, 5);
        setTopCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setCustomersLoading(false);
      }
    };

    const fetchHealth = async () => {
      try {
        setHealthLoading(true);
        const res = await ping();
        if (res.status === 200) {
          setHealthStatus(prev => ({ ...prev, api: "Operational", database: "Healthy" }));
        } else {
          setHealthStatus(prev => ({ ...prev, api: "Issues Detected", database: "Degraded" }));
        }
      } catch (error) {
        setHealthStatus(prev => ({ ...prev, api: "Offline", database: "Unknown" }));
      } finally {
        setHealthLoading(false);
      }
    };

    fetchStats();
    fetchOrders();
    fetchCustomers();
    fetchHealth();
    // setInterval(fetchHealth, 5000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Navbars>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl mt-3 font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 mt-2 text-lg">Detailed insights and recent activity for your store.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                Export Report
              </button>
              <button className="px-4 py-2 bg-purple-600 rounded-xl text-sm font-semibold text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-200">
                Generate Analytics
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            {[
              { label: "Total Products", value: stats.totalProducts, icon: FiBox, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Revenue", value: `₹ ${stats.totalValue.toLocaleString()}`, icon: FiTrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "Low Stock", value: stats.lowStock, icon: FiAlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Out of Stock", value: stats.outOfStock, icon: FiXCircle, color: "text-red-600", bg: "bg-red-50" },
              { label: "Categories", value: stats.categories, icon: FiTag, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    {statsLoading ? (
                      <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Orders */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FiShoppingBag size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                  </div>
                  <button onClick={() => router.push("/dashboard/orders")} className="text-purple-600 font-semibold text-sm hover:underline flex items-center gap-1">
                    View All <FiArrowRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-8 py-4 text-left">Order ID</th>
                        <th className="px-8 py-4 text-left">Customer</th>
                        <th className="px-8 py-4 text-center">Amount</th>
                        <th className="px-8 py-4 text-center">Status</th>
                        <th className="px-8 py-4 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ordersLoading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-8 py-5"><div className="h-4 w-20 bg-gray-100 rounded"></div></td>
                            <td className="px-8 py-5"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                            <td className="px-8 py-5"><div className="h-4 w-16 bg-gray-100 rounded mx-auto"></div></td>
                            <td className="px-8 py-5"><div className="h-6 w-20 bg-gray-100 rounded-full mx-auto"></div></td>
                            <td className="px-8 py-5"><div className="h-4 w-24 bg-gray-100 rounded ml-auto"></div></td>
                          </tr>
                        ))
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-5 font-mono text-sm text-gray-600">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-8 py-5 font-bold text-gray-900">{order.user?.name || "Guest"}</td>
                            <td className="px-8 py-5 text-center font-semibold text-gray-900">₹ {order.totalPrice.toLocaleString()}</td>
                            <td className="px-8 py-5 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Placeholder */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <FiTrendingUp className="text-green-600" />
                    Sales Analytics
                  </h2>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/20">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <HiOutlineDocumentReport size={48} className="mb-4 opacity-50" />
                  <p className="font-medium text-lg text-gray-500">Sales Trend Chart Placeholder</p>
                  <p className="text-sm">Connecting to analytics API soon...</p>
                </div>
              </div>
            </div>

            {/* Right Column: Insights & Activity */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiUsers className="text-purple-600" />
                  Top Customers
                </h3>
                <div className="space-y-6">
                  {customersLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100"></div>
                          <div className="space-y-2">
                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-12 bg-gray-100 rounded"></div>
                      </div>
                    ))
                  ) : (
                    topCustomers.map((cust, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                            {cust.user.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{cust.user.name}</p>
                            <p className="text-xs text-gray-500">{cust.orderCount} Orders</p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">₹ {cust.totalSpent.toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-900 p-8 rounded-3xl text-white shadow-xl shadow-purple-500/20 group">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">System Health</h3>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-100">API Status</span>
                    {healthLoading ? (
                      <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <span className="font-bold">{healthStatus.api}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-100">Database</span>
                    {healthLoading ? (
                      <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
                    ) : (
                      <span className="font-bold">{healthStatus.database}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-100">Last Backup</span>
                    <span className="font-bold">{healthStatus.lastBackup}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <FiExternalLink /> Server Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbars>
  );
}

export default Dashboard;


