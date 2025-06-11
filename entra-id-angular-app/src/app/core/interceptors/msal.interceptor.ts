import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
import { MsalAuthService } from '../services/msal.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class MsalInterceptor implements HttpInterceptor {
  private readonly msalAuthService = inject(MsalAuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🌐 HTTP Request:', req.method, req.url);
    
    // Only add token to API requests
    if (!req.url.startsWith(environment.apiUrl)) {
      console.log('⏭️ Skipping token for non-API request');
      return next.handle(req);
    }

    if (this.msalAuthService.isAuthenticated()) {
      console.log('🔐 Adding token to request...');
      
      return this.msalAuthService.getAccessToken().pipe(
        switchMap(token => {
          console.log('✅ Token added to request header');
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }),
        catchError(error => {
          console.error('❌ Error getting access token:', error);
          return throwError(() => error);
        })
      );
    } else {
      console.warn('⚠️ User not authenticated, sending request without token');
      return next.handle(req);
    }
  }
}