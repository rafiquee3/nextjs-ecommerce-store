"use client";
import { useCartStore } from "@/src/store/cartStore";
import Link from "next/link";

export default function() {
    const totalItems = useCartStore(state => state.totalItems);

    return (
        <Link href="/cart" className="mr-5 md:mr-10 flex items-center gap-3">
            <img src='/images/shopping_cart_icon.svg' className="h-6 w-6"/>
            {totalItems > 0 && (
                <span className="">
                    {totalItems}
                </span>
            )}
        </Link>
    )
}
