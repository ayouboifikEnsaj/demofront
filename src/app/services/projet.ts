import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Projet } from '../models/projet.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projets`;

  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  getByCours(coursId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/cours/${coursId}`);
  }

  getByInstructeur(instructeurId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/instructeur/${instructeurId}`);
  }

  create(projet: any): Observable<Projet> {
    return this.http.post<Projet>(this.apiUrl, projet);
  }

  update(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
