import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const { wishlistQuery, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const items = wishlistQuery.data || [];

  const handleMoveToCart = (productId: string) => {
    addToCart.mutate({ productId, quantity: 1 });
    toggleWishlist.mutate(productId);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6 w-full">
        <h1 className="text-lg font-bold text-[#212121] mb-4">My Wishlist ({items.length})</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#e6e6e6] p-16 text-center">
            <Heart className="w-14 h-14 text-[#e0e0e0] mx-auto mb-3" />
            <p className="text-[#212121] font-medium mb-1">Empty Wishlist</p>
            <p className="text-sm text-[#878787] mb-5">You have no items in your wishlist. Start adding!</p>
            <Link to="/"><Button className="bg-[#2874f0] text-white font-bold rounded-sm px-8">Explore Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => {
              const p = item.products as any;
              const discountedPrice = Math.round(Number(p.price) * (1 - (p.discount || 0) / 100));

              return (
                <div key={item.id} className="bg-white rounded-sm border border-[#e6e6e6] overflow-hidden hover:shadow-md transition-shadow group">
                  <Link to={`/product/${p.id}`} className="block p-4">
                    <div className="aspect-square flex items-center justify-center mb-3 overflow-hidden">
                      <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="text-sm text-[#212121] line-clamp-2 min-h-[36px]">{p.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] px-1.5 py-[1px] rounded-sm font-bold">
                        {Number(p.rating)} <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-[10px] text-[#878787]">({(p.rating_count || 0).toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[15px] font-bold text-[#212121]">₹{discountedPrice.toLocaleString()}</span>
                      {(p.discount || 0) > 0 && (
                        <>
                          <span className="text-xs text-[#878787] line-through">₹{Number(p.price).toLocaleString()}</span>
                          <span className="text-xs text-[#388e3c] font-bold">{p.discount}% off</span>
                        </>
                      )}
                    </div>
                  </Link>
                  <div className="border-t border-[#ececec] flex">
                    <button
                      onClick={() => handleMoveToCart(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-[#2874f0] hover:bg-[#f5f8ff] transition-colors border-r border-[#ececec]"
                    >
                      <ShoppingCart className="w-4 h-4" /> MOVE TO CART
                    </button>
                    <button
                      onClick={() => toggleWishlist.mutate(p.id)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-bold text-[#878787] hover:bg-[#fef2f2] hover:text-[#ff6161] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
