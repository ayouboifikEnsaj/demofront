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
import { ProjetService } from '../../../services/projet';
import { Projet } from '../../../models/projet.model';

@Component({
  selector: 'app-projets-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>
          <mat-icon>assignment</mat-icon>
          Gestion des Projets
        </h1>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>add</mat-icon>
          Nouveau Projet
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field class="search">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Titre, cours...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <div *ngIf="!loading; else loadTpl">
            <table mat-table [dataSource]="dataSource" matSort>

              <ng-container matColumnDef="titre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
                <td mat-cell *matCellDef="let p">
                  <div class="titre">
                    <mat-icon>folder</mat-icon>
                    <span>{{ p.titre }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="dateLimite">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date limite</th>
                <td mat-cell *matCellDef="let p">
                  <div class="date">
                    <mat-icon>event</mat-icon>
                    {{ p.dateLimite | date:'dd/MM/yyyy' }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="cours">
                <th mat-header-cell *matHeaderCellDef>Cours</th>
                <td mat-cell *matCellDef="let p">{{ p.cours?.titre || '—' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let p">
                  <button mat-icon-button color="primary" (click)="view(p)" matTooltip="Détails">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="edit(p)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(p)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let r; columns: columns"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10,25,50]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>

      <ng-template #loadTpl>
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
    .titre{display:flex;align-items:center;gap:12px}
    .titre mat-icon{color:#667eea;font-size:20px;width:20px;height:20px}
    .titre span{font-weight:600;color:#2d3748}
    .date{display:flex;align-items:center;gap:8px;color:#4a5568}
    .date mat-icon{font-size:18px;width:18px;height:18px}
    .loading{display:flex;flex-direction:column;align-items:center;padding:60px;color:#718096}
    .loading p{margin-top:20px}
  `]
})
export class ProjetsListComponent implements OnInit, AfterViewInit {
  private service = inject(ProjetService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  columns = ['titre','dateLimite','cours','actions'];
  dataSource = new MatTableDataSource<Projet>([]);
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
      next:d=>{
        this.dataSource.data = d;
        this.loading = false;
      },
      error:()=>{
        this.loading = false;
        this.snack.open('Erreur','Fermer',{duration:3000});
      }
    });
  }

  applyFilter(e:Event){
    this.dataSource.filter = (e.target as HTMLInputElement).value.trim().toLowerCase();
  }

  create(){
    this.router.navigate(['/projets/new']);
  }

  view(p:Projet){
    this.router.navigate(['/projets',p.id]);
  }

  edit(p:Projet){
    this.router.navigate(['/projets',p.id,'edit']);
  }

  delete(p:Projet){
    if(confirm(`Supprimer "${p.titre}" ?`)){
      this.service.delete(p.id!).subscribe({
        next: () => {
          this.snack.open('Projet supprimé', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snack.open('Erreur', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
