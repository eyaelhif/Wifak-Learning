import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { AskResponse, CourseAiAnalysisRecord, SearchResponse } from '../models/course-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class CourseAiService {
  private readonly courseAiUrl = `${API_BASE_URL}/course-ai`;

  constructor(private http: HttpClient) {}

  getCourseAnalysis(courseId: number): Observable<CourseAiAnalysisRecord> {
    return this.http.get<CourseAiAnalysisRecord>(`${this.courseAiUrl}/course/${courseId}`);
  }

  search(courseId: number, query: string, topK = 5): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('topK', String(topK));

    return this.http.get<SearchResponse>(`${this.courseAiUrl}/course/${courseId}/search`, { params });
  }

  ask(courseId: number, question: string, topK = 5): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.courseAiUrl}/course/${courseId}/ask`, {
      question,
      top_k: topK
    });
  }
}
