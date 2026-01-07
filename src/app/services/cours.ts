import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cours } from '../models/cours.model';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cours`;

  getAll(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/${id}`);
  }

  getByCode(code: string): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/code/${code}`);
  }

  getByInstructeur(instructeurId: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/instructeur/${instructeurId}`);
  }

  create(cours: any): Observable<Cours> {
    return this.http.post<Cours>(this.apiUrl, cours);
  }

  update(id: number, cours: Cours): Observable<Cours> {
    return this.http.put<Cours>(`${this.apiUrl}/${id}`, cours);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
