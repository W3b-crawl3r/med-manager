import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    return true;
  }
  
  return router.navigate(['/login']);
};
