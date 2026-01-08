import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

export const serverLogOutInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const authService2 = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        authService.logout();
        authService2.logout();
      }
      return throwError(() => error);
    })
  );
};
