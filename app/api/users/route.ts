import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src/data', 'users.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(fileContents);
        const totalUsers = users.length;
        return NextResponse.json(totalUsers);
    } catch (error) {
        console.error("API ROUTE ERROR:", error);
        return NextResponse.json({ message: "Failed to read categories data." }, { status: 500 });
    }
}