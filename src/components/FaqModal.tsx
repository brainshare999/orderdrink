import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Q1: 請問外送的最低門檻與外送費是如何計算的？",
    answer: "全館訂單滿 $500 即可享有專人免費外送服務！若未達 $500，系統將酌收 $60 元外送跑腿費。您也可以選擇線上點餐後至門市現場自行取餐，免收外送費。"
  },
  {
    question: "Q2: 飲品可以調整冰塊甜度嗎？加料需要額外收費嗎？",
    answer: "可以的！在線上菜單點選任一飲品後，即可自由客製化調整甜度（正常、少糖、半糖、微糖、無糖）與冰塊（正常、少冰、微冰、去冰、溫熱）。加料區（珍珠、椰果、芋圓等）每份均標示清晰價格，任君搭配。"
  },
  {
    question: "Q3: 訂單送出後，我要如何查詢製作進度或外送狀態？",
    answer: "點擊導覽列上的「訂單進度」按鈕，即可隨時查閱您目前所有訂單的即時狀態（包括：等待接單、調製中、已完成/外送中）。系統也會在狀態更新時提供即時通知。"
  },
  {
    question: "Q4: 如果我有團體訂購、企業福委會或活動茶歇需求該怎麼聯繫？",
    answer: "歡迎直接撥打門市外送專線 (02) 2345-6789，或點選「聯絡我們」填寫顧客交辦表單。我們提供大型企業與學校團體的大宗預訂優惠與客製化外送時段服務！"
  }
];

interface FaqModalProps {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
  showDefaultTrigger?: boolean;
}

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpenExternal,
  onCloseExternal,
  showDefaultTrigger = true
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first open

  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (onCloseExternal && !open) {
      onCloseExternal();
    }
    setInternalOpen(open);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative">
      {/* FAQ Button placed on the navbar */}
      {showDefaultTrigger && (
        <button
          id="nav-faq-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-stone-200/80 dark:border-stone-700 cursor-pointer"
          title="常見問題 Q&A"
        >
          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">常見問題</span>
        </button>
      )}

      {/* FAQ Modal / Popover Rendered to Body Portal */}
      {isOpen &&
        createPortal(
          <div
            id="faq-modal-portal"
            className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            {/* Dialog Container */}
            <div
              className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 animate-scale-in my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4.5 bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">常見問題 Q&A</h3>
                    <p className="text-xs text-amber-200/80">拾茶時光點餐與外送常見疑問解答</p>
                  </div>
                </div>
                <button
                  id="close-faq-modal-btn"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-colors cursor-pointer"
                  aria-label="關閉"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Accordion Content */}
              <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  點擊下方問題可展開查看詳細解答：
                </p>

                {faqData.map((item, index) => {
                  const isExpanded = openIndex === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-amber-500/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-amber-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full px-4 py-3.5 text-left font-bold text-sm text-stone-800 dark:text-stone-100 flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="leading-snug">{item.question}</span>
                        <span className="shrink-0 w-6 h-6 rounded-full bg-stone-200/70 dark:bg-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-200/60 dark:border-stone-800/80">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 text-right">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  了解，關閉視窗
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
