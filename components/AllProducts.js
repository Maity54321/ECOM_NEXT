"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import { useParams } from "next/navigation";
import Records from "@/components/Home/Records";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Loading from "@/components/Loading/Loading";

const categories = ["All", "Mobiles", "Monitors", "Laptops"];

const AllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [price, setPrice] = useState([0, 99999]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = allProducts.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const params = useParams();
  const keyword = params?.keyword;

  const products = async () => {
    try {
      const result = await getProducts(keyword, price, category);
      setAllProducts(result.data);
      setLoading(false);
    } catch (error) {
      // console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 1366) {
      setRecordsPerPage(12);
    }
    products();
    window.scrollTo(0, 0);
  }, [keyword, price, category]);

  const handleCategory = (cat) => {
    cat === category || category === "" ? setLoading(false) : setLoading(true);
    setCurrentPage(1);
    if (cat === "All") return setCategory("");
    setCategory(cat);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex md:flex-row flex-col mb-20">
          <div className="border border-solid border-gray-400 mt-24 md:w-64 w-full h-96 z-[1] md:block hidden">
            <Typography align="center" variant="h6">
              Price
            </Typography>
            <div className="w-5/6 ms-auto me-auto">
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={99999}
                color="secondary"
              />
            </div>

            <Typography align="center" variant="h6">
              Categories
            </Typography>
            <ul>
              {categories.map((item, index) => (
                <li
                  className="list-none pt-1 cursor-pointer duration-500 text-gray-500 hover:text-purple-800"
                  key={index}
                  onClick={() => handleCategory(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 mt-16 px-4">
              <Records data={currentRecords} />
            </div>
            <div className="w-full flex justify-center items-center mt-8">
              {recordsPerPage < allProducts.length && (
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={recordsPerPage}
                  totalItemsCount={allProducts.length}
                  onChange={setCurrentPage}
                  nextPageText={"Next"}
                  prevPageText={"Prev"}
                  firstPageText={"1st"}
                  lastPageText={"Last"}
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
