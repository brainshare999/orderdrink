import React, { useState, useEffect } from 'react';
import {
  Coffee,
  ShoppingBag,
  Clock,
  LayoutDashboard,
  Search,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  CupSoda,
  Menu as MenuIcon,
  X,
  HelpCircle,
  Mail,
  ChevronRight,
  User as UserIcon,
  LogIn,
  LogOut,
  PackageCheck
} from 'lucide-react';
import { useBeverage } from '../context/BeverageContext';
import { useAuth } from '../context/AuthContext';
import { FaqModal } from './FaqModal';
import { ContactModal } from './ContactModal';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';

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

  const { user, signOut, openLoginModal } = useAuth();

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Typewriter effect for free delivery banner (repeats every 30 seconds)
  const promoText = "全館滿 $500 即享免外送費";
  const [promoDisplayed, setPromoDisplayed] = useState("");
  const [promoKey, setPromoKey] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoKey((prev) => prev + 1);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
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
        const dayNames = [
          '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
          '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
          '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
        ];
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

  const navigateTo = (view: 'menu' | 'order-status' | 'my-orders' | 'admin') => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner (Horizontal Scroll Safe) */}
      <div
        id="store-banner"
        className="w-full max-w-full bg-stone-900 dark:bg-stone-950 text-amber-100 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center font-medium flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar whitespace-nowrap border-b border-stone-800"
      >
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
        <a
          href="tel:0223456789"
          className="inline-flex items-center gap-1 shrink-0 hover:text-amber-300 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          門市外送專線：(02) 2345-6789
        </a>
      </div>

      {/* Main Navigation Bar */}
      <header
        id="main-header"
        className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-900/10 dark:border-stone-800 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Brand Logo & Name */}
            <div
              id="brand-logo-btn"
              onClick={() => navigateTo('menu')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-linear-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
                <CupSoda className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap">
                    拾茶時光
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/60 whitespace-nowrap">
                    Sip & Tea
                  </span>
                </div>
                <p className="hidden md:block text-xs text-stone-500 dark:text-stone-400 font-medium truncate">
                  手作手搖茶飲・莊園精品咖啡
                </p>
              </div>
            </div>

            {/* Desktop Quick Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="navbar-search-input"
                  type="text"
                  placeholder="搜尋飲料名稱、茶類..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeView !== 'menu') setActiveView('menu');
                  }}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-100/80 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 font-bold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Action Buttons (Visible >= md) */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {/* Menu button */}
              <button
                id="nav-menu-btn"
                onClick={() => navigateTo('menu')}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'menu'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>線上菜單</span>
              </button>

              {/* My Orders Button (Supabase RLS Protected) */}
              <button
                id="nav-my-orders-btn"
                onClick={() => {
                  if (user) {
                    navigateTo('my-orders');
                  } else {
                    openLoginModal();
                  }
                }}
                className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'my-orders'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <PackageCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>我的訂單</span>
              </button>

              {/* Order Tracking button */}
              <button
                id="nav-tracking-btn"
                onClick={() => navigateTo('order-status')}
                className={`relative px-2.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'order-status' || activeView === 'order-success'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>製作進度</span>
                {activeOrdersCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold leading-none text-white bg-amber-600 rounded-full">
                    {activeOrdersCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                id="nav-cart-btn"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative px-3 py-2 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600 text-white shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900 animate-scale-in">
                      {cartTotalCount}
                    </span>
                  )}
                </div>
                <span>購物車</span>
                {cartSubtotal > 0 && (
                  <span className="text-amber-200 font-bold ml-0.5 border-l border-amber-700/60 pl-1.5">
                    ${cartSubtotal}
                  </span>
                )}
              </button>

              {/* FAQ Modal */}
              <FaqModal />

              {/* Contact Us Modal */}
              <ContactModal />

              {/* User Authentication Display & Logout / Login Button */}
              {user ? (
                <div className="flex items-center gap-1.5 pl-1 border-l border-stone-200 dark:border-stone-800">
                  <div
                    onClick={() => navigateTo('my-orders')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 max-w-[170px] truncate cursor-pointer hover:bg-amber-100/80 transition-colors"
                    title={user.email}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                    <span className="font-mono text-[11px] font-bold truncate">{user.email}</span>
                  </div>
                  <button
                    id="nav-logout-btn"
                    onClick={signOut}
                    className="p-2 rounded-xl text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    title="登出帳號"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={openLoginModal}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-900/60 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                  <span>登入 / 註冊</span>
                </button>
              )}

              {/* Admin Portal Toggle */}
              <button
                id="nav-admin-btn"
                onClick={() => navigateTo(activeView === 'admin' ? 'menu' : 'admin')}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-stone-900 dark:bg-stone-800 border-stone-900 dark:border-stone-700 text-white shadow-xs'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white'
                }`}
                title="店家管理後台"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile Action Buttons (Visible on < md) */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {/* User login / status avatar on mobile */}
              {user ? (
                <button
                  onClick={() => navigateTo('my-orders')}
                  className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-900 dark:text-amber-200 text-xs font-bold"
                  title={user.email}
                >
                  <UserIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1 border border-amber-300 dark:border-amber-800"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>登入</span>
                </button>
              )}

              {/* Mobile Shopping Cart Button */}
              <button
                id="mobile-nav-cart-btn"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 text-white shadow-xs flex items-center gap-1 cursor-pointer"
                aria-label="購物車"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  {cartTotalCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-amber-800 dark:border-amber-700">
                      {cartTotalCount}
                    </span>
                  )}
                </div>
                {cartSubtotal > 0 && (
                  <span className="text-amber-200 font-bold ml-0.5 text-[11px]">
                    ${cartSubtotal}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Hamburger Toggle Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isMobileMenuOpen
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                aria-label="開啟選單"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-2.5 md:hidden">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="搜尋飲料名稱、茶類、咖啡、成分..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'menu') setActiveView('menu');
                }}
                className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all text-stone-800 dark:text-stone-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 font-bold cursor-pointer p-0.5"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Mobile Dropdown Navigation Menu */}
          {isMobileMenuOpen && (
            <div
              id="mobile-nav-drawer"
              className="md:hidden py-3 border-t border-stone-200 dark:border-stone-800 space-y-1 animate-fade-in"
            >
              {/* User Profile Header in Mobile Menu */}
              {user && (
                <div className="px-3.5 py-2.5 mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <UserIcon className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
                    <span className="font-mono text-stone-800 dark:text-stone-200 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-700 dark:text-rose-400 font-bold shrink-0 flex items-center gap-1 hover:underline ml-2"
                  >
                    <LogOut className="w-3 h-3" />
                    登出
                  </button>
                </div>
              )}

              {/* Menu Item: Online Menu */}
              <button
                onClick={() => navigateTo('menu')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'menu'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>線上點餐菜單</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Menu Item: My Orders (Supabase) */}
              <button
                onClick={() => {
                  if (user) {
                    navigateTo('my-orders');
                  } else {
                    setIsMobileMenuOpen(false);
                    openLoginModal();
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'my-orders'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PackageCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>我的訂單記錄 (雲端防護)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Menu Item: Order Tracking */}
              <button
                onClick={() => navigateTo('order-status')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'order-status' || activeView === 'order-success'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>訂單製作與外送進度</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeOrdersCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-amber-600 rounded-full">
                      {activeOrdersCount} 筆進行中
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </button>

              {/* Menu Item: Contact Us Modal */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>聯絡我們・顧客交辦與意見表單</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Menu Item: FAQ Modal */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsFaqModalOpen(true);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>常見問題 Q&A</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Menu Item: Admin Dashboard */}
              <button
                onClick={() => navigateTo(activeView === 'admin' ? 'menu' : 'admin')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-stone-900 dark:bg-stone-800 text-white'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>店家管理後台系統</span>
                </div>
                <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-md">
                  {activeView === 'admin' ? '切換前台' : '點擊進入'}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Hidden Portal Trigger Instances for Mobile Modal Actions */}
      <ContactModal
        isOpenExternal={isContactModalOpen}
        onCloseExternal={() => setIsContactModalOpen(false)}
        showDefaultTrigger={false}
      />
      <FaqModal
        isOpenExternal={isFaqModalOpen}
        onCloseExternal={() => setIsFaqModalOpen(false)}
        showDefaultTrigger={false}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast"
          className="fixed bottom-6 right-6 z-50 bg-stone-900 dark:bg-stone-800 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-stone-700/80 flex items-center gap-3 animate-slide-up"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </>
  );
};
