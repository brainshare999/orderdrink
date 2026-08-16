import React from 'react';
import {
  Coffee,
  ShoppingBag,
  Clock,
  LayoutDashboard,
  Search,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  CupSoda
} from 'lucide-react';
import { useBeverage } from '../context/BeverageContext';
import { FaqModal } from './FaqModal';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    toastMessage,
    orders
  } = useBeverage();

  // Typewriter effect for free delivery banner (repeats every 30 seconds)
  const promoText = "全館滿 $500 即享免外送費";
  const [promoDisplayed, setPromoDisplayed] = React.useState("");
  const [promoKey, setPromoKey] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPromoKey(prev => prev + 1);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let i = 0;
    setPromoDisplayed("");
    const timer = setInterval(() => {
      if (i < promoText.length) {
        setPromoDisplayed(promoText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [promoKey]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const year = currentTime.getFullYear();
  const month = String(currentTime.getMonth() + 1).padStart(2, '0');
  const day = String(currentTime.getDate()).padStart(2, '0');
  const hours = String(currentTime.getHours()).padStart(2, '0');
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[currentTime.getDay()];

  const getLunarDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    if (y === 2026 && m === 8) {
      const baseDate = new Date(2026, 7, 13).getTime(); // Aug 13, 2026 is 7/1
      const dayOffset = Math.round((date.getTime() - baseDate) / (1000 * 60 * 60 * 24));
      const lunarDayNum = 1 + dayOffset;
      if (lunarDayNum >= 1 && lunarDayNum <= 30) {
        const dayNames = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
        const monthName = '七月';
        const idx = (lunarDayNum - 1) % 30;
        return `農曆${monthName}${dayNames[idx]}`;
      }
    }
    return '農曆七月';
  };

  const dateStr = `${year}-${month}-${day}`;
  const timeStr = `${hours}:${minutes}:${seconds}`;

  // Pending and active orders count
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready'
  ).length;

  return (
    <>
      {/* Top Banner */}
      <div id="store-banner" className="bg-stone-900 text-amber-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 shrink-0 text-amber-300 font-mono">
          <span>{dateStr}</span>
          <span>{timeStr}</span>
          <span>{weekday}</span>
          <span>{getLunarDateString(currentTime)}</span>
        </span>
        <span className="text-stone-500 shrink-0">|</span>
        <span className="inline-flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          營業中・09:30 - 21:30
        </span>
        <span className="text-stone-500 shrink-0">|</span>
        <span className="inline-flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{promoDisplayed}</span>
          <span className="inline-block w-1.5 h-3 bg-amber-400 animate-pulse ml-0.5"></span>
        </span>
        <span className="text-stone-500 shrink-0">|</span>
        <span className="inline-flex items-center gap-1 shrink-0">
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          門市外送專線：(02) 2345-6789
        </span>
      </div>

      {/* Main Navigation Bar */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Logo & Name */}
            <div
              id="brand-logo-btn"
              onClick={() => setActiveView('menu')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <CupSoda className="w-7 h-7 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
                    拾茶時光
                  </h1>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200/60">
                    Sip & Tea
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">手作手搖茶飲・莊園精品咖啡</p>
              </div>
            </div>

            {/* Quick Search Bar (Visible on menu view or desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="搜尋飲料名稱、茶類、咖啡或成分..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeView !== 'menu') setActiveView('menu');
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100/80 border border-stone-200/80 rounded-xl focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Menu button */}
              <button
                id="nav-menu-btn"
                onClick={() => setActiveView('menu')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'menu'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">線上菜單</span>
              </button>

              {/* Order Tracking button */}
              <button
                id="nav-tracking-btn"
                onClick={() => setActiveView('order-status')}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'order-status' || activeView === 'order-success'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">訂單進度</span>
                {activeOrdersCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-amber-600 rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                id="nav-cart-btn"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative px-4 py-2 rounded-xl text-sm font-bold bg-amber-800 hover:bg-amber-900 text-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                      {cartTotalCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">購物車</span>
                {cartSubtotal > 0 && (
                  <span className="text-amber-200 font-bold ml-0.5 border-l border-amber-700/60 pl-2">
                    ${cartSubtotal}
                  </span>
                )}
              </button>

              {/* Admin Portal Toggle */}
              <button
                id="nav-admin-btn"
                onClick={() => setActiveView(activeView === 'admin' ? 'menu' : 'admin')}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
                title="店家管理後台"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">
                  {activeView === 'admin' ? '返回前台' : '管理後台'}
                </span>
              </button>

              {/* FAQ Modal (Placed on the right of navigation) */}
              <FaqModal />

              {/* Dark/Light Theme Toggle (Placed at the very right of navbar) */}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="搜尋飲料名稱、茶類、咖啡、成分..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'menu') setActiveView('menu');
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 outline-hidden transition-all text-stone-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-stone-700/80 flex items-center gap-3 animate-slide-up"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </>
  );
};
