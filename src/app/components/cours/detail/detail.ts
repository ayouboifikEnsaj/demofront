import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CoursService } from '../../../services/cours';
import { ProjetService } from '../../../services/projet';
import { Cours } from '../../../models/cours.model';

@Component({
  selector: 'app-cours-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container" *ngIf="!loading && cours; else loadingTpl">
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails du cours</h1>
        <button mat-raised-button color="primary" (click)="edit()">
          <mat-icon>edit</mat-icon>
          Modifier
        </button>
      </div>

      <mat-card class="info-card">
        <mat-card-header class="card-header">
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Informations générales
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">
                <mat-icon>code</mat-icon>
                Code
              </div>
              <div class="value">
                <span class="code-badge">{{ cours.code }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="label">
                <mat-icon>title</mat-icon>
                Titre
              </div>
              <div class="value">{{ cours.titre }}</div>
            </div>

            <div class="info-item full">
              <div class="label">
                <mat-icon>description</mat-icon>
                Description
              </div>
              <div class="value">{{ cours.description }}</div>
            </div>

            <div class="info-item" *ngIf="cours.instructeur">
              <div class="label">
                <mat-icon>person</mat-icon>
                Instructeur
              </div>
              <div class="value instructeur">
                <mat-icon>account_circle</mat-icon>
                <span>{{ cours.instructeur.prenom }} {{ cours.instructeur.nom }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="projets-card">
        <mat-card-header class="card-header">
          <mat-card-title>
            <mat-icon>assignment</mat-icon>
            Projets associés
            <mat-chip>{{ projets.length }}</mat-chip>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="projets-list" *ngIf="projets.length > 0; else noProjets">
            <div *ngFor="let projet of projets" class="projet-item">
              <div class="projet-header">
                <mat-icon>folder</mat-icon>
                <h3>{{ projet.titre }}</h3>
              </div>
              <p>{{ projet.description }}</p>
              <div class="projet-footer">
                <span class="date">
                  <mat-icon>event</mat-icon>
                  {{ projet.dateLimite | date:'dd/MM/yyyy' }}
                </span>
                <button mat-button color="primary" [routerLink]="['/projets', projet.id]">
                  Détails
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </div>
          <ng-template #noProjets>
            <div class="empty">
              <mat-icon>assignment</mat-icon>
              <p>Aucun projet</p>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loadingTpl>
      <div class="loading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Chargement...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .back { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { flex: 1; font-size: 28px; font-weight: 700; color: #2d3748; margin: 0; }
    mat-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 24px; }
    .card-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 16px 16px 0 0; margin: -16px -16px 20px -16px; }
    mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 20px; margin: 0; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .info-item { display: flex; flex-direction: column; gap: 8px; }
    .info-item.full { grid-column: 1 / -1; }
    .label { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #4a5568; font-size: 14px; }
    .label mat-icon { font-size: 18px; width: 18px; height: 18px; color: #667eea; }
    .value { font-size: 16px; color: #2d3748; padding-left: 26px; }
    .code-badge { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 8px; font-weight: 600; }
    .instructeur { display: flex; align-items: center; gap: 8px !important; padding-left: 0 !important; }
    .instructeur mat-icon { color: #667eea; }
    .projets-list { display: flex; flex-direction: column; gap: 16px; }
    .projet-item { padding: 20px; background: #f7fafc; border-radius: 12px; border-left: 4px solid #667eea; transition: all 0.2s; }
    .projet-item:hover { background: #edf2f7; transform: translateX(4px); }
    .projet-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .projet-header mat-icon { color: #667eea; }
    .projet-header h3 { margin: 0; color: #2d3748; font-size: 18px; font-weight: 600; }
    .projet-item p { color: #718096; margin: 0 0 12px 36px; }
    .projet-footer { display: flex; justify-content: space-between; align-items: center; margin-left: 36px; }
    .date { display: flex; align-items: center; gap: 4px; color: #a0aec0; font-size: 14px; }
    .date mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .empty { text-align: center; padding: 60px 20px; color: #a0aec0; }
    .empty mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .loading { display: flex; flex-direction: column; align-items: center; padding: 100px; color: #718096; }
    .loading p { margin-top: 20px; }
  `]
})
export class DetailComponent implements OnInit {
  private coursService = inject(CoursService);
  private projetService = inject(ProjetService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  cours: Cours | null = null;
  projets: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadCours(id);
      this.loadProjets(id);
    });
  }

  loadCours(id: number): void {
    this.coursService.getById(id).subscribe({
      next: (data) => {
        this.cours = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur', 'Fermer', { duration: 3000 });
        this.goBack();
      }
    });
  }

  loadProjets(coursId: number): void {
    this.projetService.getByCours(coursId).subscribe({
      next: (data) => this.projets = data
    });
  }

  edit(): void {
    this.router.navigate(['/cours', this.cours?.id, 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/cours']);
  }
}
