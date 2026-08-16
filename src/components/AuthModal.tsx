import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, AuthMode } from '../context/AuthContext';
import {
  Mail,
  Lock,
  X,
  LogIn,
  UserPlus,
  KeyRound,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    signInWithEmail,
    signUpWithEmail,
    resetPasswordForEmail,
    updateUserPassword
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Forgot Password Mode
    if (authMode === 'forgot-password') {
      if (!email.trim()) {
        setErrorMsg('請輸入您註冊時使用的 Email 電子郵件');
        return;
      }
      setLoading(true);
      try {
        const { error } = await resetPasswordForEmail(email.trim());
        if (error) {
          setErrorMsg(`發送重設信失敗：${error.message}`);
        } else {
          setSuccessMsg(`🎉 重設密碼郵件已成功寄送至 ${email.trim()}！請檢查您的收件匣（或垃圾郵件匣）並點擊信中連結完成重設。`);
        }
      } catch (err: any) {
        setErrorMsg(err.message || '發生未預期的錯誤，請稍後再試');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Update Password Mode (after clicking email recovery link)
    if (authMode === 'update-password') {
      if (!newPassword.trim()) {
        setErrorMsg('請輸入新密碼');
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg('新密碼長度至少需 6 個字元');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setErrorMsg('兩次輸入的新密碼不一致，請重新確認');
        return;
      }
      setLoading(true);
      try {
        const { error } = await updateUserPassword(newPassword);
        if (error) {
          setErrorMsg(`密碼更新失敗：${error.message}`);
        } else {
          setSuccessMsg('🎉 密碼已成功更新！即將為您關閉視窗...');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setNewPassword('');
            setConfirmNewPassword('');
            setAuthMode('login');
          }, 1500);
        }
      } catch (err: any) {
        setErrorMsg(err.message || '更新密碼時發生錯誤，請稍後再試');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. Standard Login / Register Modes
    if (!email.trim() || !password.trim()) {
      setErrorMsg('請輸入完整的 Email 與密碼');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('密碼長度至少需 6 個字元');
      return;
    }

    if (authMode === 'register' && password !== confirmPassword) {
      setErrorMsg('兩次輸入的密碼不一致，請重新確認');
      return;
    }

    setLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await signInWithEmail(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMsg('帳號或密碼錯誤，請重新輸入，或點擊下方「忘記密碼？」重設');
          } else if (error.message.includes('Email not confirmed')) {
            setErrorMsg('此帳號尚未驗證信箱，請至信箱確認驗證信件');
          } else {
            setErrorMsg(`登入失敗：${error.message}`);
          }
        } else {
          setSuccessMsg('登入成功！');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setEmail('');
            setPassword('');
          }, 600);
        }
      } else {
        const { error, user, session } = await signUpWithEmail(email.trim(), password);
        if (error) {
          if (error.message.includes('already registered')) {
            setErrorMsg('此 Email 已被註冊過，請直接切換至登入');
          } else {
            setErrorMsg(`註冊失敗：${error.message}`);
          }
        } else if (session) {
          setSuccessMsg('🎉 註冊成功並已自動登入！');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }, 800);
        } else {
          setSuccessMsg('🎉 帳號已建立！請至您的 Email 信箱點擊驗證信以啟用登入（若 Supabase 已關閉 Confirm email，請直接點擊登入）。');
          setTimeout(() => {
            setAuthMode('login');
          }, 2500);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || '發生未預期的錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return createPortal(
    <div
      id="auth-modal-portal"
      className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => !loading && setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              {authMode === 'login' ? (
                <LogIn className="w-5 h-5" />
              ) : authMode === 'register' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <KeyRound className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {authMode === 'login'
                  ? '會員登入'
                  : authMode === 'register'
                  ? '註冊新會員帳號'
                  : authMode === 'forgot-password'
                  ? '重設密碼'
                  : '設定全新密碼'}
              </h3>
              <p className="text-xs text-amber-200/80">
                {authMode === 'forgot-password'
                  ? '輸入 Email 寄送密碼重設驗證連結'
                  : authMode === 'update-password'
                  ? '請輸入並確認您的新密碼'
                  : '拾茶時光・專屬雲端訂單同步服務'}
              </p>
            </div>
          </div>
          <button
            onClick={() => !loading && setIsAuthModalOpen(false)}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switch (Only for login & register) */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="p-2 bg-stone-100 dark:bg-stone-800/80 flex rounded-none border-b border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>帳號登入</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white dark:bg-stone-900 text-amber-900 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>註冊帳號</span>
            </button>
          </div>
        )}

        {/* Back header for forgot-password mode */}
        {authMode === 'forgot-password' && (
          <div className="px-6 pt-4 pb-1 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回會員登入</span>
            </button>
            <span className="text-[11px] text-stone-400">找回帳號密碼</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Mode 1: Forgot Password Form */}
          {authMode === 'forgot-password' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                請輸入您註冊會員時的 <strong>Email 電子信箱</strong>。系統將發送一封包含<strong>密碼重設連結</strong>的信件至您的信箱。
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <span>註冊電子郵件 (Email)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-forgot-submit-btn"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>寄送中，請稍候...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-200" />
                    <span>發送重設密碼驗證信</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mode 2: Update Password Form (Recovery) */}
          {authMode === 'update-password' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                身份驗證成功！請在此設定您的<strong>全新密碼</strong>。
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <span>設定新密碼</span>
                  <span className="text-rose-500">*</span>
                  <span className="text-[11px] text-stone-400 font-normal">(至少 6 碼)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-new-password-input"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="請輸入全新密碼"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <span>再次確認新密碼</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-confirm-new-password-input"
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="請再次輸入新密碼"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-update-password-submit-btn"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>更新中，請稍候...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>確認變更並儲存新密碼</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mode 3: Login & Register Form */}
          {(authMode === 'login' || authMode === 'register') && (
            <>
              {/* Email input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <span>電子郵件 (Email)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <span>密碼</span>
                    <span className="text-rose-500">*</span>
                    <span className="text-[11px] text-stone-400 font-normal">(至少 6 碼)</span>
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      id="auth-forgot-password-link"
                      onClick={() => handleSwitchMode('forgot-password')}
                      className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 hover:underline cursor-pointer transition-colors"
                    >
                      忘記密碼？
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password (Register mode only) */}
              {authMode === 'register' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <span>再次輸入密碼</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-confirm-password-input"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="請再次輸入密碼"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:bg-white dark:focus:bg-stone-900 focus:border-amber-600 outline-hidden transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-linear-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>處理中，請稍候...</span>
                  </>
                ) : authMode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 text-amber-200" />
                    <span>登入會員帳號</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-200" />
                    <span>完成註冊並登入</span>
                  </>
                )}
              </button>

              {/* Mode Switch Footnote */}
              <div className="pt-2 text-center">
                {authMode === 'login' ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    還沒有會員帳號？{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('register')}
                      className="text-amber-800 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      立即免費註冊
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    已經有會員帳號了？{' '}
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="text-amber-800 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      點此直接登入
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
};
