import { NextResponse } from 'next/server';
import {Product} from '@/src/types';// Import Zod schema and type
import { promises as fs } from 'fs';
import path from 'path';
import { getValidCategoryNames } from '@/lib/server/category-utils';
import z from 'zod';
import { createRandomSearchSchema } from '@/src/types';

const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');

export async function GET(request: Request) {
    const url =  new URL(request.url);
    const {searchParams} = url;

    const categoriesNames = await getValidCategoryNames();
    const ProductSearchSchema = createRandomSearchSchema(categoriesNames);
    const rawParams = Object.fromEntries(searchParams);

    type ValidatedSearchParams = z.infer<typeof ProductSearchSchema>;
    let validatedParams: ValidatedSearchParams;
    
    try {
        validatedParams = ProductSearchSchema.parse(rawParams);
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 400 });
    }

    let {limit, category} = validatedParams;

    try {
        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContents);
        const productsByCategory: Product[] = products.filter(product => product.category.toLowerCase() === category.toLowerCase())
                                              .filter(product => product.isFeatured);
        let randomProducts: Product[] = [];

        if (productsByCategory.length > limit) {
            do {
                const randomIndex = Math.floor(Math.random() * productsByCategory.length);
                const randomProduct = productsByCategory[randomIndex];

                if (!randomProducts.includes(randomProduct)) {
                    randomProducts.push(randomProduct);
                }
            } while (randomProducts.length < limit);

            return NextResponse.json(randomProducts);
        } 
        return NextResponse.json(productsByCategory);
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 500 });
    }
}