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
import { UtilisateurService } from '../../../services/utilisateur';
import { Role } from '../../../models/utilisateur.model';

@Component({
  selector: 'app-utilisateur-form',
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
            <mat-icon>{{ isEdit ? 'edit' : 'person_add' }}</mat-icon>
            {{ isEdit ? 'Modifier' : 'Nouvel' }} Utilisateur
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="nom">
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="form.get('nom')?.hasError('required')">Requis</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="prenom">
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="form.get('prenom')?.hasError('required')">Requis</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">Requis</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Email invalide</mat-error>
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>{{ isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe' }}</mat-label>
                <input matInput type="password" formControlName="motDePasse">
                <mat-icon matPrefix>lock</mat-icon>
                <mat-hint *ngIf="!isEdit">Minimum 6 caractères</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rôle</mat-label>
                <mat-select formControlName="role">
                  <mat-option *ngFor="let r of roles" [value]="r.value">
                    {{ r.label }}
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>badge</mat-icon>
              </mat-form-field>
            </div>

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
  private service = inject(UtilisateurService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdit = false;
  userId: number | null = null;

  roles = [
    { value: Role.ETUDIANT, label: 'Étudiant' },
    { value: Role.INSTRUCTEUR, label: 'Instructeur' },
    { value: Role.ADMINISTRATEUR, label: 'Administrateur' }
  ];

  constructor() {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: [Role.ETUDIANT, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEdit = true;
        this.userId = +params['id'];
        this.form.get('motDePasse')?.clearValidators();
        this.form.get('motDePasse')?.updateValueAndValidity();
        this.load();
      }
    });
  }

  load(): void {
    this.service.getById(this.userId!).subscribe({
      next: (user) => {
        this.form.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
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
        if (!data.motDePasse) delete data.motDePasse;
        this.service.update(this.userId!, data).subscribe({
          next: () => {
            this.snackBar.open('Modifié avec succès', 'Fermer', { duration: 3000 });
            this.cancel();
          },
          error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
        });
      } else {
        this.service.create(data).subscribe({
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
    this.router.navigate(['/utilisateurs']);
  }
}
