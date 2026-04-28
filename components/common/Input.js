"use client";

import React from "react";

function Input({ name, error, placeholder, type, ...rest }) {
  return (
    <>
      <input
        {...rest}
        name={name}
        type={type}
        placeholder={placeholder}
      />
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center mx-auto w-[60%] mb-2"
          role="alert"
        >
          {error}
        </div>
      )}
    </>
  );
}

export default Input;
