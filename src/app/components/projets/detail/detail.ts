import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ProjetService } from '../../../services/projet';
import { SoumissionService } from '../../../services/soumission';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports:[
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template:`
    <div class="container" *ngIf="!loading && projet; else loadingTpl">
      <div class="header">
        <button mat-icon-button (click)="back()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails du Projet</h1>
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
                <mat-icon>title</mat-icon>
                Titre
              </div>
              <div class="value">{{ projet.titre }}</div>
            </div>

            <div class="info-item">
              <div class="label">
                <mat-icon>event</mat-icon>
                Date limite
              </div>
              <div class="value">{{ projet.dateLimite | date:'dd/MM/yyyy' }}</div>
            </div>

            <div class="info-item full">
              <div class="label">
                <mat-icon>description</mat-icon>
                Description
              </div>
              <div class="value">{{ projet.description }}</div>
            </div>

            <div class="info-item" *ngIf="projet.cours">
              <div class="label">
                <mat-icon>book</mat-icon>
                Cours
              </div>
              <div class="value">{{ projet.cours.titre }}</div>
            </div>

            <div class="info-item" *ngIf="projet.instructeur">
              <div class="label">
                <mat-icon>person</mat-icon>
                Instructeur
              </div>
              <div class="value">{{ projet.instructeur.prenom }} {{ projet.instructeur.nom }}</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="soumissions-card">
        <mat-card-header class="card-header">
          <mat-card-title>
            <mat-icon>cloud_upload</mat-icon>
            Soumissions associées ({{ soumissions.length }})
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="soum-list" *ngIf="soumissions.length; else noSoum">
            <div *ngFor="let s of soumissions" class="soum-item">
              <div class="soum-icon">
                <mat-icon>upload_file</mat-icon>
              </div>
              <div class="soum-details">
                <h4>{{ s.etudiant?.prenom }} {{ s.etudiant?.nom }}</h4>
                <p>{{ s.dateSoumission | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
              <button mat-raised-button color="primary" [routerLink]="['/soumissions',s.id]">
                <mat-icon>visibility</mat-icon>
                Détails
              </button>
            </div>
          </div>

          <ng-template #noSoum>
            <div class="empty">
              <mat-icon>cloud_off</mat-icon>
              <p>Aucune soumission</p>
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
  styles:[`
    .container{max-width:1200px;margin:0 auto}
    .header{display:flex;align-items:center;gap:16px;margin-bottom:24px}
    .back-btn{background:white;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
    h1{flex:1;font-size:28px;font-weight:700;color:#2d3748;margin:0}
    mat-card{border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08);margin-bottom:24px}
    .card-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;border-radius:16px 16px 0 0;margin:-16px -16px 20px -16px}
    mat-card-title{display:flex;align-items:center;gap:12px;font-size:20px;margin:0}
    .info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
    .info-item{display:flex;flex-direction:column;gap:8px}
    .info-item.full{grid-column:1/-1}
    .label{display:flex;align-items:center;gap:8px;font-weight:600;color:#4a5568;font-size:14px}
    .label mat-icon{font-size:18px;width:18px;height:18px;color:#667eea}
    .value{font-size:16px;color:#2d3748;padding-left:26px}
    .soum-list{display:flex;flex-direction:column;gap:16px}
    .soum-item{display:flex;align-items:center;gap:16px;padding:16px;background:#f7fafc;border-radius:12px;transition:all 0.2s}
    .soum-item:hover{background:#edf2f7;transform:translateX(4px)}
    .soum-icon{background:#667eea;color:white;border-radius:8px;padding:12px;display:flex}
    .soum-icon mat-icon{font-size:24px;width:24px;height:24px}
    .soum-details{flex:1}
    .soum-details h4{margin:0 0 4px 0;font-size:16px;font-weight:600;color:#2d3748}
    .soum-details p{margin:0;font-size:14px;color:#718096}
    .empty{text-align:center;padding:60px 20px;color:#a0aec0}
    .empty mat-icon{font-size:64px;width:64px;height:64px;margin-bottom:16px}
    .loading{display:flex;flex-direction:column;align-items:center;padding:100px;color:#718096}
    .loading p{margin-top:20px}
  `]
})
export class ProjetDetailComponent implements OnInit {
  private service = inject(ProjetService);
  private soumService = inject(SoumissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  projet: any = null;
  soumissions: any[] = [];
  loading = true;

  ngOnInit() {
    this.route.params.subscribe(p => {
      const id = +p['id'];
      this.loadData(id);
    });
  }

  loadData(id: number) {
    this.loading = true;
    forkJoin({
      projet: this.service.getById(id),
      soumissions: this.soumService.getByProjet(id)
    }).subscribe({
      next: (data) => {
        this.projet = data.projet;
        this.soumissions = data.soumissions;
        this.loading = false;
      },
      error: () => {
        this.snack.open('Erreur de chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
        this.back();
      }
    });
  }

  edit() {
    this.router.navigate(['/projets', this.projet.id, 'edit']);
  }

  back() {
    this.router.navigate(['/projets']);
  }
}
