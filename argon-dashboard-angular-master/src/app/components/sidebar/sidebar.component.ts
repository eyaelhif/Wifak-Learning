import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permissions?: string[];
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/admin/users', title: 'Users',  icon:'ni-single-02 text-blue', class: '', permissions: ['MANAGE_USERS'] },
    { path: '/admin/profils', title: 'Profiles',  icon:'ni-badge text-info', class: '', permissions: ['MANAGE_USERS'] },
    { path: '/admin/permissions', title: 'Permissions',  icon:'ni-key-25 text-danger', class: '', permissions: ['MANAGE_USERS'] },
    { path: '/admin/courses', title: 'Courses',  icon:'ni-books text-primary', class: '', permissions: ['MANAGE_USERS', 'VALIDATE_CONTENT', 'GENERATE_AI_CONTENT', 'CREATE_QUIZ', 'EDIT_QUIZ'] },
    { path: '/admin/quizzes', title: 'Quizzes',  icon:'ni-bullet-list-67 text-red', class: '', permissions: ['CREATE_QUIZ', 'EDIT_QUIZ', 'DELETE_QUIZ', 'MANAGE_USERS'] },
    { path: '/admin/tables', title: 'Statistics',  icon:'ni-chart-bar-32 text-gray', class: '', permissions: ['VIEW_STATISTICS'] },
    { path: '/admin/icons', title: 'AI generation',  icon:'ni-atom text-info', class: '', permissions: ['GENERATE_AI_CONTENT'] },
    { path: '/admin/maps', title: 'Content validation',  icon:'ni-check-bold text-primary', class: '', permissions: ['VALIDATE_CONTENT'] },
    { path: '/admin/user-profile', title: 'User profile',  icon:'ni-single-02 text-gray', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => this.authService.hasAnyPermission(menuItem.permissions || []));
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }

  logout(): void {
    this.authService.logout();
  }

  openFrontoffice(): void {
    window.location.href = this.authService.buildFrontofficeSessionUrl();
  }
}
