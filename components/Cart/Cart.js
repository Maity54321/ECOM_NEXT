"use client";

import React, { useEffect, useRef, useState } from "react";
import { deleteItem, getCartItems } from "@/services/cartService";
import { BsFillTrash2Fill } from "react-icons/bs";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import swal from "sweetalert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { useAuth } from "@/components/AuthProvider";

const Cart = () => {
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const shopping = useRef(null);
  const router = useRouter();
  const tot = useRef(null);
  const { user } = useAuth();

  const myCart = async () => {
    try {
      await getCartItems().then((response) => {
        setItem(response.data[0].cartItems);
        setLoading(false);
      });
    } catch (error) {
      console.log(error?.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    myCart();
  }, [item.length]);

  const handleRemoveItem = (itemId) => {
    swal({
      title: "Remove from cart?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const res = await deleteItem(itemId);
        myCart();
        swal("Product has been deleted!", { icon: "success" });
      } else {
        swal({ title: "Product is safe!" });
      }
    });
  };

  const handleShopping = () => {
    router.push("/product");
  };

  const totalAmount = item.reduce((sum, it) => {
    return sum + it.product.price * it.quantity;
  }, 0);

  const handleCheckout = () => {
    router.push("/shipping");
  };

  if (!item) return null;

  if (user && item?.length !== 0) {
    return loading ? (
      <Loading />
    ) : (
      <>
        <div className="md:flex flex-row mt-24 text-2xl justify-evenly hidden">
          <div>Items</div>
          <div>Item Name</div>
          <div>Item Price</div>
          <div>Quantity</div>
          <div>Total Item Price</div>
          <div>Action</div>
        </div>

        {item.map((cartItem) => (
          <div
            className="flex flex-col w-full md:mt-0 mt-20"
            key={cartItem.product._id}
          >
            <div className="grid md:grid-cols-6 grid-cols-2 gap-4 md:gap-0 items-center text-center pt-2 pb-2 shadow-md shadow-black">
              <div className="h-56 grid place-items-center">
                <img
                  src={cartItem.product.images?.imgUrl}
                  alt="image"
                  className="md:h-46 h-36 max-w-full"
                />
              </div>
              <div className="md:text-lg font-bold text-xl md:h-auto h:56 truncation">
                {cartItem.product.name}
              </div>
              <div className="text-4xl font-bold">
                ₹ {cartItem.product.price}
              </div>
              <div>
                <div className="text-3xl font-bold md:pe-16">
                  {cartItem.quantity}
                </div>
              </div>
              <div className="text-4xl font-bold" ref={tot}>
                {cartItem.product.price * cartItem.quantity}
              </div>
              <div className="text-4xl text-red-600 cursor-pointer">
                <BsFillTrash2Fill
                  onClick={() => handleRemoveItem(cartItem._id)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-5 grid grid-cols-6 w-full place-items-end gap-5">
          <div className="text-4xl font-bold col-span-4">Total Amount:</div>
          <div className="text-4xl font-bold w-full">{totalAmount}</div>
        </div>
        <div className="md:w-11/12 w-full flex md:justify-end justify-center md:mt-0 mt-5">
          <button
            className="p-4 text-lg font-bold border border-purple-800 rounded-full bg-purple-800 text-white shadow-lg shadow-black ps-10 pe-10 duration-700 cursor-pointer"
            onMouseDown={(e) => {
              e.target.classList.add("btn-shadow-click");
              e.target.classList.remove("shadow-lg");
            }}
            onMouseUp={(e) => {
              e.target.classList.add("shadow-lg");
              e.target.classList.remove("btn-shadow-click");
            }}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
        <div className="flex w-full md:justify-start justify-center">
          <div
            className="btn-shadow"
            ref={shopping}
            onMouseDown={(e) => {
              e.target.classList.add("btn-shadow-click");
            }}
            onMouseUp={(e) => {
              e.target.classList.remove("btn-shadow-click");
            }}
            onClick={handleShopping}
          >
            Continue Shopping
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col md:min-h-[500px] min-h-screen justify-center items-center">
            <MdOutlineRemoveShoppingCart size={100} color="purple" />
            <h2 className="font-roboto">No Items Added to the Cart</h2>
            <Link href="/product">
              <button className="p-3 border border-solid border-purple-800 w-full text-center font-bold text-xl rounded-full duration-700 bg-purple-800 text-white cursor-pointer hover:bg-white hover:text-purple-800 no-underline">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </>
    );
  }
};

export default Cart;
