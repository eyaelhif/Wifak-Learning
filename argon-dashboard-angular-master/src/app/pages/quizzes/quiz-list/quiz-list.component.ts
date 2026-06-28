import { Component, OnInit } from '@angular/core';

import { Quiz } from '../../../models/quiz.model';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];
  loading = false;
  error = '';
  success = '';
  search = '';

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  get filteredQuizzes(): Quiz[] {
    const value = this.search.toLowerCase().trim();
    if (!value) {
      return this.quizzes;
    }
    return this.quizzes.filter((quiz) =>
      [quiz.title, quiz.description, quiz.courseTitle].join(' ').toLowerCase().includes(value)
    );
  }

  loadQuizzes(): void {
    this.loading = true;
    this.error = '';
    this.quizService.getQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load quizzes.';
        this.loading = false;
      }
    });
  }

  deleteQuiz(quiz: Quiz): void {
    if (!confirm(`Delete quiz "${quiz.title}"?`)) {
      return;
    }

    this.quizService.deleteQuiz(quiz.id).subscribe({
      next: () => {
        this.success = 'Quiz deleted successfully.';
        this.loadQuizzes();
      },
      error: () => (this.error = 'Unable to delete quiz.')
    });
  }
}
