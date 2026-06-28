import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  registerForm: FormGroup;
  loading = false;
  error = '';
  showRegister = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    if (window.location.href.includes('logout=true')) {
      this.authService.clearSession();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    if (this.authService.isAuthenticated()) {
      this.redirectAfterLogin();
    }
  }

  ngOnDestroy(): void {}

  toggleRegister(): void {
    this.showRegister = !this.showRegister;
    this.error = '';
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const { email, password, remember } = this.form.value;

    this.authService.login(email, password, remember).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => this.redirectAfterLogin(),
      error: (err) => {
        this.error = err?.status === 0
          ? 'Backend server is not responding. Start Spring Boot on http://localhost:8089.'
          : 'Invalid email or password.';
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const { fullName, email, password } = this.registerForm.value;

    this.authService.register(fullName, email, password).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => {
        this.showRegister = false;
        this.form.patchValue({ email, password });
      },
      error: (err) => {
        this.error = err?.status === 0
          ? 'Backend server is not responding. Start Spring Boot on http://localhost:8089.'
          : 'Registration failed. Please try again.';
      }
    });
  }

  redirectAfterLogin(): void {
    if (this.authService.hasBackofficeAccess()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    window.location.href = this.authService.buildFrontofficeSessionUrl();
  }
}
