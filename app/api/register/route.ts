import { CategoryRouteContext } from "@/src/types/api-route-context";
import { SignUpSchema } from "@/src/types";
import { NextResponse } from "next/server";
import { findUserByEmail, findUserByLogin, saveNewUser } from "@/lib/server/user-db-utils";
import bcrypt from 'bcryptjs';
import { User } from "@/src/types";

export async function POST(request: Request, context: CategoryRouteContext) {
    try {
        const body = await request.json();
        const validatedData = SignUpSchema.parse(body);
        const { email, password, login } = validatedData;
  
        if(!email || !password || !login) {
            return NextResponse.json({ 
                message: 'The entered data is incomplete.',
            }, { status: 409 });
        }

        const existingLogin = await findUserByLogin(login);

        if (existingLogin.isFound) {
            return NextResponse.json({ 
                message: "The provided login is already associated with another account.",
                field: "login"
            }, { status: 409 });
        }
        const existingEmail = await findUserByEmail(email); 
        console.log('exis', existingEmail)

        if (existingEmail.isFound) {
            return NextResponse.json({ 
                message: "The provided email address is already associated with another account.",
                field: "email"
            }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: User = {
            id: Date.now(),
            email,
            login,
            hashedPassword,
            role: 'user'
        }
        
        await saveNewUser(newUser);
        return NextResponse.json({message: 'User registered successfully.'},{ status: 201 });
    } catch (error) {
        console.error("Registration failed:", error);
        return NextResponse.json({ message: "Registration failed due to a server error." }, { status: 500 });
    }
}