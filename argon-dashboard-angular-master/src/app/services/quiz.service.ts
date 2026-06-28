import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Quiz } from '../models/quiz.model';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly baseUrl = `${API_BASE_URL}/quizzes`;

  constructor(private http: HttpClient) {}

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.baseUrl);
  }

  getQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.baseUrl}/${id}`);
  }

  getByCourse(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.baseUrl}/course/${courseId}`);
  }

  createQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(this.baseUrl, quiz);
  }

  updateQuiz(id: number, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.baseUrl}/${id}`, quiz);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
