"use client";

import React, { useEffect, useState } from "react";
import { deleteItem, getCartItems, updateCartItem } from "@/services/cartService";
import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaArrowRight,
  FaShoppingCart,
  FaShieldAlt
} from "react-icons/fa";
import swal from "sweetalert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { useAuth } from "@/components/AuthProvider";

const Cart = () => {
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const myCart = async () => {
    try {
      const response = await getCartItems();
      setItem(response.data[0]?.cartItems || []);
      setLoading(false);
    } catch (error) {
      console.log(error?.response);
      router.push("/account");
      setLoading(false);
    }
  };

  useEffect(() => {
    myCart();
  }, []);

  const handleRemoveItem = (itemId) => {
    swal({
      title: "Remove from cart?",
      text: "Are you sure you want to remove this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Remove"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteItem(itemId);
        myCart();
        swal("Removed!", "Item has been removed from your cart.", "success");
      }
    });
  };

  const handleIncrement = async (itemId, currentQuantity, stock) => {
    if (currentQuantity >= stock) {
      swal("Limit Reached", "Cannot add more than available stock", "info");
      return;
    }
    try {
      const res = await updateCartItem(itemId, currentQuantity + 1);
      console.log(res);
      myCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrement = async (itemId, currentQuantity) => {
    if (currentQuantity <= 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await updateCartItem(itemId, currentQuantity - 1);
      myCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const totalAmount = item.reduce((sum, it) => {
    return sum + it.product.price * it.quantity;
  }, 0);

  const tax = totalAmount * 0.05; // 5% example tax
  const finalTotal = totalAmount + tax;

  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (!user || item.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 pt-32">
        <div className="w-24 h-24 bg-purple-50 text-[#6E35AE] rounded-full flex items-center justify-center mb-6 animate-bounce">
          <FaShoppingCart size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our amazing products and find something you love!
        </p>
        <Link href="/product">
          <button className="flex items-center px-8 py-4 bg-[#6E35AE] text-white rounded-2xl font-bold hover:bg-[#5a2b8f] transition-all transform active:scale-95 shadow-lg shadow-purple-100">
            Start Shopping <FaArrowRight className="ml-2" size={14} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>
          <span className="px-3 py-1 bg-purple-100 text-[#6E35AE] rounded-full text-sm font-bold">
            {item.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {item.map((cartItem) => (
              <div
                key={cartItem.product._id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center transition-all hover:shadow-md group"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4 sm:mb-0 sm:mr-8 flex-shrink-0 border border-gray-100">
                  <img
                    src={cartItem.product.images?.imgUrl}
                    alt={cartItem.product.name}
                    className="max-h-24 max-w-24 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#6E35AE] transition-colors">
                    {cartItem.product.name}
                  </h3>
                  <p className="text-[#6E35AE] font-bold text-lg mb-4">₹ {cartItem.product.price}</p>

                  <div className="flex items-center justify-center sm:justify-start space-x-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                      <button
                        onClick={() => handleDecrement(cartItem._id, cartItem.quantity)}
                        className="p-2 text-gray-500 hover:text-[#6E35AE] transition-colors active:scale-90"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleIncrement(cartItem._id, cartItem.quantity, cartItem.product.stock)}
                        className="p-2 text-gray-500 hover:text-[#6E35AE] transition-colors active:scale-90"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(cartItem._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-sm font-medium"
                    >
                      <FaTrashAlt className="mr-2" /> Remove
                    </button>
                  </div>
                </div>

                {/* Total Item Price */}
                <div className="mt-4 sm:mt-0 sm:ml-8 text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                  <p className="text-2xl font-black text-gray-900">
                    ₹ {cartItem.product.price * cartItem.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/product" className="flex items-center text-gray-500 font-bold hover:text-[#6E35AE] transition-colors">
                <FaArrowRight className="rotate-180 mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹ {totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-gray-900">₹ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-widest bg-green-50 px-2 py-1 rounded-md">Free</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-[#6E35AE]">₹ {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/shipping")}
                className="w-full py-5 bg-[#6E35AE] text-white rounded-2xl font-bold text-xl shadow-lg shadow-purple-200 hover:bg-[#5a2b8f] transition-all transform active:scale-95 mb-6 flex items-center justify-center"
              >
                Checkout Now <FaArrowRight className="ml-3" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <FaShieldAlt className="text-green-500" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

