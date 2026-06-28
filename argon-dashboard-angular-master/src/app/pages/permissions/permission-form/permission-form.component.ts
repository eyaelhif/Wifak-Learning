import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { PermissionService } from '../../../services/permission.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
  form: FormGroup;
  permissionId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.permissionId = id ? Number(id) : null;

    if (this.permissionId) {
      this.loadPermission(this.permissionId);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const request = this.permissionId
      ? this.permissionService.updatePermission(this.permissionId, this.form.value)
      : this.permissionService.createPermission(this.form.value);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => this.router.navigate(['/permissions']),
      error: () => (this.error = 'Unable to save permission.')
    });
  }

  private loadPermission(id: number): void {
    this.loading = true;
    this.permissionService.getPermission(id).pipe(finalize(() => (this.loading = false))).subscribe({
      next: (permission) => this.form.patchValue(permission),
      error: () => (this.error = 'Unable to load permission.')
    });
  }
}
