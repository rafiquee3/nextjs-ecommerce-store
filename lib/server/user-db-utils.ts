import z from "zod";
import { promises as fs } from 'fs';
import path from 'path';
import { Category, Product, User } from "@/src/types";

const usersFilePath = path.join(process.cwd(), 'src/data', 'users.json');
const productsFilePath = path.join(process.cwd(), 'src/data', 'products.json');
const categoriesFilePath = path.join(process.cwd(), 'src/data', 'categories.json');

async function readJsonFile<T>(filePath: string): Promise<T[]> {
    try {
        const fileContents = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading or parsing data file:", error);
        throw new Error("Failed to access database.");
    }
}

export async function findUserByEmail(email: string) {
    const users: User[] = await readJsonFile(usersFilePath);
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase()); 

    return {
        data: user,
        isFound: user ? true : false,
    }
}

export async function findUserByLogin(login: string) {
    const users: User[] = await readJsonFile(usersFilePath);
    const user = users.find(user => user.login === login);
    console.log('length', users.length)
    return {
        data: user,
        isFound: user ? true : false,
    }
}

export async function findCategory(categoryName: string) {
    const categories: Category[] = await readJsonFile(categoriesFilePath);
    const category = categories.find(category => category.name === categoryName);

    return {
        data: category,
        isFound: category ? true : false,
    }
}

export async function findProduct(productName: string) {
    const products: Product[] = await readJsonFile(productsFilePath);
    const product = products.find(product => product.name === productName);

    return {
        data: product,
        isFound: product ? true : false,
    }
}

export async function saveNewUser(newUser: User) {
    const users: User[] = await readJsonFile(usersFilePath);
    users.push(newUser);
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error writing user data file:", error);
        throw new Error("Failed to save user to database.");
    }
} 