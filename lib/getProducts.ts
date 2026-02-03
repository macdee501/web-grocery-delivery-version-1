// lib/getProducts.ts
import { databases } from "./appwrite";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE!
  );

  return response.documents.map((doc: any) => ({
    id: doc.$id,
    name: doc.name,
    price: doc.price,
    image: doc.image,
    tags: doc.tags,
    description: doc.description,
  }));
}
