"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import Navbars from "./Navbars";
import { FiBox, FiTrendingUp, FiAlertCircle, FiTag, FiShoppingBag, FiUsers, FiArrowRight, FiExternalLink } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for recent orders
  const recentOrders = [
    { id: "ORD-7321", customer: "Rahul Sharma", amount: 1299, status: "Delivered", date: "2 mins ago" },
    { id: "ORD-7320", customer: "Priya Patel", amount: 849, status: "Processing", date: "15 mins ago" },
    { id: "ORD-7319", customer: "Amit Kumar", amount: 2100, status: "Shipped", date: "1 hour ago" },
    { id: "ORD-7318", customer: "Sneha Reddy", amount: 450, status: "Delivered", date: "3 hours ago" },
    { id: "ORD-7317", customer: "Vikram Singh", amount: 3200, status: "Pending", date: "5 hours ago" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const products = res.data;

        const totalProducts = products.length;
        const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
        const lowStock = products.filter(p => p.stock < 10).length;
        const categories = new Set(products.map(p => p.category)).size;

        setStats({ totalProducts, totalValue, lowStock, categories });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Products", value: stats.totalProducts, icon: FiBox, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Revenue", value: `$${stats.totalValue.toLocaleString()}`, icon: FiTrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "Low Stock Alert", value: stats.lowStock, icon: FiAlertCircle, color: "text-red-600", bg: "bg-red-50" },
              { label: "Store Categories", value: stats.categories, icon: FiTag, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? "..." : stat.value}</p>
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
                  <button className="text-purple-600 font-semibold text-sm hover:underline flex items-center gap-1">
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-5 font-mono text-sm text-gray-600">{order.id}</td>
                          <td className="px-8 py-5 font-bold text-gray-900">{order.customer}</td>
                          <td className="px-8 py-5 text-center font-semibold text-gray-900">${order.amount}</td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right text-sm text-gray-500">{order.date}</td>
                        </tr>
                      ))}
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
                  {[
                    { name: "Rahul Sharma", orders: 12, spent: 15400 },
                    { name: "Priya Patel", orders: 9, spent: 8200 },
                    { name: "Vikram Singh", orders: 7, spent: 6100 },
                  ].map((cust, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                          {cust.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{cust.name}</p>
                          <p className="text-xs text-gray-500">{cust.orders} Orders</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">${cust.spent.toLocaleString()}</p>
                    </div>
                  ))}
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
                    <span className="font-bold">Operational</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-100">Database</span>
                    <span className="font-bold">Healthy</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-100">Last Backup</span>
                    <span className="font-bold">2h ago</span>
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


