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
  HelpCircle
} from 'lucide-react';
import { playTargetLockedSound } from '../utils/audioSynthesizer';

export default function SignInPage({ onLoginSuccess, onBackToSanctuary }) {
  // Current view: 'login' | 'register' | 'forgot' | 'reset'
  const [activeView, setActiveView] = useState('login');
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Reset URL Parameters
  const [resetUid, setResetUid] = useState('');
  const [resetToken, setResetToken] = useState('');

  // UI States & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // Parse URL hash on mount or hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#reset-password')) {
        const qIdx = hash.indexOf('?');
        if (qIdx !== -1) {
          const params = new URLSearchParams(hash.substring(qIdx));
          setResetUid(params.get('uid') || '');
          setResetToken(params.get('token') || '');
          setActiveView('reset');
        } else {
          setActiveView('reset');
        }
      } else if (hash === '#register') {
        setActiveView('register');
      } else if (hash === '#forgot-password') {
        setActiveView('forgot');
      } else if (hash === '#signin' || hash === '#login') {
        setActiveView('login');
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

  // 1. REGISTRATION HANDLER
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanName) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid Email Address.');
      return;
    }
    if (!cleanPassword) {
      setError('Please enter a Password.');
      return;
    }
    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }
    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await callApi('/api/auth/register/', {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        confirm_password: cleanConfirm
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || 'Account registered successfully! Welcome to Nandankanan.');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed. Please verify your details.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. LOGIN HANDLER
  const handleLogin = async (e) => {
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
        setError(data.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. FORGOT PASSWORD HANDLER
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
      const response = await callApi('/api/auth/forgot-password/', {
        email: cleanEmail
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || `Password reset instructions dispatched to ${cleanEmail}.`);
      } else {
        setError(data.error || 'Could not process password reset request.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. RESET PASSWORD HANDLER
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPassword) {
      setError('Please enter your new password.');
      return;
    }
    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }
    if (cleanPassword !== cleanConfirm) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }
    if (!resetUid || !resetToken) {
      setError('Password reset token is missing or invalid. Please click the link from your email.');
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
        setError(data.error || 'Failed to reset password. The link may have expired (valid for 1 hour).');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running on port 8000.');
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

      {/* 2. TOP HEADER BAR: RETURN LINK */}
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

      {/* 3. VERTICAL BOX: CENTERED CLEAN CARD */}
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

          {/* VIEW SWITCHER TABS (Login vs Register) */}
          {(activeView === 'login' || activeView === 'register') && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#05140d] border border-[#26734D]/50 mb-4">
              <button
                type="button"
                onClick={() => { setActiveView('login'); setError(''); setSuccessMsg(''); }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeView === 'login'
                    ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-md'
                    : 'text-[#F5F4EA]/70 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveView('register'); setError(''); setSuccessMsg(''); }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeView === 'register'
                    ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-md'
                    : 'text-[#F5F4EA]/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>REGISTER</span>
              </button>
            </div>
          )}

          {/* Breadcrumb back to Login when in Forgot or Reset mode */}
          {(activeView === 'forgot' || activeView === 'reset') && (
            <div className="mb-4 flex items-center justify-between border-b border-[#26734D]/40 pb-2">
              <button
                type="button"
                onClick={() => { setActiveView('login'); setError(''); setSuccessMsg(''); }}
                className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <span className="text-[11px] font-mono text-[#F5F4EA]/60 uppercase tracking-wider">
                {activeView === 'forgot' ? 'Password Recovery' : 'Create New Password'}
              </span>
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
          {/* VIEW 1: SIGN IN PAGE */}
          {/* ============================================================= */}
          {activeView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">
                    Password
                  </label>
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
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveView('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-[#C8A96B]" />
                  <span>Forgot Password?</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveView('register'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#F5F4EA]/75 hover:text-[#C8A96B] hover:underline"
                >
                  Create account &rarr;
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || redirecting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#C8A96B]/20 hover:shadow-[#C8A96B]/35 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : redirecting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#071D12] animate-bounce" />
                    <span>Entering Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO SANCTUARY PORTAL</span>
                    <ArrowRight className="w-4 h-4 text-[#071D12]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* VIEW 2: REGISTRATION PAGE */}
          {/* ============================================================= */}
          {activeView === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
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
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">
                    Password (min. 6 characters)
                  </label>
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
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[10px] text-[#C8A96B] hover:underline flex items-center gap-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => { setActiveView('login'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#F5F4EA]/75 hover:text-[#C8A96B] hover:underline"
                >
                  Already have an account? <strong className="text-[#C8A96B]">Sign In</strong>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || redirecting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#26734D] to-[#1e5c3e] hover:from-[#2e8c5d] hover:to-[#26734D] text-[#F5F4EA] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#26734D]/25 border border-[#C8A96B]/30 hover:border-[#C8A96B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96B]" />
                    <span>Creating Guardian Account...</span>
                  </>
                ) : redirecting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#C8A96B] animate-bounce" />
                    <span>Entering Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <span>REGISTER ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* VIEW 3: FORGOT PASSWORD PAGE */}
          {/* ============================================================= */}
          {activeView === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#06180f] border border-[#26734D]/40 text-xs text-[#F5F4EA]/80 leading-relaxed">
                Enter your registered Email Address. We will send you a secure, time-limited reset link to create a new password.
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F5F4EA]/85 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. debasmitabehera924@gmail.com"
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
                    <span>Dispatching Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>SEND PASSWORD RESET LINK</span>
                    <ArrowRight className="w-4 h-4 text-[#071D12]" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveView('login'); setError(''); setSuccessMsg(''); }}
                  className="text-xs text-[#F5F4EA]/75 hover:text-[#C8A96B] hover:underline"
                >
                  Remember your password? <strong className="text-[#C8A96B]">Sign In</strong>
                </button>
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* VIEW 4: RESET PASSWORD PAGE */}
          {/* ============================================================= */}
          {activeView === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#06180f] border border-[#26734D]/40 text-xs text-[#F5F4EA]/80 leading-relaxed">
                Choose a strong new password for your Nandankanan Sanctuary account.
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">
                    New Password (min. 6 characters)
                  </label>
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[#F5F4EA]/85">
                    Confirm New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[10px] text-[#C8A96B] hover:underline flex items-center gap-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || redirecting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] hover:from-[#d8b87a] hover:to-[#C8A96B] text-[#071D12] font-serif font-bold text-xs uppercase tracking-[0.14em] shadow-lg shadow-[#C8A96B]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
                    <span>Updating Password...</span>
                  </>
                ) : redirecting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#071D12] animate-bounce" />
                    <span>Entering Sanctuary...</span>
                  </>
                ) : (
                  <>
                    <span>RESET & SECURE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 text-[#071D12]" />
                  </>
                )}
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
