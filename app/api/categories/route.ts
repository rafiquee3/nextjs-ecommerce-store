import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const categoriesFilePath = path.join(process.cwd(), 'src/data', 'categories.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(fileContents);
        return NextResponse.json(categories);
    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Failed to read categories data." }, { status: 500 });
    }
}