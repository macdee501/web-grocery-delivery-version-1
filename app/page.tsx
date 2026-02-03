import OffersCard from "@/components/OffersCard";
import { getOffers } from "@/lib/getOffers";

interface Offer {
  $id: string;
  title: string;
  image: string;
  color: string;
  isActive: boolean;
  order: number;
}

export default async function Home() {
  const offersData = await getOffers();

  // Map Appwrite DefaultDocument to Offer type
  const offers: Offer[] = offersData.map((doc) => ({
    $id: doc.$id,
    title: doc.title,
    image: doc.image,
    color: doc.color,
    isActive: doc.isActive,
    order: doc.order,
  }));

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Available Offers</h1>
      <div className="flex flex-col gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <OffersCard key={offer.$id} offer={offer} />
          ))
        ) : (
          <p className="text-gray-600">No offers available at the moment.</p>
        )}
      </div>
    </div>
  );
}
