"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance"; // Adjust path if needed

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/v1/users/admin/login/", formData);
      const { access, refresh, user } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("adminUser", JSON.stringify(user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => router.push("/admin/dashboard"), 1200);
    } catch (error) {
      const errMsg =
        error?.response?.data?.detail || "Invalid credentials or not an admin.";
      setMessage(`Error: ${errMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16 font-monument-ultralight">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-monument-regular text-gray-800 tracking-[0.2em] uppercase">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm tracking-wider uppercase mt-2">
            Sign in with your admin credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2"
            >
              Email
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg tracking-wider text-sm focus:ring-2 focus:ring-black outline-none border-none"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-monument-regular text-gray-500 tracking-widest uppercase mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-lg tracking-wider text-sm focus:ring-2 focus:ring-black outline-none border-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white font-monument-regular tracking-widest text-xs hover:bg-gray-800 transition-colors !mt-8"
          >
            LOGIN AS ADMIN
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 text-sm text-center py-3 px-4 rounded-lg tracking-wider ${
              message.includes("successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-sm tracking-wider text-gray-600">
          Not an admin?{" "}
          <a href="/login" className="font-monument-regular text-black hover:underline">
            Login as user
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
