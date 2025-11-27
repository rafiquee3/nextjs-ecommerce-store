import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { findUserByLogin } from "@/lib/server/user-db-utils";

const authOptions: any = { 
    providers: [
        CredentialsProvider({
            // ... credentials definition (username, password, email) ...
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                login: { label: "login", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },           
            async authorize(credentials): Promise<any> {
                if (!credentials || !credentials.password || !credentials.login) {
                    return null;
                }
                // Use typedCredentials for access
                const user = await findUserByLogin(credentials.login);

                if (user.data) {
                    // Use typedCredentials.password here
                    const isValid = await bcrypt.compare(credentials.password, user.data.hashedPassword);

                    if (isValid) {
                        // ... return user object ...
                        return { 
                            id: user.data.id, 
                            email: user.data.email, 
                            login: user.data.login, 
                            role: user.data.role 
                        };
                    }
                }
                
                return null; // Failure
            } 
        })
    ],
    callbacks: {
        async jwt({ token, user}: any) {
            // 'user' is the object returned from the authorize function
            if (user) {
                token.role = user.role; // Copy role from user object to token
                token.login = user.login; // Copy login from user object to token
                // Ensure email is also there (it often is by default)
            }
            return token;
        },
        async session({ session, token }: any) {
            // Copy the custom fields from the token to the session object
            session.user.role = token.role as string;
            session.user.login = token.login as string; 
            
            return session;
        },
    },
    session: { strategy: 'jwt' },
    pages: { },
};

const handler =  NextAuth(authOptions);
export {handler as GET, handler as POST, authOptions};
