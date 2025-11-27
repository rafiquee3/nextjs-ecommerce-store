'use client';

import { useCartStore } from "@/src/store/cartStore";
import { CartItemsTable } from "../components/ProductCard/CartItemsTable";

export default function CartPage() {
    const totalItems = useCartStore(store => store.totalItems);
    const products = useCartStore(store => store.items);
    const totalPrice = useCartStore(store => store.getCartTotal);

    return (
        <div className="flex flex-col items-center place-self-center my-6">
            <h2 className="font-bold pb-2">Your Cart {totalItems} items</h2>
            <CartItemsTable products={products} totalPrice={totalPrice()}/>    
        </div>
    );
}