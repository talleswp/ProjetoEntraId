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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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