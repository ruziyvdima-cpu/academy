import React, { useState } from "react";
import { 
  Award, BookOpen, Brain, Check, ChevronRight, Cpu, 
  HelpCircle, Lock, GraduationCap, RefreshCw, Sparkles, 
  User, CheckCircle2, ChevronLeft, Volume2, X 
} from "lucide-react";
import { User as UserType } from "../types";

// Static placement exams for each course
const placementExams: Record<string, Array<{ q: string, options: string[], correct: number, exp: string }>> = {
  math: [
    {
      q: "9 + 8 - 4 = ?",
      options: ["11", "13", "15", "12"],
      correct: 1,
      exp: "9 + 8 = 17, undan 4 ni ayirsak 13 bo'ladi."
    },
    {
      q: "Agar 3 ta qalam 900 so'm tursa, 5 ta qalam qancha turadi?",
      options: ["1200", "1500", "1800", "2000"],
      correct: 1,
      exp: "Bitta qalam 900 / 3 = 300 so'm. 5 ta qalam 300 * 5 = 1500 so'm bo'ladi."
    },
    {
      q: "Mental arifmetikada 'Abakus' nima?",
      options: ["Elektron kalkulyator", "Qadimiy hisoblash taxtasi (cho't)", "Chizg'ich turi", "Matematik o'yin"],
      correct: 1,
      exp: "Abakus mental arifmetikada ishlatiladigan an'anaviy cho't yoki hisoblash taxtasidir."
    },
    {
      q: "Qaysi shaklning barcha tomonlari teng?",
      options: ["To'g'ri to'rtburchak", "Kvadrat", "Uchburchak", "Trapetsiya"],
      correct: 1,
      exp: "Kvadratning to'rttala tomoni ham bir-biriga teng bo'ladi."
    },
    {
      q: "15 ning yarmini 10 ga qo'shsak necha bo'ladi?",
      options: ["17.5", "15", "25", "20"],
      correct: 0,
      exp: "15 ning yarmi 7.5. Uni 10 ga qo'shganda 17.5 chiqadi."
    }
  ],
  algebra: [
    {
      q: "3x - 7 = 11 tenglamani yeching.",
      options: ["x = 4", "x = 6", "x = 5", "x = 3"],
      correct: 1,
      exp: "3x = 11 + 7 => 3x = 18 => x = 6."
    },
    {
      q: "Uchburchakning ichki burchaklari yig'indisi necha darajaga teng?",
      options: ["90°", "180°", "270°", "360°"],
      correct: 1,
      exp: "Istalgan uchburchakning ichki burchaklari yig'indisi doimo 180 gradusni tashkil qiladi."
    },
    {
      q: "f(x) = 2x + 3 funksiyaning x=5 dagi qiymatini toping.",
      options: ["10", "13", "15", "8"],
      correct: 1,
      exp: "f(5) = 2*5 + 3 = 13."
    },
    {
      q: "Doira yuzi qaysi formula orqali hisoblanadi?",
      options: ["S = 2πr", "S = πr²", "S = a * b", "S = a²"],
      correct: 1,
      exp: "Doira yuzini hisoblash formulasi S = pi * r kvadrat hisoblanadi."
    },
    {
      q: "Agar to'g'ri burchakli uchburchak katetlari 3 va 4 bo'lsa, gipotenuzasi qancha?",
      options: ["5", "6", "7", "8"],
      correct: 0,
      exp: "Pifagor teoremasiga ko'ra: c² = 3² + 4² = 9 + 16 = 25 => c = 5."
    }
  ],
  english: [
    {
      q: "Choose the correct sentence: 'I ___ English right now.'",
      options: ["am study", "is studying", "am studying", "studies"],
      correct: 2,
      exp: "With 'right now', we use Present Continuous: 'am studying'."
    },
    {
      q: "What is the past tense of the verb 'go'?",
      options: ["goed", "went", "gone", "goes"],
      correct: 1,
      exp: "The past tense of the irregular verb 'go' is 'went'."
    },
    {
      q: "Complete: 'She is interested ___ learning robotics.'",
      options: ["on", "at", "in", "with"],
      correct: 2,
      exp: "The adjective 'interested' takes the preposition 'in'."
    },
    {
      q: "Which word is a synonym for 'smart'?",
      options: ["slow", "intelligent", "lazy", "boring"],
      correct: 1,
      exp: "'Intelligent' is a synonym for 'smart'."
    },
    {
      q: "If you want to ask for permission, which modal verb do you use?",
      options: ["must", "may", "will", "should"],
      correct: 1,
      exp: "'May' or 'Can' are used to ask for permission politely."
    }
  ],
  "computer-literacy": [
    {
      q: "Kompyuterning miyasi (asosiy hisoblash qurilmasi) nima deb ataladi?",
      options: ["Monitor", "RAM", "CPU (Protsessor)", "Hard Drive"],
      correct: 2,
      exp: "CPU (Central Processing Unit) kompyuterda barcha hisoblash va amallarni bajaruvchi 'miya' hisoblanadi."
    },
    {
      q: "Fayl tizimida STL kengaytmasi nima uchun ishlatiladi?",
      options: ["Musiqa tinglash", "Matn yozish", "3D Modellar / 3D bosib chiqarish", "Video ko'rish"],
      correct: 2,
      exp: "STL formatidagi fayllar 3D bosib chiqarish yoki 3D modellashtirish dasturlari uchun mo'ljallangan."
    },
    {
      q: "Xavfsiz parolni qanday belgilash kerak?",
      options: ["'123456'", "O'z tug'ilgan yili", "Katta-kichik harflar, raqamlar va maxsus belgilar aralashmasi", "Faqat ism"],
      correct: 2,
      exp: "Murakkab parolda katta va kichik harflar, raqamlar hamda maxsus belgilar (@, #, $, %) bo'likligi xavfsizlikni oshiradi."
    },
    {
      q: "Veb-saytlarni ochish va ko'rish uchun mo'ljallangan dastur nima?",
      options: ["Matn muharriri", "Brauzer (masalan, Google Chrome)", "Antivirus", "Kalkulyator"],
      correct: 1,
      exp: "Brauzerlar (Chrome, Firefox, Safari) internet saytlarini ochish va tahlil qilish uchun asosiy dasturlardir."
    },
    {
      q: "Sarlavhada 'URL' qisqartmasi nima?",
      options: ["Foydalanuvchi nomi", "Veb-sahifaning internetdagi aniq manzili (havola)", "Elektron pochta", "Kompaniya nomi"],
      correct: 1,
      exp: "URL (Uniform Resource Locator) internet tarmog'idagi har qanday fayl yoki veb-sahifaning global manzilidir."
    }
  ]
};

