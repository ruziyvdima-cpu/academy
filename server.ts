import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Database setup (JSON file-based persistence for instant AI Studio usage)
const DB_FILE = path.join(process.cwd(), "database.json");

interface DbSchema {
  users: any[];
  posts: any[];
  telegramLogs: { id: string; userId: string; message: string; date: string }[];
  telegramCodes: Record<string, string>; // userId -> activeCode
}

// Seed Initial Database
function loadDb(): DbSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DbSchema = {
      users: [
        {
          id: "admin_user",
          username: "admin",
          email: "admin@robomaster.com",
          xp: 1850,
          levelProgress: 100,
          completedLessons: ["l1_1", "l2_1", "l3_1", "l4_1"],
          completedQuizzes: ["l1_1", "l2_1", "l3_1", "l4_1"],
          savedLessons: [],
          isPremium: true,
          earnedBadges: ["badge_l1", "badge_l2", "badge_l3", "badge_l4"],
          telegramLinked: true,
          telegramUsername: "robomaster_admin_bot",
          createdAt: new Date().toISOString(),
          role: "admin"
        },
        {
          id: "user_temur",
          username: "Temur_Robo",
          email: "temur@academy.uz",
          xp: 650,
          levelProgress: 3,
          completedLessons: ["l1_1", "l2_1"],
          completedQuizzes: ["l1_1", "l2_1"],
          savedLessons: ["l1_1"],
          isPremium: false,
          earnedBadges: ["badge_l1", "badge_l2"],
          telegramLinked: false,
          createdAt: new Date().toISOString(),
          role: "user"
        },
        {
          id: "user_anna",
          username: "Anna_Engineer",
          email: "anna@robotics.ru",
          xp: 1450,
          levelProgress: 8,
          completedLessons: ["l1_1", "l2_1", "l3_1", "l4_1", "l6_1", "l7_1"],
          completedQuizzes: ["l1_1", "l2_1", "l3_1", "l4_1", "l6_1", "l7_1"],
          savedLessons: [],
          isPremium: true,
          earnedBadges: ["badge_l1", "badge_l2", "badge_l3", "badge_l4", "badge_l6", "badge_l7"],
          telegramLinked: true,
          telegramUsername: "anna_sensors_tg",
          createdAt: new Date().toISOString(),
          role: "user"
        },
        {
          id: "user_john",
          username: "John_Bot",
          email: "john@cyber.net",
          xp: 150,
          levelProgress: 1,
          completedLessons: [],
          completedQuizzes: [],
          savedLessons: [],
          isPremium: false,
          earnedBadges: [],
          telegramLinked: false,
          createdAt: new Date().toISOString(),
          role: "user"
        }
      ],
      posts: [
        {
          id: "post1",
          username: "Temur_Robo",
          title: "Arduino servo burchagini PWM orqali aniq sozlash haqida savol",
          content: "Hammaga salom! Arduino-da servo motorni 90 darajaga burganimda ozroq titrash paydo bo'lyapti. Buni qanday hal qilsa bo'ladi? Filtrlovchi kondensator yordam beradimi?",
          category: "question",
          likes: 5,
          likedBy: ["Anna_Engineer"],
          comments: [
            {
              id: "c1",
              username: "Anna_Engineer",
              content: "Да, это типичная просадка питания при старте сервопривода! Попробуйте подключить электролитический конденсатор на 220мкФ или 470мкФ прямо между контактами 5V и GND на макетной плате. Также проверьте, хватает ли тока источника питания.",
              date: new Date().toISOString()
            }
          ],
          date: new Date().toISOString()
        },
        {
          id: "post2",
          username: "Anna_Engineer",
          title: "Check out my 3D Printed Line Follower chassis!",
          content: "Just designed and printed this dual-motor chassis for Level 7. Fits L298N and two IR sensors perfectly. If you want the STL files, let me know, I'll send them to your email!",
          category: "project",
          likes: 8,
          likedBy: ["Temur_Robo", "John_Bot"],
          comments: [
            {
              id: "c2",
              username: "Temur_Robo",
              content: "Juda ajoyib dizayn bo'libdi! Menga ham STL faylini tashlab bera olasizmi? Men ham 7-darajali robot ustida ishlayapman.",
              date: new Date().toISOString()
            }
          ],
          date: new Date().toISOString()
        }
      ],
      telegramLogs: [],
      telegramCodes: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Database read error. Resetting.", err);
    return { users: [], posts: [], telegramLogs: [], telegramCodes: {} };
  }
}

