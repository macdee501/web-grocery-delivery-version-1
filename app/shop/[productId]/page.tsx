import { getProductById } from "@/lib/getProductById";
import ProductPageClient from "@/components/ProductPageClient";

type Props = {
  params: Promise<{ productId: string }>; // params is now a Promise
};

export default async function ProductPage({ params }: Props) {
  const { productId } = await params; // unwrap the promise

  if (!productId) {
    throw new Error("Product ID missing from route params");
  }

  const product = await getProductById(productId);

  return <ProductPageClient product={product} />;
}
