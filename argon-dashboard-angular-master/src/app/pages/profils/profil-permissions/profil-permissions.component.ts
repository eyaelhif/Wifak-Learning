import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Permission } from '../../../models/permission.model';
import { Profil } from '../../../models/profil.model';
import { PermissionService } from '../../../services/permission.service';
import { ProfilService } from '../../../services/profil.service';

@Component({
  selector: 'app-profil-permissions',
  templateUrl: './profil-permissions.component.html',
  styleUrls: ['./profil-permissions.component.scss']
})
export class ProfilPermissionsComponent implements OnInit {
  profil: Profil | null = null;
  permissions: Permission[] = [];
  selectedPermissionIds = new Set<number>();
  loading = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profilService: ProfilService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData(id);
  }

  togglePermission(permissionId: number, checked: boolean): void {
    if (checked) {
      this.selectedPermissionIds.add(permissionId);
      return;
    }

    this.selectedPermissionIds.delete(permissionId);
  }

  isSelected(permissionId: number): boolean {
    return this.selectedPermissionIds.has(permissionId);
  }

  save(): void {
    if (!this.profil) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.profilService
      .updateProfilPermissions(this.profil.id, Array.from(this.selectedPermissionIds))
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => this.router.navigate(['/profils']),
        error: () => (this.error = 'Unable to save profile permissions.')
      });
  }

  private loadData(profilId: number): void {
    this.loading = true;
    this.error = '';

    this.profilService.getProfil(profilId).subscribe({
      next: (profil) => {
        this.profil = profil;
        this.permissionService.getPermissions().pipe(finalize(() => (this.loading = false))).subscribe({
          next: (permissions) => {
            this.permissions = permissions;
            this.selectedPermissionIds = new Set(
              permissions
                .filter((permission) => profil.permissions?.includes(permission.name))
                .map((permission) => permission.id)
            );
          },
          error: () => (this.error = 'Unable to load permissions.')
        });
      },
      error: () => {
        this.error = 'Unable to load profile.';
        this.loading = false;
      }
    });
  }
}
