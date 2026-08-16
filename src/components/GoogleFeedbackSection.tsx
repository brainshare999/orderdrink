import React, { useState } from 'react';
import { MessageSquareHeart, ExternalLink, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const GoogleFeedbackSection: React.FC = () => {
  const FORM_URL = 'https://forms.gle/XM6b7b2AUb8yekiW7';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="customer-feedback-section"
      className="mt-12 bg-linear-to-br from-amber-500/10 via-stone-900/5 to-amber-600/10 dark:from-amber-950/40 dark:via-stone-900 dark:to-amber-900/30 rounded-3xl p-6 sm:p-8 border border-amber-300/60 dark:border-amber-700/40 shadow-xl backdrop-blur-sm relative overflow-hidden transition-all"
    >
      {/* Ambient background decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-amber-200/40 dark:border-stone-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-bold">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>顧客滿意度與建議調查</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <span>您的回饋是我們進步的動力</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
            感謝您蒞臨「拾茶時光」！誠摯邀請您填寫下方 Google 表單回饋用餐與訂餐體驗，讓我們能持續精進茶飲品質與服務。
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <span>新視窗開啟 Google 表單</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/80 dark:bg-stone-800 hover:bg-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-all cursor-pointer"
          >
            <span>{isOpen ? '收合表單' : '展開表單'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-6 rounded-2xl overflow-hidden border border-amber-200/80 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-inner">
          <div className="p-3 bg-amber-50/80 dark:bg-stone-900 border-b border-amber-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Google 表單即時內嵌預覽・填寫完成後請點擊表單內的「提交」</span>
            </div>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
            >
              無法正常顯示？點此前往原連結 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative w-full overflow-hidden min-h-[560px] bg-stone-50 dark:bg-stone-900">
            <iframe
              src={FORM_URL}
              width="100%"
              height="620"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="拾茶時光 顧客滿意度與建議 Google 表單"
              className="w-full h-[620px] rounded-b-2xl border-0"
            >
              載入中...
            </iframe>
          </div>
        </div>
      )}
    </section>
  );
};
