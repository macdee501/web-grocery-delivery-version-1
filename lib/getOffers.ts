import { databases } from "./appwrite";

export async function getOffers() {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_OFFERS_ID!
    );

    return response.documents
      .filter((offer: any) => offer.isActive)
      .sort((a: any, b: any) => a.order - b.order)
      .map((offer: any) => ({
        $id: offer.$id,
        title: offer.title || "Untitled Offer",
        description: offer.description || "", // <-- ensures description exists
        image: offer.image || "",             // <-- fallback if image missing
        color: offer.color || "#ffffff",
        isActive: offer.isActive ?? true,
        order: offer.order ?? 0,
      }));
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}
