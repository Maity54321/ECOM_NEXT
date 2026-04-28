"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import Records from "./Records";
import Loading from "@/components/Loading/Loading";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recordsPerPage, setRecordsPerPage] = useState(8);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);

  const getAllProducts = async () => {
    const res = await getProducts();
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 1366) {
      setRecordsPerPage(12);
    }
    getAllProducts();
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6 px-4 md:px-8 w-full mb-20">
          <Records data={currentRecords} />
        </div>
      )}
    </>
  );
};

export default Product;
