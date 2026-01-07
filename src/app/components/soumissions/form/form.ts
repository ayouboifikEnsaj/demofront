import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SoumissionService } from '../../../services/soumission';
import { ProjetService } from '../../../services/projet';
import { UtilisateurService } from '../../../services/utilisateur';
import { Role } from '../../../models/utilisateur.model';

@Component({
  selector: 'app-soumission-form',
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
    MatSnackBarModule,
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header class="header">
          <mat-card-title>
            <mat-icon>{{ isEdit ? 'edit' : 'upload' }}</mat-icon>
            {{ isEdit ? 'Modifier la soumission' : 'Nouvelle soumission' }}
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Projet</mat-label>
                <mat-select formControlName="projetId">
                  <mat-option *ngFor="let p of projets" [value]="p.id">
                    {{ p.titre }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('projetId')?.hasError('required')">
                  Requis
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Étudiant</mat-label>
                <mat-select formControlName="etudiantId">
                  <mat-option *ngFor="let e of etudiants" [value]="e.id">
                    {{ e.prenom }} {{ e.nom }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get('etudiantId')?.hasError('required')">
                  Requis
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full">
              <mat-label>URL du fichier</mat-label>
              <input matInput formControlName="fichierUrl">
              <mat-icon matPrefix>link</mat-icon>
              <mat-error *ngIf="form.get('fichierUrl')?.hasError('required')">
                Requis
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Commentaires instructeur (optionnel)</mat-label>
              <textarea matInput rows="4" formControlName="commentairesInstructeur"></textarea>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button type="button" (click)="cancel()">
                <mat-icon>close</mat-icon>
                Annuler
              </button>

              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>{{ isEdit ? 'save' : 'send' }}</mat-icon>
                {{ isEdit ? 'Enregistrer' : 'Soumettre' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 0 auto; }
    mat-card { border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg,#667eea,#764ba2); color:#fff;
      padding:24px; border-radius:16px 16px 0 0; margin:-16px -16px 24px -16px; }
    .row { display:flex; gap:20px; }
    .full, mat-form-field { width:100%; }
    .actions { display:flex; justify-content:flex-end; gap:12px;
      padding-top:16px; border-top:1px solid #e2e8f0; margin-top:16px; }
  `]
})
export class SoumissionFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef); // ✅ Ajout

  private soumService = inject(SoumissionService);
  private projetService = inject(ProjetService);
  private userService = inject(UtilisateurService);

  form!: FormGroup;
  isEdit = false;
  id!: number;

  projets: any[] = [];
  etudiants: any[] = [];

  constructor() {
    // ✅ Initialiser dans constructor
    this.form = this.fb.group({
      projetId: ['', Validators.required],
      etudiantId: ['', Validators.required],
      fichierUrl: ['', Validators.required],
      commentairesInstructeur: [''],
      dateSoumission: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    this.loadSelects();

    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEdit = true;
        this.id = +params['id'];
        this.load();
      }
    });
  }

  loadSelects(): void {
    this.projetService.getAll().subscribe({
      next: p => {
        this.projets = p;
        this.cdr.detectChanges(); // ✅ Force detection
      }
    });

    this.userService.getByRole(Role.ETUDIANT).subscribe({
      next: e => {
        this.etudiants = e;
        this.cdr.detectChanges(); // ✅ Force detection
      }
    });
  }

  load(): void {
    this.soumService.getById(this.id).subscribe({
      next: s => this.form.patchValue(s),
      error: () => {
        this.snackBar.open('Erreur de chargement', 'Fermer', { duration: 3000 });
        this.cancel();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const req = this.isEdit
      ? this.soumService.update(this.id, this.form.value)
      : this.soumService.create(this.form.value);

    req.subscribe({
      next: () => {
        this.snackBar.open('Soumission enregistrée', 'Fermer', { duration: 3000 });
        this.cancel();
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 3000 })
    });
  }

  cancel(): void {
    this.router.navigate(['/soumissions']);
  }
}
