import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Nandankanan Conservation Components
import PawLoadingScreen from './components/PawLoadingScreen';
import Navbar from './components/Navbar';
import CinematicVideoHero from './components/CinematicVideoHero';
import LiveStreaming from './components/LiveStreaming';
import InteractiveMap3D from './components/InteractiveMap3D';
import ExploreAnimals from './components/ExploreAnimals';
import VirtualExperience from './components/VirtualExperience';
import ConservationStories from './components/ConservationStories';
import PlanVisitSection from './components/PlanVisitSection';
import SponsorshipPortal from './components/SponsorshipPortal';
import ConservationSection from './components/ConservationSection';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import TicketBookingModal from './components/TicketBookingModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';

// Mock Data
import { 
  INITIAL_ANIMALS, 
  INITIAL_CAMERAS, 
  INITIAL_MARKERS, 
  INITIAL_STORIES 
} from './data/mockData';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Active Camera Modal for Live Wildlife Streaming
  const [activeModalCamera, setActiveModalCamera] = useState(null);
  // Preselected animal for sponsorship portal
  const [sponsorAnimal, setSponsorAnimal] = useState(INITIAL_ANIMALS[0]);

  // Initialize Lenis Smooth Scroll & Synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Settle loading screen
    const timer = setTimeout(() => {
      setIsLoaded(true);
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  const handleSponsorAnimal = (animal) => {
    setSponsorAnimal(animal);
    const el = document.getElementById('sponsorship-portal');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLiveModalFromHero = () => {
    if (INITIAL_CAMERAS && INITIAL_CAMERAS.length > 0) {
      setActiveModalCamera(INITIAL_CAMERAS[0]);
    }
  };

  return (
    <div 
      id="tiger-scroll-container" 
      className="relative min-h-screen bg-[#071D12] text-[#F5F4EA] font-sans selection:bg-[#C8A96B] selection:text-[#071D12] overflow-x-hidden"
    >
      
      {/* 1. Green Paw-Print Loading Screen */}
      <PawLoadingScreen isLoaded={isLoaded} />

      {/* 2. Frosted Forest Green Navigation Bar */}
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content Flow */}
      <main className="relative z-20">
        
        {/* 3. Full-Screen Cinematic Royal Bengal Tiger Hero Section (Bilingual Odia + English & Official Logo Crest) */}
        <CinematicVideoHero 
          onExploreClick={() => {
            const el = document.getElementById('explore-animals');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onWatchLiveClick={handleOpenLiveModalFromHero}
        />

        {/* 4. Live Wildlife Streaming Section: "THE WILD, LIVE" */}
        <LiveStreaming 
          cameras={INITIAL_CAMERAS}
          activeModalCamera={activeModalCamera}
          setActiveModalCamera={setActiveModalCamera}
        />

        {/* 5. Google Earth-Style 3D Nandankanan Zoo Map with Animal Habitats & Orbit Controls */}
        <InteractiveMap3D 
          markers={INITIAL_MARKERS}
          onOpenLiveCam={(camera) => setActiveModalCamera(camera)}
          onSelectAnimalBySlug={(_slug) => {
            const el = document.getElementById('explore-animals');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6. Encyclopaedia of Species with Featured Animals, Roars & Filters */}
        <ExploreAnimals 
          animals={INITIAL_ANIMALS}
          onSponsorAnimal={handleSponsorAnimal}
        />

        {/* 7. 360° Virtual Wildlife Experience & Bio-Acoustic Soundboard */}
        <VirtualExperience />

        {/* 8. Editorial Conservation Stories: "EVERY LIFE HAS A STORY" */}
        <ConservationStories 
          stories={INITIAL_STORIES}
        />

        {/* 9. Scientific Conservation Impact & Metric Count-Up Counters */}
        <ConservationSection language="english" />

        {/* 10. Plan Your Visit: Timings, Ticket Prices, How to Reach, FAQs Accordion */}
        <PlanVisitSection 
          language="english"
          onOpenTickets={() => setTicketModalOpen(true)}
        />

        {/* 11. Virtual Animal Guardianship / Adoption Portal with Live Certificate */}
        <SponsorshipPortal 
          animals={INITIAL_ANIMALS}
          preSelectedAnimal={sponsorAnimal}
        />

      </main>

      {/* 12. Sanctuary Footer with Verified Info, Social SVG Links, and Credits */}
      <Footer />

      {/* 13. Floating "Ask Nandankanan" AI Assistant Widget */}
      <ChatbotWidget 
        language="english"
        onOpenTickets={() => setTicketModalOpen(true)}
      />

      {/* 14. Online Fast-Track Ticket Booking Modal with Instant QR Pass */}
      <TicketBookingModal 
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        language="english"
      />

      {/* 15. User Authentication Modal */}
      {authModalOpen && (
        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthModalOpen(false);
          }}
        />
      )}

      {/* 16. Admin Sanctuary Management Dashboard */}
      {adminOpen && (
        <AdminDashboard 
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
          currentUser={currentUser}
        />
      )}

    </div>
  );
}
