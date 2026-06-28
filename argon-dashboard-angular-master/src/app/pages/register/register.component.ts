import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const { fullName, email, password } = this.form.value;

    this.authService.register(fullName, email, password, true).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        if (err?.status === 0) {
          this.error = 'Backend server is not responding. Start Spring Boot on http://localhost:8089.';
          return;
        }

        if (err?.status === 400) {
          this.error = err?.error?.message || err?.error?.error || 'Email already exists or the information is invalid.';
          return;
        }

        if (err?.status === 500) {
          this.error = err?.error?.message || 'Backend error while creating the account.';
          return;
        }

        this.error = 'Unable to create account. Please check your information.';
      }
    });
  }
}
