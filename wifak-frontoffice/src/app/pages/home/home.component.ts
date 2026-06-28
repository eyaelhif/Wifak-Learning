import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  today: string = '';
  progressWidth = '0%';

  stats = [
    { label: 'Courses Completed', value: 14, accent: '#0F1C3F', icon: '📖' },
    { label: 'XP This Month', value: 2840, accent: '#D4A843', icon: '✨' },
    { label: 'Certificates', value: 6, accent: '#8b5cf6', icon: '🏆' },
    { label: 'Streak (Days)', value: 12, accent: '#f97316', icon: '🔥' },
  ];

  particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 53) % 100}%`,
    top: `${(i * 37) % 100}%`,
    delay: `${i * 0.2}s`
  }));

  ngOnInit() {
    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();

    setTimeout(() => {
      this.progressWidth = '62%';
    }, 500);
  }
}