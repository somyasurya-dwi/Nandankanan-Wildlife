import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  X,
  MapPin,
  Eye,
  Camera,
  UtensilsCrossed,
  HeartPulse,
  Share2,
  Wallet,
  CheckCircle2,
  Activity,
  Bell,
  Radar,
  Clock,
  Video,
  Map,
  Navigation,
  AlertTriangle,
  AlertOctagon,
  LocateFixed,
  Compass,
  ArrowRight,
  Lock,
  Sparkles,
  ShieldCheck,
  Settings,
  Sliders,
  SlidersHorizontal,
  Minimize2,
  Maximize2,
  Scan,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Loader2,
  Flame
} from 'lucide-react';
import { MultiCameraTracker } from '../utils/multiCameraTracker';
import { walletManager } from '../utils/walletManager';
import { subscriptionManager } from '../utils/subscriptionManager';
import Realistic3DIcon from './reactions/Realistic3DIcon';
import { reactionManager } from '../utils/reactionManager';
import SubscriptionModal from './SubscriptionModal';
import ContributionModal from './ContributionModal';
import AddMoneyModal from './AddMoneyModal';
import WalletHistoryModal from './WalletHistoryModal';
import DonationCelebrationBanner from './DonationCelebrationBanner';
import AnimalCareFundDetailsModal from './AnimalCareFundDetailsModal';
import CommunityMomentsModal from './CommunityMomentsModal';
import { updateAmbientTrack, playReactionPop, playMegaReactionBurst } from '../utils/audioSynthesizer';

// Animal-Specific Video Layout and Presentation Profiles
const ANIMAL_LAYOUT_CONFIG = {
  tiger: {
    focalPosition: 'center 48%',
    layoutTitle: 'Expansive Habitat Landscape',
    viewTag: 'Large Landscape Format',
    description: 'Prioritizing full-body tiger posture, natural water pool & bamboo habitat without edge cropping.',
    supportsZoom: true
  },
  lion: {
    focalPosition: 'center 42%',
    layoutTitle: 'Panoramic Savanna Vista',
    viewTag: 'Wide Savanna Horizon',
    description: 'Wide habitat framing keeping the lion clearly visible while preserving rocky ridge surroundings.',
    supportsZoom: true
  },
  elephant: {
    focalPosition: 'center 50%',
    layoutTitle: 'Full-Body Landscape View',
    viewTag: 'Wide Landscape Format',
    description: 'Full-body layout ensuring trunk, ears, legs, and herd movements remain visible without excess zoom.',
    supportsZoom: true
  },
  deer: {
    focalPosition: 'center 54%',
    layoutTitle: 'Herd Movement & Pasture Framing',
    viewTag: 'Dynamic Herd View',
    description: 'Ground foliage and grazing movement framing with sufficient forest perimeter visibility.',
    supportsZoom: true
  },
  bear: {
    focalPosition: 'center 50%',
    layoutTitle: 'Cavern & Foraging Habitat Framing',
    viewTag: 'Balanced Habitat View',
    description: "Balanced framing capturing the bear's complete body, climbing agility, and cavern rock details.",
    supportsZoom: true
  },
  birds: {
    focalPosition: 'center 46%',
    layoutTitle: 'Aviary Optical Detail',
    viewTag: 'High-Detail Aviary View',
    description: 'High-resolution aviary layout with multi-level optical zoom for plumage and behavioral inspection.',
    supportsZoom: true
  },
  white_tiger: {
    focalPosition: 'center 48%',
    layoutTitle: 'White Tiger Heritage Landscape',
    viewTag: 'High-Fidelity Habitat Vista',
    description: 'Preserving full-body white tiger posture, shaded pool & bamboo groves.',
    supportsZoom: true
  },
  pangolin: {
    focalPosition: 'center 50%',
    layoutTitle: 'Burrow & Conservation Mound Framing',
    viewTag: 'Infrared Conservation View',
    description: 'High-detail enclosure framing tracking foraging scales and mound excavation.',
    supportsZoom: true
  },
  gharial: {
    focalPosition: 'center 50%',
    layoutTitle: 'Subsurface & River Bank Panorama',
    viewTag: 'Aquatic Wetland Vista',
    description: 'Wide riverbank and water pool perspective highlighting basking gharials.',
    supportsZoom: true
  },
  king_cobra: {
    focalPosition: 'center 46%',
    layoutTitle: 'Terrarium & Canopy Optical Detail',
    viewTag: 'Macro Rainforest View',
    description: 'Macro telephoto tracking keeping the serpent hood, coils, and terrarium in focus.',
    supportsZoom: true
  },
  flapshell_turtle: {
    focalPosition: 'center 52%',
    layoutTitle: 'Wetland Lily Waters Framing',
    viewTag: 'Gentle Aquatic View',
    description: 'Calm water surface and lotus pad layout tracking flapshell swimming movements.',
    supportsZoom: true
  }
};

// Stream Video Quality Profiles (Resolution, Frame Rate & Bitrate)
const QUALITY_OPTIONS = [
  { id: 'auto', label: 'Auto (Adaptive)', resolution: '1080p Full HD', fps: '60fps', bitrate: '5.4 Mbps', badge: 'AUTO', sub: 'Adaptive Bandwidth & AI Latency' },
  { id: '1080p', label: '1080p Full HD', resolution: '1080p Full HD', fps: '60fps', bitrate: '5.4 Mbps', badge: '1080P', sub: 'Crystal Clear Ultra HD Stream' },
  { id: '720p', label: '720p HD', resolution: '720p HD', fps: '30fps', bitrate: '2.4 Mbps', badge: '720P', sub: 'High Definition • Smooth Playback' },
  { id: '480p', label: '480p SD', resolution: '480p SD', fps: '30fps', bitrate: '1.2 Mbps', badge: '480P', sub: 'Standard Definition • Low Data' },
  { id: '360p', label: '360p Data Saver', resolution: '360p SD', fps: '24fps', bitrate: '800 Kbps', badge: '360P', sub: 'Maximum Data Saving Mode' }
];

// Digital & Optical Zoom Profiles (Magnification, Field of View & Focus Mode)
const ZOOM_OPTIONS = [
  { level: 1, label: '1.0x', badge: '1X', fov: '100% FOV', sub: 'Full enclosure panorama • Natural view' },
  { level: 1.5, label: '1.5x', badge: '1.5X', fov: '67% FOV', sub: 'Detailed wildlife tracking • Telephoto' },
  { level: 2, label: '2.0x', badge: '2X', fov: '50% FOV', sub: 'Close-up plumage, facial features & coat inspection' }
];

