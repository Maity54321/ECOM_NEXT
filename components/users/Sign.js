"use client";

import React, { useState } from "react";
import Joi from "joi-browser";
import { loginUser, registerUser } from "@/services/authService";
import { toast } from "react-toastify";
import Account from "./Account";
import { decodeToken } from "react-jwt";
import Navbars from "@/components/Admin/Navbars";
import Input from "@/components/common/Input";
import { useAuth } from "@/components/AuthProvider";

function Sign() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const [regData, setRegData] = useState({ email: "", password: "", name: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [btnVal, setBtnVal] = useState({ signUp: "Register", logIn: "Log In" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  const regSchema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).required().label("Password"),
    name: Joi.string()
      .regex(/^[a-z A-Z]*$/)
      .required()
      .label("Name"),
  };

  const loginSchema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const regValidate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(regData, regSchema, options);
    if (!error) return null;
    const errs = {};
    for (let item of error.details) errs[item.path[0]] = item.message;
    return errs;
  };

  const logValidate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(loginData, loginSchema, options);
    if (!error) return null;
    const errs = {};
    for (let item of error.details) errs[item.path[0]] = item.message;
    return errs;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: regSchema[name] || loginSchema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  const handleChangeRegister = ({ currentTarget: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) {
      newErrors[input.name] = errorMessage;
    } else {
      delete newErrors[input.name];
    }
    setRegData({ ...regData, [input.name]: input.value });
    setErrors(newErrors);
  };

  const handleChangeLogin = ({ currentTarget: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) {
      newErrors[input.name] = errorMessage;
    } else {
      delete newErrors[input.name];
    }
    setLoginData({ ...loginData, [input.name]: input.value });
    setErrors(newErrors);
  };

  const registerSubmit = async () => {
    setLoading(true);
    const myForm = new FormData();
    myForm.append("email", regData.email);
    myForm.append("password", regData.password);
    myForm.append("name", regData.name);
    myForm.append("images", image);
    try {
      const res = await registerUser(myForm);
      if (res) {
        setLoading(false);
      }
      toast.success("Registered Successfully", { theme: "colored" });
    } catch (error) {
      setBtnVal({ ...btnVal, signUp: "Register" });
      setLoading(false);
      toast.error(error?.response?.data, { theme: "colored" });
    }
  };

  const loginSubmit = async () => {
    try {
      setLoading(true);
      await loginUser(loginData).then((response) => {
        localStorage.setItem("token", response.data);
        setLoading(false);
        login(response.data);
        window.history.back();
      });
    } catch (error) {
      setBtnVal({ ...btnVal, logIn: "Log In" });
      setLoading(false);
      toast.error(error?.response?.data);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errs = regValidate();
    setErrors(errs || {});
    if (errs) return;
    registerSubmit();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errs = logValidate();
    setErrors(errs || {});
    if (errs) return;
    loginSubmit();
  };

  const renderRegInput = (name, type, placeholder) => (
    <Input
      name={name}
      placeholder={placeholder}
      type={type}
      value={regData[name]}
      onChange={handleChangeRegister}
      error={errors[name]}
    />
  );

  const renderLoginInput = (name, type, placeholder) => (
    <Input
      name={name}
      placeholder={placeholder}
      type={type}
      value={loginData[name]}
      onChange={handleChangeLogin}
      error={errors[name]}
    />
  );

  // If logged in, show account or admin
  if (isAuthenticated && user) {
    if (user?.isAdmin) {
      return (
        <Navbars>
          <Account userProfile={user} logout={logout} />
        </Navbars>
      );
    } else {
      return <Account userProfile={user} logout={logout} />;
    }
  }

  return (
    <div className="logSign">
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <div className="w-full relative">
              {renderLoginInput("email", "email", "Email")}
            </div>
            <div className="w-full relative">
              {renderLoginInput("password", "password", "Password")}
            </div>
            <button className="cBtn" type="submit" disabled={logValidate()}>
              {loading ? (
                <span className="flex ml-20 justify-center items-center loadingBtn"></span>
              ) : (
                btnVal.logIn
              )}
            </button>
          </form>
        </div>
        <div className="login">
          <form onSubmit={handleRegisterSubmit}>
            <label htmlFor="chk" aria-hidden="true">
              Sign Up
            </label>
            <div className="w-full relative">
              {renderRegInput("email", "email", "Email")}
            </div>
            <div className="w-full relative">
              {renderRegInput("password", "password", "Password")}
            </div>
            <div className="w-full relative">
              {renderRegInput("name", "text", "Enter Your Name")}
            </div>
            <input type="file" name="image" onChange={onFileChange} />
            <button className="cBtn" type="submit">
              {loading ? (
                <span className="flex ml-20 justify-center items-center loadingBtn"></span>
              ) : (
                btnVal.signUp
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sign;
