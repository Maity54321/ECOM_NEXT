"use client";

import React, { useEffect, useState } from "react";
import { getCartItems } from "@/services/cartService";
import { apiKey, checkout } from "@/services/paymentServices";
import Loading from "@/components/Loading/Loading";
import { APIUrl } from "@/services/link";
import { useAuth } from "@/components/AuthProvider";
import { FiUser, FiPhone, FiMapPin, FiPackage, FiCreditCard, FiHash } from "react-icons/fi";
import CheckoutSteps from "@/components/common/CheckoutSteps";

const ConfirmOrder = () => {
  const shippingDetails = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("shipping")) : null;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const address = shippingDetails
    ? `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.country} - ${shippingDetails.pinCode}`
    : "";

  const fetchCart = async () => {
    try {
      const res = await getCartItems();
      setItems(res.data[0].cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  let subtotal = 0;
  if (items.length !== 0) {
    subtotal = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }

  const shippingCharge = subtotal >= 10000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCharge + tax;

  const handlePayment = async (totalAmount) => {
    try {
      const { data: { key } } = await apiKey();
      const { data: { order } } = await checkout(totalAmount);

      const options = {
        key: key,
        amount: totalAmount,
        currency: "INR",
        name: "Techworld",
        description: "Order Confirmation",
        image: "https://png.pngtree.com/element_pic/16/11/03/dda587d35b48fd01947cf38931323161.jpg",
        order_id: order.id,
        callback_url: `${APIUrl}/api/v1/payment/paymentverification`,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: shippingDetails?.phone,
        },
        notes: {
          address: address,
        },
        theme: {
          color: "#9333ea", // purple-600
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
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
        <div className="mb-12 max-w-xl mx-auto">
          <CheckoutSteps activeStep={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info & Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FiMapPin className="text-purple-600" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Name</p>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <FiPhone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-slate-900">{shippingDetails?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-t border-slate-100 pt-4 mt-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 mt-1">
                    <FiMapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FiPackage className="text-purple-600" />
                  Your Cart Items
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {items.map((cartItem) => (
                  <div key={cartItem._id} className="p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-colors">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={cartItem.product.images?.imgUrl}
                        alt={cartItem.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 mb-1">{cartItem.product.name}</p>
                      <p className="text-xs text-slate-500 font-mono flex items-center">
                        <FiHash className="mr-1" />
                        {cartItem.product._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency(cartItem.quantity * cartItem.product.price)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {cartItem.quantity} × {formatCurrency(cartItem.product.price)}
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
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <FiCreditCard className="text-purple-600" />
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Shipping Charges</span>
                  <span className={`font-bold ${shippingCharge === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                    {shippingCharge === 0 ? "Free" : formatCurrency(shippingCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">GST (18%)</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mb-8">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-purple-600">{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={() => handlePayment(total)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Proceed to Payment
                </button>

                <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-widest font-bold">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
