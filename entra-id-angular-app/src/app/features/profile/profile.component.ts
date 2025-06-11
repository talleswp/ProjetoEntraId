import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { MsalAuthService } from '../../core/services/msal.service';
import { TenantService } from '../../core/services/tenant.service';
import { UserInfo } from '../../core/models/user.model';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    AvatarModule, 
    TagModule, 
    DividerModule, 
    SkeletonModule
  ],
  template: `
    <div class="profile-container p-4">
      <div class="flex align-items-center mb-4">
        <h1 class="text-3xl font-bold text-900 m-0">Meu Perfil</h1>
      </div>

      <div class="grid">
        <!-- Profile Card -->
        <div class="col-12 lg:col-8">
          <p-card>
            <ng-template pTemplate="header">
              <div class="profile-header">
                <div class="flex flex-column lg:flex-row align-items-center gap-4 p-4">
                  <p-avatar 
                    [label]="getInitials(msalUser()?.name || '')"
                    size="xlarge"
                    styleClass="profile-avatar"
                  ></p-avatar>
                  <div class="text-center lg:text-left">
                    <h2 class="text-2xl font-bold text-900 mb-1">
                      {{ userInfo()?.displayName || msalUser()?.name || 'Carregando...' }}
                    </h2>
                    <p class="text-600 text-lg mb-2">
                      {{ userInfo()?.email || msalUser()?.username || 'Carregando...' }}
                    </p>
                    <p-tag 
                      value="Usuário Ativo" 
                      severity="success" 
                      icon="pi pi-check-circle"
                    ></p-tag>
                  </div>
                </div>
              </div>
            </ng-template>

            <div class="profile-content">
              <h3 class="text-xl font-semibold text-900 mb-3">Informações Pessoais</h3>
              
              <div class="grid" *ngIf="!loading(); else loadingSkeleton">
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">Nome Completo</label>
                    <div class="field-value">{{ userInfo()?.displayName || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">Email</label>
                    <div class="field-value">{{ userInfo()?.email || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">Cargo</label>
                    <div class="field-value">{{ userInfo()?.jobTitle || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">Departamento</label>
                    <div class="field-value">{{ userInfo()?.department || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="col-12">
                  <p-divider></p-divider>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">ID do Usuário</label>
                    <div class="field-value font-mono">{{ userInfo()?.id || 'N/A' }}</div>
                  </div>
                </div>
                
                <div class="col-12 md:col-6">
                  <div class="field-group mb-4">
                    <label class="field-label">Tenant ID</label>
                    <div class="field-value font-mono">{{ userInfo()?.tenantId || msalUser()?.tenantId || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <ng-template #loadingSkeleton>
                <div class="grid">
                  <div class="col-12 md:col-6" *ngFor="let item of [1,2,3,4,5,6]">
                    <div class="field-group mb-4">
                      <p-skeleton width="100px" height="1rem" styleClass="mb-2"></p-skeleton>
                      <p-skeleton width="200px" height="1.2rem"></p-skeleton>
                    </div>
                  </div>
                </div>
              </ng-template>
            </div>
          </p-card>
        </div>

        <!-- Actions Card -->
        <div class="col-12 lg:col-4">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-4 pb-0">
                <h3 class="text-xl font-semibold text-900 m-0">Ações</h3>
              </div>
            </ng-template>

            <div class="flex flex-column gap-3">
              <p-button
                label="Atualizar Informações"
                icon="pi pi-refresh"
                (onClick)="refreshProfile()"
                [loading]="loading()"
                styleClass="w-full"
                severity="primary"
              ></p-button>
              
              <p-divider></p-divider>
              
              <p-button
                label="Fazer Logout"
                icon="pi pi-sign-out"
                (onClick)="logout()"
                styleClass="w-full"
                severity="danger"
                [outlined]="true"
              ></p-button>
            </div>
          </p-card>

          <!-- Quick Info Card -->
          <p-card styleClass="mt-3">
            <ng-template pTemplate="header">
              <div class="p-4 pb-0">
                <h3 class="text-xl font-semibold text-900 m-0">Informações Rápidas</h3>
              </div>
            </ng-template>

            <div class="flex flex-column gap-3">
              <div class="flex align-items-center justify-content-between">
                <span class="text-600">Status da Conta</span>
                <p-tag value="Ativa" severity="success" icon="pi pi-check"></p-tag>
              </div>
              
              <div class="flex align-items-center justify-content-between">
                <span class="text-600">MFA Habilitado</span>
                <p-tag value="Sim" severity="info" icon="pi pi-shield"></p-tag>
              </div>
              
              <div class="flex align-items-center justify-content-between">
                <span class="text-600">Tipo de Conta</span>
                <p-tag value="Corporativa" severity="warning" icon="pi pi-building"></p-tag>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      background: var(--surface-ground);
      min-height: calc(100vh - 80px);
    }

    .profile-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .profile-avatar {
      background: rgba(255, 255, 255, 0.2) !important;
      color: white !important;
      font-size: 2rem !important;
      font-weight: 600;
      border: 3px solid rgba(255, 255, 255, 0.3);
    }

    .profile-content {
      padding: 1.5rem;
    }

    .field-group {
      .field-label {
        display: block;
        font-weight: 600;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .field-value {
        font-size: 1rem;
        color: var(--text-color);
        font-weight: 500;
        
        &.font-mono {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          background: var(--surface-100);
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--surface-300);
        }
      }
    }

    :host ::ng-deep {
      .p-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
      }

      .p-tag {
        font-weight: 600;
      }

      .p-button {
        font-weight: 600;
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem !important;
      }
      
      .profile-content {
        padding: 1rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly tenantService = inject(TenantService);
  private readonly messageService = inject(MessageService);

  msalUser = signal<AccountInfo | null>(null);
  userInfo = signal<UserInfo | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.msalUser.set(this.msalAuthService.getCurrentAccount());
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.loading.set(true);
    
    this.tenantService.getCurrentUser().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.userInfo.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar informações do perfil'
        });
        this.loading.set(false);
      }
    });
  }

  refreshProfile(): void {
    this.loadUserProfile();
    this.messageService.add({
      severity: 'success',
      summary: 'Atualizado',
      detail: 'Informações do perfil atualizadas'
    });
  }

  logout(): void {
    this.msalAuthService.logout();
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