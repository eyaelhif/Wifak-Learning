import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Course } from '../../../models/course.model';
import { QuizQuestion, QuestionType } from '../../../models/quiz.model';
import { CourseService } from '../../../services/course.service';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quiz-builder',
  templateUrl: './quiz-builder.component.html',
  styleUrls: ['./quiz-builder.component.scss']
})
export class QuizBuilderComponent implements OnInit {
  quizId?: number;
  courses: Course[] = [];
  loading = false;
  saving = false;
  error = '';

  form = {
    title: '',
    description: '',
    courseId: 0,
    passingScore: 70,
    timeLimitMinutes: 20,
    active: true,
    questions: [] as QuizQuestion[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    this.quizId = id ? Number(id) : undefined;
    this.form.courseId = courseId ? Number(courseId) : 0;
    this.loadInitialData();
  }

  addQuestion(type: QuestionType = 'SINGLE_CHOICE'): void {
    const question: QuizQuestion = {
      text: '',
      type,
      points: 1,
      orderIndex: this.form.questions.length + 1,
      options: type === 'TRUE_FALSE'
        ? [{ text: 'True', correct: true }, { text: 'False', correct: false }]
        : [{ text: '', correct: true }, { text: '', correct: false }]
    };
    this.form.questions.push(question);
  }

  removeQuestion(index: number): void {
    this.form.questions.splice(index, 1);
    this.reorderQuestions();
  }

  addOption(question: QuizQuestion): void {
    question.options.push({ text: '', correct: false });
  }

  removeOption(question: QuizQuestion, index: number): void {
    question.options.splice(index, 1);
  }

  markSingleCorrect(question: QuizQuestion, optionIndex: number): void {
    if (question.type === 'MULTIPLE_CHOICE') {
      return;
    }
    question.options.forEach((option, index) => (option.correct = index === optionIndex));
  }

  draftAiQuiz(): void {
    this.form.title = this.form.title || 'AI readiness check';
    this.form.description = this.form.description || 'Draft generated from the course objectives. Review before publishing.';
    this.form.passingScore = this.form.passingScore || 70;
    this.form.questions = [
      {
        text: 'What is the main objective learners should master after this course?',
        type: 'SINGLE_CHOICE',
        points: 2,
        orderIndex: 1,
        options: [
          { text: 'Apply the key concept in a realistic scenario', correct: true },
          { text: 'Memorize unrelated definitions', correct: false },
          { text: 'Skip validation steps', correct: false }
        ]
      },
      {
        text: 'Select the practices that improve learning quality.',
        type: 'MULTIPLE_CHOICE',
        points: 3,
        orderIndex: 2,
        options: [
          { text: 'Clear feedback', correct: true },
          { text: 'Progress tracking', correct: true },
          { text: 'Random content without objectives', correct: false }
        ]
      },
      {
        text: 'A quiz can be published before its answers are reviewed.',
        type: 'TRUE_FALSE',
        points: 1,
        orderIndex: 3,
        options: [
          { text: 'True', correct: false },
          { text: 'False', correct: true }
        ]
      }
    ];
  }

  save(): void {
    this.error = '';
    if (!this.form.courseId) {
      this.error = 'Please select a course.';
      return;
    }

    this.saving = true;
    const payload = {
      ...this.form,
      questions: this.form.questions.map((question, index) => ({
        ...question,
        orderIndex: index + 1,
        options: question.options.filter((option) => option.text && option.text.trim().length > 0)
      }))
    };

    const request = this.quizId
      ? this.quizService.updateQuiz(this.quizId, payload)
      : this.quizService.createQuiz(payload);

    request.subscribe({
      next: () => this.router.navigate(['/quizzes']),
      error: () => {
        this.error = 'Unable to save quiz. Check the selected course and questions.';
        this.saving = false;
      }
    });
  }

  private loadInitialData(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        if (!this.form.courseId && courses.length) {
          this.form.courseId = courses[0].id;
        }
        if (this.quizId) {
          this.loadQuiz(this.quizId);
        } else {
          this.loading = false;
          this.addQuestion();
        }
      },
      error: () => {
        this.error = 'Unable to load courses.';
        this.loading = false;
      }
    });
  }

  private loadQuiz(id: number): void {
    this.quizService.getQuiz(id).subscribe({
      next: (quiz) => {
        this.form = {
          title: quiz.title,
          description: quiz.description || '',
          courseId: quiz.courseId,
          passingScore: quiz.passingScore,
          timeLimitMinutes: quiz.timeLimitMinutes || 20,
          active: quiz.active,
          questions: quiz.questions || []
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load quiz.';
        this.loading = false;
      }
    });
  }

  private reorderQuestions(): void {
    this.form.questions.forEach((question, index) => (question.orderIndex = index + 1));
  }
}
