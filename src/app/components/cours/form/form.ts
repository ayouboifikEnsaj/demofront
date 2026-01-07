import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CoursService } from '../../../services/cours';
import { UtilisateurService } from '../../../services/utilisateur';
import { Role } from '../../../models/utilisateur.model';

@Component({
  selector: 'app-cours-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header class="header">
          <mat-card-title>
            <mat-icon>{{ isEdit ? 'edit' : 'add' }}</mat-icon>
            {{ isEdit ? 'Modifier' : 'Nouveau' }} Cours
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">

            <mat-form-field appearance="outline" class="full">
              <mat-label>Titre du cours</mat-label>
              <input matInput formControlName="titre">
              <mat-icon matPrefix>title</mat-icon>
              <mat-error *ngIf="form.get('titre')?.hasError('required')">Requis</mat-error>
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Code</mat-label>
                <input matInput formControlName="code" placeholder="Ex: ANG-101">
                <mat-icon matPrefix>code</mat-icon>
                <mat-error *ngIf="form.get('code')?.hasError('required')">Requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Instructeur</mat-label>
                <mat-select formControlName="instructeurId">
                  <mat-option *ngFor="let inst of instructeurs" [value]="inst.id">
                    {{ inst.prenom }} {{ inst.nom }}
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="form.get('instructeurId')?.hasError('required')">Requis</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="5"></textarea>
              <mat-icon matPrefix>description</mat-icon>
              <mat-error *ngIf="form.get('description')?.hasError('required')">Requis</mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button type="button" (click)="cancel()">
                <mat-icon>close</mat-icon>
                Annuler
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
                <mat-icon>{{ isEdit ? 'save' : 'add' }}</mat-icon>
                {{ isEdit ? 'Enregistrer' : 'Créer' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 0 auto; }
    mat-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 16px 16px 0 0; margin: -16px -16px 24px -16px; }
    mat-card-title { display: flex; align-items: center; gap: 12px; font-size: 24px; margin: 0; }
    form { padding: 8px 0; }
    .row { display: flex; gap: 20px; }
    .full, mat-form-field { width: 100%; }
    .actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid #e2e8f0; margin-top: 16px; }
  `]
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursService = inject(CoursService);
  private userService = inject(UtilisateurService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdit = false;
  coursId: number | null = null;
  instructeurs: any[] = [];

  constructor() {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      code: ['', Validators.required],
      instructeurId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInstructeurs();

    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEdit = true;
        this.coursId = +params['id'];
        this.load();
      }
    });
  }

  loadInstructeurs(): void {
    this.userService.getByRole(Role.INSTRUCTEUR).subscribe({
      next: (data) => this.instructeurs = data
    });
  }

  load(): void {
    this.coursService.getById(this.coursId!).subscribe({
      next: (cours) => {
        this.form.patchValue({
          titre: cours.titre,
          description: cours.description,
          code: cours.code,
          instructeurId: cours.instructeur?.id
        });
      },
      error: () => {
        this.snackBar.open('Erreur', 'Fermer', { duration: 3000 });
        this.cancel();
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const data = this.form.value;

      if (this.isEdit) {
        this.coursService.update(this.coursId!, data).subscribe({
          next: () => {
            this.snackBar.open('Modifié avec succès', 'Fermer', { duration: 3000 });
            this.cancel();
          },
          error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
        });
      } else {
        this.coursService.create(data).subscribe({
          next: () => {
            this.snackBar.open('Créé avec succès', 'Fermer', { duration: 3000 });
            this.cancel();
          },
          error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/cours']);
  }
}
