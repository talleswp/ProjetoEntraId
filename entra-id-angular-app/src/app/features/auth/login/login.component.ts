import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MsalAuthService } from '../../../core/services/msal.service';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    CardModule, 
    ProgressSpinnerModule,
    RippleModule,
    TooltipModule
  ],
  template: `
    <div class="login-container">
      <!-- Background com gradiente animado -->
      <div class="animated-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <!-- Card de Login -->
      <div class="login-card-container">
        <div class="login-card">
          <!-- Header com logo -->
          <div class="login-header">
            <div class="logo-container">
              <img 
                src="https://www.azurebrasil.cloud/content/images/2025/01/Group-310.svg" 
                alt="Azure Brasil Logo" 
                class="logo"
              />
              <div class="brand-info">
                <h1 class="brand-title">EntraId Dashboard</h1>
                <p class="brand-subtitle">Azure Active Directory Management</p>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">Autenticação Segura</span>
          </div>

          <!-- Login Button -->
          <div class="login-action">
            <p-button
              *ngIf="!loading"
              label="Entrar com Microsoft"
              icon="pi pi-microsoft"
              (onClick)="login()"
              styleClass="login-button w-full"
              [loading]="loading"
              size="large"
              pRipple
            ></p-button>

            <!-- Loading State -->
            <div *ngIf="loading" class="loading-state">
              <p-progressSpinner 
                styleClass="custom-spinner" 
                strokeWidth="3"
                fill="transparent"
                animationDuration=".8s"
              ></p-progressSpinner>
              <div class="loading-text">
                <h4>Conectando com Microsoft...</h4>
                <p>Aguarde enquanto redirecionamos você para a autenticação segura</p>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="security-info">
            <div class="security-header">
              <i class="pi pi-shield"></i>
              <h3>Segurança Garantida</h3>
            </div>
            
            <div class="security-features">
              <div class="feature-item">
                <i class="pi pi-check-circle"></i>
                <span>Azure Active Directory</span>
              </div>
              <div class="feature-item">
                <i class="pi pi-check-circle"></i>
                <span>Multi-Factor Authentication</span>
              </div>
              <div class="feature-item">
                <i class="pi pi-check-circle"></i>
                <span>Tokens Criptografados</span>
              </div>
              <div class="feature-item">
                <i class="pi pi-check-circle"></i>
                <span>Sessão Segura</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="login-footer">
            <p class="footer-text">
              Ao continuar, você concorda com os 
              <a href="#" class="footer-link">Termos de Uso</a> e 
              <a href="#" class="footer-link">Política de Privacidade</a>
            </p>
          </div>
        </div>

        <!-- Side Info (Desktop only) -->
        <div class="side-info">
          <div class="side-content">
            <h2>Gerencie seu Azure AD</h2>
            <p>Acesse informações de usuários, grupos e auditoria do seu tenant Azure Active Directory de forma simples e segura.</p>
            
            <div class="features-list">
              <div class="feature">
                <i class="pi pi-users"></i>
                <div>
                  <h4>Gerenciamento de Usuários</h4>
                  <p>Visualize e gerencie usuários do seu tenant</p>
                </div>
              </div>
              <div class="feature">
                <i class="pi pi-sitemap"></i>
                <div>
                  <h4>Grupos e Permissões</h4>
                  <p>Organize e controle acesso através de grupos</p>
                </div>
              </div>
              <div class="feature">
                <i class="pi pi-chart-line"></i>
                <div>
                  <h4>Relatórios e Auditoria</h4>
                  <p>Monitore atividades e tentativas de login</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 1rem;
      overflow: hidden;
    }

    /* Background Animado */
    .animated-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      z-index: -1;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.7;
      animation: float 6s ease-in-out infinite;
    }

    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%);
      bottom: 20%;
      left: 50%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    /* Card Container */
    .login-card-container {
      display: flex;
      max-width: 1200px;
      width: 100%;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }

    /* Login Card */
    .login-card {
      flex: 1;
      max-width: 500px;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .login-header {
      text-align: center;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      height: 80px;
      width: auto;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }

    .brand-info {
      text-align: center;
    }

    .brand-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 1rem;
      color: var(--text-color-secondary);
      margin: 0.5rem 0 0 0;
      font-weight: 500;
    }

    /* Divider */
    .divider {
      position: relative;
      text-align: center;
      margin: 1rem 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--surface-border), transparent);
    }

    .divider-text {
      background: white;
      padding: 0 1.5rem;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      font-weight: 600;
    }

    /* Login Action */
    .login-action {
      margin: 1rem 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem 0;
    }

    .loading-text {
      text-align: center;
    }

    .loading-text h4 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
      font-weight: 600;
    }

    .loading-text p {
      margin: 0;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    /* Security Info */
    .security-info {
      background: var(--surface-50);
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid var(--primary-color);
    }

    .security-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .security-header i {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .security-header h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.1rem;
      font-weight: 600;
    }

    .security-features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .feature-item i {
      color: var(--green-500);
      font-size: 0.8rem;
    }

    /* Footer */
    .login-footer {
      text-align: center;
      margin-top: auto;
    }

    .footer-text {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      margin: 0;
      line-height: 1.5;
    }

    .footer-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    /* Side Info (Desktop) */
    .side-info {
      flex: 1;
      background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
      color: white;
      padding: 3rem;
      display: none;
    }

    .side-content h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
      font-weight: 700;
    }

    .side-content > p {
      font-size: 1.1rem;
      margin: 0 0 3rem 0;
      opacity: 0.9;
      line-height: 1.6;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .feature {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .feature i {
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 0.25rem;
    }

    .feature h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .feature p {
      margin: 0;
      opacity: 0.8;
      line-height: 1.5;
    }

    /* Custom Button Styles */
    :host ::ng-deep {
      .login-button {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-600)) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 1rem 2rem !important;
        font-size: 1.1rem !important;
        font-weight: 600 !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.3s ease !important;
      }

      .login-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2) !important;
      }

      .login-button:active {
        transform: translateY(0) !important;
      }

      .custom-spinner .p-progressspinner-circle {
        stroke: var(--primary-color) !important;
        stroke-width: 3 !important;
      }
    }

    /* Responsive Design */
    @media (min-width: 1024px) {
      .side-info {
        display: block;
      }
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .logo {
        height: 60px;
      }

      .security-features {
        grid-template-columns: 1fr;
      }

      .login-card-container {
        margin: 1rem;
        border-radius: 16px;
      }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }

      .brand-title {
        font-size: 1.75rem;
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