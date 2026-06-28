export interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  category?: string;
  createdAt?: string;
  stars?: number;
  creatorId?: number;
  creatorFullName?: string;
  creatorEmail?: string;
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
  chapterOrder: number;
  createdAt?: string;
  courseId?: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  durationMinutes: number;
  published: boolean;
  chapterId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const COURSE_CATEGORIES = [
  'COMPLIANCE',
  'RISK',
  'AML_KYC',
  'CREDIT',
  'CUSTOMER_SERVICE',
  'IT_SECURITY',
  'OTHER'
];
