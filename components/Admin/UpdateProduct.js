"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/common/Input";
import {
  getParticularProduct,
  updateProduct,
} from "@/services/productService";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import Navbars from "./Navbars";

function UpdateProduct() {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const updateProductSchema = {
    name: Joi.string().required().label("Product Name"),
    description: Joi.string().required().label("Product Description"),
    price: Joi.string().required().label("Product Price"),
    category: Joi.string()
      .regex(/^[a-z A-Z]*$/)
      .required()
      .label("Category"),
    stock: Joi.string().required().default(1).label("Stock"),
  };

  useEffect(() => {
    const upData = async () => {
      try {
        await getParticularProduct(id).then((res) => {
          setProduct(viewModel(res.data.product));
        });
      } catch (error) {
        console.log(error?.response?.data);
      }
    };
    upData();
  }, [id]);

  const validateProperty = ({ name, value }) => {
    const obj = { name: value };
    const schema = { name: updateProductSchema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setImages(e.target.files[0]);
    } else {
      const errorMessage = validateProperty(e.target);
      if (errorMessage) {
        setErrors({ ...errors, [e.target.name]: errorMessage });
      } else {
        const newErrors = { ...errors };
        delete newErrors[e.target.name];
        setErrors(newErrors);
      }
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const viewModel = (product) => {
    return {
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    };
  };

  const renderInput = (inputName, type, placeholder) => {
    return (
      <Input
        name={inputName}
        placeholder={placeholder}
        type={type}
        value={product[inputName]}
        onChange={handleChange}
        error={errors[inputName]}
      />
    );
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(product);
      toast.success("Product Updated Successfully", { theme: "colored" });
      router.push("/account/viewproducts");
    } catch (error) {
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbars>
      <div className="min-h-screen py-10 px-4 flex justify-center items-start bg-gray-50 font-roboto">
        <form
          onSubmit={handleUpdateProduct}
          className="w-full max-w-3xl flex flex-col items-center bg-white shadow-2xl shadow-purple-900/5 p-8 md:p-12 rounded-3xl border border-gray-100 [&_input]:w-full [&_input]:p-4 [&_input]:border [&_input]:border-gray-200 [&_input]:rounded-xl [&_input]:focus:ring-2 [&_input]:focus:ring-purple-500 [&_input]:focus:border-transparent [&_input]:outline-none [&_input]:transition-all [&_input]:bg-gray-50/50 hover:[&_input]:bg-gray-50 [&_input]:text-gray-800"
        >
          <div className="w-full text-center mb-10">
             <h2 className="text-3xl font-bold text-gray-800">Update Product</h2>
             <p className="text-gray-500 mt-2">Modify the details below to update the item</p>
          </div>

          <div className="w-full mb-6 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
            {renderInput("name", "text", "e.g. iPhone 15 Pro")}
          </div>

          <div className="w-full mb-6 relative">
             <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
             <textarea
               onChange={handleChange}
               className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 resize-none text-gray-800 bg-gray-50/50 hover:bg-gray-50"
               name="description"
               rows="5"
               placeholder="Write a detailed description of the product..."
               value={product.description}
             ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
            <div className="w-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price ($)</label>
              {renderInput("price", "text", "0.00")}
            </div>
            <div className="w-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
              {renderInput("category", "text", "e.g. Electronics")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
            <div className="w-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Stock Quantity</label>
              {renderInput("stock", "number", "0")}
            </div>
            <div className="w-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50 flex items-center justify-center hover:border-purple-500 transition-colors [&_input]:border-none [&_input]:shadow-none [&_input]:bg-transparent [&_input]:p-2 cursor-pointer">
                 {renderInput("image", "file", "Product Image")}
              </div>
            </div>
          </div>

          <button
            className="w-full md:w-2/3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-purple-500/40 transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex justify-center items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </Navbars>
  );
}

export default UpdateProduct;
