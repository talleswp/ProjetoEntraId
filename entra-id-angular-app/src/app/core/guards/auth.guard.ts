import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { MsalAuthService } from '../services/msal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const msalAuthService = inject(MsalAuthService);
  const router = inject(Router);

  return msalAuthService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};