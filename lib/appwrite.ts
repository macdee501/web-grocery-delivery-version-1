import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Enable cookie-based sessions for better security
if (typeof window !== 'undefined') {
    client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };