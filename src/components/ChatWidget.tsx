import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Mic, MicOff, Loader2, Bot, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { useVoiceAgent } from '@/src/hooks/useVoiceAgent';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hello! I\'m your Tecson Media assistant. How can I help you with your real estate photography needs today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { isActive: isVoiceActive, isConnecting: isVoiceConnecting, startVoice, stopVoice } = useVoiceAgent();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are the Tecson Media Toronto AI assistant. You help users book real estate photography sessions. Be professional, friendly, and efficient. You can answer questions about pricing, services, and turnaround times. You can also guide users through the booking process.",
        }
      });

      const modelMessage: Message = { role: 'model', content: response.text || "I'm sorry, I couldn't process that." };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-3xl border border-dark/5 bg-white shadow-2xl dark:border-white/10 dark:bg-dark"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-dark p-6 text-white dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gold p-2 text-dark">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg">Tecson Media AI</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold">Online & Ready</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-60 hover:opacity-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "rounded-full p-2 h-8 w-8 flex items-center justify-center",
                    m.role === 'user' ? "bg-gold text-dark" : "bg-dark/5 dark:bg-white/5 text-gold"
                  )}>
                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-gold text-dark rounded-tr-none" 
                      : "bg-dark/5 dark:bg-white/5 text-dark dark:text-paper rounded-tl-none"
                  )}>
                    <div className="prose prose-sm dark:prose-invert">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="rounded-full bg-dark/5 p-2 dark:bg-white/5 text-gold">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-dark/5 p-4 dark:bg-white/5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-dark/5 p-6 dark:border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={isVoiceActive ? stopVoice : startVoice}
                  disabled={isVoiceConnecting}
                  className={cn(
                    "rounded-full p-3 transition-all",
                    isVoiceActive 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-dark/5 text-dark hover:bg-gold dark:bg-white/5 dark:text-paper dark:hover:bg-gold dark:hover:text-dark"
                  )}
                >
                  {isVoiceConnecting ? <Loader2 className="h-5 w-5 animate-spin" /> : isVoiceActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isVoiceActive ? "Listening..." : "Type your message..."}
                    className="w-full rounded-full border border-dark/10 bg-transparent py-3 pl-6 pr-12 text-sm focus:border-gold focus:outline-none dark:border-white/10"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-gold hover:bg-gold/10"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {isVoiceActive && (
                <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-red-500">Voice Mode Active</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-dark text-gold shadow-2xl dark:bg-paper dark:text-dark"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </motion.button>
    </div>
  );
}
