import { NextResponse } from 'next/server';
import { ProductSchema, ProductFormData, Product, createProductSearchSchema } from '@/src/types';// Import Zod schema and type
import { promises as fs } from 'fs';
import path from 'path';
import { findProduct } from '@/lib/server/user-db-utils';
import { checkAdminPermissions } from '@/lib/server/checkPermissions';
import { getValidCategoryNames } from '@/lib/server/category-utils';
import z from 'zod';
import { purifyQuery } from '@/lib/purifyQuery';

const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');

export async function GET(request: Request) {
    const url =  new URL(request.url);
    const {searchParams, search} = url;

    const categoriesNames = await getValidCategoryNames();
    const ProductSearchSchema = createProductSearchSchema(categoriesNames);
    const rawParams = Object.fromEntries(searchParams);

    type ValidatedSearchParams = z.infer<typeof ProductSearchSchema>;
    let validatedParams: ValidatedSearchParams;
    console.log('raw', rawParams, 'catNames', categoriesNames)
    try {
        validatedParams = ProductSearchSchema.parse(rawParams);
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 400 });
    }

    let {page, limit, category, sort, q} = validatedParams;

    try {
        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContents);
        const totalPages: number = Math.ceil(products.length / limit);

        let filteredProducts: Product[] | [] = products ;

        if (page > totalPages) {
            console.error('You are trying to access a page index that is out of range.');
            return NextResponse.json({ message: "You are trying to access a page index that is out of range." }, { status: 400 });
        }

        if (search === '') {
            return NextResponse.json(products);
        }
       
        if (category !== 'all') filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());

        if (q) {
            const lowerCaseQuery = purifyQuery(q).toLowerCase();
            filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(lowerCaseQuery) || product.description.toLowerCase().includes(lowerCaseQuery));
        }

        const resultsCount = filteredProducts.length;

        let currentPage = 0;
        for (let i = 0; i <= products.length; i += limit) {
            currentPage++;
            if (page === currentPage) {
                if(i + limit > products.length) {
                    filteredProducts = filteredProducts.slice(i);
                } else {
                    filteredProducts = filteredProducts.slice(i, i + limit);
                } 
            }
        }  

        const sortByName = (products: Product[]) => {
            return products.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase(); 
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;    
            });
        }

        switch (sort) {
            case 'price_asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredProducts.sort((a, b) => a.price - b.price).reverse();
                break;
            case 'name_asc':
                sortByName(filteredProducts);
                break;
            case 'name_desc':
                sortByName(filteredProducts).reverse();
                break;
            case 'default':
                break;
            default:
                break;
        }

        return NextResponse.json({data: filteredProducts, totalCount: resultsCount});
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 500 });
    }
}