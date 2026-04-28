"use client";

import React, { useEffect, useState } from "react";
import { myAllOrders } from "@/services/orderService";
import { TfiNewWindow } from "react-icons/tfi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";

const MyOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const myOrders = async () => {
    myAllOrders().then((res) => {
      setUserOrders(res.data.orders);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/account");
      return;
    }
    myOrders();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container flex flex-col items-center h-screen md:mt-0 mt-20 md:w-full w-max">
          <div className="flex md:flex-row md:w-5/6 md:justify-evenly md:items-center text-xl h-max bg-purple-800 text-white text-center w-full">
            <div className="md:w-full w-[60vw]">Order Id</div>
            <div className="md:w-full w-[50vw]">Status</div>
            <div className="md:w-full w-[50vw]">Items quantity</div>
            <div className="md:w-full w-[50vw]">Amount</div>
            <div className="md:w-full w-[50vw]">Actions</div>
          </div>
          <div className="flex flex-col md:w-5/6">
            {userOrders.map((item) => (
              <div
                className="flex md:flex-row md:justify-evenly text-center text-xl even:bg-slate-500"
                key={item._id}
              >
                <div className="md:w-full w-[60vw]">{item._id}</div>
                <div
                  className={`md:w-full w-[50vw] ${item.orderStatus === "Processing"
                      ? "text-red-600"
                      : "text-green-600"
                    }`}
                >
                  {item.orderStatus}
                </div>
                <div className="md:w-full w-[50vw]">
                  {item.orderItems.length}
                </div>
                <div className="md:w-full w-[50vw]">{item.totalPrice}</div>
                <Link
                  href={`/orderdetais/${item._id}`}
                  className="md:w-full w-[50vw] text-black hover:text-purple-600"
                >
                  <TfiNewWindow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
