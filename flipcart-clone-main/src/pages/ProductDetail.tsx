import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, Heart, ShieldCheck, Truck, Share2, Tag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useRef } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const { data: similarProducts } = useSimilarProducts(id!);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageIndex, setImageIndex] = useState(0);
  const similarRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6]">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
          <Skeleton className="aspect-square rounded-sm" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center">
        <p className="text-xl text-[#666]">Product not found</p>
        <Link to="/" className="text-[#2874f0] mt-2 inline-block">Go back to shop</Link>
      </div>
    </div>
  );

  const discountedPrice = Math.round(Number(product.price) * (1 - (product.discount || 0) / 100));
  const images = product.images?.length ? product.images : ['/placeholder.svg'];
  const wishlisted = isInWishlist(product.id);
  const specs = product.specifications || {};

  const scrollSimilar = (dir: 'left' | 'right') => {
    similarRef.current?.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-3 sm:px-4 py-3 space-y-3 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#878787] flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-[#2874f0]">Home</Link>
          <span>›</span>
          <Link to={`/?category=${product.category}`} className="hover:text-[#2874f0]">{product.category}</Link>
          <span>›</span>
          <span className="text-[#666] truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[440px_1fr] gap-3">
          {/* LEFT COLUMN - Images */}
          <section className="bg-white border border-[#e6e6e6] rounded-sm p-3 h-fit lg:sticky lg:top-20">
            <div className="grid grid-cols-[60px_1fr] gap-2.5">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[450px]">
                {images.slice(0, 6).map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setImageIndex(i)}
                    className={`w-[58px] h-[58px] shrink-0 border rounded-sm overflow-hidden transition-colors ${
                      i === imageIndex ? 'border-[#2874f0] shadow-sm' : 'border-[#ececec] hover:border-[#ccc]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative h-[320px] sm:h-[420px] border border-[#ececec] rounded-sm bg-white overflow-hidden flex items-center justify-center">
                <img src={images[imageIndex]} alt={product.title} className="max-h-full max-w-full object-contain p-4" />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                      className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-1 shadow-md hover:bg-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-1 shadow-md hover:bg-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Top-right icons */}
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <button
                    onClick={() => toggleWishlist.mutate(product.id)}
                    className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#ff6161] text-[#ff6161]' : 'text-[#999]'}`} />
                  </button>
                  <button className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
                    <Share2 className="w-4 h-4 text-[#999]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Button
                onClick={() => addToCart.mutate({ productId: product.id })}
                className="h-[52px] rounded-sm bg-[#ff9f00] hover:bg-[#f39a00] text-white text-[15px] font-bold shadow-sm"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> ADD TO CART
              </Button>
              <Button
                onClick={() => {
                  addToCart.mutate({ productId: product.id });
                  navigate('/cart');
                }}
                className="h-[52px] rounded-sm bg-[#fb641b] hover:bg-[#f05a10] text-white text-[15px] font-bold shadow-sm"
              >
                <Zap className="w-5 h-5 mr-2" /> BUY NOW
              </Button>
            </div>
          </section>

          {/* RIGHT COLUMN - Product Info */}
          <aside className="bg-white border border-[#e6e6e6] rounded-sm p-4 sm:p-5 space-y-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-[#2874f0] font-medium cursor-pointer hover:underline">
                Visit {product.brand} store
              </p>
            )}

            {/* Title */}
            <h1 className="text-base sm:text-lg font-medium text-[#212121] leading-snug">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white px-2 py-0.5 rounded-sm text-[13px] font-bold">
                {product.rating} <Star className="w-3 h-3 fill-current" />
              </span>
              <span className="text-sm text-[#878787] font-medium">{product.rating_count?.toLocaleString()} Ratings</span>
              <span className="ml-1">
                <svg width="66" height="14" viewBox="0 0 66 14">
                  <text x="0" y="11" fontSize="9" fontWeight="700" fill="#2874f0" fontFamily="Arial">F</text>
                  <text x="7" y="11" fontSize="8" fill="#878787" fontFamily="Arial">Assured</text>
                </svg>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2.5 flex-wrap">
              {(product.discount || 0) > 0 && (
                <span className="text-[#388e3c] text-sm font-bold">↓{product.discount}%</span>
              )}
              {(product.discount || 0) > 0 && (
                <span className="text-base text-[#878787] line-through">₹{Number(product.price).toLocaleString()}</span>
              )}
              <span className="text-[28px] font-bold text-[#212121]">₹{discountedPrice.toLocaleString()}</span>
            </div>

            {/* Extra Discount */}
            {product.extraDiscount && (
              <p className="text-xs text-[#388e3c] font-semibold">{product.extraDiscount}</p>
            )}

            {/* Offers */}
            <div className="rounded-sm border border-[#e0e0e0] bg-white overflow-hidden">
              <div className="px-3 py-2.5 bg-[#fafafa] border-b border-[#eee]">
                <p className="text-sm font-bold text-[#212121]">Available Offers</p>
              </div>
              <div className="p-3 space-y-2 text-sm text-[#212121]">
                {[
                  'Bank Offer: 5% Cashback on Flipkart Axis Bank Card',
                  'Bank Offer: 10% off on Kotak Bank Credit Card EMI Transactions',
                  'Special Price: Get extra discount (price inclusive of cashback)',
                  'Partner Offer: Sign up for Flipkart Pay Later and get gift card worth ₹100',
                ].map((offer, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#388e3c] mt-0.5 shrink-0" />
                    <span>{offer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3 py-3 border-t border-[#ededed]">
              <Truck className="w-5 h-5 text-[#2874f0] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#212121]">Delivery by Tomorrow</p>
                <p className="text-xs text-[#878787] mt-0.5">Free delivery on orders above ₹499</p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm py-2 border-t border-[#ededed]">
              <MapPin className="w-4 h-4 text-[#2874f0]" />
              {product.stock > 0 ? (
                <span className="text-[#388e3c] font-medium">In Stock ({product.stock} units available)</span>
              ) : (
                <span className="text-[#ff6161] font-medium">Currently Out of Stock</span>
              )}
            </div>

            {/* Warranty */}
            <div className="flex items-start gap-2 text-sm text-[#444] py-2 border-t border-[#ededed]">
              <ShieldCheck className="w-4 h-4 mt-0.5 text-[#2874f0] shrink-0" />
              <p>1 Year Manufacturer Warranty from the date of purchase</p>
            </div>

            {/* Highlights / Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="border-t border-[#ededed] pt-3">
                <h3 className="text-sm font-bold text-[#212121] mb-2.5">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key} className="border-b border-[#f5f5f5]">
                        <td className="text-[#878787] py-2 pr-4 w-[40%] align-top">{key}</td>
                        <td className="text-[#212121] py-2 font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Description */}
            <div className="border-t border-[#ededed] pt-3">
              <h3 className="text-sm font-bold text-[#212121] mb-2">Description</h3>
              <p className="text-sm text-[#4f4f4f] leading-relaxed">{product.description}</p>
            </div>
          </aside>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <section className="bg-white border border-[#e8e8e8] rounded-sm p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#212121]">Similar Products</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => scrollSimilar('left')} className="w-8 h-8 rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => scrollSimilar('right')} className="w-8 h-8 rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div ref={similarRef} className="flex gap-3 overflow-x-auto no-scrollbar">
              {similarProducts.map((p) => (
                <div key={p.id} className="shrink-0 w-[180px] sm:w-[200px]">
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    price={p.price}
                    discount={p.discount || 0}
                    images={p.images}
                    rating={p.rating}
                    rating_count={p.rating_count || 0}
                    tagline={p.tagline}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
