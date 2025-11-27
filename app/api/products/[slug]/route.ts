import { NextResponse } from 'next/server';
import { Product, ProductSchema } from '@/src/types';
import { promises as fs } from 'fs';
import path from 'path';
import { CategoryRouteContext } from '@/src/types/api-route-context';

// Define the path to your mock database file (products.json)
const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');

// Optional: Add a GET handler to fetch all products securely from the admin side
export async function GET(request: Request, context: CategoryRouteContext) {
    try {
        const {params} = await context;
        const {slug: productId} = await params;

        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileContents);
        const product = products.find(product => product.id === Number(productId));

    if (!product) {
            // Return a 404 error if the product is undefined
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 500 });
    }
}

