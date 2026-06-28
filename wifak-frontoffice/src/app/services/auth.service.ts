import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { API_BASE_URL, BACKOFFICE_LOGIN_URL } from './api.config';
import { User } from '../models/user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'eya_token';
  private readonly userKey = 'eya_user';
  private readonly rememberKey = 'eya_remember';

  private currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials).pipe(
      switchMap(response => this.completeSession(response, true))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.rememberKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    window.location.href = BACKOFFICE_LOGIN_URL;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey) || localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getPermissions(): string[] {
    return this.getCurrentUser()?.permissions || [];
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[] = []): boolean {
    return permissions.length === 0 || permissions.some(permission => this.hasPermission(permission));
  }

  acceptTransferredSession(): boolean {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (!token || !userParam) {
      return false;
    }

    try {
      const user = JSON.parse(userParam) as User;
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
      localStorage.setItem(this.rememberKey, 'true');
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.userKey);
      this.currentUserSubject.next(user);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    } catch {
      return false;
    }
  }

  refreshCurrentUser(): Observable<User> {
    return this.http.get<User>(`${API_BASE_URL}/users/me`).pipe(
      tap(user => this.updateCurrentUser(user))
    );
  }

  redirectToLogin(): void {
    window.location.href = BACKOFFICE_LOGIN_URL;
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.getStorage().setItem(this.userKey, JSON.stringify(user));
  }

  private completeSession(response: AuthResponse, remember: boolean): Observable<AuthResponse> {
    this.storeToken(response.token, remember);

    if (response.user) {
      this.updateCurrentUser(response.user);
      return new Observable<AuthResponse>(observer => {
        observer.next(response);
        observer.complete();
      });
    }

    return this.refreshCurrentUser().pipe(
      switchMap(user => new Observable<AuthResponse>(observer => {
        observer.next({ token: response.token, user });
        observer.complete();
      }))
    );
  }

  private storeToken(token: string, remember: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(this.tokenKey);
    otherStorage.removeItem(this.userKey);
    storage.setItem(this.tokenKey, token);
    localStorage.setItem(this.rememberKey, String(remember));
  }

  private readStoredUser(): User | null {
    const stored = sessionStorage.getItem(this.userKey) || localStorage.getItem(this.userKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  private getStorage(): Storage {
    return localStorage.getItem(this.rememberKey) === 'true' ? localStorage : sessionStorage;
  }
}
