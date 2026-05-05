"use client";

import React, { useState, useEffect } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiUser, FiShield, FiUserPlus, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import { getAllUsers, updateUserRole, deleteUser } from "@/services/user.service";
import Loading from "@/components/Loading/Loading";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            // Adjusting for common API response patterns
            const userData = response.data.users || response.data || [];
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users");
            // Use mock data as fallback if API fails during development
            setUsers([
                { _id: "1", name: "Mock User", email: "mock@example.com", role: "user", createdAt: new Date().toISOString() }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (userId, isAdmin) => {
        const newRole = isAdmin === false ? "admin" : "user";
        try {
            const response = await updateUserRole(userId, newRole);
            if (response.status === 200 || response.data.success) {
                toast.success(`Role updated to ${newRole}`);
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isAdmin: !isAdmin } : user
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                const response = await deleteUser(userId);
                if (response.status === 200 || response.data.success) {
                    toast.success("User deleted successfully");
                    setUsers(users.filter(user => user._id !== userId));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete user");
            }
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === "All Roles" || user.role === roleFilter.toLowerCase();

        return matchesSearch && matchesRole;
    });

    const stats = [
        { title: "Total Users", value: users.length, icon: FiUsers, color: "bg-blue-50 text-blue-600" },
        { title: "Admins", value: users.filter(u => u.isAdmin === true).length, icon: FiShield, color: "bg-purple-50 text-purple-600" },
        { title: "Regular Users", value: users.filter(u => u.isAdmin === false).length, icon: FiUser, color: "bg-green-50 text-green-600" },
    ];

    if (loading && users.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50/50">
                <Loading />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your platform's users and their roles</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 active:scale-95 opacity-50 cursor-not-allowed">
                    <FiUserPlus size={20} />
                    <span>Add New User</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all duration-300">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon size={26} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-600/20 transition-all font-medium text-gray-900"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>User</option>
                        </select>
                    </div>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">User</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Role</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Joined Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-black text-lg">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{user.name}</p>
                                                <p className="text-sm font-medium text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${user.isAdmin === true
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {user.isAdmin === true ? <FiShield size={12} /> : <FiUser size={12} />}
                                            {user.isAdmin === true ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleRole(user._id, user.isAdmin)}
                                                className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                                title="Toggle Role"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete User"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {!loading && filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No users found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-400">Showing {filteredUsers.length} of {users.length} users</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => fetchUsers()}
                            className="px-4 py-2 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
