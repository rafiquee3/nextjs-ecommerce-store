import { NextResponse } from 'next/server';
import { Product, ProductSchema } from '@/src/types';
import { promises as fs } from 'fs';
import path from 'path';
import { CategoryRouteContext } from '@/src/types/api-route-context';
import { checkAdminPermissions } from '@/lib/server/checkPermissions';

// Define the path to your mock database file (products.json)
const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');

export async function PATCH(request: Request, context: CategoryRouteContext) {
    const authorizationResponse = await checkAdminPermissions();
    if (authorizationResponse) {
        return authorizationResponse; 
    }
    try {
        const {params} = await context;
        const {slug: productIdstring} = await params;
        const productId = Number(productIdstring);

        if (isNaN(productId) || productId <= 0) {
            return NextResponse.json({ message: "Invalid product ID format." }, { status: 400 }); // BAD REQUEST
        }

        const rawData = await request.json();
        const validationResult = ProductSchema.safeParse(rawData);

        if (!validationResult.success) {
            // Return validation errors if they fail the server-side check
            return NextResponse.json({ 
                message: "Validation failed on the server.", 
                errors: validationResult.error.flatten() 
            }, { status: 400 });
        }
        const newProductData = validationResult.data;

        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        let products: Product[] = JSON.parse(fileContents);
        const product: Product | undefined = products.find(product => product.id === Number(productId));
      
        if (!product) {
            // Return a 404 error if the product is undefined
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const updatedProduct = {
            ...product,
            ...newProductData,
        };
        products = products.map(p => p.id === Number(productId) ? p = updatedProduct : p);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
         
        return NextResponse.json({ message: "Product updated successfully." }, { status: 200 });
        
    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Failed to read products data." }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: CategoryRouteContext) {
    const authorizationResponse = await checkAdminPermissions();
    if (authorizationResponse) {
        return authorizationResponse; 
    }
    
    const {params} = await context;
    const {slug: productIdString} =  await params;
    const productId = Number(productIdString);

    if (isNaN(productId) || productId <= 0) {
            return NextResponse.json({ message: "Invalid product ID format." }, { status: 400 });
    }

    try {
        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        let products: Product[] = JSON.parse(fileContents);
        const product: Product | undefined = products.find(product => product.id === Number(productId));

        if (!product) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const updatedProducts = products.filter(product => product.id !== productId);

        await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));
        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json({ message: "Failed to delete product." }, { status: 500 });
    }
}