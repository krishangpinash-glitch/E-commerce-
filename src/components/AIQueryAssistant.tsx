import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Bot, Sparkles, ShoppingBag } from 'lucide-react';
import { PhoneSettings } from '../types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  isMock?: boolean;
}

interface AIChatbotProps {
  onClose: () => void;
  settings: PhoneSettings;
  onNavigateToTab?: (tab: string, productId?: string) => void;
  onAddNotification?: (title: string, body: string, app: string) => void;
  onIncrementPoints?: (pts: number) => void;
}

export const AIQueryAssistant: React.FC<AIChatbotProps> = ({
  onClose,
  settings,
  onNavigateToTab,
  onAddNotification,
  onIncrementPoints
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: '👋 Hi! I\'m Sora, your personalized Smart Shopper AI.\n\nAsk me about specs, compare deals, or seek eco-friendly items in our catalog (like custom eco-phones or hoodies!). How can I guide you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const chips = [
    { text: 'Compare Phones', prompt: 'Which smartphone in the catalog runs faster and is more eco-friendly?' },
    { text: 'Green Products', prompt: 'Tell me about the carbon savings and EcoScore details of your items.' },
    { text: 'Any Coupon Codes?', prompt: 'Are there any discount code coupons I can use during checkout?' }
  ];

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      const data = await res.json();
      
      const aiMsg: Message = { 
        sender: 'ai', 
        text: data.text || 'I had trouble formulating a response. Would you please try again?',
        isMock: data.isMock
      };
      
      setMessages((prev) => [...prev, aiMsg]);

      // Unlock "Savvy Researcher" achievement if applicable
      if (onIncrementPoints) {
        onIncrementPoints(50); // triggers checking achievements
      }
    } catch (err) {
      setMessages((prev) => [...prev, { 
        sender: 'ai', 
        text: '⚠️ I had trouble connecting. Here is a helpful fallback tip: Take a look at our circular **EcoNexus Lite SE** phone ($499) which features modular repairable pieces!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans" id="app-ai-chatbot">
      {/* Search Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/35 text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-white font-display flex items-center gap-1">
              Sora Shopper <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            </h4>
            <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">AI Shopping Advisor</span>
          </div>
        </div>

        {/* Catalog shortcut */}
        <button
          onClick={() => onNavigateToTab?.('store')}
          className="p-1.5 rounded-xl border border-slate-800 bg-slate-905 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Browse Store"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Main Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 phone-scroll">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[85%] text-left ${m.sender === 'user' ? 'self-end' : 'self-start'}`}
          >
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-950 text-slate-200 border border-slate-805 rounded-tl-none'
              }`}
            >
              {/* Parse nested newlines to simple line break renders */}
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
            {m.isMock && (
              <span className="text-[8px] text-slate-500 font-mono mt-1 text-right">
                ⚡ rule-based backup mode
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="self-start flex items-center gap-2 bg-slate-950 border border-slate-805 p-3 rounded-2xl rounded-tl-none">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      {/* Input container */}
      <div className="p-3 bg-slate-950 border-t border-slate-850 sticky bottom-0">
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1.5 text-[10px] phone-scroll scrollbar-none">
            {chips.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(c.prompt)}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-400/40 text-slate-350 px-3 py-1.5 rounded-full whitespace-nowrap active:scale-95 transition"
              >
                {c.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Sora anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(input);
            }}
            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500/80 transition shadow-inner placeholder-slate-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-emerald-500 text-slate-950 rounded-2xl hover:bg-emerald-400 active:scale-95 transition disabled:opacity-40 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
