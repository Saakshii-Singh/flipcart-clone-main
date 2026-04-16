export interface AuthUser {
  id: string | number;
  username: string;
  email?: string;
  firstname?: string;
  lastname?: string;
}

export interface AppProduct {
  id: string;
  title: string;
  price: number;
  discount: number;
  images: string[];
  rating: number;
  rating_count: number;
  stock: number;
  description: string;
  category: string;
  brand: string;
  specifications: Record<string, string>;
  extraDiscount: string;
  tagline: string;
}

export interface CartViewItem {
  id: string | number;
  product_id: string;
  quantity: number;
  products: AppProduct;
}

export interface WishlistViewItem {
  id: string | number;
  product_id: string;
  products: AppProduct;
}

export interface OrderAddress {
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
}

export interface AppOrderItem {
  id: string | number;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    id: string;
    title: string;
    images: string[];
  };
}

export interface AppOrder {
  id: string;
  user_id: string | number | null;
  session_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  address: OrderAddress;
  order_items: AppOrderItem[];
}

export interface SignInPayload {
  identifier: string;
  password: string;
}

export interface SignUpPayload {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}
