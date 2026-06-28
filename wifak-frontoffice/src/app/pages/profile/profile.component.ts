import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser: User | null = null;

  stats = [
    { label: 'TOTAL XP', value: 12480, accent: '#D4A843', icon: 'XP' },
    { label: 'CERTIFICATES', value: 6, accent: '#8b5cf6', icon: 'CERT' },
    { label: 'STREAK', value: 12, accent: '#f97316', icon: 'DAYS' },
  ];

  badges = [
    { name: 'AML Hunter', emoji: 'AML' },
    { name: 'Risk Sentinel', emoji: 'RISK' },
    { name: 'Top 1% Learner', emoji: 'TOP' },
    { name: '30-day Streak', emoji: '30' },
    { name: 'Mentor', emoji: 'M' },
    { name: 'Speed Reader', emoji: 'SR' },
  ];

  activities = [
    { type: 'Completed lesson', detail: 'Red Flag Indicators - Chapter 2', time: '2h ago' },
    { type: 'Earned badge', detail: '30-day Streak', time: 'Yesterday' },
    { type: 'Aced challenge', detail: 'Basel III Daily Quiz', time: '2d ago' },
    { type: 'Enrolled in', detail: 'Treasury & Liquidity Management', time: '5d ago' },
  ];

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => (this.currentUser = user));
    this.authService.refreshCurrentUser().subscribe({ error: () => undefined });
  }

  get initials(): string {
    return (this.currentUser?.fullName || 'Wifak Learner').slice(0, 2).toUpperCase();
  }

  get profiles(): string {
    return this.currentUser?.profils?.join(', ') || 'Learner';
  }
}
