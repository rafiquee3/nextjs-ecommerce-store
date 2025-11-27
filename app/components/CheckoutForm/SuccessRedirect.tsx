'use client';
import { useCartStore } from "@/src/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SuccessRedirect() {
    const router = useRouter();
    const [time, setTime] = useState<number>(10);
    const clearCart = useCartStore(store => store.clearCart);
    const cartClearedRef = useRef(false);

    useEffect(() => {
        if (!cartClearedRef.current) {
            clearCart();
            cartClearedRef.current = true;
        }
        
        const interval = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval); 
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, [clearCart]);

    useEffect(() => {
        if (time === 0) {
            router.push('/');
        }
    }, [time, router]);

    return (
        <p className="my-2">In <b>{time}</b> seconds you will be redirected to the main page.</p>
    );
}