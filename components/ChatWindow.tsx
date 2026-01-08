
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface ChatWindowProps {
  activeToolId: string;
  lang: 'en' | 'ko';
}

const ChatWindow: React.FC<ChatWindowProps> = ({ activeToolId, lang }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    if (activeToolId === 'video') {
      await handleVideoGeneration();
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const toolContext = `Acting as the "${activeToolId}" tool on PamOut.com. Preferred language: ${lang}.`;
      const response = await getGeminiResponse(input, `You are PamOut by ABADA Inc. ${toolContext} Provide professional, highly detailed, and accurate responses. Respond in the requested language (${lang}). Do not use emojis.`);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: lang === 'ko' ? "요청 처리 중 오류가 발생했습니다." : "I encountered an error processing your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVideoGeneration = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success as per guidelines
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `[Video Request] ${input} (Aspect Ratio: ${aspectRatio})`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setInput('');

    const assistantPlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: t.videoGenerating,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantPlaceholder]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: input,
        image: selectedImage ? {
          imageBytes: selectedImage.split(',')[1],
          mimeType: 'image/png'
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      setMessages(prev => prev.map(m => 
        m.id === assistantPlaceholder.id 
          ? { ...m, content: `<video controls src="${videoUrl}" class="w-full rounded-xl shadow-lg border border-slate-700 mt-2" />` } 
          : m
      ));
      setSelectedImage(null);
    } catch (error: any) {
      console.error(error);
      const errorText = error.message?.includes("Requested entity was not found") 
        ? "API Key error. Please re-select your key." 
        : "Failed to generate video.";
      
      setMessages(prev => prev.map(m => 
        m.id === assistantPlaceholder.id 
          ? { ...m, content: errorText } 
          : m
      ));
      if (error.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#020617]/40 border border-slate-200 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Neural Core</span>
        </div>
        <button 
          onClick={() => {
            setMessages([]);
            setSelectedImage(null);
          }}
          className="text-xs text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
        >
          {t.resetSession}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-slate-900 dark:text-white">{t.workspaceReady}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{t.workspaceDesc}</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50'
            }`}>
              {msg.content.includes('<video') ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
              <span className="text-[10px] mt-2 block opacity-50 font-mono">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800/60 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/50">
        {activeToolId === 'video' && (
          <div className="max-w-4xl mx-auto mb-4 p-4 glass rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.uploadPhoto}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                {selectedImage && (
                  <div className="relative w-12 h-12 rounded border border-indigo-500 overflow-hidden">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">{t.aspectRatio}:</span>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-2 py-1 outline-none"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * Veo models require a paid API key. Use the prompt to describe the motion.
            </p>
          </div>
        )}

        <div className="relative max-w-4xl mx-auto flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={activeToolId === 'video' ? "Describe the video motion..." : t.promptPlaceholder}
              className="w-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none max-h-32 min-h-[50px]"
              rows={1}
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-3 text-white rounded-xl transition-all shadow-md active:scale-95 shrink-0 ${
              activeToolId === 'video' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-indigo-600 hover:bg-indigo-500'
            } disabled:bg-slate-300 dark:disabled:bg-slate-700`}
          >
            {activeToolId === 'video' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          {t.poweredBy}
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
