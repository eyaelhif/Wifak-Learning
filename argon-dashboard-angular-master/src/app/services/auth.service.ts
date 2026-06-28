import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'eya_token';
  private readonly userKey = 'eya_user';
  private readonly rememberKey = 'eya_remember';

  private currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, remember = false): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      switchMap((response) => this.completeSession(response, remember))
    );
  }

  register(fullName: string, email: string, password: string, remember = false): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, { fullName, email, password }).pipe(
      switchMap((response) => this.completeSession(response, remember))
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.rememberKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey) || localStorage.getItem(this.tokenKey);
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
    return permissions.length === 0 || permissions.some((permission) => this.hasPermission(permission));
  }

  hasBackofficeAccess(): boolean {
    const user = this.getCurrentUser();
    const profils = (user?.profils || []).map((profil) => profil.toUpperCase());
    const permissions = user?.permissions || [];

    const backofficeProfils = ['ADMIN', 'ADMINISTRATEUR', 'PROF', 'PROFESSEUR', 'ENSEIGNANT', 'FORMATEUR', 'TUTEUR'];
    const backofficePermissions = [
      'MANAGE_USERS',
      'VALIDATE_CONTENT',
      'GENERATE_AI_CONTENT',
      'CREATE_QUIZ',
      'EDIT_QUIZ',
      'DELETE_QUIZ'
    ];

    return profils.some((profil) => backofficeProfils.includes(profil)) ||
      permissions.some((permission) => backofficePermissions.includes(permission));
  }

  buildFrontofficeSessionUrl(path = 'http://localhost:4300/frontoffice/home'): string {
    const token = this.getToken();
    const user = this.getCurrentUser();

    if (!token || !user) {
      return path;
    }

    const params = new URLSearchParams({
      token,
      user: JSON.stringify(user)
    });

    return `${path}?${params.toString()}`;
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.getStorage().setItem(this.userKey, JSON.stringify(user));
  }

  private storeSession(response: AuthResponse, remember: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem(this.tokenKey);
    otherStorage.removeItem(this.userKey);
    storage.setItem(this.tokenKey, response.token);
    storage.setItem(this.userKey, JSON.stringify(response.user));
    localStorage.setItem(this.rememberKey, String(remember));
    this.currentUserSubject.next(response.user);
  }

  private completeSession(response: AuthResponse, remember: boolean): Observable<AuthResponse> {
    this.storeSession(response, remember);

    if (response.user) {
      return new Observable<AuthResponse>((observer) => {
        observer.next(response);
        observer.complete();
      });
    }

    return this.http.get<User>(`${API_BASE_URL}/users/me`).pipe(
      tap((user) => this.updateCurrentUser(user)),
      switchMap((user) => new Observable<AuthResponse>((observer) => {
        observer.next({ token: response.token, user });
        observer.complete();
      }))
    );
  }

  private readStoredUser(): User | null {
    const storedUser = sessionStorage.getItem(this.userKey) || localStorage.getItem(this.userKey);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  }

  private getStorage(): Storage {
    return localStorage.getItem(this.rememberKey) === 'true' ? localStorage : sessionStorage;
  }
}
