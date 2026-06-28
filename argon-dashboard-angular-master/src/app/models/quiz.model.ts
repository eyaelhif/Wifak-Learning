export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface AnswerOption {
  id?: number;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id?: number;
  text: string;
  type: QuestionType;
  points: number;
  orderIndex: number;
  options: AnswerOption[];
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  passingScore: number;
  timeLimitMinutes?: number;
  active: boolean;
  courseId: number;
  courseTitle?: string;
  createdAt?: string;
  questions: QuizQuestion[];
}
