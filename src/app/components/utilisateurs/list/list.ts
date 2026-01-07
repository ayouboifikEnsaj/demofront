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
import { UtilisateurService } from '../../../services/utilisateur';
import { Utilisateur, Role } from '../../../models/utilisateur.model';

@Component({
  selector: 'app-utilisateur-list',
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
          <mat-icon>people</mat-icon>
          Gestion des Utilisateurs
        </h1>
        <button mat-raised-button color="primary" (click)="create()">
          <mat-icon>person_add</mat-icon>
          Nouvel Utilisateur
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-form-field class="search">
            <mat-label>Rechercher</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Nom, email...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <div *ngIf="!loading; else loadingTpl">
            <table mat-table [dataSource]="dataSource" matSort>

              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
                <td mat-cell *matCellDef="let user">{{ user.nom }}</td>
              </ng-container>

              <ng-container matColumnDef="prenom">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Prénom</th>
                <td mat-cell *matCellDef="let user">{{ user.prenom }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">
                  <div class="email">
                    <mat-icon>email</mat-icon>
                    {{ user.email }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Rôle</th>
                <td mat-cell *matCellDef="let user">
                  <span class="badge" [style.background]="getRoleColor(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="accent" (click)="edit(user)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(user)" matTooltip="Supprimer">
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
    .email { display: flex; align-items: center; gap: 8px; color: #4a5568; }
    .email mat-icon { font-size: 18px; width: 18px; height: 18px; color: #a0aec0; }
    .badge { display: inline-block; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .loading { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #718096; }
    .loading p { margin-top: 20px; }
  `]
})
export class ListComponent implements OnInit, AfterViewInit {
  private service = inject(UtilisateurService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  columns = ['nom', 'prenom', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<Utilisateur>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  roleLabels = {
    [Role.ETUDIANT]: 'Étudiant',
    [Role.INSTRUCTEUR]: 'Instructeur',
    [Role.ADMINISTRATEUR]: 'Administrateur'
  };

  roleColors = {
    [Role.ETUDIANT]: '#4facfe',
    [Role.INSTRUCTEUR]: '#43e97b',
    [Role.ADMINISTRATEUR]: '#fa709a'
  };

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    // Connecter le paginator et sort après l'initialisation de la vue
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
    this.router.navigate(['/utilisateurs/new']);
  }

  edit(user: Utilisateur): void {
    this.router.navigate(['/utilisateurs', user.id, 'edit']);
  }

  delete(user: Utilisateur): void {
    if (confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) {
      this.service.delete(user.id!).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getRoleLabel(role: Role): string {
    return this.roleLabels[role] || role;
  }

  getRoleColor(role: Role): string {
    return this.roleColors[role] || '#667eea';
  }
}
