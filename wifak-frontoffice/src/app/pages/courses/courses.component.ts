import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { API_BASE_URL } from '../../services/api.config';

export interface Course {
  id?: number;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  difficulty: string;
  progress: number;
  rating: number;
  gradient: string;
  description?: string;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  searchQuery = '';
  activeCategory = 'All';
  loading = false;
  error = '';

  categories = ['All', 'Compliance', 'Risk', 'Finance', 'Leadership', 'Digital Banking', 'AML'];

  allCourses: Course[] = [
    { title: 'AML Essentials: Detecting Financial Crime', category: 'AML', instructor: 'Dr. Leila Bensalem', duration: '6h 30m', difficulty: 'Intermediate', progress: 62, rating: 4.9, gradient: 'linear-gradient(135deg, #0F1C3F, #6b1f3a)' },
    { title: 'Basel III & Capital Adequacy', category: 'Risk', instructor: 'Karim Hadj', duration: '4h 15m', difficulty: 'Advanced', progress: 28, rating: 4.8, gradient: 'linear-gradient(135deg, #1e3a5f, #0F1C3F)' },
    { title: 'KYC Procedures for Modern Banking', category: 'Compliance', instructor: 'Sara Trabelsi', duration: '3h 45m', difficulty: 'Beginner', progress: 100, rating: 4.7, gradient: 'linear-gradient(135deg, #2d1b4e, #D4A843)' },
    { title: 'Digital Onboarding & e-KYC', category: 'Digital Banking', instructor: 'Yacine Mahmoudi', duration: '5h 00m', difficulty: 'Intermediate', progress: 45, rating: 4.9, gradient: 'linear-gradient(135deg, #1a2a5e, #2d1b4e)' },
    { title: 'Treasury & Liquidity Management', category: 'Finance', instructor: 'Nadia Cherif', duration: '7h 20m', difficulty: 'Advanced', progress: 12, rating: 4.6, gradient: 'linear-gradient(135deg, #0F1C3F, #2d4a8f)' },
    { title: 'Leading High-Trust Banking Teams', category: 'Leadership', instructor: 'Omar Riahi', duration: '2h 50m', difficulty: 'Beginner', progress: 0, rating: 4.8, gradient: 'linear-gradient(135deg, #6b1f3a, #D4A843)' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get<any[]>(`${API_BASE_URL}/courses`).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: courses => {
        this.allCourses = courses.map((course, index) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: String(course.category || 'Banking'),
          instructor: course.creatorFullName || 'Wifak Learning',
          duration: 'Self-paced',
          difficulty: 'Intermediate',
          progress: 0,
          rating: course.stars || 4.5,
          gradient: this.getGradient(index)
        }));
        this.categories = ['All', ...Array.from(new Set(this.allCourses.map(course => course.category)))];
      },
      error: () => {
        this.error = 'Unable to load courses from the backend.';
      }
    });
  }

  get filteredCourses(): Course[] {
    return this.allCourses.filter(c => {
      const matchCategory = this.activeCategory === 'All' || c.category === this.activeCategory;
      const matchSearch = c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return '#22c55e';
      case 'Intermediate': return '#D4A843';
      case 'Advanced': return '#ef4444';
      default: return '#888';
    }
  }

  private getGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #0F1C3F, #6b1f3a)',
      'linear-gradient(135deg, #1e3a5f, #0F1C3F)',
      'linear-gradient(135deg, #2d1b4e, #D4A843)',
      'linear-gradient(135deg, #1a2a5e, #2d1b4e)',
      'linear-gradient(135deg, #0F1C3F, #2d4a8f)',
      'linear-gradient(135deg, #6b1f3a, #D4A843)'
    ];

    return gradients[index % gradients.length];
  }
}
