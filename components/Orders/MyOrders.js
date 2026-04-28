"use client";

import React, { useEffect, useState } from "react";
import { myAllOrders } from "@/services/orderService";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiExternalLink, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";

const MyOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await myAllOrders();
      setUserOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/account");
      return;
    }
    fetchOrders();
  }, [router]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Processing: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: <FiClock className="mr-1" />,
        border: "border-amber-200"
      },
      Shipped: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <FiTruck className="mr-1" />,
        border: "border-blue-200"
      },
      Delivered: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        icon: <FiCheckCircle className="mr-1" />,
        border: "border-emerald-200"
      },
      default: {
        bg: "bg-slate-100",
        text: "text-slate-700",
        icon: <FiPackage className="mr-1" />,
        border: "border-slate-200"
      }
    };

    const style = statusStyles[status] || statusStyles.default;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
        {style.icon}
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
          <p className="mt-2 text-sm text-slate-600">
            Check the status of recent orders and manage your purchases.
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 mb-4">
              <FiShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No orders yet</h3>
            <p className="mt-1 text-slate-500 max-w-xs mx-auto">
              You haven't placed any orders. Start exploring our collection today!
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-sm hover:shadow-md"
            >
              Start Shopping
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden backdrop-blur-sm bg-white/80">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-bottom border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {userOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orderdetais/${order._id}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                        >
                          Details
                          <FiExternalLink className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {userOrders.map((order) => (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</p>
                      <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total</p>
                      <p className="text-base font-bold text-slate-900 mt-0.5">
                        {formatCurrency(order.totalPrice)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <Link
                      href={`/orderdetais/${order._id}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
