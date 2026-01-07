import { Component, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CoursService } from '../../../services/cours';
import { Cours } from '../../../models/cours.model';

@Component({
  selector: 'app-cours-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>
          <mat-icon>book</mat-icon>
          Gestion des Cours
        </h1>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>add</mat-icon>
          Nouveau Cours
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field class="search">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Code, titre...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <div *ngIf="!loading; else loadingTpl">
            <table mat-table [dataSource]="dataSource" matSort>

              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th>
                <td mat-cell *matCellDef="let cours">
                  <span class="code-badge">{{ cours.code }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="titre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
                <td mat-cell *matCellDef="let cours">
                  <div class="titre">
                    <mat-icon>book</mat-icon>
                    <span>{{ cours.titre }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let cours">
                  <span class="desc">{{ cours.description | slice:0:60 }}{{ cours.description?.length > 60 ? '...' : '' }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="instructeur">
                <th mat-header-cell *matHeaderCellDef>Instructeur</th>
                <td mat-cell *matCellDef="let cours">
                  <div class="instructeur" *ngIf="cours.instructeur">
                    <mat-icon>person</mat-icon>
                    <span>{{ cours.instructeur.prenom }} {{ cours.instructeur.nom }}</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let cours">
                  <button mat-icon-button color="primary" (click)="view(cours)" matTooltip="Détails">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="edit(cours)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(cours)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
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
  styles: [`
    .container { max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 700; color: #2d3748; margin: 0; }
    h1 mat-icon { font-size: 32px; width: 32px; height: 32px; color: #667eea; }
    mat-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .search { width: 100%; max-width: 400px; margin-bottom: 20px; }
    table { width: 100%; }
    th { background: #f7fafc; font-weight: 600; padding: 16px; }
    td { padding: 16px; }
    tr:hover { background: #f7fafc; }
    .code-badge { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 12px; }
    .titre { display: flex; align-items: center; gap: 12px; }
    .titre mat-icon { color: #667eea; font-size: 20px; width: 20px; height: 20px; }
    .titre span { font-weight: 600; color: #2d3748; }
    .desc { color: #718096; font-size: 14px; }
    .instructeur { display: flex; align-items: center; gap: 8px; color: #4a5568; }
    .instructeur mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .loading { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #718096; }
    .loading p { margin-top: 20px; }
  `]
})
export class CoursListComponent implements OnInit, AfterViewInit {
  private service = inject(CoursService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  columns = ['code', 'titre', 'description', 'instructeur', 'actions'];
  dataSource = new MatTableDataSource<Cours>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur de chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  create(): void {
    this.router.navigate(['/cours/new']);
  }

  view(cours: Cours): void {
    this.router.navigate(['/cours', cours.id]);
  }

  edit(cours: Cours): void {
    this.router.navigate(['/cours', cours.id, 'edit']);
  }

  delete(cours: Cours): void {
    if (confirm(`Supprimer le cours "${cours.titre}" ?`)) {
      this.service.delete(cours.id!).subscribe({
        next: () => {
          this.snackBar.open('Cours supprimé', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
