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

import { ProjetService } from '../../../services/projet';
import { CoursService } from '../../../services/cours';
import { UtilisateurService } from '../../../services/utilisateur';
import { Role } from '../../../models/utilisateur.model';

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header class="header">
          <mat-card-title>
            <mat-icon>{{ isEdit ? 'edit' : 'add' }}</mat-icon>
            {{ isEdit ? 'Modifier' : 'Nouveau' }} Projet
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">

            <mat-form-field appearance="outline" class="full">
              <mat-label>Titre</mat-label>
              <input matInput formControlName="titre">
              <mat-icon matPrefix>title</mat-icon>
              <mat-error *ngIf="form.get('titre')?.hasError('required')">Requis</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Description</mat-label>
              <textarea matInput rows="4" formControlName="description"></textarea>
              <mat-icon matPrefix>description</mat-icon>
            </mat-form-field>

            <div class="row">
              <mat-form-field appearance="outline">
                <mat-label>Date limite</mat-label>
                <input matInput type="datetime-local" formControlName="dateLimite">
                <mat-icon matPrefix>event</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Cours</mat-label>
                <mat-select formControlName="coursId">
                  <mat-option *ngFor="let c of cours" [value]="c.id">{{ c.titre }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full">
              <mat-label>Instructeur</mat-label>
              <mat-select formControlName="instructeurId">
                <mat-option *ngFor="let i of instructeurs" [value]="i.id">
                  {{ i.prenom }} {{ i.nom }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button type="button" (click)="cancel()">
                <mat-icon>close</mat-icon> Annuler
              </button>

              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
                <mat-icon>{{ isEdit ? 'save' : 'add' }}</mat-icon>
                {{ isEdit ? 'Enregistrer' : 'Créer' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles:[`
    .container{max-width:900px;margin:0 auto}
    .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px;border-radius:16px 16px 0 0;margin:-16px -16px 24px -16px}
    mat-card-title{display:flex;align-items:center;gap:12px;font-size:24px;margin:0}
    .row{display:flex;gap:20px}
    .full,mat-form-field{width:100%}
    .actions{display:flex;justify-content:flex-end;gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0}
  `]
})
export class ProjetFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(ProjetService);
  private coursService = inject(CoursService);
  private userService = inject(UtilisateurService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  isEdit = false;
  id!: number;

  cours: any[] = [];
  instructeurs: any[] = [];

  constructor() {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      dateLimite: ['', Validators.required],
      coursId: ['', Validators.required],
      instructeurId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSelects();

    this.route.params.subscribe(p => {
      if (p['id'] && p['id'] !== 'new') {
        this.isEdit = true;
        this.id = +p['id'];
        this.load();
      }
    });
  }

  loadSelects() {
    this.coursService.getAll().subscribe({
      next: r => {
        this.cours = r;
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });

    this.userService.getByRole(Role.INSTRUCTEUR).subscribe({
      next: r => {
        this.instructeurs = r;
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });
  }

  load() {
    this.service.getById(this.id).subscribe({
      next: pr => {
        // Convertir LocalDateTime en format datetime-local (YYYY-MM-DDTHH:mm)
        let dateStr = '';
        if (pr.dateLimite) {
          const date = new Date(pr.dateLimite);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        this.form.patchValue({
          titre: pr.titre,
          description: pr.description,
          dateLimite: dateStr,
          coursId: pr.cours?.id,
          instructeurId: pr.instructeur?.id
        });
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const formData = this.form.value;

    // ✅ Convertir la date au format ISO avec secondes pour Spring Boot
    if (formData.dateLimite) {
      formData.dateLimite = new Date(formData.dateLimite).toISOString();
    }

    const req = this.isEdit
      ? this.service.update(this.id, formData)
      : this.service.create(formData);

    req.subscribe({
      next: () => {
        this.snack.open('Projet sauvegardé', 'Fermer', { duration: 3000 });
        this.cancel();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.snack.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
      }
    });
  }

  cancel() {
    this.router.navigate(['/projets']);
  }
}