interface AICoursesViewProps {
  user: UserType;
  onUpdateUser: (u: UserType) => void;
  lang: "uz" | "ru" | "en";
}

export const AICoursesView: React.FC<AICoursesViewProps> = ({ user, onUpdateUser, lang }) => {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  
  // Age configuration
  const [inputAge, setInputAge] = useState<string>(user.age ? String(user.age) : "");
  const [isUpdatingAge, setIsUpdatingAge] = useState(false);

  // Exam phase
  const [examActive, setExamActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);

  // Course generation phase
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Active generated course view
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFeedback, setQuizFeedback] = useState<boolean | null>(null);

  const t = (key: string): string => {
    const local: Record<string, Record<string, string>> = {
      title: {
        uz: "AI Intellektual O'quv Markazi",
        ru: "Интеллектуальный ИИ-Центр Обучения",
        en: "AI Intelligent Learning Hub"
      },
      desc: {
        uz: "Sun'iy intellekt tomonidan boshqariladigan shaxsiylashtirilgan o'quv dasturlari. Imtihon topshiring va shaxsiy darslaringizga ega bo'ling!",
        ru: "Персонализированные учебные программы под управлением ИИ. Сдайте экзамен и получите свой индивидуальный курс!",
        en: "Personalized curricula powered by artificial intelligence. Pass the exam and receive your tailor-made course!"
      },
      ageGating: {
        uz: "Yosh chegarasi tahlili",
        ru: "Возрастной анализ",
        en: "Age Gating Matrix"
      },
      enterAge: {
        uz: "Yoshingizni kiriting:",
        ru: "Введите ваш возраст:",
        en: "Enter your age:"
      },
      saveAge: {
        uz: "Saqlash",
        ru: "Сохранить",
        en: "Save"
      },
      takeExam: {
        uz: "Daraja Aniqlash Imtihoni",
        ru: "Вступительный экзамен",
        en: "Take Placement Exam"
      },
      generateCourse: {
        uz: "AI Shaxsiy Kursni Yaratish",
        ru: "Сгенерировать курс ИИ",
        en: "Generate Personalized AI Course"
      },
      congrats: {
        uz: "Tabriklaymiz! Kurs muvaffaqiyatli yakunlandi.",
        ru: "Поздравляем! Курс успешно завершен.",
        en: "Congratulations! Course successfully completed."
      }
    };
    return local[key]?.[lang] || local[key]?.["uz"] || key;
  };

  // Age update handler
  const handleSaveAge = async () => {
    const ageNum = parseInt(inputAge);
    if (!ageNum || ageNum < 5 || ageNum > 100) {
      alert(lang === "uz" ? "Iltimos, haqiqiy yoshni kiriting." : "Please enter a valid age.");
      return;
    }
    setIsUpdatingAge(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.id}`
        },
        body: JSON.stringify({ age: ageNum })
      });
      const data = await response.json();
      if (data.success) {
        onUpdateUser(data.user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingAge(false);
    }
  };

  // Exam handler
  const startExam = (courseId: string) => {
    setActiveCourse(courseId);
    setExamActive(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswers([]);
    setExamFinished(false);
  };

  const handleSelectOption = (optIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIdx] = optIdx;
    setSelectedAnswers(updated);
  };

  const nextQuestion = () => {
    if (selectedAnswers[currentQuestionIdx] === undefined) {
      alert(lang === "uz" ? "Davom etishdan oldin variant tanlang!" : "Select an option before continuing!");
      return;
    }
    if (currentQuestionIdx < 4) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate score
      const questions = placementExams[activeCourse!];
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          score++;
        }
      });
      setExamScore(score);
      setExamFinished(true);
    }
  };

  // Call API to generate course using Gemini 3.5
  const handleGenerateCourse = async () => {
    setExamActive(false);
    setIsGenerating(true);
    setGenerationStep(0);

    const steps = [
      lang === "uz" ? "Imtihon natijalari chuqur tahlil qilinmoqda..." : "Analyzing placement test data...",
      lang === "uz" ? "Yosh guruhi va darajaga mos mavzular saralanmoqda..." : "Matching age gating and complexity...",
      lang === "uz" ? "Gemini 3.5 AI tomonidan 10 ta shaxsiy dars yozilmoqda..." : "Generating 10 customized lectures via Gemini 3.5...",
      lang === "uz" ? "Darslarga doir interaktiv kviz savollari tayyorlanmoqda..." : "Creating personalized lesson quizzes...",
      lang === "uz" ? "Kurs dasturi to'liq yakunlanmoqda..." : "Finishing and saving custom curriculum..."
    ];

    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1500);

    try {
      const response = await fetch("/api/ai/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.id}`
        },
        body: JSON.stringify({
          courseId: activeCourse,
          score: examScore,
          age: user.age || 12,
          lang: lang
        })
      });
      const data = await response.json();
      if (data.success) {
        clearInterval(interval);
        onUpdateUser(data.user);
        setSelectedLessonId(data.course.lessons[0].id);
      } else {
        alert(data.error || "Generation error");
      }
    } catch (e) {
      console.error(e);
      alert("Network error while generating course");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  // Submit Lesson Quiz handler
  const handleAnswerQuizQuestion = (qIdx: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitLessonQuiz = async (quiz: any, lessonId: string) => {
    const totalQuestions = quiz.questions.length;
    let correctCount = 0;
    quiz.questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    if (correctCount === totalQuestions) {
      setQuizFeedback(true);
      setQuizSubmitted(true);
      // Save progress to server
      try {
        const response = await fetch("/api/ai/save-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.id}`
          },
          body: JSON.stringify({
            lessonId,
            quizId: quiz.id,
            courseId: activeCourse
          })
        });
        const data = await response.json();
        if (data.success) {
          onUpdateUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setQuizFeedback(false);
      setQuizSubmitted(true);
    }
  };

  const handleNextLesson = (lessons: any[]) => {
    setQuizSubmitted(false);
    setQuizAnswers({});
    setQuizFeedback(null);
    const curIdx = lessons.findIndex(l => l.id === selectedLessonId);
    if (curIdx !== -1 && curIdx < lessons.length - 1) {
      setSelectedLessonId(lessons[curIdx + 1].id);
    }
  };

  // Course structures
  const standardCourses = [
    {
      id: "math",
      title: { uz: "Matematika va Mental Arifmetika", ru: "Математика и Ментальная Арифметика", en: "Mathematics & Mental Math" },
      desc: { uz: "Tezkor arifmetika sirlari va mantiqiy hisoblashlar. Yosh chegarasi: 12 yoshgacha.", ru: "Секреты быстрого счета и логика. Возраст: до 12 лет.", en: "Fast mental calculations and arithmetic. Age: under 12." },
      ageRequirement: "< 12",
      icon: Brain,
      color: "border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    },
    {
      id: "algebra",
      title: { uz: "Algebra va Geometriya", ru: "Алгебра и Геометрия", en: "Algebra & Geometry" },
      desc: { uz: "Tenglamalar tizimi, koordinatalar tekisligi va geometric teoremalar isboti. Yosh chegarasi: 12+.", ru: "Системы уравнений, геометрия и тригонометрия. Возраст: 12+.", en: "Equations, coordinate planes and geometric proofs. Age: 12+." },
      ageRequirement: ">= 12",
      icon: Cpu,
      color: "border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
    },
    {
      id: "english",
      title: { uz: "Ingliz Tili (English Language)", ru: "Английский Язык", en: "English Language" },
      desc: { uz: "Gramatika, so'z boyligi va so'zlashuv darslari. Imtihondan so'ng AI siz uchun mavzu tayyorlaydi.", ru: "Грамматика, лексика и говорение. ИИ подготовит темы под ваш уровень.", en: "Grammar patterns, vocabulary building. AI will prepare lessons based on your level." },
      ageRequirement: "all",
      icon: GraduationCap,
      color: "border-sky-500 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]"
    },
    {
      id: "computer-literacy",
      title: { uz: "Kompyuter Savodxonligi", ru: "Компьютерная грамотность", en: "Computer Literacy" },
      desc: { uz: "Operatsion tizimlar, xavfsizlik, internet va dasturlash mantig'i asoslari.", ru: "Операционные системы, безопасность, интернет и логика программирования.", en: "Operating systems, safety protocols, internet skills, and programming basics." },
      ageRequirement: "all",
      icon: BookOpen,
      color: "border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
    }
  ];

  const currentAge = user.age || 12;

  return (
    <div className="w-full space-y-6 text-gray-200 font-mono" id="ai-smart-courses-tab">
      
      {/* Top Banner */}
      <div className="bg-[#080808] border-2 border-[#111] p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00F0FF] animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-[#00F0FF] uppercase">AI-DRIVEN EDUCATION</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">{t("title")}</h2>
          <p className="text-xs text-gray-400 max-w-xl leading-relaxed font-sans">{t("desc")}</p>
        </div>

        {/* Age input gate */}
        <div className="bg-black border border-[#222] p-4 flex flex-col gap-2 min-w-[200px]">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{t("ageGating")}</span>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={inputAge}
              onChange={(e) => setInputAge(e.target.value)}
              placeholder="12"
              className="w-16 bg-black border border-[#333] text-white p-1 text-center text-xs focus:outline-none focus:border-[#00F0FF]"
            />
            <button 
              onClick={handleSaveAge}
              disabled={isUpdatingAge}
              className="px-3 py-1 bg-[#00F0FF] text-black font-bold text-[10px] uppercase hover:bg-white transition-all cursor-pointer"
            >
              {isUpdatingAge ? "..." : t("saveAge")}
            </button>
          </div>
          <span className="text-[8px] text-gray-600 font-sans">
            Hozirgi yosh: <strong className="text-white">{user.age || "Belgilanmagan (12)"} yosh</strong>
          </span>
        </div>
      </div>

      {/* EXAM ACTIVE VIEW */}
      {examActive && (
        <div className="bg-[#080808] border-2 border-[#00F0FF] p-6 space-y-6" id="placement-exam-section">
          <div className="flex items-center justify-between border-b border-[#222] pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#00F0FF]" />
              <h3 className="font-bold text-sm uppercase text-white tracking-wider">
                {placementExams[activeCourse!] ? `Placement Exam: ${activeCourse?.toUpperCase()}` : "Exam"}
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-400">Question {currentQuestionIdx + 1} of 5</span>
          </div>

          {!examFinished ? (
            <div className="space-y-4">
              <p className="text-sm font-bold text-white">{placementExams[activeCourse!][currentQuestionIdx].q}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {placementExams[activeCourse!][currentQuestionIdx].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-3 text-left border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF] font-black" 
                          : "bg-black border-[#222] text-gray-400 hover:border-gray-500 hover:text-white"
                      }`}
                    >
                      {oIdx + 1}. {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#222]">
                <button
                  onClick={() => setExamActive(false)}
                  className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs uppercase cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={nextQuestion}
                  className="px-5 py-2 bg-[#00F0FF] text-black font-bold text-xs uppercase hover:bg-white transition-all cursor-pointer"
                >
                  {currentQuestionIdx === 4 ? "Imtihonni yakunlash" : "Keyingi savol"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center py-6">
              <Award className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Imtihon Yakunlandi!</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Siz 5 ta savoldan <span className="text-[#00F0FF] font-black text-sm">{examScore} tasiga</span> to'g'ri javob berdingiz.
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Darajangiz: <strong className="text-white">{examScore === 5 ? "Yuqori (Expert)" : examScore >= 3 ? "O'rta (Intermediate)" : "Boshlang'ich (Beginner)"}</strong>
                </p>
              </div>

              {/* Display wrong answers explanation */}
              <div className="text-left max-w-xl mx-auto space-y-3 bg-black border border-[#222] p-4 text-xs">
                <h5 className="font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#222] pb-1">Tahlil va Tushuntirishlar:</h5>
                {placementExams[activeCourse!].map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correct;
                  return (
                    <div key={idx} className="space-y-1">
                      <p className="font-semibold text-gray-300">{idx+1}. {q.q} {isCorrect ? "✅" : "❌"}</p>
                      <p className="text-[10px] text-gray-500 font-sans italic leading-relaxed">{q.exp}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setExamActive(false)}
                  className="px-5 py-2.5 border border-[#333] hover:border-gray-500 text-xs uppercase cursor-pointer"
                >
                  Yopish
                </button>
                <button
                  onClick={handleGenerateCourse}
                  className="px-6 py-2.5 bg-[#00F0FF] text-black font-black text-xs uppercase shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:bg-white transition-all cursor-pointer"
                >
                  ⚡ AI Orqali Shaxsiy Kursni Yaratish
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI GENERATION LOADING ANIMATION */}
      {isGenerating && (
        <div className="bg-black border-2 border-[#222] p-8 text-center space-y-6" id="ai-generating-loader">
          <div className="w-16 h-16 rounded-full border-4 border-t-[#00F0FF] border-[#111] animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">Gemini 3.5 AI shaxsiy o'quv dasturini tayyorlamoqda...</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Sizning yoshingiz ({currentAge}), darajangiz ({examScore}/5) va til parametrlariga mos ravishda 10 ta dars, nazariy kitob va dars kvizlari generatsiya qilinmoqda.
            </p>
          </div>
          {/* Status step indicator */}
          <div className="max-w-xs mx-auto space-y-1.5 text-[9px] font-mono uppercase text-left border border-[#111] bg-[#050505] p-3">
            {[0, 1, 2, 3, 4].map((stepIdx) => {
              const steps = [
                "1. Placement test analysis",
                "2. Age group gating checklist",
                "3. Writing theory content & examples",
                "4. Structuring interactive quizzes",
                "5. Saving customized database"
              ];
              const isCompleted = generationStep > stepIdx;
              const isActive = generationStep === stepIdx;
              return (
                <div key={stepIdx} className={`flex items-center gap-2 ${isCompleted ? "text-[#00F0FF]" : isActive ? "text-amber-400 animate-pulse" : "text-gray-600"}`}>
                  <span>{isCompleted ? "✓" : isActive ? "▶" : "○"}</span>
                  <span>{steps[stepIdx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED ACTIVE CUSTOM COURSE STUDY WORKSPACE */}
      {!examActive && !isGenerating && activeCourse && user.customCourses?.[activeCourse] && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="custom-course-workspace">
          
          {/* Left panel: 5 Lessons List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#080808] border-2 border-[#111] p-4 space-y-3">
              <button 
                onClick={() => setActiveCourse(null)}
                className="flex items-center gap-1 text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Barcha kurslarga qaytish
              </button>
              
              <div>
                <span className="text-[8px] bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 px-1 font-mono uppercase tracking-widest font-black">AI PERSONALIZED</span>
                <h3 className="text-sm font-black text-white uppercase tracking-tight mt-1">
                  {user.customCourses[activeCourse].courseTitle}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
                  Daraja: <span className="text-white">{user.customCourses[activeCourse].levelName}</span>
                </p>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2">
              {user.customCourses[activeCourse].lessons.map((lesson: any, index: number) => {
                const isSelected = selectedLessonId === lesson.id;
                const isCompleted = user.completedLessons?.includes(lesson.id);
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                      setQuizFeedback(null);
                    }}
                    className={`w-full p-4 border-2 text-left transition-all rounded-none flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected 
                        ? "bg-[#00F0FF]/10 border-[#00F0FF] shadow-[3px_3px_0_rgba(0,255,65,0.2)]" 
                        : "bg-black border-[#111] hover:border-gray-700"
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-gray-500 uppercase">Dars {index + 1}</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[200px]">{lesson.title}</h4>
                      <p className="text-[10px] text-gray-400 truncate max-w-[220px] font-sans">{lesson.description}</p>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00F0FF] shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active lesson reader and Quiz */}
          <div className="lg:col-span-8 space-y-6">
            {(() => {
              const currentCourseData = user.customCourses[activeCourse];
              const lesson = currentCourseData.lessons.find((l: any) => l.id === selectedLessonId);
              if (!lesson) return null;

              const isCompleted = user.completedLessons?.includes(lesson.id);

              return (
                <div className="bg-[#080808] border-2 border-[#111] p-6 space-y-6">
                  
                  {/* Lesson header */}
                  <div className="border-b border-[#222] pb-4 space-y-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">PERSONALIZED AI STUDY PATH</span>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{lesson.title}</h3>
                    <p className="text-xs text-gray-400 font-sans">{lesson.description}</p>
                  </div>

                  {/* Theoretical Content */}
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 text-gray-300 font-sans border-b border-[#222] pb-6">
                    {/* Render plain lines with formatting wrapper */}
                    {lesson.content.split("\n\n").map((para: string, pIdx: number) => {
                      if (para.startsWith("### ")) {
                        return <h4 key={pIdx} className="text-white text-xs uppercase font-black font-mono tracking-wider pt-2">{para.replace("### ", "")}</h4>;
                      }
                      if (para.startsWith("- ") || para.startsWith("* ")) {
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1 text-gray-300">
                            {para.split("\n").map((li, liIdx) => (
                              <li key={liIdx}>{li.replace(/^[\s-*]+/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      if (para.startsWith("```")) {
                        return (
                          <pre key={pIdx} className="bg-black p-3 border border-[#222] font-mono text-[10px] text-[#00F0FF] overflow-x-auto rounded-none">
                            <code>{para.replace(/```[a-zA-Z]*/, "").replace(/```$/, "")}</code>
                          </pre>
                        );
                      }
                      return <p key={pIdx} className="whitespace-pre-line">{para}</p>;
                    })}
                  </div>

                  {/* Quiz Block */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-[#00F0FF]" /> Interactive Auto-Graded Lesson Quiz
                      </h4>
                      {isCompleted && (
                        <span className="text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 px-2 py-0.5 font-bold uppercase">
                          Muvaffaqiyatli topshirildi (+40 XP)
                        </span>
                      )}
                    </div>

                    <div className="space-y-6">
                      {lesson.quiz.questions.map((q: any, qIdx: number) => {
                        return (
                          <div key={q.id} className="space-y-2 bg-black border border-[#111] p-4">
                            <p className="text-xs font-bold text-white">{qIdx + 1}. {q.text}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isSelected = quizAnswers[qIdx] === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    disabled={isCompleted || quizSubmitted}
                                    onClick={() => handleAnswerQuizQuestion(qIdx, optIdx)}
                                    className={`p-2.5 text-left text-[11px] font-mono transition-all border ${
                                      isSelected 
                                        ? "bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] font-bold" 
                                        : "bg-[#050505] border-[#222] text-gray-400 hover:border-gray-600 disabled:opacity-80"
                                    }`}
                                  >
                                    {optIdx + 1}. {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Controls & Feedbacks */}
                    {quizSubmitted && quizFeedback !== null && (
                      <div className={`p-4 border-2 font-mono text-xs ${
                        quizFeedback 
                          ? "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]" 
                          : "bg-red-500/10 border-red-500 text-red-400"
                      }`}>
                        <div className="flex items-center gap-2">
                          {quizFeedback ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
                          <h5 className="font-bold uppercase tracking-wider">
                            {quizFeedback ? "Hamma javoblar to'g'ri!" : "Xatoliklar bor!"}
                          </h5>
                        </div>
                        <p className="text-[11px] mt-1 text-gray-300">
                          {quizFeedback 
                            ? "Ajoyib natija! Siz darsni to'liq o'zlashtirdingiz va 40 XP qo'lga kiritdingiz." 
                            : "Kechirasiz, ba'zi savollarga noto'g'ri javob berdingiz. Nazariyani qaytadan o'qib, yana urinib ko'ring!"}
                        </p>

                        {/* Display answers explanation */}
                        {quizFeedback === false && (
                          <div className="mt-3 pt-3 border-t border-red-500/30 space-y-2">
                            {lesson.quiz.questions.map((q: any, qIdx: number) => {
                              const isCorrect = quizAnswers[qIdx] === q.correctOptionIndex;
                              return (
                                <div key={qIdx} className="text-[10px] text-gray-400">
                                  <span className={isCorrect ? "text-[#00F0FF]" : "text-red-400"}>Savol {qIdx+1}: {isCorrect ? "To'g'ri" : "Noto'g'ri"}</span>
                                  <p className="italic text-gray-500">{q.explanation}</p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      {quizSubmitted && !quizFeedback ? (
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                            setQuizFeedback(null);
                          }}
                          className="px-4 py-2 border border-amber-500 text-amber-500 hover:bg-amber-500/10 text-xs uppercase cursor-pointer"
                        >
                          Qayta urinish
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {!isCompleted && !quizSubmitted ? (
                        <button
                          onClick={() => handleSubmitLessonQuiz(lesson.quiz, lesson.id)}
                          className="px-6 py-2.5 bg-[#00F0FF] text-black font-black text-xs uppercase shadow-[0_0_10px_rgba(0,255,65,0.3)] hover:bg-white transition-all cursor-pointer"
                        >
                          Testni topshirish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNextLesson(currentCourseData.lessons)}
                          className="px-6 py-2.5 bg-[#00F0FF] text-black font-black text-xs uppercase hover:bg-white transition-all cursor-pointer"
                        >
                          Keyingi darsga o'tish
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* CORE STANDARD COURSES LISTING PORTAL (WHEN NONE SELECTED OR INACTIVE) */}
      {!examActive && !isGenerating && (!activeCourse || !user.customCourses?.[activeCourse]) && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-[#222] pb-1">Mavjud Maxsus AI Yo'nalishlari</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standardCourses.map((course) => {
              // Check age requirement
              let isLocked = false;
              let lockMessage = "";
              
              if (course.ageRequirement === "< 12" && currentAge >= 12) {
                isLocked = true;
                lockMessage = lang === "uz" ? "Faqat 12 yoshgacha bo'lgan talabalar uchun (Sizga Algebra darsi mos keladi)" : "Only for kids under 12 (Algebra is recommended for your age group)";
              } else if (course.ageRequirement === ">= 12" && currentAge < 12) {
                isLocked = true;
                lockMessage = lang === "uz" ? "Faqat 12 yoshdan oshgan talabalar uchun (Sizga Mental Arifmetika mos keladi)" : "Only for students 12+ (Mental Math is recommended for your age group)";
              }

              const hasCustomCourse = !!user.customCourses?.[course.id];
              const IconComp = course.icon;

              return (
                <div 
                  key={course.id}
                  className={`bg-[#080808] border-2 p-5 flex flex-col justify-between gap-5 transition-all duration-300 rounded-none relative ${course.color} ${isLocked ? "opacity-60 border-[#222]" : "border-[#111]"}`}
                >
                  {/* Locked indicator */}
                  {isLocked && (
                    <div className="absolute top-3 right-3 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                      Locked
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black border border-[#222]">
                        <IconComp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{course.title[lang]}</h4>
                        <span className="text-[8px] text-gray-500 font-mono uppercase tracking-widest">GATING: {course.ageRequirement.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed pt-1">{course.desc[lang]}</p>
                    {isLocked && (
                      <p className="text-[9px] text-amber-500 font-bold uppercase font-mono bg-amber-500/5 p-2 border border-amber-500/10">
                        ⚠️ {lockMessage}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#111] flex items-center justify-between">
                    {hasCustomCourse ? (
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">
                        AI Kurs tayyor!
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-500 uppercase">
                        Imtihon topshirmagan
                      </div>
                    )}

                    <button
                      disabled={isLocked}
                      onClick={() => {
                        if (hasCustomCourse) {
                          setActiveCourse(course.id);
                          setSelectedLessonId(user.customCourses![course.id].lessons[0].id);
                        } else {
                          startExam(course.id);
                        }
                      }}
                      className={`px-4 py-2 font-bold text-[10px] uppercase transition-all rounded-none border cursor-pointer ${
                        isLocked
                          ? "bg-black text-gray-600 border-[#222] cursor-not-allowed"
                          : hasCustomCourse
                            ? "bg-[#00F0FF] text-black border-[#00F0FF] hover:bg-black hover:text-[#00F0FF]"
                            : "bg-black text-gray-300 border-[#333] hover:border-white hover:text-white"
                      }`}
                    >
                      {hasCustomCourse ? "Darsga kirish" : t("takeExam")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
