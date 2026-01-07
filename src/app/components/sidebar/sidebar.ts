import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="sidebar-content">
      <nav class="nav-menu">
        <div *ngFor="let item of menuItems"
             class="nav-item"
             [class.active]="isActive(item.route)"
             (click)="navigate(item.route)">
          <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
          <span class="nav-label">{{ item.label }}</span>
          <span *ngIf="item.badge" class="badge">{{ item.badge }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="version-info">
          <mat-icon>info</mat-icon>
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);
      position: relative;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-weight: 600;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      background: white;
      border-radius: 0 4px 4px 0;
    }

    .nav-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .nav-label {
      flex: 1;
      font-size: 15px;
    }

    .badge {
      background: #ff4081;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .version-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
    }

    .version-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class SidebarComponent {
  private router = inject(Router);

  menuItems: MenuItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard' },
    { label: 'Utilisateurs', icon: 'people', route: '/utilisateurs' },
    { label: 'Cours', icon: 'book', route: '/cours', badge: 5 },
    { label: 'Projets', icon: 'assignment', route: '/projets', badge: 12 },
    { label: 'Soumissions', icon: 'cloud_upload', route: '/soumissions', badge: 8 }
  ];

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
