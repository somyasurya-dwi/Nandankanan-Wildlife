import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Send,
  Clock
} from 'lucide-react';
import { playTargetLockedSound } from '../utils/audioSynthesizer';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onSuccess }) {
  const notifySuccess = (userData) => {
    if (onLoginSuccess) onLoginSuccess(userData);
    if (onSuccess) onSuccess(userData);
  };

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'register'
  const [otpStep, setOtpStep] = useState('input_email'); // 'input_email' | 'verify_otp'

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

  // SEND OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid Gmail address.');
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
        setError(data.error || 'Failed to dispatch verification email.');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Please verify the Django API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // VERIFY OTP
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
        setSuccessMsg(data.message || 'Verification successful!');
        finishAuth(data.user, data.token);
      } else {
        setError(data.error || 'Invalid verification code. Please check your Gmail inbox.');
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
            {otpStep === 'verify_otp' ? 'Enter Email OTP' : activeTab === 'signin' ? 'Sanctuary Sign In' : 'Guardian Registration'}
          </h3>
          <p className="text-[11px] text-[#C8A96B] tracking-wider uppercase font-semibold">
            Nandankanan Zoological Park
          </p>
        </div>

        {/* Tabs for Login vs Register (only shown on step 1) */}
        {otpStep === 'input_email' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#05140d] border border-[#26734D]/50 mb-3.5">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(''); setSuccessMsg(''); }}
              className={`py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-[#C8A96B] to-[#b39352] text-[#071D12] shadow-sm'
                  : 'text-[#F5F4EA]/70 hover:text-white'
              }`}
            >
              Sign In (OTP)
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
              Register (OTP)
            </button>
          </div>
        )}

        {/* Alerts */}
        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#14532D]/90 border border-[#26734D] text-[#F5F4EA] text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-950/85 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {otpStep === 'input_email' && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            {activeTab === 'register' && (
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
            )}

            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 mb-1">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C8A96B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
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
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#071D12]" />
                  <span>Dispatching OTP...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#071D12]" />
                  <span>Send Verification Code to Gmail</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {otpStep === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5 animate-fadeIn">
            <div className="p-2.5 rounded-xl bg-[#071810] border border-[#26734D] text-xs">
              <span className="text-[#C8A96B] font-semibold block">OTP dispatched to:</span>
              <span className="text-[#F5F4EA] break-all">{email}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F5F4EA]/80 text-center mb-1">
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#06180f] border border-[#26734D] text-center text-base font-mono tracking-[0.2em] text-[#F5F4EA] placeholder-[#F5F4EA]/30 focus:border-[#C8A96B] focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || redirecting || !otpCode.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#26734D] to-[#1e5c3e] text-[#F5F4EA] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:from-[#2e8c5d] hover:to-[#26734D] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#26734D]/35">
              <button
                type="button"
                onClick={() => { setOtpStep('input_email'); setError(''); }}
                className="text-[11px] text-[#F5F4EA]/70 hover:text-[#C8A96B] flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Email</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleSendOtp}
                className="text-[11px] text-[#C8A96B] hover:underline disabled:opacity-50 flex items-center gap-1 font-semibold"
              >
                <Clock className="w-3 h-3" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