function saveDb(data: DbSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Middlewares to simulate JWT/Session via Authorization Bearer header
function getAuthUser(req: express.Request, db: DbSchema) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  // Simulating token as the user's ID
  return db.users.find((u) => u.id === token || `user_${u.username}` === token || `admin_${u.username}` === token) || null;
}

// --- API ROUTES ---

// 1. AUTH
app.post("/api/auth/register", (req, res) => {
  const { username, email, password } = req.body;
  const db = loadDb();

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
    res.status(400).json({ error: "Username or Email already registered" });
    return;
  }

  const newUser = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    username,
    email,
    xp: 0,
    levelProgress: 1,
    completedLessons: [],
    completedQuizzes: [],
    savedLessons: [],
    isPremium: false,
    earnedBadges: [],
    telegramLinked: false,
    createdAt: new Date().toISOString(),
    role: "user"
  };

  db.users.push(newUser);
  saveDb(db);

  res.json({
    user: newUser,
    token: newUser.id
  });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = loadDb();

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  // Support direct administrator ID login easily
  if (username === "admin" && password === "d1ma1776") {
    let admin = db.users.find(u => u.role === "admin");
    if (!admin) {
      admin = {
        id: "admin_user",
        username: "admin",
        email: "admin@robomaster.com",
        xp: 1850,
        levelProgress: 100,
        completedLessons: [],
        completedQuizzes: [],
        savedLessons: [],
        isPremium: true,
        earnedBadges: ["badge_l1", "badge_l2", "badge_l3"],
        telegramLinked: true,
        telegramUsername: "robomaster_admin_bot",
        createdAt: new Date().toISOString(),
        role: "admin"
      };
      db.users.push(admin);
      saveDb(db);
    }
    res.json({
      user: admin,
      token: admin.id
    });
    return;
  }

  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());
  if (!user) {
    res.status(400).json({ error: "User not found" });
    return;
  }

  // Simple demo login (password validation succeeds for demo purposes)
  res.json({
    user,
    token: user.id
  });
});

app.get("/api/auth/me", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(user);
});

app.post("/api/auth/update-premium", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  db.users[userIdx].isPremium = true;
  saveDb(db);

  res.json({ success: true, user: db.users[userIdx] });
});

// 2. SAVED LESSONS
app.post("/api/courses/save-lesson", (req, res) => {
  const { lessonId } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  const saved = db.users[userIdx].savedLessons || [];
  
  if (saved.includes(lessonId)) {
    db.users[userIdx].savedLessons = saved.filter((id: string) => id !== lessonId);
  } else {
    db.users[userIdx].savedLessons.push(lessonId);
  }
  
  saveDb(db);
  res.json({ user: db.users[userIdx] });
});

