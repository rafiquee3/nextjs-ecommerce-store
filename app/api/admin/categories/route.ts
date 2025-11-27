import { NextResponse } from 'next/server';
import { CategorySchema, CategorieFormData, Category, createCategorySearchSchema } from '@/src/types';// Import Zod schema and type
import { promises as fs } from 'fs';
import path from 'path';
import { findCategory } from '@/lib/server/user-db-utils';
import { checkAdminPermissions } from '@/lib/server/checkPermissions';
import { getValidCategoryNames } from '@/lib/server/category-utils';
import { purifyQuery } from '@/lib/purifyQuery';
import z from 'zod';
const categoriesFilePath = path.join(process.cwd(), 'src/data', 'categories.json');

export async function POST(request: Request) {

    const authorizationResponse = await checkAdminPermissions();
    if (authorizationResponse) {
        return authorizationResponse; 
    }

    try {
        const data: CategorieFormData = await request.json();
        const validationResult = CategorySchema.safeParse(data);

        if (!validationResult.success) {
            return NextResponse.json({ 
                message: "Validation failed on the server.", 
                errors: validationResult.error.format() 
            }, { status: 400 });
        }

        const newCategorieData = validationResult.data;
        const {name} = newCategorieData;

        const category = await findCategory(name);

        if (category.isFound) {
            return NextResponse.json({ 
                message: "The provided category has already been added to the database.", 
            }, { status: 409 });
        }

        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(fileContents);

        const newId = categories.length > 0 ? Math.max(...categories.map((p: any) => p.id)) + 1 : 100;

        const newCategorie = {
            id: newId,
            ...newCategorieData,
        };

        categories.push(newCategorie);
        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

        return NextResponse.json({ 
            message: "Categorie added successfully (Database simulated).", 
            category: newCategorie 
        }, { status: 201 });

    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Internal Server Error during transaction." }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const url =  new URL(request.url);
    const {searchParams, search} = url;

    const categoriesNames = await getValidCategoryNames();
    const CategorySearchSchema = createCategorySearchSchema(categoriesNames);
    const rawParams = Object.fromEntries(searchParams);

    type ValidatedSearchParams = z.infer<typeof CategorySearchSchema>;
    let validatedParams: ValidatedSearchParams;
    
    try {
        validatedParams = CategorySearchSchema.parse(rawParams);
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 400 });
    }

    let {page, limit, category, sort, q} = validatedParams;

    try {
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories: Category[] = JSON.parse(fileContents);
        const totalPages: number = Math.ceil(categories.length / limit);

        let filteredCategories: Category[] | [] = categories ;

        if (page > totalPages) {
            console.error('You are trying to access a page index that is out of range.');
            return NextResponse.json({ message: "You are trying to access a page index that is out of range." }, { status: 400 });
        }
       
        if (category !== 'all') filteredCategories = categories.filter(c => c.name === category);

        if (q) {
            const lowerCaseQuery = purifyQuery(q).toLowerCase();
            filteredCategories = filteredCategories.filter(c => c.name.toLowerCase().includes(lowerCaseQuery) || c.description.toLowerCase().includes(lowerCaseQuery));
        }

        const resultsCount = filteredCategories.length;

        let currentPage = 0;
        for (let i = 0; i <= categories.length; i += limit) {
            currentPage++;
            if (page === currentPage) {
                if(i + limit > categories.length) {
                    filteredCategories = filteredCategories.slice(i);
                } else {
                    filteredCategories = filteredCategories.slice(i, i + limit);
                } 
            }
        }  

        const sortByName = (categories: Category[]) => {
            return categories.sort((a, b) => {
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
            case 'stock_asc':
                filteredCategories.sort((a, b) => a.productCount - b.productCount);
                break;
            case 'stock_desc':
                filteredCategories.sort((a, b) => a.productCount - b.productCount).reverse();
                break;
            case 'name_asc':
                sortByName(filteredCategories);
                break;
            case 'name_desc':
                sortByName(filteredCategories).reverse();
                break;
            case 'default':
                break;
            default:
                break;
        }

        return NextResponse.json({data: filteredCategories, totalCount: resultsCount});
    } catch (error) {
        return NextResponse.json({ message: "Failed to read products data." }, { status: 500 });
    }
}