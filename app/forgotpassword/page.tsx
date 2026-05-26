"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [buttondisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/users/forgotpassword", {
        email,
      });

      if (response.status === 200) {
        // Request successful, show success message
        toast.success("Password reset link sent to your email!");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Forgot password request failed:", error);
      toast.error(
        error?.message ||
          "Failed to send password reset link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">{loading ? "Sending reset link..." : "Forgot Password"}</h1>
      <hr />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      <button
        onClick={handleForgotPassword}      
        disabled={buttondisabled}       
        className={`px-4 py-2 rounded ${buttondisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="mt-4">
        Remembered your password?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}       