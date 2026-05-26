"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSignUp = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/users/signup", user);
            if (response.status === 201) {
                toast.success("Account created successfully!");
                router.push("/login");
            }
        } catch (error: any) {
            console.error("Error during sign up:", error);
            toast.error("Error during sign up. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user.email && user.password && user.username) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">
                {isLoading ? "Loading..." : "Sign Up"}
            </h1>
            <hr />
            <label htmlFor="username">Username:</label>
            <input
                className="border border-gray-300 rounded-md p-2 mb-4"
                type="text"
                id="username"
                value={user.username}
                placeholder="Username"
                onChange={(e) => setUser({...user, username: e.target.value})}
            />
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 mb-4"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
            />
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                placeholder="Password"
                className="border border-gray-300 rounded-md p-2 mb-4"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
            />
            <button
                onClick={onSignUp}
                disabled={buttonDisabled}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
                {buttonDisabled ? "Please fill all fields" : "Sign Up"}
            </button>

            <Link href="/login" className="mt-4 text-blue-500">
                Already have an account? Log in
            </Link>
        </div>
    );
}