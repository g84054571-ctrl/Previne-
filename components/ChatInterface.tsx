
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Heart, Loader2, Info } from 'lucide-react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o Previne+, o seu assistente de saúde e autocuidado. Estou aqui para oferecer um espaço seguro de conversa sobre prevenção, sintomas e ISTs com sigilo absoluto. Como você está se sentindo hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    const response = await geminiService.sendMessage(messages, userMsg);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="bg-purple-50/80 border-l-4 border-purple-400 p-4 mb-4 flex gap-3 items-start rounded-r-xl">
        <Info className="text-purple-500 shrink-0 mt-0.5" size={18} />
        <p className="text-xs text-purple-900 leading-relaxed">
          <strong>Lembrete Amigável:</strong> Este chat é para apoio educacional e orientação preventiva. 
          Se tiver sintomas físicos ou urgência, procure uma Unidade Básica de Saúde (UBS) ou CTA o quanto antes. Sua saúde é uma prioridade.
        </p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 px-2 mb-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-200' : 'previne-gradient-bg text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} className="text-slate-600" /> : <Heart size={15} className="text-white fill-current" />}
              </div>
              <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none' 
                  : 'bg-white border border-purple-50 text-slate-800 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <Loader2 size={18} className="text-purple-600 animate-spin" />
              </div>
              <div className="bg-white p-4 rounded-2xl text-sm border border-purple-50 shadow-sm">
                Buscando informações científicas e acolhedoras para você...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-auto pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua dúvida ou desabafo..."
          className="w-full bg-white border border-purple-100 rounded-[2rem] py-5 pl-8 pr-16 focus:outline-none focus:ring-4 focus:ring-purple-500/20 shadow-xl transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-7 p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-200 shadow-md transition-all active:scale-95 previne-gradient-bg"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
