import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  discount: number;
  images: string[];
  rating: number;
  rating_count: number;
  brand?: string;
  tagline?: string;
}

export default function ProductCard({ id, title, price, discount, images, rating, rating_count, brand, tagline }: ProductCardProps) {
  const discountedPrice = Math.round(price * (1 - discount / 100));
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);

  return (
    <div className="bg-white border border-[#e8e8e8] hover:shadow-lg transition-all duration-200 p-2.5 sm:p-3 group relative h-full flex flex-col rounded-sm">
      {/* Tagline Badge */}
      {tagline && (
        <span className="absolute top-2 left-2 z-10 bg-[#ff6161] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
          {tagline}
        </span>
      )}

      {/* Wishlist Heart */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist.mutate(id); }}
        className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#ff6161] text-[#ff6161]' : 'text-[#c2c2c2]'}`} />
      </button>

      <Link to={`/product/${id}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="aspect-square flex items-center justify-center overflow-hidden mb-2.5 bg-white">
          <img
            src={images?.[0] || '/placeholder.svg'}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] sm:text-[11px] px-1.5 py-[1px] rounded-sm font-semibold">
              {rating} <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#878787] font-medium">({rating_count.toLocaleString()})</span>
          </div>

          {/* Title */}
          <h3 className="text-[12px] sm:text-[13px] text-[#212121] line-clamp-2 leading-[1.35] min-h-[32px]">{title}</h3>

          {/* Price */}
          <div className="flex items-center gap-1.5 mt-auto flex-wrap">
            <span className="text-sm sm:text-[15px] font-bold text-[#212121]">₹{discountedPrice.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="text-[10px] sm:text-xs text-[#878787] line-through">₹{price.toLocaleString()}</span>
                <span className="text-[10px] sm:text-xs text-[#388e3c] font-semibold">{discount}% off</span>
              </>
            )}
          </div>

          {/* Assured & Free Delivery */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#878787]">Free delivery</span>
            <span className="flex items-center gap-0.5">
              <svg width="56" height="12" viewBox="0 0 56 12" fill="none">
                <text x="0" y="10" fontSize="7.5" fontWeight="700" fill="#2874f0" fontFamily="Arial">F</text>
                <text x="6" y="10" fontSize="7" fill="#878787" fontFamily="Arial">Assured</text>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
