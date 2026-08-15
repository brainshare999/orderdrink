import React from 'react';
import { useBeverage } from '../context/BeverageContext';
import { Order, OrderStatus } from '../types';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Coffee,
  CheckCircle,
  AlertCircle,
  QrCode,
  LayoutDashboard,
  Sparkles,
  Truck
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { orders, activeOrder, setActiveOrder, setActiveView, updateOrderStatus } = useBeverage();

  // Current display order: either activeOrder or the latest placed order
  const order: Order | undefined =
    activeOrder || orders[0] || undefined;

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-500">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-stone-800">目前沒有訂單進度記錄</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">歡迎前往菜單瀏覽並點購喜愛的飲品</p>
        <button
          onClick={() => setActiveView('menu')}
          className="px-6 py-2.5 bg-amber-800 text-white font-bold rounded-2xl hover:bg-amber-900 transition-all text-sm"
        >
          前往點餐
        </button>
      </div>
    );
  }

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'preparing':
        return 1;
      case 'ready':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStepIndex(order.status);

  const steps = [
    { title: '訂單已成立', desc: '店家已接單確認' },
    { title: '飲品調製中', desc: '吧台新鮮現萃製作' },
    {
      title: order.customerInfo.orderType === 'pickup' ? '可前往取餐' : '外送配送中',
      desc: order.customerInfo.orderType === 'pickup' ? '請出示取餐編號' : '外送員正前往地址'
    },
    { title: '訂單已完成', desc: '感謝您的購買！' }
  ];

  return (
    <div id="order-status-view" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setActiveView('menu')}
          className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:text-stone-900 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回菜單首頁</span>
        </button>

        <button
          onClick={() => setActiveView('admin')}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-100 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          <span>後台查看訂單看板</span>
        </button>
      </div>

      {/* Main Order Status Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden mb-8">
        {/* Header Hero */}
        <div className="bg-linear-to-r from-amber-800 to-amber-950 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/60 border border-amber-500/30 text-amber-200 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                訂單即時進度追蹤
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                訂單編號：{order.orderNumber}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
                下單時間：{new Date(order.createdAt).toLocaleString('zh-TW')}
              </p>
            </div>

            {/* Status Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-center sm:text-right">
              <span className="text-xs text-amber-200 block">目前狀態</span>
              <span className="text-lg font-black text-white">
                {order.status === 'pending' && '⏳ 店家待處理中'}
                {order.status === 'preparing' && '🍵 飲品現萃調製中'}
                {order.status === 'ready' &&
                  (order.customerInfo.orderType === 'pickup'
                    ? '🎉 已備妥・請至櫃台取餐'
                    : '🛵 外送員配送中')}
                {order.status === 'completed' && '✅ 訂單已完成'}
                {order.status === 'cancelled' && '❌ 訂單已取消'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        {order.status !== 'cancelled' ? (
          <div className="p-6 sm:p-8 border-b border-stone-100 bg-stone-50/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={step.title}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-100/70 border-amber-700 text-amber-950 ring-2 ring-amber-700/20 shadow-xs'
                        : isPassed
                        ? 'bg-white border-emerald-300 text-stone-800'
                        : 'bg-white/60 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping"></span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-stone-900">{step.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Simulation Controls for customer testing */}
            <div className="mt-5 pt-4 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-500 font-medium">
                🛠️ 門市操作模擬 (點擊可切換進度)：
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus(order.id, 'pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                    order.status === 'pending'
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  1. 待接單
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                    order.status === 'preparing'
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  2. 製作中
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                    order.status === 'ready'
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  3. 可取餐 / 配送
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                    order.status === 'completed'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  4. 已完成
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-rose-50 border-b border-rose-100 text-rose-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>此訂單已被取消。如有任何問題請聯絡門市客服。</span>
          </div>
        )}

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Customer & Delivery Card (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>顧客與配送資料</span>
            </h3>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">取餐模式</span>
                <span className="font-bold text-stone-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {order.customerInfo.orderType === 'pickup' ? '門市外帶自取' : '專人外送'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">訂購姓名</span>
                <span className="font-bold text-stone-900">{order.customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">聯絡手機</span>
                <span className="font-bold text-stone-900">{order.customerInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">預計取餐時間</span>
                <span className="font-bold text-stone-900">{order.customerInfo.pickupTime}</span>
              </div>
              {order.customerInfo.address && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500 block mb-1">外送地址：</span>
                  <p className="font-medium text-stone-800">{order.customerInfo.address}</p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-stone-500">付款方式</span>
                <span className="font-bold text-stone-900 uppercase">
                  {order.customerInfo.paymentMethod === 'linepay' && 'LINE Pay (已支付)'}
                  {order.customerInfo.paymentMethod === 'cash' && '現金支付 (現場付)'}
                  {order.customerInfo.paymentMethod === 'credit' && '信用卡 (已完成扣款)'}
                  {order.customerInfo.paymentMethod === 'jko' && '街口支付 (已完成)'}
                </span>
              </div>
              {order.customerInfo.notes && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500 block mb-1">備註說明：</span>
                  <p className="text-stone-700 italic">{order.customerInfo.notes}</p>
                </div>
              )}
            </div>

            {/* QR Code pickup representation */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-center">
              <div className="w-24 h-24 bg-white mx-auto rounded-xl border border-stone-200 flex items-center justify-center p-2 shadow-2xs">
                <QrCode className="w-full h-full text-stone-800" />
              </div>
              <p className="text-xs font-bold text-amber-950 mt-2">
                門市取餐出示條碼：{order.orderNumber}
              </p>
              <p className="text-[11px] text-stone-500">至門市吧台出示畫面即可核對取餐</p>
            </div>
          </div>

          {/* Items Summary (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-800" />
              <span>訂購飲品明細 ({order.totalQuantity} 杯)</span>
            </h3>

            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-start gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                      <span className="font-black text-amber-900 text-sm">
                        NT$ {item.subtotal}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.size.split(' ')[0]} / {item.sugar.split(' ')[0]} / {item.ice}
                      {item.toppings.length > 0 &&
                        ` / 加${item.toppings.map((t) => t.name).join('、')}`}
                    </p>
                    {item.itemNote && (
                      <p className="text-[11px] text-stone-400 italic">備註: {item.itemNote}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-stone-600 mt-1">
                      <span>
                        數量：<strong>{item.quantity} 杯</strong>
                      </span>
                      <span className="text-[11px] text-stone-400">
                        單價 NT$ {item.finalUnitPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>商品小計</span>
                <span className="font-bold text-stone-800">NT$ {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>外送費用</span>
                <span className="font-medium text-stone-800">
                  {order.deliveryFee > 0 ? `NT$ ${order.deliveryFee}` : 'NT$ 0'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">總計金額</span>
                <div className="flex items-baseline gap-1 text-amber-900">
                  <span className="text-xs font-bold">NT$</span>
                  <span className="text-2xl font-black">{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Orders Switcher if multiple */}
      {orders.length > 1 && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs">
          <h4 className="text-sm font-bold text-stone-800 mb-3">您的歷史訂購記錄：</h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrder(o)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-2 ${
                  order.id === o.id
                    ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span>{o.orderNumber}</span>
                <span className="text-[10px] opacity-80">(${o.totalAmount})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
