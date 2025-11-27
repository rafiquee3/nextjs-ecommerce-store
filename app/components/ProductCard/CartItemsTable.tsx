'use client';
import { useCartStore } from "@/src/store/cartStore";
import { styleButtonPrimary } from "@/src/styles/utilityClasses";
import { CartItem } from "@/src/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

type action = 'INC' | 'DEC';
export function CartItemsTable({products , totalPrice}: {products: CartItem[], totalPrice: number}) {
    const addItem = useCartStore(store => store.addItem);
    const remItem = useCartStore(store => store.remItem);
    const router = useRouter();

    if (!products.length) {
        return (
            <div className='p-8 text-center'>Your cart is empty.</div>
        )
    }

    const handleQuanity = (product: CartItem, action: action) => {
        if (action === 'INC') {
            addItem(product);
        } if (action === 'DEC') {
            remItem(product);
        }
    }

    return (
        <div>   
            <div className="overflow-x-auto md:rounded-xl md:mt-3 md:w-[600px]">
                <table className="text-sm md:text-base min-w-full pr-[35vw] ">
                    <thead className="bg-[#DCEBFF]">
                        <tr className="">
                            <th className='w-7/10 p-1' scope="col">Item</th>
                            <th className='w-1/10 hidden min-[416px]:table-cell p-1 md:px-4 border-l-1 border-r-1 border-white' scope="col">Price</th>
                            <th className='w-1/10 p-1 md:px-4 border-l-1 border-r-1 border-white' scope="col">Quantity</th>
                            <th className='w-1/10 px-4' scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {
                            products.map(product => (
                            <tr className='odd:bg-[#E2F7FF] even:bg-[#DCEBFF]' key={product.id}>
                                <th scope="row" className="text-left p-3 pr-4">
                                    <div className='flex gap-4 items-center'>
                                        <img
                                            className="w-10 h-10 rounded"
                                            src={product.imageUrl}
                                            alt={product.name} 
                                        />
                                        <Link className='block' href={`/products/${product.id}`}>
                                            <div className='truncate block w-[70px] min-[548px]:w-[170px] md:w-[220px]'>
                                                {product.name}
                                            </div>
                                        </Link>
                                    </div>
                                </th>
                                <td className="hidden min-[416px]:table-cell p-3 text-center border-l-1 border-r-1 md:border-r-0 border-white">{product.price}</td>
                                <td className="p-3 flex items-center gap-2 text-center border-l-1 border-r-1 border-white">
                                    <button className={`${styleButtonPrimary} rounded`} onClick={() => handleQuanity(product, 'DEC')}>-</button>
                                    {product.quantity}
                                    <button className={`${styleButtonPrimary} rounded`} onClick={() => handleQuanity(product, 'INC')}>+</button>
                                </td>
                                <td className="p-3 text-center text-gray-700">{(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                            ))
                        }
                        <tr className='odd:bg-[#E2F7FF] even:bg-[#DCEBFF]'>
                            <th></th>
                            <td className="hidden min-[416px]:table-cell p-3"></td>
                            <td className="p-3 text-right">Total:</td>
                            <td className="p-3 text-green-700 text-center font-bold">{totalPrice}</td>
                        </tr>
                    </tbody>
                </table>     
            </div>
            <button className={`${styleButtonPrimary} rounded mt-4 ml-auto block`} onClick={() => router.push('/checkout')}>Check out</button>
        </div> 
    );
}