import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronRight,
  Compass,
  Ticket
} from 'lucide-react';

export default function ChatbotWidget({ language, onOpenTickets }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: language === 'odia' 
        ? 'ନମସ୍କାର! ମୁଁ ନନ୍ଦନକାନନ ଭର୍ଚୁଆଲ ସହାୟକ। ଆପଣଙ୍କୁ ପରିଦର୍ଶନ, ସଫାରୀ କିମ୍ବା ବନ୍ୟପ୍ରାଣୀ ସମ୍ପର୍କରେ କି ସାହାଯ୍ୟ କରିପାରିବି?'
        : 'Namaskar! I am your Nandankanan Sanctuary Assistant. How may I assist your visit, safari booking, or wildlife inquiry today?'
    }
  ]);

  const quickPrompts = [
    { label: '🕒 Visiting Hours & Closed Days', q: 'What are the visiting hours?' },
    { label: '🎟️ Entry & Safari Ticket Prices', q: 'How much are the entry tickets and safaris?' },
    { label: '🐅 White Tigers Location', q: 'Where are the white tigers located?' },
    { label: '🚂 Toy Train & Ropeway', q: 'Tell me about the toy train and ropeway' },
    { label: '🚫 Plastic Rules & Food', q: 'Are plastic bottles and outside food allowed?' },
  ];

  const getBotResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('close') || q.includes('monday')) {
      return "Nandankanan is open Tuesday to Sunday from 07:30 AM to 05:30 PM. We are strictly CLOSED EVERY MONDAY for sanctuary rest and animal medical audits. Safaris run from 09:00 AM to 04:30 PM.";
    }
    if (q.includes('ticket') || q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('fee')) {
      return "Entry tariffs: Adults (above 12 yrs): ₹50, Children (3-12 yrs): ₹10, Foreigners: ₹100. Tiger & Lion Safari is ₹100/person, Toy Train is ₹50, and Ropeway across Lake Kanjia is ₹100. You can book fast-track digital passes directly on this website!";
    }
    if (q.includes('white tiger') || q.includes('tiger') || q.includes('deepak') || q.includes('ganga')) {
      return "Nandankanan made global history on July 28, 1980 when normal tawny tigers Deepak and Ganga gave birth to the world's first white tiger litter in captivity! Today, you can observe our magnificent white tigers in Sector A and in the open Tiger Safari.";
    }
    if (q.includes('safari') || q.includes('bus') || q.includes('lion')) {
      return "Our protected safari buses take you inside large natural enclosures where Royal Bengal Tigers, Asiatic Lions, and Sloth Bears roam free in natural deciduous forests. Safari buses operate continuously from 09:00 AM to 04:30 PM.";
    }
    if (q.includes('train') || q.includes('ropeway') || q.includes('lake') || q.includes('ride')) {
      return "The scenic Toy Train runs 2.5 km through lush woodlands (₹50/ticket). The 628-meter Monocable Ropeway glides high above scenic Lake Kanjia with bird's-eye views (₹100/ticket).";
    }
    if (q.includes('plastic') || q.includes('food') || q.includes('bottle') || q.includes('rule')) {
      return "Nandankanan is a strict Zero-Plastic Eco-Sanctuary! Single-use plastic bottles, poly bags, and outside cooked food are prohibited to protect wildlife. Free chilled purified water stations are available every 200 meters.";
    }
    if (q.includes('reach') || q.includes('bus') || q.includes('station') || q.includes('airport') || q.includes('route')) {
      return "Located in Baranga, Nandankanan is 18 km north of Bhubaneswar Railway Station (BBS) and 20 km from the Biju Patnaik Airport (BBI). CRUT Mo Bus Routes 10 and 11 terminate directly at the Zoo Main Gate.";
    }
    return "Thank you for asking! Nandankanan encompasses 437 hectares of pristine wilderness, home to 156+ species. You can explore the interactive zoo map or watch live feeds in the sections above!";
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    const replyText = getBotResponse(text);

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText
      }]);
    }, 400);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group px-5 py-3.5 rounded-full bg-[#14532D] hover:bg-[#2E7D32] text-white shadow-2xl flex items-center gap-3 border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#F28C1B]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            Ask Nandankanan
          </span>
        </button>
      )}

      {/* Floating Chat Modal (Deep Forest Styled) */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl bg-[#071D12] border border-[#2E7D32]/50 shadow-2xl flex flex-col overflow-hidden animate-scaleUp text-[#F4F1E8]">
          
          {/* Header */}
          <div className="p-4 bg-[#0B2A1A] text-white flex items-center justify-between border-b border-[#2E7D32]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#14532D] flex items-center justify-center text-[#F28C1B] border border-[#2E7D32]/50">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Ask Nandankanan
                </h4>
                <span className="text-[10px] text-[#A7D7A9] flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Sanctuary Guide Active
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#14532D] flex-shrink-0 flex items-center justify-center text-[10px] text-white mt-0.5">
                    🐾
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    m.sender === 'user'
                      ? 'bg-[#14532D] text-white rounded-br-none border border-[#2E7D32]/40'
                      : 'bg-[#0B2A1A] border border-[#2E7D32]/30 text-[#F4F1E8] shadow-md rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="p-2 bg-[#0B2A1A]/90 border-t border-[#2E7D32]/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.q)}
                className="px-2.5 py-1 rounded-full bg-[#071D12] hover:bg-[#14532D] text-[10px] font-semibold text-[#A7D7A9] border border-[#2E7D32]/30 whitespace-nowrap transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0B2A1A] border-t border-[#2E7D32]/40 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question about timings, safaris, animals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#071D12] border border-[#2E7D32]/40 text-xs text-white placeholder:text-[#A7D7A9]/40 focus:outline-none focus:border-[#F28C1B]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-[#14532D] hover:bg-[#2E7D32] disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

