import React, { useState, useEffect } from 'react';
import { BeverageProvider, useBeverage } from './context/BeverageContext';
import { Navbar } from './components/Navbar';
import { CategoryNav } from './components/CategoryNav';
import { DrinkCard } from './components/DrinkCard';
import { DrinkCustomModal } from './components/DrinkCustomModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { HeartCheersWidget } from './components/HeartCheersWidget';
import { BackToTopButton } from './components/BackToTopButton';
import { SeasonalPromoCarousel } from './components/SeasonalPromoCarousel';
import {
  ShoppingBag,
  Sparkles,
  Award,
  HeartHandshake,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  CupSoda
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    drinks,
    activeCategory,
    searchQuery,
    activeView,
    setActiveView,
    cartTotalCount,
    cartSubtotal,
    setIsCartDrawerOpen
  } = useBeverage();

  // Static slogan
  const sloganText = "每一杯飲品，都是對日常的溫柔犒賞。";

  // Filter drinks based on active category & search query
  const filteredDrinks = drinks.filter((drink) => {
    const matchesCategory =
      activeCategory === 'all' || drink.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (drink.englishName &&
        drink.englishName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      drink.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#121110] text-stone-800 dark:text-stone-100 selection:bg-amber-800 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : activeView === 'checkout' ? (
          <CheckoutView />
        ) : activeView === 'order-success' || activeView === 'order-status' ? (
          <OrderSuccessView />
        ) : (
          /* Default Menu View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {/* Hero Brand Greeting Banner with Clean Static Gradient & Seasonal Promo Carousel */}
            <div className="mt-6 relative rounded-3xl overflow-hidden bg-linear-to-r from-amber-950 via-stone-900 to-amber-950 text-white shadow-2xl border border-amber-500/20">
              {/* Static subtle background radial ambient highlight without moving glowing orbs */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.14),transparent_55%)] pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center lg:text-left space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>拾茶時光・現萃原茶、職人咖啡與手工熬糖</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white font-serif">
                    {sloganText}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed whitespace-normal break-words max-w-2xl">
                    嚴選台灣高山原片茶葉、鮮乳坊優質小農鮮乳與手工慢熬黑糖、嚴選精品咖啡豆，現點現調，呈現最純粹的天然風味。
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-amber-200">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      100% 台灣在地茶葉
                    </span>
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="w-4 h-4 text-amber-400" />
                      不添加人工香精茶精
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      滿 $500 即享專人免運外送
                    </span>
                  </div>
                </div>

                {/* Seasonal Limited-Time Promo Carousel Card */}
                <SeasonalPromoCarousel />
              </div>
            </div>

            {/* Category Navigation Bar */}
            <div id="drink-menu-section" className="scroll-mt-20">
              <CategoryNav />
            </div>

            {/* Drink Cards Grid */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>熱門飲品清單</span>
                  <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                    {filteredDrinks.length} 款
                  </span>
                </h3>
              </div>

              {filteredDrinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDrinks.map((drink) => (
                    <DrinkCard key={drink.id} drink={drink} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200/80 dark:border-stone-800 my-8 shadow-sm">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3 text-stone-400">
                    <CupSoda className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800 dark:text-stone-100">查無相關飲料商品</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    請嘗試更換搜尋關鍵字或選擇其他飲料分類
                  </p>
                </div>
              )}
            </div>

            {/* Heart Cheers Section */}
            <HeartCheersWidget />
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (for fast mobile & desktop checkout) */}
      {cartTotalCount > 0 && activeView === 'menu' && (
        <div className="fixed bottom-5 inset-x-0 z-30 px-4 pointer-events-none">
          <div className="max-w-xl mx-auto pointer-events-auto">
            <div
              onClick={() => setIsCartDrawerOpen(true)}
              className="bg-stone-900 hover:bg-stone-950 text-white rounded-2xl p-4 shadow-2xl border border-stone-700/80 flex items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-xl bg-amber-700 flex items-center justify-center text-amber-200">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900">
                    {cartTotalCount}
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-stone-400">購物車合計</span>
                    <span className="text-lg font-black text-amber-300">
                      NT$ {cartSubtotal}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    已選 {cartTotalCount} 杯飲品・點擊確認明細
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('checkout');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1 shadow-md transition-colors"
              >
                <span>立即結帳</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <DrinkCustomModal />
      <CartDrawer />
      <BackToTopButton />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-10 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
            {/* Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-800 flex items-center justify-center text-amber-200 font-bold">
                  <CupSoda className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">拾茶時光 SIP & TEA</h4>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                台灣經典手搖茶、鮮乳坊小農厚奶茶、莊園單品咖啡與鮮榨水果茶。秉持天然原葉、純淨好水與無添加用心調製。
              </p>
            </div>

            {/* Store Info */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-sm mb-2">門市資訊與服務</h5>
              <div className="flex items-center gap-2 text-stone-400">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>營業時間：週一至週日 09:30 - 21:30</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>門市地址：台北市大安區忠孝東路四段 88 號</span>
              </div>
              <div className="flex items-center gap-2 text-stone-400">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>外送訂購專線：(02) 2345-6789</span>
              </div>
            </div>

            {/* Quick Links & Commitments */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-sm mb-2">品質與安心承諾</h5>
              <p className="text-xs text-stone-400 leading-relaxed">
                ✓ 茶葉經 SGS 農藥殘留檢驗合格<br />
                ✓ 採用嚴選在地牧場純鮮乳，無奶精添加<br />
                ✓ 每日新鮮熬煮黑糖波霸珍珠，絕不放隔夜
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-amber-400 hover:text-amber-300 text-xs underline font-semibold"
                >
                  進入店家管理後台系統 →
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-2">
            <p>© {new Date().getFullYear()} 拾茶時光 Sip & Tea Beverage Order System. All rights reserved.</p>
            <p className="text-[11px]">本網站支援線上即時點餐、購物車客製與後台菜單管理</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BeverageProvider>
      <MainContent />
    </BeverageProvider>
  );
}
