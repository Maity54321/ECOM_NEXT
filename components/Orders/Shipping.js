"use client";

import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { 
  FiHome, 
  FiMapPin, 
  FiPhone, 
  FiTruck, 
  FiCheckCircle, 
  FiCreditCard,
  FiMap,
  FiFlag
} from "react-icons/fi";
import CheckoutSteps from "@/components/common/CheckoutSteps";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    pinCode: "",
    phone: "",
    country: "",
    state: "",
  });
  const { address, city, pinCode, phone, country, state } = shippingInfo;
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const shippingSchema = {
    address: Joi.string().required().label("Address"),
    city: Joi.string().required().label("City"),
    pinCode: Joi.number().required().min(100000).max(999999).label("Pin Code").error(errors => {
      errors.forEach((err) => {
        switch (err.type) {
          case "number.min":
          case "number.max":
            err.message = "Pin must be exactly 6 digits";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    phone: Joi.number().required().min(1000000000).max(9999999999).label("Phone Number").error(errors => {
      errors.forEach((err) => {
        switch (err.type) {
          case "number.min":
          case "number.max":
            err.message = "Phone number must be 10 digits";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    country: Joi.string().required().label("Country"),
    state: Joi.string().required().label("State"),
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: shippingSchema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateProperty({ name, value });
    
    if (errorMessage) {
      setErrors({ ...errors, [name]: errorMessage });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    const result = Joi.validate(shippingInfo, shippingSchema, { abortEarly: false });
    if (result.error) {
      const newErrors = {};
      result.error.details.forEach(detail => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      toast.error("Please fill all details correctly", { theme: "colored" });
      return;
    }

    localStorage.setItem("shipping", JSON.stringify(shippingInfo));
    router.push("/order/confirm");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/account");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            <CheckoutSteps activeStep={0} />

            <div className="mb-10 text-center mt-6">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Shipping Details</h1>
              <p className="mt-2 text-sm text-slate-500">Please enter your accurate delivery information</p>
            </div>

            <form onSubmit={handleContinue} className="space-y-6">
              {/* Address Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiHome size={18} />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-purple-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:border-purple-600 transition-all`}
                  value={address}
                  onChange={handleChange}
                />
                {errors.address && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* City Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FiMapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.city ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 transition-all`}
                    value={city}
                    onChange={handleChange}
                  />
                  {errors.city && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.city}</p>}
                </div>

                {/* Pin Code Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FiMap size={18} />
                  </div>
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="Pin Code"
                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.pinCode ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 transition-all`}
                    value={pinCode}
                    onChange={handleChange}
                  />
                  {errors.pinCode && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.pinCode}</p>}
                </div>
              </div>

              {/* Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiPhone size={18} />
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 transition-all`}
                  value={phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.phone}</p>}
              </div>

              {/* Country Selection */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiFlag size={18} />
                </div>
                <select
                  name="country"
                  className={`block w-full pl-11 pr-10 py-3.5 bg-slate-50 border ${errors.country ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 transition-all`}
                  value={country}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  {Country.getAllCountries().map((item) => (
                    <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
                {errors.country && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.country}</p>}
              </div>

              {/* State Selection */}
              {country && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FiMap size={18} />
                  </div>
                  <select
                    name="state"
                    className={`block w-full pl-11 pr-10 py-3.5 bg-slate-50 border ${errors.state ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-600 transition-all`}
                    value={state}
                    onChange={handleChange}
                  >
                    <option value="">Select State</option>
                    {State.getStatesOfCountry(country).map((item) => (
                      <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                  {errors.state && <p className="mt-1.5 text-xs text-red-500 font-medium ml-2">{errors.state}</p>}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all transform hover:-translate-y-0.5 mt-4"
              >
                Continue to Order Confirmation
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
