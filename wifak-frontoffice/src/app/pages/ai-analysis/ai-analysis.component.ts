import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AskResponse, CourseAnalysis, SearchResponse } from '../../models/course-analysis.model';
import { CourseAiService } from '../../services/course-ai.service';

@Component({
  selector: 'app-ai-analysis',
  templateUrl: './ai-analysis.component.html',
  styleUrls: ['./ai-analysis.component.scss']
})
export class AiAnalysisComponent {
  analysis: CourseAnalysis | null = null;
  searchResponse: SearchResponse | null = null;
  askResponse: AskResponse | null = null;

  loading = false;
  searching = false;
  asking = false;
  error = '';
  searchQuery = '';
  question = '';
  activeTab: 'chapters' | 'flashcards' | 'quiz' | 'content' = 'chapters';
  selectedAnswers: Record<number, string> = {};
  courseId?: number;

  constructor(private courseAiService: CourseAiService, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = Number(id);
      this.loadPublishedAnalysis(this.courseId);
    }
  }

  search(): void {
    if (!this.courseId || !this.analysis || this.searchQuery.trim().length < 2) {
      return;
    }

    this.searching = true;
    this.courseAiService.search(this.courseId, this.searchQuery.trim()).pipe(
      finalize(() => (this.searching = false))
    ).subscribe({
      next: response => (this.searchResponse = response),
      error: () => (this.error = 'La recherche semantique est indisponible pour ce cours.')
    });
  }

  ask(): void {
    if (!this.courseId || !this.analysis || this.question.trim().length < 3) {
      return;
    }

    this.asking = true;
    this.courseAiService.ask(this.courseId, this.question.trim()).pipe(
      finalize(() => (this.asking = false))
    ).subscribe({
      next: response => (this.askResponse = response),
      error: () => (this.error = 'Le module question/reponse est indisponible pour ce cours.')
    });
  }

  chooseAnswer(index: number, option: string): void {
    this.selectedAnswers[index] = option;
  }

  isCorrect(index: number, option: string): boolean {
    return this.analysis?.quiz[index]?.correct_answer === option;
  }

  trackByIndex(index: number): number {
    return index;
  }

  private loadPublishedAnalysis(courseId: number): void {
    this.loading = true;
    this.error = '';
    this.courseAiService.getCourseAnalysis(courseId).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: record => {
        this.analysis = record.analysis;
        this.activeTab = 'chapters';
      },
      error: () => {
        this.error = 'Aucune analyse IA publiee pour ce cours. Uploade un PDF depuis le backoffice Course Studio.';
      }
    });
  }
}
