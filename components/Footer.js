"use client";

import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { RiInstagramFill, RiLinkedinFill } from "react-icons/ri";

function Footer() {
  return (
    <footer className="mt-10 pt-5 pb-5 bg-slate-800">
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center flex flex-col">
          <div className="text-white text-[1.8vmax] text-center font-roboto">
            Follow me on Social Media
          </div>
          <div className="flex flex-row justify-center gap-3 mt-2">
            <a
              href="https://www.facebook.com/surodoy.maity.5"
              target="_"
              className="text-white fa-2xl hover:text-purple-700 duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/surodoymaity/"
              target="_"
              className="text-white fa-2xl hover:text-purple-700 duration-300"
            >
              <RiInstagramFill />
            </a>
            <a
              href="https://www.linkedin.com/in/surodoy-maiti-980706212/"
              target="_"
              className="text-white fa-2xl hover:text-purple-700 duration-300"
            >
              <RiLinkedinFill />
            </a>
          </div>
        </div>
        <div className="flex flex-row text-center font-cursive justify-center items-center text-white text-[2.3vmax]">
          Developed By @Maity
        </div>
        <div className="flex flex-row font-roboto text-center justify-center items-center text-white text-[2.5vmax]">
          Copyright &copy; 2023
        </div>
      </div>
    </footer>
  );
}

export default Footer;
