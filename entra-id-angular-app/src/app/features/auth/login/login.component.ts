import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MsalAuthService } from '../../../core/services/msal.service';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-6">
          <img 
            src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" 
            alt="Azure Brasil Logo" 
            class="logo mb-4"
          />
          <h1 class="text-4xl font-bold text-900 mb-2">EntraId Dashboard</h1>
          <p class="text-600 text-lg">Faça login com sua conta Microsoft</p>
        </div>

        <div class="text-center">
          <p-button
            *ngIf="!loading"
            label="Entrar com Microsoft"
            icon="pi pi-microsoft"
            (onClick)="login()"
            styleClass="p-button-lg w-full"
            [disabled]="loading"
          ></p-button>

          <div *ngIf="loading" class="loading-container">
            <p-progressSpinner 
              styleClass="w-4rem h-4rem" 
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
            ></p-progressSpinner>
            <p class="mt-3 text-600">Redirecionando para Microsoft...</p>
          </div>
        </div>

        <div class="mt-6 p-4 surface-100 border-round">
          <h5 class="mt-0 mb-3 text-900">🔒 Autenticação Segura</h5>
          <ul class="text-sm text-600 pl-0 list-none">
            <li class="mb-2">✅ Login através do Azure Active Directory</li>
            <li class="mb-2">✅ Autenticação Multi-Fator (MFA) suportada</li>
            <li class="mb-2">✅ Tokens gerenciados automaticamente</li>
            <li>✅ Sessão segura e criptografada</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 1rem;
      padding: 3rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .logo {
      height: 80px;
      width: auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 0;
    }

    @media (max-width: 576px) {
      .login-card {
        padding: 2rem;
        margin: 1rem;
      }
      
      .logo {
        height: 60px;
      }
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly destroy$ = new Subject<void>();

  loading = false;

  ngOnInit(): void {
    console.log('🔍 Login component initialized');
    console.log('🔍 Environment:', environment);
    
    if (this.msalAuthService.isAuthenticated()) {
      console.log('✅ User already authenticated, redirecting...');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.msalAuthService.isAuthenticated()) {
          this.loading = false;
          console.log('✅ Login completed successfully');
          this.messageService.add({
            severity: 'success',
            summary: 'Login realizado',
            detail: 'Bem-vindo ao EntraId Dashboard!',
            life: 3000
          });
          this.router.navigate(['/dashboard']);
        }
      });
  }

  login(): void {
    this.loading = true;
    console.log('🚀 Starting login process...');
    
    this.msalAuthService.login().subscribe({
      next: () => {
        console.log('✅ Login initiated successfully');
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ Login error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de login',
          detail: 'Não foi possível fazer login. Tente novamente.',
          life: 5000
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}