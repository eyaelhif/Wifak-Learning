import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BACKOFFICE_DASHBOARD_URL } from '../../services/api.config';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentUser: User | null = null;

  navItems = [
    { path: '/frontoffice/home', label: 'Home', icon: 'Home' },
    { path: '/frontoffice/courses', label: 'Courses', icon: 'Courses' },
    { path: '/frontoffice/progress', label: 'Progress', icon: 'Progress' },
    { path: '/frontoffice/community', label: 'Community', icon: 'Community' },
    { path: '/frontoffice/profile', label: 'Profile', icon: 'Profile' },
  ];

  constructor(public router: Router, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => (this.currentUser = user));
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  openBackoffice(): void {
    window.location.href = BACKOFFICE_DASHBOARD_URL;
  }

  logout(): void {
    this.authService.logout();
  }
}
