import { Category, Product } from "@/src/types";
import DeleteButton from "../admin/DeleteButton";
import Link from "next/link";

export function CategoriesTable({categories}: {categories: Category[]}) {
    if (!categories.length) {
        return (
            <div className='mt-8 text-center'>No categories avaible.</div>
        )
    }

    return (    
        <div className="overflow-x-auto md:mt-3">
            <table className="text-sm md:text-base min-w-full pr-[35vw] ">
                <thead className="bg-[#A8C9E1]">
                    <tr className="">
                        <th className='w-9/10 p-1' scope="col">Name</th>
                        <th scope="col" className='px-2 md:px-4 border-l-1 border-r-1 border-white'>Stock</th>
                        <th className='' scope="col"></th>
                    </tr>
                </thead>
                <tbody className="">
                    {
                        categories.map(category => (
                        <tr className='odd:bg-[#C1E1F5] even:bg-[#A8C9E1]' key={category.id}>
                            <th scope="row" className="text-left p-3">
                                <Link className='block' href={`/admin/categories/${category.slug}`}>
                                    <div className='truncate block min-[370px]:max-w-[370px] min-[490px]:max-w-[490px]'>
                                        {category.name}
                                    </div>
                                </Link>
                            </th>
                            <td className="p-3 text-center border-l-1 border-r-1 border-white">{category.productCount}</td>
                            <td className="p-3 text-center text-red-500"><DeleteButton id={category.id} target="categories"/></td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>     
        </div>
    )
}