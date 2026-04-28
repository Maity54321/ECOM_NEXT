"use client";

import React, { useEffect, useState } from "react";
import { getParticularProduct } from "@/services/productService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createCart } from "@/services/cartService";
import Loading from "@/components/Loading/Loading";
import { BiCartAdd } from "react-icons/bi";
import { AiTwotoneThunderbolt } from "react-icons/ai";

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
      color: "rgba(30,30,30,0.5)",
      activeColor: "Purple",
      size: typeof window !== "undefined" && window.innerWidth > 650 ? 25 : 20,
      value: val,
      isHalf: true,
    };
    return options;
  };

  const cart = {
    product: product._id,
    quantity: quantity,
    price: product.price,
  };

  const addToCart = async () => {
    const res = await createCart(cart);
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

  const handleBuyNow = () => {
    router.push("/shipping");
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex w-full">
          <div className="flex md:flex-row flex-col w-full mt-20 p-5 gap-5">
            <div className="flex flex-col md:w-1/3 w-full">
              <div className="w-full flex flex-row justify-center items-center">
                <img
                  className="max-w-full h-[450px]"
                  src={product.images?.imgUrl}
                  alt={product.name}
                />
              </div>
              <div className="flex flex-row justify-evenly mt-2">
                <Link
                  href={
                    typeof window !== "undefined" &&
                    localStorage.getItem("token")
                      ? "/cart"
                      : "/account"
                  }
                  className="p-3 border border-solid w-full text-center font-bold text-lg rounded-full duration-700 bg-purple-800 text-white cursor-pointer hover:bg-white hover:text-purple-800 no-underline flex items-center justify-center"
                  onClick={addToCart}
                >
                  Add To Cart &nbsp;
                  <span className="h-full flex items-center justify-center">
                    <BiCartAdd className="text-2xl" />
                  </span>
                </Link>
                <div
                  className="p-3 border border-solid w-full font-bold text-xl rounded-full duration-700 bg-purple-800 text-white cursor-pointer hover:bg-white hover:text-purple-800 flex items-center justify-center"
                  onClick={handleBuyNow}
                >
                  Buy Now &nbsp;
                  <span className="h-full flex items-center justify-center">
                    <AiTwotoneThunderbolt className="text-2xl" />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:ms-5 w-full justify-evenly">
              <div className="font-bold text-xl w-full">{product.name}</div>
              <div className="w-full mt-2 text-xl">
                <div className="font-bold text-xl text-blue-700 font-roboto w-fit p-2">
                  Product Description :
                </div>
                {product.description}
              </div>

              <div className="flex md:flex-row flex-col mt-2">
                <div className="font-bold text-xl text-blue-700 font-roboto w-fit p-2 flex flex-row">
                  Price:
                  <span className="font-bold text-3xl text-black ms-2">
                    ₹{product.price}
                  </span>
                </div>
                <div className="font-bold text-xl text-blue-700 font-roboto w-fit p-2 flex flex-row">
                  Product in Stock:
                  <span className="font-bold text-xl text-black ms-2">
                    {product.stock}
                  </span>
                </div>
              </div>
              <div className="flex flex-row">
                <div
                  className="p-2 ps-3 pe-3 flex justify-center items-center bg-purple-800 text-white rounded-md text-4xl cursor-default"
                  onClick={decreaseQuantity}
                >
                  -
                </div>
                <input
                  type="number"
                  className="w-10 p-2 border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center text-xl"
                  value={quantity}
                  readOnly
                />
                <div
                  className="flex justify-center items-center p-2 text-center bg-purple-800 text-white rounded-md text-4xl cursor-default"
                  onClick={increaseQuantity}
                >
                  +
                </div>
              </div>
              <div className="flex flex-row mt-2">
                <div className="p-1 text-blue-700 font-bold text-lg">
                  Rating:
                </div>
                <ReactStars {...handleRating(product.rating)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ParticularProduct;
