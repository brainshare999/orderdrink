import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  Coffee,
  CupSoda,
  Percent,
  Clock
} from 'lucide-react';
import { useBeverage } from '../context/BeverageContext';
import { BeverageCategory } from '../types';

interface PromoSlide {
  id: string;
  category: BeverageCategory;
  categoryName: string;
  badge: string;
  badgeColor: string;
  title: string;
  discountHighlight: string;
  subtitle: string;
  description: string;
  expiresIn: string;
  icon: React.ReactNode;
  bgGradient: string;
  accentBorder: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-tea',
    category: 'tea',
    categoryName: '手作原茶系列',
    badge: '🍂 季節限定',
    badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40',
    title: '初秋原茶盛典',
    discountHighlight: '同品項第 2 杯 7 折',
    subtitle: '阿里山高山茶・炭焙文山包種',
    description: '特選台灣高山現沖原葉茶，入口回甘不澀，雙杯同享茶香悠遠。',
    expiresIn: '限時倒數中',
    icon: <CupSoda className="w-5 h-5 text-emerald-300" />,
    bgGradient: 'from-emerald-950/80 via-stone-900/90 to-amber-950/70',
    accentBorder: 'border-emerald-500/30'
  },
  {
    id: 'promo-milktea',
    category: 'milk_tea',
    categoryName: '小農厚奶系列',
    badge: '🥛 人氣狂推',
    badgeColor: 'bg-amber-500/25 text-amber-300 border-amber-400/40',
    title: '小農鮮奶狂歡季',
    discountHighlight: '任選 2 杯現折 $20',
    subtitle: '黑糖波霸鮮奶・錫蘭厚鮮奶茶',
    description: '嚴選鮮乳坊在地優質鮮乳搭配手炒黑糖與特選茶底，濃純香醇。',
    expiresIn: '本週限定',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    bgGradient: 'from-amber-950/80 via-stone-900/90 to-stone-950/80',
    accentBorder: 'border-amber-500/30'
  },
  {
    id: 'promo-coffee',
    category: 'coffee',
    categoryName: '精品莊園咖啡',
    badge: '☕ 職人嚴選',
    badgeColor: 'bg-yellow-500/25 text-yellow-300 border-yellow-400/40',
    title: '莊園咖啡嚐鮮日',
    discountHighlight: '指定品項 88 折優惠',
    subtitle: '耶加雪菲冷萃・原味經典拿鐵',
    description: '低溫慢速冷萃萃取，散發細緻花果香調與柑橘酸甜，午後醒腦首選。',
    expiresIn: '每日 14:00-18:00',
    icon: <Coffee className="w-5 h-5 text-yellow-300" />,
    bgGradient: 'from-stone-900/90 via-amber-950/80 to-stone-950/90',
    accentBorder: 'border-yellow-500/30'
  },
  {
    id: 'promo-fruit',
    category: 'other',
    categoryName: '鮮果氣泡系列',
    badge: '🍊 清爽多汁',
    badgeColor: 'bg-rose-500/25 text-rose-300 border-rose-400/40',
    title: '果香氣泡派對',
    discountHighlight: '指定鮮果茶 買 3 送 1',
    subtitle: '滿杯香橙翡翠・金桔蜂蜜氣泡',
    description: '每日產地直送新鮮鮮果現榨現調，搭配細緻氣泡，暢快解膩無負擔。',
    expiresIn: '門市外帶外送同享',
    icon: <Sparkles className="w-5 h-5 text-rose-400" />,
    bgGradient: 'from-rose-950/80 via-stone-900/90 to-amber-950/70',
    accentBorder: 'border-rose-500/30'
  }
];

export const SeasonalPromoCarousel: React.FC = () => {
  const { setActiveCategory } = useBeverage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleSelectCategory = (cat: BeverageCategory) => {
    setActiveCategory(cat);
    // Smooth scroll down to drink list
    const el = document.getElementById('drink-menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const current = PROMO_SLIDES[currentIndex];

  return (
    <div
      id="seasonal-promo-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full max-w-md lg:max-w-lg shrink-0 rounded-3xl overflow-hidden backdrop-blur-md bg-stone-900/60 border border-white/15 p-4 sm:p-5 shadow-xl transition-all relative group"
    >
      {/* Top Header Row with Badge & Auto-cycle Progress / Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}
          >
            {current.icon}
            <span>{current.badge}</span>
          </span>
          <span className="text-[11px] text-amber-200/80 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{current.expiresIn}</span>
          </span>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="上一則優惠"
            aria-label="Previous promo"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="下一則優惠"
            aria-label="Next promo"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Promo Content with Fade In/Out Transition */}
      <div
        key={current.id}
        className="transition-all duration-400 ease-out space-y-2.5 animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                {current.title}
              </h4>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-md">
                {current.categoryName}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-bold mt-0.5">
              {current.subtitle}
            </p>
          </div>

          {/* Big Discount Tag */}
          <div className="shrink-0 bg-linear-to-r from-amber-500 to-rose-500 text-white px-3 py-1.5 rounded-2xl shadow-md text-right">
            <span className="text-[10px] uppercase font-bold text-amber-100 block leading-tight">
              特惠折扣
            </span>
            <span className="text-xs sm:text-sm font-black text-white whitespace-nowrap block">
              {current.discountHighlight}
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-300 font-light leading-relaxed line-clamp-2">
          {current.description}
        </p>

        {/* Action Button & Carousel Indicator Dots */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <button
            onClick={() => handleSelectCategory(current.category)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer border border-white/20 hover:border-amber-400"
          >
            <span>前往選購此系列</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {PROMO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400'
                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
