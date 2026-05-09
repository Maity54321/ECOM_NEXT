"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/common/Input";
import { createProduct, getFilterConfig } from "@/services/productService";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import Navbars from "./Navbars";
import { useEffect, useRef } from "react";

function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getFilterConfig();
        setCategories(result.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const productSchema = {
    name: Joi.string().required().label("Product Name"),
    description: Joi.string().required().label("Product Description"),
    price: Joi.number().required().label("Product Price"),
    category: Joi.string()
      .regex(/^[a-z A-Z]*$/)
      .required()
      .label("Category"),
    stock: Joi.number().required().default(1).label("Stock"),
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: productSchema[name] };
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
      if (e.target.name === "category") {
        setShowDropdown(true);
      }
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setProduct({ ...product, category: selectedCategory });
    setShowDropdown(false);
    setActiveIndex(-1);
    // Clear error if selection is valid
    const newErrors = { ...errors };
    delete newErrors.category;
    setErrors(newErrors);
  };

  const handleKeyDown = (e) => {
    const filtered = categories.filter(cat =>
      cat.toLowerCase().includes(product.category.toLowerCase())
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        handleCategorySelect(filtered[activeIndex]);
      } else {
        setShowDropdown(false);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const productValidate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(product, productSchema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const validationErrors = productValidate();
    setErrors(validationErrors || {});
    if (validationErrors) return;

    setLoading(true);
    const myForm = new FormData();
    myForm.set("name", product.name);
    myForm.set("description", product.description);
    myForm.set("price", product.price);
    myForm.set("productImage", images);
    myForm.set("category", product.category);
    myForm.set("stock", product.stock);

    try {
      await createProduct(myForm);
      toast.success("Product Created Successfully", { theme: "colored" });
      router.push("/account/viewproducts");
    } catch (error) {
      toast.error(error.response?.data || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (inputName, type, placeholder, extraProps = {}) => {
    return (
      <Input
        name={inputName}
        placeholder={placeholder}
        type={type}
        value={product[inputName]}
        onChange={handleChange}
        error={errors[inputName]}
        {...extraProps}
      />
    );
  };

  return (
    <Navbars>
      <div className="min-h-screen py-6 md:py-10 px-4 flex justify-center items-start bg-gray-50/50 font-sans">
        <form
          onSubmit={handleCreateProduct}
          className="w-full max-w-3xl flex flex-col items-center bg-white shadow-xl shadow-gray-200/50 p-6 md:p-12 rounded-[2.5rem] border border-gray-100 [&_input]:w-full [&_input]:p-4 [&_input]:border [&_input]:border-gray-100 [&_input]:rounded-2xl [&_input]:focus:ring-4 [&_input]:focus:ring-purple-500/10 [&_input]:focus:border-purple-500 [&_input]:outline-none [&_input]:transition-all [&_input]:bg-gray-50/50 hover:[&_input]:bg-gray-50 [&_input]:text-gray-900 [&_input]:font-medium"
        >
          <div className="w-full text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Add New Product</h2>
            <p className="text-gray-500 font-medium mt-2">Fill in the details below to publish a new item</p>
          </div>

          <div className="w-full mb-6 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
            {renderInput("name", "text", "e.g. iPhone 15 Pro")}
          </div>

          <div className="w-full mb-6 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
            <textarea
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-200 resize-none text-gray-800 bg-gray-50/50 hover:bg-gray-50"
              name="description"
              rows="5"
              placeholder="Write a detailed description of the product..."
              value={product.description}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
            <div className="w-full relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Price ($)</label>
              {renderInput("price", "number", "0.00")}
            </div>
            <div className="w-full relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
              <div className="relative">
                {renderInput("category", "text", "e.g. Electronics", {
                  onFocus: () => setShowDropdown(true),
                  onKeyDown: handleKeyDown
                })}

                {showDropdown && categories.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-purple-900/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {categories
                        .filter(cat =>
                          cat.toLowerCase().includes(product.category.toLowerCase())
                        )
                        .map((cat, index) => (
                          <div
                            key={index}
                            onClick={() => handleCategorySelect(cat)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`px-5 py-3 cursor-pointer transition-colors flex items-center justify-between group ${activeIndex === index ? "bg-purple-100" : "hover:bg-purple-50"
                              }`}
                          >
                            <span className={`font-medium ${activeIndex === index ? "text-purple-700" : "text-gray-700 group-hover:text-purple-700"
                              }`}>{cat}</span>
                            <div className={`w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center transition-opacity ${activeIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                              }`}>
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      {categories.filter(cat => cat.toLowerCase().includes(product.category.toLowerCase())).length === 0 && (
                        <div className="px-5 py-4 text-gray-400 text-sm italic">
                          No matching categories. Press enter to create "{product.category}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                Publishing...
              </>
            ) : (
              "Publish Product"
            )}
          </button>
        </form>
      </div>
    </Navbars>
  );
}

export default CreateProduct;
