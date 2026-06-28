import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  userId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? Number(id) : null;

    if (this.userId) {
      this.loadUser(this.userId);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const payload = { ...this.form.value };
    if (this.userId) {
      delete payload.password;
    }

    const request = this.userId
      ? this.userService.updateUser(this.userId, payload)
      : this.userService.createUser(payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => (this.error = 'Unable to save user.')
    });
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getUser(id).pipe(finalize(() => (this.loading = false))).subscribe({
      next: (user) => this.form.patchValue({ ...user, password: '' }),
      error: () => (this.error = 'Unable to load user.')
    });
  }
}
