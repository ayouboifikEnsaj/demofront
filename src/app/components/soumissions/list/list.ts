import { Component, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SoumissionService } from '../../../services/soumission';
import { Soumission } from '../../../models/soumission.model';

@Component({
  selector: 'app-soumissions-list',
  standalone: true,
  imports:[
    CommonModule, RouterModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template:`
    <div class="container">
      <div class="header">
        <h1>
          <mat-icon>cloud_upload</mat-icon>
          Gestion des Soumissions
        </h1>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>add</mat-icon>
          Nouvelle Soumission
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field class="search">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Projet, étudiant...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <div *ngIf="!loading; else loadingTpl">
            <table mat-table [dataSource]="dataSource" matSort>

              <ng-container matColumnDef="projet">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Projet</th>
                <td mat-cell *matCellDef="let s">
                  <div class="projet">
                    <mat-icon>assignment</mat-icon>
                    <span>{{ s.projet?.titre || '—' }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="etudiant">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Étudiant</th>
                <td mat-cell *matCellDef="let s">
                  <div class="etudiant">
                    <mat-icon>person</mat-icon>
                    <span>{{ s.etudiant?.prenom }} {{ s.etudiant?.nom }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="dateSoumission">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell *matCellDef="let s">
                  <div class="date">
                    <mat-icon>event</mat-icon>
                    {{ s.dateSoumission | date:'dd/MM/yyyy' }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="note">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Note</th>
                <td mat-cell *matCellDef="let s">
                  <span *ngIf="s.note" class="note-badge">{{ s.note }}/20</span>
                  <span *ngIf="!s.note" class="note-pending">Non notée</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let s">
                  <button mat-icon-button color="primary" (click)="view(s)" matTooltip="Détails">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="edit(s)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(s)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="cols"></tr>
              <tr mat-row *matRowDef="let r; columns: cols"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10,25,50]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>

      <ng-template #loadingTpl>
        <div class="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Chargement...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles:[`
    .container{max-width:1400px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
    h1{display:flex;align-items:center;gap:12px;font-size:28px;font-weight:700;color:#2d3748;margin:0}
    h1 mat-icon{font-size:32px;width:32px;height:32px;color:#667eea}
    mat-card{border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.08)}
    .search{max-width:400px;width:100%;margin-bottom:20px}
    table{width:100%}
    th{background:#f7fafc;font-weight:600;padding:16px}
    td{padding:16px}
    tr:hover{background:#f7fafc}
    .projet,.etudiant,.date{display:flex;align-items:center;gap:8px;color:#4a5568}
    .projet mat-icon{color:#667eea;font-size:20px;width:20px;height:20px}
    .etudiant mat-icon,.date mat-icon{font-size:18px;width:18px;height:18px}
    .note-badge{background:#43e97b;color:white;padding:4px 12px;border-radius:12px;font-weight:600;font-size:12px}
    .note-pending{color:#a0aec0;font-style:italic}
    .loading{display:flex;flex-direction:column;align-items:center;padding:60px;color:#718096}
    .loading p{margin-top:20px}
  `]
})
export class SoumissionsListComponent implements OnInit, AfterViewInit {
  private service = inject(SoumissionService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  cols = ['projet','etudiant','dateSoumission','note','actions'];
  dataSource = new MatTableDataSource<Soumission>([]);
  loading = true;

  @ViewChild(MatPaginator) pag!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(){
    this.load();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.pag;
    this.dataSource.sort = this.sort;
  }

  load(){
    this.loading = true;
    this.service.getAll().subscribe({
      next: d => {
        this.dataSource.data = d;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Erreur', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(e:Event){
    this.dataSource.filter = (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  view(s: Soumission){
    this.router.navigate(['/soumissions', s.id]);
  }

  edit(s: Soumission){
    this.router.navigate(['/soumissions', s.id, 'edit']);
  }

  create(){
    this.router.navigate(['/soumissions/new']);
  }

  delete(s: Soumission){
    if(confirm('Supprimer cette soumission ?')){
      this.service.delete(s.id!).subscribe({
        next: () => {
          this.snack.open('Soumission supprimée', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snack.open('Erreur', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
