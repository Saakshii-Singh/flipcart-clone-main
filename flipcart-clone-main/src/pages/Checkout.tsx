import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { apiPost } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import type { AppProduct } from '@/types/app';
import { Check } from 'lucide-react';

export default function Checkout() {
  const { cartQuery, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '',
  });

  const items = cartQuery.data?.items || [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const mrpTotal = items.reduce((sum, item) => {
    const product = item.products as AppProduct;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    const product = item.products as AppProduct;
    const price = Number(product.price);
    const discount = product.discount || 0;
    return sum + Math.round(price * (1 - discount / 100)) * item.quantity;
  }, 0);

  const totalDiscount = Math.max(0, Math.round(mrpTotal - subtotal));

  useEffect(() => {
    if (!cartQuery.isLoading && items.length === 0) {
      navigate('/cart');
    }
  }, [cartQuery.isLoading, items.length, navigate]);

  const handleSaveAddress = () => {
    if (!address.name || !address.phone || !address.pincode || !address.address || !address.city || !address.state) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setActiveStep(2);
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      const data = await apiPost<{ order: { id: string } }>('/orders', { address });
      await clearCart.mutateAsync();
      navigate(`/order/${data.order.id}`);
    } catch {
      toast({ title: 'Failed to place order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (cartQuery.isLoading || items.length === 0) {
    return <div className="min-h-screen bg-[#f1f3f6]"><Navbar /></div>;
  }

  const steps = [
    { num: 1, label: 'LOGIN', done: true },
    { num: 2, label: 'DELIVERY ADDRESS', done: activeStep >= 1 },
    { num: 3, label: 'ORDER SUMMARY', done: activeStep >= 2 },
    { num: 4, label: 'PAYMENT OPTIONS', done: false },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] mx-auto px-3 sm:px-4 py-4 sm:py-6 grid lg:grid-cols-[1fr_340px] gap-3 w-full">
        <section className="space-y-3">
          {/* Stepper */}
          <div className="bg-white border border-[#e6e6e6] rounded-sm p-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-2 shrink-0">
                  {i > 0 && <span className="text-[#e0e0e0]">─────</span>}
                  <span className={`flex items-center gap-1.5 ${
                    step.done ? 'text-[#2874f0]' : 'text-[#878787]'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      step.done ? 'bg-[#2874f0] text-white' : 'bg-[#f0f0f0] text-[#878787]'
                    }`}>
                      {step.done && step.num < (activeStep === 0 ? 1 : activeStep + 1) ? <Check className="w-3 h-3" /> : step.num}
                    </span>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address Form */}
          <div className="bg-white border border-[#e6e6e6] rounded-sm overflow-hidden">
            <div className={`p-4 border-b border-[#ececec] ${activeStep >= 1 ? 'bg-[#2874f0]' : 'bg-[#f5f5f5]'}`}>
              <h2 className={`text-sm font-bold uppercase ${activeStep >= 1 ? 'text-white' : 'text-[#878787]'}`}>
                Delivery Address
              </h2>
            </div>
            {activeStep <= 1 && (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Full Name *" value={address.name} onChange={e => setAddress(a => ({...a, name: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2] focus:border-[#2874f0]" />
                <Input placeholder="Phone Number *" value={address.phone} onChange={e => setAddress(a => ({...a, phone: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2]" />
                <Input placeholder="Pincode *" value={address.pincode} onChange={e => setAddress(a => ({...a, pincode: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2]" />
                <Input placeholder="Locality" value={address.locality} onChange={e => setAddress(a => ({...a, locality: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2]" />
                <Input placeholder="Address (Area and Street) *" value={address.address} onChange={e => setAddress(a => ({...a, address: e.target.value}))} className="sm:col-span-2 rounded-sm h-11 border-[#c2c2c2]" />
                <Input placeholder="City/District/Town *" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2]" />
                <Input placeholder="State *" value={address.state} onChange={e => setAddress(a => ({...a, state: e.target.value}))} className="rounded-sm h-11 border-[#c2c2c2]" />
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={handleSaveAddress} className="bg-[#fb641b] hover:bg-[#f05a10] text-white px-10 py-2.5 rounded-sm font-bold">
                    SAVE AND DELIVER HERE
                  </Button>
                </div>
              </div>
            )}
            {activeStep > 1 && (
              <div className="p-4 text-sm text-[#212121]">
                <p className="font-bold">{address.name}</p>
                <p className="text-[#878787] mt-0.5">{address.address}, {address.locality}, {address.city} - {address.pincode}, {address.state}</p>
                <p className="text-[#878787]">{address.phone}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[#e6e6e6] rounded-sm overflow-hidden">
            <div className={`p-4 border-b border-[#ececec] ${activeStep >= 2 ? 'bg-[#2874f0]' : 'bg-[#f5f5f5]'}`}>
              <h2 className={`text-sm font-bold uppercase ${activeStep >= 2 ? 'text-white' : 'text-[#878787]'}`}>
                Order Summary
              </h2>
            </div>
            {activeStep >= 2 && (
              <div className="divide-y divide-[#f0f0f0]">
                {items.map((item) => {
                  const product = item.products as AppProduct;
                  const discountedPrice = Math.round(Number(product.price) * (1 - (product.discount || 0) / 100));
                  return (
                    <article key={item.id} className="p-4 flex gap-3">
                      <div className="w-16 h-16 border border-[#ececec] rounded-sm bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={product.images?.[0] || '/placeholder.svg'} alt={product.title} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#212121] line-clamp-1">{product.title}</p>
                        <p className="text-xs text-[#878787] mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-[#212121] mt-1">₹{(discountedPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </article>
                  );
                })}
                <div className="p-4">
                  <Button onClick={handleOrder} disabled={loading} className="w-full sm:w-auto bg-[#fb641b] hover:bg-[#f05a10] text-white px-10 py-2.5 rounded-sm font-bold">
                    {loading ? 'Placing Order...' : 'PLACE ORDER'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Price Sidebar */}
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
        </aside>
      </main>

      <Footer />
    </div>
  );
}
