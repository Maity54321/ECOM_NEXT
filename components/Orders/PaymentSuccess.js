"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearCart, getCartItems } from "@/services/cartService";
import { myOrder } from "@/services/orderService";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("reference");
  const shippingInfo = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("shipping")) : null;
  const [cart, setCart] = useState([]);
  const router = useRouter();

  const paymentInfo = {
    id: payment_id,
    status: "success",
  };

  const myCart = async () => {
    await getCartItems().then((res) => {
      setCart(res.data[0].cartItems);
    });
  };

  let subtotal = 0;
  if (cart.length !== 0) {
    subtotal = cart.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }
  const shippingCharge = subtotal >= 10000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCharge + tax;

  useEffect(() => {
    myCart();
  }, []);

  const order = {
    shippingInfo,
    orderItems: cart,
    paymentInfo,
    itemsPrice: subtotal,
    taxPrice: tax,
    shippingPrice: shippingCharge,
    totalPrice: total,
  };

  const createOrder = async (order) => {
    await myOrder(order).then((res) => {
      console.log(res.data);
    });
  };

  useEffect(() => {
    if (cart.length !== 0) {
      createOrder(order);
      setTimeout(() => {
        clearCart();
        router.push("/orders");
      }, 3000);
    }
  }, [cart]);

  return (
    <div>
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="flex flex-col items-center">
          <h1>Payment Successful</h1>
          <div>Payment Id: {payment_id}</div>
          <div className="mt-10">Redirecting to Orders...</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
