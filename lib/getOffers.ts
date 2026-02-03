import { databases } from "./appwrite";

export async function getOffers() {
    try {
        const response = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_OFFERS_ID!
        );
        
        // Filter only active offers and sort by order
        return response.documents
            .filter((offer: any) => offer.isActive)
            .sort((a: any, b: any) => a.order - b.order);
    } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
    }
}