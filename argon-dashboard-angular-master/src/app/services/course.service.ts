import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Chapter, Course, Lesson } from '../models/course.model';
import { AskResponse, CourseAiAnalysisRecord, SearchResponse } from '../models/course-analysis.model';
import { API_BASE_URL } from './api.config';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly coursesUrl = `${API_BASE_URL}/courses`;
  private readonly chaptersUrl = `${API_BASE_URL}/chapters`;
  private readonly lessonsUrl = `${API_BASE_URL}/lessons`;
  private readonly courseAiUrl = `${API_BASE_URL}/course-ai`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl);
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.coursesUrl}/myCourses`);
  }

  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.coursesUrl}/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.coursesUrl, this.toCoursePayload(course));
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.coursesUrl}/${id}`, this.toCoursePayload(course));
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.coursesUrl}/${id}`);
  }

  getChapters(courseId: number): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.chaptersUrl}/course/${courseId}`);
  }

  createChapter(chapter: Partial<Chapter>): Observable<Chapter> {
    return this.http.post<Chapter>(this.chaptersUrl, chapter);
  }

  updateChapter(id: number, chapter: Partial<Chapter>): Observable<Chapter> {
    return this.http.put<Chapter>(`${this.chaptersUrl}/${id}`, chapter);
  }

  deleteChapter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.chaptersUrl}/${id}`);
  }

  getLessons(chapterId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.lessonsUrl}/chapter/${chapterId}`);
  }

  createLesson(chapterId: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.lessonsUrl}/chapter/${chapterId}`, lesson);
  }

  updateLesson(id: number, lesson: Partial<Lesson>): Observable<Lesson> {
    return this.http.put<Lesson>(`${this.lessonsUrl}/${id}`, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.lessonsUrl}/${id}`);
  }

  analyzeCoursePdf(courseId: number, file: File): Observable<CourseAiAnalysisRecord> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CourseAiAnalysisRecord>(`${this.courseAiUrl}/course/${courseId}/analyze`, formData);
  }

  getCourseAnalysis(courseId: number): Observable<CourseAiAnalysisRecord> {
    return this.http.get<CourseAiAnalysisRecord>(`${this.courseAiUrl}/course/${courseId}`);
  }

  searchCourseAnalysis(courseId: number, query: string, topK = 5): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.courseAiUrl}/course/${courseId}/search`, {
      params: { query, topK }
    });
  }

  askCourseAnalysis(courseId: number, question: string, topK = 5): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.courseAiUrl}/course/${courseId}/ask`, { question, top_k: topK });
  }

  private toCoursePayload(course: Partial<Course>): Partial<Course> {
    return {
      ...course,
      stars: course.stars || 0,
      creatorId: this.authService.getCurrentUser()?.id || course.creatorId || 1
    };
  }
}
