export type BeverageCategory = 'all' | 'tea' | 'milk_tea' | 'coffee' | 'other';

export interface CategoryInfo {
  id: BeverageCategory;
  name: string;
  enName: string;
  iconName: string;
  description: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Drink {
  id: string;
  name: string;
  englishName?: string;
  category: 'tea' | 'milk_tea' | 'coffee' | 'other';
  price: number;
  ingredients: string; // 成分說明
  description: string;
  imageUrl: string;
  isAvailable: boolean; // 上架 / 下架
  tags?: string[]; // e.g., '招牌推薦', '新品上市', '無咖啡因', '人氣No.1'
  calories?: number; // 熱量 (大卡)
  recommendedSweetness?: string;
  recommendedIce?: string;
}

export type IceLevel = '正常冰' | '少冰' | '微冰' | '去冰' | '完全去冰' | '溫熱' | '熱飲';
export type SugarLevel = '全糖 (10分)' | '少糖 (7分)' | '半糖 (5分)' | '微糖 (3分)' | '一分糖 (1分)' | '無糖 (0分)';
export type CupSize = '中杯 (M - 500ml)' | '大杯 (L - 700ml)' | '熱飲特杯 (500ml)';

export interface CartItem {
  cartItemId: string;
  drinkId: string;
  name: string;
  imageUrl: string;
  category: string;
  basePrice: number;
  size: CupSize;
  sizePriceDiff: number; // e.g. L +10
  ice: IceLevel;
  sugar: SugarLevel;
  toppings: Topping[];
  toppingTotal: number;
  finalUnitPrice: number;
  quantity: number;
  subtotal: number;
  itemNote?: string;
}

export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'linepay' | 'credit' | 'jko';

export interface CustomerInfo {
  name: string;
  phone: string;
  orderType: OrderType;
  pickupTime: string;
  address?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  customerInfo: CustomerInfo;
  status: OrderStatus;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export type ActiveView = 'menu' | 'cart' | 'checkout' | 'order-success' | 'order-status' | 'admin';
