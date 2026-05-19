"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuService, MenuItem, OrderItem, OrderResponse } from "@/services/menuService";
import { Button } from "@/components/Button";
import { Search, ShoppingBag, Plus, Minus, X, CheckCircle2, Loader2, CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuSystem() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout State
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'QRIS'>('QRIS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderResponse | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const data = await menuService.getMenu();
      setItems(data);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const categories = ['All', 'Coffee', 'Non-Coffee', 'Food', 'Snacks'];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName || !tableNumber || cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // Import orderService dynamically or make sure it's imported at the top of the file
      // Actually we should import it at the top, I will do a multi_replace for that, but for now I can just use a local require or fetch if needed.
      // Wait, I will use multi_replace to add the import and update the function.
      // For this replace_file_content, I'll assume we can use the updated function logic.
      
      const { orderService } = await import('@/services/orderService');
      
      const res = await orderService.createOrder({
        items: cart,
        customerName,
        tableNumber,
        paymentMethod,
        totalPrice: cartTotal
      });

      setOrderSuccess({ success: true, orderId: res.order_number });
      setCart([]); // clear cart
    } catch (error: any) {
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                activeCategory === cat ? "bg-brand-amber text-black" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search menu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-amber transition-colors"
          />
        </div>
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-brand-amber animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="glass-card p-6 flex flex-col justify-between group hover:border-brand-amber/30 transition-colors">
              <div>
                <p className="text-xs text-brand-amber mb-2 uppercase tracking-widest">{item.category}</p>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-bold text-white">{item.name}</h4>
                  <span className="text-white/90 font-medium">${item.price}</span>
                </div>
                <p className="text-sm text-white/50 mb-6">{item.description}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-brand-amber/10" onClick={() => addToCart(item)}>
                Add to Cart
              </Button>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/50">No items found matching your search.</div>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartItemCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-brand-amber text-black p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-transform flex items-center justify-center"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-amber" /> Your Order
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {orderSuccess ? (
                  <div className="text-center py-10 animate-fade-in">
                    <CheckCircle2 className="w-16 h-16 text-brand-amber mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Order Received!</h3>
                    <p className="text-white/60 mb-6">Please proceed to the cashier to complete your payment.</p>
                    <div className="bg-black/50 p-4 rounded-lg border border-white/5 mb-6">
                      <p className="text-sm text-white/50 uppercase mb-1">Order Number</p>
                      <p className="text-xl font-mono text-brand-amber font-bold">{orderSuccess.orderId}</p>
                    </div>
                    <Button onClick={() => { setOrderSuccess(null); setIsCartOpen(false); }} className="w-full">Back to Menu</Button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-brand-amber text-sm">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-black/50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-brand-amber text-white/70"><Minus className="w-4 h-4" /></button>
                            <span className="text-white w-4 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-brand-amber text-white/70"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-6 space-y-4">
                      <h4 className="text-white font-bold">Checkout Details</h4>
                      
                      <input type="text" placeholder="Your Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-amber" />
                      <input type="text" placeholder="Table Number (e.g. T12 or Walk-in)" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-amber" />
                      
                      <div>
                        <p className="text-sm text-white/50 mb-2">Payment Method</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setPaymentMethod('QRIS')} className={cn("flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors", paymentMethod === 'QRIS' ? "border-brand-amber bg-brand-amber/10 text-brand-amber" : "border-white/10 text-white/50")}>
                            <CreditCard className="w-4 h-4" /> QRIS / Card
                          </button>
                          <button onClick={() => setPaymentMethod('Cash')} className={cn("flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors", paymentMethod === 'Cash' ? "border-brand-amber bg-brand-amber/10 text-brand-amber" : "border-white/10 text-white/50")}>
                            <Banknote className="w-4 h-4" /> Cash
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!orderSuccess && cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/40">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/70 text-lg">Total</span>
                    <span className="text-2xl font-bold text-brand-amber">${cartTotal}</span>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full h-12" 
                    disabled={!customerName || !tableNumber || isSubmitting}
                    onClick={handleCheckout}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Order Now"}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
