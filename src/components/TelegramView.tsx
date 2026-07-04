import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Smartphone, Wifi, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";
import { Language, User } from "../types";
import { translations } from "../data/translations";

interface TelegramProps {
  currentLanguage: Language;
  token: string;
  user: User;
  onUserUpdate: (u: User) => void;
}

export default function TelegramView({ currentLanguage, token, user, onUserUpdate }: TelegramProps) {
  const [isLinked, setIsLinked] = useState(user.telegramLinked);
  const [tgUsername, setTgUsername] = useState(user.telegramUsername || "");
  const [linkingCode, setLinkingCode] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [phoneTgUsername, setPhoneTgUsername] = useState("student_robotics");
  
  // Chat logs simulator
  const [messages, setMessages] = useState<any[]>([
    { sender: "bot", text: "🤖 EduSphere Academy Bot v1.0\n\nHamshaharim, xush kelibsiz! / Добро пожаловать!\n\nPlease link your Academy account to receive instant reminders, certificate warnings, and live reports.\n\nType: /link <your_6_digit_code>", date: new Date().toLocaleTimeString() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (key: keyof typeof translations['en']) => translations[currentLanguage][key] || translations['en'][key];

  useEffect(() => {
    fetchTelegramStatus();
  }, []);

  const fetchTelegramStatus = async () => {
    try {
      const response = await fetch("/api/telegram/status", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIsLinked(data.linked);
        setTgUsername(data.telegramUsername);
        if (data.logs && data.logs.length > 0) {
          // Sync with phone log simulation
          const formatted = data.logs.map((log: any) => ({
            sender: "bot",
            text: log.message,
            date: new Date(log.date).toLocaleTimeString()
          }));
          setMessages(prev => [...prev, ...formatted]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/telegram/generate-code", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLinkingCode(data.code);
        
        // Add hint inside simulated chatbot that code is generated
        setMessages(prev => [
          ...prev,
          { sender: "system", text: `Linking code [ ${data.code} ] initialized. Enter this in the phone's chat below!`, date: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: "user", text: userText, date: new Date().toLocaleTimeString() }]);
    setInputValue("");

    // Simulate Bot response processing
    setTimeout(async () => {
      const parts = userText.trim().split(" ");
      const cmd = parts[0];

      if (cmd === "/link" || cmd.match(/^\d{6}$/)) {
        const codeVal = cmd.match(/^\d{6}$/) ? cmd : parts[1];
        if (!codeVal) {
          setMessages(prev => [...prev, { sender: "bot", text: "❌ Invalid format. Please write:\n/link 123456", date: new Date().toLocaleTimeString() }]);
          return;
        }

        // Verify with backend API
        try {
          const response = await fetch("/api/telegram/verify-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ code: codeVal, telegramUsername: phoneTgUsername })
          });

          if (response.ok) {
            const data = await response.json();
            setIsLinked(true);
            setTgUsername(phoneTgUsername);
            onUserUpdate(data.user);
            setMessages(prev => [
              ...prev,
              { sender: "bot", text: `✅ Account successfully connected to @${phoneTgUsername}!\n\nYou will now receive direct notifications, course logs, and final examinations updates.`, date: new Date().toLocaleTimeString() }
            ]);
          } else {
            const err = await response.json();
            setMessages(prev => [...prev, { sender: "bot", text: `❌ Verification failed: ${err.error || "Incorrect code"}`, date: new Date().toLocaleTimeString() }]);
          }
        } catch (err) {
          setMessages(prev => [...prev, { sender: "bot", text: "❌ Connection error during sync.", date: new Date().toLocaleTimeString() }]);
        }
      } else if (cmd === "/progress") {
        setMessages(prev => [...prev, { sender: "bot", text: `📊 EduSphere Academy Progress:\n\nStudent: ${user.username}\nLevel Progress: ${user.levelProgress}/100 (${user.levelProgress}% Complete)\nXP points: ${user.xp}\nBadges: ${user.earnedBadges.length} earned.`, date: new Date().toLocaleTimeString() }]);
      } else {
        setMessages(prev => [...prev, { sender: "bot", text: "🤖 Command unrecognized.\nAvailable:\n/link <code> - connect account\n/progress - review statistics", date: new Date().toLocaleTimeString() }]);
      }
    }, 800);
  };

  const simulateReminder = async () => {
    try {
      const response = await fetch("/api/telegram/simulate-reminder", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const lastLog = data.logs[data.logs.length - 1];
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: lastLog.message, date: new Date(lastLog.date).toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="telegram-integration-page">
      {/* Left controls side */}
      <div className="lg:col-span-7 space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2 font-sans">
            <MessageSquare className="text-[#00F0FF] w-6 h-6" />
            {t("telegramTitle")}
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-mono">
            {t("telegramDesc")}
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="bg-[#080808] border-2 border-[#111] rounded-none p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-4 justify-between border-b border-[#222] pb-5">
            <div>
              <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">STATUS_LOG</span>
              <p className="text-base font-bold text-white flex items-center gap-2 mt-1 font-mono">
                <span className={`w-3 h-3 rounded-none ${isLinked ? "bg-[#00F0FF] animate-pulse" : "bg-yellow-500"}`}></span>
                {isLinked ? t("telegramLinked").toUpperCase() : "DISCONNECTED"}
              </p>
            </div>
            {isLinked && (
              <div className="text-right">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">TELEGRAM_USER</span>
                <p className="text-sm font-bold text-[#00F0FF] mt-1 font-mono">@{tgUsername}</p>
              </div>
            )}
          </div>

          {!isLinked ? (
            <div className="space-y-4 font-mono">
              <div className="bg-black p-4 rounded-none border border-dashed border-[#222] flex items-start gap-3">
                <AlertTriangle className="text-[#00F0FF] w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400 space-y-1">
                  <p className="font-bold text-white uppercase tracking-wider">Instruction Set:</p>
                  <p>1. Trigger [GENERATE] button to retrieve handshake token.</p>
                  <p>2. Copy the active 6-digit verification code.</p>
                  <p>3. Submit the token inside the transceiver simulation terminal.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  disabled={loading}
                  onClick={generateCode}
                  className="bg-[#00F0FF] hover:bg-white text-black font-mono font-black uppercase tracking-wider text-xs px-5 py-3 rounded-none border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  id="telegram-gen-code-btn"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Generate Linking Code
                </button>
                
                {linkingCode && (
                  <div className="bg-black px-5 py-3 rounded-none border-2 border-dashed border-[#00F0FF] font-mono text-lg font-bold text-[#00F0FF] tracking-widest animate-pulse">
                    {linkingCode}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-mono">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-[#00F0FF] pl-2">Telecommunication Uplink Commands</h3>
              <p className="text-xs text-gray-400">Push asynchronous notifications and curriculum logging telemetry downstream to the remote handset simulator:</p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={simulateReminder}
                  className="bg-[#0a0a0a] hover:bg-[#111] text-gray-200 border border-[#222] hover:border-[#00F0FF] px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4 text-[#00F0FF]" />
                  Trigger Reminders
                </button>

                <button
                  onClick={() => {
                    setMessages(prev => [
                      ...prev,
                      { sender: "bot", text: `🏆 Level Passed Alert!\nCongratulations @${user.username}! You completed Level ${user.levelProgress} and earned 100 XP points!`, date: new Date().toLocaleTimeString() }
                    ]);
                  }}
                  className="bg-[#0a0a0a] hover:bg-[#111] text-gray-200 border border-[#222] hover:border-[#00F0FF] px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
                  Simulate Quiz Notification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right simulated Smartphone side */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-[280px] h-[520px] bg-[#0c0c0c] border-4 border-neutral-800 rounded-none overflow-hidden relative flex flex-col font-mono shadow-[5px_5px_0_rgba(34,34,34,0.5)]" id="simulated-smartphone">
          
          {/* Phone speaker and sensor bar */}
          <div className="absolute top-0 inset-x-0 h-5 bg-[#151515] border-b border-[#222] flex justify-between px-3 items-center z-30 text-[8px] text-gray-500 font-mono">
            <span>ANTENNA-1</span>
            <div className="w-8 h-1 bg-black rounded-full"></div>
            <span>SYS-OK</span>
          </div>

          {/* Screen area with simulated Telegram header */}
          <div className="flex-1 mt-5 flex flex-col bg-black text-gray-300 overflow-hidden relative">
            
            {/* Telegram App Bar */}
            <div className="bg-[#111] px-3 py-2.5 border-b border-[#222] flex items-center gap-2">
              <div className="w-8 h-8 rounded-none bg-black text-[#00F0FF] font-bold text-xs flex items-center justify-center border border-[#00F0FF]">
                RM
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white">EduSphere Telegram</p>
                <span className="text-[9px] text-[#00F0FF] font-mono lowercase">bot uplink: connected</span>
              </div>
            </div>

            {/* Customizer username of target phone */}
            {!isLinked && (
              <div className="bg-[#151515] px-3 py-1 text-[9px] text-gray-400 flex justify-between items-center border-b border-[#222]">
                <span className="uppercase text-[8px]">SIM_USER:</span>
                <input 
                  type="text" 
                  value={phoneTgUsername} 
                  onChange={(e) => setPhoneTgUsername(e.target.value.replace(/\s+/g, ""))}
                  placeholder="tg_username"
                  className="bg-black border border-[#222] focus:border-[#00F0FF] px-1 py-0.5 text-xs text-[#00F0FF] outline-none w-24 text-right font-mono"
                />
              </div>
            )}

            {/* Simulated Chat Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col scrollbar-thin">
              {messages.map((msg, i) => {
                if (msg.sender === "system") {
                  return (
                    <div key={i} className="bg-[#111] border border-dashed border-[#00F0FF]/30 p-2 rounded-none text-center text-[9px] text-gray-400 font-mono leading-tight uppercase">
                      {msg.text}
                    </div>
                  );
                }
                const isUser = msg.sender === "user";
                return (
                  <div 
                    key={i} 
                    className={`max-w-[85%] rounded-none p-2.5 text-xs ${
                      isUser 
                        ? "bg-[#1a1a1a] text-white self-end border border-[#333]" 
                        : "bg-[#050505] text-[#00F0FF] self-start border border-[#00F0FF]/30"
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-mono text-[10px] leading-tight">{msg.text}</p>
                    <span className="text-[7px] text-gray-500 block text-right mt-1 font-mono">{msg.date}</span>
                  </div>
                );
              })}
            </div>

            {/* Phone Chat input */}
            <form onSubmit={handlePhoneSend} className="bg-[#111] p-2 border-t border-[#222] flex gap-1.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={!isLinked ? "e.g., /link 123456" : "Type command..."}
                className="flex-1 bg-black border border-[#222] focus:border-[#00F0FF] rounded-none px-3 py-1.5 text-[10px] text-gray-200 outline-none font-mono"
              />
              <button
                type="submit"
                className="bg-[#00F0FF] hover:bg-white text-black p-1.5 rounded-none flex items-center justify-center cursor-pointer transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

          {/* Bottom hardware home pill */}
          <div className="h-4 bg-[#111] border-t border-[#222] flex justify-center items-center text-[8px] text-gray-600 font-mono">
            <span>UPLINK TRANSCIEVER</span>
          </div>

        </div>
      </div>
    </div>
  );
}
