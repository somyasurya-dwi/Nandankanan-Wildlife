import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Lock, 
  User, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { playTargetLockedSound } from '../utils/audioSynthesizer';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onSuccess }) {
  const notifySuccess = (userData) => {
    if (onLoginSuccess) onLoginSuccess(userData);
    if (onSuccess) onSuccess(userData);
  };

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#26734D', '#C8A96B', '#123D2B', '#E5A836', '#F5F4EA']
    });
  };

  const callApi = async (endpoint, payload) => {
    const targets = [
      endpoint,
      `http://127.0.0.1:8000${endpoint}`,
      `http://localhost:8000${endpoint}`
    ];
    let lastError = null;
    for (const url of targets) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return res;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('Connection failed');
  };

  const finishAuth = (userData, token) => {
    if (token) localStorage.setItem('nandankanan_token', token);
    if (userData) localStorage.setItem('nandankanan_user', JSON.stringify(userData));

    try { playTargetLockedSound(); } catch (err) {}
    triggerCelebration();

    setRedirecting(true);
    setTimeout(() => {
      notifySuccess(userData);
      onClose();
    }, 1100);
  };

  // 1. REGISTER
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
        setSuccessMsg(data.message || 'Account created successfully!');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. LOGIN
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
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. FORGOT PASSWORD
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
        setSuccessMsg(data.message || 'Password reset link sent to your email.');
      } else {
        setError(data.error || 'Could not process request.');
      }
    } catch (err) {
      setError('Cannot connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#092217] border border-[#C8A96B]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-7 text-[#F5F4EA] overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#F5F4EA]/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Crest */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center p-1.5 rounded-xl bg-white/95 border border-[#C8A96B]/40 shadow-sm mb-2">
            <img 
              src="/images/nandankanan_official_logo.png" 
              alt="Nandankanan Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#F5F4EA]">
            {activeTab === 'login' ? 'Sanctuary Sign In' : activeTab === 'register' ? 'Guardian Registration' : 'Password Recovery'}
          </h3>
          <p className="text-[11px] text-[#C8A96B] tracking-wider uppercase font-semibold">
            Nandankanan Zoological Park
          </p>
        </div>

        {/* Tabs for Login vs Register */}
        {activeTab !== 'forgot' ? (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#05140d] border border-[#26734D]/50 mb-3.5">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-sm'
                  : 'text-[#F5F4EA]/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-sm'
                  : 'text-[#F5F4EA]/70 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        ) : (
          <div className="mb-3.5 flex items-center justify-between border-b border-[#26734D]/40 pb-2">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-[#C8A96B] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[10px] font-mono text-[#F5F4EA]/60 uppercase">Reset Password</span>
          </div>
        )}

        {/* Alerts */}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#14532D]/90 border border-[#26734D] text-[#F5F4EA] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-950/85 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ranger@nandankanan.org"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#F5F4EA]/80">Password</label>
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-0.5">
              <button
                type="button"
                onClick={() => { setActiveTab('forgot'); setError(''); setSuccessMsg(''); }}
                className="text-[11px] text-[#C8A96B] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-[#C8A96B]" />
                <span>Forgot Password?</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
                className="text-[11px] text-[#F5F4EA]/70 hover:text-[#C8A96B] hover:underline"
              >
                Create Account &rarr;
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || redirecting}
              className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:from-[#d8b87a] hover:to-[#C8A96B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
              ) : redirecting ? (
                <Sparkles className="w-4 h-4 text-[#071D12] animate-bounce" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#071D12]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Soumya Surya"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#F5F4EA]/80">Password (min. 6)</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-[#C8A96B] hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
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
                  placeholder="Create password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#F5F4EA]/80">Confirm Password</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[10px] text-[#C8A96B] hover:underline"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
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
                  placeholder="Confirm password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || redirecting}
              className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#26734D] to-[#1e5c3e] text-[#F5F4EA] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:from-[#2e8c5d] hover:to-[#26734D] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96B]" />
              ) : redirecting ? (
                <Sparkles className="w-4 h-4 text-[#C8A96B] animate-bounce" />
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORM: FORGOT PASSWORD */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <p className="text-xs text-[#F5F4EA]/80 leading-relaxed">
              Enter your registered Email Address to receive a password reset link.
            </p>

            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#06180f] border border-[#26734D]/60 text-xs text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:from-[#d8b87a] hover:to-[#C8A96B] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
