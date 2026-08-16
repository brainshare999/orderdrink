import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export const HeartCheersWidget: React.FC = () => {
  const STORAGE_KEY_LIKES = 'siptea_heart_likes_count';

  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return 26;
  });

  const [displayCount, setDisplayCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [jumpKey, setJumpKey] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; dx: number; rot: number; text: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const animFrameRef = useRef<number | null>(null);

  // Dedicated counting animation from startVal to endVal
  const runCountUpAnimation = (startVal: number, endVal: number, durationMs = 1000) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsBouncing(true);
    setJumpKey((k) => k + 1);
    setDisplayCount(startVal);

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeOut);
      setDisplayCount(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayCount(endVal);
        setTimeout(() => setIsBouncing(false), 350);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const extractValue = (data: any): number | null => {
    if (!data) return null;

    const candidates = [
      data?.data?.up_count,
      data?.data?.count,
      data?.data?.value,
      data?.up_count,
      data?.count,
      data?.value,
      data?.data?.total,
      data?.total
    ];

    for (const c of candidates) {
      if (c !== undefined && c !== null) {
        const num = Number(c);
        if (!isNaN(num) && num >= 0) return num;
      }
    }

    if (typeof data?.data === 'number' && !isNaN(data.data)) {
      return data.data;
    }
    if (typeof data === 'number' && !isNaN(data)) {
      return data;
    }

    return null;
  };

  const updateCountState = (val: number) => {
    setCount(val);
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, val.toString());
    } catch {}
  };

  const fetchCount = async (isManualRefresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/counter?_t=${Date.now()}`);
      let targetVal = count;
      if (res.ok) {
        const data = await res.json();
        const val = extractValue(data);
        if (val !== null) {
          targetVal = val;
          updateCountState(val);
        }
      }

      if (isManualRefresh) {
        // Animate jumping count-up starting from 0 to the target count!
        runCountUpAnimation(0, targetVal, 1200);
        setMessage(`🔄 已重新整理計數！目前累計 ${targetVal} 顆愛心！`);
      } else {
        // Initial load count-up
        runCountUpAnimation(0, targetVal, 900);
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.warn('Fetch counter error, using cached count:', err);
      if (isManualRefresh) {
        runCountUpAnimation(0, count, 1200);
        setMessage(`🔄 目前已是最新統計資料！(${count} 顆愛心)`);
        setTimeout(() => setMessage(null), 2500);
      } else {
        runCountUpAnimation(0, count, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount(false);
  }, []);

  const handleCheers = async () => {
    if (loading) return;
    setLoading(true);

    // Spawn floating heart / +1 particles
    const particleId = Date.now() + Math.random();
    const randomDx = (Math.random() - 0.5) * 60; // -30px to +30px
    const randomRot = (Math.random() - 0.5) * 30; // -15deg to +15deg
    const emojis = ['+1 ❤️', '💖 +1', '✨ +1', '🧋 +1', '❤️ +1'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    setFloatingHearts((prev) => [
      ...prev,
      { id: particleId, dx: randomDx, rot: randomRot, text: randomEmoji }
    ]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((p) => p.id !== particleId));
    }, 1100);

    const newOptimisticCount = count + 1;
    updateCountState(newOptimisticCount);
    runCountUpAnimation(displayCount, newOptimisticCount, 400);

    try {
      const res = await fetch(`/api/counter/up?_t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        const val = extractValue(data);
        if (val !== null && val !== newOptimisticCount) {
          updateCountState(val);
          runCountUpAnimation(newOptimisticCount, val, 400);
        }
      }
      setMessage('❤️ 感謝您的愛心鼓勵！集氣成功！');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.warn('Increment counter network error, optimistic saved:', err);
      setMessage('❤️ 感謝您的愛心鼓勵！集氣成功！');
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-linear-to-br from-rose-500/10 via-amber-500/5 to-rose-600/10 dark:from-rose-950/40 dark:via-stone-900 dark:to-rose-900/30 rounded-3xl p-6 sm:p-10 border border-rose-200/60 dark:border-rose-900/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-500/10 dark:bg-rose-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-800 dark:text-rose-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-rose-500 animate-pulse" />
            <span>粉絲愛心集氣牆・為拾茶時光打氣</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
            <span>給我們一個愛心鼓勵吧！</span>
            <Sparkles className="w-5 h-5 text-rose-500" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg">
            您的每一次點擊與愛心，都是我們堅持現萃好茶與職人手作的動力泉源。點擊下方按鈕即可即時連線雲端計數器！
          </p>
        </div>

        {/* Counter Display & Action Button */}
        <div className="relative flex flex-col items-center gap-4 bg-white/95 dark:bg-stone-900 border border-rose-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-lg min-w-[230px]">
          {/* Floating heart particles */}
          {floatingHearts.map((heart) => (
            <div
              key={heart.id}
              style={
                {
                  '--dx': `${heart.dx}px`,
                  '--rot': `${heart.rot}deg`
                } as React.CSSProperties
              }
              className="absolute top-2 left-1/2 pointer-events-none z-30 font-black text-sm text-rose-500 bg-white/90 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-rose-300 shadow-md animate-float-heart whitespace-nowrap"
            >
              {heart.text}
            </div>
          ))}

          <div className="text-center relative">
            <span className="text-xs text-rose-700 dark:text-rose-400 font-extrabold uppercase tracking-wider block mb-1">
              目前總愛心集氣數
            </span>
            <div
              key={jumpKey}
              className={`text-4xl sm:text-5xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight inline-block select-none ${
                isBouncing ? 'animate-number-jump' : 'transition-transform duration-200 hover:scale-105'
              }`}
            >
              {displayCount.toLocaleString()}
            </div>
          </div>

          <button
            id="send-cheers-btn"
            onClick={handleCheers}
            disabled={loading}
            className="w-full px-6 py-3.5 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition-all group cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform ${
                isBouncing ? 'animate-bounce' : ''
              }`}
            />
            <span>❤️ 送出愛心鼓勵 (+1)</span>
          </button>

          <button
            id="refresh-cheers-count-btn"
            onClick={() => fetchCount(true)}
            disabled={loading}
            className="text-[11px] text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>重新整理計數</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium flex items-center justify-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

