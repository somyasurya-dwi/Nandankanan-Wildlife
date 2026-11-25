import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Globe, 
  ChevronDown, 
  Check, 
  Languages,
  Tv,
  ChevronRight,
  Radio,
  Compass,
  MapPin
} from 'lucide-react';
import { getAnimalBotResponse } from '../data/animalBotKnowledge';
import { INITIAL_CAMERAS } from '../data/mockData';

const SUPPORTED_LANGUAGES = [
  { id: 'english', code: 'EN', name: 'English', native: 'English', flag: '🇬🇧' },
  { id: 'odia', code: 'OD', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { id: 'bengali', code: 'BN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { id: 'hindi', code: 'HI', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' }
];

const LOCALIZED_CONTENT = {
  english: {
    title: "Ask Nandankanan",
    badge: "AI Guide",
    status: "Sanctuary AI Intelligence Active",
    welcome: "Namaskar! I am your Nandankanan Sanctuary AI Assistant. How may I assist your visit, safari booking, or wildlife inquiry today?",
    placeholder: "Ask AI about any animal, live streams, safaris...",
    langLabel: "Language:",
    prompts: [
      { label: '📹 All 12 Animal Live Streams', q: 'Show me the live stream of the individual animal' },
      { label: '🐅 Royal Bengal Tiger Live Cam', q: 'Show me the tiger live cam' },
      { label: '🦁 Asiatic Lion Live Cam', q: 'Show me the lion live cam' },
      { label: '🐘 Elephant Live Cam', q: 'Show me the elephant live cam' },
      { label: '🦌 Deer Live Cam', q: 'Show me the deer live cam' },
      { label: '🐻 Bear Live Cam', q: 'Show me the bear live cam' },
      { label: '🦚 Peacock Live Cam', q: 'Show me the peacock live cam' },
      { label: '⚪ White Bengal Tiger Live Cam', q: 'Show me the white tiger live cam' },
      { label: '🛡️ Indian Pangolin Live Cam', q: 'Show me the pangolin live cam' },
      { label: '🐊 Gharial Crocodile Live Cam', q: 'Show me the gharial live cam' },
      { label: '🐍 King Cobra Live Cam', q: 'Show me the king cobra live cam' },
      { label: '🐢 Flapshell Turtle Live Cam', q: 'Show me the turtle live cam' },
      { label: '🪶 Asian Openbill Live Cam', q: 'Show me the openbill live cam' },
      { label: '🐾 Every Animal Guide', q: 'Tell me every animal detail in Nandankanan Zoological Park' },
      { label: '🐅 White Tiger Heritage', q: 'Tell me the history of White Tigers in Nandankanan' },
      { label: '🦁 Asiatic Lion Safari', q: 'Tell me about Asiatic Lion and Lion Safari' },
      { label: '🐘 Asian Elephant', q: 'Tell me about the Asian Elephants in Nandankanan' },
      { label: '🛡️ Indian Pangolin (World First)', q: 'Tell me about the Indian Pangolin breeding center' },
      { label: '🐊 Gharial Crocodile', q: 'Tell me about the Gharial crocodile project' },
      { label: '🐍 King Cobra Pavilion', q: 'Tell me about King Cobra breeding in Nandankanan' },
      { label: '🕒 Visiting Hours & Closed Days', q: 'What are the visiting hours?' },
      { label: '🎟️ Entry & Safari Ticket Prices', q: 'How much are the entry tickets and safaris?' },
      { label: '🚂 Toy Train & Ropeway', q: 'Tell me about the toy train and ropeway' },
      { label: '🚫 Plastic Rules & Food', q: 'Are plastic bottles and outside food allowed?' },
      { label: '🚗 How to Reach the Zoo', q: 'How can I reach Nandankanan?' }
    ]
  },
  odia: {
    title: "ନନ୍ଦନକାନନ AI",
    badge: "AI ସହାୟକ",
    status: "ଅଭୟାରଣ୍ୟ ସହାୟକ ସକ୍ରିୟ • ଓଡ଼ିଆ",
    welcome: "ନମସ୍କାର! ମୁଁ ନନ୍ଦନକାନନ ଅଭୟାରଣ୍ୟ AI ସହାୟକ। ଆଜି ଆପଣଙ୍କ ପରିଦର୍ଶନ, ସଫାରୀ ବୁକିଂ କିମ୍ବା ବନ୍ୟପ୍ରାଣୀ ସମ୍ପର୍କରେ କି ସାହାଯ୍ୟ କରିପାରିବି?",
    placeholder: "ସମସ୍ତ ପ୍ରାଣୀ, ଲାଇଭ୍ ଷ୍ଟ୍ରିମ୍, ସଫାରୀ ସମ୍ପର୍କରେ ପଚାରନ୍ତୁ...",
    langLabel: "ଭାଷା:",
    prompts: [
      { label: '📹 ସମସ୍ତ ୧୨ଟି ଲାଇଭ୍ ଷ୍ଟ୍ରିମ୍', q: 'ମୋତେ ପ୍ରତ୍ୟେକ ପ୍ରାଣୀଙ୍କ ଲାଇଭ୍ ଷ୍ଟ୍ରିମ୍ ଦେଖାନ୍ତୁ' },
      { label: '🐅 ବାଘ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ବାଘ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🦁 ସିଂହ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ସିଂହ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐘 ହାତୀ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ହାତୀ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🦌 ହରିଣ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ହରିଣ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐻 ଭାଲୁ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ଭାଲୁ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🦚 ମୟୂର ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ମୟୂର ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '⚪ ଧଳା ବାଘ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ଧଳା ବାଘ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🛡️ ବଜ୍ରକାପ୍ତା ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ବଜ୍ରକାପ୍ତା ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐊 ଘଡ଼ିଆଳ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ଘଡ଼ିଆଳ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐍 କିଙ୍ଗ କୋବ୍ରା ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ କିଙ୍ଗ କୋବ୍ରା ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐢 କଇଁଛ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ କଇଁଛ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🪶 ଓପନବିଲ୍ ଲାଇଭ୍ କ୍ୟାମେରା', q: 'ମୋତେ ଓପନବିଲ୍ ଲାଇଭ୍ କ୍ୟାମେରା ଦେଖାନ୍ତୁ' },
      { label: '🐾 ସମସ୍ତ ପ୍ରାଣୀ ଗାଇଡ୍', q: 'ନନ୍ଦନକାନନର ସମସ୍ତ ପ୍ରାଣୀଙ୍କ ବିବରଣୀ କୁହନ୍ତୁ' },
      { label: '🐅 ଧଳା ବାଘ ଇତିହାସ', q: 'ଧଳା ବାଘଙ୍କ ଇତିହାସ କୁହନ୍ତୁ' },
      { label: '🦁 ସିଂହ ସଫାରୀ', q: 'ଏସିଆଟିକ ସିଂହ ଓ ସିଂହ ସଫାରୀ ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🐘 ହାତୀ ଅଭୟାରଣ୍ୟ', q: 'ହାତୀମାନଙ୍କ ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🛡️ ବଜ୍ରକାପ୍ତା ପ୍ରଜନନ', q: 'ଭାରତୀୟ ବଜ୍ରକାପ୍ତା ପ୍ରଜନନ କେନ୍ଦ୍ର ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🐊 ଘଡ଼ିଆଳ କୁମ୍ଭୀର', q: 'ଘଡ଼ିଆଳ କୁମ୍ଭୀର ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🐍 ଅହିରାଜ / କିଙ୍ଗ କୋବ୍ରା', q: 'ଅହିରାଜ ଓ ସାପ ପ୍ରଜନନ ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🕒 ପରିଦର୍ଶନ ସମୟ ଓ ଛୁଟି ଦିନ', q: 'ନନ୍ଦନକାନନ କେତେବେଳେ ଖୋଲା ରହେ?' },
      { label: '🎟️ ଟିକେଟ ଓ ସଫାରୀ ଦର', q: 'ପ୍ରବେଶ ଓ ସଫାରୀ ଟିକେଟ ମୂଲ୍ୟ କେତେ?' },
      { label: '🚂 ଖେଳଣା ଟ୍ରେନ ଓ ରୋପୱେ', q: 'ଖେଳଣା ଟ୍ରେନ ଓ ରୋପୱେ ବିଷୟରେ କୁହନ୍ତୁ' },
      { label: '🚫 ପ୍ଲାଷ୍ଟିକ ନିୟମ ଓ ଖାଦ୍ୟ', q: 'ପ୍ଲାଷ୍ଟିକ ଓ ବାହାର ଖାଦ୍ୟ ଅନୁମୋଦିତ କି?' },
      { label: '🚗 ନନ୍ଦନକାନନ କିପରି ଯିବେ', q: 'ନନ୍ଦନକାନନ କିପରି ପହଞ୍ଚିବି?' }
    ]
  },
  bengali: {
    title: "নন্দনকানন AI",
    badge: "AI সহকারী",
    status: "অভয়ারণ্য সহায়ক সক্রিয় • বাংলা",
    welcome: "নমস্কার! আমি আপনার নন্দনকানন অভয়ারণ্য AI সহকারী। আজকের ভ্রমণ, সাফারি বুকিং বা বন্যপ্রাণী অনুসন্ধানে কীভাবে সাহায্য করতে পারি?",
    placeholder: "সকল প্রাণী, লাইভ স্ট্রিম, সময়সূচী বা সাফারি...",
    langLabel: "ভাষা:",
    prompts: [
      { label: '📹 সকল ১২টি প্রাণীর লাইভ স্ট্রিম', q: 'আমাকে প্রতিটি প্রাণীর লাইভ স্ট্রিম দেখান' },
      { label: '🐅 বাঘের লাইভ ক্যামেরা', q: 'আমাকে বাঘের লাইভ ক্যামেরা দেখান' },
      { label: '🦁 সিংহ লাইভ ক্যামেরা', q: 'আমাকে সিংহের লাইভ ক্যামেরা দেখান' },
      { label: '🐘 হাতি লাইভ ক্যামেরা', q: 'আমাকে হাতির লাইভ ক্যামেরা দেখান' },
      { label: '🦌 হরিণ লাইভ ক্যামেরা', q: 'আমাকে হরিণের লাইভ ক্যামেরা দেখান' },
      { label: '🐻 ভাল্লুক লাইভ ক্যামেরা', q: 'আমাকে ভাল্লুকের লাইভ ক্যামেরা দেখান' },
      { label: '🦚 ময়ূর লাইভ ক্যামেরা', q: 'আমাকে ময়ূরের লাইভ ক্যামেরা দেখান' },
      { label: '⚪ সাদা বাঘ লাইভ ক্যামেরা', q: 'আমাকে সাদা বাঘের লাইভ ক্যামেরা দেখান' },
      { label: '🛡️ প্যাঙ্গোলিন লাইভ ক্যামেরা', q: 'আমাকে প্যাঙ্গোলিনের লাইভ ক্যামেরা দেখান' },
      { label: '🐊 ঘড়িয়াল লাইভ ক্যামেরা', q: 'আমাকে ঘড়িয়ালের লাইভ ক্যামেরা দেখান' },
      { label: '🐍 কিং কোবরা লাইভ ক্যামেরা', q: 'আমাকে কিং কোবরার লাইভ ক্যামেরা দেখান' },
      { label: '🐢 কাছিম লাইভ ক্যামেরা', q: 'আমাকে কাছিমের লাইভ ক্যামেরা দেখান' },
      { label: '🪶 শামুকখোল লাইভ ক্যামেরা', q: 'আমাকে শামুকখোলের লাইভ ক্যামেরা দেখান' },
      { label: '🐾 সকল প্রাণী সহায়িকা', q: 'নন্দনকাননের সকল প্রাণীর পূর্ণাঙ্গ বিবরণ দিন' },
      { label: '🐅 সাদা বাঘের ইতিহাস', q: 'সাদা বাঘের ইতিহাস সম্পর্কে বলুন' },
      { label: '🦁 সিংহ সাফারি', q: 'এশিয়াটিক সিংহ ও সাফারি সম্পর্কে বলুন' },
      { label: '🐘 এশিয়ান হাতি', q: 'এশিয়ান হাতি সম্পর্কে বলুন' },
      { label: '🛡️ ইন্ডিয়ান প্যাঙ্গোলিন', q: 'ইন্ডিয়ান প্যাঙ্গোলিন প্রজনন কেন্দ্র সম্পর্কে বলুন' },
      { label: '🐊 ঘড়িয়াল কুমির', q: 'ঘড়িয়াল কুমির প্রকল্প সম্পর্কে বলুন' },
      { label: '🐍 কিং কোবরা', q: 'কিং কোবরার কৃত্রিম প্রজনন সম্পর্কে বলুন' },
      { label: '🕒 পরিদর্শনের সময় ও বন্ধের দিন', q: 'নন্দনকাননের সময়সূচী কী?' },
      { label: '🎟️ প্রবেশ ও সাফারি টিকিট ফি', q: 'প্রবেশ ও সাফারি টিকিটের দাম কত?' },
      { label: '🚂 টয় ট্রেন ও রোপওয়ে', q: 'টয় ট্রেন এবং রোপওয়ে সম্পর্কে বলুন' },
      { label: '🚫 প্লাস্টিক ও খাবারের নিয়ম', q: 'প্লাস্টিক ও বাইরের খাবার কি নিষিদ্ধ?' },
      { label: '🚗 নন্দনকানন যাওয়ার পথ', q: 'নন্দনকানন কীভাবে পৌঁছাবো?' }
    ]
  },
  hindi: {
    title: "नंदनकानन AI",
    badge: "AI सहायक",
    status: "अभयारण्य सहायक सक्रिय • हिन्दी",
    welcome: "नमस्कार! मैं आपका नंदनकानन अभयारण्य AI सहायक हूँ। आज आपकी यात्रा, सफारी बुकिंग या वन्यजीव संबंधी पूछताछ में किस प्रकार सहायता कर सकता हूँ?",
    placeholder: "सभी जानवर, लाइव स्ट्रीम, समय, सफारी पूछें...",
    langLabel: "भाषा:",
    prompts: [
      { label: '📹 सभी 12 जानवरों की लाइव स्ट्रीम', q: 'मुझे प्रत्येक जानवर की लाइव स्ट्रीम दिखाएं' },
      { label: '🐅 बाघ का लाइव कैमरा', q: 'मुझे बाघ का लाइव कैमरा दिखाएं' },
      { label: '🦁 शेर का लाइव कैमरा', q: 'मुझे शेर का लाइव कैमरा दिखाएं' },
      { label: '🐘 हाथी का लाइव कैमरा', q: 'मुझे हाथी का लाइव कैमरा दिखाएं' },
      { label: '🦌 हिरण लाइव कैमरा', q: 'मुझे हिरण का लाइव कैमरा दिखाएं' },
      { label: '🐻 भालू लाइव कैमरा', q: 'मुझे भालू का लाइव कैमरा दिखाएं' },
      { label: '🦚 मोर लाइव कैमरा', q: 'मुझे मोर का लाइव कैमरा दिखाएं' },
      { label: '⚪ सफेद बाघ लाइव कैमरा', q: 'मुझे सफेद बाघ का लाइव कैमरा दिखाएं' },
      { label: '🛡️ पैंगोलिन लाइव कैमरा', q: 'मुझे पैंगोलिन का लाइव कैमरा दिखाएं' },
      { label: '🐊 घड़ियाल लाइव कैमरा', q: 'मुझे घड़ियाल का लाइव कैमरा दिखाएं' },
      { label: '🐍 किंग कोबरा लाइव कैमरा', q: 'मुझे किंग कोबरा का लाइव कैमरा दिखाएं' },
      { label: '🐢 कछुआ लाइव कैमरा', q: 'मुझे कछुए का लाइव कैमरा दिखाएं' },
      { label: '🪶 ओपनबिल लाइव कैमरा', q: 'मुझे ओपनबिल का लाइव कैमरा दिखाएं' },
      { label: '🐾 संपूर्ण वन्यजीव गाइड', q: 'नंदनकानन प्राणी उद्यान के सभी जानवरों का विवरण बताएं' },
      { label: '🐅 सफेद बाघ का इतिहास', q: 'सफेद बाघ का इतिहास बताएं' },
      { label: '🦁 एशियाई शेर सफारी', q: 'एशियाई शेर और लॉयन सफारी के बारे में बताएं' },
      { label: '🐘 एशियाई हाथी', q: 'एशियाई हाथी के बारे में बताएं' },
      { label: '🛡️ पैंगोलिन (विश्व रिकॉर्ड)', q: 'भारतीय पैंगोलिन प्रजनन केंद्र के बारे में बताएं' },
      { label: '🐊 घड़ियाल मगरमच्छ', q: 'घड़ियाल मगरमच्छ परियोजना के बारे में बताएं' },
      { label: '🐍 किंग कोबरा नागराज', q: 'किंग कोबरा प्रजनन के बारे में बताएं' },
      { label: '🕒 खुलने का समय व अवकाश', q: 'नंदनकानन खुलने का समय क्या है?' },
      { label: '🎟️ प्रवेश व सफारी टिकट दरें', q: 'टिकट और सफारी का क्या शुल्क है?' },
      { label: '🚂 टॉय ट्रेन व रोपवे', q: 'टॉय ट्रेन और रोपवे के बारे में बताएं' },
      { label: '🚫 प्लास्टिक नियम व भोजन', q: 'क्या प्लास्टिक और बाहर का खाना मना है?' },
      { label: '🚗 नंदनकानन कैसे पहुंचे', q: 'नंदनकानन कैसे पहुँचें?' }
    ]
  }
};

export default function ChatbotWidget({ 
  language = 'english', 
  onOpenTickets, 
  onOpenLiveCam,
  onShowOnMap,
  isLiveModalOpen = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatLang, setChatLang] = useState(language || 'english');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [input, setInput] = useState('');
  const [navBottom, setNavBottom] = useState(72);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const langMenuRef = useRef(null);

  // Measure the bottom edge of the navbar so the chatbot touches the line under Explore Now
  useEffect(() => {
    const updateNavBottom = () => {
      const nav = document.getElementById('main-navbar') || document.querySelector('nav');
      if (nav) {
        const rect = nav.getBoundingClientRect();
        // Exact pixel where the bottom border line of the navbar sits
        setNavBottom(Math.round(rect.bottom));
      }
    };

    updateNavBottom();
    const timer = setTimeout(updateNavBottom, 250);
    window.addEventListener('resize', updateNavBottom);
    window.addEventListener('scroll', updateNavBottom, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateNavBottom);
      window.removeEventListener('scroll', updateNavBottom);
    };
  }, [isOpen]);

  const currentContent = LOCALIZED_CONTENT[chatLang] || LOCALIZED_CONTENT.english;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: (LOCALIZED_CONTENT[language] || LOCALIZED_CONTENT.english).welcome
    }
  ]);

  // Sync external language prop if provided
  useEffect(() => {
    if (language && SUPPORTED_LANGUAGES.some(l => l.id === language)) {
      setChatLang(language);
      const targetContent = LOCALIZED_CONTENT[language] || LOCALIZED_CONTENT.english;
      setMessages([
        {
          id: 1,
          sender: 'bot',
          text: targetContent.welcome
        }
      ]);
    }
  }, [language]);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When user clicks Odia, Bengali, Hindi or English, cleanly switch the entire conversation
  const handleSelectLanguage = (langId) => {
    setChatLang(langId);
    setShowLangMenu(false);
    const selectedContent = LOCALIZED_CONTENT[langId] || LOCALIZED_CONTENT.english;

    // Directly replace previous message(s) so the former language (English) is completely removed!
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: selectedContent.welcome
      }
    ]);
  };

  const getBotResponse = (query, lang) => {
    // 0. ANIMAL KNOWLEDGE BASE (Covers "Every Animal", All Animals Directory, and Individual Species in EN, OD, BN, HI)
    const animalReply = getAnimalBotResponse(query, lang);
    if (animalReply) {
      return animalReply;
    }

    const q = query.toLowerCase();

    // 1. TIMINGS & MONDAY CLOSURE
    if (
      q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('close') || q.includes('monday') ||
      q.includes('ସମୟ') || q.includes('ଖୋଲା') || q.includes('ବନ୍ଦ') || q.includes('ସୋମବାର') ||
      q.includes('সময়') || q.includes('খোলা') || q.includes('বন্ধ') || q.includes('সোমবার') ||
      q.includes('समय') || q.includes('खुला') || q.includes('बंद') || q.includes('सोमवार')
    ) {
      if (lang === 'odia') {
        return "ନନ୍ଦନକାନନ ମଙ୍ଗଳବାରରୁ ରବିବାର ସକାଳ ୦୭:୩୦ ରୁ ଅପରାହ୍ନ ୦୫:୩୦ ପର୍ଯ୍ୟନ୍ତ ଖୋଲା ରହେ। ପ୍ରତ୍ୟେକ ସୋମବାର ପ୍ରାଣୀମାନଙ୍କ ବିଶ୍ରାମ ଓ ଚିକିତ୍ସା ନିରୀକ୍ଷଣ ପାଇଁ ପାର୍କ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ରହେ। ସଫାରୀ ବସ ସକାଳ ୦୯:୦୦ ରୁ ଅପରାହ୍ନ ୦୪:୩୦ ପର୍ଯ୍ୟନ୍ତ ଚାଲେ।";
      }
      if (lang === 'bengali') {
        return "নন্দনকানন মঙ্গলবার থেকে রবিবার সকাল ০৭:৩০ থেকে বিকেল ০৫:৩০ পর্যন্ত খোলা থাকে। প্রতি সোমবার বন্যপ্রাণীদের বিশ্রাম ও চিকিৎসার জন্য পার্ক বন্ধ থাকে। সাফারি বাস সকাল ০৯:০০ থেকে বিকেল ০৪:৩০ পর্যন্ত চলে।";
      }
      if (lang === 'hindi') {
        return "नंदनकानन मंगलवार से रविवार सुबह 07:30 से शाम 05:30 बजे तक खुला रहता है। प्रत्येक सोमवार को वन्यजीवों के विश्राम व चिकित्सा निरीक्षण हेतु पार्क बंद रहता है। सफारी बस सुबह 09:00 से शाम 04:30 बजे तक चलती है।";
      }
      return "Nandankanan is open Tuesday to Sunday from 07:30 AM to 05:30 PM. We are strictly CLOSED EVERY MONDAY for sanctuary rest and animal medical audits. Safaris run continuously from 09:00 AM to 04:30 PM.";
    }

    // 2. TICKET PRICES & TARIFFS
    if (
      q.includes('ticket') || q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('fee') ||
      q.includes('ଟିକେଟ') || q.includes('ଦର') || q.includes('ମୂଲ୍ୟ') ||
      q.includes('টিকিট') || q.includes('ভাড়া') || q.includes('দাম') ||
      q.includes('टिकट') || q.includes('शुल्क') || q.includes('दर')
    ) {
      if (lang === 'odia') {
        return "ପ୍ରବେଶ ଦର: ବୟସ୍କ (୧୨ ବର୍ଷରୁ ଊର୍ଦ୍ଧ୍ୱ): ₹୫୦, ଶିଶୁ (୩-୧୨ ବର୍ଷ): ₹୧୦, ବିଦେଶୀ ପର୍ଯ୍ୟଟକ: ₹୧୦୦। ବାଘ ଓ ସିଂହ ସଫାରୀ: ₹୧୦୦/ଜଣ, ଟଏ ଟ୍ରେନ: ₹୫୦, ଏବଂ କାଞ୍ଜିଆ ହ୍ରଦ ରୋପୱେ: ₹୧୦୦। ଆପଣ ଏହି ୱେବସାଇଟରେ ଡିଜିଟାଲ୍ ଟିକେଟ ବୁକ୍ କରିପାରିବେ!";
      }
      if (lang === 'bengali') {
        return "প্রবেশ ফি: প্রাপ্তবয়স্ক (১২ বছরের ঊর্ধ্বে): ₹৫০, শিশু (৩-১২ বছর): ₹১০, বিদেশি পর্যটক: ₹১০০। বাঘ ও সিংহ সাফারি: ₹১০০/জন, টয় ট্রেন: ₹৫০, এবং কাঞ্জিয়া হ্রদের রোপওয়ে: ₹১০০। আপনি সরাসরি এই ওয়েবসাইটে ডিজিটাল টিকিট বুক করতে পারেন!";
      }
      if (lang === 'hindi') {
        return "प्रवेश शुल्क: वयस्क (12 वर्ष से ऊपर): ₹50, बच्चे (3-12 वर्ष): ₹10, विदेशी नागरिक: ₹100। बाघ व शेर सफारी ₹100/व्यक्ति, टॉय ट्रेन ₹50, और कंजिया झील रोपवे ₹100 है। आप इस वेबसाइट से तुरंत डिजिटल टिकट बुक कर सकते हैं!";
      }
      return "Entry tariffs: Adults (above 12 yrs): ₹50, Children (3-12 yrs): ₹10, Foreigners: ₹100. Tiger & Lion Safari is ₹100/person, Toy Train is ₹50, and Ropeway across Lake Kanjia is ₹100. Fast-track digital passes can be booked directly on this website!";
    }

    // 3. WHITE TIGERS & BREEDING
    if (
      q.includes('white tiger') || q.includes('tiger') || q.includes('deepak') || q.includes('ganga') ||
      q.includes('ଧଳା ବାଘ') || q.includes('ବାଘ') ||
      q.includes('সাদা বাঘ') || q.includes('বাঘ') ||
      q.includes('सफेद बाघ') || q.includes('बाघ')
    ) {
      if (lang === 'odia') {
        return "ନନ୍ଦନକାନନ ୨୮ ଜୁଲାଇ ୧୯୮୦ରେ ଐତିହାସିକ ବିଶ୍ୱ ରେକର୍ଡ କରିଥିଲା, ଯେତେବେଳେ ସାଧାରଣ ବାଘ ଦୀପକ ଓ ଗଙ୍ଗାଙ୍କ ଠାରୁ ପ୍ରଥମ ଧଳା ବାଘ ଛୁଆ ଜନ୍ମ ହୋଇଥିଲା। ବର୍ତ୍ତମାନ ଆପଣ ସେକ୍ଟର-ଏ ଏବଂ ଓପନ୍ ଟାଇଗର ସଫାରୀରେ ଆମର ମହିମାନ୍ୱିତ ଧଳା ବାଘମାନଙ୍କୁ ଦେଖିପାରିବେ।";
      }
      if (lang === 'bengali') {
        return "২৮ জুলাই ১৯৮০ সালে নন্দনকানন বিশ্ব ইতিহাস সৃষ্টি করে যখন সাধারণ বাঘ দীপক ও গঙ্গা খাঁচায় বিশ্বের প্রথম সাদা বাঘের জন্ম দেয়! বর্তমানে আপনি সেক্টর-এ এবং উন্মুক্ত টাইগার সাফারিতে আমাদের সাদা বাঘ দেখতে পাবেন।";
      }
      if (lang === 'hindi') {
        return "28 जुलाई 1980 को नंदनकानन ने विश्व इतिहास रचा जब सामान्य रॉयल बंगाल बाघ दीपक और गंगा ने पहली बार सफेद शावकों को जन्म दिया। आज आप सेक्टर-ए और ओपन टाइगर सफारी में सफेद बाघों को देख सकते हैं।";
      }
      return "Nandankanan made global history on July 28, 1980 when normal tawny tigers Deepak and Ganga gave birth to the world's first white tiger litter in captivity! Today, you can observe our magnificent white tigers in Sector A and in the open Tiger Safari.";
    }

    // 4. SAFARIS (TIGER, LION, BEAR)
    if (
      q.includes('safari') || q.includes('bus') || q.includes('lion') ||
      q.includes('ସଫାରୀ') || q.includes('ସିଂହ') || q.includes('ଭାଲୁ') ||
      q.includes('সাফারি') || q.includes('সিংহ') || q.includes('ভাল্লুক') ||
      q.includes('सफारी') || q.includes('शेर') || q.includes('भालू')
    ) {
      if (lang === 'odia') {
        return "ଆମର ସୁରକ୍ଷିତ ସଫାରୀ ବସଗୁଡ଼ିକ ଆପଣଙ୍କୁ ବିଶାଳ ପ୍ରାକୃତିକ ଜଙ୍ଗଲ ଏନକ୍ଲୋଜର ଭିତରକୁ ନେଇଯାଏ ଯେଉଁଠାରେ ରୟାଲ ବେଙ୍ଗଲ ଟାଇଗର, ଏସିଆଟିକ ସିଂହ ଓ ଭାଲୁ ସ୍ୱଚ୍ଛନ୍ଦରେ ବିଚରଣ କରନ୍ତି। ସଫାରୀ ସକାଳ ୦୯:୦୦ ରୁ ଅପରାହ୍ନ ୦୪:୩୦ ପର୍ଯ୍ୟନ୍ତ ନିରନ୍ତର ଚାଲେ।";
      }
      if (lang === 'bengali') {
        return "আমাদের সুরক্ষিত সাফারি বাসগুলো আপনাকে বিশাল প্রাকৃতিক শাল বনের খাঁচায় নিয়ে যায় যেখানে রয়্যাল বেঙ্গল টাইগার, এশিয়াটিক সিংহ ও ভাল্লুক মুক্তভাবে ঘুরে বেড়ায়। সাফারি সকাল ০৯:০০ থেকে বিকেল ০৪:৩০ পর্যন্ত চলে।";
      }
      if (lang === 'hindi') {
        return "हमारी सुरक्षित सफारी बसें आपको विशाल प्राकृतिक वनों में ले जाती हैं जहाँ रॉयल बंगाल टाइगर, एशियाई शेर और भालू खुले में विचरण करते हैं। सफारी बस सेवा सुबह 09:00 से शाम 04:30 बजे तक लगातार उपलब्ध है।";
      }
      return "Our protected safari buses take you inside large natural enclosures where Royal Bengal Tigers, Asiatic Lions, and Sloth Bears roam free in natural deciduous forests. Safari buses operate continuously from 09:00 AM to 04:30 PM.";
    }

    // 5. TOY TRAIN & ROPEWAY
    if (
      q.includes('train') || q.includes('ropeway') || q.includes('lake') || q.includes('kanjia') ||
      q.includes('ଟ୍ରେନ') || q.includes('ରୋପୱେ') || q.includes('ହ୍ରଦ') || q.includes('କାଞ୍ଜିଆ') ||
      q.includes('টয় ট্রেন') || q.includes('রোপওয়ে') || q.includes('হ্রদ') || q.includes('কাঞ্জিয়া') ||
      q.includes('ट्रेन') || q.includes('रोपवे') || q.includes('झील') || q.includes('कंजिया')
    ) {
      if (lang === 'odia') {
        return "ସୁନ୍ଦର ଖେଳଣା ଟ୍ରେନ୍ ଜଙ୍ଗଲ ଦେଇ ୨.୫ କିଲୋମିଟର ପର୍ଯ୍ୟନ୍ତ ଚାଲେ (ଟିକେଟ ₹୫୦)। ୬୨୮ ମିଟର ଦୀର୍ଘ ରୋପୱେ ଐତିହାସିକ କାଞ୍ଜିଆ ହ୍ରଦ ଉପରେ ଆକାଶମାର୍ଗର ଚମତ୍କାର ଦୃଶ୍ୟ ପ୍ରଦାନ କରେ (ଟିକେଟ ₹୧୦୦)।";
      }
      if (lang === 'bengali') {
        return "মনোরম টয় ট্রেন বনের মধ্য দিয়ে ২.৫ কিমি পথ অতিক্রম করে (টিকিট ₹৫০)। ৬২৮ মিটার দীর্ঘ রোপওয়ে ঐতিহাসিক কাঞ্জিয়া হ্রদের ওপর দিয়ে দুর্দান্ত আকাশপথের দৃশ্য দেখায় (টিকিট ₹১০০)।";
      }
      if (lang === 'hindi') {
        return "मनोरम टॉय ट्रेन घने जंगलों से होकर 2.5 किमी चलती है (टिकट ₹50)। 628 मीटर लंबा रोपवे प्रसिद्ध कंजिया झील के ऊपर से विहंगम दृश्य दिखाता है (टिकट ₹100)।";
      }
      return "The scenic Toy Train runs 2.5 km through lush woodlands (₹50/ticket). The 628-meter Monocable Ropeway glides high above scenic Lake Kanjia with bird's-eye views (₹100/ticket).";
    }

    // 6. ZERO PLASTIC & REFRESHMENTS
    if (
      q.includes('plastic') || q.includes('food') || q.includes('bottle') || q.includes('rule') ||
      q.includes('ପ୍ଲାଷ୍ଟିକ') || q.includes('ଖାଦ୍ୟ') || q.includes('ନିୟମ') ||
      q.includes('প্লাস্টিক') || q.includes('খাবার') || q.includes('নিয়ম') ||
      q.includes('प्लास्टिक') || q.includes('खाना') || q.includes('नियम')
    ) {
      if (lang === 'odia') {
        return "ନନ୍ଦନକାନନ ଏକ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ଲାଷ୍ଟିକ-ମୁକ୍ତ ଇକୋ-ଅଭୟାରଣ୍ୟ! ବନ୍ୟଜନ୍ତୁଙ୍କ ସୁରକ୍ଷା ପାଇଁ ପ୍ଲାଷ୍ଟିକ ବୋତଲ, ପଲିଥିନ ବ୍ୟାଗ ଓ ବାହାର ରନ୍ଧା ଖାଦ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ନିଷେଧ। ପ୍ରତି ୨୦୦ ମିଟରରେ ଶୀତଳ ବିଶୁଦ୍ଧ ପାନୀୟ ଜଳ ମାଗଣାରେ ଉପଲବ୍ଧ।";
      }
      if (lang === 'bengali') {
        return "নন্দনকানন একটি কঠোর প্লাস্টিক-মুক্ত ইকো-অভয়ারণ্য! বন্যপ্রাণীদের সুরক্ষায় একবার ব্যবহারযোগ্য প্লাস্টিক বোতল, পলিথিন ব্যাগ এবং বাইরের রান্না করা খাবার নিষিদ্ধ। প্রতি ২০০ মিটারে বিনামূল্যে বিশুদ্ধ পানীয় জল পাওয়া যায়।";
      }
      if (lang === 'hindi') {
        return "नंदनकानन एक पूर्णतः प्लास्टिक-मुक्त इको-अभयारण्य है! वन्यजीवों की सुरक्षा के लिए सिंगल-यूज़ प्लास्टिक बोतलें, पॉलिथीन और बाहर का भोजन प्रतिबंधित है। प्रत्येक 200 मीटर पर निःशुल्क शुद्ध शीतल पेयजल उपलब्ध है।";
      }
      return "Nandankanan is a strict Zero-Plastic Eco-Sanctuary! Single-use plastic bottles, poly bags, and outside cooked food are prohibited to protect wildlife. Free chilled purified water stations are available every 200 meters.";
    }

    // 7. LOCATION & HOW TO REACH
    if (
      q.includes('reach') || q.includes('station') || q.includes('airport') || q.includes('route') || q.includes('location') ||
      q.includes('ବାଟ') || q.includes('ରାସ୍ତା') || q.includes('ଷ୍ଟେସନ') || q.includes('ବିମାନବନ୍ଦର') ||
      q.includes('পথ') || q.includes('স্টেশন') || q.includes('বিমানবন্দর') || q.includes('যাব') ||
      q.includes('रास्ता') || q.includes('स्टेशन') || q.includes('हवाई अड्डा') || q.includes('पहुंच')
    ) {
      if (lang === 'odia') {
        return "ନନ୍ଦନକାନନ ବାରଙ୍ଗରେ ଅବସ୍ଥିତ, ଯାହା ଭୁବନେଶ୍ୱର ରେଳ ଷ୍ଟେସନ (BBS) ଠାରୁ ୧୮ କିମି ଏବଂ ବିଜୁ ପଟ୍ଟନାୟକ ବିମାନବନ୍ଦର (BBI) ଠାରୁ ୨୦ କିମି ଦୂରରେ। CRUT Mo Bus ରୁଟ୍ ୧୦ ଏବଂ ୧୧ ସିଧାସଳଖ ଚିଡ଼ିଆଖାନାର ମୁଖ୍ୟ ଫାଟକ ପର୍ଯ୍ୟନ୍ତ ଆସିଥାଏ।";
      }
      if (lang === 'bengali') {
        return "নন্দনকানন বারঙ্গে অবস্থিত, যা ভুবনেশ্বর রেলওয়ে স্টেশন (BBS) থেকে ১৮ কিমি এবং বিজু পট্টনায়েক আন্তর্জাতিক বিমানবন্দর (BBI) থেকে ২০ কিমি দূরে। CRUT Mo Bus রুট ১০ এবং ১১ সরাসরি চিড়িয়াখানার প্রধান গেটে থামে।";
      }
      if (lang === 'hindi') {
        return "नंदनकानन बारंग में स्थित है, जो भुवनेश्वर रेलवे स्टेशन (BBS) से 18 किमी और बीजू पटनायक हवाई अड्डे (BBI) से 20 किमी दूर है। CRUT Mo Bus रूट 10 और 11 सीधे चिड़ियाघर के मुख्य द्वार तक चलती हैं।";
      }
      return "Located in Baranga, Nandankanan is 18 km north of Bhubaneswar Railway Station (BBS) and 20 km from Biju Patnaik Airport (BBI). CRUT Mo Bus Routes 10 and 11 terminate directly at the Zoo Main Gate.";
    }

    // FALLBACK
    if (lang === 'odia') {
      return "ପଚାରିଥିବାରୁ ଧନ୍ୟବାଦ! ନନ୍ଦନକାନନ ୪୩୭ ହେକ୍ଟର ପରିବ୍ୟାପ୍ତ ଏକ ପ୍ରାକୃତିକ ବନ୍ୟପ୍ରାଣୀ ସଂରକ୍ଷଣ ସ୍ଥଳୀ, ଯେଉଁଠାରେ ୧୫୬ରୁ ଅଧିକ ପ୍ରଜାତି ବାସ କରନ୍ତି। ଆପଣ ଉପରସ୍ଥ ଇଣ୍ଟରାକ୍ଟିଭ୍ ମ୍ୟାପ୍ ଓ ଲାଇଭ୍ କ୍ୟାମେରା ଷ୍ଟ୍ରିମ୍ ମଧ୍ୟ ଉପଭୋଗ କରିପାରିବେ!";
    }
    if (lang === 'bengali') {
      return "জিজ্ঞাসা করার জন্য ধন্যবাদ! নন্দনকানন ৪৩৭ হেক্টর জুড়ে অবস্থিত এক অপূর্ব বন্যপ্রাণী অভয়ারণ্য, যা ১৫৬টিরও বেশি প্রজাতির আবাসস্থল। আপনি ওয়েবসাইটের ইন্টারেক্টিভ ম্যাপ বা লাইভ ক্যামেরা দেখতে পারেন!";
    }
    if (lang === 'hindi') {
      return "पूछने के लिए धन्यवाद! नंदनकानन 437 हेक्टेयर में फैला एक विश्वप्रसिद्ध वन्यजीव अभयारण्य है, जिसमें 156 से अधिक प्रजातियां वास करती हैं। आप ऊपर दिए गए लाइव कैमरा और मैप का भी आनंद ले सकते हैं!";
    }
    return "Thank you for asking! Nandankanan encompasses 437 hectares of pristine wilderness, home to 156+ species. You can explore the interactive zoo map or watch live feeds in the sections above!";
  };

  const handleLiveCamAction = (actionBtn) => {
    // Immediately close/hide the chatbot window so it does not overlap the live cam screen
    setIsOpen(false);

    const camId = actionBtn.cameraId || (actionBtn.cameraObj && actionBtn.cameraObj.id) || 1;
    const targetCam = INITIAL_CAMERAS.find(c => c.id === camId) || actionBtn.cameraObj || INITIAL_CAMERAS[0];

    if (onOpenLiveCam) {
      onOpenLiveCam(targetCam);
    } else {
      const el = document.getElementById('live-wildlife');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMapRegionAction = (actionBtn) => {
    // Immediately close/hide the chatbot window so user has full view of the 3D map
    setIsOpen(false);

    if (onShowOnMap) {
      onShowOnMap(actionBtn.markerObj || actionBtn.markerId);
    } else {
      const el = document.getElementById('zoo-map-viewport') || document.getElementById('interactive-map');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    const botReply = getBotResponse(text, chatLang);

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const isObj = typeof botReply === 'object' && botReply !== null;
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: isObj ? botReply.text : botReply,
        actionButton: isObj ? botReply.actionButton : null,
        actionButtons: isObj ? botReply.actionButtons : null
      }]);
    }, 350);
  };

  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.id === chatLang) || SUPPORTED_LANGUAGES[0];

  // Global modal state tracking (e.g. WalletModal, NewsNoticeModal, AuthModal)
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);

  useEffect(() => {
    const handleModalEvent = (e) => {
      setIsExternalModalOpen(Boolean(e.detail?.open));
    };
    window.addEventListener('nkz_modal_state_change', handleModalEvent);
    return () => window.removeEventListener('nkz_modal_state_change', handleModalEvent);
  }, []);

  // Completely invisible on the screen while any full modal is showing (prevents overlap with Done button)
  if (isLiveModalOpen || isExternalModalOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button (when minimized) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group px-4 py-2.5 rounded-full bg-gradient-to-r from-[#123D2B] via-[#1A5C38] to-[#123D2B] hover:from-[#1A5C38] hover:to-[#26734D] text-white shadow-2xl flex items-center gap-2.5 border border-[#C8A96B]/50 transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(200,169,107,0.35)]"
            title="Open Nandankanan AI Assistant"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden border border-white/40">
                <img 
                  src="/images/nandankanan_logo.png" 
                  alt="Nandankanan Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-white leading-tight">
                {currentContent.title}
              </span>
              <span className="text-[9px] text-[#A7D7A9] font-mono leading-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {currentContent.badge} • {currentLangObj.code}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Modal (Touches the line under Explore Now) */}
      {isOpen && (
        <div 
          className="fixed right-3 sm:right-6 z-50 transition-all duration-200"
          style={{
            top: `${navBottom}px`,
            bottom: '16px',
            width: 'min(410px, calc(100vw - 24px))'
          }}
        >
          <div className="w-full h-full rounded-b-3xl rounded-t-xl bg-[#071D12] border border-[#2E7D32]/70 border-t-[#C8A96B]/60 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-scaleUp text-[#F4F1E8]">
            
            {/* Header */}
            <div className="p-3.5 bg-gradient-to-r from-[#0B2A1A] via-[#0E3520] to-[#0B2A1A] text-white flex items-center justify-between border-b border-[#2E7D32]/50 relative z-20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-[#C8A96B]/60 shadow-[0_0_15px_rgba(200,169,107,0.25)] flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/nandankanan_logo.png" 
                    alt="Nandankanan Official Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* AI Badge on Icon */}
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-[#F28C1B] to-[#C8A96B] text-[7.5px] font-black text-[#071D12] rounded leading-none shadow tracking-wider border border-[#071D12]">
                  AI
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                    {currentContent.title}
                  </h4>
                  <span className="px-1.5 py-0.5 text-[8px] font-black font-mono uppercase tracking-wider bg-[#F28C1B]/20 text-[#F28C1B] border border-[#F28C1B]/40 rounded-full flex items-center gap-1">
                    <Compass className="w-2.5 h-2.5" />
                    {currentContent.badge}
                  </span>
                </div>
                <span className="text-[10px] text-[#A7D7A9] flex items-center gap-1.5 font-mono mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentContent.status}
                </span>
              </div>
            </div>

            {/* Header Right Actions: Language Switcher & Close */}
            <div className="flex items-center gap-1.5">
              
              {/* Language Switcher Dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#123D2B] hover:bg-[#1A5C38] text-[#C8A96B] hover:text-[#FDE047] flex items-center gap-1 text-[11px] font-bold font-mono transition-all border border-[#C8A96B]/40 shadow-sm"
                  title="Change Language (English, ଓଡ଼ିଆ, বাংলা, हिन्दी)"
                >
                  <Globe className="w-3.5 h-3.5 text-[#F28C1B]" />
                  <span className="text-white text-[10px] uppercase tracking-wider font-bold">
                    {currentLangObj.code}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#C8A96B] transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-[#071D12] border border-[#C8A96B]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-1.5 z-50 flex flex-col gap-1 backdrop-blur-xl animate-scaleUp">
                    <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#A7D7A9]/70 border-b border-white/10 font-mono flex items-center gap-1">
                      <Languages className="w-3 h-3 text-[#F28C1B]" />
                      Select Language
                    </div>
                    {SUPPORTED_LANGUAGES.map(lang => {
                      const isActive = chatLang === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.id)}
                          className={`w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                            isActive
                              ? 'bg-[#14532D] text-[#FDE047] border border-[#C8A96B]/50 shadow-sm'
                              : 'text-[#F4F1E8] hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.native}</span>
                            <span className="text-[10px] text-[#A7D7A9]/60">({lang.name})</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-[#FDE047]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div ref={messagesContainerRef} className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3.5 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-white p-0.5 border border-[#C8A96B]/50 flex-shrink-0 flex items-center justify-center shadow-md mt-0.5 overflow-hidden">
                    <img 
                      src="/images/nandankanan_logo.png" 
                      alt="Nandankanan" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#14532D] text-white rounded-br-none border border-[#2E7D32]/40 shadow-sm'
                      : 'bg-[#0B2A1A] border border-[#2E7D32]/40 text-[#F4F1E8] shadow-md rounded-bl-none font-sans'
                  }`}
                >
                  <div>{m.text}</div>
                  {m.actionButton && m.actionButton.type === 'map_region' && (
                    <div className="mt-3 pt-2.5 border-t border-[#2E7D32]/40 space-y-2">
                      {/* Habitat Region Preview Mini Card */}
                      {m.actionButton.preview && (
                        <div className="p-2.5 rounded-xl bg-[#071D12]/90 border border-[#C8A96B]/30 flex items-center gap-3 shadow-inner">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#C8A96B]/50 shrink-0">
                            <img 
                              src={m.actionButton.preview.photo} 
                              alt={m.actionButton.preview.title}
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute bottom-0.5 right-0.5 text-xs">
                              {m.actionButton.preview.emoji}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-bold text-[11px] text-[#FAF9F5] truncate">
                                {m.actionButton.preview.title}
                              </h4>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C8A96B]/20 text-[#C8A96B] font-mono whitespace-nowrap">
                                3D BEACON
                              </span>
                            </div>
                            <p className="text-[10px] text-[#A7D7A9] font-mono truncate mt-0.5">
                              📍 {m.actionButton.preview.zone}
                            </p>
                            <p className="text-[9px] text-[#FAF9F5]/70 font-mono truncate">
                              🛰️ {m.actionButton.preview.coords}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Interactive Button */}
                      <button
                        type="button"
                        onClick={() => handleMapRegionAction(m.actionButton)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-between gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-amber-300/40 cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
                          </span>
                          <Compass className="w-4 h-4 text-amber-200" />
                          <span className="font-mono font-black uppercase tracking-wider text-[11px]">
                            {m.actionButton.label}
                          </span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-amber-200 font-mono flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>3D EARTH</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Multiple Individual Animal Live Stream Buttons (All 12 Sanctuary Animals) */}
                  {m.actionButtons && Array.isArray(m.actionButtons) && m.actionButtons.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#2E7D32]/40 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#A7D7A9] font-bold">
                        <span className="flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                          <span>ALL 12 INDIVIDUAL ANIMAL LIVE STREAMS:</span>
                        </span>
                        <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40">
                          12 CAMS LIVE
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                        {m.actionButtons.map((btn, idx) => (
                          <button
                            key={btn.cameraId || idx}
                            type="button"
                            onClick={() => handleLiveCamAction(btn)}
                            className="p-2 rounded-xl bg-[#071D12] hover:bg-[#123D2B] border border-[#2E7D32]/60 hover:border-red-500/80 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:scale-[1.02] cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5 mb-1 min-w-0">
                              <span className="text-sm shrink-0">{btn.cameraObj?.emoji || '📹'}</span>
                              <span className="font-bold text-[10.5px] text-white group-hover:text-amber-200 truncate leading-tight">
                                {btn.cameraObj?.animal_name || btn.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] font-mono text-[#A7D7A9]/80 border-t border-white/5 pt-1">
                              <span className="truncate">{btn.subLabel || `Cam #${btn.cameraId}`}</span>
                              <span className="text-red-400 font-bold shrink-0 flex items-center gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-red-400 animate-ping inline-block" />
                                LIVE
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Individual Animal Live Stream Action with Rich Preview Card */}
                  {m.actionButton && m.actionButton.type === 'live_cam' && (
                    <div className="mt-3 pt-2.5 border-t border-[#2E7D32]/40 space-y-2">
                      {/* Animal Live Camera Mini Preview Card */}
                      {m.actionButton.cameraObj && (
                        <div className="p-2.5 rounded-xl bg-[#071D12]/95 border border-red-500/40 flex items-center gap-3 shadow-inner">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-red-500/60 shrink-0 bg-black">
                            <img 
                              src={m.actionButton.cameraObj.thumbnail_url || '/images/sanctuary_forest.jpg'} 
                              alt={m.actionButton.cameraObj.animal_name || 'Live Stream'}
                              className="w-full h-full object-cover" 
                            />
                            <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-red-600 text-white font-black text-[7.5px] uppercase tracking-wider flex items-center gap-0.5 shadow">
                              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                            <span className="absolute bottom-0.5 right-0.5 text-xs">
                              {m.actionButton.cameraObj.emoji || '📹'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-bold text-[11px] text-[#FAF9F5] truncate">
                                {m.actionButton.cameraObj.animal_name}
                              </h4>
                              <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 font-mono border border-red-500/30 whitespace-nowrap flex items-center gap-1">
                                <span>👁</span>
                                {m.actionButton.cameraObj.viewer_count ? `${m.actionButton.cameraObj.viewer_count.toLocaleString()} watching` : 'LIVE'}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#A7D7A9] font-mono truncate mt-0.5">
                              📍 {m.actionButton.cameraObj.habitat_name || m.actionButton.cameraObj.camera_location || 'Sanctuary Zone'}
                            </p>
                            <p className="text-[9px] text-[#C8A96B] font-mono truncate">
                              📹 {m.actionButton.cameraObj.title || 'Official Surveillance Feed'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Glowing Live Stream Action Button */}
                      <button
                        type="button"
                        onClick={() => handleLiveCamAction(m.actionButton)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 flex items-center justify-between gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-amber-300/40 cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                          </span>
                          <Tv className="w-4 h-4 text-white" />
                          <span className="font-mono font-black uppercase tracking-wider text-[11px]">
                            {m.actionButton.label}
                          </span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-black/30 text-[9px] text-amber-200 font-mono flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>OPEN STREAM</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0B2A1A] border-t border-[#2E7D32]/40 flex items-center gap-2 shrink-0"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={currentContent.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#071D12] border border-[#2E7D32]/40 text-xs text-white placeholder:text-[#A7D7A9]/40 focus:outline-none focus:border-[#C8A96B] transition-colors"
              />
              <Compass className="w-3.5 h-3.5 text-[#C8A96B]/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-[#14532D] to-[#2E7D32] hover:from-[#1b5e3c] hover:to-[#388E3C] disabled:opacity-40 text-white transition-all shadow-md"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    )}

  </>
);
}
