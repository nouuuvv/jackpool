import { supabase } from '@/lib/supabase';
import { OrderItem } from './menuService'; // Reusing types from menuService for now

export interface OrderPayload {
  customerName: string;
  tableNumber: string;
  paymentMethod: 'Cash' | 'QRIS';
  totalPrice: number;
  items: OrderItem[];
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  table_number: string;
  total_amount: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  notes?: string;
  // Join fields from products table if queried
  products?: {
    name: string;
  };
}

export const orderService = {
  /**
   * Create a new order (Used by Customer Web & POS)
   */
  async createOrder(payload: OrderPayload) {
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // 1. Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: payload.customerName,
        table_number: payload.tableNumber,
        total_amount: payload.totalPrice,
        payment_method: payload.paymentMethod,
        status: 'PENDING'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      throw new Error(orderError.message);
    }

    // 2. Insert into order_items table
    // Note: If you have strict FK constraints and the products aren't in the DB yet,
    // this might fail. We assume the product_id exists in the products table.
    const orderItemsPayload = payload.items.map(item => ({
      order_id: orderData.id,
      product_id: item.id, // ID from menuService
      quantity: item.quantity,
      price_at_time: item.price,
      notes: ''
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error('Failed to insert order items:', itemsError);
      // We don't rollback for now, just throw
      throw new Error(itemsError.message);
    }

    return orderData;
  },

  /**
   * Get today's active orders (Used by Admin POS)
   */
  async getActiveOrders(): Promise<OrderRecord[]> {
    // Get orders that are not completed/cancelled
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price_at_time,
          notes
        )
      `)
      .in('status', ['PENDING', 'PAID', 'PREPARING'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch orders:', error);
      throw new Error(error.message);
    }

    return data as OrderRecord[];
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, newStatus: OrderStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Failed to update order status:', error);
      throw new Error(error.message);
    }
  }
};
