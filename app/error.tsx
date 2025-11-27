"use client";
import { styleButtonPrimary } from "@/src/styles/utilityClasses";
import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void; 
}

export default function ErrorBoundary({error, reset}: ErrorProps) {
    useEffect(() => {
        console.error("An error occurred in the categories segment:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-red-200 rounded-lg my-8">
            <h2 className="text-xl font-semibold text-red-700">Something went wrong!</h2>
            <p className="mt-2 text-gray-600">
                Please try again or return to the main dashboard.
            </p>
            <button
                className={`${styleButtonPrimary} rounded bg-blue-500 mt-5`}
                onClick={
                    () => reset()
                }
            >
                Try to Reload
            </button>
        </div>
    );
}
