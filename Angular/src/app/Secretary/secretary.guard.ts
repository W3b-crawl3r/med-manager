import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const secretaryGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isSecretary() && authService.getToken()) {
    return true; // ✅ accès autorisé
  }

  // ❌ accès refusé
  router.navigate(['/secretary-login']);
  return false;
};
