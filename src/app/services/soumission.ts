import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Soumission } from '../models/soumission.model';

@Injectable({
  providedIn: 'root'
})
export class SoumissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/soumissions`;

  getAll(): Observable<Soumission[]> {
    return this.http.get<Soumission[]>(this.apiUrl);
  }

  getById(id: number): Observable<Soumission> {
    return this.http.get<Soumission>(`${this.apiUrl}/${id}`);
  }

  getByEtudiant(etudiantId: number): Observable<Soumission[]> {
    return this.http.get<Soumission[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  getByProjet(projetId: number): Observable<Soumission[]> {
    return this.http.get<Soumission[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  create(soumission: any): Observable<Soumission> {
    return this.http.post<Soumission>(this.apiUrl, soumission);
  }

  update(id: number, soumission: Soumission): Observable<Soumission> {
    return this.http.put<Soumission>(`${this.apiUrl}/${id}`, soumission);
  }

  noter(id: number, notation: any): Observable<Soumission> {
    return this.http.patch<Soumission>(`${this.apiUrl}/${id}/noter`, notation);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
