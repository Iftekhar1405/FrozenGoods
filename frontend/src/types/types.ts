export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  stockQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  img: string;
}
