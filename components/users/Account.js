"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { deleteUser } from "@/services/user.service";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaTrash,
  FaShoppingBag,
  FaEdit,
  FaShieldAlt,
  FaUserCircle
} from "react-icons/fa";

function Account({ userProfile, logout }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const deleteAccount = async (id) => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser(id);
        logout();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header Section with Profile Cover */}
        <div className="relative mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-[#6E35AE] to-[#a855f7] rounded-3xl shadow-lg"></div>
          <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
            <div className="relative group">
              <div className="h-32 w-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                {userProfile?.image?.url ? (
                  <img
                    src={userProfile.image.url}
                    alt={userProfile.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-purple-50 text-[#6E35AE]">
                    <FaUserCircle size={80} />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 pb-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {userProfile?.name}
              </h1>
              <p className="text-gray-500 font-medium">Customer Account</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          {/* Sidebar / Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="mr-2 text-[#6E35AE]" /> Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/me/update")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#6E35AE] text-white rounded-2xl font-semibold hover:bg-[#5a2b8f] transition-all duration-300 shadow-md shadow-purple-100 active:scale-95"
                >
                  <FaEdit className="mr-2" /> Update Profile
                </button>
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-white text-[#6E35AE] border-2 border-[#6E35AE] rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-300 active:scale-95"
                >
                  <FaShoppingBag className="mr-2" /> View My Orders
                </button>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-3">Danger Zone</h3>
              <p className="text-xs text-red-600 mb-4">Deleting your account will remove all your data permanently.</p>
              <button
                onClick={() => deleteAccount(userProfile?._id)}
                className="w-full flex items-center justify-center px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <FaTrash className="mr-2" /> Delete Account
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-4">
                    <FaUser size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-gray-900 font-semibold mt-1">{userProfile?.name}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-purple-50 text-[#6E35AE] rounded-xl mr-4">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-900 font-semibold mt-1 truncate max-w-[180px]">{userProfile?.email}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl mr-4">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joined On</p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl mr-4">
                    <FaShieldAlt size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</p>
                    <p className="text-gray-900 font-semibold mt-1">Verified Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Section - Placeholder for Recent Activity or similar */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-purple-50 text-[#6E35AE] rounded-full flex items-center justify-center mb-4">
                <FaShoppingBag size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Ready to shop?</h4>
              <p className="text-gray-500 mt-2 max-w-sm">Check out our latest products and exclusive deals just for you.</p>
              <button
                onClick={() => router.push("/product")}
                className="mt-6 text-[#6E35AE] font-bold hover:underline"
              >
                Go to Shop →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;

