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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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