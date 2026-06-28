import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Profil } from '../models/profil.model';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private readonly baseUrl = `${API_BASE_URL}/profils`;

  constructor(private http: HttpClient) {}

  getProfils(): Observable<Profil[]> {
    return this.http.get<Profil[]>(this.baseUrl);
  }

  getProfil(id: number): Observable<Profil> {
    return this.http.get<Profil>(`${this.baseUrl}/${id}`);
  }

  createProfil(profil: Partial<Profil>): Observable<Profil> {
    return this.http.post<Profil>(this.baseUrl, profil);
  }

  updateProfil(id: number, profil: Partial<Profil>): Observable<Profil> {
    return this.http.put<Profil>(`${this.baseUrl}/${id}`, profil);
  }

  deleteProfil(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateProfilPermissions(id: number, permissionIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/permissions`, permissionIds);
  }
}
