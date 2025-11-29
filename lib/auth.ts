import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Generate a fallback secret from GOOGLE_API_KEY if NEXTAUTH_SECRET is not set
const getNextAuthSecret = () => {
    if (process.env.NEXTAUTH_SECRET) {
        return process.env.NEXTAUTH_SECRET;
    }

    // In production, derive from GOOGLE_API_KEY as fallback
    if (process.env.GOOGLE_API_KEY) {
        return Buffer.from(process.env.GOOGLE_API_KEY).toString('base64');
    }

    // Development fallback
    return 'development-secret-key-change-in-production';
};

export const authOptions: AuthOptions = {
    providers: [
        // Simple Credentials Provider for Demo purposes
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "test@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // In a real app, verify against database
                if (credentials?.email && credentials?.password) {
                    return { id: "1", name: "Шеф-Повар", email: credentials.email };
                }
                return null;
            }
        }),
        // Google Provider (requires environment variables)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    pages: {
        signIn: '/auth/signin', // Optional custom sign-in page, using default for now
    },
    secret: getNextAuthSecret(),
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                // Add custom user ID to session if needed
                (session.user as any).id = token.sub;
            }
            return session;
        },
    }
};
