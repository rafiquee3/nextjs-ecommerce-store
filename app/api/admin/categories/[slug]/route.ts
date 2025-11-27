import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {Category, CategorySchema} from '@/src/types';
import { CategoryRouteContext } from '@/src/types/api-route-context';
import { checkAdminPermissions } from '@/lib/server/checkPermissions';

const categoriesFilePath = path.join(process.cwd(), 'src/data', 'categories.json');

export async function GET(request: Request, context: CategoryRouteContext) {
    const authorizationResponse = await checkAdminPermissions();

    if (authorizationResponse) {
        return authorizationResponse; 
    }

    try {
        const {params} = await context; 
        const {slug} = await params;
    
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories: Category[] = JSON.parse(fileContents);
        const category = categories.find(category => category.slug.toLowerCase() === slug.toLowerCase());
        
        if (!category) {
            return NextResponse.json(
                { message: "Category not found." }, 
                { status: 404 } 
            );
        }
        return NextResponse.json(category, { status: 201 });

    } catch (error) {
        console.error("API GET category error:", error);

        return NextResponse.json(
            { message: "Internal Server Error: Failed to process category request." }, 
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, context: CategoryRouteContext) {
    const authorizationResponse = await checkAdminPermissions();
    if (authorizationResponse) {
        return authorizationResponse; 
    }
    try {
        const {params} = await context;
        const {slug: categoryIdstring} = await params;
        const categoryId = Number(categoryIdstring);

        if (isNaN(categoryId) || categoryId <= 0) {
            return NextResponse.json({ message: "Invalid category ID format." }, { status: 400 }); // BAD REQUEST
        }

        const rawData = await request.json();
        const validationResult = CategorySchema.safeParse(rawData);

        if (!validationResult.success) {
            return NextResponse.json({ 
                message: "Validation failed on the server.", 
                errors: validationResult.error.flatten() 
            }, { status: 400 });
        }

        const newCategoryData = validationResult.data;
    
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        let categories: Category[] = JSON.parse(fileContents);
        const category: Category | undefined = categories.find(category => category.id === Number(categoryId));
        
        if (!category) {
            return NextResponse.json({ message: "Category not found." }, { status: 404 });
        }

        const updatedCategory = {
            ...category,
            ...newCategoryData,
        };
        categories = categories.map(p => p.id === Number(categoryId) ? p = updatedCategory : p);
        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));
        return NextResponse.json({ message: "Category updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Failed to read categories data." }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: CategoryRouteContext) {
    const authorizationResponse = await checkAdminPermissions();
    if (authorizationResponse) {
        return authorizationResponse; 
    }
    const {params} = await context;
    const {slug: categoryIdString} =  await params;
    const categoryId = Number(categoryIdString);

    if (isNaN(categoryId) || categoryId <= 0) {
            return NextResponse.json({ message: "Invalid category ID format." }, { status: 400 });
    }

    try {
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        let categories: Category[] = JSON.parse(fileContents);
        const category: Category | undefined = categories.find(category => category.id === Number(categoryId));

        if (!category) {
            return NextResponse.json({ message: "Category not found." }, { status: 404 });
        }

        const updatedCategories = categories.filter(category => category.id !== categoryId);

        await fs.writeFile(categoriesFilePath, JSON.stringify(updatedCategories, null, 2));
        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error("DELETE category error:", error);
        return NextResponse.json({ message: "Failed to delete category." }, { status: 500 });
    }
}
