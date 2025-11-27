import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { SessionUser } from "@/src/types";

export async function checkAdminPermissions(): Promise<NextResponse | undefined> {
    const session: SessionUser | null = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: 'Authentication required.' }, 
            { status: 401 }
        );
    }
    
    if (session.user.role !== 'admin') {
        return NextResponse.json(
            { message: 'Insufficient permissions (Admin role required).' }, 
            { status: 403 }
        );
    }

    return undefined;
}