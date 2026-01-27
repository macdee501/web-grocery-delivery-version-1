import { getProducts } from "@/lib/getProducts";

export default async function Home() {

  const products = await getProducts()

  return (
    <div className="">
      <h1 className="">Hello</h1>

      {products.map((product:any,key)=>(
        <div className="" key={key}>
          <h2>{product.name}</h2>
        </div>
      ))}

    </div>
  );
}
