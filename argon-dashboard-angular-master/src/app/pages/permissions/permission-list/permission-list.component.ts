import { Component, OnInit } from '@angular/core';

import { Permission } from '../../../models/permission.model';
import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading = true;
    this.error = '';

    this.permissionService.getPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load permissions.';
        this.loading = false;
      }
    });
  }

  deletePermission(permission: Permission): void {
    if (!confirm(`Delete ${permission.name}?`)) {
      return;
    }

    this.loading = true;
    this.permissionService.deletePermission(permission.id).subscribe({
      next: () => {
        this.message = 'Permission deleted successfully.';
        this.loadPermissions();
      },
      error: () => {
        this.error = 'Unable to delete permission.';
        this.loading = false;
      }
    });
  }
}
