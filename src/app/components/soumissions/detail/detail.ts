import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SoumissionService } from '../../../services/soumission';

@Component({
  selector:'app-soumission-detail',
  standalone:true,
  imports:[
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template:`
    <div class="container" *ngIf="!loading && soumission; else loadingTpl">
      <div class="header">
        <button mat-icon-button (click)="back()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails de la Soumission</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="detail-item">
            <strong><mat-icon>assignment</mat-icon> Projet :</strong>
            <span>{{ soumission.projet?.titre || '—' }}</span>
          </div>
          <div class="detail-item">
            <strong><mat-icon>person</mat-icon> Étudiant :</strong>
            <span>{{ soumission.etudiant?.prenom }} {{ soumission.etudiant?.nom }}</span>
          </div>
          <div class="detail-item">
            <strong><mat-icon>event</mat-icon> Date de soumission :</strong>
            <span>{{ soumission.dateSoumission | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="detail-item">
            <strong><mat-icon>link</mat-icon> Fichier :</strong>
            <a [href]="soumission.fichierUrl" target="_blank" class="file-link">{{ soumission.fichierUrl }}</a>
          </div>
          <div class="detail-item" *ngIf="soumission.note">
            <strong><mat-icon>grade</mat-icon> Note :</strong>
            <span class="note">{{ soumission.note }}/20</span>
          </div>
          <div class="detail-item" *ngIf="soumission.commentairesInstructeur">
            <strong><mat-icon>comment</mat-icon> Commentaires :</strong>
            <p class="comment">{{ soumission.commentairesInstructeur }}</p>
          </div>
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
    .container{max-width:900px;margin:0 auto}
    .header{display:flex;align-items:center;gap:16px;margin-bottom:24px}
    .back-btn{background:white;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
    h1{font-size:28px;font-weight:700;color:#2d3748;margin:0}
    mat-card{border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08)}
    .detail-item{display:flex;align-items:start;gap:12px;padding:16px;border-bottom:1px solid #e2e8f0}
    .detail-item:last-child{border-bottom:none}
    .detail-item strong{display:flex;align-items:center;gap:8px;min-width:180px;color:#4a5568;font-weight:600}
    .detail-item mat-icon{font-size:20px;width:20px;height:20px;color:#667eea}
    .file-link{color:#667eea;text-decoration:none}
    .file-link:hover{text-decoration:underline}
    .note{background:#43e97b;color:white;padding:4px 12px;border-radius:12px;font-weight:600}
    .comment{margin:0;color:#718096;line-height:1.6}
    .loading{display:flex;flex-direction:column;align-items:center;padding:100px;color:#718096}
    .loading p{margin-top:20px}
  `]
})
export class SoumissionDetailComponent implements OnInit {
  private service = inject(SoumissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  soumission: any = null;
  loading = true;

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.loadData(+p['id']);
    });
  }

  loadData(id: number) {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (r) => {
        this.soumission = r;
        this.loading = false;
      },
      error: () => {
        this.snack.open('Erreur de chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
        this.back();
      }
    });
  }

  back() {
    this.router.navigate(['/soumissions']);
  }
}
