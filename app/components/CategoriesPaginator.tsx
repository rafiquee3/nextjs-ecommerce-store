'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Category, FilterParams, Product } from "@/src/types";
import QuerySearch from "./QuerySearch";
import { useBreakpoint } from "./useBreakpoint";
import { getVisiblePages } from "@/lib/getVisiblePages";
import { CategoriesTable } from "./ProductCard/CategoriesTable";

interface CategoriesPaginatorProps {
    initialCategories: Category[];
    totalCount: number;
    initialFilterParams: FilterParams;
}

export default function CategoriesPaginator({initialCategories, totalCount, initialFilterParams}: CategoriesPaginatorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(totalCount / initialFilterParams.limit!);
    const navBttnStyle = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 cursor-pointer';
    const isActive = 'bg-gray-400';
    
    let delta = 0;
    let mobile = true;
    const breakPoint = useBreakpoint(2);

    switch (breakPoint) {
        case 2:
            delta = 1;
            mobile = true;
            break;
        case 3:
            delta = 1;
            mobile = false;
            break;
        case 4:
            delta = 2;
            mobile = false;
            break;
        case 5:
            delta = 3;
            mobile = false;
            break;
        default:
            delta = 1;
            mobile = true;
    }

    const pages = getVisiblePages(initialFilterParams.page!, totalPages, delta, mobile);

    const updateURL = useCallback((key: string, value: string | number) => {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set(key, String(value));

        if (key != 'page') {
            currentParams.set('page', '1');
        }

        router.push(`/admin/categories?${currentParams.toString()}`);
    }, [router, searchParams]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateURL('sort', e.target.value);
    }

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) {
            newPage = totalPages;
        } else if (newPage > totalPages) {
            newPage = 1;
        }
        updateURL('page', newPage);
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateURL('limit', e.target.value);
    }

    return (
        <div className="w-screen min-w-[375px] md:w-full items-center flex flex-col md:gap-2">
            <div className="w-full md:w-fit">
                <div className="flex w-full md:w-[570px] text-sm">
                    <div className="relative w-1/2">
                        <select 
                            className="safari-reset truncate border-r-[1px] border-gray-400 py-1 pl-3 pr-6 w-full cursor-pointer border-r-0 md:rounded-tl-lg"
                            id='sort_select'
                            onChange={handleSortChange} 
                            defaultValue={initialFilterParams.sort}
                        >
                            <option value='default'>Date: Last added</option>
                            <option value='stock_asc'>Stock: Low to High</option>
                            <option value='stock_desc'>Stock: High to Low</option>
                            <option value='name_asc'>Name: A to Z</option>
                            <option value='name_desc'>Name: Z to A</option>
                        </select>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="relative w-1/2">
                        <select 
                            className="safari-reset truncate py-1 px-3 w-full cursor-pointer pl-3 pr-6 md:rounded-tr-lg"
                            id='limit_select'
                            onChange={handleLimitChange} 
                            defaultValue={initialFilterParams.limit}
                        >
                            <option value='6'>Limit: 6</option>
                            <option value='12'>Limit: 12</option>
                            <option value='18'>Limit: 18</option>
                            <option value='24'>Limit: 24</option>
                        </select>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <QuerySearch updateURL={updateURL} initialQuery={initialFilterParams.q!}/>
            </div>
            <div className="product-list w-full">
                <CategoriesTable categories={initialCategories}/>
            </div>
            { totalPages > 1 && (
                <div className="pagination mt-6 mb-4">
                    <div className="flex flex-nowrap justify-center overflow-x-auto">
                        <button className={`${navBttnStyle} rounded-l`} onClick={() => handlePageChange(Number(initialFilterParams.page) - 1)}>&lt; Prev</button>
                        <span className="">
                            {pages.map(i => {
                                const randomKey = (Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000)) / Math.floor(Math.random() * 100);
                                return (
                                <button 
                                    className={`${initialFilterParams.page === i ? isActive : null} ${navBttnStyle} ml-[1px]`} 
                                    key={randomKey} 
                                    onClick={() => i === 0 ? null : handlePageChange(Number(i))}
                                >
                                    {i === 0 ? '...' : i}
                                </button>
                        )})}
                        </span>
                        <button className={`${navBttnStyle} rounded-r ml-[1px]`} onClick={() => handlePageChange(Number(initialFilterParams.page) + 1)}> Next &gt;</button>
                    </div>             
                    <span className="block text-center mt-4 text-sm">Page {initialFilterParams.page} of {totalPages}</span>
                </div>
            )}
        </div>
    )
}