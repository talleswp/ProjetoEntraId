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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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