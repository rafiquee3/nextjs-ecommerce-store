import { Product } from "@/src/types";
import DeleteButton from "../admin/DeleteButton";
import Link from "next/link";

export function ProductsTable({products}: {products: Product[]}) {
    if (!products.length) {
        return (
            <div className='p-8 text-center'>No products avaible.</div>
        )
    }

    return (    
        <div className="overflow-x-auto md:mt-3 ">
            <table className="text-sm md:text-base min-w-full">
                <thead className="bg-[#A8C9E1]">
                    <tr className="">
                        <th className='w-8/10 p-1' scope="col">Name</th>
                        <th scope="col" className=' px-2 md:px-4 border-l-1 border-r-1 md:border-r-0 border-[#E1F8FF]'>Stock</th>
                        <th className='hidden md:block p-1 md:px-4 border-l-1 border-r-1 border-[#E1F8FF]' scope="col">Price</th>
                        <th className='' scope="col"></th>
                    </tr>
                </thead>
                <tbody className="">
                    {
                        products.map(product => (
                        <tr className={`odd:bg-[#C1E1F5] even:bg-[#A8C9E1]`} key={product.id}>
                            <th scope="row" className="text-left p-3">
                                <Link className='block' href={`/admin/products/${product.id}`}>
                                    <div className='truncate block min-[370px]:max-w-[370px] min-[490px]:max-w-[490px]'>
                                        {product.name}
                                    </div>
                                </Link>
                            </th>
                            <td className="p-3 text-center border-l-1 border-r-1 md:border-r-0 border-[#E1F8FF]">{product.stock}</td>
                            <td className="hidden md:block p-3 text-center border-l-1 border-r-1 border-[#E1F8FF]">{product.price}</td>
                            <td className="p-3 text-center text-red-500"><DeleteButton id={product.id} target="products"/></td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>     
        </div>
    )
}