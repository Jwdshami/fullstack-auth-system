"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [buttondisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/users/login", {
        email: user.email,
        password: user.password,
      });

      if (response.status === 200) {
        // Login successful, redirect to the home page or dashboard
        toast.success("Login successful!");
        router.push("/profile");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(
        error?.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">{loading ? "Logging in..." : "Login"}</h1>
      <hr />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        className="border border-gray-300 rounded-md p-2 mb-4 "
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        className=" border border-gray-300 rounded-md p-2 mb-4 "
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        onClick={() => {
          handleLogin();
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Log In
      </button>

      <button
        onClick={() => {
          router.push("/forgotpassword");
        }}
        className="mt-4 text-blue-500"
      >
        Forgot Password?
      </button>

      <Link href="/signUp" className="mt-4 text-blue-500">
        Don't have an account? Sign Up
      </Link>
    </div>
  );
}
