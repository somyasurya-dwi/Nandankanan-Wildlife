import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  User, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Send,
  Clock
} from 'lucide-react';
import { playTargetLockedSound } from '../utils/audioSynthesizer';

export default function SignInPage({ onLoginSuccess, onBackToSanctuary }) {
  // Method: 'otp' | 'password' (default is 'otp')
  const [authMethod, setAuthMethod] = useState('otp');
  
  // Tabs: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState('signin');

  // OTP Step: 'input_email' | 'verify_otp'
  const [otpStep, setOtpStep] = useState('input_email');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Recovery / Reset
  const [isForgotView, setIsForgotView] = useState(false);
  const [isResetView, setIsResetView] = useState(false);
  const [resetUid, setResetUid] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Timer for Resend OTP
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI States & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Parse URL hash on mount or change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#reset-password')) {
        const qIdx = hash.indexOf('?');
        if (qIdx !== -1) {
          const params = new URLSearchParams(hash.substring(qIdx));
          setResetUid(params.get('uid') || '');
          setResetToken(params.get('token') || '');
          setIsResetView(true);
          setAuthMethod('password');
        } else {
          setIsResetView(true);
          setAuthMethod('password');
        }
      } else if (hash === '#register') {
        setActiveTab('register');
        setOtpStep('input_email');
      } else if (hash === '#signin' || hash === '#login') {
        setActiveTab('signin');
        setOtpStep('input_email');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Confetti celebration
  const triggerCelebration = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#26734D', '#C8A96B', '#123D2B', '#E5A836', '#F5F4EA']
    });
  };

  // Helper to call backend API with multi-target fallback
  const callApi = async (endpoint, payload, method = 'POST') => {
    const targets = [
      endpoint,
      `http://127.0.0.1:8000${endpoint}`,
      `http://localhost:8000${endpoint}`
    ];
    let lastError = null;
    for (const url of targets) {
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: payload ? JSON.stringify(payload) : undefined
        });
        return res;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('Connection failed');
  };

  // Finish authentication & transition to sanctuary
  const finishAuth = (userData, token) => {
    if (token) {
      localStorage.setItem('nandankanan_token', token);
    }
    if (userData) {
      localStorage.setItem('nandankanan_user', JSON.stringify(userData));
    }

    try { playTargetLockedSound(); } catch (err) {}
    triggerCelebration();

    setRedirecting(true);
    setTimeout(() => {
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 1100);
  };

  // 1. STEP 1: SEND SECURE OTP TO GMAIL
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid Gmail or email address.');
      return;
    }

    if (activeTab === 'register' && !cleanName) {
      setError('Please enter your Full Name.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/send-email-otp/', {
        email: cleanEmail,
        name: cleanName
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpStep('verify_otp');
        setOtpCode('');
        setResendCooldown(30);
        setSuccessMsg(data.message || `A secure verification code has been sent directly to ${cleanEmail}.`);
      } else {
        setError(data.error || 'Failed to dispatch verification email. Please check backend SMTP settings.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. STEP 2: VERIFY SECURE OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();
    const cleanName = fullName.trim();

    if (!cleanOtp) {
      setError('Please enter the verification code received in your email.');
      return;
    }

    if (cleanOtp.length < 6 || cleanOtp.length > 20) {
      setError('Please enter a valid verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/verify-email-otp/', {
        email: cleanEmail,
        otp: cleanOtp,
        name: cleanName
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Verification successful! Logging you in...');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Invalid verification code. Please check your Gmail inbox and enter the exact code.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. RESEND OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    await handleSendOtp();
  };

  // 4. PASSWORD LOGIN HANDLER (FALLBACK)
  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your Email Address and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/login/', {
        email: cleanEmail,
        username: cleanEmail,
        password: cleanPassword
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Signed in successfully!');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid registered Email Address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/forgot-password/', { email: cleanEmail });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMsg(data.message || `Password reset link sent to ${cleanEmail}.`);
      } else {
        setError(data.error || 'Could not process password reset request.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 6. RESET PASSWORD HANDLER
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPassword || cleanPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }
    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/reset-password/', {
        uid: resetUid,
        token: resetToken,
        password: cleanPassword,
        confirm_password: cleanConfirm
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Password reset successfully! Logging you in...');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Failed to reset password. Link may have expired.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* 1. JUNGLE ZOO THEMED BACKGROUND */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url('/images/sanctuary_forest.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#04110b]/94 via-[#071f14]/89 to-[#030a06]/96 backdrop-blur-md" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b6537]/25 via-transparent to-[#040e09]/85" />
        <div className="absolute top-10 left-10 w-80 h-80 bg-[#26734D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C8A96B]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. TOP HEADER BAR */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#26734D]/35 bg-[#071D12]/75 backdrop-blur-md">
        <button
          type="button"
          onClick={onBackToSanctuary}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F5F4EA]/80 hover:text-[#C8A96B] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#123D2B]/60 border border-transparent hover:border-[#26734D]/60"
        >
          <ArrowLeft className="w-4 h-4 text-[#C8A96B]" />
          <span>← Back to Sanctuary</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#C8A96B] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#C8A96B] font-semibold">
            Nandankanan Portal
          </span>
        </div>
      </header>

      {/* 3. VERTICAL BOX: CENTERED CARD */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md rounded-3xl bg-[#092217]/95 border border-[#C8A96B]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 backdrop-blur-2xl flex flex-col">
          
          {/* Official Crest & Title */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/95 border border-[#C8A96B]/40 shadow-md mb-2">
              <img 
                src="/images/nandankanan_official_logo.png" 
                alt="Nandankanan Zoological Park Crest" 
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F5F4EA] tracking-wide">
              ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ
            </h2>
            <p className="text-xs text-[#C8A96B] tracking-[0.16em] uppercase font-bold mt-0.5">
              NANDANKANAN ZOOLOGICAL PARK • OFFICIAL ACCESS
            </p>
          </div>

          {/* VIEW SWITCHER TABS (Sign In vs Register) when in OTP mode or Password mode */}
          {authMethod === 'otp' && otpStep === 'input_email' && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#05140d] border border-[#26734D]/50 mb-4">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setError(''); setSuccessMsg(''); }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-md'
                    : 'text-[#F5F4EA]/70 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>SIGN IN (OTP)</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-md'
                    : 'text-[#F5F4EA]/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>REGISTER (OTP)</span>
              </button>
            </div>
          )}

          {/* Success Notification Alert */}
          {successMsg && (
            <div className="mb-3.5 p-3 rounded-xl bg-[#14532D]/90 border border-[#26734D] text-[#F5F4EA] text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Error Notification Alert */}
          {error && (
            <div className="mb-3.5 p-3 rounded-xl bg-red-950/85 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* ============================================================= */}
          {/* METHOD 1: EMAIL OTP (STEP 1: REQUEST OTP) */}
          {/* ============================================================= */}
          {authMethod === 'otp' && otpStep === 'input_email' && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              
              <div className="p-3 rounded-xl bg-[#06180f] border border-[#26734D]/40 text-xs text-[#F5F4EA]/80 leading-relaxed flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>
                  {activeTab === 'register' 
                    ? "Enter your details. A secure verification code will be sent directly to your Gmail inbox."
                    : "Enter your Gmail address to receive an official login OTP code."}
                </span>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Soumya Surya"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">
                  Gmail / Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#C8A96B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
                    <span>Dispatching OTP to Gmail...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#071D12]" />
                    <span>SEND VERIFICATION CODE TO GMAIL</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('password'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#F5F4EA]/60 hover:text-[#C8A96B] hover:underline"
                >
                  Or sign in with Password &rarr;
                </button>
              </div>

            </form>
          )}

          {/* ============================================================= */}
          {/* METHOD 1: EMAIL OTP (STEP 2: VERIFY SECURE CODE) */}
          {/* ============================================================= */}
          {authMethod === 'otp' && otpStep === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
              
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#123D2B] to-[#19523a] border border-[#C8A96B] text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#C8A96B]/20 text-[#C8A96B] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-[#C8A96B] tracking-wider">
                      ✉️ VERIFICATION CODE SENT TO EMAIL
                    </div>
                    <div className="text-xs text-[#F5F4EA] font-semibold mt-0.5 break-all">
                      {email}
                    </div>
                    <p className="text-[11px] text-[#F5F4EA]/80 mt-1 leading-relaxed">
                      Check your Gmail inbox (and spam/junk folder) for the secure verification code (letters, numbers & symbols).
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Verification Code Input */}
              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 text-center mb-1.5">
                  Enter Verification Code (Letters, Numbers & Symbols)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type="text"
                    autoComplete="one-time-code"
                    required
                    maxLength={16}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    placeholder="e.g. A7#k9!X2"
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-[#06180f] border border-[#26734D] text-center text-lg font-mono tracking-[0.2em] text-[#F5F4EA] placeholder-[#F5F4EA]/25 focus:border-[#C8A96B] focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || redirecting || !otpCode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#26734D] to-[#1e5c3e] hover:from-[#2e8c5d] hover:to-[#26734D] text-[#F5F4EA] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#26734D]/25 border border-[#C8A96B]/30 hover:border-[#C8A96B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96B]" />
                    <span>Verifying Code...</span>
                  </>
                ) : redirecting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C8A96B] animate-bounce" />
                    <span>Entering Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
                    <span>VERIFY OTP & ENTER SANCTUARY</span>
                  </>
                )}
              </button>

              {/* Resend and Edit Actions */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#26734D]/35">
                <button
                  type="button"
                  onClick={() => { setOtpStep('input_email'); setError(''); }}
                  className="text-xs text-[#F5F4EA]/70 hover:text-[#C8A96B] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="text-xs text-[#C8A96B] hover:underline disabled:opacity-50 flex items-center gap-1 font-semibold"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? (
                    <span>Resend in {resendCooldown}s</span>
                  ) : (
                    <span>Resend Code</span>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ============================================================= */}
          {/* METHOD 2: PASSWORD LOGIN (OPTIONAL FALLBACK FOR RANGERS) */}
          {/* ============================================================= */}
          {authMethod === 'password' && !isForgotView && !isResetView && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              
              <div className="flex items-center justify-between border-b border-[#26734D]/40 pb-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('otp'); setOtpStep('input_email'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Email OTP</span>
                </button>
                <span className="text-[11px] font-mono text-[#F5F4EA]/60 uppercase">Password Login</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ranger@nandankanan.org"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-[#C8A96B] hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setIsForgotView(true); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-[#C8A96B]" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || redirecting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#C8A96B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
                ) : (
                  <>
                    <span>Sign In With Password</span>
                    <ArrowRight className="w-4 h-4 text-[#071D12]" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* ============================================================= */}
          {/* FORGOT PASSWORD VIEW */}
          {/* ============================================================= */}
          {isForgotView && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#26734D]/40 pb-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotView(false); setError(''); }}
                  className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
                <span className="text-[11px] font-mono text-[#F5F4EA]/60 uppercase">Password Reset</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] font-serif font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" /> : <span>Send Reset Link</span>}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* RESET PASSWORD VIEW */}
          {/* ============================================================= */}
          {isResetView && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#06180f] border border-[#26734D]/40 text-xs text-[#F5F4EA]/80 leading-relaxed">
                Choose a strong new password for your account.
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">New Password (min. 6)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">Confirm New Password</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] font-serif font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" /> : <span>Reset Password</span>}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* 4. FOOTER NOTE */}
      <footer className="relative z-10 w-full py-3 text-center text-[11px] text-[#F5F4EA]/60 border-t border-[#26734D]/35 bg-[#071D12]/75 backdrop-blur-md">
        <span>ESTD 1960 • Government of Odisha • Nandankanan Zoological Park</span>
      </footer>

    </div>
  );
}
