"use client";
import axios from "axios";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useState } from "react";
import React from "react";

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>("nothing");
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout.");
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");
      console.log("User details:", response.data);
      setUser(response.data.user); // stores full user object with _id
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>{" "}
      <hr className="w-full mb-4" />
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p className="text-gray-600 mb-4">Welcome to your profile page!</p>
      {user === "nothing" ? (
        <p className="text-gray-600 mb-4">Nothing to show</p>
      ) : (
        <h2>
          <Link href={`/profile/${user._id}`}>
            {" "}
            {/* ✅ links to /profile/[id] */}
            {user._id}
          </Link>
        </h2>
      )}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={logout}
      >
        {" "}
        Logout
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-4 mt-4"
        onClick={getUserDetails}
      >
        {" "}
        Get User Details
      </button>
      <hr />
    </div>
  );
}
