import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Nandankanan Conservation Components
import PawLoadingScreen from './components/PawLoadingScreen';
import Navbar from './components/Navbar';
import CinematicVideoHero from './components/CinematicVideoHero';
import LiveStreaming from './components/LiveStreaming';
import InteractiveMap from './components/InteractiveMap';
import ExploreAnimals from './components/ExploreAnimals';
import ConservationStories from './components/ConservationStories';
import NewsNoticeSection from './components/NewsNoticeSection';
import SponsorshipPortal from './components/SponsorshipPortal';
import ConservationSection from './components/ConservationSection';
import ParallaxSectionBreak from './components/ParallaxSectionBreak';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import AuthModal from './components/AuthModal';
import SignInPage from './components/SignInPage';
import AdminDashboard from './components/AdminDashboard';
import SubscriptionModal from './components/SubscriptionModal';

// Mock Data
import { 
  INITIAL_ANIMALS, 
  INITIAL_CAMERAS, 
  INITIAL_MARKERS, 
  INITIAL_STORIES 
} from './data/mockData';
import { useLanguage } from './context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const { language, t } = useLanguage();

  const isAuthHash = (hash) => {
    return hash === '#signin' || 
           hash === '#login' || 
           hash === '#register' || 
           hash === '#forgot-password' || 
           hash.startsWith('#reset-password');
  };

  const [currentPage, setCurrentPage] = useState(() => {
    return (typeof window !== 'undefined' && isAuthHash(window.location.hash)) ? 'signin' : 'sanctuary';
  });

  const [isLoaded, setIsLoaded] = useState(false);
  // Dynamic active section initialized from route hash or default 'hero' without hardcoded lock
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return 'hero';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [subscriptionToast, setSubscriptionToast] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [animals, setAnimals] = useState(INITIAL_ANIMALS);
  
  // Active Camera Modal for Live Wildlife Streaming
  const [activeModalCamera, setActiveModalCamera] = useState(null);
  // Highlighted & inline playing camera triggered from Chatbot or user
  const [highlightedCameraId, setHighlightedCameraId] = useState(null);
  const [inlinePlayingCameraId, setInlinePlayingCameraId] = useState(null);

  // Active Marker for 3D Interactive Map triggered from Chatbot or UI
  const [activeMapMarker, setActiveMapMarker] = useState(null);

  // Preselected animal for sponsorship portal
  const [sponsorAnimal, setSponsorAnimal] = useState(INITIAL_ANIMALS[0]);
  const progressBarRef = useRef(null);
  const lenisRef = useRef(null);

  // Session Persistence: Verify stored token on initial load
  useEffect(() => {
    const token = localStorage.getItem('nandankanan_token');
    const cachedUser = localStorage.getItem('nandankanan_user');
    if (cachedUser) {
      try { setCurrentUser(JSON.parse(cachedUser)); } catch (e) {}
    }
    if (token) {
      fetch('/api/auth/me/', {
        headers: { 
          'Authorization': `Token ${token}` 
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem('nandankanan_user', JSON.stringify(data.user));
        } else {
          localStorage.removeItem('nandankanan_token');
          localStorage.removeItem('nandankanan_user');
          setCurrentUser(null);
        }
      })
      .catch(() => {});
    }
  }, []);

  // Handle Hash Changes for Page Navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '';
      if (isAuthHash(hash)) {
        setCurrentPage('signin');
      } else if (currentPage === 'signin' && !isAuthHash(hash)) {
        setCurrentPage('sanctuary');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentPage]);

  // Redirect from Live Video 5-Second Lock Screen to Navbar Subscribe Button
  useEffect(() => {
    const handleRedirectToSubscribe = () => {
      setActiveModalCamera(null);
      if (window.location.hash && window.location.hash.startsWith('#live/')) {
        window.history.replaceState(null, '', '#hero');
      }
      setActiveSection('hero');

      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.6, immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setTimeout(() => {
        const subBtn = document.getElementById('navbar-subscribe-btn');
        if (subBtn) {
          subBtn.focus({ preventScroll: true });
        }
        setSubscriptionModalOpen(true);
      }, 280);
    };

    window.addEventListener('redirect-to-navbar-subscribe', handleRedirectToSubscribe);
    return () => window.removeEventListener('redirect-to-navbar-subscribe', handleRedirectToSubscribe);
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    const token = localStorage.getItem('nandankanan_token');
    if (token) {
      try {
        await fetch('/api/auth/logout/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` 
          }
        });
      } catch (err) {}
    }
    localStorage.removeItem('nandankanan_token');
    localStorage.removeItem('nandankanan_user');
    setCurrentUser(null);
  };

  // Initialize Lenis Smooth Scroll with GSAP Ticker Synchronization
  useEffect(() => {
    if (currentPage !== 'sanctuary') return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoRaf: false, // Driven precisely by GSAP ticker to eliminate frame fighting & auto-drift
    });

    lenisRef.current = lenis;
    if (typeof window !== 'undefined') window.__lenis = lenis;

    // Track scroll progress directly via ref to eliminate heavy App re-renders
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        const pct = Math.max(0, Math.min(100, (e.progress || 0) * 100));
        progressBarRef.current.style.width = `${pct}%`;
      }
    });

    // Synchronize Lenis with GSAP's RAF Ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Settle loading screen
    const timer = setTimeout(() => {
      setIsLoaded(true);
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateTicker);
      lenisRef.current = null;
      if (typeof window !== 'undefined') window.__lenis = null;
      lenis.destroy();
    };
  }, [currentPage]);

  // Universal accurate smooth scroll accounting for sticky navbar offset
  const scrollToTarget = (targetId, activeNavId) => {
    // Dismiss any open modal when programmatically navigating between sections
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('close-animal-modal'));
    }

    if (activeNavId) {
      setActiveSection(activeNavId);
    } else {
      setActiveSection(targetId);
    }

    const el = document.getElementById(targetId);
    if (!el) return;

    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 95;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        offset: -headerHeight - 12,
        duration: 0.85,
        immediate: false
      });
    } else {
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - headerHeight - 12),
        behavior: 'smooth'
      });
    }
  };

  const handleSponsorAnimal = (animal) => {
    setSponsorAnimal(animal);
    scrollToTarget('sponsorship-flow', 'sponsorship-portal');
  };

  const handleOpenLiveModalFromHero = () => {
    scrollToTarget('live-cameras-grid', 'live-wildlife');
  };

  const handleLiveCamFromChatbot = (camera) => {
    const targetCam = camera || (INITIAL_CAMERAS && INITIAL_CAMERAS[0]);
    const camId = targetCam?.id || 1;

    // 1. Immediately launch the dedicated live video stream modal so the video plays on screen
    setActiveModalCamera(targetCam);

    // 2. Highlight and activate inline live video in the Live Section
    setHighlightedCameraId(camId);
    setInlinePlayingCameraId(camId);

    // 3. Smooth scroll directly to the Live Video Grid
    scrollToTarget('live-cameras-grid', 'live-wildlife');

    // 4. Focus and center the specific camera card
    setTimeout(() => {
      const card = document.getElementById(`camera-card-${camId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);
  };

  const handleShowAnimalOnMap = (markerOrId) => {
    let target = null;
    if (typeof markerOrId === 'object' && markerOrId !== null) {
      target = INITIAL_MARKERS.find(m => m.id === markerOrId.id) || markerOrId;
    } else if (typeof markerOrId === 'number') {
      target = INITIAL_MARKERS.find(m => m.id === markerOrId);
    } else if (typeof markerOrId === 'string') {
      const q = markerOrId.toLowerCase();
      target = INITIAL_MARKERS.find(m => 
        (m.animal_slug && m.animal_slug.toLowerCase().includes(q)) ||
        (m.animal_name && m.animal_name.toLowerCase().includes(q)) ||
        (m.title && m.title.toLowerCase().includes(q))
      );
    }
    if (!target) target = INITIAL_MARKERS[0];

    // Trigger active marker update so 3D map swoops, tightly zooms, and isolates this animal's region
    setActiveMapMarker({
      ...target,
      _focusId: Date.now(),
      _isolate: true
    });

    // Suddenly scroll directly down to the 3D map viewport
    const mapBox = document.getElementById('zoo-map-viewport') || document.getElementById('interactive-map');
    if (mapBox) {
      mapBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Full-page SignIn/SignUp screen
  if (currentPage === 'signin') {
    return (
      <SignInPage 
        onNavigateHome={() => {
          window.location.hash = '';
          setCurrentPage('sanctuary');
        }}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          window.location.hash = '';
          setCurrentPage('sanctuary');
        }}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div 
      id="tiger-scroll-container" 
      className="relative min-h-screen bg-[#071D12] text-[#F5F4EA] font-sans selection:bg-[#C8A96B] selection:text-[#071D12] overflow-x-clip"
    >
      {/* Top Viewport Golden Scroll Progress Indicator */}
      <div 
        ref={progressBarRef}
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#C8A96B] via-[#E5A836] to-[#C8A96B] z-[100] pointer-events-none shadow-[0_0_10px_#C8A96B]"
        style={{ width: '0%' }}
      />
      
      {/* 1. Green Paw-Print Loading Screen */}
      <PawLoadingScreen isLoaded={isLoaded} />

      {/* 2. Frosted Forest Green Navigation Bar */}
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSubscription={() => setSubscriptionModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAdmin={() => setAdminOpen(true)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Flow */}
      <main className="relative z-20">
        
        {/* 3. Full-Screen Cinematic Royal Bengal Tiger Hero Section (Bilingual Odia + English & Official Logo Crest) */}
        <CinematicVideoHero 
          onExploreClick={() => scrollToTarget('species-grid', 'explore-animals')}
          onMapClick={() => scrollToTarget('zoo-map-viewport', 'interactive-map')}
          onWatchLiveClick={handleOpenLiveModalFromHero}
        />

        {/* 4. Live Wildlife Streaming Section: "THE WILD, LIVE" */}
        <LiveStreaming 
          cameras={cameras}
          activeModalCamera={activeModalCamera}
          setActiveModalCamera={setActiveModalCamera}
          highlightedCameraId={highlightedCameraId}
          inlinePlayingCameraId={inlinePlayingCameraId}
          setInlinePlayingCameraId={setInlinePlayingCameraId}
        />

        {/* Parallax Breakthrough 1: Lake Kanjia Wetland Panorama */}
        <ParallaxSectionBreak
          id="parallax-lake-kanjia"
          bgImage="/images/kanjia_lake.jpg"
          odiaText="କାଞ୍ଜିଆ ହ୍ରଦ ଓ ସବୁଜ ବନାନୀର ମିଳନସ୍ଥଳ"
          titlePart1="Where Pristine Wetlands Meet"
          titlePart2="Ancient Chandaka Forests"
          description="Spanning 75 hectares of tranquil fresh water, Lake Kanjia forms the beating ecological heart of Nandankanan, providing sanctuary to rare resident and migratory water birds, marsh crocodiles, and lush aquatic flora."
          metrics={[
            { icon: '🌲', value: '437 ha', label: 'Protected Reserve' },
            { icon: '💧', value: '75 ha', label: 'Wetland Sanctuary' },
            { icon: '🐾', value: '156+', label: 'Protected Species' },
            { icon: '🦚', value: '64+', label: 'Avifauna Species' }
          ]}
          ctaText="Explore Illustrated Zoo Map"
          ctaHref="#zoo-map-viewport"
          onCtaClick={() => scrollToTarget('zoo-map-viewport', 'interactive-map')}
        />

        {/* 5. Interactive Moveable Zoo Map with Click-to-Stream Animal Habitats */}
        <InteractiveMap 
          markers={INITIAL_MARKERS}
          activeMarkerProp={activeMapMarker}
          onOpenLiveCam={(camera) => setActiveModalCamera(camera)}
        />

        {/* 6. Encyclopaedia of Species with Featured Animals, Roars & Filters */}
        <ExploreAnimals 
          animals={animals}
          onSponsorAnimal={handleSponsorAnimal}
        />

        {/* Parallax Breakthrough 2: Chandaka Sal Forest Canopy Heritage */}
        <ParallaxSectionBreak
          id="parallax-sal-canopy"
          bgImage="/images/sanctuary_forest.jpg"
          odiaText="ବନ୍ୟପ୍ରାଣୀ ସଂରକ୍ଷଣର ଗୌରବମୟ ଇତିହାସ"
          titlePart1="A Living Heritage of"
          titlePart2="Compassion & Wildlife Conservation"
          description="The world's premier captive breeding sanctuary for Royal Bengal Tigers, White Tigers, and the endangered Indian Pangolin. Thoughtfully integrated within the native forest canopy to pioneer species rehabilitation."
          metrics={[
            { icon: '🏛️', value: '1960', label: 'Estd. Heritage' },
            { icon: '👥', value: '3.5M+', label: 'Annual Visitors' },
            { icon: '🌿', value: '100%', label: 'Zero-Plastic Reserve' },
            { icon: '🩺', value: '24/7', label: 'Veterinary Hospital' }
          ]}
          ctaText="Become an Animal Guardian"
          ctaHref="#sponsorship-flow"
          onCtaClick={() => scrollToTarget('sponsorship-flow', 'sponsorship-portal')}
        />

        {/* 8. Editorial Conservation Stories: "EVERY LIFE HAS A STORY" */}
        <ConservationStories 
          stories={INITIAL_STORIES}
        />

        {/* 9. Scientific Conservation Impact & Metric Count-Up Counters */}
        <ConservationSection language={language} />

        {/* 10. Official News & Notices Section (Image 2: Bulletins & Live Gazettes) */}
        <NewsNoticeSection />

        {/* 11. Virtual Animal Guardianship / Adoption Portal with Live Certificate */}
        <SponsorshipPortal 
          animals={animals}
          preSelectedAnimal={sponsorAnimal}
        />

      </main>

      {/* 11. Sanctuary Footer with Verified Info, Social SVG Links, and Credits */}
      <Footer />

      {/* 12. Floating "Ask Nandankanan" AI Assistant Widget */}
      <ChatbotWidget 
        language={language}
        onOpenLiveCam={handleLiveCamFromChatbot}
        onShowOnMap={handleShowAnimalOnMap}
        isLiveModalOpen={Boolean(activeModalCamera)}
      />

      {/* 15. User Authentication Modal */}
      {authModalOpen && (
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            if (window.location.hash === '#signin' || window.location.hash === '#login') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalOpen(false);
            if (window.location.hash === '#signin' || window.location.hash === '#login') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}

      {/* 16. Admin Sanctuary Management Dashboard */}
      {adminOpen && (
        <AdminDashboard 
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          currentUser={currentUser}
          cameras={cameras}
          setCameras={setCameras}
          animals={animals}
          setAnimals={setAnimals}
        />
      )}

      {/* 17. Global Wildlife Live Streaming Subscription Modal */}
      <SubscriptionModal
        isOpen={subscriptionModalOpen}
        onClose={() => setSubscriptionModalOpen(false)}
        isPreviewEnded={false}
        onSuccess={(sub) => {
          setSubscriptionModalOpen(false);
          setSubscriptionToast({
            plan: sub?.plan_title || 'Premium Wildlife Pass'
          });
          setTimeout(() => setSubscriptionToast(null), 6500);
          scrollToTarget('live-cameras-grid', 'live-wildlife');
        }}
      />

      {/* Subscription Activated Toast Notification */}
      {subscriptionToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[115] w-[92%] max-w-md bg-[#071D12]/95 border-2 border-[#C8A96B] rounded-2xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl text-[#F5F4EA] flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8A96B] to-[#E5C378] text-[#071D12] flex items-center justify-center font-bold shrink-0">
              ✓
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-[#E5C378] truncate">
                {subscriptionToast.plan} Activated!
              </p>
              <p className="text-[11px] text-[#A7D7A9] truncate">
                All wildlife live video streams are now unlocked.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubscriptionToast(null);
              if (cameras && cameras.length > 0) {
                setActiveModalCamera(cameras[0]);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-[#C8A96B] hover:bg-[#E5C378] text-[#071D12] font-bold text-[11px] uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
          >
            Watch Live
          </button>
        </div>
      )}

    </div>
  );
}
