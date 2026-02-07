import { databases } from "./appwrite";

export async function getProductById(productId: string) {
  const doc = await databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE!,
    productId
  );

  return {
    id: doc.$id,
    name: doc.name,
    price: doc.price,
    image: doc.image,
    tags: doc.tags,
    description: doc.description,
    categories: doc.categories,
  };
}
