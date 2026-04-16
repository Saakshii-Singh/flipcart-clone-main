import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import type { AppProduct } from '@/types/app';

export default function Cart() {
  const { cartQuery, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cartQuery.data?.items || [];

  const mrpTotal = items.reduce((sum, item) => {
    const product = item.products as AppProduct;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    const product = item.products as AppProduct;
    const price = Number(product.price);
    const discount = product.discount || 0;
    const discountedPrice = Math.round(price * (1 - discount / 100));
    return sum + discountedPrice * item.quantity;
  }, 0);

  const totalDiscount = Math.max(0, mrpTotal - subtotal);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (cartQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6]">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-4 py-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full">
        {items.length === 0 ? (
          <div className="bg-white border border-[#e6e6e6] rounded-sm p-8 sm:p-16 text-center">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty Cart" className="w-40 h-40 object-contain mx-auto mb-4" />
            <p className="text-lg font-medium text-[#212121] mb-1">Your cart is empty!</p>
            <p className="text-sm text-[#878787] mb-5">Add items to it now.</p>
            <Link to="/">
              <Button className="bg-[#2874f0] text-white px-10 py-2.5 rounded-sm font-bold">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_340px] gap-3">
            {/* Left Column - Cart Items */}
            <section className="space-y-3">
              <div className="bg-white border border-[#e6e6e6] rounded-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center border-b border-[#ececec]">
                  <button className="px-5 py-3 text-sm font-bold border-b-[3px] border-[#2874f0] text-[#2874f0]">
                    Flipkart ({items.length})
                  </button>
                  <button className="px-5 py-3 text-sm text-[#878787] font-medium">Grocery</button>
                </div>

                {/* Delivery Address */}
                <div className="px-4 py-3 border-b border-[#ececec] bg-[#fafbff] flex items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="text-[#878787]">Deliver to: </span>
                    <span className="font-bold text-[#212121]">Default User, 560001</span>
                  </div>
                  <button className="text-[#2874f0] font-bold text-xs border border-[#e0e0e0] px-3 py-1.5 rounded-sm hover:bg-[#f5f8ff]">
                    Change
                  </button>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#f0f0f0]">
                  {items.map((item) => {
                    const product = item.products as AppProduct;
                    const price = Number(product.price);
                    const discount = product.discount || 0;
                    const discountedPrice = Math.round(price * (1 - discount / 100));

                    return (
                      <article key={item.id} className="p-4">
                        <div className="flex gap-3 sm:gap-5">
                          <Link to={`/product/${product.id}`} className="shrink-0 w-[112px] h-[112px] border border-[#f0f0f0] rounded-sm overflow-hidden bg-white flex items-center justify-center">
                            <img
                              src={product.images?.[0] || '/placeholder.svg'}
                              alt={product.title}
                              className="max-w-full max-h-full object-contain"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="text-sm text-[#212121] line-clamp-2 hover:text-[#2874f0] transition-colors">{product.title}</h3>
                            </Link>
                            <p className="text-xs text-[#878787] mt-1">Seller: RetailNet 
                              <span className="ml-1.5 inline-flex items-center">
                                <svg width="50" height="10" viewBox="0 0 50 10"><text x="0" y="9" fontSize="7" fontWeight="700" fill="#2874f0" fontFamily="Arial">F</text><text x="5" y="9" fontSize="6" fill="#878787" fontFamily="Arial">Assured</text></svg>
                              </span>
                            </p>

                            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                              <span className="text-[17px] font-bold text-[#212121]">₹{discountedPrice.toLocaleString()}</span>
                              {discount > 0 && (
                                <>
                                  <span className="text-sm text-[#878787] line-through">₹{price.toLocaleString()}</span>
                                  <span className="text-sm text-[#388e3c] font-semibold">{discount}% off</span>
                                </>
                              )}
                            </div>

                            <p className="text-xs text-[#388e3c] mt-1 font-medium">
                              Delivery by Tomorrow | <span className="text-[#878787]">Free</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity + Actions Row */}
                        <div className="flex items-center gap-4 mt-3 ml-[calc(112px+12px)] sm:ml-[calc(112px+20px)]">
                          {/* Quantity */}
                          <div className="flex items-center border border-[#d6d6d6] rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                              disabled={item.quantity <= 1}
                              className="w-[30px] h-[30px] flex items-center justify-center hover:bg-[#f7f7f7] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold border-x border-[#d6d6d6] h-[30px] flex items-center justify-center bg-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                              className="w-[30px] h-[30px] flex items-center justify-center hover:bg-[#f7f7f7]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button className="text-sm font-bold text-[#212121] hover:text-[#2874f0] uppercase">Save for later</button>
                          <button
                            onClick={() => removeItem.mutate(item.id)}
                            className="text-sm font-bold text-[#212121] hover:text-[#ff6161] uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Place Order Strip at Bottom */}
              <div className="bg-white border border-[#e6e6e6] rounded-sm p-4 flex items-center justify-between sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-2 text-xs text-[#878787]">
                  <ShieldCheck className="w-5 h-5 text-[#878787]" />
                  Safe and secure payments. Easy returns. 100% Authentic products.
                </div>
                <Button
                  onClick={() => navigate('/checkout')}
                  className="h-12 rounded-sm bg-[#fb641b] hover:bg-[#f05a10] text-white font-bold px-8 text-[15px] shadow-sm"
                >
                  PLACE ORDER
                </Button>
              </div>
            </section>

            {/* Right Column - Price Details */}
            <aside className="bg-white border border-[#e6e6e6] rounded-sm h-fit lg:sticky lg:top-20">
              <div className="p-4 border-b border-[#ececec]">
                <h3 className="text-xs font-bold text-[#878787] uppercase tracking-wider">Price Details</h3>
              </div>

              <div className="p-4 space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#212121]">Price ({totalItems} items)</span>
                  <span className="text-[#212121]">₹{mrpTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#212121]">Discount</span>
                  <span className="text-[#388e3c] font-medium">−₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#212121]">Delivery Charges</span>
                  <span className="text-[#388e3c] font-medium">FREE</span>
                </div>
                <div className="border-t border-dashed border-[#e0e0e0] pt-3.5 flex justify-between font-bold text-[16px] text-[#212121]">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[#388e3c] font-bold text-sm border-t border-dashed border-[#e0e0e0] pt-3">
                  You will save ₹{totalDiscount.toLocaleString()} on this order
                </p>
              </div>

              <div className="p-4 border-t border-[#ececec]">
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full h-[50px] rounded-sm bg-[#fb641b] hover:bg-[#f05a10] text-white font-bold text-[15px]"
                >
                  PLACE ORDER
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
