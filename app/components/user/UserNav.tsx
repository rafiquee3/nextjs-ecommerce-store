'use client';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserNav() {
    const { data: session, status }: any = useSession();

    if (status === 'loading') {
        return (
            <div className="">
                Loading...
            </div>
        )
    }

    if (status === 'authenticated') {
        const userName = session.user?.login || session.user?.email;

        return (
            <div className="flex gap-2 items-center">
                {
                    userName !== 'admin' &&             
                    <span className={`font-semibold text-green-400 block text-center select-none`}>
                        {userName}
                    </span>
                }
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-sm text-red-500 hover:underline cursor-pointer"
                >
                    <img src="/images/logout_icon.png" 
                         alt="Logout icon"
                         className="h-6 w-6"
                    />
                </button>
            </div>
        )
    }

    return (
        <div className="flex gap-2 items-center">
            <Link href="/signin" className="text-sm text-green-400 hover:underline">
                Sign In
            </Link>
            <Link href="/register" className="text-sm text-gray-100 hover:underline">
                Register
            </Link>
        </div>
    )
}