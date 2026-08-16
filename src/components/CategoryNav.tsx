import React from 'react';
import { CATEGORIES } from '../data/defaultDrinks';
import { BeverageCategory } from '../types';
import { useBeverage } from '../context/BeverageContext';
import { Sparkles, Leaf, Milk, Coffee, Citrus } from 'lucide-react';

export const CategoryNav: React.FC = () => {
  const { activeCategory, setActiveCategory, drinks, searchQuery, setSearchQuery } = useBeverage();

  const getCategoryIcon = (id: BeverageCategory) => {
    switch (id) {
      case 'all':
        return <Sparkles className="w-4 h-4" />;
      case 'tea':
        return <Leaf className="w-4 h-4" />;
      case 'milk_tea':
        return <Milk className="w-4 h-4" />;
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'other':
        return <Citrus className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCount = (catId: BeverageCategory) => {
    if (catId === 'all') return drinks.length;
    return drinks.filter((d) => d.category === catId).length;
  };

  return (
    <div id="category-nav-section" className="py-6">
      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = getCount(cat.id);

          return (
            <button
              key={cat.id}
              id={`category-btn-${cat.id}`}
              onClick={() => {
                setActiveCategory(cat.id);
                if (searchQuery) setSearchQuery('');
              }}
              className={`group flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 transform shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-amber-600 via-amber-700 to-orange-600 text-white shadow-xl shadow-amber-950/30 scale-105 ring-2 ring-amber-400/80 -translate-y-0.5'
                  : 'bg-white text-stone-700 hover:bg-amber-50/90 hover:text-amber-900 border-2 border-stone-200/90 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-125 ${isActive ? 'text-amber-200' : 'text-amber-600'}`}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  isActive
                    ? 'bg-amber-950/40 text-amber-100 shadow-xs'
                    : 'bg-stone-100 text-stone-600 group-hover:bg-amber-200/80 group-hover:text-amber-950'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Description or Search Active Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-sm">
        {searchQuery ? (
          <div className="flex items-center gap-2 text-stone-600">
            <span>搜尋關鍵字：</span>
            <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
              "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 underline ml-2"
            >
              清除搜尋
            </button>
          </div>
        ) : (
          <p className="text-stone-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            {CATEGORIES.find((c) => c.id === activeCategory)?.description}
          </p>
        )}

        <div className="text-xs text-stone-600 font-medium">
          💡 點擊任一商品卡片可自訂冰量、甜度與豐富加料
        </div>
      </div>
    </div>
  );
};
