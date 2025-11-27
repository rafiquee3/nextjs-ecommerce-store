import { NextResponse } from 'next/server';
import { Product, CheckoutFormData, CheckoutFormSchema } from '@/src/types';
import { promises as fs } from 'fs';
import path from 'path';
import { findProduct } from '@/lib/server/user-db-utils';

const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');

type productPromise = {
    data: Product | undefined;
    isFound: boolean;
}

export async function POST(request: Request) {
    
    try {
        const data: CheckoutFormData = await request.json();
        console.log('data', data)
        const validationResult = CheckoutFormSchema.safeParse(data);
        const promises: Promise<productPromise>[]= [];

        if (!validationResult.success) {
            return NextResponse.json({ 
                message: "Validation failed on the server.", 
                errors: validationResult.error.flatten() 
            }, { status: 400 });
        }

        const formData = validationResult.data;
        const {items: cartItems} = formData;

        cartItems.forEach(item => {
                const promise = findProduct(item.name);
                promises.push(promise);
        });

        const itemsData = await Promise.all(promises);

        const stockCheckPassed: boolean = itemsData.filter(item => {
            if (!item.data) return false;
            const dbItemCount = item.data.stock;
            const cartItemCount = cartItems.find(cItem => cItem.name === item.data!.name)?.quantity || 0;
            return dbItemCount >= cartItemCount ? true : false;

        }).length ? true : false;

        if (!stockCheckPassed) {
            return NextResponse.json({ 
                message: "Insufficient quantity of products in stock.", 
            }, { status: 409 });
        }

        const fileContents = await fs.readFile(productsFilePath, 'utf-8');
        const dbProducts = JSON.parse(fileContents);
        
        const editedProducts = dbProducts.map((dbProduct: Product) => {
            const cartItem = cartItems.find(cItem => cItem.name === dbProduct.name);
            console.log('citem', cartItem)
            if (cartItem) {
                dbProduct.stock -= cartItem.quantity;
            }
            return dbProduct
        })
        
        console.log('check', stockCheckPassed)
        await fs.writeFile(productsFilePath, JSON.stringify(editedProducts, null, 2));

        return NextResponse.json({ 
            message: "The order placed has been successfully accepted.", 
        }, { status: 201 });

    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error during transaction." }, { status: 500 });
    }
}