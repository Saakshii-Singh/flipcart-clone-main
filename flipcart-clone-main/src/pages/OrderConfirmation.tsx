import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { AppOrder } from '@/types/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => (id ? apiGet<AppOrder>(`/orders/${id}`) : null),
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-[720px] mx-auto px-4 py-8 w-full">
        <div className="bg-white rounded-sm border border-[#e6e6e6] overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-[#2874f0] to-[#4a93f5] p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Order Placed Successfully!</h1>
            <p className="text-white/80 text-sm">Your order has been confirmed and will be shipped soon</p>
          </div>

          {/* Order ID */}
          <div className="p-6 text-center border-b border-[#ececec]">
            <p className="text-xs text-[#878787] uppercase tracking-wider">Order ID</p>
            <p className="text-xl font-bold text-[#2874f0] font-mono mt-1">{id?.slice(0, 8).toUpperCase()}</p>
          </div>

          {order && (
            <>
              {/* Order Details */}
              <div className="p-6 space-y-3 border-b border-[#ececec]">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#878787]">
                    <Package className="w-4 h-4" />
                    <span>Items</span>
                  </div>
                  <span className="font-bold text-[#212121]">{order.order_items?.length || 0} items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#878787]">
                    <Truck className="w-4 h-4" />
                    <span>Status</span>
                  </div>
                  <span className="text-[#388e3c] font-bold capitalize bg-[#e8f5e9] px-2 py-0.5 rounded-sm text-xs">{order.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#878787]">Total Amount</span>
                  <span className="text-lg font-bold text-[#212121]">₹{Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="p-6 border-b border-[#ececec]">
                <h3 className="text-sm font-bold text-[#212121] mb-3">Ordered Items</h3>
                <div className="space-y-3">
                  {(order.order_items || []).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.products?.images?.[0] || '/placeholder.svg'} alt="" className="w-12 h-12 object-contain border border-[#ececec] rounded-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#212121] line-clamp-1">{item.products?.title}</p>
                        <p className="text-xs text-[#878787]">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="p-6 border-b border-[#ececec]">
                  <h3 className="text-sm font-bold text-[#212121] mb-2">Delivery Address</h3>
                  <p className="text-sm text-[#212121] font-medium">{order.address.name}</p>
                  <p className="text-sm text-[#878787]">{order.address.address}, {order.address.city} - {order.address.pincode}</p>
                  <p className="text-sm text-[#878787]">{order.address.state} | Phone: {order.address.phone}</p>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link to="/">
              <Button className="bg-[#2874f0] text-white font-bold px-8 py-2.5 rounded-sm w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="font-bold px-8 py-2.5 rounded-sm w-full sm:w-auto">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
