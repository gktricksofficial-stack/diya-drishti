
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChartResponse, BirthDetailsForm, Language } from '../types';
import { getAstrologicalReading } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  chartData: ChartResponse;
  birthDetails: BirthDetailsForm;
  lang: Language;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chartData, birthDetails, lang }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Namaste **${birthDetails.name}**. I am **Divya Drishti**, your cosmic guide. I have analyzed your birth chart (Kundli). Your Ascendant is **${chartData.ascendant.sign}**. Ask me anything about your career, relationships, or destiny.`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Call Gemini
    const aiResponseText = await getAstrologicalReading(birthDetails, chartData, userMessage.text, lang);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-maroon-900/30 backdrop-blur-md border border-saffron-900/30 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-maroon-900 to-black px-6 py-4 border-b border-saffron-900/30 flex items-center gap-2">
        <Sparkles className="text-saffron-400 animate-pulse" size={20} />
        <h3 className="text-xl font-serif text-saffron-100">Divya Drishti AI Oracle</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-saffron-700 text-white rounded-tr-none'
                  : 'bg-black/40 text-saffron-100 border border-saffron-900/30 rounded-tl-none'
              }`}
            >
              {msg.sender === 'ai' ? (
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-saffron-300 prose-strong:text-saffron-200">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
              <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-black/40 border border-saffron-900/30 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-saffron-500 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/60 border-t border-saffron-900/30">
        <div className="flex items-center gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask the Oracle about your destiny..."
            className="flex-1 bg-maroon-900/50 border border-saffron-900/50 rounded-full py-3 pl-5 pr-12 text-saffron-100 placeholder-saffron-700 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-saffron-600 text-maroon-900 rounded-full hover:bg-saffron-400 disabled:opacity-50 disabled:hover:bg-saffron-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};