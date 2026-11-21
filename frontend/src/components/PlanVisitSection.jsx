import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Ticket, 
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Bus, 
  Train, 
  Plane, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function SafariVehicleIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Spare tire on rear */}
      <path d="M2 10v4" />
      {/* Roof, windshield, hood, bumper */}
      <path d="M3 6h11l3 5h4a1 1 0 0 1 1 1v3h-2" />
      {/* Rear body & undercarriage */}
      <path d="M3 6v9h1.5" />
      <path d="M9.5 15h5" />
      {/* Safari roll cage & open seating bar */}
      <path d="M3 11h14" />
      <path d="M9 6v5" />
      {/* Headlight */}
      <path d="M20 13h1" />
      {/* Off-road safari wheels */}
      <circle cx="7" cy="15" r="2.5" />
      <circle cx="17" cy="15" r="2.5" />
    </svg>
  );
}

export default function PlanVisitSection({ onOpenTickets }) {
  const { language, t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      q: language === 'or' ? 'ପ୍ରାଣୀ ଉଦ୍ୟାନ କେଉଁ ସମୟରେ ଖୋଲା ରହେ?' 
        : language === 'hi' ? 'प्राणी उद्यान किस समय खुला रहता है?'
        : language === 'bn' ? 'প্রাণি উদ্যান কখন খোলা থাকে?'
        : 'What are the visiting hours and open days?',
      a: language === 'or' ? 'ନନ୍ଦନକାନନ ମଙ୍ଗଳବାରରୁ ରବିବାର ସକାଳ ୦୭:୩୦ ରୁ ଅପରାହ୍ନ ୦୫:୩୦ ପର୍ଯ୍ୟନ୍ତ ଖୋଲା ରହେ। ପ୍ରତ୍ୟେକ ସୋମବାର ପାର୍କ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ରହେ।'
        : language === 'hi' ? 'नंदनकानन मंगलवार से रविवार प्रातः 07:30 से सायं 05:30 तक खुला रहता है। प्रत्येक सोमवार को उद्यान बंद रहता है।'
        : language === 'bn' ? 'নন্দনকানন মঙ্গলবার থেকে রবিবার সকাল ০৭:৩০ থেকে বিকেল ০৫:৩০ পর্যন্ত খোলা থাকে। প্রতি সোমবার উদ্যান বন্ধ থাকে।'
        : 'Nandankanan is open Tuesday through Sunday from 07:30 AM to 05:30 PM. The park is strictly CLOSED EVERY MONDAY for sanctuary maintenance and animal welfare audits. Safaris operate from 09:00 AM to 04:30 PM.'
    },
    {
      q: language === 'or' ? 'ସଫାରୀ ଟିକେଟ୍ କିପରି ବୁକ୍ କରିବେ?' 
        : language === 'hi' ? 'सफारी टिकट कैसे बुक करें?'
        : language === 'bn' ? 'সাফারি টিকিট কিভাবে কাটবেন?'
        : 'How do safari rides work and how to book?',
      a: language === 'or' ? 'ବାଘ ଓ ସିଂହ ସଫାରୀ ସୁରକ୍ଷିତ ବସ୍ ମାଧ୍ୟମରେ କରାଯାଏ। ଏହାର ଟିକେଟ୍ ମୂଲ୍ୟ ମୁଣ୍ଡପିଛା ₹୧୦୦ ଏବଂ ଏହା ଅନଲାଇନ୍ କିମ୍ବା କାଉଣ୍ଟରରେ ମିଳିଥାଏ।'
        : language === 'hi' ? 'बाघ और शेर सफारी वातानुकूलित व सुरक्षित बसों में संचालित होती है। इसका शुल्क ₹100 प्रति व्यक्ति है और यह ऑनलाइन उपलब्ध है।'
        : language === 'bn' ? 'বাঘ ও সিংহ সাফারি সুরক্ষিত বাসের মাধ্যমে হয়। টিকিট মূল্য জনপ্রতি ₹১০০ এবং অনলাইনেও বুক করা যায়।'
        : 'We offer combined Tiger & Lion Safaris across natural forest enclosures in protected safari buses. Safari tickets are ₹100 per person and can be booked online or directly at the Safari counter near the entrance.'
    },
    {
      q: language === 'or' ? 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଦିବ୍ୟାଙ୍ଗଙ୍କ ପାଇଁ କି ସୁବିଧା ଅଛି?' 
        : language === 'hi' ? 'वरिष्ठ नागरिकों और दिव्यांगों के लिए क्या सुविधाएं हैं?'
        : language === 'bn' ? 'বয়স্ক ও বিশেষ চাহিদাসম্পন্ন ব্যক্তিদের জন্য কি সুবিধা রয়েছে?'
        : 'Are battery carts & wheelchairs available for seniors?',
      a: 'Yes, battery-operated electric vehicles (BOVs) operate continuously across the perimeter trails (₹60 per seat). Free wheelchairs are available at the Main Entrance reception kiosk upon request.'
    },
    {
      q: language === 'or' ? 'ପ୍ଲାଷ୍ଟିକ୍ ଓ ବାହାର ଖାଦ୍ୟ ନିଷିଦ୍ଧ କି?' 
        : language === 'hi' ? 'क्या प्लास्टिक और बाहरी भोजन प्रतिबंधित है?'
        : language === 'bn' ? 'প্লাস্টিক ও বাইরের খাবার কি নিষিদ্ধ?'
        : 'What are the park rules regarding plastic & food?',
      a: 'Nandankanan is a zero-plastic ecological zone. Single-use plastic bottles, polythene carry bags, and outside cooked food are prohibited. Refillable stainless steel water stations are installed throughout the park.'
    },
    {
      q: language === 'or' ? 'ଭୁବନେଶ୍ୱରରୁ କିପରି ପହଞ୍ଚିବେ?' 
        : language === 'hi' ? 'भुवनेश्वर से कैसे पहुँचें?'
        : language === 'bn' ? 'ভুবনেশ্বর থেকে কিভাবে পৌঁছাবেন?'
        : 'How do I reach Nandankanan from Bhubaneswar airport or station?',
      a: 'The park is located in Baranga, 18 km north of Bhubaneswar Railway Station (BBS) and 20 km from Biju Patnaik International Airport. Frequent Mo Bus transit (Route 10 & 11) runs directly to the park gates every 15 minutes.'
    }
  ];

  return (
    <section id="plan-visit" className="pt-10 sm:pt-12 lg:pt-14 pb-10 sm:pb-12 lg:pb-14 bg-[#071D12] text-[#F4F1E8] relative z-20 overflow-hidden">
      
      {/* Top Subtle Golden Forest Horizon Separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8A96B]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#0B2A1A]/50 to-transparent pointer-events-none" />

      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#14532D]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8A96B]" />
              <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#C8A96B] font-bold">
                {t('planVisit.badge')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-tight">
              {t('planVisit.heading')} <br />
              <span className="font-editorial italic font-normal text-[#C8A96B] text-2xl sm:text-3xl lg:text-4xl">
                {t('planVisit.description')}
              </span>
            </h2>
          </div>

          <button
            onClick={onOpenTickets}
            className="btn-accent px-7 py-4 text-xs uppercase tracking-wider flex items-center gap-3 w-fit"
          >
            <Ticket className="w-4 h-4 text-[#071D12]" />
            <span>{t('planVisit.bookTickets')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Overview Cards: Hours, Rates, Safaris (Dark Emerald) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
          
          {/* Card 1: Hours */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#0B2A1A]/90 border border-[#2E7D32]/40 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#14532D] flex items-center justify-center text-[#A7D7A9] mb-6 border border-[#2E7D32]/50">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Sanctuary Hours
              </h3>
              <p className="text-xs text-[#A7D7A9] font-mono uppercase tracking-wider mb-6">
                Tuesday – Sunday (Closed Mondays)
              </p>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Park Gates</span>
                  <span className="font-bold text-white">07:30 AM – 05:30 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Tiger & Lion Safaris</span>
                  <span className="font-bold text-white">09:00 AM – 04:30 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Kanjia Ropeway</span>
                  <span className="font-bold text-white">09:00 AM – 05:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#A7D7A9]">Historic Toy Train</span>
                  <span className="font-bold text-white">08:30 AM – 04:30 PM</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#F28C1B] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#F28C1B]" />
              <span>Closed Every Monday for Animal Rest</span>
            </div>
          </div>

          {/* Card 2: Entry Rates */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#0B2A1A]/90 border border-[#2E7D32]/40 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#14532D] flex items-center justify-center text-[#A7D7A9] mb-6 border border-[#2E7D32]/50">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Entry Tariffs
              </h3>
              <p className="text-xs text-[#A7D7A9] font-mono uppercase tracking-wider mb-6">
                Official Government Rates
              </p>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Adults (Above 12 yrs)</span>
                  <span className="font-bold text-white">₹50</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Children (3 to 12 yrs)</span>
                  <span className="font-bold text-white">₹10</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-[#A7D7A9]">Infants (Below 3 yrs)</span>
                  <span className="font-bold text-emerald-400 uppercase font-mono text-xs">FREE</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#A7D7A9]">Foreign Visitors</span>
                  <span className="font-bold text-white">₹100</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenTickets}
              className="mt-8 pt-4 text-xs font-semibold text-[#A7D7A9] hover:text-white flex items-center gap-1.5 group"
            >
              <span>Instant QR Entry Pass</span>
              <span className="group-hover:translate-x-1 transition-transform text-[#F28C1B]">→</span>
            </button>
          </div>

          {/* Card 3: Safaris & Attractions */}
          <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#14532D] to-[#0B2A1A] text-[#F4F1E8] border border-[#2E7D32]/60 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-[#A7D7A9]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F28C1B] mb-6">
                <SafariVehicleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Safaris & Rides
              </h3>
              <p className="text-xs text-[#A7D7A9] font-mono uppercase tracking-wider mb-6">
                Guided Forest Excursions
              </p>
              
              <div className="space-y-3 text-xs sm:text-sm text-[#F4F1E8]/90">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Tiger & Lion Safari (Bus)</span>
                  <span className="font-bold text-[#F28C1B]">₹100 / person</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Lake Kanjia Ropeway</span>
                  <span className="font-bold text-[#F28C1B]">₹100 / person</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span>Narrow-Gauge Toy Train</span>
                  <span className="font-bold text-[#F28C1B]">₹50 / person</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Electric Eco-Cart (BOV)</span>
                  <span className="font-bold text-[#F28C1B]">₹60 / seat</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenTickets}
              className="mt-8 py-3 rounded-full bg-[#F28C1B] hover:bg-[#e07d10] text-[#071D12] font-bold text-xs uppercase tracking-wider transition-all text-center shadow-lg"
            >
              Book Safari Package
            </button>
          </div>

        </div>

        {/* How to Reach & Rules Strip (Deep Emerald) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* How to Reach */}
          <div className="lg:col-span-7 bg-[#0B2A1A]/90 rounded-3xl p-8 border border-[#2E7D32]/40 shadow-xl">
            <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#F28C1B]" />
              <span>How to Reach Baranga, Bhubaneswar</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#A7D7A9] leading-relaxed mb-6 font-light">
              Nandankanan is centrally connected by high-speed roadways, rail routes, and direct public transit in the Bhubaneswar capital region.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#071D12] border border-[#2E7D32]/30">
                <Train className="w-5 h-5 text-[#F28C1B] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-mono mb-1">Railway Station</h4>
                <p className="text-xs text-[#A7D7A9]/80">18 km from Bhubaneswar (BBS) Station. Cabs & auto-rickshaws available 24/7.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#071D12] border border-[#2E7D32]/30">
                <Plane className="w-5 h-5 text-[#F28C1B] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-mono mb-1">Airport (BBI)</h4>
                <p className="text-xs text-[#A7D7A9]/80">20 km from Biju Patnaik International Airport via Nandankanan Road.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#071D12] border border-[#2E7D32]/30">
                <Bus className="w-5 h-5 text-[#F28C1B] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-mono mb-1">Mo Bus Transit</h4>
                <p className="text-xs text-[#A7D7A9]/80">CRUT Mo Bus Route 10 & 11 drops visitors directly at the Park Main Gate.</p>
              </div>
            </div>
          </div>

          {/* Sanctuary Code of Conduct */}
          <div className="lg:col-span-5 bg-[#071D12] text-[#F4F1E8] rounded-3xl p-8 border border-[#2E7D32]/40 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#F28C1B]" />
                <span>Sanctuary Guidelines</span>
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#F4F1E8]/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Plastic Zone:</strong> Disposable polythene and non-biodegradable plastics are strictly prohibited.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Never Feed Animals:</strong> Animals follow calibrated medical diets; outside food causes fatal toxicity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Maintain Silence:</strong> Loud speakers, music, and tapping on glass enclosures are forbidden.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>No Drone Flights:</strong> Aerial drones cause severe behavioral stress and panic among predators.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#A7D7A9] font-mono">
              Regulated under the Wildlife (Protection) Act, 1972
            </div>
          </div>

        </div>

        {/* FAQs Accordion (Deep Emerald) */}
        <div className="bg-[#0B2A1A]/90 rounded-3xl p-8 sm:p-12 border border-[#2E7D32]/40 shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F28C1B] font-bold block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="text-3xl font-serif font-bold text-white">
              Everything you need to know before visiting.
            </h3>
          </div>

          <div className="divide-y divide-white/10">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 group"
                  >
                    <span className="text-base sm:text-lg font-serif font-semibold text-white group-hover:text-[#A7D7A9] transition-colors">
                      {faq.q}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#14532D] group-hover:bg-[#2E7D32] flex items-center justify-center text-[#A7D7A9] flex-shrink-0 transition-colors">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-[#A7D7A9]/90 font-light leading-relaxed pr-8">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
