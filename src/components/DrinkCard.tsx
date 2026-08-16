import React from 'react';
import { Drink } from '../types';
import { useBeverage } from '../context/BeverageContext';
import { Plus, SlidersHorizontal, Flame, Info } from 'lucide-react';

interface DrinkCardProps {
  drink: Drink;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const { setCustomizingDrink, addToCart } = useBeverage();

  const getCategoryLabel = (cat: Drink['category']) => {
    switch (cat) {
      case 'tea':
        return '原葉好茶';
      case 'milk_tea':
        return '香醇奶茶';
      case 'coffee':
        return '精品咖啡';
      case 'other':
        return '鮮果特調';
      default:
        return '特調飲品';
    }
  };

  return (
    <div
      id={`drink-card-${drink.id}`}
      className={`group relative bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md hover:shadow-2xl hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden ${
        !drink.isAvailable ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Drink Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={drink.imageUrl}
          alt={drink.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // fallback image if unsplash link has network issue
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10 opacity-70 pointer-events-none" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm text-stone-800 dark:text-stone-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs border border-stone-200/50 dark:border-stone-700/50">
            {getCategoryLabel(drink.category)}
          </span>
          {drink.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-amber-800/90 dark:bg-amber-700/90 backdrop-blur-sm text-amber-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sold Out / Status Overlay */}
        {!drink.isAvailable && (
          <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="bg-rose-500 text-white font-bold text-sm sm:text-base px-4 py-1.5 rounded-full shadow-lg border border-white/20">
              今日已售完 (下架中)
            </span>
          </div>
        )}

        {/* Calories Pill */}
        {drink.calories !== undefined && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-stone-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>約 {drink.calories} kcal</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Titles */}
          <div className="mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
              {drink.name}
            </h3>
            {drink.englishName && (
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium tracking-tight">
                {drink.englishName}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-2 mb-3 leading-relaxed">
            {drink.description}
          </p>

          {/* Ingredients Breakdown (成分說明) */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-xl p-2.5 mb-4">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>飲品成分：</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pl-4">
              {drink.ingredients}
            </p>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 mt-auto">
          <div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block font-medium">起價</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-amber-800 dark:text-amber-400">NT$</span>
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {drink.price}
              </span>
            </div>
          </div>

          {drink.isAvailable ? (
            <div className="flex items-center gap-2">
              {/* Quick Add Button */}
              <button
                id={`quick-add-btn-${drink.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(drink);
                }}
                className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/60 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                title="快速加入購物車 (預設規格)"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Custom specs button */}
              <button
                id={`customize-drink-btn-${drink.id}`}
                onClick={() => setCustomizingDrink(drink)}
                className="px-4 py-2.5 rounded-2xl bg-amber-800 dark:bg-amber-700 hover:bg-amber-900 dark:hover:bg-amber-600 text-white text-sm font-bold shadow-md hover:shadow-xl hover:shadow-amber-900/30 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-1.5 group cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-200 group-hover:rotate-90 transition-transform duration-300" />
                <span>客製選購</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="px-4 py-2.5 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 text-sm font-bold cursor-not-allowed"
            >
              暫停供應
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
