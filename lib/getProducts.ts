import { databases } from "./appwrite";


export async function getProducts()
{
    const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE!
    )

    return response.documents;
}