import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MsalAuthService } from '../../../core/services/msal.service';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, AvatarModule, BadgeModule],
  template: `
    <header class="app-header">
      <div class="header-container">
        <!-- Left Side: Logo and Brand -->
        <div class="header-left">
          <div class="brand-section" (click)="navigateHome()">
            <img 
              src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" 
              alt="Azure Brasil Logo" 
              class="brand-logo"
            />
            <div class="brand-info">
              <span class="brand-title">EntraId Dashboard</span>
              <span class="brand-subtitle">Azure Active Directory</span>
            </div>
          </div>
        </div>

        <!-- Center: Navigation Menu -->
        <nav class="header-center">
          <div class="nav-items">
            <a 
              routerLink="/dashboard" 
              class="nav-item"
              [class.active]="isActive('/dashboard')"
            >
              <i class="pi pi-home"></i>
              <span>Dashboard</span>
            </a>
            <a 
              routerLink="/profile" 
              class="nav-item"
              [class.active]="isActive('/profile')"
            >
              <i class="pi pi-user"></i>
              <span>Perfil</span>
            </a>
          </div>
        </nav>

        <!-- Right Side: User Info and Actions -->
        <div class="header-right">
          <!-- User Info -->
          <div class="user-section" *ngIf="currentUser()">
            <div class="user-info">
              <span class="user-name">{{ currentUser()?.name || 'Usuário' }}</span>
              <span class="user-email">{{ currentUser()?.username || 'user@domain.com' }}</span>
            </div>
            
            <p-avatar 
              [label]="getInitials(currentUser()?.name || '')"
              size="normal"
              styleClass="user-avatar"
              [style]="{ 'background-color': getUserColor(currentUser()?.name || '') }"
            ></p-avatar>
          </div>

          <!-- Actions -->
          <div class="header-actions">
            <p-button
              icon="pi pi-sign-out"
              (onClick)="logout()"
              severity="secondary"
              size="small"
              [outlined]="true"
              pTooltip="Fazer Logout"
              tooltipPosition="bottom"
              styleClass="logout-btn"
            ></p-button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-bottom: 1px solid var(--surface-border);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
      gap: 2rem;
    }

    /* Left Side - Brand */
    .header-left {
      flex-shrink: 0;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .brand-section:hover {
      transform: scale(1.02);
    }

    .brand-logo {
      height: 40px;
      width: auto;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Center - Navigation */
    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .nav-items {
      display: flex;
      gap: 0.5rem;
      background: var(--surface-50);
      padding: 0.25rem;
      border-radius: 12px;
      border: 1px solid var(--surface-200);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-color-secondary);
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-item:hover {
      color: var(--primary-color);
      background: rgba(var(--primary-color-rgb), 0.1);
    }

    .nav-item.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
    }

    .nav-item i {
      font-size: 1rem;
    }

    /* Right Side - User */
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-shrink: 0;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 12px;
      background: var(--surface-50);
      border: 1px solid var(--surface-200);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-color);
      line-height: 1.2;
    }

    .user-email {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      line-height: 1.2;
    }

    .user-avatar {
      color: white !important;
      font-weight: 600 !important;
      font-size: 0.9rem !important;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    /* Custom Button Styling */
    :host ::ng-deep {
      .logout-btn {
        border-radius: 8px !important;
        border-color: var(--surface-300) !important;
        color: var(--text-color-secondary) !important;
      }

      .logout-btn:hover {
        background: var(--red-50) !important;
        border-color: var(--red-200) !important;
        color: var(--red-600) !important;
      }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .user-info {
        display: none;
      }

      .brand-subtitle {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 1rem;
        gap: 1rem;
      }

      .nav-items {
        gap: 0.25rem;
        padding: 0.2rem;
      }

      .nav-item {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .nav-item span {
        display: none;
      }

      .brand-info {
        display: none;
      }

      .brand-logo {
        height: 32px;
      }
    }

    @media (max-width: 480px) {
      .header-center {
        display: none;
      }

      .header-container {
        justify-content: space-between;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly router = inject(Router);

  currentUser = signal<AccountInfo | null>(null);

  ngOnInit(): void {
    this.msalAuthService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.msalAuthService.logout();
  }

  navigateHome(): void {
    this.router.navigate(['/dashboard']);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getUserColor(name: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const index = name.length % colors.length;
    return colors[index];
  }
}