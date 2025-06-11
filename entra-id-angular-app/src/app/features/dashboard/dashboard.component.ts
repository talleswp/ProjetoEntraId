import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';

import { TenantService } from '../../core/services/tenant.service';
import { MsalAuthService } from '../../core/services/msal.service';
import { UserInfo } from '../../core/models/user.model';
import { TenantInfo, GroupInfo, LoginAttempt } from '../../core/models/tenant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    SkeletonModule,
    AvatarModule,
    ProgressSpinnerModule,
    PanelModule
  ],
  template: `
    <div class="dashboard-container p-4">
      <!-- Header -->
      <div class="flex flex-column lg:flex-row justify-content-between align-items-start lg:align-items-center mb-4 gap-3">
        <div>
          <h1 class="text-4xl font-bold text-900 m-0 mb-2">Dashboard</h1>
          <p class="text-600 text-lg m-0">Visão geral do seu ambiente Azure AD</p>
        </div>
        <p-button
          icon="pi pi-refresh"
          label="Atualizar"
          (onClick)="refreshData()"
          [loading]="loading().general"
          severity="secondary"
          size="large"
        ></p-button>
      </div>

      <!-- Welcome Card -->
      <div class="grid mb-4">
        <div class="col-12">
          <p-card styleClass="welcome-card">
            <div class="flex flex-column lg:flex-row align-items-center gap-4">
              <img 
                src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" 
                alt="Azure Brasil Logo" 
                class="welcome-logo"
              />
              <div class="text-center lg:text-left">
                <h2 class="text-2xl font-bold text-900 mb-2">
                  Bem-vindo, {{ currentUser()?.name || 'Usuário' }}!
                </h2>
                <p class="text-600 text-lg m-0">
                  Gerencie e monitore seu ambiente Azure Active Directory
                </p>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid mb-4">
        <!-- Current User Card -->
        <div class="col-12 lg:col-6 xl:col-3">
          <p-card styleClass="stats-card h-full">
            <div class="flex align-items-start justify-content-between">
              <div class="flex-1">
                <span class="block text-500 font-medium mb-2">Usuário Atual</span>
                <div class="text-900 font-bold text-2xl mb-2">
                  {{ currentUser()?.name || 'Carregando...' }}
                </div>
                <div class="text-600 text-sm" *ngIf="currentUserInfo()">
                  <p class="m-0 mb-1">📧 {{ currentUserInfo()?.email }}</p>
                  <p class="m-0 mb-1">💼 {{ currentUserInfo()?.jobTitle || 'N/A' }}</p>
                  <p class="m-0">🏢 {{ currentUserInfo()?.department || 'N/A' }}</p>
                </div>
              </div>
              <div class="stats-icon bg-blue-100">
                <i class="pi pi-user text-blue-500 text-2xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Tenant Info Card -->
        <div class="col-12 lg:col-6 xl:col-3">
          <p-card styleClass="stats-card h-full">
            <div class="flex align-items-start justify-content-between">
              <div class="flex-1">
                <span class="block text-500 font-medium mb-2">Organização</span>
                <div class="text-900 font-bold text-2xl mb-2">
                  {{ tenantInfo()?.displayName || 'Carregando...' }}
                </div>
                <div class="text-600 text-sm" *ngIf="tenantInfo()">
                  <p class="m-0 mb-1">🌐 {{ tenantInfo()?.verifiedDomains?.join(', ') }}</p>
                  <p class="m-0">🆔 {{ currentUser()?.tenantId || 'N/A' }}</p>
                </div>
              </div>
              <div class="stats-icon bg-green-100">
                <i class="pi pi-building text-green-500 text-2xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Users Count Card -->
        <div class="col-12 lg:col-6 xl:col-3">
          <p-card styleClass="stats-card h-full">
            <div class="flex align-items-start justify-content-between">
              <div class="flex-1">
                <span class="block text-500 font-medium mb-2">Total de Usuários</span>
                <div class="text-900 font-bold text-3xl mb-1">
                  {{ tenantInfo()?.totalUsers || 0 }}
                </div>
                <span class="text-green-500 font-medium">
                  <i class="pi pi-arrow-up text-xs"></i>
                  {{ tenantUsers().length }} ativos
                </span>
              </div>
              <div class="stats-icon bg-orange-100">
                <i class="pi pi-users text-orange-500 text-2xl"></i>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Groups Count Card -->
        <div class="col-12 lg:col-6 xl:col-3">
          <p-card styleClass="stats-card h-full">
            <div class="flex align-items-start justify-content-between">
              <div class="flex-1">
                <span class="block text-500 font-medium mb-2">Total de Grupos</span>
                <div class="text-900 font-bold text-3xl mb-1">
                  {{ tenantInfo()?.totalGroups || 0 }}
                </div>
                <span class="text-blue-500 font-medium">
                  <i class="pi pi-arrow-up text-xs"></i>
                  {{ tenantGroups().length }} visíveis
                </span>
              </div>
              <div class="stats-icon bg-purple-100">
                <i class="pi pi-sitemap text-purple-500 text-2xl"></i>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Data Tables -->
      <div class="grid">
        <!-- Recent Login Attempts -->
        <div class="col-12 xl:col-6">
          <p-card>
            <ng-template pTemplate="header">
              <div class="flex align-items-center justify-content-between p-4 pb-0">
                <h3 class="m-0 text-900">🔐 Tentativas de Login Recentes</h3>
              </div>
            </ng-template>
            
            <p-table 
              [value]="recentLogins()" 
              [loading]="loading().logins"
              styleClass="p-datatable-sm"
              [scrollable]="true"
              scrollHeight="400px"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Data/Hora</th>
                  <th>IP</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-login>
                <tr>
                  <td>
                    <div class="flex align-items-center gap-2">
                      <p-avatar 
                        [label]="getInitials(login.userDisplayName)" 
                        size="normal"
                      ></p-avatar>
                      <div>
                        <div class="text-900 font-medium text-sm">{{ login.userDisplayName }}</div>
                        <div class="text-500 text-xs">{{ login.userPrincipalName }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p-tag 
                      [value]="getStatusLabel(login.status)" 
                      [severity]="getStatusSeverity(login.status)"
                    ></p-tag>
                  </td>
                  <td>{{ formatDate(login.createdDateTime) }}</td>
                  <td>
                    <div class="text-900 text-sm">{{ login.ipAddress }}</div>
                    <div class="text-500 text-xs">{{ login.location }}</div>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="4" class="text-center py-4">
                    <p class="text-500 m-0">Nenhuma tentativa de login encontrada</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>

        <!-- Tenant Users -->
        <div class="col-12 xl:col-6">
          <p-card>
            <ng-template pTemplate="header">
              <div class="flex align-items-center justify-content-between p-4 pb-0">
                <h3 class="m-0 text-900">👥 Usuários do Tenant</h3>
              </div>
            </ng-template>
            
            <p-table 
              [value]="tenantUsers()" 
              [loading]="loading().users"
              styleClass="p-datatable-sm"
              [scrollable]="true"
              scrollHeight="400px"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Cargo</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-user>
                <tr>
                  <td>
                    <div class="flex align-items-center gap-2">
                      <p-avatar 
                        [label]="getInitials(user.displayName)" 
                        size="normal"
                      ></p-avatar>
                      <div>
                        <div class="text-900 font-medium">{{ user.displayName }}</div>
                        <div class="text-500 text-sm">{{ user.department || 'N/A' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.jobTitle || 'N/A' }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3" class="text-center py-4">
                    <p class="text-500 m-0">Nenhum usuário encontrado</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>

        <!-- Tenant Groups -->
        <div class="col-12">
          <p-card>
            <ng-template pTemplate="header">
              <div class="flex align-items-center justify-content-between p-4 pb-0">
                <h3 class="m-0 text-900">🏢 Grupos do Tenant</h3>
              </div>
            </ng-template>
            
            <p-table 
              [value]="tenantGroups()" 
              [loading]="loading().groups"
              styleClass="p-datatable-striped"
              [paginator]="true"
              [rows]="10"
              [showCurrentPageReport]="true"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} grupos"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th>Nome do Grupo</th>
                  <th>Descrição</th>
                  <th>Membros</th>
                  <th>Criado em</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-group>
                <tr>
                  <td>
                    <div class="flex align-items-center gap-3">
                      <i class="pi pi-users text-primary"></i>
                      <div>
                        <div class="text-900 font-medium">{{ group.displayName }}</div>
                        <div class="text-500 text-sm">ID: {{ group.id.substring(0, 8) }}...</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ group.description || 'Sem descrição' }}</td>
                  <td>
                    <p-tag 
                      [value]="group.memberCount.toString()" 
                      severity="info"
                      icon="pi pi-users"
                    ></p-tag>
                  </td>
                  <td>{{ formatDate(group.createdDateTime) }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="4" class="text-center py-6">
                    <p class="text-500 m-0">Nenhum grupo encontrado</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background: var(--surface-ground);
      min-height: calc(100vh - 80px);
    }

    .welcome-card {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
      color: white;
    }

    .welcome-card ::ng-deep .p-card-content {
      padding: 2rem;
    }

    .welcome-logo {
      height: 60px;
      width: auto;
      filter: brightness(0) invert(1);
    }

    .stats-card {
      transition: all 0.3s ease;
      border: 1px solid var(--surface-border);
    }

    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stats-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    :host ::ng-deep {
      .p-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
      }

      .p-datatable {
        .p-datatable-tbody > tr:hover {
          background: var(--surface-50);
        }
      }
      
      .p-tag {
        font-weight: 600;
        font-size: 0.75rem;
      }
      
      .p-avatar {
        background: var(--primary-color);
        color: white;
        font-weight: 600;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem !important;
      }
      
      .welcome-logo {
        height: 40px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly tenantService = inject(TenantService);
  private readonly messageService = inject(MessageService);

  currentUser = signal(this.msalAuthService.getCurrentAccount());
  currentUserInfo = signal<UserInfo | null>(null);
  tenantInfo = signal<TenantInfo | null>(null);
  tenantUsers = signal<UserInfo[]>([]);
  tenantGroups = signal<GroupInfo[]>([]);
  recentLogins = signal<LoginAttempt[]>([]);
  
  loading = signal({
    general: false,
    user: false,
    tenant: false,
    users: false,
    groups: false,
    logins: false
  });

  ngOnInit(): void {
    console.log('📊 Dashboard initialized');
    console.log('🔍 Current user:', this.msalAuthService.getCurrentAccount());
    console.log('🔍 Is authenticated:', this.msalAuthService.isAuthenticated());
    
    // Verificar se pode obter token
    this.msalAuthService.getAccessToken().subscribe({
        next: (token) => {
        console.log('✅ Token available for API calls');
        console.log('🎫 Token preview:', token.substring(0, 50) + '...');
        },
        error: (error) => {
        console.error('❌ Cannot get token:', error);
        }
    });
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.update(state => ({ ...state, general: true }));
    
    forkJoin({
      currentUser: this.tenantService.getCurrentUser(),
      tenantInfo: this.tenantService.getTenantInfo(),
      tenantUsers: this.tenantService.getTenantUsers(20),
      tenantGroups: this.tenantService.getTenantGroups(15),
      recentLogins: this.tenantService.getRecentLoginAttempts(20)
    }).subscribe({
      next: (results) => {
        if (results.currentUser.success && results.currentUser.data) {
          this.currentUserInfo.set(results.currentUser.data);
        }

        if (results.tenantInfo.success && results.tenantInfo.data) {
          this.tenantInfo.set(results.tenantInfo.data);
        }

        if (results.tenantUsers.success && results.tenantUsers.data) {
          this.tenantUsers.set(results.tenantUsers.data);
        }

        if (results.tenantGroups.success && results.tenantGroups.data) {
          this.tenantGroups.set(results.tenantGroups.data);
        }

        if (results.recentLogins.success && results.recentLogins.data) {
          this.recentLogins.set(results.recentLogins.data);
        }

        this.loading.set({
          general: false,
          user: false,
          tenant: false,
          users: false,
          groups: false,
          logins: false
        });
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados do dashboard'
        });
        
        this.loading.set({
          general: false,
          user: false,
          tenant: false,
          users: false,
          groups: false,
          logins: false
        });
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
    this.messageService.add({
      severity: 'success',
      summary: 'Atualizado',
      detail: 'Dados do dashboard atualizados com sucesso'
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    if (status === 'Success' || status === '0') return 'success';
    if (status.includes('Error') || status !== '0') return 'danger';
    return 'info';
  }

  getStatusLabel(status: string): string {
    if (status === 'Success' || status === '0') return 'Sucesso';
    if (status.includes('Error')) return 'Erro';
    return status;
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