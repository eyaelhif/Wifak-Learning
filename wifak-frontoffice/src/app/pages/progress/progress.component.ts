import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  stats = [
    { label: 'Total XP', value: 12480, accent: '#D4A843', icon: '📈' },
    { label: 'Certificates', value: 6, accent: '#8b5cf6', icon: '🏆' },
    { label: 'Goals Hit', value: 23, accent: '#0F1C3F', icon: '🎯' },
    { label: 'Best Streak', value: 47, accent: '#f97316', icon: '🔥' },
  ];

  weeks = [40, 65, 30, 80, 55, 90, 72, 95, 60, 88, 78, 100];

  skills = [
    { name: 'Compliance', value: 86 },
    { name: 'Risk Management', value: 72 },
    { name: 'Digital Banking', value: 58 },
    { name: 'Leadership', value: 44 },
    { name: 'Finance', value: 91 },
  ];

  certificates = [
    { title: 'KYC Specialist', year: '2026' },
    { title: 'AML Foundations', year: '2026' },
    { title: 'Basel III Essentials', year: '2026' },
  ];

  skillWidths: string[] = [];
  barHeights: string[] = [];

  ngOnInit() {
    // Animate skill bars after a delay
    setTimeout(() => {
      this.skillWidths = this.skills.map(s => s.value + '%');
      this.barHeights = this.weeks.map(w => w + '%');
    }, 300);
  }
}