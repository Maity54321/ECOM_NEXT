"use client";

import React from "react";
import { FiTruck, FiCheckCircle, FiCreditCard } from "react-icons/fi";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    { label: "Shipping", icon: <FiTruck /> },
    { label: "Confirm", icon: <FiCheckCircle /> },
    { label: "Payment", icon: <FiCreditCard /> },
  ];

  return (
    <div className="flex items-center justify-between w-full mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
              index <= activeStep 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
                : "bg-slate-100 text-slate-400"
            }`}>
              {step.icon}
            </div>
            <span className={`absolute -bottom-7 text-xs font-semibold whitespace-nowrap ${
              index <= activeStep ? "text-purple-600" : "text-slate-400"
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
              index < activeStep ? "bg-purple-600" : "bg-slate-100"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
