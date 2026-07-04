export type Language = 'uz' | 'ru' | 'en';

export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  levelProgress: number; // 1 to 10
  completedLessons: string[]; // lessonIds
  completedQuizzes: string[]; // quizIds
  savedLessons: string[]; // lessonIds
  isPremium: boolean;
  earnedBadges: string[]; // badgeIds
  telegramLinked: boolean;
  telegramUsername?: string;
  createdAt: string;
  role: 'user' | 'admin';
  age?: number;
  customCourses?: Record<string, any>; // courseId -> custom Course data
}

export interface Question {
  id: string;
  text: Record<Language, string>;
  options: Record<Language, string>[]; // Array of translate keys or raw text
  correctOptionIndex: number;
  explanation: Record<Language, string>;
}

export interface Quiz {
  id: string;
  title: Record<Language, string>;
  questions: Question[];
}

export interface Homework {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  prompt: string;
  defaultCode: string;
}

export interface Lesson {
  id: string;
  levelId: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  videoUrl: string; // youtube or mock video URL
  pdfUrl?: string; // pdf or mock PDF path
  isPremium: boolean;
  content: Record<Language, string>; // rich lesson guide
  quiz: Quiz;
  homework: Homework;
  simulationType: 'led' | 'servo' | 'ultrasonic' | 'iot-web' | 'code-only' | 'line-follower' | 'cv-grid';
}

export interface Level {
  id: number;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  description: Record<Language, string>;
  lessons: Lesson[];
}

export interface Certificate {
  id: string;
  userId: string;
  username: string;
  levelId: number; // level 1-10, or 100 for global academy diploma
  levelName: Record<Language, string>;
  date: string;
  certificateHash: string;
}

export interface Badge {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string; // Lucide icon name
  color: string; // Tailwind class color
}

export interface Comment {
  id: string;
  username: string;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  username: string;
  title: string;
  content: string;
  category: 'general' | 'question' | 'project' | 'competition';
  likes: number;
  likedBy: string[]; // usernames
  comments: Comment[];
  date: string;
}

export interface LeaderboardUser {
  username: string;
  xp: number;
  completedLevels: number;
  earnedBadgesCount: number;
  isPremium: boolean;
}
