"use client";

import React, { useEffect, useState } from "react";
import { getParticularProduct } from "@/services/productService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createCart } from "@/services/cartService";
import Loading from "@/components/Loading/Loading";
import { FaCartPlus, FaBolt, FaMinus, FaPlus, FaShieldAlt, FaTruck, FaRedoAlt } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { Rating, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { submitReview } from "@/services/productService";
import { toast } from "react-toastify";

function ParticularProduct() {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Review states
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCartSlider, setShowCartSlider] = useState(false);

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

  const submitReviewHandler = async () => {
    const myForm = {
      rating,
      comment,
      productId: id,
    };

    try {
      const response = await submitReview(myForm);
      if (response.data.success) {
        toast.success("Review Submitted Successfully");
        setOpen(false);
        // Refresh product data
        getParticularProduct(id).then((response) => {
          setProduct(response.data.product);
        });
      }
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong");
    }
  };

  const addToCart = async () => {
    const cart = {
      product: product._id,
      quantity: quantity,
      price: product.price,
    };
    await createCart(cart);
    setShowCartSlider(true);
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
              <div className="mr-3 flex items-center gap-2">
                <Rating
                  value={product.ratings || 0}
                  precision={0.5}
                  readOnly
                  sx={{ color: "#6E35AE" }}
                />
                <span className="text-lg font-bold text-gray-900">{product.ratings?.toFixed(1) || "0.0"}</span>
              </div>
              <span className="text-sm font-bold text-gray-400 mr-6">
                ({product.numOfReviews || 0} Customer Reviews)
              </span>
              <button
                onClick={() => setOpen(true)}
                className="text-[#6E35AE] font-bold text-sm hover:underline transition-all"
              >
                Write a Review
              </button>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end space-x-6 mb-10">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-5xl font-black text-gray-900">₹{product.price}</span>
              </div>
              <div className="pb-1">
                <span className={`px-4 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-widest ${product.stock > 0
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

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black text-gray-900 mb-10 text-center lg:text-left">Customer Reviews</h2>
        {product.reviews && product.reviews[0] ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-[#6E35AE] font-bold text-xl mr-4 uppercase">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <Rating value={review.rating} readOnly size="small" sx={{ color: "#6E35AE" }} />
                  </div>
                </div>
                <p className="text-gray-600 italic flex-grow">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 py-16 rounded-[3rem] text-center border border-gray-100">
            <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">No Reviews Yet</p>
            <p className="text-gray-500 mt-2">Be the first to review this product!</p>
            <button
              onClick={() => setOpen(true)}
              className="mt-6 px-8 py-3 bg-white text-[#6E35AE] border-2 border-[#6E35AE] rounded-full font-bold hover:bg-purple-50 transition-all"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            borderRadius: "2rem",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle className="font-black text-2xl text-gray-900">Submit Review</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col items-center gap-2">
              <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Overall Rating</p>
              <Rating
                name="rating"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                size="large"
                sx={{ color: "#6E35AE" }}
              />
            </div>
            <TextField
              label="Your Experience"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              InputProps={{
                style: { borderRadius: "1.5rem" },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button
            onClick={() => setOpen(false)}
            sx={{
              color: "gray",
              fontWeight: "bold",
              borderRadius: "1rem",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitReviewHandler}
            variant="contained"
            sx={{
              backgroundColor: "#6E35AE",
              "&:hover": { backgroundColor: "#5a2b8f" },
              fontWeight: "bold",
              borderRadius: "1rem",
              px: 4,
              py: 1.5,
              boxShadow: "0 10px 20px -5px rgba(110, 53, 174, 0.3)",
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add to Cart Slider */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-500 ease-in-out ${showCartSlider ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="mx-auto max-w-4xl mb-8 px-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={product.images?.imgUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>
              <div>
                <p className="text-[#6E35AE] font-black text-xs uppercase tracking-widest mb-1">Success!</p>
                <h4 className="text-gray-900 font-bold text-lg line-clamp-1">{product.name}</h4>
                <p className="text-gray-400 text-sm font-medium">Added to your shopping cart</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
              <button
                onClick={() => setShowCartSlider(false)}
                className="flex-1 md:flex-none px-8 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 border border-gray-100"
              >
                Close
              </button>
              <Link
                href="/cart"
                className="flex-1 md:flex-none px-10 py-4 bg-[#6E35AE] text-white font-bold rounded-2xl hover:bg-[#5a2b8f] transition-all active:scale-95 shadow-lg shadow-purple-200 text-center"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParticularProduct;

