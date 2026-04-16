import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    title: 'Hottest Deals on ACs',
    subtitle: 'From ₹19,990*',
    detail: 'Up to ₹7,500 cashback',
    gradient: 'from-[#e8f5e9] to-[#c8e6c9]',
    textDark: true,
    image: 'https://images.unsplash.com/photo-1631644281270-0f66bc0f2c96?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Electronics Mega Sale',
    subtitle: 'Up to 80% Off',
    detail: 'Top Brands at Best Prices',
    gradient: 'from-[#1a237e] to-[#283593]',
    textDark: false,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Fashion Top Deals',
    subtitle: 'Min 50% Off',
    detail: 'Trending collection',
    gradient: 'from-[#fce4ec] to-[#f8bbd0]',
    textDark: true,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Home & Kitchen',
    subtitle: 'Starting ₹149',
    detail: 'Daily essentials at best prices',
    gradient: 'from-[#fff3e0] to-[#ffe0b2]',
    textDark: true,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
  },
];

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative bg-white border border-[#e8e8e8] rounded-md overflow-hidden group">
      <div className="relative h-[180px] sm:h-[240px] md:h-[280px]">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className={`h-full w-full bg-gradient-to-r ${slide.gradient} flex items-center`}>
              <div className="flex-1 px-6 sm:px-10 md:px-16">
                <h2 className={`text-xl sm:text-3xl md:text-4xl font-bold leading-tight ${slide.textDark ? 'text-[#1a1a1a]' : 'text-white'}`}>
                  {slide.title}
                </h2>
                <p className={`mt-2 text-sm sm:text-lg font-semibold ${slide.textDark ? 'text-[#333]' : 'text-white/90'}`}>
                  {slide.subtitle}
                </p>
                <p className={`mt-1 text-xs sm:text-sm ${slide.textDark ? 'text-[#555]' : 'text-white/75'}`}>
                  {slide.detail}
                </p>
              </div>
              <div className="hidden sm:block w-[45%] h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-[#333]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-[#333]" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center py-2 gap-1.5">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all ${
              index === currentSlide ? 'w-5 h-1.5 bg-[#2874f0]' : 'w-1.5 h-1.5 bg-[#d0d4db] hover:bg-[#a0a4ab]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
