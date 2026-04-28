"use client";

import React, { useEffect, useState } from "react";
import { getCartItems } from "@/services/cartService";
import { apiKey, checkout } from "@/services/paymentServices";
import Loading from "@/components/Loading/Loading";
import { APIUrl } from "@/services/link";
import { useAuth } from "@/components/AuthProvider";

const ConfirmOrder = () => {
  const shippingDetais = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("shipping")) : null;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const address = shippingDetais
    ? `${shippingDetais.address}, ${shippingDetais.city}, ${shippingDetais.country}, ${shippingDetais.pinCode}, ${shippingDetais.state}`
    : "";

  const myCart = async () => {
    await getCartItems().then((res) => {
      setItems(res.data[0].cartItems);
    });
  };

  useEffect(() => {
    myCart();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
    const {
      data: { key },
    } = await apiKey();

    const {
      data: { order },
    } = await checkout(totalAmount);

    const options = {
      key: key,
      amount: totalAmount,
      currency: "INR",
      name: "Techworld",
      description: "Test Transaction",
      image:
        "https://png.pngtree.com/element_pic/16/11/03/dda587d35b48fd01947cf38931323161.jpg",
      order_id: order.id,
      callback_url: `${APIUrl}/api/v1/payment/paymentverification`,
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: shippingDetais?.phone,
      },
      notes: {
        address: address,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex md:flex-row flex-col mt-20 w-full">
          <div className="flex flex-col w-[100%]">
            <div className="flex flex-col p-10">
              <b className="text-3xl">Shipping Info</b>
              <div className="flex flex-col p-5">
                <div className="flex flex-row">
                  <div className="text-xl p-3">Name:</div>
                  <span className="text-xl p-3">{user?.name}</span>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl p-3">Phone:</div>
                  <span className="text-xl p-3">{shippingDetais?.phone}</span>
                </div>
                <div className="flex flex-row">
                  <div className="text-xl p-3">Address:</div>
                  <span className="text-xl p-3">{address}</span>
                </div>
              </div>
              <b className="text-3xl">Your Cart Items</b>
              <div className="flex flex-col max-h-40 overflow-y-auto scrollBar">
                {items.map((cartItem) => (
                  <div
                    className="flex flex-row h-20 items-center w-full pt-2 justify-between"
                    key={cartItem._id}
                  >
                    <img
                      src={cartItem.product.images?.imgUrl}
                      alt="ProductImage"
                      className="w-10"
                    />
                    <div className="text-lg">{cartItem.product.name}</div>
                    <div className="text-lg">
                      {`${cartItem.quantity} x ${cartItem.product.price} = `}
                      <span className="font-bold pe-5">{`${
                        cartItem.quantity * cartItem.product.price
                      }`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-r-0 border-t-0 border-b-0 md:border-l border-l-0 border-solid md:w-[30%] flex flex-col items-center justify-center md:p-5 w-[90%] ms-3">
            <b className="text-3xl">Order Summery</b>
            <hr className="bg-black w-full" />
            <div className="flex flex-row justify-between w-full p-3 text-xl">
              <div>Subtotal:</div>
              <span>{subtotal}</span>
            </div>
            <div className="flex flex-row justify-between w-full p-3 text-xl">
              <div>Shipping Charges:</div>
              <span>{shippingCharge}</span>
            </div>
            <div className="flex flex-row justify-between w-full p-3 text-xl">
              <div>GST:</div>
              <span>{tax}</span>
            </div>
            <hr className="bg-black w-full" />
            <div className="flex flex-row justify-between w-full p-3 text-xl">
              <b>Total:</b>
              <span>{total}</span>
            </div>
            <button
              className="btn text-xl"
              onClick={() => handlePayment(total)}
            >
              Proceed To Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmOrder;
