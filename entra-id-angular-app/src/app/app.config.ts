import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// MSAL
import { 
  MsalModule, 
  MsalService, 
  MsalGuard, 
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import { 
  IPublicClientApplication, 
  PublicClientApplication, 
  InteractionType,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';

// PrimeNG
import { MessageService, ConfirmationService } from 'primeng/api';

// App
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MsalInterceptor } from './core/interceptors/msal.interceptor';

export function MSALInstanceFactory(): IPublicClientApplication {
  const msalInstance = new PublicClientApplication({
    auth: {
      clientId: environment.msalConfig.auth.clientId,
      authority: environment.msalConfig.auth.authority,
      redirectUri: environment.msalConfig.auth.redirectUri,
      postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
      navigateToLoginRequestUrl: false // IMPORTANTE para SPA
    },
    cache: {
      cacheLocation: environment.msalConfig.cache.cacheLocation as BrowserCacheLocation,
      storeAuthStateInCookie: environment.msalConfig.cache.storeAuthStateInCookie
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          switch (level) {
            case LogLevel.Error:
              console.error('MSAL Error:', message);
              break;
            case LogLevel.Info:
              console.info('MSAL Info:', message);
              break;
            case LogLevel.Verbose:
              console.log('MSAL Verbose:', message);
              break;
            case LogLevel.Warning:
              console.warn('MSAL Warning:', message);
              break;
          }
        },
        logLevel: LogLevel.Info, // ⚠️ Reduzir logs em produção
        piiLoggingEnabled: false
      },
      allowNativeBroker: false, // ⚠️ Desabilitar native broker
      windowHashTimeout: 9000,
      iframeHashTimeout: 9000
    }
  });

  return msalInstance;
}

// MSAL Guard Configuration
import { MsalGuardConfiguration } from '@azure/msal-angular';

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup as const,
    authRequest: {
      scopes: environment.apiConfig.scopes
    },
    loginFailedRoute: '/auth/login' // ⚠️ Rota de fallback
  };
}

// MSAL Interceptor Configuration
import { MsalInterceptorConfiguration } from '@azure/msal-angular';

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.apiConfig.uri, environment.apiConfig.scopes);

  return {
    interactionType: InteractionType.Popup as InteractionType.Popup,
    protectedResourceMap
  };
}

export const msalInstance = MSALInstanceFactory();

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(
      BrowserModule,
      MsalModule.forRoot(
        msalInstance,
        MSALGuardConfigFactory(),
        MSALInterceptorConfigFactory()
      )
    ),
    
    // MSAL Services
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    
    // HTTP Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    
    // PrimeNG Services
    MessageService,
    ConfirmationService
  ]
};