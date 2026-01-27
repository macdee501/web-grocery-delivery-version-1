import { databases } from "./appwrite";


export async function getProducts()
{
    const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_PRODUCTS_TABLE!
    )

    return response.documents;
}