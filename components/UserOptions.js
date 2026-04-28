"use client";

import React, { useEffect, useState } from "react";
import { SpeedDial, SpeedDialAction, Backdrop } from "@mui/material";
import { RiDashboard2Fill } from "react-icons/ri";
import { ImExit, ImList2 } from "react-icons/im";
import { BsFillPersonFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { getCartItems } from "@/services/cartService";
import { useRouter } from "next/navigation";

const UserOptions = ({ user, handleLogout }) => {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  const options = [
    { icon: <BsFillPersonFill />, name: "Account", func: account },
    { icon: <ImList2 />, name: "Orders", func: orders },
    { icon: <ImExit />, name: "Logout", func: handleLogout },
    {
      icon: (
        <FaShoppingCart
          style={{ color: cartItems.length > 0 ? "purple" : "" }}
        />
      ),
      name: `Cart (${cartItems.length})`,
      func: cart,
    },
  ];

  const myCart = async () => {
    try {
      await getCartItems().then((response) => {
        setCartItems(response.data[0].cartItems);
      });
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  useEffect(() => {
    myCart();
  }, [open]);

  if (user?.isAdmin) {
    options.unshift({
      icon: <RiDashboard2Fill />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function account() {
    router.push("/account");
  }
  function cart() {
    router.push("/cart");
  }
  function dashboard() {
    router.push("/account");
  }
  function orders() {
    router.push("/orders");
  }

  return (
    <div>
      <Backdrop open={open} style={{ zIndex: 10 }} />
      <SpeedDial
        ariaLabel="myDial"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        icon={
          <img
            src={user?.image?.url}
            className="w-10 h-10 rounded-full"
            alt="user"
          />
        }
        direction="down"
        style={{ zIndex: 11 }}
        className="fixed top-3 right-3"
        FabProps={{ size: "small" }}
      >
        {options.map((item) => (
          <SpeedDialAction
            icon={item.icon}
            tooltipOpen={
              typeof window !== "undefined" && window.innerWidth < 600
                ? true
                : false
            }
            tooltipTitle={item.name}
            onClick={item.func}
            key={item.name}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default UserOptions;
