export interface Product {
    id: string;           // ❗️Notice: NOT $id
    name: string;
    price: number;
    image?: string;
    tags?: string[];
    description?: string;
  }