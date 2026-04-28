"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserOrderDetails } from "@/services/orderService";
import Loading from "@/components/Loading/Loading";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiPhone, 
  FiUser, 
  FiCreditCard, 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiHash 
} from "react-icons/fi";
import Link from "next/link";

const UserOrderDetails = () => {
  const params = useParams();
  const id = params.id;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await getUserOrderDetails(orderId);
      setOrderDetails(res.data.order);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch order details", {
        theme: "colored",
        position: "bottom-center",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/account");
      return;
    }
    fetchOrderDetails(id);
  }, [id, router]);

  useEffect(() => {
    if (loading === false && orderDetails?.user) {
      const checkToken = decodeToken(localStorage.getItem("token"));
      if (checkToken._id !== orderDetails.user._id) {
        router.push("/account");
      }
    }
  }, [loading, orderDetails, router]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Processing: { bg: "bg-amber-100", text: "text-amber-700", icon: <FiClock className="mr-1" />, border: "border-amber-200" },
      Shipped: { bg: "bg-blue-100", text: "text-blue-700", icon: <FiTruck className="mr-1" />, border: "border-blue-200" },
      Delivered: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <FiCheckCircle className="mr-1" />, border: "border-emerald-200" },
      default: { bg: "bg-slate-100", text: "text-slate-700", icon: <FiPackage className="mr-1" />, border: "border-slate-200" }
    };
    const style = statusStyles[status] || statusStyles.default;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border}`}>
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
  if (!orderDetails) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
        <Link href="/orders" className="mt-4 text-purple-600 hover:underline">Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <button 
              onClick={() => router.push("/orders")}
              className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors mb-2"
            >
              <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back to My Orders
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Details</h1>
              {getStatusBadge(orderDetails.orderStatus)}
            </div>
            <p className="mt-2 text-sm text-slate-500 font-mono flex items-center">
              <FiHash className="mr-1" />
              {orderDetails._id.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Shipping & Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <FiMapPin className="mr-2 text-purple-600" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{orderDetails.user?.name}</p>
                    <p className="text-xs text-slate-500">Customer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{orderDetails.shippingInfo?.phone}</p>
                    <p className="text-xs text-slate-500">Phone Number</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-slate-100 pt-4 mt-4">
                  <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400">
                    <FiMapPin />
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p className="font-medium text-slate-900">{orderDetails.shippingInfo?.address}</p>
                    <p>{orderDetails.shippingInfo?.city}, {orderDetails.shippingInfo?.state}</p>
                    <p>{orderDetails.shippingInfo?.country} - {orderDetails.shippingInfo?.pinCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                  <FiPackage className="mr-2 text-purple-600" />
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {orderDetails.orderItems?.map((item) => (
                  <div key={item._id} className="p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={item.product?.images?.imgUrl}
                        alt={item.product?.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.product?.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Qty: <span className="font-medium text-slate-900">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(item.product?.price * item.quantity)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatCurrency(item.product?.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-28">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <FiCreditCard className="mr-2 text-purple-600" />
                Payment Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items Price</span>
                  <span className="text-slate-900 font-medium">{formatCurrency(orderDetails.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST (Tax)</span>
                  <span className="text-slate-900 font-medium">{formatCurrency(orderDetails.taxPrice)}</span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-slate-100">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-emerald-600 font-medium">
                    {orderDetails.shippingPrice === 0 ? "Free" : formatCurrency(orderDetails.shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-bold text-slate-900">Total Price</span>
                  <span className="text-xl font-black text-purple-600">
                    {formatCurrency(orderDetails.totalPrice)}
                  </span>
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-700 font-medium text-center">
                    Payment Method: <span className="uppercase">{orderDetails.paymentInfo?.status === "succeeded" ? "Card / Digital" : "Cash on Delivery"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
