"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { orderService, OrderRecord, OrderStatus } from "@/services/orderService";
import { Loader2, CheckCircle2, Clock, Coffee, Plus, Search } from "lucide-react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PAID' | 'PREPARING'>('PENDING');

  const fetchOrders = async () => {
    try {
      const data = await orderService.getActiveOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes on 'orders' table
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('Realtime change received!', payload);
        // Simplest way is to refetch all active orders to get items too,
        // or we could manually merge the payload into state.
        fetchOrders(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      // Optimistic UI update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      await orderService.updateOrderStatus(id, newStatus);
    } catch (error) {
      console.error(error);
      // Revert on error
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex gap-2 bg-black/50 p-1 rounded-lg">
          {(['PENDING', 'PAID', 'PREPARING'] as const).map(tab => {
            const count = orders.filter(o => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  activeTab === tab ? "bg-brand-amber text-black" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {tab}
                {count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab ? "bg-black/20" : "bg-white/10"
                  )}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
        
        {/* Placeholder for Walk-in Order / POS button */}
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New POS Order
        </Button>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-amber" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-white/30 border border-dashed border-white/10 rounded-2xl">
          <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No {activeTab.toLowerCase()} orders at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-xl shadow-black/50">
              {/* Card Header */}
              <div className={cn(
                "p-4 border-b border-white/10 flex justify-between items-center",
                order.status === 'PENDING' ? "bg-brand-orange/10" : "bg-white/5"
              )}>
                <div>
                  <h3 className="font-bold text-lg text-white">{order.table_number}</h3>
                  <p className="text-xs text-white/50">{order.customer_name} • {order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-amber">${order.total_amount}</p>
                  <p className="text-xs text-white/50">{order.payment_method}</p>
                </div>
              </div>
              
              {/* Card Body (Items) */}
              <div className="p-4 flex-1 overflow-y-auto max-h-48 space-y-3">
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-2 text-white/80">
                      <span className="font-medium text-white">{item.quantity}x</span>
                      <span>Item ID: {item.product_id}</span> 
                    </div>
                    <span className="text-white/40">${item.price_at_time * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              {/* Card Footer (Actions) */}
              <div className="p-4 border-t border-white/10 bg-white/5 grid grid-cols-2 gap-2">
                {order.status === 'PENDING' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full text-red-400 border-red-900/50 hover:bg-red-900/20" onClick={() => updateStatus(order.id, 'CANCELLED')}>Cancel</Button>
                    <Button variant="primary" size="sm" className="w-full" onClick={() => updateStatus(order.id, 'PAID')}>Mark Paid</Button>
                  </>
                )}
                {order.status === 'PAID' && (
                  <Button variant="outline" size="sm" className="col-span-2 text-brand-amber border-brand-amber/50 hover:bg-brand-amber/10" onClick={() => updateStatus(order.id, 'PREPARING')}>Send to Kitchen</Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button variant="outline" size="sm" className="col-span-2 text-green-400 border-green-900/50 hover:bg-green-900/20" onClick={() => updateStatus(order.id, 'COMPLETED')}>Complete Order</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
