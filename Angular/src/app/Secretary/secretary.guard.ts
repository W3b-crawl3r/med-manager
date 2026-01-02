import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const secretaryGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isSecretary()) {
    return true; // ✅ accès autorisé
  }

  // ❌ accès refusé
  router.navigate(['/login']);
  return false;
};
