import { databases } from "./appwrite";
import { Query } from "appwrite";

export async function getOrders(userId: string) {
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_ORDERS_TABLE_ID!,
            [
                Query.equal('userId', userId),
                Query.orderDesc('$createdAt')
            ]
        );
        
        return response.documents;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}