import React, { useState } from 'react';
import { useBeverage } from '../context/BeverageContext';
import { CustomerInfo, OrderType, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Clock,
  User,
  Phone,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ShoppingBag,
  AlertCircle,
  Trash2,
  Ban,
  AlertTriangle
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    setActiveView,
    placeOrder,
    clearCart,
    showToast,
    setIsCartDrawerOpen
  } = useBeverage();

  // Customer form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('15-20 分鐘後');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('linepay');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Delivery calculations
  const deliveryFee = orderType === 'delivery' && cartSubtotal < 500 ? 30 : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = '請填寫訂購人姓名';
    }
    if (!phone.trim()) {
      newErrors.phone = '請填寫聯絡手機電話';
    } else if (!/^09\d{8}$/.test(phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = '請輸入正確的台灣手機號碼 (例如: 0912345678)';
    }

    if (orderType === 'delivery' && !address.trim()) {
      newErrors.address = '外送服務請務必填寫完整外送地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setActiveView('menu');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const customerInfo: CustomerInfo = {
      name: name.trim(),
      phone: phone.trim(),
      orderType,
      pickupTime,
      address: orderType === 'delivery' ? address.trim() : undefined,
      paymentMethod,
      notes: notes.trim()
    };

    setTimeout(() => {
      // Trigger festive confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      placeOrder(customerInfo);
      setIsSubmitting(false);
      showToast('🎉 訂單已成功送出！店家現萃製作中');
    }, 600);
  };

  const handleCancelAndClearCart = () => {
    clearCart();
    setShowCancelModal(false);
    showToast('已取消訂單並清空購物車');
    setActiveView('menu');
  };

  const handleCancelAndKeepCart = () => {
    setShowCancelModal(false);
    showToast('已暫停結帳，為您保留購物車品項');
    setActiveView('menu');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4 text-amber-800 dark:text-amber-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">購物車目前尚無飲品</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-6">
          請先挑選喜愛的飲料並加入購物車後再前往結帳
        </p>
        <button
          onClick={() => setActiveView('menu')}
          className="px-6 py-2.5 bg-amber-800 dark:bg-amber-700 hover:bg-amber-900 dark:hover:bg-amber-600 text-white font-bold rounded-2xl transition-all text-sm cursor-pointer"
        >
          前往瀏覽飲料菜單
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* Cancel Order Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            id="cancel-order-dialog"
            className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 animate-scale-in"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 mb-1.5">
              確定要取消此筆訂單嗎？
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              您可以選擇直接清空購物車，或保留已選好的飲料品項並返回菜單繼續挑選。
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                id="modal-cancel-clear-cart-btn"
                onClick={handleCancelAndClearCart}
                className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>取消結帳並清空購物車</span>
              </button>

              <button
                type="button"
                id="modal-cancel-keep-cart-btn"
                onClick={handleCancelAndKeepCart}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>暫停結帳 (保留購物車內容)</span>
              </button>

              <button
                type="button"
                id="modal-cancel-dismiss-btn"
                onClick={() => setShowCancelModal(false)}
                className="w-full py-2.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              >
                繼續完成結帳
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with back button and cancel button */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="checkout-back-menu-btn"
            onClick={() => setActiveView('menu')}
            className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 text-sm font-semibold shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回菜單</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            訂單結帳確認
          </h2>
        </div>

        {/* Header Cancel Order Button */}
        <button
          type="button"
          id="header-cancel-order-btn"
          onClick={() => setShowCancelModal(true)}
          className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Ban className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>取消訂單</span>
        </button>
      </div>

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Details & Preferences (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. 取餐方式 (Pickup vs Delivery) */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>1. 取餐配送方式</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  id="pickup-tab-btn"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderType === 'pickup'
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">門市外帶自取</span>
                    {orderType === 'pickup' && <CheckCircle className="w-5 h-5 text-amber-800 dark:text-amber-400" />}
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-normal block mt-1">
                    到店免排隊快速取餐 (免運費)
                  </span>
                </button>

                <button
                  type="button"
                  id="delivery-tab-btn"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    orderType === 'delivery'
                      ? 'border-amber-700 dark:border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">專人外送服務</span>
                    {orderType === 'delivery' && <CheckCircle className="w-5 h-5 text-amber-800 dark:text-amber-400" />}
                  </div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-normal block mt-1">
                    滿 $500 免費外送 (未滿 +$30)
                  </span>
                </button>
              </div>

              {/* Delivery Address input if delivery selected */}
              {orderType === 'delivery' && (
                <div className="mt-3 animate-fade-in">
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                    外送完整地址 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="delivery-address-input"
                    placeholder="例如：台北市大安區忠孝東路四段 100 號 5 樓 (公司名/門鈴)"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    className={`w-full px-4 py-3 text-sm bg-stone-50 dark:bg-stone-800 border rounded-2xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400 ${
                      errors.address
                        ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/30'
                        : 'border-stone-200 dark:border-stone-700 focus:border-amber-700'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.address}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. 客戶聯絡資料 (Customer Information) */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>2. 訂購人聯絡資訊</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                    訂購人姓名 / 稱謂 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="customer-name-input"
                      placeholder="例如：王小明 先生"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border rounded-2xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400 ${
                        errors.name
                          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/30'
                          : 'border-stone-200 dark:border-stone-700 focus:border-amber-700'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                    手機電話 (通知訂單進度) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="customer-phone-input"
                      placeholder="例如：0912345678"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border rounded-2xl focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-900 dark:text-stone-100 placeholder:text-stone-400 ${
                        errors.phone
                          ? 'border-rose-400 dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/30'
                          : 'border-stone-200 dark:border-stone-700 focus:border-amber-700'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Pickup / Arrival Time */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  預計{orderType === 'pickup' ? '取餐' : '送達'}時間
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-800 dark:text-stone-100 font-medium"
                  >
                    <option value="盡快 (約 15-20 分鐘)">盡快 (約 15-20 分鐘)</option>
                    <option value="30 分鐘後">30 分鐘後</option>
                    <option value="45 分鐘後">45 分鐘後</option>
                    <option value="1 小時後">1 小時後</option>
                    <option value="指定今日下午茶時段 (15:00)">指定今日下午茶時段 (15:00)</option>
                  </select>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  整筆訂單備註 / 統編發票需求 (選填)
                </label>
                <textarea
                  rows={2}
                  placeholder="例：需開立統編發票 (請備註統編與抬頭)、響鈴不要按對講機等"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* 3. 付款方式 (Payment Methods) */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>3. 選擇付款方式</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* LINE Pay */}
                <button
                  type="button"
                  id="pay-linepay-btn"
                  onClick={() => setPaymentMethod('linepay')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'linepay'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold">LINE Pay</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">快速行動支付</span>
                </button>

                {/* 現金支付 */}
                <button
                  type="button"
                  id="pay-cash-btn"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-amber-800 dark:border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  <span className="text-xs sm:text-sm font-bold">現金支付</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    {orderType === 'pickup' ? '門市現場付' : '貨到付款'}
                  </span>
                </button>

                {/* 信用卡線上刷卡 */}
                <button
                  type="button"
                  id="pay-credit-btn"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-2 ring-blue-600/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs sm:text-sm font-bold">信用卡</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400">Visa / Master</span>
                </button>

                {/* 街口支付 */}
                <button
                  type="button"
                  id="pay-jko-btn"
                  onClick={() => setPaymentMethod('jko')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'jko'
                      ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-600/20 font-bold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span className="text-xs sm:text-sm font-bold">街口支付</span>
                  <span className="text-[10px] text-rose-700 dark:text-rose-400">JKOPAY</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation & Total Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-sm sticky top-24">
              {/* Header with edit cart link */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                  <span>訂購明細確認</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold hover:underline cursor-pointer"
                >
                  修改購物車
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100 dark:divide-stone-800">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-100 dark:border-stone-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                          {item.name}
                        </h4>
                        <span className="text-sm font-black text-amber-900 dark:text-amber-400 shrink-0">
                          NT$ {item.subtotal}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {item.size.split(' ')[0]} / {item.sugar.split(' ')[0]} / {item.ice}
                        {item.toppings.length > 0 && ` / 加${item.toppings.map((t) => t.name).join('、')}`}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mt-1">
                        <span>數量：<strong className="text-stone-900 dark:text-stone-100">{item.quantity} 杯</strong></span>
                        <span className="text-[11px] text-stone-400 dark:text-stone-500">單價 ${item.finalUnitPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Box */}
              <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-700 space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>商品小計 ({cartTotalCount} 杯)</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">NT$ {cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>外送費用</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {deliveryFee > 0 ? `NT$ ${deliveryFee}` : 'NT$ 0 (免外送費)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block">應付總金額</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500">已含營業稅</span>
                  </div>
                  <div className="flex items-baseline gap-1 text-amber-900 dark:text-amber-400">
                    <span className="text-xs font-bold">NT$</span>
                    <span className="text-3xl font-black">{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="mt-4 p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>訂單送出後將立即傳送至門市吧台現點現做。</span>
              </div>

              {/* Actions: Cancel Order & Submit Order */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="submit"
                  id="submit-order-btn"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-amber-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>正在送出訂單中...</span>
                  ) : (
                    <>
                      <span>送出訂單 (NT$ {grandTotal})</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="summary-cancel-order-btn"
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-stone-200 dark:border-stone-700 hover:border-rose-200 dark:hover:border-rose-900 text-stone-600 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-400 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-4 h-4 text-stone-400 group-hover:text-rose-600" />
                  <span>取消此筆訂單結帳</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
