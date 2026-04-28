"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { deleteUser } from "@/services/profileService";

function Account({ userProfile, logout }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const deleteAccount = async (id) => {
    await deleteUser(id).then((res) => {
      console.log(res.data);
    });
    logout();
  };

  return (
    <>
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="flex md:flex-row flex-col border border-solid w-screen items-center min-h-screen">
          <div className="flex flex-col items-center">
            <img
              src={userProfile?.image?.url}
              alt="Profile Pic"
              className="md:w-[25rem] md:ms-10 mt-10 mb-5 w-[20rem] border border-solid md:h-96 h-80 rounded-full"
            />
            <button className="cursor-pointer w-72 p-2 text-lg bg-purple-800 text-white hover:bg-purple-600 duration-500 mb-2">
              Update Profile
            </button>
          </div>
          <div className="flex w-full items-center justify-center md:m-20">
            <div className="flex flex-col text-center md:text-left justify-evenly h-full w-max">
              <div>
                <h4>Full Name:</h4>
                <p className="text-xl">{userProfile?.name}</p>
              </div>
              <div>
                <h4>Email:</h4>
                <p className="text-xl">{userProfile?.email}</p>
              </div>
              <div>
                <h4>Joined On:</h4>
                <p className="text-xl">
                  {String(userProfile?.createdAt || "").substring(0, 10)}
                </p>
              </div>
              <button
                className="cursor-pointer w-72 p-2 text-lg bg-purple-800 text-white hover:bg-purple-600 duration-500 mb-2"
                onClick={() => router.push("/orders")}
              >
                My Orders
              </button>
              <button
                className="cursor-pointer w-72 p-2 text-lg bg-purple-800 text-white hover:bg-red-600 duration-500"
                onClick={() => deleteAccount(userProfile?._id)}
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
