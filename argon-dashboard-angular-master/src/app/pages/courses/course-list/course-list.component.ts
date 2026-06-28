import { Component, OnInit } from '@angular/core';

import { Course } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error = '';
  success = '';
  search = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  get filteredCourses(): Course[] {
    const value = this.search.toLowerCase().trim();
    if (!value) {
      return this.courses;
    }
    return this.courses.filter((course) =>
      [course.title, course.description, course.category, course.creatorFullName]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );
  }

  get publishedSignal(): number {
    return this.courses.filter((course) => (course.stars || 0) >= 4).length;
  }

  loadCourses(): void {
    this.loading = true;
    this.error = '';
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load courses.';
        this.loading = false;
      }
    });
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Delete course "${course.title}"?`)) {
      return;
    }

    this.courseService.deleteCourse(course.id).subscribe({
      next: () => {
        this.success = 'Course deleted successfully.';
        this.loadCourses();
      },
      error: () => (this.error = 'Unable to delete course.')
    });
  }
}
