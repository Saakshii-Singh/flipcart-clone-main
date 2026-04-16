import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { AppOrder } from '@/types/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Search } from 'lucide-react';
import { useState } from 'react';

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiGet<AppOrder[]>('/orders'),
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders?.filter(order => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return order.id.toLowerCase().includes(term) ||
      order.order_items.some(item => item.products?.title?.toLowerCase().includes(term));
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[1000px] mx-auto px-4 py-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-[#212121]">My Orders</h1>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#e6e6e6] rounded-sm mb-3 p-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your orders here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm bg-[#f0f5ff] rounded-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2874f0]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-sm border border-[#e6e6e6] h-32 animate-pulse" />)}
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#e6e6e6] p-16 text-center">
            <ShoppingBag className="w-14 h-14 text-[#e0e0e0] mx-auto mb-3" />
            <p className="text-[#212121] font-medium mb-1">No orders yet</p>
            <p className="text-sm text-[#878787] mb-5">Looks like you haven't placed any orders</p>
            <Link to="/"><Button className="bg-[#2874f0] text-white font-bold rounded-sm px-8">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders?.map((order) => (
              <Link key={order.id} to={`/order/${order.id}`} className="block">
                <div className="bg-white rounded-sm border border-[#e6e6e6] hover:shadow-sm transition-shadow overflow-hidden">
                  <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[#fafafa] border-b border-[#ececec]">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-[#878787] text-xs">Order ID</span>
                        <p className="font-mono font-bold text-[#212121]">{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-[#878787] text-xs">Date</span>
                        <p className="font-medium text-[#212121]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <span className="text-[#878787] text-xs">Total</span>
                        <p className="font-bold text-[#212121]">₹{Number(order.total_amount).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#388e3c] text-white px-2.5 py-1 rounded-sm font-bold capitalize">{order.status}</span>
                  </div>
                  <div className="divide-y divide-[#f5f5f5]">
                    {(order.order_items as any[])?.map((item: any) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <img src={item.products?.images?.[0] || '/placeholder.svg'} alt="" className="w-14 h-14 object-contain shrink-0 border border-[#ececec] rounded-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#212121] line-clamp-1">{item.products?.title}</p>
                          <p className="text-xs text-[#878787] mt-0.5">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#388e3c] shrink-0">
                          <Package className="w-3.5 h-3.5" />
                          <span className="font-medium capitalize">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
