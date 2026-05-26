'use client';
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// ✅ Inner component with all the logic
function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyEmail = async (tok: string) => {
        try {
            setVerifying(true);
            await axios.post("/api/users/verifyemail", { token: tok });
            setVerified(true);
        } catch (error) {
            console.error("Error verifying email:", error);
            setError(true);
        } finally {
            setVerifying(false);
        }
    };

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        } else {
            setError(true);
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

            {verifying && (
                <p className="text-lg font-medium text-gray-500">
                    Verifying your email...
                </p>
            )}

            {verified && !verifying && (
                <>
                    <p className="text-lg font-medium text-green-500">
                        Email verified successfully! ✅
                    </p>
                    <Link href="/login" className="text-blue-500 hover:underline mt-4">
                        Go to Login
                    </Link>
                </>
            )}

            {error && !verifying && (
                <p className="text-lg font-medium text-red-500">
                    Failed to verify email. Token may be invalid or expired. ❌
                </p>
            )}
        </div>
    );
}

// ✅ Default export wraps in Suspense
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}