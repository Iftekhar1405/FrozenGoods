export interface Brand {
  _id: string;
  brandName: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  img: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  brand: Brand;
  category: Category;
  MRP: string;
  price: string;
  isFavorite: boolean;
  image: string;
  inStock: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse {
  products: Product[];
  totalProducts: number;
  currentPage: string;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface CartItem {
  product: Product;
  quantity: number;
}