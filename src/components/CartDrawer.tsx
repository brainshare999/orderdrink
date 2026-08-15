import React from 'react';
import { useBeverage } from '../context/BeverageContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CupSoda,
  Tag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartTotalCount,
    cartSubtotal,
    setActiveView
  } = useBeverage();

  if (!isCartDrawerOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  const deliveryThreshold = 500;
  const needMoreForFreeDelivery = Math.max(0, deliveryThreshold - cartSubtotal);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-content"
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-800 flex items-center justify-center text-amber-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                我的購物車
                <span className="text-xs bg-amber-700/70 text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                  共 {cartTotalCount} 杯
                </span>
              </h2>
              <p className="text-xs text-stone-400">拾茶時光 即時線上點餐</p>
            </div>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartDrawerOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner Indicator */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-medium">
          {needMoreForFreeDelivery === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>恭喜已達 $500 免外送費門檻！</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-700" />
              <span>
                再加購 <span className="font-bold text-amber-800">NT$ {needMoreForFreeDelivery}</span> 即可享外送免運費
              </span>
            </div>
          )}
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <CupSoda className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800">購物車目前是空的</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                  挑選一杯台灣原茶、濃郁鮮奶茶或清爽手作水果茶來享受好心情吧！
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveView('menu');
                }}
                className="px-5 py-2.5 rounded-2xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 shadow-sm transition-all"
              >
                前往瀏覽飲料菜單
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-stone-600">
                  購物清單明細 ({cart.length} 種品項)
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  清空購物車
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  id={`cart-item-${item.cartItemId}`}
                  className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-2xs hover:border-amber-300 transition-all flex flex-col gap-2.5"
                >
                  {/* Top row: Image + Name + Delete */}
                  <div className="flex gap-3 items-start">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-stone-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                          title="刪除此商品"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Custom Specs Badges */}
                      <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                        <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-medium">
                          {item.size.split(' ')[0]}
                        </span>
                        <span className="bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                          {item.sugar.split(' ')[0]}
                        </span>
                        <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                          {item.ice}
                        </span>
                        {item.toppings.map((top) => (
                          <span
                            key={top.id}
                            className="bg-amber-800/10 text-amber-900 px-1.5 py-0.5 rounded font-bold"
                          >
                            +{top.name}
                          </span>
                        ))}
                      </div>

                      {item.itemNote && (
                        <p className="text-[11px] text-stone-500 mt-1 italic">
                          備註: {item.itemNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom row: Unit Price, Stepper (+ / -), Subtotal */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="text-xs text-stone-500">
                      單價 <span className="font-bold text-stone-800">NT$ {item.finalUnitPrice}</span>
                    </div>

                    {/* Quantity Stepper (+ / -) */}
                    <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center shadow-2xs transition-colors"
                        title="減少數量"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center shadow-2xs transition-colors"
                        title="增加數量"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Subtotal (小計) */}
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">小計</span>
                      <span className="text-sm font-black text-amber-900">
                        NT$ {item.subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer: Total & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 shrink-0 space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>商品小計 ({cartTotalCount} 杯)</span>
                <span className="font-bold text-stone-800">NT$ {cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>預估外送費 (滿 $500 免運)</span>
                <span className="font-medium text-stone-800">
                  {cartSubtotal >= 500 ? '免外送費 ($0)' : '自取 $0 / 外送 $30'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900">訂單總金額</span>
                <div className="flex items-baseline gap-1 text-amber-900">
                  <span className="text-xs font-bold">NT$</span>
                  <span className="text-2xl font-black">{cartSubtotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-checkout-btn"
              onClick={handleGoToCheckout}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>前往結帳確認</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
