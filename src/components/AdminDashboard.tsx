import React, { useState } from 'react';
import { useBeverage } from '../context/BeverageContext';
import { Drink, Order, OrderStatus, BeverageCategory } from '../types';
import { CATEGORIES } from '../data/defaultDrinks';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Flame,
  Info,
  X,
  Eye,
  Check,
  Phone,
  MapPin,
  AlertTriangle,
  FileText
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: '高山綠茶/青茶', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { label: '茉莉翡翠綠茶', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
  { label: '黑糖波霸鮮奶', url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80' },
  { label: '錫蘭厚鮮奶茶', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80' },
  { label: '厚芝士紅玉奶蓋', url: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80' },
  { label: '抹茶歐蕾拿鐵', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80' },
  { label: '冷萃黑咖啡', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80' },
  { label: '義式原味拿鐵', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80' },
  { label: '金桔檸檬氣泡飲', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80' },
  { label: '香橙翡翠鮮果茶', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
  { label: '奇異果冰沙', url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80' },
  { label: '草莓芝芝雪酪', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80' }
];

export const AdminDashboard: React.FC = () => {
  const {
    drinks,
    addDrink,
    updateDrink,
    toggleDrinkAvailability,
    deleteDrink,
    resetDefaultDrinks,
    orders,
    updateOrderStatus,
    deleteOrder,
    resetDefaultOrders,
    setActiveView
  } = useBeverage();

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'stats'>('menu');

  // Menu Management States
  const [menuFilterCategory, setMenuFilterCategory] = useState<BeverageCategory>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  // Form State for Adding / Editing Drink
  const [formName, setFormName] = useState('');
  const [formEnglishName, setFormEnglishName] = useState('');
  const [formCategory, setFormCategory] = useState<'tea' | 'milk_tea' | 'coffee' | 'other'>('tea');
  const [formPrice, setFormPrice] = useState<number>(50);
  const [formIngredients, setFormIngredients] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCalories, setFormCalories] = useState<number>(0);
  const [formIsAvailable, setFormIsAvailable] = useState<boolean>(true);
  const [formTags, setFormTags] = useState<string>('');

  // Orders Management States
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingDrink(null);
    setFormName('');
    setFormEnglishName('');
    setFormCategory('tea');
    setFormPrice(50);
    setFormIngredients('台灣阿里山高山茶原葉、純淨冷萃過濾水');
    setFormDescription('茶香四溢，入口回甘不澀。');
    setFormImageUrl(PRESET_IMAGES[0].url);
    setFormCalories(0);
    setFormIsAvailable(true);
    setFormTags('招牌推薦');
    setIsEditingModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (drink: Drink) => {
    setEditingDrink(drink);
    setFormName(drink.name);
    setFormEnglishName(drink.englishName || '');
    setFormCategory(drink.category);
    setFormPrice(drink.price);
    setFormIngredients(drink.ingredients);
    setFormDescription(drink.description);
    setFormImageUrl(drink.imageUrl);
    setFormCalories(drink.calories || 0);
    setFormIsAvailable(drink.isAvailable);
    setFormTags(drink.tags ? drink.tags.join(', ') : '');
    setIsEditingModalOpen(true);
  };

  // Save Drink (Add or Edit)
  const handleSaveDrink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0 || !formIngredients.trim()) {
      alert('請填寫完整飲料名稱、成分與價格');
      return;
    }

    const tagsArray = formTags
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingDrink) {
      // Update existing drink
      updateDrink(editingDrink.id, {
        name: formName.trim(),
        englishName: formEnglishName.trim() || undefined,
        category: formCategory,
        price: Number(formPrice),
        ingredients: formIngredients.trim(),
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim() || PRESET_IMAGES[0].url,
        calories: Number(formCalories),
        isAvailable: formIsAvailable,
        tags: tagsArray
      });
    } else {
      // Add new drink
      addDrink({
        name: formName.trim(),
        englishName: formEnglishName.trim() || undefined,
        category: formCategory,
        price: Number(formPrice),
        ingredients: formIngredients.trim(),
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim() || PRESET_IMAGES[0].url,
        calories: Number(formCalories),
        isAvailable: formIsAvailable,
        tags: tagsArray
      });
    }

    setIsEditingModalOpen(false);
  };

  // Filtered Drinks
  const filteredDrinks = drinks.filter((d) => {
    const matchesCategory =
      menuFilterCategory === 'all' || d.category === menuFilterCategory;
    const matchesSearch =
      !menuSearch.trim() ||
      d.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      d.ingredients.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Stats Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const totalCupsSold = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalQuantity, 0);
  const activeDrinksCount = drinks.filter((d) => d.isAvailable).length;

  return (
    <div id="admin-dashboard" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              店家管理後台系統
            </h2>
            <span className="bg-stone-900 text-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
              Admin Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            飲料商品菜單維護、成分與價格調整、即時訂單管理與營運數據
          </p>
        </div>

        <button
          onClick={() => setActiveView('menu')}
          className="px-5 py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Eye className="w-4 h-4" />
          <span>查看前台線上點餐</span>
        </button>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">今日營業總額</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs font-bold text-amber-800">NT$</span>
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalRevenue}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">已扣除取消訂單</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">累積訂單總數</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalOrdersCount}
            </span>
            <span className="text-xs font-bold text-stone-500">筆</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">即時同步</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">售出飲品杯數</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalCupsSold}
            </span>
            <span className="text-xs font-bold text-stone-500">杯</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">出杯熱絡</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">目前上架在售</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {activeDrinksCount}
            </span>
            <span className="text-xs font-bold text-stone-500">/ {drinks.length} 款</span>
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">商品供應充足</span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 mb-6 overflow-x-auto pb-2">
        <button
          id="admin-tab-menu"
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'menu'
              ? 'bg-amber-800 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>飲料商品菜單管理 ({drinks.length})</span>
        </button>

        <button
          id="admin-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-800 text-white shadow-md'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>訂單即時處理 ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: 飲料菜單管理 (Menu Management) */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Action Bar: Add Drink & Search & Category Filter */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                id="admin-add-drink-btn"
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>新增飲料品項</span>
              </button>

              <button
                onClick={resetDefaultDrinks}
                className="px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                title="重設為系統預設菜單"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>恢復預設菜單</span>
              </button>
            </div>

            {/* Category and Search Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <select
                value={menuFilterCategory}
                onChange={(e) => setMenuFilterCategory(e.target.value as BeverageCategory)}
                className="px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl text-stone-800 outline-hidden w-full sm:w-auto"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜尋飲料名稱、成分..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:bg-white focus:border-amber-700 text-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Drinks Table / Grid */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase">
                    <th className="py-3.5 px-4">商品圖片</th>
                    <th className="py-3.5 px-4">飲料名稱 / 分類</th>
                    <th className="py-3.5 px-4 min-w-[200px]">成分說明 (成分)</th>
                    <th className="py-3.5 px-4">售價 (價格)</th>
                    <th className="py-3.5 px-4">上架 / 下架狀態</th>
                    <th className="py-3.5 px-4 text-right">操作管理</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {filteredDrinks.map((drink) => (
                    <tr
                      key={drink.id}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        !drink.isAvailable ? 'bg-stone-50/60 opacity-75' : ''
                      }`}
                    >
                      {/* Image */}
                      <td className="py-3.5 px-4">
                        <img
                          src={drink.imageUrl}
                          alt={drink.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-2xs"
                          referrerPolicy="no-referrer"
                        />
                      </td>

                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{drink.name}</div>
                        {drink.englishName && (
                          <div className="text-xs text-stone-600">{drink.englishName}</div>
                        )}
                        <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {drink.category === 'tea' && '茶類'}
                          {drink.category === 'milk_tea' && '奶茶'}
                          {drink.category === 'coffee' && '咖啡'}
                          {drink.category === 'other' && '其他飲品'}
                        </span>
                      </td>

                      {/* Ingredients */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                          {drink.ingredients}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-amber-900 text-base">
                          NT$ {drink.price}
                        </span>
                      </td>

                      {/* Availability toggle (上架 / 下架) */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleDrinkAvailability(drink.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            drink.isAvailable
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {drink.isAvailable ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>販售中 (上架)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              <span>已停售 (下架)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(drink)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors"
                            title="修改飲料與價格/成分"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`確定要刪除「${drink.name}」嗎？`)) {
                                deleteDrink(drink.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors"
                            title="刪除商品"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDrinks.length === 0 && (
                <div className="py-12 text-center text-stone-400">
                  查無符合條件的飲料商品
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 訂單管理 (Order Management) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Filter Pills */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: '全部訂單' },
                { id: 'pending', label: '待處理' },
                { id: 'preparing', label: '製作中' },
                { id: 'ready', label: '可取餐 / 配送中' },
                { id: 'completed', label: '已完成' },
                { id: 'cancelled', label: '已取消' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setOrderStatusFilter(filter.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    orderStatusFilter === filter.id
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={resetDefaultOrders}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors flex items-center gap-1 shrink-0 self-end sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>載入測試示範訂單</span>
            </button>
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs hover:border-amber-300 transition-all flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Left: Info & Items */}
                <div className="flex-1 space-y-4">
                  {/* Top row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-black text-stone-900">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium">
                      {new Date(ord.createdAt).toLocaleTimeString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        ord.customerInfo.orderType === 'pickup'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {ord.customerInfo.orderType === 'pickup' ? '門市外帶' : '外送服務'}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-stone-400">訂購人：</span>
                      <strong className="text-stone-800">{ord.customerInfo.name}</strong> (
                      {ord.customerInfo.phone})
                    </div>
                    <div>
                      <span className="text-stone-400">預計取餐：</span>
                      <strong className="text-stone-800">{ord.customerInfo.pickupTime}</strong>
                    </div>
                    {ord.customerInfo.address && (
                      <div className="col-span-full">
                        <span className="text-stone-400">外送地址：</span>
                        <span className="text-stone-800">{ord.customerInfo.address}</span>
                      </div>
                    )}
                    {ord.customerInfo.notes && (
                      <div className="col-span-full italic text-stone-500">
                        備註: {ord.customerInfo.notes}
                      </div>
                    )}
                  </div>

                  {/* Drink Items */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-500">
                      訂購品項明細 ({ord.totalQuantity} 杯)：
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-stone-200 rounded-xl p-2 text-xs flex items-center gap-2 shadow-2xs"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-stone-800">{item.name}</span>
                            <span className="text-amber-800 font-bold ml-1.5">
                              x{item.quantity}
                            </span>
                            <div className="text-[10px] text-stone-500">
                              {item.size.split(' ')[0]} / {item.sugar.split(' ')[0]} / {item.ice}
                              {item.toppings.length > 0 &&
                                ` / +${item.toppings.map((t) => t.name).join(',')}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Status actions & Amount */}
                <div className="md:w-64 border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between shrink-0 space-y-4">
                  <div>
                    <span className="text-xs text-stone-500 block">訂單總金額</span>
                    <div className="flex items-baseline gap-1 text-amber-900">
                      <span className="text-xs font-bold">NT$</span>
                      <span className="text-3xl font-black">{ord.totalAmount}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      付款: {ord.customerInfo.paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-600 block">變更訂單狀態：</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'pending')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                          ord.status === 'pending'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        待接單
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'preparing')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                          ord.status === 'preparing'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        開始調製
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'ready')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                          ord.status === 'ready'
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        通知取餐
                      </button>
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'completed')}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                          ord.status === 'completed'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        已完成
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                      >
                        取消此單
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('確定刪除此訂單記錄？')) deleteOrder(ord.id);
                        }}
                        className="text-xs text-stone-400 hover:text-stone-600"
                      >
                        刪除記錄
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="py-16 text-center text-stone-400 bg-white rounded-3xl border border-stone-200">
                目前沒有符合條件的訂單
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Drink */}
      {isEditingModalOpen && (
        <div
          id="admin-drink-modal-backdrop"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsEditingModalOpen(false)}
        >
          <div
            id="admin-drink-modal"
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 bg-amber-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-bold text-white">
                  {editingDrink ? `修改飲料資訊：${editingDrink.name}` : '新增手搖飲品項'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveDrink} className="flex-1 overflow-y-auto p-6 space-y-4 text-stone-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 飲料名稱 */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    飲料名稱 (必填) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例：炭焙烏龍珍珠鮮奶茶"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden"
                  />
                </div>

                {/* 英文名稱 */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    英文品名 (選填)
                  </label>
                  <input
                    type="text"
                    placeholder="例：Roasted Oolong Boba Latte"
                    value={formEnglishName}
                    onChange={(e) => setFormEnglishName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden"
                  />
                </div>

                {/* 飲料分類 */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    所屬分類 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden font-medium"
                  >
                    <option value="tea">茶類 (Tea)</option>
                    <option value="milk_tea">奶茶 (Milk Tea)</option>
                    <option value="coffee">咖啡 (Coffee)</option>
                    <option value="other">其他飲品 (Other / Fruit)</option>
                  </select>
                </div>

                {/* 價格 (NT$) */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    商品單價 (NT$) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* 成分說明 (成分) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  詳細成分說明 (成分) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="例：特選南投烏龍茶原葉、在地鮮乳坊鮮奶、手工慢熬黑糖、現煮波霸珍珠"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden"
                />
              </div>

              {/* 風味描述 */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  風味特色描述
                </label>
                <textarea
                  rows={2}
                  placeholder="例：濃厚焙火香氣與鮮乳融合，香甜濃郁，層次豐富。"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden"
                />
              </div>

              {/* 圖片網址與預設圖庫選擇器 */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  商品圖片網址 (更換圖片) <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="輸入圖片 URL (https://...)"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-700 outline-hidden"
                  />
                </div>

                {/* Preset image picker buttons */}
                <div className="mt-2">
                  <span className="text-[11px] text-stone-500 block mb-1">
                    或點選精選飲品預設圖片快速填入：
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => setFormImageUrl(img.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                          formImageUrl === img.url
                            ? 'bg-amber-800 text-white border-amber-800 font-bold'
                            : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Image */}
                {formImageUrl && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
                    <img
                      src={formImageUrl}
                      alt="預覽"
                      className="w-12 h-12 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs text-stone-500">圖片預覽正常顯示</span>
                  </div>
                )}
              </div>

              {/* 熱量 & 標籤 & 上架狀態 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    預估熱量 (kcal)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formCalories}
                    onChange={(e) => setFormCalories(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    特色標籤 (逗號分隔)
                  </label>
                  <input
                    type="text"
                    placeholder="招牌推薦, 人氣No.1"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    上下架狀態
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormIsAvailable((prev) => !prev)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${
                      formIsAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    {formIsAvailable ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>立即上架販售</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>暫停供應 (下架)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-bold shadow-md transition-all"
                >
                  {editingDrink ? '儲存修改' : '確認新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
