import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import PromoBanner from '@/components/PromoBanner';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const dealCategories = [
  { label: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center' },
  { label: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop&crop=center' },
  { label: 'Fashion', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=150&h=150&fit=crop&crop=center' },
  { label: 'Appliances', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop&crop=center' },
  { label: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&h=150&fit=crop&crop=center' },
  { label: 'Home', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&h=150&fit=crop&crop=center' },
  { label: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba24e200?w=150&h=150&fit=crop&crop=center' },
  { label: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&h=150&fit=crop&crop=center' },
  { label: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop&crop=center' },
  { label: 'Toys', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=150&h=150&fit=crop&crop=center' },
];

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useProducts(search, category);
  const { data: categories } = useCategories();

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams();
    if (cat !== 'All') params.set('category', cat);
    setSearchParams(params);
  };

  const scrollDeals = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'right' ? 260 : -260, behavior: 'smooth' });
  };

  const showHomeContent = !search && category === 'All';

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-3 sm:px-4 py-3 sm:py-4 w-full space-y-3">
        {/* Hero Banner */}
        {showHomeContent && <PromoBanner />}

        {/* Category Circles */}
        {showHomeContent && (
          <section className="bg-white border border-[#e8e8e8] rounded-sm p-3 sm:p-4">
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-1">
              {dealCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.label)}
                  className="shrink-0 flex flex-col items-center gap-1.5 w-[72px] sm:w-[84px] hover:opacity-80 transition-opacity"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f6f7fb] border border-[#e8e8e8] overflow-hidden">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-[#212121] font-medium whitespace-nowrap">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Deals Carousel */}
        {showHomeContent && products && products.length > 5 && (
          <section className="bg-white border border-[#e8e8e8] rounded-sm p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#212121]">Deals of the Day</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => scrollDeals('left')} className="w-8 h-8 rounded-full bg-[#f0f0f0] hover:bg-[#e8e8e8] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button onClick={() => scrollDeals('right')} className="w-8 h-8 rounded-full bg-[#f0f0f0] hover:bg-[#e8e8e8] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar">
              {products.slice(0, 10).map((product) => (
                <div key={product.id} className="shrink-0 w-[180px] sm:w-[200px]">
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    discount={product.discount || 0}
                    images={product.images}
                    rating={product.rating}
                    rating_count={product.rating_count || 0}
                    brand={product.brand}
                    tagline={product.tagline}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Product Grid */}
        <section className="bg-white border border-[#e8e8e8] rounded-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-[#212121]">
              {search ? `Results for "${search}"` : category !== 'All' ? category : 'Top Picks for You'}
            </h3>
            {!search && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {categories?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`shrink-0 text-xs whitespace-nowrap px-3 py-1.5 rounded-full border transition-colors ${
                      category === cat
                        ? 'text-[#2874f0] border-[#2874f0] bg-[#f0f5ff] font-semibold'
                        : 'text-[#555] border-[#e3e3e3] hover:border-[#c9c9c9]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {search && (
            <p className="text-sm text-[#6b7280] mb-3">
              Showing results for "<span className="font-semibold text-[#1f2937]">{search}</span>"
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-sm" />
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-[#6b7280]">No products found</p>
              <p className="text-sm text-[#9ca3af] mt-1">Try searching for something else</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {products?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  discount={product.discount || 0}
                  images={product.images}
                  rating={product.rating}
                  rating_count={product.rating_count || 0}
                  brand={product.brand}
                  tagline={product.tagline}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
