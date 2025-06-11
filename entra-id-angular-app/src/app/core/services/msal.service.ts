import { Injectable, inject, OnDestroy } from '@angular/core';
import { 
  MsalService as NgMsalService, 
  MsalBroadcastService,
  MSAL_GUARD_CONFIG
} from '@azure/msal-angular';
import { 
  AccountInfo, 
  InteractionStatus, 
  PopupRequest, 
  SilentRequest,
  EventType,
  EventMessage,
  AuthenticationResult
} from '@azure/msal-browser';
import { BehaviorSubject, Observable, filter, takeUntil, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MsalAuthService implements OnDestroy {
  private readonly msalService = inject(NgMsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly msalGuardConfig = inject(MSAL_GUARD_CONFIG);
  
  private currentUserSubject = new BehaviorSubject<AccountInfo | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    console.log('🔧 Inicializando MSAL Auth Service...');

    // ⚠️ AGUARDAR INICIALIZAÇÃO DO MSAL
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('✅ MSAL initialization complete');
        this.setLoginDisplay();
      });

    // ⚠️ LISTENER PARA EVENTOS MSAL
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        console.log('✅ Login success event received');
        this.setLoginDisplay();
      });

    // Verificar estado inicial
    this.setLoginDisplay();
  }

  private setLoginDisplay(): void {
    try {
      const accounts = this.msalService.instance.getAllAccounts();
      console.log('🔍 Available accounts:', accounts.length);
      
      if (accounts.length > 0) {
        const account = accounts[0];
        
        // ⚠️ DEFINIR CONTA ATIVA
        this.msalService.instance.setActiveAccount(account);
        
        this.currentUserSubject.next(account);
        this.isAuthenticatedSubject.next(true);
        
        console.log('✅ User authenticated:', {
          username: account.username,
          tenantId: account.tenantId,
          environment: account.environment
        });
      } else {
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        console.log('❌ No authenticated user found');
      }
    } catch (error) {
      console.error('❌ Error in setLoginDisplay:', error);
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }

  login(): Observable<AuthenticationResult> {
    console.log('🚀 Starting MSAL login...');
    
    const request: PopupRequest = {
      scopes: environment.apiConfig.scopes,
      prompt: 'select_account'
    };
    
    console.log('📋 Login request:', {
      scopes: request.scopes,
      authority: environment.msalConfig.auth.authority,
      clientId: environment.msalConfig.auth.clientId
    });

    return new Observable<AuthenticationResult>(observer => {
      this.msalService.loginPopup(request).subscribe({
        next: (result) => {
          console.log('✅ Login successful:', result);
          
          // ⚠️ DEFINIR CONTA ATIVA APÓS LOGIN
          if (result.account) {
            this.msalService.instance.setActiveAccount(result.account);
          }
          
          this.setLoginDisplay();
          observer.next(result);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Login error:', error);
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    console.log('🚪 Starting logout...');
    
    this.msalService.logoutPopup({
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      mainWindowRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri
    }).subscribe({
      next: () => {
        console.log('✅ Logout successful');
        this.setLoginDisplay();
      },
      error: (error) => {
        console.error('❌ Logout error:', error);
      }
    });
  }

  getAccessToken(): Observable<string> {
    return new Observable(observer => {
      const account = this.msalService.instance.getActiveAccount();
      
      if (!account) {
        console.error('❌ No active account for token acquisition');
        observer.error('No active account found');
        return;
      }

      const request: SilentRequest = {
        scopes: environment.apiConfig.scopes,
        account: account,
        forceRefresh: false
      };

      console.log('🎫 Requesting access token for:', {
        account: account.username,
        scopes: request.scopes
      });

      this.msalService.acquireTokenSilent(request).subscribe({
        next: (result) => {
          console.log('✅ Token acquired successfully');
          console.log('🎫 Token info:', {
            scopes: result.scopes,
            expiresOn: result.expiresOn,
            tokenType: result.tokenType
          });
          observer.next(result.accessToken);
          observer.complete();
        },
        error: (error) => {
          console.warn('⚠️ Silent token acquisition failed, trying interactive:', error);
          
          // ⚠️ FALLBACK PARA POPUP
          this.msalService.acquireTokenPopup(request).subscribe({
            next: (result) => {
              console.log('✅ Token acquired via popup');
              observer.next(result.accessToken);
              observer.complete();
            },
            error: (popupError) => {
              console.error('❌ Token acquisition failed completely:', popupError);
              observer.error(popupError);
            }
          });
        }
      });
    });
  }

  getCurrentAccount(): AccountInfo | null {
    return this.msalService.instance.getActiveAccount();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}