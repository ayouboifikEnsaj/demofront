import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <mat-icon class="logo-icon">school</mat-icon>
          <span class="app-title">Plateforme Académique</span>
        </div>

        <div class="navbar-right">
          <!-- ✅ CORRIGÉ: aria-hidden="false" pour accessibilité -->
          <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
            <mat-icon [matBadge]="3" matBadgeColor="warn" aria-hidden="false" [attr.aria-label]="'3 notifications non lues'">notifications</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
        </div>
      </div>

      <mat-menu #notificationMenu="matMenu">
        <div class="notification-header">Notifications</div>
        <button mat-menu-item>
          <mat-icon>assignment</mat-icon>
          <span>Nouveau projet assigné</span>
        </button>
        <button mat-menu-item>
          <mat-icon>comment</mat-icon>
          <span>Nouveau commentaire</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item class="view-all">Voir tout</button>
      </mat-menu>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
          <mat-icon>person</mat-icon>
          <span>Profil</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Paramètres</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item>
          <mat-icon>exit_to_app</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      color: white;
    }

    .navbar-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .app-title {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .navbar-right {
      display: flex;
      gap: 8px;
    }

    .notification-header {
      padding: 12px 16px;
      font-weight: 600;
      font-size: 14px;
      color: #667eea;
    }

    .view-all {
      color: #667eea;
      font-weight: 500;
    }
  `]
})
export class NavbarComponent {}
