import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';
import { AuthService } from '../services/auth.service';

export const tokenInjectorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const authService = inject(AuthService);

  // Check both services for a token
  // AuthService uses localStorage (Admin/Doctor/Patient/Secretary)
  // Auth uses sessionStorage (Generic/Legacy)
  let token = authService.getToken();
  if (!token) {
    token = auth.getToken();
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
};
