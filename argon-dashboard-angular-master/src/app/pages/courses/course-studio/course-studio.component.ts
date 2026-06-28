import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Chapter, Course, Lesson } from '../../../models/course.model';
import { CourseAiAnalysisRecord } from '../../../models/course-analysis.model';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-studio',
  templateUrl: './course-studio.component.html',
  styleUrls: ['./course-studio.component.scss']
})
export class CourseStudioComponent implements OnInit {
  courseId!: number;
  course?: Course;
  chapters: Chapter[] = [];
  lessonsByChapter: { [chapterId: number]: Lesson[] } = {};
  loading = false;
  saving = false;
  error = '';
  success = '';
  openChapterId?: number;
  selectedAiFile: File | null = null;
  aiAnalysis?: CourseAiAnalysisRecord;
  aiLoading = false;
  aiUploading = false;

  chapterForm: Partial<Chapter> = {
    title: '',
    content: '',
    chapterOrder: 1
  };

  lessonForm: Partial<Lesson> = {
    title: '',
    description: '',
    orderIndex: 1,
    durationMinutes: 15,
    published: false
  };

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudio();
    this.loadAiAnalysis();
  }

  loadStudio(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      course: this.courseService.getCourse(this.courseId),
      chapters: this.courseService.getChapters(this.courseId)
    }).subscribe({
      next: ({ course, chapters }) => {
        this.course = course;
        this.chapters = chapters;
        this.chapterForm.chapterOrder = chapters.length + 1;
        this.openChapterId = chapters[0]?.id;
        this.loadLessons(chapters);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load course studio.';
        this.loading = false;
      }
    });
  }

  addChapter(): void {
    this.saving = true;
    this.courseService.createChapter({ ...this.chapterForm, courseId: this.courseId }).subscribe({
      next: () => {
        this.success = 'Chapter added.';
        this.chapterForm = { title: '', content: '', chapterOrder: this.chapters.length + 2 };
        this.saving = false;
        this.loadStudio();
    this.loadAiAnalysis();
      },
      error: () => {
        this.error = 'Unable to add chapter.';
        this.saving = false;
      }
    });
  }

  deleteChapter(chapter: Chapter): void {
    if (!confirm(`Delete chapter "${chapter.title}"?`)) {
      return;
    }

    this.courseService.deleteChapter(chapter.id).subscribe({
      next: () => {
        this.success = 'Chapter deleted.';
        this.loadStudio();
    this.loadAiAnalysis();
      },
      error: () => (this.error = 'Unable to delete chapter.')
    });
  }

  addLesson(chapterId: number): void {
    this.saving = true;
    this.courseService.createLesson(chapterId, this.lessonForm).subscribe({
      next: () => {
        this.success = 'Lesson added.';
        this.lessonForm = { title: '', description: '', orderIndex: 1, durationMinutes: 15, published: false };
        this.saving = false;
        this.reloadChapterLessons(chapterId);
      },
      error: () => {
        this.error = 'Unable to add lesson.';
        this.saving = false;
      }
    });
  }

  deleteLesson(chapterId: number, lesson: Lesson): void {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) {
      return;
    }

    this.courseService.deleteLesson(lesson.id).subscribe({
      next: () => this.reloadChapterLessons(chapterId),
      error: () => (this.error = 'Unable to delete lesson.')
    });
  }

  setOpenChapter(chapterId: number): void {
    this.openChapterId = this.openChapterId === chapterId ? undefined : chapterId;
  }

  onAiFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAiFile = input.files?.[0] || null;
  }

  uploadAiCourse(): void {
    if (!this.selectedAiFile) {
      this.error = 'Please choose a PDF or image before launching AI analysis.';
      return;
    }
    this.aiUploading = true;
    this.error = '';
    this.success = '';
    this.courseService.analyzeCoursePdf(this.courseId, this.selectedAiFile).subscribe({
      next: (analysis) => {
        this.aiAnalysis = analysis;
        this.success = 'AI analysis completed and saved for the frontoffice.';
        this.aiUploading = false;
      },
      error: (error) => {
        const backendMessage =
          error?.error?.message ||
          error?.error?.detail?.message ||
          error?.error?.detail ||
          error?.message;
        this.error = backendMessage
          ? `AI analysis failed: ${backendMessage}`
          : 'Unable to analyze this file. Check that Spring Boot and the Python OCR service are running.';
        this.aiUploading = false;
      }
    });
  }

  loadAiAnalysis(): void {
    this.aiLoading = true;
    this.courseService.getCourseAnalysis(this.courseId).subscribe({
      next: (analysis) => {
        this.aiAnalysis = analysis;
        this.aiLoading = false;
      },
      error: () => {
        this.aiAnalysis = undefined;
        this.aiLoading = false;
      }
    });
  }
  private loadLessons(chapters: Chapter[]): void {
    if (!chapters.length) {
      this.lessonsByChapter = {};
      return;
    }

    const requests = chapters.map((chapter) =>
      this.courseService.getLessons(chapter.id).pipe(catchError(() => of([] as Lesson[])))
    );

    forkJoin(requests).subscribe((lessonsGroups) => {
      this.lessonsByChapter = {};
      chapters.forEach((chapter, index) => {
        this.lessonsByChapter[chapter.id] = lessonsGroups[index];
      });
    });
  }

  private reloadChapterLessons(chapterId: number): void {
    this.courseService.getLessons(chapterId).subscribe({
      next: (lessons) => (this.lessonsByChapter[chapterId] = lessons),
      error: () => (this.error = 'Unable to reload lessons.')
    });
  }
}

