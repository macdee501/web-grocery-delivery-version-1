// lib/getProducts.ts
import { Query } from "appwrite";
import { databases,  } from "./appwrite";
import { Product } from "@/types/product";

export async function getProducts(categoryId?: string): Promise<Product[]> {
  const queries = categoryId
    ? [Query.equal("categories.$id", categoryId)] // filter via relationship
    : [];

  const response = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE!,
    queries
  );

  return response.documents.map((doc: any) => ({
    id: doc.$id,
    name: doc.name,
    price: doc.price,
    image: doc.image,
    tags: doc.tags,
    description: doc.description,
    categories: doc.categories, // array of category objects
  }));
}
