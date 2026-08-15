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
  Info,
  AlertCircle
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    setActiveView,
    placeOrder,
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
      } catch (err) {
        console.error(err);
      }

      placeOrder(customerInfo);
      setIsSubmitting(false);
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">購物車內尚無商品</h2>
        <p className="text-sm text-stone-600 mb-6">請先挑選喜愛的飲料後再進行結帳</p>
        <button
          onClick={() => setActiveView('menu')}
          className="px-6 py-3 bg-amber-800 text-white font-bold rounded-2xl hover:bg-amber-900 transition-all"
        >
          返回飲料菜單
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-view" className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header back button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveView('menu')}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
          訂單結帳確認
        </h2>
      </div>

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Details & Preferences (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. 取餐方式 (Pickup vs Delivery) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-800" />
                <span>1. 取餐配送方式</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  id="pickup-tab-btn"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'pickup'
                      ? 'border-amber-800 bg-amber-50/70 text-amber-950 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">門市外帶自取</span>
                    {orderType === 'pickup' && <CheckCircle className="w-5 h-5 text-amber-800" />}
                  </div>
                  <span className="text-xs text-stone-500 font-normal block mt-1">
                    到店免排隊快速取餐 (免運費)
                  </span>
                </button>

                <button
                  type="button"
                  id="delivery-tab-btn"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'delivery'
                      ? 'border-amber-800 bg-amber-50/70 text-amber-950 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">專人外送服務</span>
                    {orderType === 'delivery' && <CheckCircle className="w-5 h-5 text-amber-800" />}
                  </div>
                  <span className="text-xs text-stone-500 font-normal block mt-1">
                    滿 $500 免費外送 (未滿 +$30)
                  </span>
                </button>
              </div>

              {/* Delivery Address input if delivery selected */}
              {orderType === 'delivery' && (
                <div className="mt-3 animate-fade-in">
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
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
                    className={`w-full px-4 py-3 text-sm bg-stone-50 border rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all ${
                      errors.address ? 'border-rose-400 bg-rose-50/40' : 'border-stone-200 focus:border-amber-700'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.address}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. 客戶聯絡資料 (Customer Information) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-amber-800" />
                <span>2. 訂購人聯絡資訊</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    訂購人姓名 / 稱謂 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="customer-name-input"
                      placeholder="例如：王小明 先生"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all ${
                        errors.name ? 'border-rose-400 bg-rose-50/40' : 'border-stone-200 focus:border-amber-700'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    手機電話 (通知訂單進度) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="customer-phone-input"
                      placeholder="例如：0912345678"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all ${
                        errors.phone ? 'border-rose-400 bg-rose-50/40' : 'border-stone-200 focus:border-amber-700'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Pickup / Arrival Time */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  預計{orderType === 'pickup' ? '取餐' : '送達'}時間
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-800 font-medium"
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
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  整筆訂單備註 / 統編發票需求 (選填)
                </label>
                <textarea
                  rows={2}
                  placeholder="例：需開立統編發票 (請備註統編與抬頭)、響鈴不要按對講機等"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:border-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all text-stone-800"
                />
              </div>
            </div>

            {/* 3. 付款方式 (Payment Methods) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-amber-800" />
                <span>3. 選擇付款方式</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* LINE Pay */}
                <button
                  type="button"
                  id="pay-linepay-btn"
                  onClick={() => setPaymentMethod('linepay')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'linepay'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs sm:text-sm font-bold">LINE Pay</span>
                  <span className="text-[10px] text-emerald-700">快速行動支付</span>
                </button>

                {/* 現金支付 */}
                <button
                  type="button"
                  id="pay-cash-btn"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'cash'
                      ? 'border-amber-800 bg-amber-50/70 text-amber-950 ring-2 ring-amber-800/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-700" />
                  <span className="text-xs sm:text-sm font-bold">現金支付</span>
                  <span className="text-[10px] text-stone-500">
                    {orderType === 'pickup' ? '門市現場付' : '貨到付款'}
                  </span>
                </button>

                {/* 信用卡線上刷卡 */}
                <button
                  type="button"
                  id="pay-credit-btn"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'credit'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-bold">信用卡</span>
                  <span className="text-[10px] text-blue-700">Visa / Master</span>
                </button>

                {/* 街口支付 */}
                <button
                  type="button"
                  id="pay-jko-btn"
                  onClick={() => setPaymentMethod('jko')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'jko'
                      ? 'border-rose-600 bg-rose-50/70 text-rose-950 ring-2 ring-rose-600/20 font-bold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-600" />
                  <span className="text-xs sm:text-sm font-bold">街口支付</span>
                  <span className="text-[10px] text-rose-700">JKOPAY</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Confirmation & Total Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm sticky top-24">
              {/* Header with edit cart link */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-800" />
                  <span>訂購明細確認</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="text-xs text-amber-800 hover:text-amber-900 font-bold hover:underline"
                >
                  修改購物車
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-bold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-sm font-black text-amber-900 shrink-0">
                          NT$ {item.subtotal}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.size.split(' ')[0]} / {item.sugar.split(' ')[0]} / {item.ice}
                        {item.toppings.length > 0 && ` / 加${item.toppings.map((t) => t.name).join('、')}`}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-600 mt-1">
                        <span>數量：<strong className="text-stone-900">{item.quantity} 杯</strong></span>
                        <span className="text-[11px] text-stone-400">單價 ${item.finalUnitPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Box */}
              <div className="pt-4 mt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>商品小計 ({cartTotalCount} 杯)</span>
                  <span className="font-bold text-stone-800">NT$ {cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>外送費用</span>
                  <span className="font-medium text-stone-800">
                    {deliveryFee > 0 ? `NT$ ${deliveryFee}` : 'NT$ 0 (免外送費)'}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-stone-900 block">應付總金額</span>
                    <span className="text-[10px] text-stone-400">已含營業稅</span>
                  </div>
                  <div className="flex items-baseline gap-1 text-amber-900">
                    <span className="text-xs font-bold">NT$</span>
                    <span className="text-3xl font-black">{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>訂單送出後將立即傳送至門市吧台現點現做。</span>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="mt-5 w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-amber-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
