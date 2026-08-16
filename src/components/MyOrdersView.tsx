import React, { useEffect, useState } from 'react';
import { useBeverage } from '../context/BeverageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Package,
  Calendar,
  Phone,
  User as UserIcon,
  RefreshCw,
  ArrowRight,
  CupSoda,
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Sparkles
} from 'lucide-react';

export interface SupabaseOrderRow {
  id: string | number;
  user_id: string;
  name: string;
  phone: string;
  items: any; // array or text
  quantity: number;
  notes?: string;
  created_at: string;
}

export const MyOrdersView: React.FC = () => {
  const { user, openLoginModal } = useAuth();
  const { setActiveView, showToast } = useBeverage();

  const [dbOrders, setDbOrders] = useState<SupabaseOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);

  const fetchMyOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Supabase query with RLS: will only fetch records where user_id matches auth.uid()
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDbOrders(data || []);
    } catch (err: any) {
      console.error('Fetch Supabase orders error:', err);
      setError(err.message || '無法讀取訂單記錄，請確認網路連線或資料表設定');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // If user is not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-300/40">
          <LogIn className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          請先登入會員帳號
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2 mb-6 leading-relaxed">
          登入後即可在 Supabase 雲端安全檢視您的專屬歷史訂單與最新調製進度。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={openLoginModal}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>立即登入 / 註冊</span>
          </button>
          <button
            onClick={() => setActiveView('menu')}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl text-xs sm:text-sm transition-all hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
          >
            返回菜單首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="my-orders-view" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-800 flex items-center justify-center text-amber-200 shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                我的訂單記錄
                <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-semibold border border-amber-200/60 dark:border-amber-900/60">
                  Supabase RLS 專屬防護
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                目前登入帳號：<strong className="text-amber-800 dark:text-amber-400 font-mono">{user.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchMyOrders}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>重新整理</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('menu')}
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
          >
            <span>再點一杯飲品</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">讀取訂單發生錯誤：</p>
            <p>{error}</p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              提示：請確認已在 Supabase SQL Editor 執行建立 <code>orders</code> 資料表及 RLS 政策指令。
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="py-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/4"></div>
                <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6"></div>
              </div>
              <div className="h-10 bg-stone-100 dark:bg-stone-800/60 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && dbOrders.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 my-6 p-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 flex items-center justify-center text-amber-700 dark:text-amber-400 mx-auto mb-3">
            <CupSoda className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
            目前尚無您的訂單記錄
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
            您可以在菜單中挑選喜愛的飲料加入購物車並送出訂單，系統會自動將訂單同步儲存至您的專屬帳號。
          </p>
          <button
            onClick={() => setActiveView('menu')}
            className="mt-5 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>立即挑選飲品</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && dbOrders.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 px-1 flex items-center justify-between">
            <span>共找到 {dbOrders.length} 筆歷史訂單</span>
            <span className="text-[11px] text-amber-800 dark:text-amber-400">
              * 資料已透過 Supabase Row Level Security (RLS) 僅您個人可見
            </span>
          </div>

          {dbOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const dateStr = new Date(ord.created_at).toLocaleString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Parse items if stored as JSON or string
            let parsedItems: any[] = [];
            let itemsSummary = '';

            if (Array.isArray(ord.items)) {
              parsedItems = ord.items;
              itemsSummary = ord.items.map((i: any) => `${i.name} x${i.quantity || 1}`).join('、');
            } else if (typeof ord.items === 'object' && ord.items !== null) {
              if (Array.isArray(ord.items.items)) {
                parsedItems = ord.items.items;
                itemsSummary = parsedItems.map((i: any) => `${i.name} x${i.quantity || 1}`).join('、');
              } else {
                itemsSummary = JSON.stringify(ord.items);
              }
            } else if (typeof ord.items === 'string') {
              try {
                const parsed = JSON.parse(ord.items);
                if (Array.isArray(parsed)) {
                  parsedItems = parsed;
                  itemsSummary = parsed.map((i: any) => `${i.name} x${i.quantity || 1}`).join('、');
                } else {
                  itemsSummary = ord.items;
                }
              } catch {
                itemsSummary = ord.items;
              }
            }

            return (
              <div
                key={ord.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Card Top Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                        #{ord.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300/40">
                        共 {ord.quantity} 杯
                      </span>
                    </div>

                    <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                      {itemsSummary || '拾茶特調茶飲'}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        {ord.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        {ord.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        雲端已同步
                      </span>
                    </div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-stone-50/70 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 text-xs space-y-3 animate-fade-in">
                    {/* Item list details */}
                    {parsedItems.length > 0 ? (
                      <div className="space-y-2">
                        <p className="font-bold text-stone-700 dark:text-stone-300">訂購品項詳細客製：</p>
                        <div className="space-y-1.5">
                          {parsedItems.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-stone-800 dark:text-stone-200">
                                  {item.name}
                                </span>
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                                  {item.size} / {item.ice} / {item.sugar}
                                  {item.toppings && item.toppings.length > 0 && (
                                    <span> + 加料: {item.toppings.map((t: any) => t.name).join(', ')}</span>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold text-amber-800 dark:text-amber-400">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                        <span className="font-bold text-stone-700 dark:text-stone-300">品項資訊：</span>
                        <span className="text-stone-600 dark:text-stone-400 ml-2">{itemsSummary}</span>
                      </div>
                    )}

                    {/* Notes if any */}
                    {ord.notes && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
                        <strong className="font-bold">訂單備註：</strong> {ord.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
