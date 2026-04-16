import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import type { CartViewItem } from '@/types/app';
import { toast } from '@/hooks/use-toast';

interface CartResponse {
  cart: { id: string };
  items: CartViewItem[];
}

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: () => apiGet<CartResponse>('/cart'),
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      return apiPost<CartResponse>('/cart/items', { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: 'Added to cart!' });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string | number; quantity: number }) => {
      return apiPut<CartResponse>(`/cart/items/${itemId}`, { quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string | number) => {
      return apiDelete<CartResponse>(`/cart/items/${itemId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      return apiDelete<CartResponse>('/cart');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const cartItemCount = cartQuery.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return { cartQuery, addToCart, updateQuantity, removeItem, clearCart, cartItemCount };
}
