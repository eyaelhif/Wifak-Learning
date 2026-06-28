import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Permission } from '../models/permission.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly baseUrl = `${API_BASE_URL}/permissions`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.baseUrl);
  }

  getPermission(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.baseUrl}/${id}`);
  }

  createPermission(permission: Partial<Permission>): Observable<Permission> {
    return this.http.post<Permission>(this.baseUrl, permission);
  }

  updatePermission(id: number, permission: Partial<Permission>): Observable<Permission> {
    return this.http.put<Permission>(`${this.baseUrl}/${id}`, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