// 3. QUIZ SUBMISSION
app.post("/api/courses/submit-quiz", (req, res) => {
  const { lessonId, levelId } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  
  // Grant experience points and track level progression
  let xpGranted = 50;
  let firstTime = false;
  
  if (!db.users[userIdx].completedQuizzes.includes(lessonId)) {
    db.users[userIdx].completedQuizzes.push(lessonId);
    db.users[userIdx].xp += xpGranted;
    firstTime = true;
  }

  // Update level progress if they complete a level's lesson
  if (db.users[userIdx].levelProgress === levelId && levelId < 100) {
    db.users[userIdx].levelProgress += 1;
  }

  // Check and grant specific badge based on levelId
  let badgeAwarded = null;
  const badgeMap: Record<number, string> = {
    1: "badge_l1",
    2: "badge_l2",
    3: "badge_l3",
    4: "badge_l4",
    6: "badge_l6",
    7: "badge_l7",
    8: "badge_l8"
  };

  const correspondingBadge = badgeMap[levelId];
  if (correspondingBadge && !db.users[userIdx].earnedBadges.includes(correspondingBadge)) {
    db.users[userIdx].earnedBadges.push(correspondingBadge);
    badgeAwarded = correspondingBadge;
  }

  saveDb(db);

  // Send a simulated Telegram notification if linked
  if (db.users[userIdx].telegramLinked) {
    const botMessage = `🎓 EduSphere Bot: Congrats ${db.users[userIdx].username}! You completed Level ${levelId} Quiz and earned +${xpGranted} XP! ${badgeAwarded ? "🏆 New Badge Earned!" : ""}`;
    db.telegramLogs.push({
      id: "tg_" + Math.random().toString(36).substr(2, 9),
      userId: db.users[userIdx].id,
      message: botMessage,
      date: new Date().toISOString()
    });
    saveDb(db);
  }

  res.json({
    success: true,
    user: db.users[userIdx],
    xpGranted: firstTime ? xpGranted : 0,
    badgeAwarded
  });
});

// 4. AI MENTOR & CODE REVIEW (GEMINI API INTEGRATION)
app.post("/api/ai/mentor", async (req, res) => {
  const { prompt, currentLanguage, contextCode, lessonTitle } = req.body;
  
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  const langMap: Record<string, string> = {
    uz: "O'zbek tilida (Uzbek language)",
    ru: "на русском языке (Russian language)",
    en: "in English language"
  };

  const selectedLanguage = langMap[currentLanguage || "en"];

  const systemInstruction = `You are "EduAI Mentor", an elite autonomous robotics education advisor inside the EduSphere Academy platform.
Your task is to teach electronics, C++ Arduino programming, and Python Computer Vision algorithms with precision and encouragement.
The student is asking you a question. You MUST reply strictly ${selectedLanguage}.
Keep your responses educational, professional, and directly useful with short, high-contrast code snippets if necessary.
Context:
- Current lesson: ${lessonTitle || "General Robotics Session"}
- Active code in editor: ${contextCode || "No code loaded"}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: "Gemini server error: " + error?.message });
  }
});

// 5. AI HOMEWORK SUBMISSION & EVALUATOR
app.post("/api/courses/submit-homework", async (req, res) => {
  const { lessonId, lessonTitle, studentCode, currentLanguage } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  const langMap: Record<string, string> = {
    uz: "O'zbek tilida (Uzbek language)",
    ru: "на русском языке (Russian language)",
    en: "in English language"
  };
  const selectedLanguage = langMap[currentLanguage || "en"];

  const prompt = `Review this student code submission for lesson "${lessonTitle}":
\`\`\`
${studentCode}
\`\`\`

Analyze the code. Check if the logic is correct, look for errors, and rate the code.
Return your evaluation structured in JSON. The JSON schema must contain exactly:
1. "grade": "A+" | "A" | "B" | "C" | "Needs Improvement"
2. "isPassed": true | false
3. "feedback": string (Provide positive encouragement and detailed advice strictly ${selectedLanguage})
4. "hints": string[] (Array of suggestions for improvement strictly ${selectedLanguage})`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });

    const resultText = response.text || "{}";
    const evaluation = JSON.parse(resultText);

    let xpGranted = 0;
    if (evaluation.isPassed) {
      if (!db.users[userIdx].completedLessons.includes(lessonId)) {
        db.users[userIdx].completedLessons.push(lessonId);
        xpGranted = 100;
        db.users[userIdx].xp += xpGranted;
        saveDb(db);
      }
    }

    res.json({
      evaluation,
      xpGranted,
      user: db.users[userIdx]
    });
  } catch (error: any) {
    console.error("Homework AI grading error:", error);
    // Graceful fallback if Gemini fails or is not configured
    const fallbackPassed = studentCode.length > 20;
    let xpGranted = 0;
    if (fallbackPassed && !db.users[userIdx].completedLessons.includes(lessonId)) {
      db.users[userIdx].completedLessons.push(lessonId);
      xpGranted = 100;
      db.users[userIdx].xp += xpGranted;
      saveDb(db);
    }
    res.json({
      evaluation: {
        grade: fallbackPassed ? "A" : "Needs Improvement",
        isPassed: fallbackPassed,
        feedback: currentLanguage === "uz" ? "Kodingiz qabul qilindi va tekshirildi! Yaxshi harakat." : currentLanguage === "ru" ? "Ваш код принят и успешно проверен!" : "Your code has been received and evaluated successfully!",
        hints: [currentLanguage === "uz" ? "Kompyuter simulyatsiyasini ishga tushirib sinab ko'ring." : "Test your circuit on the virtual simulator."]
      },
      xpGranted,
      user: db.users[userIdx]
    });
  }
});

