"use client";

import React, { useEffect, useState } from "react";
import { getParticularProduct } from "@/services/productService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createCart } from "@/services/cartService";
import Loading from "@/components/Loading/Loading";
import { 
  FaCartPlus, 
  FaBolt, 
  FaMinus, 
  FaPlus, 
  FaShieldAlt, 
  FaTruck, 
  FaRedoAlt 
} from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const ReactStars = dynamic(() => import("react-rating-stars-component"), {
  ssr: false,
});

function ParticularProduct() {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      getParticularProduct(id).then((response) => {
        setProduct(response.data.product);
        setLoading(false);
      });
    } catch (error) {
      console.log(error.response.data);
    }

    window.scrollTo(0, 0);
  }, [id]);

  const handleRating = (val) => {
    const options = {
      edit: false,
      color: "rgba(30,30,30,0.2)",
      activeColor: "#6E35AE",
      size: typeof window !== "undefined" && window.innerWidth > 650 ? 24 : 20,
      value: val || 0,
      isHalf: true,
    };
    return options;
  };

  const addToCart = async () => {
    const cart = {
      product: product._id,
      quantity: quantity,
      price: product.price,
    };
    await createCart(cart);
    router.push("/cart");
  };

  const handleBuyNow = () => {
    addToCart();
    router.push("/shipping");
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Section: Image Display */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden p-8 flex items-center justify-center border border-gray-100 shadow-sm transition-all hover:shadow-md aspect-square lg:aspect-auto lg:h-[600px]">
              <img
                className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-110"
                src={product.images?.imgUrl}
                alt={product.name}
              />
            </div>
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <FaTruck className="text-[#6E35AE] mb-2" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <FaShieldAlt className="text-[#6E35AE] mb-2" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <FaRedoAlt className="text-[#6E35AE] mb-2" size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Section: Product Info */}
          <div className="flex flex-col">
            {/* Category & Badge */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-4 py-1 bg-purple-100 text-[#6E35AE] text-xs font-black uppercase tracking-widest rounded-full">
                {product.category || "Premium Product"}
              </span>
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                <HiOutlineBadgeCheck className="mr-1" size={16} /> Verified Quality
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
              <div className="mr-3">
                <ReactStars {...handleRating(product.rating)} />
              </div>
              <span className="text-sm font-bold text-gray-400">
                ({product.numOfReviews || 0} Customer Reviews)
              </span>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end space-x-6 mb-10">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-5xl font-black text-gray-900">₹{product.price}</span>
              </div>
              <div className="pb-1">
                <span className={`px-4 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-widest ${
                  product.stock > 0 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg italic font-medium">
                "{product.description}"
              </p>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Select Quantity</h3>
                <div className="flex items-center w-fit bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-sm">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-[#6E35AE] hover:shadow-md transition-all active:scale-90 shadow-sm border border-gray-50"
                  >
                    <FaMinus size={14} />
                  </button>
                  <span className="w-16 text-center text-xl font-black text-gray-900">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-[#6E35AE] hover:shadow-md transition-all active:scale-90 shadow-sm border border-gray-50"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                disabled={product.stock <= 0}
                onClick={addToCart}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-[#6E35AE] text-white rounded-3xl font-bold text-lg shadow-xl shadow-purple-200 hover:bg-[#5a2b8f] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <FaCartPlus size={20} /> Add to Cart
              </button>
              <button
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-[#6E35AE] border-2 border-[#6E35AE] rounded-3xl font-bold text-lg hover:bg-purple-50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaBolt size={20} /> Buy Now
              </button>
            </div>

            {/* Security Note */}
            <p className="mt-8 text-center sm:text-left text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center sm:justify-start">
              <FaShieldAlt className="text-green-500 mr-2" size={14} /> 100% Genuine & Secure Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParticularProduct;

