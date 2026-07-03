import { Course } from './course.model';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role?: string;
  active: boolean;
  profils: string[];
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  courses?: Course[];
}
