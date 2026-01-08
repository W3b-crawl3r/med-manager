import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';
import { AuthService } from '../services/auth.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() || authService.getToken()) {
    return true;
  }

  return router.navigate(['/login']);
};
