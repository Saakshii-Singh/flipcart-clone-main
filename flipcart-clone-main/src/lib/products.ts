import { apiGet } from '@/lib/api';
import type { AppProduct } from '@/types/app';

interface ServerProduct {
  id: string;
  shortTitle?: string;
  longTitle?: string;
  mrp?: number;
  cost?: number;
  discountPercent?: string | number;
  quantity?: number;
  description?: string;
  image?: string;
  images?: string | string[];
  category?: string;
  brand?: string;
  specifications?: string | Record<string, string>;
  extraDiscount?: string;
  tagline?: string;
}

function parseDiscount(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function createRatingSeed(id: string): number {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function parseImages(product: ServerProduct): string[] {
  if (product.images) {
    try {
      const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      if (Array.isArray(imgs) && imgs.length > 0) return imgs;
    } catch { /* ignore */ }
  }
  if (product.image) return [product.image];
  return ['/placeholder.svg'];
}

function parseSpecs(product: ServerProduct): Record<string, string> {
  if (!product.specifications) return {};
  try {
    return typeof product.specifications === 'string'
      ? JSON.parse(product.specifications)
      : product.specifications;
  } catch {
    return {};
  }
}

export function mapServerProduct(product: ServerProduct): AppProduct {
  const seed = createRatingSeed(product.id || 'product');
  const rating = Number((3.8 + (seed % 12) / 10).toFixed(1));

  return {
    id: product.id,
    title: product.longTitle || product.shortTitle || 'Product',
    price: Number(product.mrp ?? product.cost ?? 0),
    discount: parseDiscount(product.discountPercent),
    images: parseImages(product),
    rating,
    rating_count: 100 + ((seed * 37) % 5000),
    stock: Number(product.quantity ?? 0),
    description: product.description || 'No description available.',
    category: product.category || product.shortTitle || 'General',
    brand: product.brand || '',
    specifications: parseSpecs(product),
    extraDiscount: product.extraDiscount || '',
    tagline: product.tagline || '',
  };
}

export async function fetchAllProducts(search?: string, category?: string): Promise<AppProduct[]> {
  const params = new URLSearchParams();
  if (search?.trim()) params.set('search', search.trim());
  if (category && category !== 'All') params.set('category', category);

  const queryString = params.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  const data = await apiGet<ServerProduct[]>(url);
  return data.map(mapServerProduct);
}

export async function fetchProductById(id: string): Promise<AppProduct | null> {
  const data = await apiGet<ServerProduct | null>(`/products/${id}`);
  return data ? mapServerProduct(data) : null;
}

export async function fetchCategories(): Promise<string[]> {
  return apiGet<string[]>('/products/categories');
}

export async function fetchSimilarProducts(id: string): Promise<AppProduct[]> {
  const data = await apiGet<ServerProduct[]>(`/products/${id}/similar`);
  return data.map(mapServerProduct);
}
