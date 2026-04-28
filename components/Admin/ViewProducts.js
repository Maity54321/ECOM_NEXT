"use client";

import React, { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "@/services/productService";
import { BiSearchAlt } from "react-icons/bi";
import { RiFileEditFill } from "react-icons/ri";
import { BsFillTrash2Fill } from "react-icons/bs";
import Link from "next/link";
import swal from "sweetalert";
import Navbars from "./Navbars";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const res = async () => {
      try {
        const products = await getProducts();
        setProducts(products.data);
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    res();
  }, []);

  const search = (e) => {
    setSearchInput(e.target.value);
    const newArr = products.filter((item) => {
      if (
        item.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 &&
        item.name.toLowerCase().includes(searchInput.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
    setProducts(newArr);
  };

  const productDelete = async (id) => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        try {
          deleteProduct(id);
          const updatedProducts = products.filter((item) => item._id !== id);
          setProducts(updatedProducts);
        } catch (error) {
          console.log(error?.response?.data);
        }
        swal("Product has been deleted!", { icon: "success" });
      } else {
        swal({ title: "Product is safe!" });
      }
    });
  };

  return (
    <Navbars>
      <div className="flex flex-row justify-center items-center p-3">
        <div className="flex flex-row justify-center items-center bg-purple-700 p-1 rounded-xl">
          <div className="bg-fixed ms-5">
            <BiSearchAlt size={25} color="white" />
          </div>
          <input
            type="text"
            className="p-2 border-none outline-none rounded-lg w-full font-cursive text-lg bg-transparent text-white placeholder-white"
            placeholder={"Search"}
            onChange={search}
            value={searchInput}
          />
        </div>
      </div>
      <div className="flex flex-row border border-solid justify-evenly text-center p-3 md:text-xl font-bold">
        <div className="w-full">Product Name</div>
        <div className="w-full">Product Id</div>
        <div className="w-full">Stock</div>
        <div className="w-full">Action</div>
      </div>
      {products.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-4 text-center border border-solid justify-center items-center"
        >
          <div className="p-2 text-lg">{item.name}</div>
          <div className="p-2 md:text-lg break-words">{item._id}</div>
          <div className="p-2 text-lg">{item.stock}</div>
          <div className="p-2 text-xl flex flex-row justify-evenly">
            <Link
              href={`/account/updateproduct/${item._id}`}
              className="cursor-pointer text-purple-700"
            >
              <RiFileEditFill />
            </Link>
            <div
              className="cursor-pointer text-red-600"
              onClick={() => productDelete(item._id)}
            >
              <BsFillTrash2Fill />
            </div>
          </div>
        </div>
      ))}
    </Navbars>
  );
};

export default ViewProducts;
