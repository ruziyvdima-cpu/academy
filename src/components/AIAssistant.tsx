import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, Mic, MicOff, Bot, Sparkles, 
  Volume2, VolumeX, Terminal, Cpu, ArrowUpRight 
} from "lucide-react";
import { User, Lesson } from "../types";

interface AIAssistantProps {
  user: User | null;
  activeTab: string;
  onNavigate: (tab: string) => void;
  activeLesson?: Lesson | any;
  currentCode?: string;
  lang: "uz" | "ru" | "en";
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  user,
  activeTab,
  onNavigate,
  activeLesson,
  currentCode,
  lang
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice Synthesis (TTS) & Recognition (STT) Settings
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize with a welcome message in selected language
  useEffect(() => {
    let welcome = "";
    if (lang === "uz") {
      welcome = `Salom! Men ChatGPT 5.5 darajasidagi EduAI yordamchisiman. 🤖✨\nSizga robototexnika, matematika, ingliz tili yoki dasturlashda yordam bera olaman. Meni ovozli boshqarish uchun 🎤 tugmasini bosing!`;
    } else if (lang === "ru") {
      welcome = `Привет! Я ИИ-помощник EduAI уровня ChatGPT 5.5. 🤖✨\nМогу помочь с робототехникой, математикой, английским или программированием. Нажмите кнопку 🎤 для голосового управления!`;
    } else {
      welcome = `Hello! I'm EduAI Assistant, powered by advanced Gemini 3.5. 🤖✨\nI can help you with robotics, math, English, or coding. Tap the 🎤 icon to control me using your voice!`;
    }
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Web Speech API: Speech Synthesis (Read Aloud)
  const speakText = (text: string) => {
    if (!isTtsEnabled || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean up Markdown formatting tags so it reads smoothly
    const cleanText = text
      .replace(/[*#`_\-]/g, "") // remove bold, headings, code wrappers
      .replace(/\[.*?\]\(.*?\)/g, ""); // remove links

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Select correct voice rate & language
    utterance.rate = 1.0;
    if (lang === "uz") {
      utterance.lang = "tr-TR"; // Turkish voice is closest phonetic fallback for Uzbek
    } else if (lang === "ru") {
      utterance.lang = "ru-RU";
    } else {
      utterance.lang = "en-US";
    }

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API: Speech Recognition (Voice Controls)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputVal(transcript);
          // Auto submit the voice command!
          handleSendVoice(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(lang === "uz" ? "Kechirasiz, brauzeringiz ovozli muloqotni qo'llab-quvvatlamaydi." : "Sorry, your browser doesn't support speech recognition.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Send message from user
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal;
    setInputVal("");
    await submitQuery(userText);
  };

  const handleSendVoice = async (voiceText: string) => {
    if (!voiceText.trim() || isLoading) return;
    await submitQuery(voiceText);
  };

  // Voice Command Intent Router
  const checkVoiceCommands = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    
    // Command combinations for navigation
    const navDashboardUz = ["dashboard", "bosh sahifa", "asosiy", "dars jadvali"];
    const navLessonsUz = ["kurs", "darslar", "kurslar", "o'rganish", "lessons"];
    const navSimulatorUz = ["simulyator", "virtual", "laboratoriya", "simulator", "robotni boshqarish"];
    const navCommunityUz = ["forum", "klub", "jamiyat", "komunit", "community"];
    const navProfileUz = ["profil", "sozlamalar", "yoshim", "profile"];

    if (navDashboardUz.some(cmd => lowerText.includes(cmd))) {
      onNavigate("dashboard");
      triggerBotReply(lang === "uz" ? "Tushundim! Asosiy boshqaruv paneliga o'tmoqdamiz." : "Opening your dashboard.");
      return true;
    }
    if (navLessonsUz.some(cmd => lowerText.includes(cmd))) {
      onNavigate("lessons");
      triggerBotReply(lang === "uz" ? "Ajoyib tanlov! Kurslar bo'limini ochyapman." : "Navigating to your courses.");
      return true;
    }
    if (navSimulatorUz.some(cmd => lowerText.includes(cmd))) {
      onNavigate("simulator");
      triggerBotReply(lang === "uz" ? "Simulyator laboratoriyasi ochilmoqda. Sinab ko'ring!" : "Opening the virtual simulation lab.");
      return true;
    }
    if (navCommunityUz.some(cmd => lowerText.includes(cmd))) {
      onNavigate("community");
      triggerBotReply(lang === "uz" ? "Klub forumiga o'tamiz. Jamoadoshlaringiz bilan suhbatlashing!" : "Opening student forum.");
      return true;
    }
    if (navProfileUz.some(cmd => lowerText.includes(cmd))) {
      onNavigate("profile");
      triggerBotReply(lang === "uz" ? "Profil sozlamalarini ochmoqdaman. Yoshiingizni shu yerda o'zgartira olasiz." : "Opening your profile settings.");
      return true;
    }

    return false;
  };

  const triggerBotReply = (text: string) => {
    const newMsg: ChatMessage = {
      id: "bot_" + Math.random().toString(36).substr(2, 9),
      sender: "bot",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    speakText(text);
  };

  // Perform AI integration fetch
  const submitQuery = async (queryText: string) => {
    // Add user message to UI
    const userMsg: ChatMessage = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    // Check voice navigation commands
    if (checkVoiceCommands(queryText)) {
      return;
    }

    setIsLoading(true);

    try {
      // Gather active learning context for Gemini model
      const contextObj: any = {};
      if (activeLesson) {
        contextObj.title = activeLesson.title?.[lang] || activeLesson.title || "";
        contextObj.desc = activeLesson.description?.[lang] || activeLesson.description || "";
      }
      if (currentCode) {
        contextObj.codePlayground = currentCode;
      }

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.id || ""}`
        },
        body: JSON.stringify({
          message: queryText,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          context: contextObj
        })
      });

      const data = await response.json();
      if (data.reply) {
        triggerBotReply(data.reply);
      } else {
        triggerBotReply(lang === "uz" ? "Tushunmadim, iltimos qaytadan yozing." : "I didn't catch that, could you rephrase?");
      }
    } catch (err) {
      console.error(err);
      triggerBotReply(lang === "uz" ? "Tizimda xatolik yuz berdi. Internetni tekshirib ko'ring." : "Error reaching the AI server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action Buttons
  const triggerQuickPrompt = (promptText: string) => {
    submitQuery(promptText);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#00F0FF] text-black p-4 rounded-full shadow-[0_0_15px_rgba(0,255,65,0.6)] border border-[#00F0FF] hover:bg-black hover:text-[#00F0FF] transition-all duration-300 group cursor-pointer animate-bounce"
        title="EduAI Assistant"
        id="ai-helper-floating-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-90" />
        ) : (
          <div className="relative">
            <Cpu className="w-6 h-6 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Floating Panel Overlay */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[520px] bg-black border border-[#222] shadow-[0_4px_30px_rgba(0,0,0,0.85)] flex flex-col z-50 rounded-none transition-all duration-300"
          id="ai-chat-overlay-panel"
        >
          {/* Header */}
          <div className="p-3 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#00F0FF]/15 p-1.5 border border-[#00F0FF]">
                <Bot className="w-4 h-4 text-[#00F0FF] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white tracking-wider uppercase">EduAI Assistant</span>
                  <span className="text-[8px] bg-[#00F0FF]/20 text-[#00F0FF] px-1 font-mono uppercase tracking-widest font-black border border-[#00F0FF]/30">v5.5</span>
                </div>
                <p className="text-[9px] text-gray-500 font-mono tracking-tight uppercase">
                  {lang === "uz" ? "Ovozli faol boshqaruv" : lang === "ru" ? "Голосовой ассистент" : "Active Voice Assistant"}
                </p>
              </div>
            </div>

            {/* Controls: Audio synthesis & Close */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                className={`p-1.5 border transition-all ${
                  isTtsEnabled 
                    ? "border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/10" 
                    : "border-[#333] text-gray-500 hover:text-white"
                }`}
                title={lang === "uz" ? "Ovozli o'qish" : "Read answers aloud"}
              >
                {isTtsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Display */}
          {activeLesson && (
            <div className="px-3 py-1 bg-[#050505] border-b border-[#222] flex items-center justify-between text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
                <Terminal className="w-3 h-3 text-[#00F0FF] shrink-0" />
                <span className="text-gray-500">Mavzu:</span>
                <span className="text-gray-300 truncate">{activeLesson.title?.[lang] || activeLesson.title}</span>
              </div>
              <span className="text-[8px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1 shrink-0 uppercase font-bold">FAOL</span>
            </div>
          )}

          {/* Messages Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-[#030303] scrollbar-thin scrollbar-thumb-[#222]">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-none bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#00F0FF]" />
                  </div>
                )}
                <div className="space-y-1">
                  <div className={`p-2.5 rounded-none border leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#00F0FF]/10 text-white border-[#00F0FF]/30"
                      : "bg-[#0b0b0b] text-gray-200 border-[#222]"
                  }`}>
                    {/* Render newlines */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <p className={`text-[8px] text-gray-600 font-mono ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 max-w-[80%] mr-auto items-center">
                <div className="w-6 h-6 rounded-none bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center animate-spin">
                  <Cpu className="w-3 h-3 text-[#00F0FF]" />
                </div>
                <div className="p-2 bg-[#0b0b0b] border border-[#222] text-gray-400 font-mono text-[10px] animate-pulse">
                  EduAI o'ylamoqda...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Badges */}
          <div className="px-3 py-2 bg-[#050505] border-t border-[#222] flex flex-wrap gap-1.5 overflow-x-auto select-none shrink-0">
            {lang === "uz" ? (
              <>
                <button 
                  onClick={() => triggerQuickPrompt("Mavzuni batafsil tushuntirib bera olasizmi?")}
                  className="px-2 py-0.5 bg-black border border-[#222] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[9px] text-gray-400 font-mono rounded-none uppercase tracking-wider cursor-pointer transition-all"
                >
                  📖 Mavzuni tushuntir
                </button>
                <button 
                  onClick={() => triggerQuickPrompt("Men koddagi xatoni qanday topsam bo'ladi?")}
                  className="px-2 py-0.5 bg-black border border-[#222] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[9px] text-gray-400 font-mono rounded-none uppercase tracking-wider cursor-pointer transition-all"
                >
                  ⚡ Kodga yordam
                </button>
                {activeTab === "simulator" && (
                  <button 
                    onClick={() => triggerQuickPrompt("Ushbu robot simulyatorida Arduino sxemasini qanday ishga tushiraman?")}
                    className="px-2 py-0.5 bg-black border border-[#222] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[9px] text-gray-400 font-mono rounded-none uppercase tracking-wider cursor-pointer transition-all"
                  >
                    🤖 Simulyator yo'riqnomasi
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => triggerQuickPrompt("Can you explain the current topic in detail?")}
                  className="px-2 py-0.5 bg-black border border-[#222] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[9px] text-gray-400 font-mono rounded-none uppercase tracking-wider cursor-pointer transition-all"
                >
                  📖 Explain topic
                </button>
                <button 
                  onClick={() => triggerQuickPrompt("Help me debug this code.")}
                  className="px-2 py-0.5 bg-black border border-[#222] hover:border-[#00F0FF] hover:text-[#00F0FF] text-[9px] text-gray-400 font-mono rounded-none uppercase tracking-wider cursor-pointer transition-all"
                >
                  ⚡ Coding Help
                </button>
              </>
            )}
          </div>

          {/* Form Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#222] bg-[#0a0a0a] flex items-center gap-2"
          >
            {/* STT Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-none border transition-all cursor-pointer relative ${
                isListening 
                  ? "bg-red-500/20 text-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                  : "bg-black border-[#222] text-gray-400 hover:text-white hover:border-gray-500"
              }`}
              title={lang === "uz" ? "Ovozli yozishni boshlash" : "Start speaking"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isListening 
                  ? (lang === "uz" ? "Sizni eshityapman..." : lang === "ru" ? "Слушаю вас..." : "Listening...") 
                  : (lang === "uz" ? "Xabaringizni yozing..." : lang === "ru" ? "Напишите сообщение..." : "Type your query...")
              }
              className="flex-1 bg-black border border-[#222] px-3 py-2 text-white font-mono text-xs rounded-none focus:outline-none focus:border-[#00F0FF]"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              className="p-2.5 bg-[#00F0FF] text-black hover:bg-black hover:text-[#00F0FF] border border-[#00F0FF] transition-all duration-300 rounded-none cursor-pointer"
              disabled={isLoading || !inputVal.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
