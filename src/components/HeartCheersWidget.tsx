import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Flame, CheckCircle2, RefreshCw } from 'lucide-react';

export const HeartCheersWidget: React.FC = () => {
  const token = 'ut_WQ6AoT7sCZaBPe9rrcCwbfXmppF5ggqninThfe9HY';
  const directApiUrl = 'https://api.counterapi.dev/v2/brain-shares-team-5094/first-counter-5094';
  const proxyBaseUrl = '/api/counter';
  
  // Use direct API on GitHub Pages or static hosts where no backend proxy exists
  const getApiUrl = (subpath: string = '') => {
    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') || 
      window.location.hostname.includes('pages.dev') ||
      window.location.protocol === 'file:'
    );
    const base = isStaticHost ? directApiUrl : proxyBaseUrl;
    return `${base}${subpath}`;
  };

  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const extractValue = (data: any): number | null => {
    console.log('Counter API response data:', data);
    const val = 
      data?.data?.value ?? 
      data?.data?.count ?? 
      data?.value ?? 
      data?.count ?? 
      data?.data;
    
    if (val !== undefined && val !== null) {
      const parsed = Number(val);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  };

  const fetchCount = async () => {
    setLoading(true);
    try {
      let url = `${getApiUrl()}?_t=${Date.now()}`;
      let res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Fallback to direct API if proxy is not found (e.g. static site)
      if (!res.ok && !url.startsWith('https://')) {
        url = `${directApiUrl}?_t=${Date.now()}`;
        res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      const data = await res.json();
      const val = extractValue(data);
      if (val !== null) {
        setCount(val);
        setMessage('🔄 已成功取得最新統計資料！');
        setTimeout(() => setMessage(null), 2500);
      }
    } catch (err) {
      console.error('Fetch count error:', err);
      // Try direct API fallback on any network error
      try {
        const directRes = await fetch(`${directApiUrl}?_t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const directData = await directRes.json();
        const val = extractValue(directData);
        if (val !== null) {
          setCount(val);
          setMessage('🔄 已成功取得最新統計資料！');
          setTimeout(() => setMessage(null), 2500);
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback count error:', fallbackErr);
      }
      setMessage('❌ 取得統計資料失敗，請稍後再試');
      setTimeout(() => setMessage(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const handleCheers = async () => {
    setLoading(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    try {
      let url = `${getApiUrl('/up')}?_t=${Date.now()}`;
      let res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fallback to direct API if proxy is not found
      if (!res.ok && !url.startsWith('https://')) {
        url = `${directApiUrl}/up?_t=${Date.now()}`;
        res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      const data = await res.json();
      const val = extractValue(data);
      if (val !== null) {
        setCount(val);
      } else {
        await fetchCount();
      }
      setMessage('❤️ 感謝您的愛心鼓勵！集氣成功！');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Cheers error:', err);
      // Try direct fallback
      try {
        const directRes = await fetch(`${directApiUrl}/up?_t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const directData = await directRes.json();
        const val = extractValue(directData);
        if (val !== null) {
          setCount(val);
          setMessage('❤️ 感謝您的愛心鼓勵！集氣成功！');
          setTimeout(() => setMessage(null), 3000);
          return;
        }
      } catch (fallbackErr) {
        console.error('Direct fallback error:', fallbackErr);
      }
      setMessage('❌ 集氣失敗，請稍後再試');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-linear-to-br from-rose-500/10 via-amber-500/5 to-rose-600/10 rounded-3xl p-6 sm:p-10 border border-rose-200/60 shadow-xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-800 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500 animate-pulse" />
            <span>粉絲愛心集氣牆・為拾茶時光打氣</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
            <span>給我們一個愛心鼓勵吧！</span>
            <Sparkles className="w-5 h-5 text-rose-500" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg">
            您的每一次點擊與愛心，都是我們堅持現萃好茶與職人手作的動力泉源。點擊下方按鈕即可即時連線雲端計數器！
          </p>
        </div>

        {/* Counter Display & Action Button */}
        <div className="flex flex-col items-center gap-4 bg-white/90 border border-rose-200/80 rounded-3xl p-6 shadow-lg min-w-[220px]">
          <div className="text-center">
            <span className="text-xs text-rose-700 font-extrabold uppercase tracking-wider block mb-1">目前總愛心集氣數</span>
            <div className={`text-4xl sm:text-5xl font-black text-rose-600 font-mono tracking-tight ${animating ? 'scale-125 text-rose-500 transition-transform duration-300' : ''}`}>
              {count !== null ? count.toLocaleString() : (loading ? '...' : '0')}
            </div>
          </div>

          <button
            onClick={handleCheers}
            disabled={loading}
            className="w-full px-6 py-3.5 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50 group cursor-pointer"
          >
            <Heart className={`w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform ${animating ? 'animate-bounce' : ''}`} />
            <span>❤️ 送出愛心鼓勵 (+1)</span>
          </button>

          <button
            onClick={fetchCount}
            disabled={loading}
            className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>重新整理計數</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs font-medium flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};
