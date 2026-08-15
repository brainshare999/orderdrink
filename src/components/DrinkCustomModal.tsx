import React, { useState, useEffect } from 'react';
import { useBeverage } from '../context/BeverageContext';
import { CupSize, IceLevel, SugarLevel, Topping } from '../types';
import { AVAILABLE_TOPPINGS } from '../data/defaultDrinks';
import { X, Plus, Minus, Check, ShoppingBag, Sparkles, Flame, Info } from 'lucide-react';

const ICE_OPTIONS: IceLevel[] = [
  '正常冰',
  '少冰',
  '微冰',
  '去冰',
  '完全去冰',
  '溫熱',
  '熱飲'
];

const SUGAR_OPTIONS: SugarLevel[] = [
  '全糖 (10分)',
  '少糖 (7分)',
  '半糖 (5分)',
  '微糖 (3分)',
  '一分糖 (1分)',
  '無糖 (0分)'
];

const SIZE_OPTIONS: { size: CupSize; priceDiff: number; label: string }[] = [
  { size: '中杯 (M - 500ml)', priceDiff: 0, label: '中杯 500ml (標準容量)' },
  { size: '大杯 (L - 700ml)', priceDiff: 10, label: '大杯 700ml (+NT$10 熱門)' }
];

export const DrinkCustomModal: React.FC = () => {
  const { customizingDrink, setCustomizingDrink, addToCart } = useBeverage();

  const [selectedSize, setSelectedSize] = useState<CupSize>('大杯 (L - 700ml)');
  const [selectedIce, setSelectedIce] = useState<IceLevel>('微冰');
  const [selectedSugar, setSelectedSugar] = useState<SugarLevel>('微糖 (3分)');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [itemNote, setItemNote] = useState<string>('');

  // Reset or preset options when a drink is opened
  useEffect(() => {
    if (customizingDrink) {
      setSelectedSize('大杯 (L - 700ml)');
      setSelectedIce((customizingDrink.recommendedIce as IceLevel) || '微冰');
      setSelectedSugar((customizingDrink.recommendedSweetness as SugarLevel) || '微糖 (3分)');
      setSelectedToppings([]);
      setQuantity(1);
      setItemNote('');
    }
  }, [customizingDrink]);

  if (!customizingDrink) return null;

  const sizePriceDiff = selectedSize.includes('大杯') ? 10 : 0;
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = customizingDrink.price + sizePriceDiff + toppingTotal;
  const totalAmount = unitPrice * quantity;

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(customizingDrink, {
      size: selectedSize,
      ice: selectedIce,
      sugar: selectedSugar,
      toppings: selectedToppings,
      quantity,
      note: itemNote.trim()
    });
    setCustomizingDrink(null);
  };

  return (
    <div
      id="drink-custom-modal-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={() => setCustomizingDrink(null)}
    >
      <div
        id="drink-custom-modal"
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Hero */}
        <div className="relative bg-amber-900 text-white p-5 sm:p-6 shrink-0">
          <button
            id="close-custom-modal-btn"
            onClick={() => setCustomizingDrink(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 items-center pr-8">
            <img
              src={customizingDrink.imageUrl}
              alt={customizingDrink.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/30 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                飲品客製化設定
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {customizingDrink.name}
              </h2>
              {customizingDrink.englishName && (
                <p className="text-xs text-amber-200/80 font-medium">
                  {customizingDrink.englishName}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="font-bold text-amber-200 bg-amber-800/80 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                  基本單價 NT$ {customizingDrink.price}
                </span>
                {customizingDrink.calories !== undefined && (
                  <span className="flex items-center gap-1 text-amber-100">
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    約 {customizingDrink.calories} kcal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Ingredients Note Box */}
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-stone-700">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>成分說明與風味：</span>
            </div>
            <p className="leading-relaxed pl-5">{customizingDrink.ingredients}</p>
          </div>

          {/* 1. 容量尺寸 (Size) */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2.5">
              1. 選擇杯型容量 <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SIZE_OPTIONS.map((opt) => {
                const isSelected = selectedSize === opt.size;
                return (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => setSelectedSize(opt.size)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-700 bg-amber-50/80 text-amber-900 ring-2 ring-amber-700/20 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{opt.size}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-800" />}
                    </div>
                    <span className="text-xs text-stone-500 mt-1 font-normal">
                      {opt.priceDiff > 0 ? `+NT$ ${opt.priceDiff}` : '標準規格'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 甜度選擇 (Sugar Level) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-900">
                2. 選擇甜度 <span className="text-rose-500">*</span>
              </label>
              {customizingDrink.recommendedSweetness && (
                <span className="text-xs text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  店家推薦：{customizingDrink.recommendedSweetness}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SUGAR_OPTIONS.map((sugar) => {
                const isSelected = selectedSugar === sugar;
                return (
                  <button
                    key={sugar}
                    type="button"
                    onClick={() => setSelectedSugar(sugar)}
                    className={`py-2.5 px-2 rounded-xl border text-xs text-center font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {sugar.split(' ')[0]}
                    <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                      {sugar.split(' ')[1] || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 冰量溫度 (Ice Level) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-stone-900">
                3. 選擇冰量 / 溫度 <span className="text-rose-500">*</span>
              </label>
              {customizingDrink.recommendedIce && (
                <span className="text-xs text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  店家推薦：{customizingDrink.recommendedIce}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
              {ICE_OPTIONS.map((ice) => {
                const isSelected = selectedIce === ice;
                return (
                  <button
                    key={ice}
                    type="button"
                    onClick={() => setSelectedIce(ice)}
                    className={`py-2 px-1.5 rounded-xl border text-xs text-center font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {ice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 加料配料 (Toppings - Hidden for Coffee category) */}
          {customizingDrink.category !== 'coffee' && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-bold text-stone-900">
                  4. 加料專區 (可多選)
                </label>
                <span className="text-xs text-stone-500 font-medium">已選 {selectedToppings.length} 種</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_TOPPINGS.map((top) => {
                  const isSelected = selectedToppings.some((t) => t.id === top.id);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => toggleTopping(top)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/90 text-amber-950 font-bold ring-1 ring-amber-700/30'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-amber-800 border-amber-800 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm">{top.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-800">+NT$ {top.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. 客製備註 */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              5. 單品特殊需求備註 (選填)
            </label>
            <input
              type="text"
              placeholder="例：自備環保杯折5元、分開裝袋、不加肉桂粉等"
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity Stepper & Add to Cart */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="text-xs font-bold text-stone-600">數量</span>
            <div className="flex items-center bg-white border border-stone-300 rounded-2xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-stone-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            id="modal-add-to-cart-btn"
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <span>加入購物車</span>
            </div>
            <div className="flex items-baseline gap-1 text-amber-100">
              <span className="text-xs">總計</span>
              <span className="text-lg font-black text-white">NT$ {totalAmount}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
