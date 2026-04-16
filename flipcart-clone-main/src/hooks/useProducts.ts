import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, fetchProductById, fetchCategories, fetchSimilarProducts } from '@/lib/products';

export function useProducts(search?: string, category?: string) {
  return useQuery({
    queryKey: ['products', search, category],
    queryFn: () => fetchAllProducts(search, category),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

export function useSimilarProducts(id: string) {
  return useQuery({
    queryKey: ['similar-products', id],
    queryFn: () => fetchSimilarProducts(id),
    enabled: !!id,
  });
}