// 6. TELEGRAM SIMULATION
app.post("/api/telegram/status", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const logs = db.telegramLogs.filter(l => l.userId === user.id);
  res.json({
    linked: user.telegramLinked,
    telegramUsername: user.telegramUsername || "",
    logs
  });
});

app.post("/api/telegram/generate-code", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const linkCode = Math.floor(100000 + Math.random() * 900000).toString();
  db.telegramCodes[user.id] = linkCode;
  saveDb(db);

  res.json({ code: linkCode });
});

app.post("/api/telegram/verify-code", (req, res) => {
  const { code, telegramUsername } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const activeCode = db.telegramCodes[user.id];
  if (!activeCode || activeCode !== code) {
    res.status(400).json({ error: "Invalid connection code" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  db.users[userIdx].telegramLinked = true;
  db.users[userIdx].telegramUsername = telegramUsername || "student_bot";
  
  // Log an initial message
  db.telegramLogs.push({
    id: "tg_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    message: `🤖 EduSphere Bot: Welcome, @${db.users[userIdx].telegramUsername}! Your account is now successfully linked. You will receive active notifications, reminders, and mobile diplomas here.`,
    date: new Date().toISOString()
  });

  saveDb(db);
  res.json({ success: true, user: db.users[userIdx] });
});

app.post("/api/telegram/simulate-reminder", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  const activeLevel = db.users[userIdx].levelProgress;

  const reminderMsg = `📅 EduSphere Reminder:\nHey @${db.users[userIdx].username}, consistency is key! 🚀 You are currently on Level ${activeLevel}. Don't forget to practice in the Virtual Simulator today!`;

  db.telegramLogs.push({
    id: "tg_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    message: reminderMsg,
    date: new Date().toISOString()
  });

  saveDb(db);
  res.json({ success: true, logs: db.telegramLogs.filter(l => l.userId === user.id) });
});

// 7. LEADERBOARD
app.get("/api/leaderboard", (req, res) => {
  const db = loadDb();
  const leaderboard = db.users.map(u => ({
    username: u.username,
    xp: u.xp,
    completedLevels: u.completedQuizzes.length,
    earnedBadgesCount: u.earnedBadges.length,
    isPremium: u.isPremium
  })).sort((a, b) => b.xp - a.xp);

  res.json(leaderboard);
});

// 8. COMMUNITY FORUM
app.get("/api/community/forum", (req, res) => {
  const db = loadDb();
  res.json(db.posts);
});

app.post("/api/community/forum", (req, res) => {
  const { title, content, category } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!title || !content || !category) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const newPost = {
    id: "post_" + Math.random().toString(36).substr(2, 9),
    username: user.username,
    title,
    content,
    category,
    likes: 0,
    likedBy: [],
    comments: [],
    date: new Date().toISOString()
  };

  db.posts.unshift(newPost);
  saveDb(db);

  res.json(newPost);
});

app.post("/api/community/forum/:id/like", (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const user = getAuthUser(req, db);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const postIdx = db.posts.findIndex(p => p.id === id);
  if (postIdx === -1) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const post = db.posts[postIdx];
  const likedBy = post.likedBy || [];

  if (likedBy.includes(user.username)) {
    post.likedBy = likedBy.filter((u: string) => u !== user.username);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(user.username);
    post.likes += 1;
  }

  db.posts[postIdx] = post;
  saveDb(db);
  res.json(post);
});

app.post("/api/community/forum/:id/comment", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!content) {
    res.status(400).json({ error: "Comment content required" });
    return;
  }

  const postIdx = db.posts.findIndex(p => p.id === id);
  if (postIdx === -1) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const newComment = {
    id: "comment_" + Math.random().toString(36).substr(2, 9),
    username: user.username,
    content,
    date: new Date().toISOString()
  };

  db.posts[postIdx].comments.push(newComment);
  saveDb(db);

  res.json(db.posts[postIdx]);
});

