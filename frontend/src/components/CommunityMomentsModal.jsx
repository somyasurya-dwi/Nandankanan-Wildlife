import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Send, 
  Heart, 
  Sparkles, 
  Inbox, 
  MessageSquareHeart, 
  User, 
  ShieldCheck, 
  Wallet, 
  Plus, 
  CheckCircle2, 
  Filter, 
  Search, 
  Clock,
  Flame,
  ThumbsUp
} from 'lucide-react';
import { walletManager } from '../utils/walletManager';

const SPECIES_OPTIONS = [
  { slug: 'royal-bengal-tiger', name: 'Royal Bengal Tiger', emoji: '🐯' },
  { slug: 'asiatic-lion', name: 'Asiatic Lion', emoji: '🦁' },
  { slug: 'elephant', name: 'Elephant', emoji: '🐘' },
  { slug: 'deer', name: 'Deer', emoji: '🦌' },
  { slug: 'bear', name: 'Bear', emoji: '🐻' },
  { slug: 'birds', name: 'Birds', emoji: '🐦' }
];

const QUICK_EMOJIS = ['❤️', '🐾', '🐯', '🦁', '🐘', '🦌', '🐻', '🐦', '🌿', '✨', '🥩', '💧'];

export default function CommunityMomentsModal({
  isOpen,
  onClose,
  initialTab = 'compose', // 'compose' | 'inbox'
  initialAnimal = null,
  walletBalance = 0,
  onOpenAddMoney,
  onShareSuccess
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Composer Form States
  const [donorName, setDonorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');
  const [selectedAnimalSlug, setSelectedAnimalSlug] = useState('royal-bengal-tiger');
  const [selectedContribution, setSelectedContribution] = useState(0); // 0 = Free
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  // Submission & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Inbox Search & Filter States
  const [inboxFilter, setInboxFilter] = useState('all'); // 'all' | 'my'
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCardIds, setLikedCardIds] = useState(new Set());
  const [animatingCheerId, setAnimatingCheerId] = useState(null);

  // Live contributions subscription
  const [contributions, setContributions] = useState(() => walletManager.getContributions());
  const [myMoments, setMyMoments] = useState(() => walletManager.getMyMoments());

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Sync active animal from props
  useEffect(() => {
    if (initialAnimal) {
      const match = SPECIES_OPTIONS.find(
        s => s.slug === initialAnimal.slug || 
             initialAnimal.animal_name?.toLowerCase().includes(s.name.toLowerCase()) ||
             initialAnimal.slug?.includes(s.slug)
      );
      if (match) {
        setSelectedAnimalSlug(match.slug);
      }
    }
  }, [initialAnimal]);

  // Subscribe to walletManager updates
  useEffect(() => {
    const unsub = walletManager.subscribe((st) => {
      setContributions(st.contributions || []);
      setMyMoments(walletManager.getMyMoments());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  // Resolved selected animal object
  const currentSelectedAnimal = SPECIES_OPTIONS.find(s => s.slug === selectedAnimalSlug) || SPECIES_OPTIONS[0];

  // Effective contribution amount in INR
  const effectiveAmount = isCustomMode ? (Number(customAmount) || 0) : selectedContribution;

  // Insert emoji into message
  const handleInsertEmoji = (emoji) => {
    if (personalMessage.length + emoji.length <= 250) {
      setPersonalMessage(prev => prev + emoji);
    }
  };

  // Submit Handler
  const handleSubmitMoment = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const trimmedMsg = personalMessage.trim();
    if (!trimmedMsg) {
      setSubmitError('Please write a message to share your wildlife moment.');
      return;
    }

    if (effectiveAmount > 0 && walletBalance < effectiveAmount) {
      setSubmitError(`Insufficient wallet balance (₹${walletBalance}). Please top up first or choose ₹0 to share for free.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await walletManager.makeContribution({
        animal: {
          slug: currentSelectedAnimal.slug,
          animal_name: currentSelectedAnimal.name,
          name: currentSelectedAnimal.name,
          emoji: currentSelectedAnimal.emoji
        },
        amount: effectiveAmount,
        donorName: isAnonymous ? 'Anonymous Wildlife Friend' : (donorName.trim() || 'Wildlife Supporter'),
        personalMessage: trimmedMsg,
        isAnonymous: isAnonymous,
        paymentMethod: effectiveAmount > 0 ? 'wallet' : 'community_free'
      });

      if (result.success) {
        setSubmitSuccess(result.contribution);
        setPersonalMessage('');
        setIsCustomMode(false);
        setCustomAmount('');
        if (onShareSuccess) onShareSuccess(result.contribution);

        // Switch to inbox after 1.2s to view newly added moment
        setTimeout(() => {
          setActiveTab('inbox');
          setInboxFilter('all');
          setSubmitSuccess(null);
        }, 1200);
      } else {
        setSubmitError(result.error || 'Failed to submit message. Please try again.');
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cheer / Like Handler
  const handleCheerMoment = (id, e) => {
    e.stopPropagation();
    walletManager.likeContribution(id);
    setLikedCardIds(prev => new Set(prev).add(id));
    setAnimatingCheerId(id);
    setTimeout(() => setAnimatingCheerId(null), 500);
  };

  // Filtered moments list
  const filteredMoments = contributions.filter(item => {
    const itemId = item.id || item.contribution_id;
    // My vs All filter
    if (inboxFilter === 'my') {
      const isMine = myMoments.some(m => (m.id || m.contribution_id) === itemId);
      if (!isMine) return false;
    }

    // Species filter
    if (speciesFilter !== 'all') {
      if (item.animal_slug !== speciesFilter && !item.animal_name?.toLowerCase().includes(speciesFilter)) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (item.donor_name || '').toLowerCase().includes(q);
      const matchMsg = (item.personal_message || '').toLowerCase().includes(q);
      const matchAnimal = (item.animal_name || '').toLowerCase().includes(q);
      if (!matchName && !matchMsg && !matchAnimal) return false;
    }

    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border-2 border-[#C8A96B]/60 p-4 sm:p-6 shadow-2xl text-[#F5F4EA] my-auto animate-scaleUp overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#14532D]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C8A96B] to-[#997736] text-[#071D12] flex items-center justify-center shadow-lg shadow-[#C8A96B]/25 shrink-0">
              <MessageSquareHeart className="w-5 h-5 text-[#071D12]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#F5F4EA] leading-tight flex items-center gap-2">
                <span>Wildlife Community Hub</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                  Live Feed
                </span>
              </h3>
              <p className="text-xs text-[#A7D7A9] font-mono leading-tight">
                Share happiness, good wishes & love with Nandankanan wildlife ❤️
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-[#06180E]/90 rounded-2xl border border-[#14532D] mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-md shadow-[#C8A96B]/20'
                : 'text-[#F5F4EA]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Share My Moment</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-md shadow-[#C8A96B]/20'
                : 'text-[#F5F4EA]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Community Inbox ({contributions.length})</span>
            {myMoments.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-3" />
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: SHARE YOUR MOMENT (COMPOSER)
            ========================================================================= */}
        {activeTab === 'compose' && (
          <form onSubmit={handleSubmitMoment} className="space-y-4 overflow-y-auto pr-1 flex-1">
            
            {/* Success Feedback Alert */}
            {submitSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center gap-3 text-emerald-200 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold text-white">Moment shared successfully!</strong>
                  <span>Your message is now live in the community stream. Thank you for your love!</span>
                </div>
              </div>
            )}

            {/* Error Feedback Alert */}
            {submitError && (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center justify-between animate-fadeIn">
                <span>{submitError}</span>
                <button type="button" onClick={() => setSubmitError('')} className="p-1 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 1. Name & Anonymous Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7D7A9] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Contributor Name:</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#F5F4EA]/80 hover:text-white">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-[#14532D] text-[#C8A96B] focus:ring-[#C8A96B] bg-[#071D12]"
                  />
                  <span>Share Anonymously 🐾</span>
                </label>
              </div>

              {!isAnonymous ? (
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your name or family name (e.g. Priya & Aryan)"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#071D12] border border-[#14532D] text-sm text-[#F5F4EA] placeholder-[#F5F4EA]/40 focus:border-[#C8A96B] focus:outline-none focus:ring-1 focus:ring-[#C8A96B] transition-all"
                  maxLength={50}
                />
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-[#14532D]/30 border border-[#14532D] text-xs text-[#C8A96B] font-mono italic">
                  Posting as: Anonymous Wildlife Friend 🐾
                </div>
              )}
            </div>

            {/* 2. Animal Selection */}
            <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7D7A9] flex items-center gap-1.5">
                  <span>Selected Animal Camera:</span>
                </label>
                <span className="text-[11px] text-[#C8A96B] font-mono">
                  Currently watching: {currentSelectedAnimal.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIES_OPTIONS.map((spec) => {
                  const isSelected = spec.slug === selectedAnimalSlug;
                  return (
                    <button
                      key={spec.slug}
                      type="button"
                      onClick={() => setSelectedAnimalSlug(spec.slug)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold border-[#C8A96B] shadow-md shadow-[#C8A96B]/25 scale-[1.02]'
                          : 'bg-[#071D12] text-[#F5F4EA]/80 hover:text-white hover:bg-[#14532D]/50 border-[#14532D]'
                      }`}
                    >
                      <span className="text-base">{spec.emoji}</span>
                      <span className="truncate">{spec.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Message Textarea & Emojis */}
            <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7D7A9]">
                  Personal Wildlife Message:
                </label>
                <span className={`text-[11px] font-mono ${
                  personalMessage.length >= 240 ? 'text-rose-400 font-bold' :
                  personalMessage.length >= 200 ? 'text-amber-400' : 'text-[#C8A96B]'
                }`}>
                  {personalMessage.length} / 250
                </span>
              </div>

              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value.slice(0, 250))}
                maxLength={250}
                rows={3}
                placeholder="Share your appreciation, good wishes, conservation message, or special memory observing this animal live..."
                className="w-full p-3 rounded-xl bg-[#071D12] border border-[#14532D] text-sm text-[#F5F4EA] placeholder-[#F5F4EA]/40 focus:border-[#C8A96B] focus:outline-none focus:ring-1 focus:ring-[#C8A96B] transition-all leading-relaxed resize-none"
              />

              {/* Quick Emojis Bar */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#A7D7A9] font-mono mr-1">Quick Emojis:</span>
                {QUICK_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => handleInsertEmoji(em)}
                    className="w-7 h-7 rounded-lg bg-[#071D12] hover:bg-[#14532D] border border-white/10 hover:border-[#C8A96B]/60 text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    title={`Add ${em}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Optional Wildlife Contribution */}
            <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7D7A9] flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>Optional Wildlife Contribution</span>
                  </label>
                  <p className="text-[11px] text-[#C8A96B] font-mono mt-0.5">
                    Sending a message is 100% free! Donations directly fund zoo welfare.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#A7D7A9] bg-[#14532D]/60 px-2 py-0.5 rounded-md border border-[#C8A96B]/30">
                  Wallet: ₹{walletBalance}
                </span>
              </div>

              {/* Amount Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Free ✨', value: 0, sub: 'Message only' },
                  { label: '₹10 🥩', value: 10, sub: 'Share' },
                  { label: '₹50 🍖', value: 50, sub: 'Care' },
                  { label: '₹100 ❤️', value: 100, sub: 'Support' }
                ].map((opt) => {
                  const isSelected = !isCustomMode && selectedContribution === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setIsCustomMode(false);
                        setSelectedContribution(opt.value);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold border-[#C8A96B] shadow-md shadow-[#C8A96B]/25 scale-[1.02]'
                          : 'bg-[#071D12] text-[#F5F4EA]/80 hover:text-white hover:bg-[#14532D]/40 border-[#14532D]'
                      }`}
                    >
                      <span className="block text-xs font-bold leading-tight">{opt.label}</span>
                      <span className="text-[9px] font-mono block opacity-75">{opt.sub}</span>
                    </button>
                  );
                })}

                {/* Custom Amount Button */}
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isCustomMode
                      ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold border-[#C8A96B] shadow-md shadow-[#C8A96B]/25 scale-[1.02]'
                      : 'bg-[#071D12] text-[#F5F4EA]/80 hover:text-white hover:bg-[#14532D]/40 border-[#14532D]'
                  }`}
                >
                  <span className="block text-xs font-bold leading-tight">Custom ⭐</span>
                  <span className="text-[9px] font-mono block opacity-75">Your choice</span>
                </button>
              </div>

              {/* Custom Amount Input */}
              {isCustomMode && (
                <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                  <span className="text-xs font-mono text-[#C8A96B]">₹ Amount:</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 250)"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#071D12] border border-[#14532D] text-xs text-[#F5F4EA] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              )}

              {/* Wallet Deduction Confirmation Notice */}
              {effectiveAmount > 0 && (
                <div className="p-2.5 rounded-xl bg-[#14532D]/30 border border-[#C8A96B]/30 flex items-center justify-between text-xs font-mono text-[#F5F4EA]/90">
                  <span>
                    Will deduct <strong className="text-[#C8A96B]">₹{effectiveAmount}</strong> from your Wildlife Wallet.
                  </span>
                  {walletBalance < effectiveAmount && (
                    <button
                      type="button"
                      onClick={onOpenAddMoney}
                      className="px-2.5 py-1 rounded-lg bg-[#C8A96B] text-[#071D12] font-bold text-[11px] hover:bg-[#DFCA98] transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Money</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A7D7A9] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Official Sanctuary Feed</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] hover:from-[#DFCA98] hover:to-[#C8A96B] text-[#071D12] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#C8A96B]/25 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sharing...' : 'Share My Moment'}</span>
              </button>
            </div>

          </form>
        )}

        {/* =========================================================================
            TAB 2: COMMUNITY INBOX (FEED & MY SUBMISSIONS)
            ========================================================================= */}
        {activeTab === 'inbox' && (
          <div className="flex flex-col flex-1 overflow-hidden space-y-3">
            
            {/* Filters & Search Header */}
            <div className="space-y-2 shrink-0">
              <div className="flex items-center justify-between gap-2">
                {/* All vs My Moments filter */}
                <div className="flex items-center gap-1 bg-[#06180E] p-1 rounded-xl border border-[#14532D]">
                  <button
                    onClick={() => setInboxFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inboxFilter === 'all'
                        ? 'bg-[#C8A96B] text-[#071D12] font-bold'
                        : 'text-[#F5F4EA]/70 hover:text-white'
                    }`}
                  >
                    All Moments ({contributions.length})
                  </button>

                  <button
                    onClick={() => setInboxFilter('my')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inboxFilter === 'my'
                        ? 'bg-[#C8A96B] text-[#071D12] font-bold'
                        : 'text-[#F5F4EA]/70 hover:text-white'
                    }`}
                  >
                    My Submissions ({myMoments.length})
                  </button>
                </div>

                {/* Quick Compose Button */}
                <button
                  onClick={() => setActiveTab('compose')}
                  className="px-3 py-1.5 rounded-xl bg-[#14532D]/70 hover:bg-[#14532D] text-[#C8A96B] hover:text-white border border-[#C8A96B]/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Message</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search moments by name, animal, or message..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#06180E] border border-[#14532D] text-xs text-[#F5F4EA] placeholder-zinc-500 focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              {/* Species Filter Pills (Wrapped cleanly, zero horizontal scrollbar) */}
              <div 
                className="flex items-center gap-1.5 flex-wrap pt-0.5 select-none scrollbar-none overflow-x-hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A7D7A9] mr-0.5">
                  Species:
                </span>
                <button
                  type="button"
                  onClick={() => setSpeciesFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    speciesFilter === 'all'
                      ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-sm'
                      : 'bg-[#06180E] text-zinc-400 hover:text-white border border-white/5 hover:border-[#C8A96B]/30'
                  }`}
                >
                  All
                </button>
                {SPECIES_OPTIONS.map((spec) => (
                  <button
                    key={spec.slug}
                    type="button"
                    onClick={() => setSpeciesFilter(spec.slug)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 transition-all ${
                      speciesFilter === spec.slug
                        ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-sm'
                        : 'bg-[#06180E] text-zinc-400 hover:text-white border border-white/5 hover:border-[#C8A96B]/30'
                    }`}
                  >
                    <span>{spec.emoji}</span>
                    <span>{spec.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Moments Feed List */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {filteredMoments.length > 0 ? (
                filteredMoments.map((item) => {
                  const itemId = item.id || item.contribution_id;
                  const donorName = item.display_donor_name || (item.is_anonymous ? 'Anonymous Wildlife Friend' : item.donor_name);
                  const isMine = myMoments.some(m => (m.id || m.contribution_id) === itemId);
                  const likes = (item.likes_count ?? item.cheer_count ?? 3);
                  const isLiked = likedCardIds.has(itemId) || walletManager.isMomentLiked(itemId);
                  const isCheering = animatingCheerId === itemId;

                  return (
                    <div
                      key={itemId}
                      className={`p-3 rounded-2xl bg-[#06180E]/85 border transition-all duration-200 group flex flex-col gap-2 ${
                        isMine
                          ? 'border-[#C8A96B]/60 bg-gradient-to-r from-[#06180E] to-[#0A2617]'
                          : 'border-white/10 hover:border-[#C8A96B]/40'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14532D] to-[#071D12] border border-[#C8A96B]/50 flex items-center justify-center text-xs font-bold text-[#C8A96B] shrink-0 shadow-sm">
                            {item.animal_emoji || '🐾'}
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F5F4EA] truncate">
                                {donorName}
                              </span>
                              {isMine && (
                                <span className="px-1.5 py-0.2 rounded bg-[#C8A96B]/20 text-[#C8A96B] text-[9px] font-mono font-bold border border-[#C8A96B]/40">
                                  Your Moment ⭐
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#A7D7A9] font-mono flex items-center gap-1.5">
                              <span>For {item.animal_name}</span>
                              <span>•</span>
                              <span>{item.time_ago || 'Recently'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Amount & Like Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {Number(item.amount) > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs shadow-sm">
                              +₹{item.amount}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg bg-[#C8A96B]/15 border border-[#C8A96B]/40 text-[#C8A96B] font-mono text-[10px]">
                              Community Wish 🌿
                            </span>
                          )}

                          {/* Heart / Cheer Button */}
                          <button
                            type="button"
                            onClick={(e) => handleCheerMoment(itemId, e)}
                            className={`px-2 py-1 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                              isLiked
                                ? 'bg-rose-500/25 border-rose-400 text-rose-300 scale-105 shadow-sm shadow-rose-500/20'
                                : 'bg-white/5 border-white/10 hover:border-rose-400/50 hover:bg-rose-500/10 text-white/70 hover:text-rose-300'
                            }`}
                            title="Cheer and like this moment"
                          >
                            <Heart className={`w-3.5 h-3.5 transition-transform ${
                              isCheering ? 'scale-125 fill-rose-400 text-rose-400' : 
                              isLiked ? 'fill-rose-400 text-rose-400' : 'text-rose-400'
                            }`} />
                            <span>{likes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Personal Message Quote */}
                      {item.personal_message && (
                        <p className="text-xs text-[#F5F4EA]/90 italic bg-black/40 rounded-xl p-2.5 border border-white/5 leading-relaxed">
                          "{item.personal_message}"
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs font-mono text-zinc-400 space-y-2">
                  <p>No moments match your current filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setInboxFilter('all');
                      setSpeciesFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-[#C8A96B] underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