export default function LiveCameraPlayer({
  animal,
  camerasList = [],
  onSelectAnimal,
  onClose
}) {
  const isWhiteTiger = animal?.slug === 'white-bengal-tiger' || animal?.id === 7 || (animal?.animal_name?.toLowerCase().includes('white') && animal?.animal_name?.toLowerCase().includes('tiger'));
  const isTiger = (animal?.slug === 'royal-bengal-tiger' || animal?.id === 1 || (animal?.animal_name?.toLowerCase().includes('tiger') && !animal?.animal_name?.toLowerCase().includes('white'))) && !isWhiteTiger;
  const isLion = animal?.slug === 'asiatic-lion' || animal?.id === 2;
  const isElephant = animal?.slug === 'asian-elephant' || animal?.id === 3 || animal?.animal_name?.toLowerCase().includes('elephant');
  const isDeer = animal?.slug === 'spotted-deer' || animal?.id === 4;
  const isBear = animal?.slug === 'sloth-bear' || animal?.id === 5 || animal?.animal_name?.toLowerCase().includes('bear');
  const isBird = animal?.slug === 'birds' || animal?.id === 6 || animal?.animal_name?.toLowerCase().includes('bird');
  const isPangolin = animal?.slug === 'indian-pangolin' || animal?.id === 8 || animal?.animal_name?.toLowerCase().includes('pangolin');
  const isGharial = animal?.slug === 'gharial' || animal?.id === 9 || animal?.animal_name?.toLowerCase().includes('gharial') || animal?.animal_name?.toLowerCase().includes('crocodile');
  const isCobra = animal?.slug === 'king-cobra' || animal?.id === 10 || animal?.animal_name?.toLowerCase().includes('cobra');
  const isTurtle = animal?.slug === 'indian-flapshell-turtle' || animal?.id === 11 || animal?.animal_name?.toLowerCase().includes('turtle') || animal?.animal_name?.toLowerCase().includes('flapshell');
  const hasMultiCam = Boolean(animal?.cameras && animal.cameras.length >= 3) || isTiger || isWhiteTiger || isLion || isElephant || isDeer || isBear || isBird || isPangolin || isGharial || isCobra || isTurtle;

  // Selected camera feed being viewed in main video player (1, 2, or 3)
  const [selectedAngleId, setSelectedAngleId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState([]);

  // Quality & Stream Controls
  const [streamQuality, setStreamQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showTopQualityMenu, setShowTopQualityMenu] = useState(false);
  const [qualityNotification, setQualityNotification] = useState(null);
  const qualityToastTimerRef = useRef(null);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [zoomNotification, setZoomNotification] = useState(null);
  const zoomToastTimerRef = useRef(null);
  const [volume, setVolume] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [audioNotification, setAudioNotification] = useState(null);
  const audioToastTimerRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStreamError, setHasStreamError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoPlayerContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveLikes, setLiveLikes] = useState(1420);
  const [shareToast, setShareToast] = useState(null);
  const shareToastTimerRef = useRef(null);

  // Surveillance Stream Mode: 'continuous' (Single continuous 1080p surveillance video)
  const [viewMode, setViewMode] = useState('continuous');

  // Interactive Popup State: null | 'feeding' | 'medication' | 'donation'
  const [activePopup, setActivePopup] = useState(null);

  // Donation Selection State
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(500);
  const [donationSuccessMsg, setDonationSuccessMsg] = useState(false);

  // Wildlife Wallet & Contribution State
  const [walletState, setWalletState] = useState(() => ({
    wallet: walletManager.getWallet(),
    contributions: walletManager.getContributions(),
    fund: walletManager.getAnimalCareFund()
  }));

  // Temporary appreciation banner & particles over live video
  const [activeDonationCelebration, setActiveDonationCelebration] = useState(null);

  // Wildlife Wallet Modals
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [contributionInitialAmount, setContributionInitialAmount] = useState(50);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWalletHistoryOpen, setIsWalletHistoryOpen] = useState(false);
  const [isFundDetailsOpen, setIsFundDetailsOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [communityModalTab, setCommunityModalTab] = useState('compose');
  const [communityModalPreselectedAnimal, setCommunityModalPreselectedAnimal] = useState(null);

  useEffect(() => {
    const unsubWallet = walletManager.subscribe((st) => {
      setWalletState(st);
    });
    const unsubDonation = walletManager.onDonationCelebration((donation) => {
      setActiveDonationCelebration(donation);
    });
    return () => {
      unsubWallet();
      unsubDonation();
    };
  }, []);

  const handleDismissDonationCelebration = useCallback(() => {
    setActiveDonationCelebration(null);
  }, []);

  // Animal Cycling Navigation (Keyboard Shortcuts)
  const handleAnimalScrollLeft = useCallback(() => {
    if (camerasList && camerasList.length > 0) {
      const idx = camerasList.findIndex(
        (c) => c.id === animal?.id ||
          c.slug === animal?.slug ||
          (c.animal_name && animal?.animal_name && c.animal_name.toLowerCase() === animal.animal_name.toLowerCase())
      );
      const currentIndex = idx >= 0 ? idx : 0;
      const targetIndex = (currentIndex - 1 + camerasList.length) % camerasList.length;
      const targetAnimal = camerasList[targetIndex];
      if (targetAnimal && onSelectAnimal) {
        onSelectAnimal(targetAnimal);
      }
    }
  }, [camerasList, animal?.id, animal?.slug, animal?.animal_name, onSelectAnimal]);

  const handleAnimalScrollRight = useCallback(() => {
    if (camerasList && camerasList.length > 0) {
      const idx = camerasList.findIndex(
        (c) => c.id === animal?.id ||
          c.slug === animal?.slug ||
          (c.animal_name && animal?.animal_name && c.animal_name.toLowerCase() === animal.animal_name.toLowerCase())
      );
      const currentIndex = idx >= 0 ? idx : 0;
      const targetIndex = (currentIndex + 1) % camerasList.length;
      const targetAnimal = camerasList[targetIndex];
      if (targetAnimal && onSelectAnimal) {
        onSelectAnimal(targetAnimal);
      }
    }
  }, [camerasList, animal?.id, animal?.slug, animal?.animal_name, onSelectAnimal]);

  const handleOpenContribution = (amount = 50, targetAnimal = null) => {
    setContributionInitialAmount(amount);
    setIsContributionModalOpen(true);
  };

  const handleConfirmContribution = async (params) => {
    return await walletManager.makeContribution({
      ...params,
      animal: params.animal || animal
    });
  };

  const handleConfirmTopUp = async (amount) => {
    const order = await walletManager.createTopUpOrder(amount);
    if (order?.success) {
      return await walletManager.verifyTopUp({
        orderId: order.order_id,
        paymentId: 'pay_demo_topup_' + Math.random().toString(36).substring(2, 10),
        signature: 'demo_sig_topup_' + Date.now(),
        amount,
        isDemo: true
      });
    }
    return { success: false, error: 'Failed to create topup order' };
  };

  // Playback timer & synchronized timecode clock
  const [streamSeconds, setStreamSeconds] = useState(24);
  const [syncTimecode, setSyncTimecode] = useState('');

  // Individual Animal 5-Second Free Preview & Subscription System
  const [isSubscribed, setIsSubscribed] = useState(() => subscriptionManager.isSubscribed(animal));
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (subscriptionManager.isSubscribed(animal)) return Infinity;
    return subscriptionManager.getRemainingPreviewSeconds(animal);
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Auto-Tracking Mode (Automatic Camera Switching according to actual tiger location)
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState(true);

  // Active Animal Layout Configuration
  const activeAnimalKey = isWhiteTiger ? 'white_tiger' : isTiger ? 'tiger' : isLion ? 'lion' : isElephant ? 'elephant' : isDeer ? 'deer' : isBear ? 'bear' : isBird ? 'birds' : isPangolin ? 'pangolin' : isGharial ? 'gharial' : isCobra ? 'king_cobra' : isTurtle ? 'flapshell_turtle' : 'tiger';
  const layoutConfig = ANIMAL_LAYOUT_CONFIG[activeAnimalKey] || ANIMAL_LAYOUT_CONFIG.tiger;

  // Actual Stream Quality & Technical Metrics
  const is60FpsStream = isElephant || (isLion && selectedAngleId === 1) || (isTiger && selectedAngleId === 1);
  const nativeFps = is60FpsStream ? '60fps' : '30fps';
  const nativeBitrate = isElephant ? '5.4 Mbps' : isLion ? (selectedAngleId === 1 ? '5.0 Mbps' : '4.6 Mbps') : isTiger ? (selectedAngleId === 1 ? '5.2 Mbps' : '4.8 Mbps') : '4.8 Mbps';

  const currentQualityConfig = useMemo(() => {
    return QUALITY_OPTIONS.find(q => q.id === streamQuality) || QUALITY_OPTIONS[0];
  }, [streamQuality]);

  const displayResolution = streamQuality === '480p' ? '480p SD' : streamQuality === '360p' ? '360p SD' : streamQuality === '720p' ? '720p HD' : '1080p Full HD';
  const displayFps = streamQuality === '480p' || streamQuality === '720p' ? '30fps' : streamQuality === '360p' ? '24fps' : nativeFps;
  const displayBitrate = streamQuality === '480p' ? '1.2 Mbps' : streamQuality === '360p' ? '800 Kbps' : streamQuality === '720p' ? '2.4 Mbps' : nativeBitrate;

  const qualityFilterStyle = useMemo(() => {
    if (streamQuality === '360p') {
      return 'contrast(0.92) brightness(0.96) blur(0.5px)';
    }
    if (streamQuality === '480p') {
      return 'contrast(0.96) brightness(0.98) blur(0.3px)';
    }
    if (streamQuality === '720p') {
      return 'contrast(1.02) saturate(1.02)';
    }
    return 'contrast(1.04) saturate(1.03) brightness(1.01)';
  }, [streamQuality]);

  const handleSelectQuality = useCallback((qualityId) => {
    setStreamQuality(qualityId);
    setShowQualityMenu(false);
    setShowTopQualityMenu(false);
    const qOpt = QUALITY_OPTIONS.find(q => q.id === qualityId);
    if (qOpt) {
      setQualityNotification(`${qOpt.label} • ${qOpt.fps} (${qOpt.bitrate})`);
      if (qualityToastTimerRef.current) clearTimeout(qualityToastTimerRef.current);
      qualityToastTimerRef.current = setTimeout(() => {
        setQualityNotification(null);
      }, 2600);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (qualityToastTimerRef.current) clearTimeout(qualityToastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showQualityMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-quality-menu]')) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showQualityMenu]);

  useEffect(() => {
    if (!showTopQualityMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-top-quality-menu]')) {
        setShowTopQualityMenu(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showTopQualityMenu]);

  const handleSelectZoom = useCallback((level) => {
    setZoomLevel(level);
    setShowZoomMenu(false);
    const zOpt = ZOOM_OPTIONS.find(z => z.level === level);
    if (zOpt) {
      setZoomNotification(`${zOpt.label} • ${zOpt.fov}`);
      if (zoomToastTimerRef.current) clearTimeout(zoomToastTimerRef.current);
      zoomToastTimerRef.current = setTimeout(() => {
        setZoomNotification(null);
      }, 2400);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (zoomToastTimerRef.current) clearTimeout(zoomToastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showZoomMenu) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-zoom-menu]')) {
        setShowZoomMenu(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showZoomMenu]);

  const handleReconnect = () => {
    setHasStreamError(false);
    setIsBuffering(true);
    const v = viewMode === 'continuous' ? videoRefContinuous.current : videoRefs[selectedAngleId]?.current;
    if (v) {
      v.load();
      v.play().catch(() => { }).finally(() => setIsBuffering(false));
    }
  };

  const handleVolumeChange = (newVol) => {
    const isNowMuted = newVol === 0;
    setVolume(newVol);
    setIsMuted(isNowMuted);

    [videoRef1, videoRef2, videoRef3, videoRefContinuous].forEach((ref) => {
      if (ref.current) {
        ref.current.volume = newVol;
        ref.current.muted = isNowMuted;
      }
    });

    try {
      if (isNowMuted) {
        updateAmbientTrack('wind', 0);
        updateAmbientTrack('water', 0);
      } else {
        updateAmbientTrack('wind', newVol * 0.5);
        updateAmbientTrack('water', newVol * 0.35);
      }
    } catch (e) { }

    setAudioNotification(isNowMuted ? 'Audio: Muted' : `Volume: ${Math.round(newVol * 100)}%`);
    if (audioToastTimerRef.current) clearTimeout(audioToastTimerRef.current);
    audioToastTimerRef.current = setTimeout(() => {
      setAudioNotification(null);
    }, 2000);
  };

  // Active Toast Notification for Movement Events
  const [movementToast, setMovementToast] = useState(null);

  // Synchronization refs for all video streams
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const videoRefContinuous = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Video refs lookup map
  const videoRefs = useMemo(() => ({
    1: videoRef1,
    2: videoRef2,
    3: videoRef3,
    continuous: videoRefContinuous
  }), []);

  // Camera angles configuration (Three Physical Camera Coverage Zones)
  const cameraAngles = useMemo(() => {
    if (animal?.cameras && animal.cameras.length >= 3) {
      return animal.cameras.map((cam, idx) => ({
        id: cam.id || (idx + 1),
        camera_number: cam.camera_number || (idx + 1),
        label: `Camera ${String(cam.camera_number || idx + 1).padStart(2, '0')}`,
        name: cam.name || `Camera ${idx + 1} – ${cam.angle || 'View'}`,
        camera_name: cam.camera_name || `Camera ${idx + 1}`,
        viewing_angle: cam.viewing_angle || cam.angle || (idx === 0 ? "Front View" : idx === 1 ? "Side View" : "Rear View"),
        angle: cam.angle || (idx === 0 ? "Front View" : idx === 1 ? "Side View" : "Rear View"),
        zone_name: cam.zone || `Zone ${String.fromCharCode(65 + idx)}`,
        zone_short: cam.zone_short || `Zone ${String.fromCharCode(65 + idx)}`,
        stream_url: cam.stream_url,
        stream_mp4: cam.stream_mp4,
        sensorId: cam.sensorId || `NKZ-CAM-${String(animal.id || 1).padStart(2, '0')}${String.fromCharCode(65 + idx)}`,
        badge: cam.badge || (idx === 0 ? "1080p 60fps" : "1080p 30fps"),
        connection_status: cam.connection_status || `ONLINE • ${cam.badge || '1080p 30fps'}`,
        description: cam.description || `Surveillance feed covering Zone ${String.fromCharCode(65 + idx)}.`
      }));
    }
    return [
      {
        id: 1,
        camera_number: 1,
        label: "Camera 01",
        name: "Camera 1 – Front View",
        camera_name: "Camera 1",
        viewing_angle: "Front View",
        angle: "Front View",
        zone_name: "Zone A: Front Enclosure Area",
        zone_short: "Zone A",
        stream_url: animal?.stream_url || "/videos/tiger_cam1_1080p.webm",
        sensorId: "NKZ-CAM-01A",
        badge: "1080p 60fps",
        connection_status: "ONLINE • 1080p 60fps",
        description: "Front optical perspective."
      },
      {
        id: 2,
        camera_number: 2,
        label: "Camera 02",
        name: "Camera 2 – Side View",
        camera_name: "Camera 2",
        viewing_angle: "Side View",
        angle: "Side View",
        zone_name: "Zone B: Side Corridor",
        zone_short: "Zone B",
        stream_url: animal?.stream_url || "/videos/tiger_cam2_1080p.webm",
        sensorId: "NKZ-CAM-01B",
        badge: "1080p 30fps",
        connection_status: "ONLINE • 1080p 30fps",
        description: "Lateral optical camera."
      },
      {
        id: 3,
        camera_number: 3,
        label: "Camera 03",
        name: "Camera 3 – Rear View",
        camera_name: "Camera 3",
        viewing_angle: "Rear View",
        angle: "Rear View",
        zone_name: "Zone C: Rear Habitat",
        zone_short: "Zone C",
        stream_url: animal?.stream_url || "/videos/tiger_cam3_1080p.webm",
        sensorId: "NKZ-CAM-01C",
        badge: "1080p 30fps",
        connection_status: "ONLINE • 1080p 30fps",
        description: "Rear habitat trail camera."
      }
    ];
  }, [animal]);

  // Current camera object being viewed
  const currentCam = cameraAngles.find(c => c.id === selectedAngleId) || cameraAngles[0];

  // Active Camera Movement Handover Notification (Displayed at the top of the live video)
  const [cameraMovementNotification, setCameraMovementNotification] = useState(null);
  const movementNotificationTimerRef = useRef(null);

  const triggerCameraMovement = useCallback((fromCam, toCam, customMsg = null) => {
    if (!fromCam || !toCam || Number(fromCam) === Number(toCam)) return;

    const fromNum = Number(fromCam);
    const toNum = Number(toCam);
    const fromCamObj = cameraAngles.find(c => Number(c.id) === fromNum || Number(c.camera_number) === fromNum) || { id: fromNum, label: `Cam ${fromNum}`, viewing_angle: `Zone ${String.fromCharCode(64 + fromNum)}` };
    const toCamObj = cameraAngles.find(c => Number(c.id) === toNum || Number(c.camera_number) === toNum) || { id: toNum, label: `Cam ${toNum}`, viewing_angle: `Zone ${String.fromCharCode(64 + toNum)}` };

    const fromLabel = fromCamObj.label || `Cam ${fromNum}`;
    const toLabel = toCamObj.label || `Cam ${toNum}`;
    const fromAngle = fromCamObj.viewing_angle || fromCamObj.angle || `Zone ${String.fromCharCode(64 + fromNum)}`;
    const toAngle = toCamObj.viewing_angle || toCamObj.angle || `Zone ${String.fromCharCode(64 + toNum)}`;

    setCameraMovementNotification({
      fromCam: fromNum,
      toCam: toNum,
      fromLabel,
      toLabel,
      fromAngle,
      toAngle,
      zone: `${fromAngle} ➔ ${toAngle}`,
      message: customMsg || `${animal?.animal_name || 'Animal'} moving from Cam ${fromNum} to Cam ${toNum}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });

    if (movementNotificationTimerRef.current) clearTimeout(movementNotificationTimerRef.current);
    movementNotificationTimerRef.current = setTimeout(() => {
      setCameraMovementNotification(null);
    }, 4500);
  }, [animal, cameraAngles]);

  // Initialize continuous multi-camera physical location tracker
  const tracker = useMemo(() => {
    return new MultiCameraTracker({
      animalName: animal?.animal_name || (isElephant ? "Elephant" : isBird ? "Birds" : isBear ? "Bear" : isDeer ? "Deer" : isLion ? "Asiatic Lion" : "Royal Bengal Tiger"),
      individualId: animal?.resident_id || (isElephant ? "NKZ-E-01" : isBird ? "NKZ-B-12" : isBear ? "NKZ-B-05" : isDeer ? "NKZ-D-08" : isLion ? "NKZ-L-02" : "NKZ-T-04"),
      callsign: animal?.callsign || (isElephant ? "Basanti" : isBird ? "Mayur" : isBear ? "Baloo" : isDeer ? "Chitra" : isLion ? "Suraj" : "Kanha"),
      species: animal?.scientific_name || (isElephant ? "Elephas maximus" : isBird ? "Pavo cristatus" : isBear ? "Melursus ursinus" : isDeer ? "Axis axis" : isLion ? "Panthera leo persica" : "Panthera tigris tigris"),
      cameras: cameraAngles,
      dwellIntervalSeconds: 15
    });
  }, [animal?.id, animal?.animal_name, animal?.scientific_name, animal?.resident_id, animal?.callsign, isLion, isElephant, isDeer, isBear, isBird, cameraAngles]);

  // Tracker State
  const [trackerState, setTrackerState] = useState(() => tracker.getState());

  // Listen to tracker movement events
  useEffect(() => {
    tracker.setAutoTracking(autoTrackingEnabled);

    const unsubscribe = tracker.subscribe((event, state) => {
      setTrackerState({ ...state });

      // Trigger top camera movement notification if moving between cameras
      if (event.previous_camera_id && event.current_camera_id && event.previous_camera_id !== event.current_camera_id) {
        triggerCameraMovement(event.previous_camera_id, event.current_camera_id, event.message);
      }

      // Display Real-Time Movement Toast Notification
      setMovementToast({
        ...event,
        key: Date.now()
      });

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setMovementToast(null);
      }, 5000);

      // Auto-switch main player if Auto-Tracking Mode is active
      if (autoTrackingEnabled && event.current_camera_id && event.is_detected) {
        setSelectedAngleId(event.current_camera_id);
        if (viewMode === 'continuous' && videoRefContinuous.current) {
          const seekMap = isElephant
            ? { 1: 0.1, 2: 3.4, 3: 6.4 }
            : isBird
              ? { 1: 0.1, 2: 7.3, 3: 14.5 }
              : isBear
                ? { 1: 0.1, 2: 4.2, 3: 12.2 }
                : isDeer
                  ? { 1: 0.1, 2: 6.9, 3: 13.1 }
                  : isLion
                    ? { 1: 0.1, 2: 4.6, 3: 11.6 }
                    : { 1: 0.1, 2: 3.7, 3: 10.1 };
          videoRefContinuous.current.currentTime = seekMap[event.current_camera_id] || 0.1;
        }
      }
    });

    tracker.start();

    return () => {
      tracker.stop();
      unsubscribe();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [tracker, autoTrackingEnabled, viewMode]);

  // Reset angle, zoom, and state if animal changes
  useEffect(() => {
    setSelectedAngleId(1);
    setZoomLevel(1);
    setActivePopup(null);
    setDonationSuccessMsg(false);
    setShowQualityMenu(false);
    setShowZoomMenu(false);
    setHasStreamError(false);
    setIsBuffering(false);
  }, [animal?.id]);

  // Lazy-load & pause inactive feeds in Focus Mode for optimal GPU/CPU efficiency
  useEffect(() => {
    if (viewMode === 'focus') {
      [1, 2, 3].forEach(id => {
        const v = videoRefs[id]?.current;
        if (v) {
          if (id === selectedAngleId) {
            if (isPlaying) {
              v.play().catch(() => { });
            }
          } else {
            v.pause();
          }
        }
      });
    }
  }, [viewMode, selectedAngleId, isPlaying, videoRefs]);

  // Programmatically suppress browser native Picture-in-Picture on all video feeds
  useEffect(() => {
    const disablePip = (el) => {
      if (el) {
        try {
          el.disablePictureInPicture = true;
          el.setAttribute('disablepictureinpicture', 'true');
          el.setAttribute('controlslist', 'nodownload noplaybackrate nofullscreen noremoteplayback');
        } catch { }
      }
    };
    disablePip(videoRefContinuous.current);
    if (videoRefs) {
      Object.values(videoRefs).forEach((ref) => disablePip(ref?.current));
    }
  }, [viewMode, selectedAngleId]);

  // Clock & Sync Timer
  const [millisecondTimecode, setMillisecondTimecode] = useState('22:51:42.74');

  useEffect(() => {
    const updateTimecode = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setSyncTimecode(`${hrs}:${mins}:${secs} IST`);
      setMillisecondTimecode(`${hrs}:${mins}:${secs}.${ms}`);
    };

    updateTimecode();
    const timecodeInterval = setInterval(updateTimecode, 75);

    const timer = setInterval(() => {
      setStreamSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timecodeInterval);
      clearInterval(timer);
    };
  }, []);

  // Reset or grant fresh 5-second preview window upon opening or switching animals
  useEffect(() => {
    const sub = subscriptionManager.isSubscribed(animal);
    setIsSubscribed(sub);
    if (sub) {
      setRemainingSeconds(Infinity);
      setIsLocked(false);
      setShowSubscriptionModal(false);
      return;
    }
    subscriptionManager.grantAdditionalPreview(5.0, animal);
    setRemainingSeconds(5.0);
    setIsLocked(false);
  }, [animal?.id, animal?.slug, animal?.animal_name]);

  // Listen to subscription updates from subscriptionManager
  useEffect(() => {
    const unsubscribe = subscriptionManager.subscribe(() => {
      const sub = subscriptionManager.isSubscribed(animal);
      setIsSubscribed(sub);
      if (sub) {
        setRemainingSeconds(Infinity);
        setIsLocked(false);
        setShowSubscriptionModal(false);
      }
    });
    return () => unsubscribe();
  }, [animal]);

  // Monitor active video playback and decrement remaining preview time
  useEffect(() => {
    if (isSubscribed) return;

    const interval = setInterval(() => {
      const activeVideo = viewMode === 'continuous' ? videoRefContinuous.current : videoRefs[selectedAngleId]?.current;
      if (activeVideo && !activeVideo.paused && !activeVideo.ended && activeVideo.readyState >= 2) {
        setRemainingSeconds((prev) => {
          const next = Math.max(0, Math.round((prev - 0.2) * 10) / 10);
          subscriptionManager.recordPlayback(0.2, animal);
          if (next <= 0) {
            // 5-second preview finished! Lock playback and trigger subscription option alert
            activeVideo.pause();
            setIsPlaying(false);
            setIsLocked(true);
            setShowSubscriptionModal(true);
          }
          return next;
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSubscribed, animal, viewMode, selectedAngleId, videoRefs]);

  const handleDismissSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    // If user does not take subscription, grant another 5-second preview so they can watch 5s then alert repeats
    if (!subscriptionManager.isSubscribed(animal)) {
      subscriptionManager.grantAdditionalPreview(5.0, animal);
      setRemainingSeconds(5.0);
      setIsLocked(false);
      const activeVideo = viewMode === 'continuous' ? videoRefContinuous.current : videoRefs[selectedAngleId]?.current;
      if (activeVideo) {
        activeVideo.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleSubscriptionSuccess = (sub) => {
    setIsSubscribed(true);
    setRemainingSeconds(Infinity);
    setIsLocked(false);
    setShowSubscriptionModal(false);
    const activeVideo = viewMode === 'continuous' ? videoRefContinuous.current : videoRefs[selectedAngleId]?.current;
    if (activeVideo) {
      activeVideo.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto-clear buffering spinner safety timeout (so it never gets stuck)
  useEffect(() => {
    if (isBuffering) {
      const timer = setTimeout(() => {
        setIsBuffering(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isBuffering]);

  // Keyboard navigation & interactive playback controls (ESC, Space, M, F, 1-3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.key === 'Escape') {
        if (activePopup) {
          setActivePopup(null);
        } else if (onClose) {
          onClose();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === '1') {
        handleSelectCameraAngle(1);
      } else if (e.key === '2') {
        handleSelectCameraAngle(2);
      } else if (e.key === '3') {
        handleSelectCameraAngle(3);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleAnimalScrollLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleAnimalScrollRight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePopup, onClose, selectedAngleId, viewMode, handleAnimalScrollLeft, handleAnimalScrollRight]);

  // =========================================================================
  // DYNAMIC ANIMAL-SPECIFIC REACTION SYSTEM WITH REALISTIC 3D ICONS
  // =========================================================================
  // Adjustable Reaction Dock Size: 'normal' (expanded dock) | 'mini' (collapsed pill) — 2-State Toggle
  const [reactDockSize, setReactDockSize] = useState(() => {
    try {
      const saved = localStorage.getItem('nandankanan_react_size');
      return saved === 'mini' ? 'mini' : 'normal';
    } catch {
      return 'normal';
    }
  });

  const toggleReactDockSize = useCallback(() => {
    setReactDockSize(prev => {
      const next = prev === 'normal' ? 'mini' : 'normal';
      try {
        localStorage.setItem('nandankanan_react_size', next);
      } catch { }
      return next;
    });
  }, []);

  // Automatically resolves the exact 6 main reactions for the currently selected animal
  const activeReactions = useMemo(() => {
    return reactionManager.getReactionsForAnimal(animal);
  }, [animal]);

  // Load persistent real-time reaction counts for the active animal
  const [reactionCounts, setReactionCounts] = useState(() => {
    return reactionManager.getAnimalCounts(animal);
  });

  // When visitor switches animals, seamlessly update reaction counts without page reload or video reset
  useEffect(() => {
    setReactionCounts(reactionManager.getAnimalCounts(animal));
  }, [animal]);

  const [bouncingEmojiId, setBouncingEmojiId] = useState(null);

  // Dynamic Multi-Tap Combo Streak and Hold-to-Charge Mega Burst State
  const [comboCount, setComboCount] = useState(0);
  const [comboLabel, setComboLabel] = useState(null);
  const [floatingBadges, setFloatingBadges] = useState([]);
  const [chargingReactionId, setChargingReactionId] = useState(null);
  const [chargeProgress, setChargeProgress] = useState(0);

  const comboTimerRef = useRef(null);
  const chargeIntervalRef = useRef(null);
  const chargeStartTimeRef = useRef(null);
  const isMegaBurstTriggeredRef = useRef(false);

  // Compute combo label based on rapid streak
  const getComboTitle = (count) => {
    if (count >= 25) return `🌟 ${count}x GODLIKE NATURE LOVER!`;
    if (count >= 15) return `👑 ${count}x SANCTUARY LEGEND!`;
    if (count >= 10) return `💥 ${count}x ROAR FRENZY!`;
    if (count >= 6) return `⚡ ${count}x WILD HYPE!`;
    if (count >= 3) return `🔥 ${count}x COMBO!`;
    return null;
  };

  // Compute most popular reaction for the active animal
  const popularReactionId = useMemo(() => {
    return reactionManager.getPopularReactionId(animal, reactionCounts);
  }, [animal, reactionCounts]);

  // Enhanced Multi-Trajectory Floating 3D Reaction Spawner with Dynamic Sound & Multi-Tap Combos
  const handleSendReaction = useCallback((item, isFromBurst = false) => {
    // 1. Increment reaction count locally and sync in background
    const newCount = reactionManager.sendReaction(animal, item);
    setReactionCounts(prev => ({
      ...prev,
      [item.id]: newCount
    }));

    // 2. Button bounce animation
    setBouncingEmojiId(item.id);
    setTimeout(() => setBouncingEmojiId(null), 350);

    // 3. Update Combo Counter and play rising-pitch pop sound
    if (!isFromBurst) {
      setComboCount(prev => {
        const next = prev + 1;
        playReactionPop(next);
        const title = getComboTitle(next);
        setComboLabel(title);
        return next;
      });

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setComboCount(0);
        setComboLabel(null);
      }, 1600);

      // Spawn floating score badge near reaction dock
      const badgeId = Date.now() + Math.random();
      const badgeOffset = (Math.random() - 0.5) * 60;
      setFloatingBadges(prev => [
        ...prev,
        { id: badgeId, offset: badgeOffset, text: '+1' }
      ]);
      setTimeout(() => {
        setFloatingBadges(prev => prev.filter(b => b.id !== badgeId));
      }, 850);
    }

    // 4. Spawn floating 3D particle animations over the live video
    const countToSpawn = Math.random() > 0.35 ? 2 : 1;
    const newParticles = [];

    for (let i = 0; i < countToSpawn; i++) {
      const id = Date.now() + Math.random() + i;
      const startX = 20 + Math.random() * 60; // 20% to 80% width
      const driftX = (Math.random() - 0.5) * 120; // -60px to +60px
      const rotation = (Math.random() - 0.5) * 50; // -25deg to +25deg
      const duration = 2.0 + Math.random() * 0.8; // 2.0s to 2.8s
      const scale = 0.95 + Math.random() * 0.45; // 0.95x to 1.4x
      const distanceY = 240 + Math.random() * 120; // 240px to 360px travel

      newParticles.push({
        id,
        iconKey: item.iconKey,
        name: item.name || item.label,
        emojiFallback: item.emoji,
        effect: item.effect,
        startX,
        driftX,
        rotation,
        duration,
        scale,
        distanceY
      });

      // Clean up particle
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== id));
      }, duration * 1000 + 100);
    }

    setReactions(prev => [...prev, ...newParticles]);
  }, [animal]);

  // Trigger Hold-to-Charge "Mega Burst": Fountain explosion of 14 particles + triumphant chord chime
  const triggerMegaBurst = useCallback((item) => {
    isMegaBurstTriggeredRef.current = true;
    playMegaReactionBurst();

    // Add +10 to reaction count
    let updatedCount = 0;
    for (let k = 0; k < 10; k++) {
      updatedCount = reactionManager.sendReaction(animal, item);
    }
    setReactionCounts(prev => ({
      ...prev,
      [item.id]: updatedCount
    }));

    // Escalates combo
    setComboCount(prev => {
      const next = prev + 5;
      const title = getComboTitle(next) || `💥 ${next}x MEGA COMBO!`;
      setComboLabel(title);
      return next;
    });
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setComboCount(0);
      setComboLabel(null);
    }, 2200);

    // Floating +10 Mega badge
    const badgeId = Date.now() + Math.random();
    setFloatingBadges(prev => [
      ...prev,
      { id: badgeId, offset: 0, text: '💥 MEGA BURST +10!', isMega: true }
    ]);
    setTimeout(() => {
      setFloatingBadges(prev => prev.filter(b => b.id !== badgeId));
    }, 1200);

    // Erupt 14 fountain particles across the live video stream
    const fountainParticles = [];
    for (let i = 0; i < 14; i++) {
      const id = Date.now() + Math.random() + i;
      const startX = 30 + Math.random() * 40; // concentrated center burst
      const driftX = (Math.random() - 0.5) * 280; // wide explosive fountain drift
      const rotation = (Math.random() - 0.5) * 90;
      const duration = 2.4 + Math.random() * 1.0;
      const scale = 1.1 + Math.random() * 0.7; // larger celebratory icons
      const distanceY = 320 + Math.random() * 180; // high trajectory

      fountainParticles.push({
        id,
        iconKey: item.iconKey,
        name: item.name,
        startX,
        driftX,
        rotation,
        duration,
        scale,
        distanceY
      });

      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== id));
      }, duration * 1000 + 100);
    }

    setReactions(prev => [...prev, ...fountainParticles]);
  }, [animal]);

  // Pointer & Touch handlers for Hold-to-Charge "Mega Burst"
  const handlePointerDown = useCallback((item, e) => {
    isMegaBurstTriggeredRef.current = false;
    chargeStartTimeRef.current = Date.now();
    setChargingReactionId(item.id);
    setChargeProgress(0);

    const chargeDuration = 650; // ms to reach 100%
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);

    chargeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - chargeStartTimeRef.current;
      const progress = Math.min(100, (elapsed / chargeDuration) * 100);
      setChargeProgress(progress);

      if (progress >= 100) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
        triggerMegaBurst(item);
        setTimeout(() => {
          setChargingReactionId(null);
          setChargeProgress(0);
        }, 150);
      }
    }, 30);
  }, [triggerMegaBurst]);

  const handlePointerUp = useCallback((item) => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    const elapsed = Date.now() - (chargeStartTimeRef.current || 0);
    setChargingReactionId(null);
    setChargeProgress(0);

    // If released before 650ms and Mega Burst was not triggered, treat as single tap
    if (!isMegaBurstTriggeredRef.current && elapsed < 650) {
      handleSendReaction(item);
    }
  }, [handleSendReaction]);

  const handlePointerLeave = useCallback(() => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    setChargingReactionId(null);
    setChargeProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, []);

  const addReaction = (emoji) => {
    const item = activeReactions.find(r => r.emoji === emoji || r.iconKey === emoji) || {
      id: 'custom',
      iconKey: 'heart_red',
      name: 'Love',
      initialCount: 100
    };
    handleSendReaction(item);
  };

  const togglePlay = () => {
    // If user is not subscribed and preview has expired, block playback & show subscription modal
    if (!isSubscribed && (remainingSeconds <= 0 || isLocked)) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsPlaying(prev => {
      const next = !prev;
      if (viewMode === 'continuous' && videoRefContinuous.current) {
        if (next) videoRefContinuous.current.play().catch(() => { });
        else videoRefContinuous.current.pause();
      } else {
        const activeEl = videoRefs[selectedAngleId]?.current || videoRef1.current;
        if (next) activeEl?.play().catch(() => { });
        else activeEl?.pause();
      }
      return next;
    });
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      const targetVol = next ? 0 : (volume > 0 ? volume : 0.8);
      if (!next && volume === 0) {
        setVolume(0.8);
      }
      [videoRef1, videoRef2, videoRef3, videoRefContinuous].forEach((ref) => {
        if (ref.current) {
          ref.current.muted = next;
          ref.current.volume = targetVol;
        }
      });

      // Bio-acoustic ambient sanctuary audio
      try {
        if (next) {
          updateAmbientTrack('wind', 0);
          updateAmbientTrack('water', 0);
        } else {
          updateAmbientTrack('wind', targetVol * 0.5);
          updateAmbientTrack('water', targetVol * 0.35);
        }
      } catch (e) { }

      // Visual feedback toast
      setAudioNotification(next ? 'Audio: Muted' : `Audio: Unmuted (${Math.round(targetVol * 100)}%)`);
      if (audioToastTimerRef.current) clearTimeout(audioToastTimerRef.current);
      audioToastTimerRef.current = setTimeout(() => {
        setAudioNotification(null);
      }, 2000);

      return next;
    });
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      if (shareToastTimerRef.current) clearTimeout(shareToastTimerRef.current);
      if (audioToastTimerRef.current) clearTimeout(audioToastTimerRef.current);
      try {
        updateAmbientTrack('wind', 0);
        updateAmbientTrack('water', 0);
      } catch (e) { }
    };
  }, []);

  const toggleFullscreen = () => {
    const targetEl = videoPlayerContainerRef.current;
    if (!targetEl) return;

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (targetEl.requestFullscreen) {
        targetEl.requestFullscreen().catch(() => { });
      } else if (targetEl.webkitRequestFullscreen) {
        targetEl.webkitRequestFullscreen();
      } else if (targetEl.mozRequestFullScreen) {
        targetEl.mozRequestFullScreen();
      } else if (targetEl.msRequestFullscreen) {
        targetEl.msRequestFullscreen();
      }
    }
  };

  const handleShareLive = useCallback(() => {
    try {
      if (navigator.clipboard && window.location.href) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // fallback
    }
    setShareToast('🔗 Live stream link copied to clipboard!');
    if (shareToastTimerRef.current) clearTimeout(shareToastTimerRef.current);
    shareToastTimerRef.current = setTimeout(() => {
      setShareToast(null);
    }, 2400);
  }, []);

  // Camera selection handler
  const handleSelectCameraAngle = (angleId) => {
    if (selectedAngleId !== angleId) {
      triggerCameraMovement(selectedAngleId, angleId);
    }
    setSelectedAngleId(angleId);
    if (viewMode === 'continuous' && videoRefContinuous.current) {
      const seekMap = isElephant
        ? { 1: 0.1, 2: 3.4, 3: 6.4 }
        : isBird
          ? { 1: 0.1, 2: 7.3, 3: 14.5 }
          : isBear
            ? { 1: 0.1, 2: 4.2, 3: 12.2 }
            : isDeer
              ? { 1: 0.1, 2: 6.9, 3: 13.1 }
              : isLion
                ? { 1: 0.1, 2: 4.6, 3: 11.6 }
                : { 1: 0.1, 2: 3.7, 3: 10.1 };
      videoRefContinuous.current.currentTime = seekMap[angleId] || 0.1;
      return;
    }
    const masterEl = videoRefs[selectedAngleId]?.current;
    const targetEl = videoRefs[angleId]?.current;
    if (masterEl && targetEl && targetEl.duration && masterEl.duration) {
      try {
        targetEl.currentTime = masterEl.currentTime % targetEl.duration;
      } catch (e) { }
    }
  };

  // Dietary and Health Information Fallbacks
  const feedingInfo = animal?.feeding_info || {
    animal_name: animal?.animal_name || "Royal Bengal Tiger",
    primary_food: "Meat",
    diet_category: "Carnivore Nutritional Regimen",
    daily_ration: "8–10 kg of veterinarian-inspected beef/buffalo meat and poultry enriched with essential bone mineral supplements.",
    feeding_schedule: "Daily scheduled feeding at 03:30 PM under clinical oversight.",
    enrichment_notes: "Puzzle foraging and natural scatter feeding techniques deployed regularly."
  };

  const medicationInfo = animal?.medication_info || {
    animal_name: animal?.animal_name || "Royal Bengal Tiger",
    supervising_unit: "Nandankanan Center for Wildlife Health & Veterinary Services",
    veterinary_care: "Regular health evaluations and preventative wellness screening by resident clinicians.",
    health_monitoring: "Behavioral telemetry, daily appetite verification, and habitat climate tracking.",
    medication_status: "Prophylactic deworming and dietary multivitamin supplementation up to date as per zoo records.",
    records_available: true,
    disclaimer: "Official Nandankanan Veterinary Care Protocol • Continuous non-invasive health monitoring."
  };

  const donationInfo = animal?.donation_info || {
    animal_name: animal?.animal_name || "Royal Bengal Tiger",
    amounts: [100, 200, 500, 1000],
    amount_descriptions: {
      100: "Provides daily essential vitamins and dietary micronutrient supplements.",
      200: "Supplies natural sensory enrichment items and habitat materials.",
      500: "Supports preventative clinical wellness checkups and water analysis.",
      1000: "Sponsors comprehensive fresh nutrition and enclosure upkeep."
    }
  };

  const dashboardRef = useRef(null);

  // Lock background scroll when live camera dashboard is mounted
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div
      id="live-wildlife-dashboard"
      ref={dashboardRef}
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      tabIndex={0}
      onWheel={(e) => {
        e.stopPropagation();
      }}
      className="fixed inset-0 z-[100] bg-[#071D12] overflow-y-auto overflow-x-hidden outline-none selection:bg-[#C8A96B] selection:text-[#071D12]"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[1800px] 2xl:max-w-[1920px] mx-auto min-h-screen flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =========================================================================
            1. CLEAN HEADER BAR (Sticky Top Navigation)
            ========================================================================= */}
        <header className="sticky top-0 z-40 bg-[#06180E]/95 backdrop-blur-xl border-b border-[#14532D]/80 shadow-lg shrink-0">
          <div className="w-full px-2.5 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-red-600 text-white text-[9px] sm:text-[11px] font-bold tracking-widest uppercase flex items-center gap-1 sm:gap-1.5 shadow-md shadow-red-600/30 shrink-0">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="shrink-0 flex items-center justify-center">
                    {animal?.iconKey ? (
                      <Realistic3DIcon iconKey={animal.iconKey} size={28} className="drop-shadow-md" />
                    ) : (
                      <span className="text-lg sm:text-xl">{animal?.emoji || '🐅'}</span>
                    )}
                  </span>
                  <h3 className="font-serif font-bold text-sm sm:text-base md:text-xl text-[#F5F4EA] truncate">
                    {animal?.animal_name}
                  </h3>
                  {animal?.scientific_name && (
                    <span className="hidden md:inline text-xs text-[#A7D7A9] italic font-serif truncate">
                      ({animal.scientific_name})
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#C8A96B] font-mono truncate">
                  {animal?.camera_location || animal?.habitat_name} • Resident ID: <span className="font-semibold text-white">{trackerState.individual_id} ("{trackerState.callsign}")</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Donate / Contribution Button */}
              <button
                onClick={() => handleOpenContribution(50, animal)}
                className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#C8A96B] hover:bg-[#D4BA7E] text-[#071D12] flex items-center gap-1 sm:gap-1.5 transition-all shadow-md shadow-[#C8A96B]/20 cursor-pointer active:scale-95"
                title="Share Happiness, Feed Wildlife"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#071D12]" />
                <span className="hidden sm:inline">Feed Wildlife</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#14532D]/60 text-[#F5F4EA]/90 hover:text-white hover:bg-[#14532D] transition-colors border border-[#C8A96B]/40 ml-0.5 sm:ml-1 cursor-pointer flex items-center justify-center shadow-sm active:scale-95"
                aria-label="Close Live Stream (Esc)"
                title="Close Live Stream"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* =========================================================================
            MAIN DASHBOARD BODY (Full Width Panoramic Video Surveillance View)
            ========================================================================= */}
        <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 flex-1 flex flex-col justify-center items-center" >

          {/* Main Top Section: Full Width High-Definition Live Camera Viewport & Controls */}
          <div className="w-full flex-1 flex flex-col justify-center items-center" >

            {/* =========================================================================
                  2. MAIN LIVE VIDEO PLAYER (Prominent, High Definition, Clean Overlays)
                  ========================================================================= */}
            <div
              ref={videoPlayerContainerRef}
              style={!isFullscreen ? {
                aspectRatio: '16 / 9',
                maxWidth: 'calc((100vh - 125px) * 16 / 9)'
              } : undefined}
              className={`relative bg-black w-full mx-auto overflow-hidden group select-none transition-all duration-300 ${isFullscreen
                ? 'fixed inset-0 z-50 h-screen w-screen rounded-none max-h-none border-none'
                : 'max-h-[calc(100vh-125px)] rounded-2xl shadow-2xl border border-white/10'
                }`}
            >

              {/* Temporary Donor Appreciation Notification Overlay */}
              <DonationCelebrationBanner
                donation={activeDonationCelebration}
                onDismiss={handleDismissDonationCelebration}
              />

              {/* Locked Screen Overlay after 5-Second Free Preview finishes */}
              {isLocked && !isSubscribed && (
                <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none animate-fadeIn">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#14532D] to-[#071D12] border-2 border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-2xl mb-3 sm:mb-4">
                    <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono mb-2">
                    <span>5-Second Free Preview Ended</span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-2xl text-white mb-1.5">
                    Subscribe to {animal?.animal_name || 'Animal'} Live Stream
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 max-w-md mb-4 sm:mb-5 leading-relaxed">
                    Enjoy uninterrupted, 24/7 high-definition live streaming of {animal?.animal_name || 'this animal'} across all camera angles.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full max-w-xs">
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#D4BA7E] hover:from-[#D4BA7E] hover:to-[#E0C68E] text-[#071D12] font-bold text-xs sm:text-sm shadow-xl shadow-[#C8A96B]/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#071D12]" />
                      <span>Subscribe to {animal?.animal_name || 'Animal'} – ₹50</span>
                    </button>

                    <button
                      onClick={handleDismissSubscriptionModal}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                    >
                      Preview Again (5s)
                    </button>
                  </div>
                </div>
              )}

              {/* VIEWPORT: Continuous 1080p Surveillance Mode */}
              {viewMode === 'continuous' && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRefContinuous}
                    key={`${animal?.id || 'cam'}-continuous`}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    poster={animal?.thumbnail_url || animal?.photo_url}
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                    onWaiting={() => setIsBuffering(true)}
                    onPlaying={() => { setIsBuffering(false); setHasStreamError(false); }}
                    onCanPlay={() => setIsBuffering(false)}
                    onLoadedData={() => setIsBuffering(false)}
                    onSeeked={() => setIsBuffering(false)}
                    onPlay={() => setIsBuffering(false)}
                    onError={() => { setIsBuffering(false); setHasStreamError(true); }}
                    style={{
                      objectPosition: zoomLevel > 1 ? layoutConfig.focalPosition : 'center center',
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: layoutConfig.focalPosition,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease',
                      filter: qualityFilterStyle
                    }}
                    className="w-full h-full transition-all duration-300 object-cover"
                  >
                    <source src={animal?.stream_url || animal?.continuous_stream_url || (isElephant ? "/videos/elephant_live.webm" : isBird ? "/videos/birds_live.webm" : isBear ? "/videos/bear_continuous_surveillance_1080p.webm" : isDeer ? "/videos/deer_live.webm" : isLion ? "/videos/lion_live.webm" : "/videos/tiger_walking_1080p.webm")} type="video/webm" />
                    <source src={animal?.continuous_stream_mp4 || animal?.stream_mp4 || (animal?.stream_url || animal?.continuous_stream_url || '').replace('.webm', '.mp4')} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* Buffering Indicator Spinner */}
              {isBuffering && (
                <div className="absolute inset-0 z-25 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none select-none transition-opacity duration-300">
                  <div className="p-3.5 rounded-2xl bg-black/85 border border-[#C8A96B]/50 flex items-center gap-3 shadow-2xl animate-fadeIn">
                    <Loader2 className="w-5 h-5 text-[#C8A96B] animate-spin" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-white">Synchronizing Habitat Feed...</p>
                      <p className="text-[10px] font-mono text-emerald-400">Locking {displayResolution} @ {displayFps}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reconnect Option on Stream Error */}
              {hasStreamError && (
                <div className="absolute inset-0 z-25 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none">
                  <AlertOctagon className="w-10 h-10 text-amber-400 mb-2 animate-bounce" />
                  <h4 className="text-base font-bold text-white mb-1">Camera Stream Temporarily Interrupted</h4>
                  <p className="text-xs text-white/70 max-w-sm mb-4">Signal lost or sensor recalibrating in {currentCam.zone_name}.</p>
                  <button
                    onClick={handleReconnect}
                    className="px-4 py-2 bg-[#C8A96B] hover:bg-[#D4BA7E] text-[#071D12] text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reconnect Habitat Stream</span>
                  </button>
                </div>
              )}

              {/* Real-Time Camera Movement Handover Notification (Displayed at the Top of Live Video) */}
              {cameraMovementNotification && !isFullscreen && (
                <div
                  className="absolute top-13 sm:top-14 inset-x-0 mx-auto w-fit max-w-[90%] z-30 animate-fadeIn select-none pointer-events-auto"
                  data-movement-notification="true"
                >
                  <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/85 backdrop-blur-xl border border-[#C8A96B]/70 text-[#F5F4EA] shadow-xl flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono ring-1 ring-[#C8A96B]/40">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                      <Radar className="w-2.5 h-2.5 text-emerald-400 animate-spin" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="font-bold text-[#C8A96B] flex items-center gap-1.5">
                        {animal?.iconKey ? (
                          <Realistic3DIcon iconKey={animal.iconKey} size={18} className="shrink-0 inline-block align-middle" />
                        ) : (
                          <span>{animal?.emoji || '🐾'}</span>
                        )}
                        <span>{animal?.animal_name || 'Animal'}</span>
                      </span>
                    </div>
                    <span className="text-white font-medium flex items-center gap-1.5 whitespace-nowrap">
                      <span>Handover: <strong className="text-amber-300 font-bold">Cam {cameraMovementNotification.fromCam}</strong></span>
                      <ArrowRight className="w-3 h-3 text-[#C8A96B] shrink-0" />
                      <span><strong className="text-emerald-400 font-bold">Cam {cameraMovementNotification.toCam}</strong></span>
                    </span>
                    {cameraMovementNotification.toAngle && (
                      <span className="hidden sm:inline text-[#A7D7A9] text-[10.5px]">
                        ({cameraMovementNotification.toAngle})

                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCameraMovementNotification(null)}
                      className="ml-0.5 p-0.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Top Over-Video Overlay Bar: Left Badges & Right Controls (Unified Non-Overlapping Responsive Flex Layout) */}
              <div className="absolute top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-3.5 z-20 pointer-events-none flex items-center justify-between gap-2">
                {/* Clean, Non-Cluttering Top Over-Video Badges */}
                {!isFullscreen && (
                  <div className="pointer-events-auto flex items-center flex-nowrap gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                    <div className="px-2 sm:px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-[#C8A96B]/30 text-[10px] sm:text-[11px] font-mono text-[#F5F4EA] flex items-center gap-1.5 shadow-lg pointer-events-none shrink min-w-0">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="text-[#C8A96B] font-bold truncate max-w-[85px] sm:max-w-[120px] md:max-w-[150px]">{animal?.animal_name}</span>
                      <span className="text-white/40 hidden md:inline">•</span>
                      <span className="text-white hidden md:inline truncate max-w-[80px] lg:max-w-[110px]">{currentCam.camera_name || currentCam.name}</span>
                      <span className="text-white/40 hidden 2xl:inline">•</span>
                      <span className="text-emerald-400 hidden 2xl:inline">{displayBitrate}</span>
                    </div>

                    {/* Live Stream Status Badge */}
                    <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[9px] sm:text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-none uppercase tracking-wider shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span>LIVE</span>
                    </div>

                    {/* 5-Second Free Preview Countdown / VIP Unlimited Badge */}
                    {!isSubscribed ? (
                      <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[9px] sm:text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-none shrink-0 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                        <span>{Math.max(0, Math.ceil(remainingSeconds))}s<span className="hidden sm:inline"> Preview</span></span>
                      </div>
                    ) : (
                      <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl bg-[#C8A96B]/20 border border-[#C8A96B]/40 text-[9px] sm:text-[10px] font-mono text-[#C8A96B] font-bold flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-none shrink-0 whitespace-nowrap">
                        <Sparkles className="w-3 h-3 text-[#C8A96B] shrink-0" />
                        <span>VIP<span className="hidden sm:inline"> Unlimited</span></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Top-Right Corner Live Video Controls: Watching Badge, Quality Selector & Interactive Digital Zoom */}
                <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
                {/* Live Viewers Watching Badge */}
                {!isFullscreen && (
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-[#C8A96B]/40 text-[10px] sm:text-xs text-[#A7D7A9] font-mono shrink-0 shadow-lg select-none">
                    <Eye className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
                    <span className="font-bold text-[#F5F4EA]">{animal?.viewer_count?.toLocaleString() || '1,420'}</span>
                    <span className="hidden md:inline text-[#A7D7A9]">watching</span>
                  </div>
                )}

                {/* Top-Right Video Stream Quality Selector */}
                <div className="relative" data-top-quality-menu>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTopQualityMenu(prev => !prev);
                      setShowZoomMenu(false);
                    }}
                    className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg select-none ${showTopQualityMenu
                      ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] font-bold shadow-md shadow-[#C8A96B]/25'
                      : 'bg-black/75 hover:bg-black/90 text-[#F5F4EA] border-[#C8A96B]/40 hover:border-[#C8A96B]'
                      }`}
                    title={`Video Stream Quality: ${displayResolution} (Click to change)`}
                    aria-label="Change Video Stream Quality"
                  >
                    <SlidersHorizontal className={`w-3.5 h-3.5 ${showTopQualityMenu ? 'text-[#071D12]' : 'text-[#C8A96B]'} shrink-0`} />
                    {!isFullscreen && (
                      <span className="hidden xs:inline font-mono font-bold text-emerald-300">
                        {streamQuality === 'auto' ? 'Auto' : streamQuality.toUpperCase()}
                      </span>
                    )}
                    <span className={`px-1 py-0.2 rounded text-[9px] font-mono font-bold ${showTopQualityMenu
                      ? 'bg-black/20 text-[#071D12]'
                      : 'bg-black/40 text-amber-300 border border-amber-400/30'
                      }`}>
                      {streamQuality === '480p' || streamQuality === '360p' ? 'SD' : 'HD'}
                    </span>
                  </button>

                  {/* Top-Right Quality Dropdown Popover */}
                  {showTopQualityMenu && (
                    <div
                      className="absolute top-full right-0 mt-1.5 w-48 sm:w-52 bg-[#06180E]/95 backdrop-blur-xl border border-[#C8A96B]/50 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-mono animate-fadeIn pointer-events-auto max-h-[50vh] overflow-y-auto scrollbar-thin"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-2 py-1 text-[9.5px] text-white/60 uppercase tracking-wider border-b border-white/10 mb-1 font-bold">
                        <span className="flex items-center gap-1.5 text-[#C8A96B]">
                          <SlidersHorizontal className="w-3 h-3 text-[#C8A96B]" />
                          Video Stream Quality
                        </span>
                        <span className="text-emerald-400 font-mono">
                          {streamQuality.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {QUALITY_OPTIONS.map((q) => {
                          const isSelected = streamQuality === q.id;
                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => handleSelectQuality(q.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${isSelected
                                ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-sm'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${isSelected
                                ? 'bg-black/20 text-[#071D12]'
                                : 'bg-white/10 text-emerald-400'
                                }`}>
                                {q.badge}
                              </span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#071D12] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" data-zoom-menu>
                  <button
                    type="button"
                    onClick={() => {
                      setShowZoomMenu(prev => !prev);
                      setShowTopQualityMenu(false);
                    }}
                    className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold backdrop-blur-md transition-all border flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg select-none ${showZoomMenu || zoomLevel > 1
                      ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] font-bold shadow-md shadow-[#C8A96B]/25'
                      : 'bg-black/75 hover:bg-black/90 text-[#F5F4EA] border-[#C8A96B]/40 hover:border-[#C8A96B]'
                      }`}
                    title={`Digital Zoom: ${zoomLevel}x (Click to change zoom level)`}
                    aria-label="Change Video Zoom Level"
                  >
                    {zoomLevel > 1 ? (
                      <ZoomOut className={`w-3.5 h-3.5 ${showZoomMenu || zoomLevel > 1 ? 'text-[#071D12]' : 'text-[#C8A96B]'}`} />
                    ) : (
                      <ZoomIn className={`w-3.5 h-3.5 ${showZoomMenu || zoomLevel > 1 ? 'text-[#071D12]' : 'text-[#C8A96B]'}`} />
                    )}
                    {!isFullscreen && (
                      <span className="font-mono font-bold text-emerald-300">
                        {zoomLevel}x
                      </span>
                    )}
                  </button>

                  {/* Top-Right Zoom Dropdown Popover */}
                  {showZoomMenu && (
                    <div
                      className="absolute top-full right-0 mt-1.5 w-48 sm:w-52 bg-[#06180E]/95 backdrop-blur-xl border border-[#C8A96B]/50 rounded-xl shadow-2xl p-1.5 z-50 text-xs font-mono animate-fadeIn pointer-events-auto max-h-[50vh] overflow-y-auto scrollbar-thin"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between px-2 py-1 text-[9.5px] text-white/60 uppercase tracking-wider border-b border-white/10 mb-1 font-bold">
                        <span className="flex items-center gap-1.5 text-[#C8A96B]">
                          <ZoomIn className="w-3 h-3 text-[#C8A96B]" />
                          Optical & Digital Zoom
                        </span>
                        <span className="text-emerald-400 font-mono">
                          {zoomLevel}X
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {ZOOM_OPTIONS.map((z) => {
                          const isSelected = zoomLevel === z.level;
                          return (
                            <button
                              key={z.level}
                              type="button"
                              onClick={() => handleSelectZoom(z.level)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${isSelected
                                ? 'bg-gradient-to-r from-[#C8A96B] to-[#DFCA98] text-[#071D12] font-bold shadow-sm'
                                : 'text-[#F5F4EA]/90 hover:bg-white/10'
                                }`}
                            >
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${isSelected
                                ? 'bg-black/20 text-[#071D12]'
                                : 'bg-white/10 text-emerald-400'
                                }`}>
                                {z.badge}
                              </span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#071D12] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* On-Screen Video Zoom Notification Toast */}
            {zoomNotification && (
              <div className={`absolute ${cameraMovementNotification ? 'top-22 sm:top-24' : 'top-13 sm:top-14'} inset-x-0 mx-auto w-fit z-30 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C8A96B]/60 text-[#F5F4EA] shadow-2xl flex items-center gap-2 text-xs font-mono animate-fadeIn pointer-events-none`}>
                <ZoomIn className="w-3.5 h-3.5 text-[#C8A96B] animate-pulse" />
                <span className="text-white/80">Digital Zoom:</span>
                <span className="text-emerald-400 font-bold">{zoomNotification}</span>
              </div>
            )}

            {/* On-Screen Video Quality Notification Toast */}
            {qualityNotification && (
              <div className={`absolute ${cameraMovementNotification ? 'top-22 sm:top-24' : 'top-13 sm:top-14'} inset-x-0 mx-auto w-fit z-30 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C8A96B]/60 text-[#F5F4EA] shadow-2xl flex items-center gap-2 text-xs font-mono animate-fadeIn pointer-events-none`}>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A96B] animate-spin" />
                <span className="text-white/80">Stream Quality:</span>
                <span className="text-emerald-400 font-bold">{qualityNotification}</span>
              </div>
            )}

            {/* Audio Volume / Mute Toast Notification */}
            {audioNotification && (
              <div className={`absolute ${cameraMovementNotification ? 'top-22 sm:top-24' : 'top-13 sm:top-14'} inset-x-0 mx-auto w-fit z-30 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C8A96B]/60 text-[#F5F4EA] shadow-2xl flex items-center gap-2 text-xs font-mono animate-fadeIn pointer-events-none`}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#C8A96B] animate-pulse" />
                )}
                <span className="text-white/80">Audio:</span>
                <span className="text-emerald-400 font-bold">{audioNotification}</span>
              </div>
            )}

            {/* Share Live Stream Notification Toast */}
            {shareToast && (
              <div className={`absolute ${cameraMovementNotification ? 'top-22 sm:top-24' : 'top-13 sm:top-14'} inset-x-0 mx-auto w-fit z-30 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C8A96B]/60 text-[#F5F4EA] shadow-2xl flex items-center gap-2 text-xs font-mono animate-fadeIn pointer-events-none`}>
                <Share2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span className="text-emerald-400 font-bold">{shareToast}</span>
              </div>
            )}





              {/* Floating Multi-Particle 3D Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
                {reactions.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      left: `${r.startX || 50}%`,
                      bottom: '80px',
                      animation: `floatUpWobble ${r.duration || 2.2}s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                      '--drift-x': `${r.driftX || 0}px`,
                      '--rotation': `${r.rotation || 0}deg`,
                      '--distance-y': `-${r.distanceY || 260}px`,
                    }}
                    className="absolute pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] select-none will-change-transform animate-floatUpWobble"
                  >
                    <Realistic3DIcon
                      iconKey={r.iconKey}
                      size={Math.round(36 * (r.scale || 1))}
                      effect={r.effect}
                    />
                  </div>
                ))}
              </div>

              {/* Right-Aligned Floating Glassmorphism Reaction Dock with Realistic 3D Icons & Adjustable Sizing */}
              {!isFullscreen && (reactDockSize === 'mini' ? (
                <div className="absolute bottom-11 sm:bottom-12 md:bottom-12.5 right-3 sm:right-5 md:right-6 z-20 pointer-events-auto animate-fadeIn">
                  <button
                    type="button"
                    onClick={toggleReactDockSize}
                    className="px-2.5 py-1 rounded-full bg-black/85 hover:bg-black/95 backdrop-blur-xl border border-[#C8A96B]/50 hover:border-[#C8A96B] shadow-2xl flex items-center gap-1.5 text-xs font-mono text-[#F5F4EA] transition-all cursor-pointer group hover:scale-105 active:scale-95"
                    title="Expand Reaction Dock"
                    aria-label="Expand Reaction Dock"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96B] animate-pulse" />
                    <Realistic3DIcon
                      iconKey={activeReactions[0]?.iconKey || 'heart'}
                      size={14}
                    />
                    <span className="text-[10px] text-white/80 font-mono">
                      {popularReactionId ? (reactionCounts[popularReactionId] >= 1000 ? `${(reactionCounts[popularReactionId] / 1000).toFixed(1)}k` : reactionCounts[popularReactionId]) : '4.6k'}
                    </span>
                    <Maximize2 className="w-3 h-3 text-[#C8A96B] opacity-70 group-hover:opacity-100 ml-0.5" />
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-11 sm:bottom-12 md:bottom-12.5 right-3 sm:right-5 md:right-6 w-fit max-w-[calc(100%-1.5rem)] z-20 flex flex-col items-end pointer-events-auto origin-bottom-right scale-75 xs:scale-80 sm:scale-85 md:scale-90 lg:scale-95 xl:scale-100">

                  {/* Multi-Tap Combo Streak Escalation Badge */}
                  {comboLabel && (
                    <div className="mb-1 pointer-events-none animate-comboPop whitespace-nowrap">
                      <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-[#C8A96B] to-yellow-400 text-[#071D12] text-[10.5px] font-black font-mono shadow-[0_0_20px_rgba(200,169,107,0.9)] border border-amber-200 flex items-center gap-1.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 text-[#071D12] fill-current" />
                        <span>{comboLabel}</span>
                      </div>
                    </div>
                  )}

                  {/* Floating Score Badges (+1, +10 MEGA BURST) */}
                  <div className="relative w-full h-0 pointer-events-none">
                    {floatingBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="absolute bottom-1 right-8 pointer-events-none animate-floatNumber font-mono font-black select-none z-30"
                        style={{ transform: `translateX(${badge.offset}px)` }}
                      >
                        <span className={`px-2 py-0.5 rounded-full text-[10px] shadow-xl ${
                          badge.isMega
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black border border-white font-black'
                            : 'bg-white/95 text-[#071D12] border border-[#C8A96B]'
                        }`}>
                          {badge.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Glassmorphic Reaction Dock with Jewel Glows & Hold-to-Charge Ring */}
                  <div className="flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/20 shadow-2xl transition-all duration-200 hover:scale-[1.01] overflow-x-auto scrollbar-none px-1.5 sm:px-2.5 py-0.5 sm:py-1">
                    <button
                      type="button"
                      onClick={toggleReactDockSize}
                      className="p-1 rounded-xl text-[#C8A96B] hover:text-white hover:bg-white/10 mr-0.5 sm:mr-1 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                      title="Minimize Reaction Dock (Click to collapse)"
                      aria-label="Minimize Reaction Dock"
                    >
                      <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                    </button>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {activeReactions.map((item) => {
                        const isHot = item.id === popularReactionId;
                        const isBouncing = bouncingEmojiId === item.id;
                        const isCharging = chargingReactionId === item.id;
                        const count = reactionCounts[item.id] !== undefined ? reactionCounts[item.id] : item.initialCount;
                        const countStr = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;

                        return (
                          <button
                            key={item.id}
                            onPointerDown={(e) => handlePointerDown(item, e)}
                            onPointerUp={() => handlePointerUp(item)}
                            onPointerLeave={handlePointerLeave}
                            onContextMenu={(e) => e.preventDefault()}
                            className={`group relative flex items-center gap-1 sm:gap-1.5 rounded-xl transition-all duration-150 cursor-pointer select-none shrink-0 overflow-hidden px-1.5 sm:px-2 py-0.5 sm:py-1 ${
                              isHot
                                ? 'bg-[#C8A96B]/25 border border-[#C8A96B]/80 shadow-[0_0_15px_rgba(200,169,107,0.45)] ring-1 ring-[#C8A96B]/50'
                                : 'bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#C8A96B]/40 hover:shadow-[0_0_12px_rgba(200,169,107,0.25)]'
                            } ${isBouncing ? 'scale-125 -translate-y-1' : ''} ${
                              isCharging ? 'scale-110 shadow-[0_0_20px_rgba(200,169,107,0.8)] border-[#C8A96B]' : 'hover:scale-105 active:scale-95'
                            }`}
                            title={`${item.name} (${count.toLocaleString()}) • Hold for Mega Burst!`}
                          >
                            {/* Hold-to-Charge Progress Fill */}
                            {isCharging && (
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-[#C8A96B]/40 to-amber-400/60 transition-all pointer-events-none z-0"
                                style={{ width: `${chargeProgress}%` }}
                              />
                            )}

                            <Realistic3DIcon
                              iconKey={item.iconKey}
                              size={17}
                              className={`relative z-10 transition-transform ${isCharging ? 'animate-pulse scale-120' : 'group-hover:scale-115'}`}
                            />
                            <span className={`relative z-10 font-mono font-medium leading-none text-[9px] sm:text-[10px] ${
                              isHot ? 'text-[#C8A96B] font-bold' : 'text-white/80 group-hover:text-white'
                            }`}>
                              {countStr}
                            </span>
                          </button>
                        );
                      })}

                      {/* Size Adjuster Button (Toggle Normal / Mini - 2 States) */}
                      <button
                        type="button"
                        onClick={toggleReactDockSize}
                        className="p-1 sm:p-1.5 rounded-xl border border-white/10 hover:border-[#C8A96B]/50 bg-white/5 hover:bg-white/15 text-[#C8A96B] transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ml-0.5"
                        title={reactDockSize === 'normal' ? "Minimize Reaction Dock (Click to collapse)" : "Expand Reaction Dock (Click to expand)"}
                        aria-label="Toggle React Dock Size"
                      >
                        {reactDockSize === 'normal' ? (
                          <Minimize2 className="w-3 h-3 text-[#C8A96B]" />
                        ) : (
                          <Maximize2 className="w-3 h-3 text-[#C8A96B]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bottom Organized Video Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 px-2 sm:px-4 py-1.5 sm:py-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex items-center justify-between gap-1.5 sm:gap-2 z-20">
                {/* Left Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-[#C8A96B] hover:text-[#071D12] text-white backdrop-blur-md transition-all border border-white/15 cursor-pointer shrink-0"
                    title={isPlaying ? "Pause stream (Space)" : "Play stream (Space)"}
                    aria-label={isPlaying ? "Pause stream" : "Play stream"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />}
                  </button>

                  {/* Interactive Volume with Flyout Slider */}
                  <div
                    className="relative flex items-center group/vol"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md transition-all border cursor-pointer shrink-0 select-none active:scale-95 ${isMuted || volume === 0
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-white/15 hover:bg-[#C8A96B] hover:text-[#071D12] text-[#C8A96B] border-white/15'
                        }`}
                      title={isMuted || volume === 0 ? "Unmute audio (M)" : `Mute audio (M) (${Math.round(volume * 100)}%)`}
                      aria-label="Volume"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>

                    <div className={`transition-all duration-200 overflow-hidden flex items-center gap-1.5 ${showVolumeSlider ? 'w-24 sm:w-28 px-1.5 opacity-100' : 'w-0 px-0 opacity-0 pointer-events-none'
                      }`}>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 sm:w-20 accent-[#C8A96B] cursor-pointer h-1.5 bg-white/20 rounded-lg"
                        aria-label="Volume Slider"
                      />
                      <span className="text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                        {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-colors border border-white/15 cursor-pointer shrink-0"
                    title={isFullscreen ? "Exit Fullscreen (Esc or F)" : "Fullscreen (F)"}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Timecode */}
                  {!isFullscreen && (
                    <span className="text-[11px] text-[#F5F4EA]/80 font-mono hidden md:inline">
                      {formatTime(streamSeconds)} • {syncTimecode}
                    </span>
                  )}

                  {/* Reconnect stream button */}
                  <button
                    onClick={handleReconnect}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md transition-all border border-white/10 cursor-pointer"
                    title="Reconnect stream feed"
                    aria-label="Reconnect"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>

        {/* =========================================================================
            6. SANCTUARY FOOTER
            ========================================================================= */}
        <footer className="w-full bg-[#06180E] border-t border-[#14532D]/80 shadow-2xl py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8 xl:px-10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A7D7A9] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NANDANKANAN ZOOLOGICAL PARK • 24/7 LIVE WILDLIFE SURVEILLANCE</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>Central Zoo Authority Verified Wildlife Telemetry</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-[#C8A96B] hidden sm:inline">Odisha Forest Department</span>
          </div>
        </footer>

        {/* =========================================================================
            POPUP OVERLAYS: FEEDING, MEDICATION & DONATION
            ========================================================================= */}

        {/* POPUP B: FEEDING INFORMATION */}
        {
          activePopup === 'feeding' && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
              onClick={(e) => {
                if (e.target === e.currentTarget) setActivePopup(null);
              }}
            >
              <div
                className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border-2 border-[#C8A96B]/70 p-5 sm:p-7 shadow-2xl text-[#F5F4EA] my-auto animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 border-b border-[#14532D] pb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C8A96B] to-[#997736] text-[#071D12] flex items-center justify-center shadow-lg shadow-[#C8A96B]/25 shrink-0">
                      <UtensilsCrossed className="w-5 h-5 text-[#071D12]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#F5F4EA]">
                        Diet & Feeding Regimen
                      </h4>
                      <p className="text-xs text-[#C8A96B] font-mono mt-0.5">
                        {feedingInfo.animal_name} • {feedingInfo.diet_category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="p-2 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Close Diet Information"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Food Badge */}
                <div className="mb-4 p-3 rounded-2xl bg-[#14532D]/60 border border-[#C8A96B]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                  <span className="text-xs uppercase tracking-wider text-[#A7D7A9] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C8A96B] animate-pulse" />
                    Primary Food / Diet:
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#C8A96B] text-[#071D12] font-serif font-bold text-sm shadow-sm inline-block self-start sm:self-auto">
                    {feedingInfo.primary_food}
                  </span>
                </div>

                {/* Content Cards - Fully visible without truncation */}
                <div className="space-y-3 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#C8A96B]/50 scrollbar-track-transparent">
                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Daily Ration:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {feedingInfo.daily_ration}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Feeding Schedule:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {feedingInfo.feeding_schedule}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Enrichment & Foraging:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {feedingInfo.enrichment_notes}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-[#14532D] flex items-center justify-between text-xs shrink-0">
                  <span className="text-[#A7D7A9]/80 font-mono text-[11px]">
                    Central Zoo Authority Nutrition Protocol
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePopup(null)}
                    className="px-4 py-2 rounded-xl bg-[#C8A96B] hover:bg-[#DFCA98] text-[#071D12] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* POPUP C: MEDICATION & VETERINARY HEALTH */}
        {
          activePopup === 'medication' && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
              onClick={(e) => {
                if (e.target === e.currentTarget) setActivePopup(null);
              }}
            >
              <div
                className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border-2 border-[#C8A96B]/70 p-5 sm:p-7 shadow-2xl text-[#F5F4EA] my-auto animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 border-b border-[#14532D] pb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                      <HeartPulse className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#F5F4EA]">
                        Veterinary Health & Wellness
                      </h4>
                      <p className="text-xs text-[#C8A96B] font-mono mt-0.5">
                        {medicationInfo.animal_name} • Clinical Telemetry
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="p-2 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Close Health Information"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Clinical Status Badge */}
                <div className="mb-4 p-3 rounded-2xl bg-[#14532D]/60 border border-[#C8A96B]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                  <span className="text-xs uppercase tracking-wider text-[#A7D7A9] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Clinical Status:
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Active & Healthy
                  </span>
                </div>

                {/* Content Cards - Fully visible without truncation */}
                <div className="space-y-3 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-[#C8A96B]/50 scrollbar-track-transparent">
                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Supervising Unit:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {medicationInfo.supervising_unit}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Veterinary Protocol:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {medicationInfo.veterinary_care}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                    <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                      Medication & Prophylaxis:
                    </strong>
                    <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                      {medicationInfo.medication_status}
                    </p>
                  </div>

                  {medicationInfo.health_monitoring && (
                    <div className="p-3.5 rounded-2xl bg-[#06180E]/90 border border-[#14532D]/90">
                      <strong className="text-[#C8A96B] font-bold text-xs uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B]" />
                        Biometric Telemetry:
                      </strong>
                      <p className="text-[#F5F4EA] text-xs sm:text-sm leading-relaxed font-normal">
                        {medicationInfo.health_monitoring}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-[#14532D] flex items-center justify-between text-xs shrink-0">
                  <span className="text-[#A7D7A9]/80 font-mono text-[11px]">
                    Official Nandankanan Veterinary Care Protocol
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePopup(null)}
                    className="px-4 py-2 rounded-xl bg-[#C8A96B] hover:bg-[#DFCA98] text-[#071D12] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* POPUP D: DONATION & SPONSORSHIP */}
        {
          activePopup === 'donation' && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setActivePopup(null);
                  setDonationSuccessMsg(false);
                }
              }}
            >
              <div
                className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0B2A1A] to-[#071D12] border-2 border-[#C8A96B]/70 p-5 sm:p-7 shadow-2xl text-[#F5F4EA] my-auto animate-scaleUp overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 border-b border-[#14532D] pb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C8A96B] to-[#997736] text-[#071D12] flex items-center justify-center shadow-lg shadow-[#C8A96B]/25 shrink-0">
                      <Wallet className="w-5 h-5 text-[#071D12]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#F5F4EA]">
                        Animal Guardianship & Support
                      </h4>
                      <p className="text-xs text-[#C8A96B] font-mono mt-0.5">
                        Sponsor {donationInfo.animal_name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActivePopup(null);
                      setDonationSuccessMsg(false);
                    }}
                    className="p-2 rounded-full bg-white/10 text-white/75 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Close Donation Modal"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!donationSuccessMsg ? (
                  <>
                    <p className="text-xs text-[#F5F4EA]/85 mb-3 leading-relaxed">
                      Select a contribution amount to directly sponsor nutrition, daily environmental enrichment, and clinical care.
                    </p>

                    <div className="grid grid-cols-4 gap-2 mb-3.5">
                      {[100, 200, 500, 1000].map((amt) => {
                        const isChosen = selectedDonationAmount === amt;
                        return (
                          <button
                            key={amt}
                            onClick={() => setSelectedDonationAmount(amt)}
                            className={`py-2 px-1 rounded-xl text-center font-serif text-sm sm:text-base font-bold transition-all border ${isChosen
                              ? 'bg-[#C8A96B] text-[#071D12] border-[#C8A96B] shadow-lg shadow-[#C8A96B]/30 scale-105'
                              : 'bg-[#14532D]/40 text-[#F5F4EA] border-[#C8A96B]/30 hover:border-[#C8A96B] hover:bg-[#14532D]/70'
                              }`}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 rounded-xl bg-[#14532D]/30 border border-[#C8A96B]/30 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono uppercase text-[#A7D7A9]">Selected Tier:</span>
                        <span className="font-serif font-bold text-base text-[#C8A96B]">₹{selectedDonationAmount}</span>
                      </div>
                      <p className="text-[11px] text-[#F5F4EA]/80 leading-normal">
                        {donationInfo.amount_descriptions?.[selectedDonationAmount] ||
                          `Sponsors specialized nutritional care and habitat upkeep for ${donationInfo.animal_name}.`}
                      </p>
                    </div>

                    <button
                      onClick={() => setDonationSuccessMsg(true)}
                      className="w-full py-2.5 rounded-xl bg-[#C8A96B] hover:bg-[#D4BA7E] text-[#071D12] font-serif font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#C8A96B]/20 active:scale-[0.99] cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Proceed to Donate ₹{selectedDonationAmount}</span>
                    </button>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-[#14532D]/50 border border-[#C8A96B]/50 text-center animate-fadeIn">
                    <div className="w-12 h-12 rounded-full bg-[#C8A96B]/20 border border-[#C8A96B] text-[#C8A96B] flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h5 className="font-serif font-bold text-base text-[#F5F4EA] mb-1">
                      Donation Tier Selected: ₹{selectedDonationAmount}
                    </h5>
                    <p className="text-xs text-[#F5F4EA]/85 mb-3 leading-relaxed">
                      Thank you for your generous support of <strong>{donationInfo.animal_name}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setDonationSuccessMsg(false);
                        setActivePopup(null);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#C8A96B] text-[#071D12] font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-[#DFCA98]"
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        }

        {/* WILDLIFE WALLET & ANIMAL CONTRIBUTION MODALS */}
        <ContributionModal
          isOpen={isContributionModalOpen}
          onClose={() => setIsContributionModalOpen(false)}
          initialAmount={contributionInitialAmount}
          initialAnimal={animal}
          walletBalance={walletState.wallet?.balance ?? 0}
          onConfirmContribution={handleConfirmContribution}
          onOpenAddMoney={() => {
            setIsContributionModalOpen(false);
            setIsAddMoneyModalOpen(true);
          }}
        />

        <AddMoneyModal
          isOpen={isAddMoneyModalOpen}
          onClose={() => setIsAddMoneyModalOpen(false)}
          currentBalance={walletState.wallet?.balance ?? 0}
          onConfirmTopUp={handleConfirmTopUp}
        />

        <WalletHistoryModal
          isOpen={isWalletHistoryOpen}
          onClose={() => setIsWalletHistoryOpen(false)}
          contributions={walletState.contributions}
          transactions={walletManager.getTransactions()}
        />

        <AnimalCareFundDetailsModal
          isOpen={isFundDetailsOpen}
          onClose={() => setIsFundDetailsOpen(false)}
          fund={walletState.fund}
          onContribute={(amt) => handleOpenContribution(amt, animal)}
        />

        {/* WILDLIFE COMMUNITY HUB & INBOX MODAL */}
        <CommunityMomentsModal
          isOpen={isCommunityModalOpen}
          onClose={() => setIsCommunityModalOpen(false)}
          initialTab={communityModalTab}
          initialAnimal={communityModalPreselectedAnimal || animal}
          walletBalance={walletState.wallet?.balance ?? 0}
          onOpenAddMoney={() => {
            setIsCommunityModalOpen(false);
            setIsAddMoneyModalOpen(true);
          }}
          onShareSuccess={(newMoment) => {
            setActiveDonationCelebration(newMoment);
          }}
        />

        {/* SUBSCRIPTION MODAL POPUP (Individual Animal 5-Second Free Preview Limit / ₹50 Subscription) */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={handleDismissSubscriptionModal}
          onSuccess={handleSubscriptionSuccess}
          animal={animal}
          animalName={animal?.animal_name}
        />

      </div>
    </div>,
    document.body
  );
}
