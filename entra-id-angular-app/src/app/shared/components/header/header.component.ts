import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { MsalAuthService } from '../../../core/services/msal.service';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, AvatarModule],
  template: `
    <p-menubar [model]="menuItems()" styleClass="header-menubar">
      <ng-template pTemplate="start">
        <div class="flex align-items-center gap-3 cursor-pointer" (click)="navigateHome()">
          <img 
            src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" 
            alt="Azure Brasil Logo" 
            class="logo"
          />
          <div class="brand">
            <span class="brand-title">EntraId Dashboard</span>
            <span class="brand-subtitle">Azure Active Directory</span>
          </div>
        </div>
      </ng-template>

      <ng-template pTemplate="end">
        <div class="flex align-items-center gap-3">
          <div class="user-info text-right hidden lg:block" *ngIf="currentUser()">
            <div class="user-name">{{ currentUser()?.name }}</div>
            <div class="user-email">{{ currentUser()?.username }}</div>
          </div>
          
          <p-avatar 
            [label]="getInitials(currentUser()?.name || '')"
            size="normal"
            styleClass="user-avatar"
          ></p-avatar>
          
          <p-button
            icon="pi pi-sign-out"
            label="Sair"
            (onClick)="logout()"
            severity="secondary"
            size="small"
            [outlined]="true"
          ></p-button>
        </div>
      </ng-template>
    </p-menubar>
  `,
  styles: [`
    .logo {
      height: 32px;
      width: auto;
    }

    .brand {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--primary-color);
      line-height: 1;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      line-height: 1;
    }

    .user-info {
      .user-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-color);
        line-height: 1.2;
      }

      .user-email {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        line-height: 1.2;
      }
    }

    .user-avatar {
      background: var(--primary-color) !important;
      color: white !important;
      font-weight: 600;
    }

    :host ::ng-deep {
      .header-menubar {
        border-radius: 0;
        border-left: none;
        border-right: none;
        border-top: none;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .p-menubar .p-menubar-root-list {
        gap: 1rem;
      }
    }

    @media (max-width: 768px) {
      .brand-subtitle {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly router = inject(Router);

  currentUser = signal<AccountInfo | null>(null);
  menuItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.msalAuthService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });

    this.menuItems.set([
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/profile'
      }
    ]);
  }

  logout(): void {
    this.msalAuthService.logout();
  }

  navigateHome(): void {
    this.router.navigate(['/dashboard']);
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
}