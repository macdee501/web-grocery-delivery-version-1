import OffersCard from "@/components/OffersCard";
import { getOffers } from "@/lib/getOffers";

export default async function Home() {
  const offers = await getOffers();

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