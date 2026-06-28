import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Profil } from '../../../models/profil.model';
import { User } from '../../../models/user.model';
import { ProfilService } from '../../../services/profil.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {
  user: User | null = null;
  profils: Profil[] = [];
  selectedProfilIds = new Set<number>();
  loading = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private profilService: ProfilService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(id);
  }

  toggleProfil(profilId: number, checked: boolean): void {
    if (checked) {
      this.selectedProfilIds.add(profilId);
      return;
    }

    this.selectedProfilIds.delete(profilId);
  }

  isSelected(profilId: number): boolean {
    return this.selectedProfilIds.has(profilId);
  }

  save(): void {
    if (!this.user) {
      return;
    }

    this.saving = true;
    this.error = '';
    const profilIds = Array.from(this.selectedProfilIds);

    this.userService
      .updateUserProfils(this.user.id, profilIds)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          let errorMessage = 'Unable to save user profiles.';
          if (err?.status === 0) {
            errorMessage = 'Network error: Backend server is not responding. Check if the API is running at http://localhost:8089';
          } else if (err?.status === 401) {
            errorMessage = 'Unauthorized: Your session has expired. Please login again.';
          } else if (err?.status === 403) {
            errorMessage = 'Forbidden: You do not have permission to modify user profiles.';
          } else if (err?.status === 404) {
            errorMessage = 'Error: The API endpoint for updating profiles was not found on the server.';
          } else if (err?.status >= 500) {
            errorMessage = `Server error (${err?.status}): ${err?.error?.message || 'The backend server encountered an error.'}`;
          } else if (err?.error?.message) {
            errorMessage = err.error.message;
          }
          
          this.error = errorMessage;
        }
      });
  }

  private loadData(userId: number): void {
    this.loading = true;
    this.error = '';

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.profilService.getProfils().pipe(finalize(() => (this.loading = false))).subscribe({
          next: (profils) => {
            this.profils = profils;
            this.selectedProfilIds = new Set(
              profils
                .filter((profil) => user.profils?.includes(profil.name))
                .map((profil) => profil.id)
            );
          },
          error: () => (this.error = 'Unable to load profiles.')
        });
      },
      error: () => {
        this.error = 'Unable to load user.';
        this.loading = false;
      }
    });
  }
}
