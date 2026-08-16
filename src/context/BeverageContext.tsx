import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Drink,
  CartItem,
  Order,
  BeverageCategory,
  ActiveView,
  CustomerInfo,
  OrderStatus,
  CupSize,
  IceLevel,
  SugarLevel,
  Topping
} from '../types';
import { DEFAULT_DRINKS, INITIAL_ORDERS } from '../data/defaultDrinks';

interface CustomizationParams {
  size: CupSize;
  ice: IceLevel;
  sugar: SugarLevel;
  toppings: Topping[];
  quantity: number;
  note?: string;
}

interface BeverageContextType {
  // Drinks
  drinks: Drink[];
  addDrink: (drink: Omit<Drink, 'id'>) => Drink;
  updateDrink: (id: string, updates: Partial<Drink>) => void;
  toggleDrinkAvailability: (id: string) => void;
  deleteDrink: (id: string) => void;
  resetDefaultDrinks: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (drink: Drink, customization?: Partial<CustomizationParams>) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: (notify?: boolean) => void;
  cartTotalCount: number;
  cartSubtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (customerInfo: CustomerInfo, customOrderId?: string, userId?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  resetDefaultOrders: () => void;

  // Navigation & UI
  activeCategory: BeverageCategory;
  setActiveCategory: (cat: BeverageCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  customizingDrink: Drink | null;
  setCustomizingDrink: (drink: Drink | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const BeverageContext = createContext<BeverageContextType | undefined>(undefined);

const STORAGE_KEY_DRINKS = 'siptea_drinks_v11';
const STORAGE_KEY_CART = 'siptea_cart_v2';
const STORAGE_KEY_ORDERS = 'siptea_orders_v2';

export const BeverageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Drinks state with localStorage & self-healing image URLs
  const [drinks, setDrinks] = useState<Drink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRINKS) || 
                    localStorage.getItem('siptea_drinks_v10') || 
                    localStorage.getItem('siptea_drinks_v9') || 
                    localStorage.getItem('siptea_drinks_v8') || 
                    localStorage.getItem('siptea_drinks_v7') || 
                    localStorage.getItem('siptea_drinks_v6') || 
                    localStorage.getItem('siptea_drinks_v5') || 
                    localStorage.getItem('siptea_drinks_v4') || 
                    localStorage.getItem('siptea_drinks_v3');
      if (saved) {
        const parsed: Drink[] = JSON.parse(saved);
        return parsed.map((d) => {
          if (d.id === 'drink-tea-4' || ((d.name.includes('包種') || d.name.includes('炭焙')) && (d.imageUrl.includes('photo-1563822249548') || !d.imageUrl.includes('photo-1629440400842')))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1629440400842-9108c0ccf336?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.id === 'drink-tea-1' || (d.name.includes('四季春') && (d.imageUrl.includes('photo-1576092768241') || d.imageUrl.includes('photo-1544787219') || d.imageUrl.includes('photo-1597481499')))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1641997827576-84d0a7e386bc?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.id === 'drink-other-4' || (d.name.includes('蜂蜜柚子') && (d.imageUrl.includes('photo-1556679343') || !d.imageUrl.includes('photo-1513558161293')))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' };
          }
          if (!d.imageUrl || d.imageUrl.includes('/images/kumquat_lemon_sparkling.jpg') || (d.id === 'drink-other-5' && d.imageUrl.includes('photo-1556679343-c7306c1976bc')) || (d.name.includes('金桔檸檬') && d.imageUrl.includes('photo-1556679343-c7306c1976bc'))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1594053186687-7788bbcd6ea6?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.imageUrl.includes('photo-1579887829663-6f10f5421c5f')) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.id === 'drink-tea-3' || (d.name.includes('茉莉') && d.imageUrl.includes('photo-1514432324607-a09d9b4aefdd'))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.id === 'drink-other-1' || (d.name.includes('香橙') && (d.imageUrl.includes('photo-1513558161293-cdaf765ed2fd') || d.imageUrl.includes('photo-1536935338788-846bb9981813')))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80' };
          }
          if (d.id === 'drink-other-3' || (d.name.includes('冬瓜檸檬') && d.imageUrl.includes('photo-1525385133512-2f3bdd039054'))) {
            return { ...d, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' };
          }
          return d;
        });
      }
    } catch {
      // Fallback
    }
    return DEFAULT_DRINKS;
  });

  // 2. Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // 3. Orders state with localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ORDERS as Order[];
  });

  // 4. UI States
  const [activeCategory, setActiveCategory] = useState<BeverageCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('menu');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [customizingDrink, setCustomizingDrink] = useState<Drink | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRINKS, JSON.stringify(drinks));
    } catch (e) {
      console.error('Failed to save drinks to localStorage', e);
    }
  }, [drinks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Drink operations
  const addDrink = (drinkData: Omit<Drink, 'id'>): Drink => {
    const newDrink: Drink = {
      ...drinkData,
      id: `drink-${Date.now()}`
    };
    setDrinks((prev) => [newDrink, ...prev]);
    showToast(`已成功新增「${newDrink.name}」商品！`);
    return newDrink;
  };

  const updateDrink = (id: string, updates: Partial<Drink>) => {
    setDrinks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    showToast('已更新飲料商品資訊！');
  };

  const toggleDrinkAvailability = (id: string) => {
    setDrinks((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = !d.isAvailable;
          showToast(`已將「${d.name}」切換為 ${next ? '上架' : '下架'}`);
          return { ...d, isAvailable: next };
        }
        return d;
      })
    );
  };

  const deleteDrink = (id: string) => {
    const target = drinks.find((d) => d.id === id);
    setDrinks((prev) => prev.filter((d) => d.id !== id));
    showToast(`已刪除「${target ? target.name : '商品'}」`);
  };

  const resetDefaultDrinks = () => {
    setDrinks(DEFAULT_DRINKS);
    showToast('已將飲料菜單重設為預設商品！');
  };

  // Cart operations
  const addToCart = (drink: Drink, customParams?: Partial<CustomizationParams>) => {
    if (!drink.isAvailable) {
      showToast('此商品目前已下架或售完');
      return;
    }

    const size = customParams?.size || '大杯 (L - 700ml)';
    const sizePriceDiff = size.includes('大杯') ? 10 : 0;
    const ice = customParams?.ice || (drink.recommendedIce as IceLevel) || '微冰';
    const sugar = customParams?.sugar || (drink.recommendedSweetness as SugarLevel) || '微糖 (3分)';
    const toppings = customParams?.toppings || [];
    const quantity = customParams?.quantity || 1;
    const itemNote = customParams?.note || '';

    const toppingTotal = toppings.reduce((sum, t) => sum + t.price, 0);
    const finalUnitPrice = drink.price + sizePriceDiff + toppingTotal;
    const subtotal = finalUnitPrice * quantity;

    // Generate unique signature for customized item to stack same customizations
    const toppingKey = toppings
      .map((t) => t.id)
      .sort()
      .join(',');
    const cartItemId = `${drink.id}_${size}_${ice}_${sugar}_${toppingKey}_${itemNote}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          subtotal: next[existingIndex].finalUnitPrice * newQty
        };
        return next;
      } else {
        const newItem: CartItem = {
          cartItemId,
          drinkId: drink.id,
          name: drink.name,
          imageUrl: drink.imageUrl,
          category: drink.category,
          basePrice: drink.price,
          size,
          sizePriceDiff,
          ice,
          sugar,
          toppings,
          toppingTotal,
          finalUnitPrice,
          quantity,
          subtotal,
          itemNote
        };
        return [...prev, newItem];
      }
    });

    showToast(`已將「${drink.name}」加入購物車 (${quantity} 杯)`);
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              subtotal: item.finalUnitPrice * nextQty
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('已從購物車移除品項');
  };

  const clearCart = (notify = true) => {
    setCart([]);
    if (notify) {
      showToast('已清空購物車所有品項');
    }
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Orders operations
  const placeOrder = (customerInfo: CustomerInfo, customOrderId?: string, userId?: string): Order => {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const deliveryFee = customerInfo.orderType === 'delivery' && subtotal < 500 ? 30 : 0;
    const discount = 0;
    const totalAmount = subtotal + deliveryFee - discount;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = customOrderId ? `SIP-${customOrderId}` : `SIP-${randomNum}`;

    const newOrder: Order = {
      id: customOrderId ? `ord-${customOrderId}` : `ord-${Date.now()}`,
      orderNumber,
      userId,
      createdAt: new Date().toISOString(),
      items: [...cart],
      totalQuantity,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      customerInfo,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: '訂單已送出，等待店家確認'
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCartDrawerOpen(false);
    setActiveView('order-success');
    showToast(`訂單 ${orderNumber} 送出成功！`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statusHistory = o.statusHistory || [];
          return {
            ...o,
            status,
            statusHistory: [
              ...statusHistory,
              {
                status,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return o;
      })
    );
    // Also update active order if tracking
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast('訂單狀態已更新');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('已刪除該筆訂單記錄');
  };

  const resetDefaultOrders = () => {
    setOrders(INITIAL_ORDERS as Order[]);
    showToast('已重設為預設展示訂單');
  };

  return (
    <BeverageContext.Provider
      value={{
        drinks,
        addDrink,
        updateDrink,
        toggleDrinkAvailability,
        deleteDrink,
        resetDefaultDrinks,
        cart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        resetDefaultOrders,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        customizingDrink,
        setCustomizingDrink,
        toastMessage,
        showToast
      }}
    >
      {children}
    </BeverageContext.Provider>
  );
};

export const useBeverage = () => {
  const context = useContext(BeverageContext);
  if (!context) {
    throw new Error('useBeverage must be used within a BeverageProvider');
  }
  return context;
};
