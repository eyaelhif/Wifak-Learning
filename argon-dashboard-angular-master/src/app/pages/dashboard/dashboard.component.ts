import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pickedOption: number | null = null;

  dailyOptions = [
    'Consistent round-dollar transactions',
    'Multiple transactions to different jurisdictions',
    'Structured deposits below reporting thresholds',
    'All of the above'
  ];

  topLearners = [
    { rank: 1, avatar: 'YK', avatarBg: 'linear-gradient(135deg, #1b2b5e, #c0392b)', name: 'Yasmine Karoui', dept: 'Compliance Analyst', xp: 3450, you: true },
    { rank: 2, avatar: 'SA', avatarBg: 'linear-gradient(135deg, #c0392b, #c9a84c)', name: 'Sarah Ahmed', dept: 'Risk', xp: 3210, you: false },
    { rank: 3, avatar: 'MH', avatarBg: 'linear-gradient(135deg, #c9a84c, #9f7f25)', name: 'Marwan Haddad', dept: 'Legal', xp: 2950, you: false },
    { rank: 4, avatar: 'LO', avatarBg: 'linear-gradient(135deg, #1b2b5e, #2f7d78)', name: 'Layla Omar', dept: 'Operations', xp: 2840, you: false },
    { rank: 5, avatar: 'KN', avatarBg: 'linear-gradient(135deg, #171b2a, #777985)', name: 'Khaled Nasser', dept: 'Support', xp: 2650, you: false }
  ];

  recommendedCourses = [
    { id: 1, title: 'Know Your Customer (KYC)', cover: 'assets/img/course-compliance.jpg', instructor: 'Dr. Hassan Mohammed' },
    { id: 2, title: 'Sanctions Screening', cover: 'assets/img/course-risk.jpg', instructor: 'Prof. Sarah Wilson' },
    { id: 3, title: 'Customer Risk Assessment', cover: 'assets/img/course-digital.jpg', instructor: 'Ahmed Hassan' },
    { id: 4, title: 'Data Privacy Essentials', cover: 'assets/img/course-leadership.jpg', instructor: 'Dr. Emily Brown' }
  ];

  trendingCourses = [
    {
      id: 1,
      title: 'AML Essentials',
      cover: 'assets/img/course-compliance.jpg',
      instructor: 'Dr. Hassan Mohammed',
      category: 'Compliance',
      enrolled: 5420,
      duration: '4h 30m',
      progress: 65
    },
    {
      id: 2,
      title: 'Advanced KYC',
      cover: 'assets/img/course-risk.jpg',
      instructor: 'Prof. Sarah Wilson',
      category: 'Compliance',
      enrolled: 4890,
      duration: '3h 15m',
      progress: 45
    },
    {
      id: 3,
      title: 'Risk Assessment Frameworks',
      cover: 'assets/img/course-digital.jpg',
      instructor: 'Ahmed Hassan',
      category: 'Risk',
      enrolled: 3250,
      duration: '5h 20m',
      progress: 30
    },
    {
      id: 4,
      title: 'Regulatory Updates 2024',
      cover: 'assets/img/course-leadership.jpg',
      instructor: 'Dr. Emily Brown',
      category: 'Regulatory',
      enrolled: 2890,
      duration: '2h 45m',
      progress: 80
    }
  ];



  selectOption(index: number): void {
    if (this.pickedOption === null) {
      this.pickedOption = index;
    }
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

    constructor() {}

  ngOnInit() {}


}
