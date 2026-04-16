import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { WishlistViewItem } from '@/types/app';
import { toast } from '@/hooks/use-toast';

export function useWishlist() {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => apiGet<WishlistViewItem[]>('/wishlist'),
  });

  const toggleWishlist = useMutation({
    mutationFn: async (productId: string) => {
      return apiPost<{ added: boolean }>('/wishlist/toggle', { productId });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: result.added ? 'Added to wishlist' : 'Removed from wishlist' });
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistQuery.data?.some(item => item.product_id === productId) || false;
  };

  return { wishlistQuery, toggleWishlist, isInWishlist };
}
