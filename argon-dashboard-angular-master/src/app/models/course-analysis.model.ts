export interface TextBlock {
  type: string;
  title?: string | null;
  content: string;
  page?: number | null;
  confidence?: number | null;
}

export interface CourseChapter {
  title: string;
  order: number;
  summary?: string | null;
  content: string;
  subchapters: CourseChapter[];
  important_points: string[];
}

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: string;
  source?: string | null;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

export interface CourseAnalysisPayload {
  course_id: string;
  source_course_id?: string | null;
  status: 'COMPLETED' | 'FAILED';
  title: string;
  language: string;
  confidence: number;
  short_summary: string;
  detailed_summary: string;
  keywords: string[];
  chapters: CourseChapter[];
  definitions: TextBlock[];
  lists: TextBlock[];
  tables: TextBlock[];
  examples: TextBlock[];
  important_concepts: string[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  structured_content: TextBlock[];
  metadata: Record<string, any>;
  created_at: string;
}

export interface CourseAiAnalysisRecord {
  id: number;
  courseId: number;
  pythonCourseId: string;
  status: string;
  title: string;
  language: string;
  confidence: number;
  shortSummary: string;
  detailedSummary: string;
  vectorIndexed: boolean;
  analysis: CourseAnalysisPayload;
  createdAt: string;
  updatedAt: string;
}

export interface AskResponse {
  course_id: string;
  question: string;
  answer: string;
  sources: TextBlock[];
}

export interface SearchResponse {
  course_id: string;
  query: string;
  results: TextBlock[];
}
