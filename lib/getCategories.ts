// lib/getCategories.ts
import { databases } from "./appwrite";

export async function getCategories() {
  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_TABLE!
  );

  return response.documents.map((doc: any) => ({
    id: doc.$id,
    name: doc.name,
  }));
}
