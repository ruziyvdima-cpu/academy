import React, { useState, useEffect } from "react";
import { 
  Cpu, Brain, Zap, BookOpen, Award, MessageSquare, Settings, LogOut, 
  Globe, Sparkles, Smartphone, Play, CheckCircle2, Lock, 
  Bookmark, ChevronRight, Star, User, Save, FileText, Send, 
  RefreshCw, Menu, X, Check, ShieldAlert, Sun, Moon
} from "lucide-react";

import { Language, User as UserType, Lesson, Level } from "./types";
import { translations } from "./data/translations";
import { curriculum } from "./data/curriculum";
import SimulatorComponent from "./components/SimulatorComponent";
import ForumView from "./components/ForumView";
import TelegramView from "./components/TelegramView";
import AdminView from "./components/AdminView";
import { AIAssistant } from "./components/AIAssistant";
import { AICoursesView } from "./components/AICoursesView";

export default function App() {
  // Localization state
  const [activeLang, setActiveLang] = useState<Language>(() => {
    const saved = localStorage.getItem("lang");
    return (saved as Language) || "uz";
  });

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as 'dark' | 'light') || "dark";
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const t = (key: keyof typeof translations['en']) => translations[activeLang][key] || translations['en'][key];

  // App navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roadmapRange, setRoadmapRange] = useState<[number, number]>([1, 20]);

  // User auth state
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Curriculum State
  const [selectedLevel, setSelectedLevel] = useState<Level>(curriculum[0]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(curriculum[0].lessons[0]);
  const [activeLessonTab, setActiveLessonTab] = useState<'simulation' | 'quiz' | 'homework'>('simulation');

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  // Coding Playground & Homework State
  const [homeworkCode, setHomeworkCode] = useState("");
  const [homeworkFeedback, setHomeworkFeedback] = useState<any>(null);
  const [homeworkIsSubmitting, setHomeworkIsSubmitting] = useState(false);
  const [simulatedCodeOutput, setSimulatedCodeOutput] = useState<string>("");

  // EduAI Mentor State
  const [aiMentorMessages, setAiMentorMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [aiMentorInput, setAiMentorInput] = useState("");
  const [aiMentorLoading, setAiMentorLoading] = useState(false);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Standalone Sandbox Simulator state
  const [sandboxType, setSandboxType] = useState<'led' | 'servo' | 'ultrasonic' | 'iot-web' | 'line-follower' | 'cv-grid'>('led');

  // Load language settings
  useEffect(() => {
    localStorage.setItem("lang", activeLang);
  }, [activeLang]);

  // Load user profile on startup if token exists
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Load leaderboard and levels progress when user logs in or scores change
  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  // Reset homework and quiz fields when selecting a different lesson
  useEffect(() => {
    if (selectedLesson) {
      setHomeworkCode(selectedLesson.homework.defaultCode);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizPassed(false);
      setHomeworkFeedback(null);
      setSimulatedCodeOutput("");
      setActiveLessonTab('simulation');
    }
  }, [selectedLesson]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Match level progress
        const activeLvlIdx = curriculum.findIndex(l => l.id === userData.levelProgress);
        if (activeLvlIdx !== -1) {
          setSelectedLevel(curriculum[activeLvlIdx]);
          setSelectedLesson(curriculum[activeLvlIdx].lessons[0]);
        }
      } else {
        // Clear stale token
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
      }
    } catch (err) {
      console.error("Profile load failed", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = authMode === 'register' 
      ? { username: authUsername, email: authEmail, password: authPassword }
      : { username: authUsername, password: authPassword };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        setAuthSuccess("Successfully logged in!");
        setAuthUsername("");
        setAuthEmail("");
        setAuthPassword("");
      } else {
        const err = await response.json();
        setAuthError(err.error || "Authentication failed. Try again.");
      }
    } catch (err) {
      setAuthError("Server communication failed. Please run setup first.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setActiveTab("dashboard");
  };

  // Upgrades user to Premium for interactive demo
  const buyPremiumSimulate = async () => {
    try {
      const response = await fetch("/api/auth/update-premium", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert(t("premiumSuccess"));
        setActiveTab("dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle bookmark / saved lessons
  const toggleSaveLesson = async (lessonId: string) => {
    try {
      const response = await fetch("/api/courses/save-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit multiple choice quiz
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    const questions = selectedLesson.quiz.questions;

    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const isPass = score === questions.length;
    setQuizPassed(isPass);

    if (isPass) {
      try {
        const response = await fetch("/api/courses/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            lessonId: selectedLesson.id,
            levelId: selectedLesson.levelId
          })
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Run code on local visualizer
  const handleRunCode = () => {
    setSimulatedCodeOutput("Compiling sketch...\nSketch builds successfully!\nRunning firmware on Simulated MCU...\nInitializing GPIO...");
    setTimeout(() => {
      setSimulatedCodeOutput(prev => prev + `\nPin attached: OK\nSimulating continuous loop()...`);
    }, 1000);
  };

  // Send homework template to Gemini API for real grading!
  const handleHomeworkSubmit = async () => {
    setHomeworkIsSubmitting(true);
    setHomeworkFeedback(null);
    try {
      const response = await fetch("/api/courses/submit-homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: selectedLesson.id,
          lessonTitle: selectedLesson.title.en,
          studentCode: homeworkCode,
          currentLanguage: activeLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        setHomeworkFeedback(data.evaluation);
        setUser(data.user);
      }
    } catch (err) {
      console.error("Homework submit error", err);
    } finally {
      setHomeworkIsSubmitting(false);
    }
  };

  // Ask AI Mentor questions using Gemini 3.5 Flash
  const handleAskMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMentorInput.trim()) return;

    const query = aiMentorInput;
    setAiMentorMessages(prev => [...prev, { sender: 'user', text: query }]);
    setAiMentorInput("");
    setAiMentorLoading(true);

    try {
      const response = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: query,
          currentLanguage: activeLang,
          contextCode: homeworkCode,
          lessonTitle: selectedLesson.title.en
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiMentorMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        const err = await response.json();
        setAiMentorMessages(prev => [...prev, { sender: 'bot', text: `Error: ${err.error}` }]);
      }
    } catch (err) {
      setAiMentorMessages(prev => [...prev, { sender: 'bot', text: "Could not reach EduAI server. Verify your internet connection." }]);
    } finally {
      setAiMentorLoading(false);
    }
  };

  // Calculate total academy completion percentage
  const totalCompletedLessonsCount = user?.completedQuizzes.length || 0;
  const academyCompletionPercent = Math.min(100, Math.round((totalCompletedLessonsCount / curriculum.length) * 100));

  return (
    <div className={`min-h-screen bg-black text-gray-200 flex flex-col font-mono selection:bg-[#00F0FF]/20 selection:text-[#00F0FF] ${theme === 'light' ? 'theme-light' : ''}`}>
      
      {/* HEADER SECTION */}
      <header className="bg-black border-b border-[#222] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("dashboard")} id="academy-brand-logo">
            <div className="bg-[#00F0FF]/15 p-2 rounded-none border-2 border-[#00F0FF]">
              <Cpu className="w-5 h-5 text-[#00F0FF] animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white uppercase leading-none">EduSphere</h1>
              <span className="text-[10px] font-bold text-[#00F0FF] tracking-widest uppercase">Academy</span>
            </div>
          </div>

          {/* User Stats in Header (if logged in) */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              {/* Progress bar */}
              <div className="flex items-center gap-3 bg-black border border-[#222] px-3.5 py-1.5 rounded-none">
                <span className="font-mono text-[10px] font-bold text-gray-400">PROGRESS:</span>
                <div className="w-28 h-1.5 bg-[#0a0a0a] border border-[#222] rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-[#00F0FF] transition-all duration-500"
                    style={{ width: `${academyCompletionPercent}%` }}
                  ></div>
                </div>
                <span className="font-mono text-[11px] font-black text-[#00F0FF]">{academyCompletionPercent}%</span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 bg-black border border-[#222] px-3.5 py-1.5 rounded-none text-xs font-bold font-mono text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{user.xp} XP</span>
              </div>

              {/* Level indicator */}
              <div className="bg-black border border-[#00F0FF] px-3.5 py-1.5 rounded-none text-xs font-bold font-mono text-[#00F0FF]">
                {t("level")} {user.levelProgress}
              </div>
            </div>
          )}

          {/* Right Header: Languages + Profile Action */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="bg-black hover:bg-[#111] border border-[#222] hover:border-[#00F0FF] p-2 rounded-none transition-all cursor-pointer text-gray-300 flex items-center justify-center"
              title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
            </button>
            
            {/* Language dropdown */}
            <div className="relative group">
              <button className="bg-black hover:bg-[#111] border border-[#222] hover:border-[#00F0FF] px-3 py-1.5 rounded-none text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-gray-300">
                <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="uppercase">{activeLang}</span>
              </button>
              <div className="absolute right-0 mt-1.5 w-28 bg-black border border-[#222] rounded-none overflow-hidden shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-150 z-50">
                <button onClick={() => setActiveLang("uz")} className="w-full text-left px-4 py-2 text-xs hover:bg-[#111] hover:text-[#00F0FF] transition-colors font-medium text-gray-300 cursor-pointer">Uzbek</button>
                <button onClick={() => setActiveLang("ru")} className="w-full text-left px-4 py-2 text-xs hover:bg-[#111] hover:text-[#00F0FF] transition-colors font-medium text-gray-300 cursor-pointer">Русский</button>
                <button onClick={() => setActiveLang("en")} className="w-full text-left px-4 py-2 text-xs hover:bg-[#111] hover:text-[#00F0FF] transition-colors font-medium text-gray-300 cursor-pointer">English</button>
              </div>
            </div>

            {/* Logout button if logged in */}
            {user && (
              <button 
                onClick={handleLogout}
                className="bg-black hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-[#222] hover:border-red-500/30 p-2 rounded-none transition-all cursor-pointer"
                title={t("logout")}
                id="header-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE MENU NAVIGATION */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-900 py-3 px-4 space-y-2 z-40">
          <button 
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "dashboard" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navDashboard")}
          </button>
          <button 
            onClick={() => { setActiveTab("lessons"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "lessons" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navLessons")}
          </button>
          <button 
            onClick={() => { setActiveTab("ai-courses"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "ai-courses" ? "bg-[#00F0FF]/10 text-[#00F0FF]" : "text-slate-400"}`}
          >
            {t("navAICourses")}
          </button>
          <button 
            onClick={() => { setActiveTab("simulator"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "simulator" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navSimulator")}
          </button>
          <button 
            onClick={() => { setActiveTab("community"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "community" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navCommunity")}
          </button>
          <button 
            onClick={() => { setActiveTab("telegram"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "telegram" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navTelegram")}
          </button>
          <button 
            onClick={() => { setActiveTab("premium"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "premium" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navPremium")}
          </button>
          <button 
            onClick={() => { setActiveTab("admin"); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${activeTab === "admin" ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400"}`}
          >
            {t("navAdmin")}
          </button>
        </div>
      )}

      {/* CORE LAYOUT CONTAINER */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* DESKTOP SIDE NAVIGATION RAIL */}
        {user && (
          <aside className="hidden md:block w-56 shrink-0 space-y-1.5" id="desktop-sidebar">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t("navDashboard")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("lessons")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "lessons" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t("navLessons")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("ai-courses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "ai-courses" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <Brain className="w-4 h-4 text-[#00F0FF]" />
              <span>{t("navAICourses")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("simulator")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "simulator" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t("navSimulator")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("community")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "community" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t("navCommunity")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("telegram")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "telegram" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF] shadow-[2px_2px_0_rgba(0,255,65,0.2)]" 
                  : "bg-black text-gray-500 border-[#111] hover:border-[#00F0FF] hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{t("navTelegram")}</span>
            </button>

            <button 
              onClick={() => setActiveTab("premium")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                activeTab === "premium" 
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border-2 border-dashed border-[#00F0FF] font-bold" 
                  : "bg-black text-amber-500 border-2 border-dashed border-amber-500/40 hover:border-[#00F0FF] hover:text-[#00F0FF]"
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>{t("navPremium")}</span>
            </button>

            <div className="pt-6 border-t border-[#222] mt-6">
              <button 
                onClick={() => setActiveTab("admin")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-xs font-bold uppercase font-mono border transition-all cursor-pointer ${
                  activeTab === "admin" 
                    ? "bg-red-500/10 text-red-400 border border-red-500/30" 
                    : "bg-black text-gray-500 border-[#111] hover:border-red-500 hover:text-red-400"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t("navAdmin")}</span>
              </button>
            </div>
          </aside>
        )}

        {/* MAIN WORKSPACE SCREEN */}
        <main className="flex-1 min-w-0">
          
          {/* USER UNAUTHENTICATED STATE: SHOWS GORGEOUS CYBERPUNK ONBOARDING */}
          {!user ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6" id="academy-onboarding-screen">
              
              {/* Marketing/Branding text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="bg-[#00F0FF]/15 border border-[#00F0FF] text-[#00F0FF] font-mono text-xs px-3 py-1 rounded-none inline-flex items-center gap-1.5 self-center lg:self-start">
                  <Sparkles className="w-3.5 h-3.5" /> 100% ONLINE & VIRTUAL INTERACTIVE
                </div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans">
                  {t("title")}
                </h1>
                <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
                  {t("subtitle")}. {t("progress")}: 0% ➔ 100%. Uzbek, Russian, and English support. Learn microcontroller programming, analog circuits, IoT, computer vision, and building line followers using virtual interactive simulations.
                </p>

                {/* Grid features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0 text-left pt-4 font-mono text-xs">
                  <div className="flex items-center gap-2.5 bg-[#080808] border border-[#222] p-3 rounded-none">
                    <Check className="text-[#00F0FF] w-5 h-5 shrink-0" />
                    <span className="text-gray-300">10 Structured Level Curriculums</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#080808] border border-[#222] p-3 rounded-none">
                    <Check className="text-[#00F0FF] w-5 h-5 shrink-0" />
                    <span className="text-gray-300">Interactive Circuit & Sonar Simulator</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#080808] border border-[#222] p-3 rounded-none">
                    <Check className="text-[#00F0FF] w-5 h-5 shrink-0" />
                    <span className="text-gray-300">EduAI Tutor powered by Gemini</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#080808] border border-[#222] p-3 rounded-none">
                    <Check className="text-[#00F0FF] w-5 h-5 shrink-0" />
                    <span className="text-gray-300">Official Downloadable Certificates</span>
                  </div>
                </div>
              </div>

              {/* Login / Register Card */}
              <div className="lg:col-span-5 bg-[#080808] border-2 border-[#111] rounded-none p-6 shadow-2xl relative">
                <div className="absolute -top-3.5 right-6 bg-[#00F0FF] text-black text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-none border border-black shadow-[3px_3px_0_rgba(0,0,0,1)] font-mono">
                  GET STARTED
                </div>

                <div className="flex border-b border-[#222] mb-6">
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthError(""); }}
                    className={`flex-1 py-3 text-sm font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                      authMode === 'login' ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-gray-500"
                    }`}
                  >
                    {t("login")}
                  </button>
                  <button 
                    onClick={() => { setAuthMode('register'); setAuthError(""); }}
                    className={`flex-1 py-3 text-sm font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                      authMode === 'register' ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-gray-500"
                    }`}
                  >
                    {t("register")}
                  </button>
                </div>

                {authError && (
                  <p className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-none text-center mb-4 font-mono">
                    {authError}
                  </p>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase">{t("username")}</label>
                    <input 
                      type="text" 
                      required
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value.replace(/\s+/g, ""))}
                      placeholder="e.g., Al_Xorazmiy"
                      className="w-full bg-black border border-[#222] rounded-none px-4 py-2.5 text-xs text-gray-100 outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  {authMode === 'register' && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-500 uppercase">{t("email")}</label>
                      <input 
                        type="email" 
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g., student@robomaster.com"
                        className="w-full bg-black border border-[#222] rounded-none px-4 py-2.5 text-xs text-gray-100 outline-none focus:border-[#00F0FF]"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 uppercase">{t("password")}</label>
                    <input 
                      type="password" 
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-[#222] rounded-none px-4 py-2.5 text-xs text-gray-100 outline-none focus:border-[#00F0FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#00F0FF] hover:bg-white text-black font-mono font-black uppercase tracking-wider text-sm py-3.5 rounded-none border border-black shadow-[4px_4px_0_rgba(0,255,65,0.4)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {authLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    {authMode === 'login' ? "LOG IN TO SCHOOL" : "CREATE STUDENT ACCOUNT"}
                  </button>
                </form>

                <p className="text-[10px] text-gray-500 font-mono text-center mt-4 uppercase tracking-wider">
                  Quick Testing ID: <span className="text-gray-300 font-bold">admin</span> / Password: <span className="text-gray-300 font-bold">d1ma1776</span>
                </p>
              </div>

            </div>
          ) : (
            
            // USER AUTHENTICATED: SHOW TABS
            <div className="space-y-6">
              
              {/* TAB 1: ACADEMY PROGRESS ROADMAP (Bento Grid of Level 1-10) */}
              {activeTab === "dashboard" && (
                <div className="space-y-6" id="dashboard-tab">
                  {/* Banner summary */}
                  <div className="bg-[#080808] border-2 border-[#111] p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl font-mono">
                    <div className="space-y-1">
                      <span className="text-[#00F0FF] font-mono text-[10px] font-black uppercase tracking-widest">STUDENT CENTER</span>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Xush kelibsiz, @{user.username}!</h2>
                      <p className="text-xs text-gray-400 max-w-xl font-mono leading-relaxed">
                        You have unlocked {user.levelProgress} out of {curriculum.length} academy engineering levels. Proceed with your classes to earn experience, secure certified badges, and receive verified robotics diplomas.
                      </p>
                    </div>
                    {/* Active streak counter */}
                    <div className="bg-black px-4 py-3 rounded-none border border-[#222] flex items-center gap-3 self-start md:self-auto shrink-0">
                      <Zap className="w-6 h-6 text-[#00F0FF] fill-[#00F0FF]/10" />
                      <div>
                        <p className="text-[10px] text-gray-500 font-mono uppercase leading-none">{t("activeStreak")}</p>
                        <p className="text-xs font-black text-white mt-1 uppercase tracking-wider">4 Days active</p>
                      </div>
                    </div>
                  </div>

                  {/* Level map grid (100 levels) */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-2 gap-3">
                      <h3 className="font-bold font-mono text-xs uppercase tracking-widest text-gray-400">{curriculum.length}-Level Robotics Roadmap</h3>
                      {/* Range selectors */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: "1-20", range: [1, 20] },
                          { label: "21-40", range: [21, 40] },
                          { label: "41-60", range: [41, 60] },
                          { label: "61-80", range: [61, 80] },
                          { label: "81-100", range: [81, 100] }
                        ].map((btn) => {
                          const isActive = roadmapRange[0] === btn.range[0];
                          return (
                            <button
                              key={btn.label}
                              onClick={() => setRoadmapRange(btn.range as [number, number])}
                              className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase transition-all rounded-none border ${
                                isActive
                                  ? "bg-[#00F0FF] text-black border-[#00F0FF] shadow-[1px_1px_0_rgba(0,255,65,0.3)]"
                                  : "bg-black text-gray-400 border-[#222] hover:border-gray-500 hover:text-white cursor-pointer"
                              }`}
                            >
                              Lvl {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {curriculum.filter(level => level.id >= roadmapRange[0] && level.id <= roadmapRange[1]).map((level) => {
                        const isUnlocked = level.id <= user.levelProgress;
                        const isCurrent = level.id === user.levelProgress;
                        const isCompleted = level.id < user.levelProgress || user.completedLessons.some(id => id.startsWith(`l${level.id}`));

                        return (
                          <div 
                            key={level.id}
                            onClick={() => {
                              if (isUnlocked) {
                                setSelectedLevel(level);
                                setSelectedLesson(level.lessons[0]);
                                setActiveTab("lessons");
                              }
                            }}
                            className={`border-2 p-4 flex flex-col justify-between aspect-[1/1] transition-all duration-300 relative rounded-none cursor-pointer ${
                              isCurrent 
                                ? "bg-[#0c0c0c] border-[#00F0FF] shadow-[4px_4px_0_rgba(0,255,65,0.15)] scale-102" 
                                : isCompleted
                                ? "bg-[#080808] border-[#111] text-gray-400 hover:border-gray-500"
                                : isUnlocked
                                ? "bg-black border-[#222] text-gray-300 hover:border-[#00F0FF]"
                                : "bg-[#020202] border-[#111] text-gray-700 opacity-40 cursor-not-allowed"
                            }`}
                          >
                            {/* Locked badge */}
                            {!isUnlocked && (
                              <div className="absolute top-3.5 right-3.5 text-gray-600">
                                <Lock className="w-4 h-4" />
                              </div>
                            )}

                            {/* Completed indicator */}
                            {isCompleted && (
                              <div className="absolute top-3.5 right-3.5 text-[#00F0FF]">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}

                            {/* Active arrow */}
                            {isCurrent && (
                              <div className="absolute top-3.5 right-3.5 bg-[#00F0FF] text-black p-0.5 rounded-none animate-bounce">
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            )}

                            {/* Level num */}
                            <span className="font-mono text-[10px] font-bold text-gray-500">LEVEL {level.id < 10 ? `0${level.id}` : level.id}</span>
                            
                            {/* Title info */}
                            <div className="space-y-1 my-3">
                              <h4 className="text-xs font-black text-white line-clamp-2 leading-tight uppercase font-mono">
                                {level.title[activeLang].replace(/^\d+-daraja:\s*|^\d+\s*уровень:\s*|^Level\s*\d+:\s*/gi, "")}
                              </h4>
                              <p className="text-[9px] text-gray-500 line-clamp-2 leading-snug font-mono">
                                {level.subtitle[activeLang]}
                              </p>
                            </div>

                            {/* Action footer */}
                            {isUnlocked ? (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#00F0FF] flex items-center gap-1">
                                {isCurrent ? "Active Unit" : "Enter Level"}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-600">
                                {t("locked")}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SMART AI INTELLECTUAL COURSES */}
              {activeTab === "ai-courses" && (
                <AICoursesView 
                  user={user} 
                  onUpdateUser={(updatedUser) => setUser(updatedUser)} 
                  lang={activeLang} 
                />
              )}

              {/* TAB 2: RICH LESSON VIEW (VIDEO, READ, SIMULATOR, CODE PLAYGROUND, AI CHAT MENTOR) */}
              {activeTab === "lessons" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="lessons-tab">
                  
                  {/* Left Side: Lesson & Interactive Tabs Workspace */}
                  <div className="xl:col-span-8 space-y-6">
                    
                    {/* Lesson selection bar */}
                    <div className="bg-[#080808] border-2 border-[#111] rounded-none p-4 flex items-center justify-between gap-4 font-mono">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">LEVEL {selectedLevel.id} • LESSON 01</span>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">{selectedLesson.title[activeLang]}</h2>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Bookmark lesson */}
                        <button 
                          onClick={() => toggleSaveLesson(selectedLesson.id)}
                          className={`p-2 rounded-none border-2 transition-all cursor-pointer ${
                            user.savedLessons?.includes(selectedLesson.id)
                              ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]"
                              : "bg-black hover:bg-[#111] border-[#222] text-gray-400"
                          }`}
                          title="Save Lesson"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Theory & Video Section */}
                    <div className="bg-[#080808] border-2 border-[#111] rounded-none overflow-hidden shadow-2xl space-y-4 font-mono">
                      
                      {/* Simulated YouTube Video Player */}
                      <div className="aspect-video w-full bg-black relative flex items-center justify-center border-b border-[#222]">
                        {selectedLesson.isPremium && !user.isPremium ? (
                          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <Lock className="w-12 h-12 text-[#00F0FF]" />
                            <div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t("premiumOnly")}</h3>
                              <p className="text-[11px] text-gray-400 max-w-sm mt-1">Upgrade your academy subscription to unlock premium video courses, hardware assembly lectures, and source code blueprints.</p>
                            </div>
                            <button 
                              onClick={() => setActiveTab("premium")}
                              className="bg-[#00F0FF] hover:bg-white text-black font-black uppercase text-xs px-5 py-2.5 rounded-none border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] cursor-pointer"
                            >
                              Go Premium ($19.99/mo)
                            </button>
                          </div>
                        ) : (
                          <iframe 
                            src={selectedLesson.videoUrl} 
                            title={selectedLesson.title[activeLang]}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                          ></iframe>
                        )}
                      </div>

                      {/* Lesson guide description */}
                      <div className="p-6 space-y-4 text-xs leading-relaxed text-gray-300 border-b border-[#222]">
                        <div className="flex items-center gap-2 text-[10px] text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-3 py-1 rounded-none self-start w-fit">
                          <FileText className="w-3.5 h-3.5" /> PDF LESSON COMPANION READY
                        </div>
                        
                        {/* Render localized lesson content (markdown structure formatted simply with CSS) */}
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-mono">
                          {selectedLesson.content[activeLang].split('\n').map((para, i) => {
                            if (para.startsWith('###')) {
                                return <h3 key={i} className="text-sm font-bold text-white mt-4 mb-2 uppercase border-b border-[#222] pb-1 text-[#00F0FF]">{para.replace('###', '')}</h3>;
                            }
                            if (para.startsWith('*')) {
                                return <li key={i} className="ml-4 list-disc text-gray-400 font-mono">{para.replace('*', '')}</li>;
                            }
                            return <p key={i} className="mb-2 leading-relaxed text-gray-400">{para}</p>;
                          })}
                        </div>
                      </div>
                    </div>

                    {/* INTERACTIVE WORKSPACE TABS (SIMULATOR, QUIZ, HOMEWORK) */}
                    <div className="bg-[#080808] border-2 border-[#111] rounded-none overflow-hidden shadow-2xl flex flex-col font-mono">
                      
                      {/* Workspace selector */}
                      <div className="bg-black px-4 py-1 flex border-b border-[#222]">
                        <button
                          onClick={() => setActiveLessonTab('simulation')}
                          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeLessonTab === 'simulation' ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-gray-500"
                          }`}
                        >
                          🔬 {t("navSimulator")}
                        </button>
                        <button
                          onClick={() => setActiveLessonTab('quiz')}
                          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeLessonTab === 'quiz' ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-gray-500"
                          }`}
                        >
                          📝 {t("quiz")}
                        </button>
                        <button
                          onClick={() => setActiveLessonTab('homework')}
                          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                            activeLessonTab === 'homework' ? "border-[#00F0FF] text-[#00F0FF]" : "border-transparent text-gray-500"
                          }`}
                        >
                          💻 {t("homework")}
                        </button>
                      </div>

                      <div className="p-6 flex-1">
                        
                        {/* Sub-tab 1: Interactive Simulator panel */}
                        {activeLessonTab === 'simulation' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Lesson Circuit Live Sandbox</h3>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">Play around with physical values or upload code on the playground to see active reactions.</p>
                              </div>
                            </div>
                            <div className="h-[360px]">
                              <SimulatorComponent 
                                type={selectedLesson.simulationType} 
                                currentLanguage={activeLang}
                                code={homeworkCode}
                              />
                            </div>
                          </div>
                        )}

                        {/* Sub-tab 2: Lesson Quiz */}
                        {activeLessonTab === 'quiz' && (
                          <form onSubmit={handleQuizSubmit} className="space-y-6">
                            <div>
                              <h3 className="font-black text-white text-sm uppercase tracking-wider">{selectedLesson.quiz.title[activeLang]}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Answer all questions correctly to pass this unit and unlock the next level.</p>
                            </div>

                            {/* Question list */}
                            <div className="space-y-6">
                              {selectedLesson.quiz.questions.map((q, qIdx) => (
                                <div key={q.id} className="bg-black p-4 rounded-none border border-[#222] space-y-3">
                                  <p className="font-bold text-[#00F0FF] text-[10px] font-mono uppercase tracking-wider">QUESTION 0{qIdx + 1}</p>
                                  <p className="text-xs font-semibold text-gray-300 leading-relaxed font-mono">{q.text[activeLang]}</p>
                                  
                                  {/* Radio options */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    {q.options.map((opt, optIdx) => (
                                      <button
                                        type="button"
                                        key={optIdx}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                                        className={`px-4 py-3 rounded-none text-xs font-mono text-left transition-all border cursor-pointer ${
                                          quizAnswers[q.id] === optIdx
                                            ? "bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]"
                                            : "bg-black border-[#222] text-gray-400 hover:border-gray-500"
                                        }`}
                                      >
                                        {opt[activeLang]}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {quizSubmitted ? (
                              <div className={`p-4 rounded-none border flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono ${
                                quizPassed 
                                  ? "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]" 
                                  : "bg-red-500/10 border-red-500/30 text-red-400"
                              }`}>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-xs uppercase tracking-wider">{quizPassed ? t("congrats") : t("quizFailed")}</h4>
                                  <p className="text-[10px] text-gray-500">Score: {quizScore} / {selectedLesson.quiz.questions.length}</p>
                                </div>
                                {!quizPassed && (
                                  <button
                                    type="button"
                                    onClick={() => setQuizSubmitted(false)}
                                    className="bg-black hover:bg-red-500/10 text-red-400 border border-red-500/50 px-4 py-2 rounded-none text-xs font-bold cursor-pointer uppercase"
                                  >
                                    Retry Test
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                type="submit"
                                className="bg-[#00F0FF] hover:bg-white text-black font-black uppercase tracking-wider text-xs px-6 py-3 rounded-none border border-black shadow-[4px_4px_0_rgba(0,255,65,0.4)] transition-all cursor-pointer"
                              >
                                {t("submitQuiz")}
                              </button>
                            )}
                          </form>
                        )}

                        {/* Sub-tab 3: Coding Homework Playground */}
                        {activeLessonTab === 'homework' && (
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-black text-white text-sm uppercase tracking-wider">{selectedLesson.homework.title[activeLang]}</h3>
                              <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{selectedLesson.homework.description[activeLang]}</p>
                            </div>

                            {/* Split code screen */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                              <div className="lg:col-span-8 space-y-2">
                                <span className="text-[10px] text-gray-500 font-mono font-bold block uppercase">{t("codePlayground")}</span>
                                <textarea
                                  value={homeworkCode}
                                  onChange={(e) => setHomeworkCode(e.target.value)}
                                  rows={12}
                                  className="w-full bg-black border border-[#222] p-4 rounded-none font-mono text-xs text-[#00F0FF] leading-relaxed outline-none focus:border-[#00F0FF]"
                                ></textarea>
                                
                                <div className="flex gap-3 pt-1">
                                  <button
                                    onClick={handleRunCode}
                                    className="bg-black hover:bg-[#111] text-[#00F0FF] border border-[#222] px-4 py-2 rounded-none text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-[#00F0FF]" />
                                    {t("playCode")}
                                  </button>

                                  <button
                                    disabled={homeworkIsSubmitting}
                                    onClick={handleHomeworkSubmit}
                                    className="bg-[#00F0FF] hover:bg-white text-black font-black uppercase tracking-wider text-xs px-5 py-2.5 rounded-none border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                                    id="submit-homework-ai-btn"
                                  >
                                    {homeworkIsSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                    {t("submitHomework")} (AI Mentor)
                                  </button>
                                </div>
                              </div>

                              <div className="lg:col-span-4 space-y-4">
                                {/* Local simulator compiling output */}
                                <div className="bg-[#050505] rounded-none border border-[#222] overflow-hidden font-mono text-[10px] h-36 flex flex-col">
                                  <div className="bg-black px-3 py-1.5 text-gray-500 border-b border-[#222] uppercase font-bold tracking-wider">Terminal Compiler</div>
                                  <div className="flex-1 p-3 text-gray-400 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                                    {simulatedCodeOutput || "Compiler idle. Click Run Code..."}
                                  </div>
                                </div>

                                {/* Homework Evaluation Feedback Card */}
                                {homeworkFeedback && (
                                  <div className={`p-4 rounded-none border-2 space-y-3 font-mono ${
                                    homeworkFeedback.isPassed 
                                      ? "bg-green-500/10 border-green-500/30 text-green-400" 
                                      : "bg-red-500/10 border-red-500/30 text-red-400"
                                  }`}>
                                    <div className="flex justify-between items-center border-[#222] border-b pb-2">
                                      <span className="font-mono text-[10px] font-bold">ROBOAI RATING</span>
                                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded-none bg-black border border-[#222] text-[#00F0FF]">{homeworkFeedback.grade}</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed font-mono">{homeworkFeedback.feedback}</p>
                                    
                                    {homeworkFeedback.hints && homeworkFeedback.hints.length > 0 && (
                                      <div className="space-y-1 pt-1.5">
                                        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Hints / Suggestions:</p>
                                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-400 font-sans">
                                          {homeworkFeedback.hints.map((hint: string, i: number) => (
                                            <li key={i}>{hint}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                  </div>

                  {/* Right Side: EduAI Floating Mentor Panel (Gemini powered) */}
                  <div className="xl:col-span-4 bg-[#080808] border-2 border-[#111] rounded-none overflow-hidden shadow-2xl h-[560px] flex flex-col sticky top-24 font-mono" id="ai-mentor-panel">
                    <div className="bg-black px-4 py-4 border-b border-[#222] flex items-center gap-3">
                      <div className="bg-[#00F0FF]/15 p-2 rounded-none text-[#00F0FF] border border-[#00F0FF]/30">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-white uppercase tracking-wider">{t("aiMentor")}</h3>
                        <span className="text-[9px] text-[#00F0FF] font-mono uppercase tracking-widest">Gemini AI Assistant • Online</span>
                      </div>
                    </div>

                    {/* Chat Feed */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
                      {aiMentorMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3 font-mono">
                          <Cpu className="w-10 h-10 text-gray-800" />
                          <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-mono uppercase tracking-wide">
                            Assalomu alaykum! I am EduAI, your personal engineering copilot. Ask me to debug your Arduino loops, outline Ohm's law, or translate complex concepts!
                          </p>
                        </div>
                      ) : (
                        aiMentorMessages.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] p-3 rounded-none text-xs font-mono border ${
                              msg.sender === 'user' 
                                ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30' 
                                : 'bg-black text-gray-300 border-[#222] leading-relaxed'
                            }`}>
                              <p className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">{msg.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {aiMentorLoading && (
                        <div className="flex justify-start">
                          <div className="bg-black p-3 rounded-none border border-[#222] text-xs text-gray-500 flex items-center gap-2 font-mono">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00F0FF]" />
                            {t("mentorThinking")}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleAskMentor} className="p-3 bg-black border-t border-[#222] flex gap-2">
                      <input
                        type="text"
                        value={aiMentorInput}
                        onChange={(e) => setAiMentorInput(e.target.value)}
                        placeholder={t("mentorPlaceholder")}
                        className="flex-1 bg-[#080808] border border-[#222] rounded-none px-4 py-2.5 text-xs text-gray-200 outline-none focus:border-[#00F0FF]"
                      />
                      <button
                        type="submit"
                        disabled={aiMentorLoading}
                        className="bg-[#00F0FF] hover:bg-white text-black p-2.5 rounded-none flex items-center justify-center transition-all cursor-pointer shrink-0"
                      >
                        <Send className="w-4 h-4 text-black" />
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* TAB 3: STANDALONE ROBOTICS SIMULATOR SANDBOX */}
              {activeTab === "simulator" && (
                <div className="space-y-6" id="sandbox-simulator-tab">
                  <div className="bg-[#080808] border-2 border-[#111] p-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wider">
                        <Zap className="text-[#00F0FF] w-5 h-5 animate-pulse" />
                        EduSphere Sandbox Laboratory
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">Simulate any hardware layout, wiring diagram, and sensor telemetry on demand.</p>
                    </div>

                    {/* Simulator Select dropdown */}
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SELECT DEVICE:</span>
                      <select 
                        value={sandboxType} 
                        onChange={(e: any) => setSandboxType(e.target.value)}
                        className="bg-black text-[#00F0FF] border-2 border-[#111] rounded-none px-4 py-2 text-xs font-bold outline-none cursor-pointer uppercase font-mono tracking-wider"
                      >
                        <option value="led" className="bg-black text-[#00F0FF]">Level 2: Resistor & LED Circuit</option>
                        <option value="servo" className="bg-black text-[#00F0FF]">Level 3: PWM Servo Positioner</option>
                        <option value="ultrasonic" className="bg-black text-[#00F0FF]">Level 6: Sonar Distance Warn Alert</option>
                        <option value="iot-web" className="bg-black text-[#00F0FF]">Level 4: ESP32 IoT WiFi Server</option>
                        <option value="line-follower" className="bg-black text-[#00F0FF]">Level 7: PID Line Follower Chassis</option>
                        <option value="cv-grid" className="bg-black text-[#00F0FF]">Level 8: AI YOLOv8 Camera Detector</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-[460px] border-2 border-[#111] bg-black p-4 rounded-none">
                    <SimulatorComponent type={sandboxType} currentLanguage={activeLang} />
                  </div>
                </div>
              )}

              {/* TAB 4: STUDENT COMMUNITY FORUM */}
              {activeTab === "community" && (
                <ForumView 
                  currentLanguage={activeLang} 
                  token={token} 
                  username={user.username} 
                />
              )}

              {/* TAB 5: TELEGRAM VERIFICATION SIMULATOR */}
              {activeTab === "telegram" && (
                <TelegramView 
                  currentLanguage={activeLang}
                  token={token}
                  user={user}
                  onUserUpdate={(u) => setUser(u)}
                />
              )}

              {/* TAB 6: PREMIUM SUBSCRIPTION MATRIX */}
              {activeTab === "premium" && (
                <div className="max-w-3xl mx-auto py-6 space-y-8 font-mono" id="premium-pricing-page">
                  <div className="text-center space-y-3">
                    <Star className="w-10 h-10 text-[#00F0FF] fill-[#00F0FF]/10 mx-auto animate-pulse" />
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">{t("premiumTitle")}</h2>
                    <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">{t("premiumDesc")}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 font-mono text-xs">
                    
                    {/* Tier 1 (Active standard) */}
                    <div className="bg-[#080808] border-2 border-[#111] rounded-none p-6 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">TIER 1</span>
                          <h3 className="text-xs font-black text-white uppercase mt-1 tracking-wider">BASIC / FREE PLAN</h3>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-mono">Access to level lessons, interactive standard simulators, basic quizzes, and profile tracking.</p>
                        
                        <div className="border-t border-[#111] pt-4 space-y-3 font-mono text-gray-400">
                          <p className="flex items-center gap-2">✓ Level 1 to 10 Roadmap access</p>
                          <p className="flex items-center gap-2">✓ Virtual circuits simulators</p>
                          <p className="text-gray-700 flex items-center gap-2">✗ Premium video assemblies</p>
                          <p className="text-gray-700 flex items-center gap-2">✗ Direct Muhandis certifications</p>
                        </div>
                      </div>
                      <span className="w-full text-center py-2.5 rounded-none border border-[#111] text-gray-600 font-bold uppercase tracking-wider bg-black">ACTIVE BY DEFAULT</span>
                    </div>

                    {/* Tier 2 (Premium unlock) */}
                    <div className="bg-[#0c0c0c] border-2 border-[#00F0FF] rounded-none p-6 flex flex-col justify-between space-y-6 shadow-2xl relative shadow-[4px_4px_0_rgba(0,255,65,0.1)]">
                      <div className="absolute -top-3 right-6 bg-[#00F0FF] text-black text-[9px] font-black uppercase px-3 py-1 rounded-none border border-black font-mono">
                        BEST CHOICE
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-[9px] font-mono text-[#00F0FF] uppercase tracking-widest">TIER 2</span>
                          <h3 className="text-xs font-black text-white uppercase mt-1 tracking-wider">PRO ENGINEER PLAN</h3>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-mono">Unlock advanced full-length lessons, capstone direct exams, unlimited EduAI mentor prompts, and official diplomas.</p>
                        
                        <div className="border-t border-[#111] pt-4 space-y-3 font-mono text-gray-300">
                          <p className="text-[#00F0FF] flex items-center gap-2">✓ Everything in Basic</p>
                          <p className="text-[#00F0FF] flex items-center gap-2">✓ Premium source code STLs</p>
                          <p className="text-[#00F0FF] flex items-center gap-2">✓ AI-based direct homework feedback</p>
                          <p className="text-[#00F0FF] flex items-center gap-2">✓ Verified Robotics diplomas</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline justify-center gap-1.5 font-mono">
                          <span className="text-xl font-black text-white uppercase tracking-tight">{t("premiumPrice")}</span>
                        </div>
                        
                        {user.isPremium ? (
                          <span className="w-full text-center py-2.5 rounded-none border border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF] font-bold block uppercase tracking-wider">
                            {t("isPremiumUser")}
                          </span>
                        ) : (
                          <button
                            onClick={buyPremiumSimulate}
                            className="w-full bg-[#00F0FF] hover:bg-white text-black font-black uppercase tracking-wider text-xs py-2.5 rounded-none border border-black shadow-[3px_3px_0_rgba(0,255,65,0.4)] transition-all cursor-pointer text-center"
                          >
                            {t("buyPremium")}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 7: ADMIN CONTROL PANEL PANEL */}
              {activeTab === "admin" && (
                <AdminView 
                  currentLanguage={activeLang}
                  token={token}
                  currentUser={user}
                  onAdminLoginSuccess={(adminUser, adminToken) => {
                    setUser(adminUser);
                    setToken(adminToken);
                  }}
                />
              )}

            </div>
          )}

        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="bg-black py-6 border-t-2 border-[#111] mt-auto font-mono text-[9px] text-gray-600 text-center uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EduSphere Academy. Built for global cyber-physical excellence.</p>
          <div className="flex gap-4">
            <span className="text-gray-500 hover:text-[#00F0FF] cursor-pointer" onClick={() => setActiveTab("dashboard")}>{t("navDashboard")}</span>
            <span className="text-gray-500 hover:text-[#00F0FF] cursor-pointer" onClick={() => setActiveTab("lessons")}>{t("navLessons")}</span>
            <span className="text-gray-500 hover:text-[#00F0FF] cursor-pointer" onClick={() => setActiveTab("simulator")}>{t("navSimulator")}</span>
          </div>
        </div>
      </footer>

      {/* Floating EduAI Voice & Chat Assistant */}
      {user && (
        <AIAssistant 
          user={user} 
          activeTab={activeTab} 
          onNavigate={(tab) => setActiveTab(tab)} 
          activeLesson={selectedLesson} 
          lang={activeLang} 
        />
      )}

    </div>
  );
}
