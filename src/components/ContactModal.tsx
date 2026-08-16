import React, { useState } from 'react';
import {
  Mail,
  Phone,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Calendar,
  Building2,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  category: string;
  preferredDate: string;
  taskDetails: string;
  feedback: string;
}

export const ContactModal: React.FC = () => {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdenllnj';

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    category: '大宗團體外送',
    preferredDate: '',
    taskDetails: '',
    feedback: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      category: '大宗團體外送',
      preferredDate: '',
      taskDetails: '',
      feedback: ''
    });
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorMessage('請填寫聯絡人姓名或稱呼');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('請填寫聯絡電話');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('請填寫電子信箱');
      return;
    }
    if (!formData.taskDetails.trim()) {
      setErrorMessage('請填寫交辦事項或具體需求說明');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          聯絡人姓名: formData.name,
          聯絡電話: formData.phone,
          電子信箱: formData.email,
          需求類別: formData.category,
          預計交辦日期或時段: formData.preferredDate || '未指定',
          交辦事項與需求內容: formData.taskDetails,
          顧客意見與改善回饋: formData.feedback || '無額外回饋',
          送出時間: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
          來源頁面: '拾茶時光線上點餐系統'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        if (data && data.errors && data.errors.length > 0) {
          setErrorMessage(data.errors.map((err: any) => err.message).join(', '));
        } else {
          setErrorMessage('傳送表單時發生錯誤，請稍後再試或直接來電聯繫。');
        }
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMessage('網路連線異常，請檢查網路設定後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Navbar Contact Us Button */}
      <button
        id="nav-contact-btn"
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 border border-stone-200/80 dark:border-stone-700 cursor-pointer hover:text-amber-800 dark:hover:text-amber-300"
        title="聯絡我們・客製交辦與意見回饋"
      >
        <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="hidden sm:inline">聯絡我們</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card */}
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 animate-scale-in my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">聯絡我們・顧客交辦表單</h3>
                    <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      即時轉交專人
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    歡迎提出大宗團訂、客製化活動茶歇、特殊交辦事項或意見回饋
                  </p>
                </div>
              </div>

              <button
                id="close-contact-modal-btn"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {isSubmitted ? (
                /* Success View */
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    感謝您的聯絡！表單已成功送出
                  </h4>
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                    我們已透過系統接收到您的交辦事項與聯絡資訊，拾茶時光門市專員將於營業時間內儘速與您聯繫確認細節。
                  </p>

                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors cursor-pointer"
                    >
                      填寫另一筆需求表單
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setIsOpen(false);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors cursor-pointer shadow-sm"
                    >
                      關閉視窗
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      需求類別 <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: '大宗團體外送', icon: Building2 },
                        { label: '活動茶歇合作', icon: Sparkles },
                        { label: '商品與服務建議', icon: MessageSquare },
                        { label: '其他交辦事項', icon: Mail }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, category: item.label }))
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                            formData.category === item.label
                              ? 'bg-amber-800 text-white border-amber-800 dark:bg-amber-700 dark:border-amber-600 shadow-xs'
                              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700'
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        聯絡人姓名 / 稱呼 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="例如：陳小姐 / 林先生"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        聯絡電話 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="例如：0912-345-678"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and Preferred Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        電子信箱 (Email) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="例如：user@example.com"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                        />
                      </div>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        希望交辦或回覆時段 (選填)
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          placeholder="例如：本週五下午兩點前 / 盡速聯繫"
                          className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Task Details / Requirements */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      交辦事項與需求詳細說明 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="taskDetails"
                      required
                      rows={3}
                      value={formData.taskDetails}
                      onChange={handleInputChange}
                      placeholder="請簡述您的需求內容（例如：預計訂購杯數、飲品客製化要求、外送地點、發票統編需求等）..."
                      className="w-full p-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400 leading-relaxed"
                    />
                  </div>

                  {/* Feedback / Suggestions */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      給拾茶時光的意見與建議回饋 (選填)
                    </label>
                    <textarea
                      name="feedback"
                      rows={2}
                      value={formData.feedback}
                      onChange={handleInputChange}
                      placeholder="對我們的茶飲品質、出餐速度或線上訂餐系統有任何建議，歡迎隨時與我們分享！"
                      className="w-full p-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-hidden transition-all text-stone-800 dark:text-stone-100 placeholder:text-stone-400 leading-relaxed"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button & Info */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>專人將於 1~2 個工作小時內致電或回信</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        id="submit-contact-form-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 active:scale-95 transition-all shadow-md shadow-amber-900/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>傳送中...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>確認送出聯絡表單</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
