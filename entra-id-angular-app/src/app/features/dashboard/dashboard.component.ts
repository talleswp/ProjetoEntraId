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
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

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
    PanelModule,
    DividerModule,
    TooltipModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Visão geral do seu ambiente Azure AD</p>
          </div>
          <div class="header-actions">
            <p-button
              icon="pi pi-refresh"
              label="Atualizar"
              (onClick)="refreshData()"
              [loading]="loading().general"
              severity="secondary"
              size="large"
              styleClass="refresh-btn"
            ></p-button>
          </div>
        </div>
      </div>

      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-content">
            <div class="welcome-text">
              <h2 class="welcome-title">
                Bem-vindo, {{ currentUser()?.name || 'Usuário' }}!
              </h2>
              <p class="welcome-description">
                Gerencie e monitore seu ambiente Azure Active Directory de forma intuitiva
              </p>
            </div>
            <div class="welcome-visual">
              <div class="azure-icon">
                <i class="pi pi-cloud"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Current User Card -->
        <div class="stat-card user-card">
          <div class="stat-header">
            <div class="stat-icon user-icon">
              <i class="pi pi-user"></i>
            </div>
            <span class="stat-label">Usuário Atual</span>
          </div>
          
          <div class="stat-content">
            <div class="user-details" *ngIf="currentUserInfo(); else loadingUser">
              <h3 class="user-name">{{ currentUser()?.name || 'Carregando...' }}</h3>
              <div class="user-meta">
                <div class="meta-item">
                  <i class="pi pi-envelope"></i>
                  <span>{{ currentUserInfo()?.email || 'N/A' }}</span>
                </div>
                <div class="meta-item" *ngIf="currentUserInfo()?.jobTitle">
                  <i class="pi pi-briefcase"></i>
                  <span>{{ currentUserInfo()?.jobTitle }}</span>
                </div>
                <div class="meta-item" *ngIf="currentUserInfo()?.department">
                  <i class="pi pi-building"></i>
                  <span>{{ currentUserInfo()?.department }}</span>
                </div>
              </div>
            </div>
            
            <ng-template #loadingUser>
              <div class="loading-content">
                <p-skeleton width="80%" height="1.5rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton width="60%" height="1rem" styleClass="mb-1"></p-skeleton>
                <p-skeleton width="70%" height="1rem"></p-skeleton>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Organization Card -->
        <div class="stat-card org-card">
          <div class="stat-header">
            <div class="stat-icon org-icon">
              <i class="pi pi-building"></i>
            </div>
            <span class="stat-label">Organização</span>
          </div>
          
          <div class="stat-content">
            <h3 class="stat-value">{{ tenantInfo()?.displayName || 'Carregando...' }}</h3>
            <div class="stat-details" *ngIf="tenantInfo()">
              <div class="detail-item">
                <span class="detail-label">Domínios:</span>
                <span class="detail-value">{{ tenantInfo()?.verifiedDomains?.join(', ') || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tenant ID:</span>
                <span class="detail-value tenant-id">{{ getTenantIdShort() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Count Card -->
        <div class="stat-card users-card">
          <div class="stat-header">
            <div class="stat-icon users-icon">
              <i class="pi pi-users"></i>
            </div>
            <span class="stat-label">Usuários</span>
          </div>
          
          <div class="stat-content">
            <h3 class="stat-number">{{ tenantInfo()?.totalUsers || 0 }}</h3>
            <div class="stat-growth">
              <i class="pi pi-arrow-up growth-icon"></i>
              <span class="growth-text">{{ tenantUsers().length }} ativos</span>
            </div>
          </div>
        </div>

        <!-- Groups Count Card -->
        <div class="stat-card groups-card">
          <div class="stat-header">
            <div class="stat-icon groups-icon">
              <i class="pi pi-sitemap"></i>
            </div>
            <span class="stat-label">Grupos</span>
          </div>
          
          <div class="stat-content">
            <h3 class="stat-number">{{ tenantInfo()?.totalGroups || 0 }}</h3>
            <div class="stat-growth">
              <i class="pi pi-arrow-up growth-icon"></i>
              <span class="growth-text">{{ tenantGroups().length }} visíveis</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Tables Section -->
      <div class="tables-section">
        <!-- Recent Login Attempts -->
        <div class="table-card">
          <div class="table-header">
            <div class="table-title">
              <i class="pi pi-shield"></i>
              <h3>Tentativas de Login Recentes</h3>
            </div>
          </div>
          
          <p-table 
            [value]="recentLogins()" 
            [loading]="loading().logins"
            styleClass="modern-table"
            [scrollable]="true"
            scrollHeight="350px"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} tentativas"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 35%">Usuário</th>
                <th style="width: 15%">Status</th>
                <th style="width: 25%">Data/Hora</th>
                <th style="width: 25%">Localização</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-login>
              <tr>
                <td>
                  <div class="user-cell">
                    <p-avatar 
                      [label]="getInitials(login.userDisplayName)" 
                      size="normal"
                      [style]="{ 'background-color': getUserColor(login.userDisplayName) }"
                    ></p-avatar>
                    <div class="user-details">
                      <div class="user-name">{{ login.userDisplayName }}</div>
                      <div class="user-email">{{ login.userPrincipalName }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <p-tag 
                    [value]="getStatusLabel(login.status)" 
                    [severity]="getStatusSeverity(login.status)"
                    [rounded]="true"
                  ></p-tag>
                </td>
                <td>
                  <div class="datetime-cell">
                    <div class="date">{{ formatDate(login.createdDateTime) }}</div>
                    <div class="time">{{ formatTime(login.createdDateTime) }}</div>
                  </div>
                </td>
                <td>
                  <div class="location-cell">
                    <div class="ip">{{ login.ipAddress }}</div>
                    <div class="location">{{ login.location }}</div>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="empty-message">
                  <div class="empty-content">
                    <i class="pi pi-info-circle"></i>
                    <p>Nenhuma tentativa de login encontrada</p>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Tenant Users -->
        <div class="table-card">
          <div class="table-header">
            <div class="table-title">
              <i class="pi pi-users"></i>
              <h3>Usuários do Tenant</h3>
            </div>
          </div>
          
          <p-table 
            [value]="tenantUsers()" 
            [loading]="loading().users"
            styleClass="modern-table"
            [scrollable]="true"
            scrollHeight="350px"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 40%">Nome</th>
                <th style="width: 35%">Email</th>
                <th style="width: 25%">Cargo</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-user>
              <tr>
                <td>
                  <div class="user-cell">
                    <p-avatar 
                      [label]="getInitials(user.displayName)" 
                      size="normal"
                      [style]="{ 'background-color': getUserColor(user.displayName) }"
                    ></p-avatar>
                    <div class="user-details">
                      <div class="user-name">{{ user.displayName }}</div>
                      <div class="user-department">{{ user.department || 'Sem departamento' }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user.jobTitle || 'N/A' }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="3" class="empty-message">
                  <div class="empty-content">
                    <i class="pi pi-info-circle"></i>
                    <p>Nenhum usuário encontrado</p>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <!-- Groups Table (Full Width) -->
      <div class="full-width-section">
        <div class="table-card">
          <div class="table-header">
            <div class="table-title">
              <i class="pi pi-sitemap"></i>
              <h3>Grupos do Tenant</h3>
            </div>
          </div>
          
          <p-table 
            [value]="tenantGroups()" 
            [loading]="loading().groups"
            styleClass="modern-table"
            [paginator]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} grupos"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 30%">Nome do Grupo</th>
                <th style="width: 40%">Descrição</th>
                <th style="width: 15%">Membros</th>
                <th style="width: 15%">Criado em</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-group>
              <tr>
                <td>
                  <div class="group-cell">
                    <div class="group-icon">
                      <i class="pi pi-users"></i>
                    </div>
                    <div class="group-details">
                      <div class="group-name">{{ group.displayName }}</div>
                      <div class="group-id">{{ group.id.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>
                <td>{{ group.description || 'Sem descrição' }}</td>
                <td>
                  <p-tag 
                    [value]="group.memberCount.toString()" 
                    severity="info"
                    icon="pi pi-users"
                    [rounded]="true"
                  ></p-tag>
                </td>
                <td>{{ formatDate(group.createdDateTime) }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="empty-message">
                  <div class="empty-content">
                    <i class="pi pi-info-circle"></i>
                    <p>Nenhum grupo encontrado</p>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background: var(--surface-ground);
      min-height: calc(100vh - 80px);
      padding: 2rem;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .header-info {
      flex: 1;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: var(--text-color-secondary);
      margin: 0;
    }

    .header-actions {
      flex-shrink: 0;
    }

    /* Welcome Section */
    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-card {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
      border-radius: 16px;
      padding: 2rem;
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .welcome-text {
      flex: 1;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .welcome-description {
      font-size: 1.1rem;
      margin: 0;
      opacity: 0.9;
    }

    .welcome-visual {
      flex-shrink: 0;
    }

    .azure-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--surface-border);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
    }

    .user-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .org-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .users-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .groups-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .stat-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-content {
      padding: 0.5rem 0;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
    }

    .stat-growth {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .growth-icon {
      color: var(--green-500);
      font-size: 0.9rem;
    }

    .growth-text {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* User Card Specific */
    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }

    .meta-item i {
      color: var(--primary-color);
      font-size: 0.8rem;
    }

    /* Organization Card Specific */
    .stat-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 0.9rem;
      color: var(--text-color);
      font-weight: 500;
    }

    .tenant-id {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      background: var(--surface-100);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      border: 1px solid var(--surface-300);
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    /* Tables Section */
    .tables-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .full-width-section {
      width: 100%;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--surface-border);
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
      background: var(--surface-50);
    }

    .table-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .table-title i {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .table-title h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
    }

    /* Table Cells */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .user-email, .user-department {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }

    .datetime-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .date {
      font-weight: 500;
      color: var(--text-color);
      font-size: 0.85rem;
    }

    .time {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .location-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ip {
      font-family: 'Courier New', monospace;
      font-size: 0.8rem;
      color: var(--text-color);
      font-weight: 500;
    }

    .location {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .group-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .group-icon {
      width: 32px;
      height: 32px;
      background: var(--primary-50);
      color: var(--primary-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .group-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .group-name {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.9rem;
    }

    .group-id {
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .empty-message {
      text-align: center;
      padding: 3rem 1rem;
    }

    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .empty-content i {
      font-size: 2rem;
      color: var(--text-color-secondary);
    }

    .empty-content p {
      margin: 0;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    /* Custom PrimeNG Overrides */
    :host ::ng-deep {
      .refresh-btn {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-600)) !important;
        border: none !important;
        border-radius: 10px !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3) !important;
      }

      .refresh-btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.4) !important;
      }

      .modern-table {
        .p-datatable-header {
          background: var(--surface-50) !important;
          border-bottom: 1px solid var(--surface-border) !important;
          font-weight: 600 !important;
        }

        .p-datatable-thead > tr > th {
          background: var(--surface-50) !important;
          border-bottom: 1px solid var(--surface-border) !important;
          font-weight: 600 !important;
          color: var(--text-color) !important;
          padding: 1rem !important;
        }

        .p-datatable-tbody > tr {
          transition: background-color 0.2s ease !important;
        }

        .p-datatable-tbody > tr:hover {
          background: var(--surface-50) !important;
        }

        .p-datatable-tbody > tr > td {
          padding: 1rem !important;
          border-bottom: 1px solid var(--surface-100) !important;
        }
      }

      .p-tag {
        font-weight: 600 !important;
        font-size: 0.75rem !important;
        padding: 0.4rem 0.8rem !important;
      }

      .p-avatar {
        font-weight: 600 !important;
        color: white !important;
      }

      .p-paginator {
        background: var(--surface-50) !important;
        border-top: 1px solid var(--surface-border) !important;
        padding: 1rem !important;
      }
    }

    /* Responsive Design */
    @media (max-width: 1400px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .dashboard-container {
        padding: 1.5rem;
      }

      .tables-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .welcome-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .welcome-card {
        padding: 1.5rem;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-number {
        font-size: 2rem;
      }

      .azure-icon {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-container {
        padding: 0.5rem;
      }

      .welcome-card {
        padding: 1rem;
      }

      .stat-card {
        padding: 0.75rem;
      }

      .table-header {
        padding: 1rem;
      }

      .user-cell {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      :host ::ng-deep {
        .modern-table .p-datatable-tbody > tr > td {
          padding: 0.75rem !important;
        }
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

  getTenantIdShort(): string {
    const tenantId = this.currentUser()?.tenantId || this.tenantInfo()?.tenantId;
    return tenantId ? `${tenantId.substring(0, 8)}...` : 'N/A';
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatTime(date: Date | string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('pt-BR', { 
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

  getUserColor(name: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const index = name.length % colors.length;
    return colors[index];
  }
}