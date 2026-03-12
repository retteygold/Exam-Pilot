export interface QuestionSource {
  pdf: string;
  year: number;
  session: string;
  paper: string;
  question_number: string;
}

export interface QuestionTable {
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  subject: string;
  yearGroup: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  marks: number;
  question: string;
  options: string[] | null;
  correctAnswer: number;
  explanation: string;
  examStyle: boolean;
  timeLimit: number;
  source: QuestionSource;
  table?: QuestionTable;
  verified?: boolean;
  imageRequired?: boolean;
  imagePage?: number;
  imagePath?: string;
  imageNote?: string;
  _subject?: string;
}

export interface QuizMetadata {
  subject: string;
  source: string;
  total_questions: number;
  converted_at: number;
}

export interface QuestionsData {
  metadata: QuizMetadata;
  questions: Question[];
}

export interface ProgressEntry {
  correct: boolean;
  timestamp: number;
  timeSpent?: number;
}

export interface UserProgress {
  [questionId: string]: ProgressEntry;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  questionCount: number;
  color: string;
}

export interface QuizStats {
  totalAnswered: number;
  correct: number;
  streak: number;
  accuracy: number;
  byTopic: Record<string, { correct: number; total: number }>;
}
