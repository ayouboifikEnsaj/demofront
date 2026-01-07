// services/commentaire.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commentaire } from '../models/commentaire.model';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/commentaires`;

  getAll(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(this.apiUrl);
  }

  getById(id: number): Observable<Commentaire> {
    return this.http.get<Commentaire>(`${this.apiUrl}/${id}`);
  }

  getBySoumission(soumissionId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/soumission/${soumissionId}`);
  }

  getByCours(coursId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/cours/${coursId}`);
  }

  getByAuteur(auteurId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/auteur/${auteurId}`);
  }

  createSurSoumission(commentaire: any): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/soumission`, commentaire);
  }

  createSurCours(commentaire: any): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/cours`, commentaire);
  }

  update(id: number, commentaire: Commentaire): Observable<Commentaire> {
    return this.http.put<Commentaire>(`${this.apiUrl}/${id}`, commentaire);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
