import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { CoursService } from '../../services/cours';
import { ProjetService } from '../../services/projet';
import { SoumissionService } from '../../services/soumission';
import { UtilisateurService } from '../../services/utilisateur';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="page-title">
        <mat-icon>dashboard</mat-icon>
        Tableau de bord
      </h1>

      <div *ngIf="!loading; else loadingTpl">
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card card-purple">
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>book</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalCours }}</h3>
                <p>Cours</p>
              </div>
            </div>
          </mat-card>

          <mat-card class="stat-card card-blue">
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalProjets }}</h3>
                <p>Projets</p>
              </div>
            </div>
          </mat-card>

          <mat-card class="stat-card card-green">
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>cloud_upload</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalSoumissions }}</h3>
                <p>Soumissions</p>
              </div>
            </div>
          </mat-card>

          <mat-card class="stat-card card-orange">
            <div class="stat-content">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-details">
                <h3>{{ stats.totalUtilisateurs }}</h3>
                <p>Utilisateurs</p>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Recent Activity -->
        <div class="activity-grid">
          <mat-card class="activity-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>schedule</mat-icon>
                Projets récents
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div *ngFor="let projet of recentProjects" class="activity-item">
                  <div class="activity-icon">
                    <mat-icon>folder</mat-icon>
                  </div>
                  <div class="activity-details">
                    <h4>{{ projet.titre }}</h4>
                    <p>{{ projet.description | slice:0:80 }}{{ projet.description?.length > 80 ? '...' : '' }}</p>
                    <span class="activity-date">
                      <mat-icon>event</mat-icon>
                      {{ projet.dateLimite | date:'dd/MM/yyyy' }}
                    </span>
                  </div>
                </div>
                <div *ngIf="recentProjects.length === 0" class="empty-state">
                  <mat-icon>assignment</mat-icon>
                  <p>Aucun projet récent</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="activity-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>cloud_done</mat-icon>
                Soumissions récentes
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div *ngFor="let soumission of recentSubmissions" class="activity-item">
                  <div class="activity-icon">
                    <mat-icon>description</mat-icon>
                  </div>
                  <div class="activity-details">
                    <h4>Soumission #{{ soumission.id }}</h4>
                    <p>{{ soumission.fichierUrl | slice:0:50 }}...</p>
                    <span class="activity-date">
                      <mat-icon>event</mat-icon>
                      {{ soumission.dateSoumission | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>
                  <div class="activity-status">
                    <mat-chip *ngIf="soumission.note" class="chip-note">
                      {{ soumission.note }}/20
                    </mat-chip>
                    <mat-chip *ngIf="!soumission.note" class="chip-pending">
                      Non notée
                    </mat-chip>
                  </div>
                </div>
                <div *ngIf="recentSubmissions.length === 0" class="empty-state">
                  <mat-icon>cloud_upload</mat-icon>
                  <p>Aucune soumission récente</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Chargement du tableau de bord...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1400px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 700; color: #2d3748; margin-bottom: 32px; }
    .page-title mat-icon { font-size: 32px; width: 32px; height: 32px; color: #667eea; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card { border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s ease; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .card-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .card-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
    .card-green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }
    .card-orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
    .stat-content { display: flex; align-items: center; gap: 20px; }
    .stat-icon { background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { font-size: 36px; width: 36px; height: 36px; }
    .stat-details h3 { font-size: 32px; font-weight: 700; margin: 0; }
    .stat-details p { font-size: 14px; margin: 4px 0 0 0; opacity: 0.9; }
    .activity-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px; }
    .activity-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .activity-card mat-card-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 16px 16px 0 0; margin: -16px -16px 16px -16px; }
    .activity-card mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; }
    .activity-list { display: flex; flex-direction: column; gap: 16px; }
    .activity-item { display: flex; align-items: start; gap: 16px; padding: 16px; background: #f7fafc; border-radius: 12px; transition: all 0.2s ease; }
    .activity-item:hover { background: #edf2f7; transform: translateX(4px); }
    .activity-icon { background: #667eea; color: white; border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: center; }
    .activity-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .activity-details { flex: 1; }
    .activity-details h4 { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #2d3748; }
    .activity-details p { margin: 0 0 8px 0; font-size: 14px; color: #718096; }
    .activity-date { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #a0aec0; }
    .activity-date mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .activity-status { display: flex; align-items: center; }
    .chip-note { background: #43e97b; color: white; }
    .chip-pending { background: #a0aec0; color: white; }
    .empty-state { text-align: center; padding: 40px 20px; color: #a0aec0; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px; color: #718096; }
    .loading-container p { margin-top: 20px; font-size: 16px; }
  `]
})
export class DashboardComponent implements OnInit {
  private coursService = inject(CoursService);
  private projetService = inject(ProjetService);
  private soumissionService = inject(SoumissionService);
  private utilisateurService = inject(UtilisateurService);

  stats = {
    totalCours: 0,
    totalProjets: 0,
    totalSoumissions: 0,
    totalUtilisateurs: 0
  };

  recentProjects: any[] = [];
  recentSubmissions: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger toutes les données en parallèle avec forkJoin
    forkJoin({
      cours: this.coursService.getAll(),
      projets: this.projetService.getAll(),
      soumissions: this.soumissionService.getAll(),
      utilisateurs: this.utilisateurService.getAll()
    }).subscribe({
      next: (data) => {
        this.stats.totalCours = data.cours.length;
        this.stats.totalProjets = data.projets.length;
        this.stats.totalSoumissions = data.soumissions.length;
        this.stats.totalUtilisateurs = data.utilisateurs.length;

        this.recentProjects = data.projets.slice(0, 5);
        this.recentSubmissions = data.soumissions.slice(0, 5);

        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du dashboard:', error);
        this.loading = false;
      }
    });
  }
}
