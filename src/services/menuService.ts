export interface MenuItem {
  id: string;
  category: 'Coffee' | 'Non-Coffee' | 'Food' | 'Snacks';
  name: string;
  price: number;
  description: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface OrderDetails {
  items: OrderItem[];
  customerName: string;
  tableNumber: string;
  paymentMethod: 'Cash' | 'QRIS';
  totalPrice: number;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

const MENU_DB: MenuItem[] = [
  { id: 'c1', category: 'Coffee', name: 'Midnight Espresso', price: 6, description: 'Double shot, dark chocolate notes.' },
  { id: 'c2', category: 'Coffee', name: 'Velvet Latte', price: 7, description: 'Smooth milk, vanilla bean syrup, espresso.' },
  { id: 'nc1', category: 'Non-Coffee', name: "The Hustler's Citrus", price: 8, description: 'Sparkling yuzu, mint, agave.' },
  { id: 'nc2', category: 'Non-Coffee', name: 'Neon Matcha', price: 7.5, description: 'Premium matcha, oat milk, honey.' },
  { id: 'f1', category: 'Food', name: 'Truffle Fries', price: 12, description: 'Parmesan, white truffle oil, parsley.' },
  { id: 'f2', category: 'Food', name: 'Wagyu Sliders', price: 18, description: 'Twin sliders, cheddar, caramelized onions.' },
  { id: 's1', category: 'Snacks', name: 'Spicy Wings', price: 14, description: 'Gochujang glaze, sesame, scallion.' },
  { id: 's2', category: 'Snacks', name: 'Salted Edamame', price: 6, description: 'Steamed edamame, sea salt flakes.' },
];

export const menuService = {
  /**
   * Fetch all menu items
   */
  async getMenu(): Promise<MenuItem[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MENU_DB;
  },

  /**
   * Submit an order
   */
  async submitOrder(order: OrderDetails): Promise<OrderResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Simulate failure chance
    if (Math.random() < 0.05) {
      throw new Error("Failed to process order. Please try again.");
    }
    
    return {
      success: true,
      orderId: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }
};