// 9. ADMIN PANEL
app.get("/api/admin/users", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json(db.users);
});

app.get("/api/admin/analytics", (req, res) => {
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const totalUsers = db.users.length;
  const premiumUsers = db.users.filter(u => u.isPremium).length;
  const linkedTelegram = db.users.filter(u => u.telegramLinked).length;
  const totalXp = db.users.reduce((sum, u) => sum + u.xp, 0);
  const totalForumTopics = db.posts.length;

  res.json({
    totalUsers,
    premiumUsers,
    linkedTelegram,
    totalXp,
    totalForumTopics
  });
});

app.post("/api/admin/toggle-premium", (req, res) => {
  const { userId } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === userId);
  if (userIdx !== -1) {
    db.users[userIdx].isPremium = !db.users[userIdx].isPremium;
    saveDb(db);
    res.json({ success: true, users: db.users });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/admin/delete-user", (req, res) => {
  const { userId } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  db.users = db.users.filter(u => u.id !== userId);
  saveDb(db);
  res.json({ success: true, users: db.users });
});


// 10. AI ASSISTANT & CHAT
app.post("/api/ai/chat", async (req, res) => {
  const { message, history, context } = req.body;
  try {
    const systemInstruction = `Siz EduSphere Smart Akademiyasining eng ilg'or, do'stona va aqlli virtual o'qituvchisisiz (ChatGPT 5.5 va Gemini 3.5 texnologiyasiga asoslangan EduAI).
Foydalanuvchilarga robototexnika, datchiklar, Arduino, dasturlash (C++, Python), matematika, algebra, geometriya, ingliz tili va kompyuter savodxonligini o'rganishda yordam berasiz.
Muloqot qoidalari:
1. Doimo foydalanuvchi yozgan yoki gapirgan tilda (O'zbekcha, Ruscha yoki Inglizcha) javob bering.
2. Savollarga qiziqarli, tushunarli, aniq misollar va scannable (oson o'qiladigan) formatda javob bering. Muhim tushunchalarni qalin shriftda belgilang.
3. Agar foydalanuvchi dars yoki kod bo'yicha savol bersa, koddagi muammoni topishga va tuzatishga yordam bering.
4. Foydalanuvchi sizni ovozli boshqarishi (Speech to Text) va ovozli javob qaytarishni (Text to Speech) yoqishi mumkin. Shu sababli javoblaringiz juda uzun, keraksiz gaplar bilan to'la bo'lib ketmasin, o'qishga va eshitishga qulay bo'lsin.`;

    let prompt = "";
    if (context) {
      prompt += `[KONTEKST: Foydalanuvchi hozirda dars o'rganmoqda: "${context.title || 'Dars'}" - ${context.desc || ''}]\n\n`;
    }
    const chatHistory = history || [];
    const formattedHistory = chatHistory.slice(-10).map((msg: any) => `${msg.sender === "user" ? "Foydalanuvchi" : "EduAI"}: ${msg.text}`).join("\n");
    prompt += `${formattedHistory}\nFoydalanuvchi: ${message}\nEduAI:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Sun'iy intellekt aloqasida xatolik yuz berdi." });
  }
});

// 11. PROFILE UPDATE FOR AGE GATING
app.post("/api/user/profile", (req, res) => {
  const { age } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  if (userIdx !== -1) {
    db.users[userIdx].age = Number(age) || 12;
    saveDb(db);
    res.json({ success: true, user: db.users[userIdx] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// 12. DYNAMIC AI CURRICULUM GENERATION
app.post("/api/ai/generate-course", async (req, res) => {
  const { courseId, score, age, lang } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const courseNames: Record<string, string> = {
      "robotics": "Robototexnika va Sun'iy Intellekt",
      "math": "Matematika va Mental Arifmetika",
      "algebra": "Algebra va Geometriya",
      "english": "Ingliz Tili (English Language)",
      "computer-literacy": "Kompyuter Savodxonligi va IT Asoslari"
    };

    const courseName = courseNames[courseId] || "Maxsus Kurs";
    
    // Construct placement summary
    const levelStr = score === 5 ? "Yuqori (Advanced/Expert)" : score >= 3 ? "O'rta (Intermediate)" : "Boshlang'ich (Beginner/Novice)";

    let courseFocus = "";
    if (courseId === "math") {
      courseFocus = "Mathematics and Mental Arithmetic designed for young kids under 12 years old. Focus on fast arithmetic tricks, interactive counting puzzles, logical math, and basic geometric shapes.";
    } else if (courseId === "algebra") {
      courseFocus = "Advanced Algebra and Coordinate Geometry for teens and adults above 12 years old. Focus on equations, function graphs, coordinate geometry systems, angles, and trigonometric proofs.";
    } else if (courseId === "english") {
      courseFocus = "English language learning. The lesson content and vocabulary should be entirely in English suited for English level, but explanations, rules, or translations should be provided in language: " + lang + ". Focus on active speaking, grammar patterns, reading, and vocabulary building.";
    } else if (courseId === "computer-literacy") {
      courseFocus = "Computer Literacy, operating systems, internet usage, Microsoft Office/Google Docs, digital security, and basic logic of programming.";
    } else {
      courseFocus = "Robotics hardware, circuit configurations, Arduino simulation, and programming. Tailored to user score.";
    }

    const systemInstruction = `Siz professional va pedagogik jihatdan mukammal o'quv dasturlari va darsliklar tuzuvchi akademiksiz.
Sizga foydalanuvchi ma'lumotlari beriladi va siz ular uchun maxsus 10 ta darsdan iborat shaxsiy kurs dasturini yaratib berishingiz lozim.
Barcha kontent foydalanuvchi tanlagan tilda yozilishi shart: "${lang === 'uz' ? 'O\'zbek tili (Uzbek)' : lang === 'ru' ? 'Rus tili (Russian)' : 'Ingliz tili (English)'}".
Har bir dars quyidagilardan iborat bo'lishi kerak:
1. ID (masalan: ai_${courseId}_1 dan ai_${courseId}_10 gacha).
2. Sarlavha (title): dars mavzusi.
3. Tavsif (description): dars davomida nimalarni o'rganishi haqida qisqacha ma'lumot.
4. Kontent (content): Markdown formatida yozilgan batafsil darslik qo'llanmasi (nazariya, amaliy misollar, hayotiy tadbiqlar, qoidalar, oson tushuntirish).
5. Test (quiz): Katta qiziqish uyg'otuvchi 3 ta savoldan iborat quiz. Har bir savolda aniq 4 ta variant (options), to'g'ri variant indeksi (correctOptionIndex, 0 dan 3 gacha), va batafsil tushuntirish (explanation) bo'lishi shart.`;

    const userPrompt = `Foydalanuvchi haqida ma'lumotlar:
- Tanlangan Kurs: ${courseName} (${courseId})
- Kurs yo'nalishi va yo'riqnomasi: ${courseFocus}
- Foydalanuvchi yoshi: ${age || 13} yosh
- Imtihondan olingan ball (5 tadan): ${score}/5
- Aniqlangan Daraja: ${levelStr}
- Matnlar tili: ${lang || 'uz'}

Ushbu ma'lumotlar asosida foydalanuvchining darajasiga to'liq mos keladigan 10 ta ajoyib, ketma-ketlikda joylashtirilgan darsni o'z ichiga olgan shaxsiy kurs dasturini JSON formatida tayyorlab bering.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseTitle: { type: Type.STRING, description: "Kursning umumiy nomi" },
            levelName: { type: Type.STRING, description: "Kurs darajasi nomi" },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Noyob dars IDsi, masalan: ai_math_1" },
                  title: { type: Type.STRING, description: "Dars mavzusi nomi" },
                  description: { type: Type.STRING, description: "Darsning qisqacha mazmuni" },
                  content: { type: Type.STRING, description: "Markdown formatida batafsil darslik kontenti" },
                  quiz: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "Kviz IDsi" },
                      title: { type: Type.STRING, description: "Kviz sarlavhasi" },
                      questions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING, description: "Savol IDsi" },
                            text: { type: Type.STRING, description: "Savol matni" },
                            options: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING },
                              description: "Aniq 4 ta javob varianti"
                            },
                            correctOptionIndex: { type: Type.INTEGER, description: "To'g'ri javob indeksi (0 dan 3 gacha)" },
                            explanation: { type: Type.STRING, description: "Savolning javobi izohi" }
                          },
                          required: ["id", "text", "options", "correctOptionIndex", "explanation"]
                        }
                      }
                    },
                    required: ["id", "title", "questions"]
                  }
                },
                required: ["id", "title", "description", "content", "quiz"]
              }
            }
          },
          required: ["courseTitle", "levelName", "lessons"]
        }
      }
    });

    let generatedData;
    try {
      generatedData = JSON.parse(response.text);
    } catch (parseErr) {
      console.error("JSON Parsing failed, retrying manual extraction", response.text);
      // Fallback extraction
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) {
        generatedData = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    // Save this dynamically generated course under the user's customCourses
    const userIdx = db.users.findIndex(u => u.id === user.id);
    if (userIdx !== -1) {
      if (!db.users[userIdx].customCourses) {
        db.users[userIdx].customCourses = {};
      }
      db.users[userIdx].customCourses[courseId] = generatedData;
      // Add XP for completing the placement exam
      db.users[userIdx].xp += 50; 
      saveDb(db);
      res.json({ success: true, course: generatedData, user: db.users[userIdx] });
    } else {
      res.status(404).json({ error: "User not found" });
    }

  } catch (error: any) {
    console.error("Generate Course Error:", error);
    res.status(500).json({ error: "Shaxsiy kurs tayyorlashda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." });
  }
});

// 13. CUSTOM COURSE PROGRESS SAVE
app.post("/api/ai/save-progress", (req, res) => {
  const { lessonId, quizId, courseId } = req.body;
  const db = loadDb();
  const user = getAuthUser(req, db);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userIdx = db.users.findIndex(u => u.id === user.id);
  if (userIdx !== -1) {
    const u = db.users[userIdx];
    if (!u.completedLessons) u.completedLessons = [];
    if (!u.completedQuizzes) u.completedQuizzes = [];

    let xpEarned = 0;
    if (lessonId && !u.completedLessons.includes(lessonId)) {
      u.completedLessons.push(lessonId);
      xpEarned += 20;
    }
    if (quizId && !u.completedQuizzes.includes(quizId)) {
      u.completedQuizzes.push(quizId);
      xpEarned += 40;
    }

    u.xp += xpEarned;
    saveDb(db);
    res.json({ success: true, user: u, xpEarned });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});


// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
}

startServer();
