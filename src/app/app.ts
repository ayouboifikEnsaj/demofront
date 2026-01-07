import {Component, OnDestroy} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { SidebarComponent } from './components/sidebar/sidebar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule
  ],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
      overflow: hidden;
    }

    .sidenav {
      width: 260px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
    }

    .main-content {
      padding: 24px;
      background: #f5f7fa;
      overflow-y: auto;
    }
  `]
})
export class AppComponent implements OnDestroy {

  private refreshTimer: any;

  constructor(private appRef: ApplicationRef) {

    this.refreshTimer = setInterval(() => {
      // 👇 Empêche l’erreur NG0406
      if (!this.appRef.destroyed) {
        this.appRef.tick();
      } else {
        clearInterval(this.refreshTimer);
      }
    }, 300);
  }

  ngOnDestroy() {
    clearInterval(this.refreshTimer);
  }
}
