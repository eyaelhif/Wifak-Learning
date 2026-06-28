import { Component, OnInit } from '@angular/core';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load users.';
        this.loading = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete ${user.fullName}?`)) {
      return;
    }

    this.loading = true;
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.message = 'User deleted successfully.';
        this.loadUsers();
      },
      error: () => {
        this.error = 'Unable to delete user.';
        this.loading = false;
      }
    });
  }

  formatDate(value?: string): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString();
  }

  getCourseTitles(user: User): string {
    if (!user.courses || user.courses.length === 0) {
      return '-';
    }

    return user.courses.map((course) => course.title).join(', ');
  }
}
