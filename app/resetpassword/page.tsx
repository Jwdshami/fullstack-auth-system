// app/resetpassword/page.tsx
'use client';
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ✅ Inner component with all the logic
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async () => {
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await axios.post("/api/users/resetpassword", { token, password });
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Failed to reset password. Token may be invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Reset Password</h1>

            {success ? (
                <p className="text-green-500 font-medium">
                    Password reset successfully! ✅ Redirecting to login...
                </p>
            ) : (
                <>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded w-72"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border p-2 rounded w-72"
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        onClick={handleReset}
                        disabled={loading || !password || !confirmPassword}
                        className={`px-4 py-2 rounded w-72 text-white ${
                            loading || !password || !confirmPassword
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <Link href="/login" className="text-blue-500 hover:underline text-sm">
                        Back to Login
                    </Link>
                </>
            )}
        </div>
    );
}

// ✅ Default export wraps in Suspense
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}