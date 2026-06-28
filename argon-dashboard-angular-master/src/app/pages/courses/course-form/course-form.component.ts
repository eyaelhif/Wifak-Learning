import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { COURSE_CATEGORIES } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseId?: number;
  categories = COURSE_CATEGORIES;
  saving = false;
  loading = false;
  error = '';

  form = {
    title: '',
    description: '',
    image: '',
    category: 'OTHER',
    stars: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId = Number(id);
      this.loadCourse(this.courseId);
    }
  }

  save(): void {
    this.saving = true;
    this.error = '';
    const request = this.courseId
      ? this.courseService.updateCourse(this.courseId, this.form)
      : this.courseService.createCourse(this.form);

    request.subscribe({
      next: (course) => this.router.navigate(['/admin/courses', course.id, 'studio']),
      error: () => {
        this.error = 'Unable to save course. Check title, description and category.';
        this.saving = false;
      }
    });
  }

  private loadCourse(id: number): void {
    this.loading = true;
    this.courseService.getCourse(id).subscribe({
      next: (course) => {
        this.form = {
          title: course.title,
          description: course.description,
          image: course.image || '',
          category: course.category || 'OTHER',
          stars: course.stars || 0
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load course.';
        this.loading = false;
      }
    });
  }
}
