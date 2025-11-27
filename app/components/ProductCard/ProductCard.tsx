"use client"
import { useCartStore } from "@/src/store/cartStore";
import { Product } from "@/src/types"

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps) {
    const addItem = useCartStore(state => state.addItem);

    const handleAddToCart = () => {
        addItem(
            { 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                imageUrl: product.imageUrl 
            }
        )
    }

    return (
        <div className="my-5 flex flex-col gap-4 justify-between w-fill ">
            <div className="flex flex-col gap-2 items-center w-full">
                <img src={product.imageUrl} alt={product.name} className="object-contain h-[170px]"/>
                <div className="w-full pl-4">
                    <p className="truncate w-full">{product.name}</p>
                    <p className="">{product.price.toFixed(2)}</p>
                </div>
            </div>
            { product.stock ? 
                <button onClick={handleAddToCart} className="self-center px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors 
           duration-300 transform bg-blue-500 rounded-lg hover:bg-indigo-500 
           focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-80 truncate">Add To Cart</button>
            :
            <p className="text-red-500 text-center">Out of stock</p> 
            }
        </div>
    )
}