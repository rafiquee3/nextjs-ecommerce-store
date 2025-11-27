import { Category } from '@/src/types';
import * as fs from 'fs/promises';
import * as path from 'path';

const categoriesFilePath = path.join(process.cwd(), 'src/data/categories.json');

export async function getValidCategoryNames(): Promise<string[]> {
    try {
        const fileContents = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories: Category[] = JSON.parse(fileContents);

        const categoryNames = categories.map(category => category.name.toLowerCase());

        return ['all', ...categoryNames];
    } catch (error) {
        console.error("Failed to load categories for validation.", error);
        return ['all'];
    }
}