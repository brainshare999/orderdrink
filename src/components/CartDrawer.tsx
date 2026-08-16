import React, { useState } from 'react';
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
  Tag,
  AlertTriangle
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

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  const handleConfirmClear = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const deliveryThreshold = 500;
  const needMoreForFreeDelivery = Math.max(0, deliveryThreshold - cartSubtotal);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-content"
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col shadow-2xl animate-slide-left border-l border-stone-200 dark:border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-white flex items-center justify-between shrink-0">
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Banner Indicator */}
        <div className="bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium">
          {needMoreForFreeDelivery === 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>恭喜已達 $500 免外送費門檻！</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>
                再加購 <span className="font-bold text-amber-800 dark:text-amber-300">NT$ {needMoreForFreeDelivery}</span> 即可享外送免運費
              </span>
            </div>
          )}
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 dark:text-stone-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-stone-800 border border-amber-200/60 dark:border-stone-700 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <CupSoda className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-100">購物車目前是空的</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs leading-relaxed">
                  挑選一杯台灣原茶、濃郁鮮奶茶或清爽手作水果茶來享受好心情吧！
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setActiveView('menu');
                }}
                className="px-5 py-2.5 rounded-2xl bg-amber-800 dark:bg-amber-700 hover:bg-amber-900 dark:hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                前往瀏覽飲料菜單
              </button>
            </div>
          ) : (
            <>
              {/* Clear Confirmation Prompt */}
              {showClearConfirm && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-3.5 mb-2 flex flex-col gap-2.5 animate-fade-in shadow-xs">
                  <div className="flex items-start gap-2.5 text-rose-900 dark:text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-950 dark:text-rose-100">確定要清空購物車嗎？</h4>
                      <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">清空後購物車內所有飲品與客製化設定將全數清除。</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      保留品項
                    </button>
                    <button
                      type="button"
                      id="confirm-clear-cart-btn"
                      onClick={handleConfirmClear}
                      className="px-3.5 py-1 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      確定清空
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                  購物清單明細 ({cart.length} 種品項)
                </span>
                <button
                  type="button"
                  id="header-clear-cart-btn"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  清空購物車
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  id={`cart-item-${item.cartItemId}`}
                  className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 p-3.5 shadow-2xs hover:border-amber-300 dark:hover:border-amber-600 transition-all flex flex-col gap-2.5"
                >
                  {/* Top row: Image + Name + Delete */}
                  <div className="flex gap-3 items-start">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-100 dark:border-stone-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-400 dark:text-stone-500 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                          title="刪除此商品"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Custom Specs Badges */}
                      <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                        <span className="bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded font-medium">
                          {item.size.split(' ')[0]}
                        </span>
                        <span className="bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
                          {item.sugar.split(' ')[0]}
                        </span>
                        <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                          {item.ice}
                        </span>
                        {item.toppings.map((top) => (
                          <span
                            key={top.id}
                            className="bg-amber-800/10 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold"
                          >
                            +{top.name}
                          </span>
                        ))}
                      </div>

                      {item.itemNote && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 italic">
                          備註: {item.itemNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom row: Unit Price, Stepper (+ / -), Subtotal */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2">
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      單價 <span className="font-bold text-stone-800 dark:text-stone-200">NT$ {item.finalUnitPrice}</span>
                    </div>

                    {/* Quantity Stepper (+ / -) */}
                    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-700 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-600 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                        title="減少數量"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-xs text-stone-800 dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-600 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                        title="增加數量"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Subtotal (小計) */}
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">小計</span>
                      <span className="text-sm font-black text-amber-900 dark:text-amber-400">
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
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 shrink-0 space-y-3">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>商品小計 ({cartTotalCount} 杯)</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">NT$ {cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>預估外送費 (滿 $500 免運)</span>
                <span className="font-medium text-stone-800 dark:text-stone-300">
                  {cartSubtotal >= 500 ? '免外送費 ($0)' : '自取 $0 / 外送 $30'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">訂單總金額</span>
                <div className="flex items-baseline gap-1 text-amber-900 dark:text-amber-400">
                  <span className="text-xs font-bold">NT$</span>
                  <span className="text-2xl font-black">{cartSubtotal}</span>
                </div>
              </div>
            </div>

            {/* Actions: Clear / Cancel & Checkout */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                id="footer-clear-cart-btn"
                onClick={() => setShowClearConfirm(true)}
                className="col-span-1 py-3.5 px-3 rounded-2xl border border-stone-300 dark:border-stone-700 hover:border-rose-300 text-stone-600 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400 bg-white dark:bg-stone-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 active:scale-[0.98] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="清空購物車"
              >
                <Trash2 className="w-4 h-4 text-stone-400 group-hover:text-rose-500" />
                <span>清空</span>
              </button>
              <button
                id="cart-checkout-btn"
                onClick={handleGoToCheckout}
                className="col-span-2 py-3.5 px-4 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>前往結帳</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
